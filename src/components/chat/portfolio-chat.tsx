"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AlertCircle, Copy, Loader2, Send } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { chatConfig } from "@/config/chat";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type ChatSource = { source: string; similarity: number };

export type ChatResponseStats = {
  latencyMs: number;
  promptTokens: number;
  completionTokens: number;
  estimatedCostUsd: number;
  cached?: boolean;
};

type PortfolioChatProps = {
  className?: string;
  showSuggestedQuestions?: boolean;
  onStatsUpdate?: (stats: ChatResponseStats | null) => void;
  onSourcesUpdate?: (sources: ChatSource[]) => void;
};

function getMessageText(parts: { type: string; text?: string }[]): string {
  return parts
    .filter((part) => part.type === "text")
    .map((part) => part.text ?? "")
    .join("");
}

function extractSourcesFromParts(parts: { type: string; data?: unknown }[]): ChatSource[] {
  for (const part of parts) {
    if (part.type === "data-sources" && part.data && typeof part.data === "object") {
      const data = part.data as { sources?: ChatSource[] };
      if (Array.isArray(data.sources)) return data.sources;
    }
  }
  return [];
}

function extractStatsFromParts(parts: { type: string; data?: unknown }[]): ChatResponseStats | null {
  for (const part of parts) {
    if (part.type === "data-stats" && part.data && typeof part.data === "object") {
      return part.data as ChatResponseStats;
    }
  }
  return null;
}

function parseCitationChips(text: string): string[] {
  const matches = text.match(/\[Source:?[^\]]+\]/gi) ?? [];
  return [...new Set(matches.map((m) => m.replace(/^\[Source:?\s*/i, "").replace(/\]$/, "").trim()))];
}

export function PortfolioChat({
  className,
  showSuggestedQuestions = true,
  onStatsUpdate,
  onSourcesUpdate,
}: PortfolioChatProps) {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status, error, clearError } = useChat({ transport });
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const isLoading = status === "streaming" || status === "submitted";
  const isRateLimited = error?.message?.includes("Too many messages");

  const latestAssistant = [...messages].reverse().find((m) => m.role === "assistant");

  const latestStats = useMemo(
    () => (latestAssistant ? extractStatsFromParts(latestAssistant.parts) : null),
    [latestAssistant],
  );

  const latestSources = useMemo(
    () => (latestAssistant ? extractSourcesFromParts(latestAssistant.parts) : []),
    [latestAssistant],
  );

  const citationChips = useMemo(
    () =>
      latestAssistant ? parseCitationChips(getMessageText(latestAssistant.parts)) : [],
    [latestAssistant],
  );

  useEffect(() => {
    onStatsUpdate?.(latestStats);
    onSourcesUpdate?.(
      latestSources.length
        ? latestSources
        : citationChips.map((s) => ({ source: s, similarity: 0 })),
    );
  }, [citationChips, latestSources, latestStats, onSourcesUpdate, onStatsUpdate]);

  const submit = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;
      setInput("");
      clearError();
      await sendMessage({ text: trimmed });
      queueMicrotask(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }));
    },
    [clearError, isLoading, sendMessage],
  );

  async function copyMessage(messageId: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div className={cn("flex h-full min-h-[420px] flex-col rounded-xl border border-border bg-background", className)}>
      <div
        ref={listRef}
        className="flex-1 space-y-4 overflow-y-auto p-4"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Chat messages"
      >
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Ask about projects, stack, or how Aliyas ships AI in production.
          </p>
        ) : null}

        {messages.map((message) => {
          const text = getMessageText(message.parts);
          const isUser = message.role === "user";
          return (
            <div
              key={message.id}
              className={cn("flex", isUser ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[92%] rounded-lg px-3 py-2 text-sm leading-relaxed",
                  isUser ? "bg-accent text-accent-foreground" : "bg-surface text-foreground",
                )}
              >
                <p className="whitespace-pre-wrap">{text}</p>
                {!isUser && text ? (
                  <button
                    type="button"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => copyMessage(message.id, text)}
                    aria-label="Copy assistant message"
                  >
                    <Copy className="size-3" aria-hidden />
                    {copiedId === message.id ? "Copied" : "Copy"}
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}

        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Thinking…
          </div>
        ) : null}
      </div>

      {(latestSources.length > 0 || citationChips.length > 0) && (
        <div className="border-t border-border px-4 py-2">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Sources</p>
          <ul className="flex flex-wrap gap-2">
            {(latestSources.length ? latestSources : citationChips.map((s) => ({ source: s, similarity: 0 }))).map(
              (item) => (
                <li
                  key={item.source}
                  className="rounded-md bg-surface px-2 py-1 text-xs text-foreground ring-1 ring-border"
                  title={item.similarity ? `Similarity ${item.similarity.toFixed(2)}` : undefined}
                >
                  {item.source}
                </li>
              ),
            )}
          </ul>
        </div>
      )}

      {error ? (
        <div
          className="mx-4 mb-2 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
          role="alert"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{isRateLimited ? chatConfig.rateLimitMessage : error.message}</span>
        </div>
      ) : null}

      {showSuggestedQuestions && messages.length === 0 ? (
        <div className="flex flex-wrap gap-2 border-t border-border px-4 py-3">
          {chatConfig.suggestedQuestions.map((question) => (
            <button
              key={question}
              type="button"
              className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground hover:border-accent/40 hover:text-foreground"
              onClick={() => submit(question)}
            >
              {question}
            </button>
          ))}
        </div>
      ) : null}

      <form
        className="flex items-end gap-2 border-t border-border p-4"
        onSubmit={(event) => {
          event.preventDefault();
          void submit(input);
        }}
      >
        <label className="sr-only" htmlFor="portfolio-chat-input">
          Message
        </label>
        <textarea
          id="portfolio-chat-input"
          rows={2}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void submit(input);
            }
          }}
          placeholder="Ask about my work…"
          className="min-h-[44px] flex-1 resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          disabled={isLoading}
          maxLength={2000}
          aria-describedby="portfolio-chat-hint"
        />
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()} aria-label="Send message">
          <Send className="size-4" />
        </Button>
      </form>
      <p id="portfolio-chat-hint" className="sr-only">
        Press Enter to send, Shift+Enter for a new line.
      </p>
    </div>
  );
}
