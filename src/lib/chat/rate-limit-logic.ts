export function isRateLimited(remaining: number | undefined): boolean {
  if (remaining === undefined) return false;
  return remaining <= 0;
}

export function rateLimitRetryAfterSeconds(resetMs: number | undefined, nowMs = Date.now()): number {
  if (!resetMs) return 60;
  return Math.max(1, Math.ceil((resetMs - nowMs) / 1000));
}

export function buildRateLimitHeaders(params: {
  limit: number;
  remaining: number;
  resetMs: number;
}): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(params.limit),
    "X-RateLimit-Remaining": String(Math.max(0, params.remaining)),
    "X-RateLimit-Reset": String(params.resetMs),
  };
}
