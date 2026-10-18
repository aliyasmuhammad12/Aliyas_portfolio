/** gpt-4o-mini pricing (USD per 1M tokens) — update when OpenAI changes list price. */
export const GPT4O_MINI_INPUT_USD_PER_M = 0.15;
export const GPT4O_MINI_OUTPUT_USD_PER_M = 0.6;
export const TEXT_EMBEDDING_3_SMALL_USD_PER_M = 0.02;

export function estimateChatCostUsd(params: {
  promptTokens: number;
  completionTokens: number;
}): number {
  const input = (params.promptTokens / 1_000_000) * GPT4O_MINI_INPUT_USD_PER_M;
  const output = (params.completionTokens / 1_000_000) * GPT4O_MINI_OUTPUT_USD_PER_M;
  return input + output;
}

export function estimateEmbeddingCostUsd(tokenCount: number): number {
  return (tokenCount / 1_000_000) * TEXT_EMBEDDING_3_SMALL_USD_PER_M;
}

export function wouldExceedBudget(
  currentSpentUsd: number,
  incrementalUsd: number,
  budgetCapUsd: number,
): boolean {
  if (budgetCapUsd <= 0) return true;
  return currentSpentUsd + incrementalUsd > budgetCapUsd;
}

export function remainingBudgetUsd(currentSpentUsd: number, budgetCapUsd: number): number {
  return Math.max(0, budgetCapUsd - currentSpentUsd);
}

export function getUtcDayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}
