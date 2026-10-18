import { Redis } from "@upstash/redis";

import { getServerEnv } from "@/lib/env";

let redis: Redis | null = null;

export function getRedis(): Redis {
  if (!redis) {
    const env = getServerEnv();
    redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redis;
}

export function cacheKeyForQuestion(normalizedQuestion: string): string {
  return `chat:cache:${normalizedQuestion}`;
}
