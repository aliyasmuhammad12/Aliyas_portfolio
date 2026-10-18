import { describe, expect, it } from "vitest";

import {
  buildRateLimitHeaders,
  isRateLimited,
  rateLimitRetryAfterSeconds,
} from "@/lib/chat/rate-limit-logic";

describe("isRateLimited", () => {
  it("returns false when remaining is undefined (fail-open)", () => {
    expect(isRateLimited(undefined)).toBe(false);
  });

  it("returns true when remaining is zero or negative", () => {
    expect(isRateLimited(0)).toBe(true);
    expect(isRateLimited(-1)).toBe(true);
  });

  it("returns false when requests remain", () => {
    expect(isRateLimited(3)).toBe(false);
  });
});

describe("rateLimitRetryAfterSeconds", () => {
  it("derives seconds until reset", () => {
    const now = 1_000_000;
    expect(rateLimitRetryAfterSeconds(now + 15_000, now)).toBe(15);
  });

  it("defaults to 60 when reset missing", () => {
    expect(rateLimitRetryAfterSeconds(undefined)).toBe(60);
  });
});

describe("buildRateLimitHeaders", () => {
  it("includes limit, remaining, and reset", () => {
    const headers = buildRateLimitHeaders({ limit: 10, remaining: 4, resetMs: 12345 });
    expect(headers["X-RateLimit-Limit"]).toBe("10");
    expect(headers["X-RateLimit-Remaining"]).toBe("4");
    expect(headers["X-RateLimit-Reset"]).toBe("12345");
  });
});
