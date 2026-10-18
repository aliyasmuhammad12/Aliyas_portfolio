import { Ratelimit } from "@upstash/ratelimit";

import { getServerEnv } from "@/lib/env";
import { getRedis } from "@/lib/chat/redis";
import {
  buildRateLimitHeaders,
  isRateLimited,
  rateLimitRetryAfterSeconds,
} from "@/lib/chat/rate-limit-logic";

let limiter: Ratelimit | null = null;

function getLimiter(): Ratelimit {
  if (!limiter) {
    const env = getServerEnv();
    limiter = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(env.CHAT_RATE_LIMIT, `${env.CHAT_RATE_WINDOW_SECONDS} s`),
      analytics: true,
      prefix: "portfolio-chat",
    });
  }
  return limiter;
}

export async function checkIpRateLimit(ip: string) {
  const env = getServerEnv();
  const result = await getLimiter().limit(ip);
  const blocked = isRateLimited(result.remaining);

  return {
    blocked,
    retryAfterSeconds: rateLimitRetryAfterSeconds(result.reset),
    headers: buildRateLimitHeaders({
      limit: env.CHAT_RATE_LIMIT,
      remaining: result.remaining,
      resetMs: result.reset,
    }),
  };
}
