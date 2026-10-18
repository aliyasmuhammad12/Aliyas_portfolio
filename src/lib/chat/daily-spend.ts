import { getUtcDayKey, wouldExceedBudget } from "@/lib/chat/budget";
import { prisma } from "@/lib/db";
import { getServerEnv } from "@/lib/env";

export async function getDailySpendUsd(dayKey = getUtcDayKey()): Promise<number> {
  const row = await prisma.chatDailySpend.findUnique({ where: { dayKey } });
  if (!row) return 0;
  return Number(row.spentUsd);
}

export async function isDailyBudgetExceeded(estimatedIncrementalUsd = 0): Promise<boolean> {
  const env = getServerEnv();
  const spent = await getDailySpendUsd();
  return wouldExceedBudget(spent, estimatedIncrementalUsd, env.CHAT_DAILY_BUDGET_USD);
}

export async function recordDailySpend(incrementUsd: number, dayKey = getUtcDayKey()) {
  if (incrementUsd <= 0) return;

  await prisma.chatDailySpend.upsert({
    where: { dayKey },
    create: { dayKey, spentUsd: incrementUsd },
    update: { spentUsd: { increment: incrementUsd } },
  });
}

export async function getSpendSummary(dayKey = getUtcDayKey()) {
  const env = getServerEnv();
  const spent = await getDailySpendUsd(dayKey);
  return {
    dayKey,
    spentUsd: spent,
    budgetUsd: env.CHAT_DAILY_BUDGET_USD,
    remainingUsd: Math.max(0, env.CHAT_DAILY_BUDGET_USD - spent),
  };
}
