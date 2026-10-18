import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from "ai";
import OpenAI from "openai";

import { chatConfig } from "@/config/chat";
import { estimateChatCostUsd } from "@/lib/chat/budget";
import { getDailySpendUsd, isDailyBudgetExceeded, recordDailySpend } from "@/lib/chat/daily-spend";
import { hashIp, getClientIp } from "@/lib/chat/ip";
import { logChatRequest } from "@/lib/chat/logging";
import { buildSystemPrompt } from "@/lib/chat/prompt";
import { cacheKeyForQuestion, getRedis } from "@/lib/chat/redis";
import { checkIpRateLimit } from "@/lib/chat/rate-limit";
import { retrieveTopChunks } from "@/lib/chat/retrieval";
import { chatRequestSchema } from "@/lib/chat/schema";
import { getServerEnv } from "@/lib/env";

type CachedChatPayload = {
  text: string;
  sources: { source: string; similarity: number }[];
  promptTokens: number;
  completionTokens: number;
  estimatedCostUsd: number;
};

function normalizeQuestion(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

function extractLatestUserMessage(messages: UIMessage[]): string | null {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i];
    if (message.role !== "user") continue;
    const text = message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("");
    if (text.trim()) return text.trim();
  }
  return null;
}

function jsonError(message: string, status: number, headers?: Record<string, string>) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

export async function POST(request: Request) {
  const started = Date.now();
  let ipHash: string | null = null;
  let userMessage = "";

  try {
    const env = getServerEnv();
    const ip = getClientIp(request);
    ipHash = hashIp(ip);

    const rate = await checkIpRateLimit(ip);
    if (rate.blocked) {
      await logChatRequest({
        ipHash,
        userMessage: "(rate limited before parse)",
        latencyMs: Date.now() - started,
        promptTokens: 0,
        completionTokens: 0,
        estimatedCostUsd: 0,
        cached: false,
        status: "rate_limited",
      });
      return jsonError(chatConfig.rateLimitMessage, 429, {
        ...rate.headers,
        "Retry-After": String(rate.retryAfterSeconds),
      });
    }

    if (await isDailyBudgetExceeded()) {
      await logChatRequest({
        ipHash,
        userMessage: "(budget exceeded before parse)",
        latencyMs: Date.now() - started,
        promptTokens: 0,
        completionTokens: 0,
        estimatedCostUsd: 0,
        cached: false,
        status: "budget_exceeded",
      });
      return jsonError(chatConfig.budgetKillSwitchMessage, 503);
    }

    const body = await request.json();
    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Invalid request body.", 400);
    }

    const uiMessages = parsed.data.messages as unknown as UIMessage[];
    const latest = extractLatestUserMessage(uiMessages);
    if (!latest) {
      return jsonError("Missing user message.", 400);
    }

    userMessage = latest;

    if (latest.length > env.CHAT_MAX_INPUT_CHARS) {
      await logChatRequest({
        ipHash,
        userMessage: latest.slice(0, 200),
        latencyMs: Date.now() - started,
        promptTokens: 0,
        completionTokens: 0,
        estimatedCostUsd: 0,
        cached: false,
        status: "validation_error",
      });
      return jsonError(`Message exceeds ${env.CHAT_MAX_INPUT_CHARS} characters.`, 400);
    }

    const moderationClient = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    const moderation = await moderationClient.moderations.create({ input: latest });
    if (moderation.results[0]?.flagged) {
      await logChatRequest({
        ipHash,
        userMessage: latest,
        latencyMs: Date.now() - started,
        promptTokens: 0,
        completionTokens: 0,
        estimatedCostUsd: 0,
        cached: false,
        status: "moderation_blocked",
      });
      return jsonError("Your message could not be processed.", 400);
    }

    const normalized = normalizeQuestion(latest);
    const redis = getRedis();
    const cached = await redis.get<CachedChatPayload>(cacheKeyForQuestion(normalized));

    if (cached) {
      const latencyMs = Date.now() - started;
      await logChatRequest({
        ipHash,
        userMessage: latest,
        latencyMs,
        promptTokens: cached.promptTokens,
        completionTokens: cached.completionTokens,
        estimatedCostUsd: cached.estimatedCostUsd,
        cached: true,
        status: "cached",
      });

      const stream = createUIMessageStream({
        execute: ({ writer }) => {
          writer.write({
            type: "data-sources",
            id: "sources",
            data: { sources: cached.sources },
          });
          writer.write({
            type: "data-stats",
            id: "stats",
            data: {
              latencyMs,
              promptTokens: cached.promptTokens,
              completionTokens: cached.completionTokens,
              estimatedCostUsd: cached.estimatedCostUsd,
              cached: true,
            },
          });
          writer.write({
            type: "text-start",
            id: "cached-text",
          });
          writer.write({
            type: "text-delta",
            id: "cached-text",
            delta: cached.text,
          });
          writer.write({
            type: "text-end",
            id: "cached-text",
          });
        },
      });

      return createUIMessageStreamResponse({ stream, headers: rate.headers });
    }

    const chunks = await retrieveTopChunks(latest);
    const sources = chunks.map((chunk) => ({
      source: chunk.source,
      similarity: chunk.similarity,
    }));

    const system = buildSystemPrompt(chunks);
    const modelMessages = await convertToModelMessages(uiMessages);

    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        writer.write({
          type: "data-sources",
          id: "sources",
          data: { sources },
        });

        const result = streamText({
          model: openai("gpt-4o-mini"),
          system,
          messages: modelMessages,
          maxOutputTokens: env.CHAT_MAX_OUTPUT_TOKENS,
          onFinish: async ({ usage, text }) => {
            const latencyMs = Date.now() - started;
            const promptTokens = usage.inputTokens ?? 0;
            const completionTokens = usage.outputTokens ?? 0;
            const estimatedCostUsd = estimateChatCostUsd({ promptTokens, completionTokens });

            const spent = await getDailySpendUsd();
            if (spent + estimatedCostUsd > env.CHAT_DAILY_BUDGET_USD) {
              await logChatRequest({
                ipHash,
                userMessage: latest,
                latencyMs,
                promptTokens,
                completionTokens,
                estimatedCostUsd,
                cached: false,
                status: "budget_exceeded",
              });
              return;
            }

            await recordDailySpend(estimatedCostUsd);
            await logChatRequest({
              ipHash,
              userMessage: latest,
              latencyMs,
              promptTokens,
              completionTokens,
              estimatedCostUsd,
              cached: false,
              status: "ok",
            });

            const payload: CachedChatPayload = {
              text,
              sources,
              promptTokens,
              completionTokens,
              estimatedCostUsd,
            };
            await redis.set(cacheKeyForQuestion(normalized), payload, {
              ex: env.CHAT_CACHE_TTL_SECONDS,
            });

            writer.write({
              type: "data-stats",
              id: "stats",
              data: {
                latencyMs,
                promptTokens,
                completionTokens,
                estimatedCostUsd,
                cached: false,
              },
            });
          },
        });

        writer.merge(result.toUIMessageStream());
      },
      onError: (error) => (error instanceof Error ? error.message : "Chat stream error"),
    });

    return createUIMessageStreamResponse({ stream, headers: rate.headers });
  } catch (error) {
    console.error("[chat]", error);
    await logChatRequest({
      ipHash,
      userMessage: userMessage || "(error before message)",
      latencyMs: Date.now() - started,
      promptTokens: 0,
      completionTokens: 0,
      estimatedCostUsd: 0,
      cached: false,
      status: "error",
    }).catch(() => undefined);

    return jsonError("Something went wrong. Please try again.", 500);
  }
}
