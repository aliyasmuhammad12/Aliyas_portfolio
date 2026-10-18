import { prisma } from "@/lib/db";

export type ChatLogStatus =
  | "ok"
  | "cached"
  | "rate_limited"
  | "budget_exceeded"
  | "moderation_blocked"
  | "validation_error"
  | "error";

export async function logChatRequest(params: {
  ipHash: string | null;
  userMessage: string;
  latencyMs: number;
  promptTokens: number;
  completionTokens: number;
  estimatedCostUsd: number;
  cached: boolean;
  status: ChatLogStatus;
}) {
  await prisma.chatRequestLog.create({
    data: {
      ipHash: params.ipHash,
      userMessage: params.userMessage.slice(0, 4000),
      latencyMs: params.latencyMs,
      promptTokens: params.promptTokens,
      completionTokens: params.completionTokens,
      estimatedCostUsd: params.estimatedCostUsd,
      cached: params.cached,
      status: params.status,
    },
  });
}

export async function getChatStatsAggregate() {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const rows = await prisma.chatRequestLog.findMany({
    where: {
      createdAt: { gte: since },
      status: { in: ["ok", "cached"] },
    },
    select: {
      latencyMs: true,
      estimatedCostUsd: true,
      promptTokens: true,
      completionTokens: true,
    },
  });

  if (rows.length === 0) {
    return {
      count: 0,
      avgLatencyMs: null,
      avgCostUsd: null,
      avgTotalTokens: null,
    };
  }

  const totals = rows.reduce(
    (acc, row) => {
      acc.latency += row.latencyMs;
      acc.cost += Number(row.estimatedCostUsd);
      acc.tokens += row.promptTokens + row.completionTokens;
      return acc;
    },
    { latency: 0, cost: 0, tokens: 0 },
  );

  return {
    count: rows.length,
    avgLatencyMs: Math.round(totals.latency / rows.length),
    avgCostUsd: totals.cost / rows.length,
    avgTotalTokens: Math.round(totals.tokens / rows.length),
  };
}
