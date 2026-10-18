import { z } from "zod";

const uiMessagePartSchema = z.object({ type: z.string() }).passthrough();

export const uiMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant", "system"]),
  parts: z.array(uiMessagePartSchema).min(1),
});

export const chatRequestSchema = z.object({
  messages: z.array(uiMessageSchema).min(1),
});

export type ChatRequestBody = z.infer<typeof chatRequestSchema>;
