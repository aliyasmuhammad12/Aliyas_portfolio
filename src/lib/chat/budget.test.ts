import { describe, expect, it } from "vitest";

import {
  estimateChatCostUsd,
  estimateEmbeddingCostUsd,
  getUtcDayKey,
  remainingBudgetUsd,
  wouldExceedBudget,
} from "@/lib/chat/budget";

describe("wouldExceedBudget", () => {
  it("allows spend within cap", () => {
    expect(wouldExceedBudget(1, 0.5, 5)).toBe(false);
  });

  it("blocks when incremental spend crosses cap", () => {
    expect(wouldExceedBudget(4.9, 0.2, 5)).toBe(true);
  });

  it("blocks all spend when cap is zero", () => {
    expect(wouldExceedBudget(0, 0.01, 0)).toBe(true);
  });
});

describe("remainingBudgetUsd", () => {
  it("returns non-negative remainder", () => {
    expect(remainingBudgetUsd(3.2, 5)).toBeCloseTo(1.8);
    expect(remainingBudgetUsd(6, 5)).toBe(0);
  });
});

describe("cost estimates", () => {
  it("computes chat cost from token counts", () => {
    const cost = estimateChatCostUsd({ promptTokens: 1000, completionTokens: 500 });
    expect(cost).toBeGreaterThan(0);
  });

  it("computes embedding cost", () => {
    expect(estimateEmbeddingCostUsd(1000)).toBeGreaterThan(0);
  });
});

describe("getUtcDayKey", () => {
  it("formats YYYY-MM-DD in UTC", () => {
    expect(getUtcDayKey(new Date("2026-02-18T15:00:00.000Z"))).toBe("2026-02-18");
  });
});
