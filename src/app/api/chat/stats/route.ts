import { getChatStatsAggregate } from "@/lib/chat/logging";
import { getSpendSummary } from "@/lib/chat/daily-spend";

export async function GET() {
  try {
    const [aggregate, spend] = await Promise.all([getChatStatsAggregate(), getSpendSummary()]);
    return Response.json({ aggregate, spend });
  } catch {
    return Response.json(
      {
        aggregate: { count: 0, avgLatencyMs: null, avgCostUsd: null, avgTotalTokens: null },
        spend: null,
      },
      { status: 503 },
    );
  }
}
