import { z } from "zod";

const clientEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export const env = clientEnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
});

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  CHAT_DAILY_BUDGET_USD: z.coerce.number().positive().default(5),
  CHAT_RATE_LIMIT: z.coerce.number().int().positive().default(10),
  CHAT_RATE_WINDOW_SECONDS: z.coerce.number().int().positive().default(60),
  CHAT_MAX_INPUT_CHARS: z.coerce.number().int().positive().default(2000),
  CHAT_MAX_OUTPUT_TOKENS: z.coerce.number().int().positive().default(800),
  CHAT_TOP_K: z.coerce.number().int().positive().default(6),
  CHAT_CACHE_TTL_SECONDS: z.coerce.number().int().positive().default(3600),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedServerEnv: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cachedServerEnv) return cachedServerEnv;
  cachedServerEnv = serverEnvSchema.parse(process.env);
  return cachedServerEnv;
}

/** Used in tests to reset cached env between cases. */
export function resetServerEnvCacheForTests() {
  cachedServerEnv = null;
}
