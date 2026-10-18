import { siteConfig } from "@/config/site";

export const chatConfig = {
  suggestedQuestions: [
    "What kind of AI work do you do for clients?",
    "Tell me about the North Travena project.",
    "How do you control OpenAI costs in production?",
    "Can you take a v0 or Lovable prototype to production?",
  ],
  guardrails: [
    "Answers grounded in indexed site content only",
    "Per-IP sliding-window rate limit (Upstash Redis)",
    "Global daily spend budget with kill-switch message",
    "Max input length and max output tokens",
    "OpenAI moderation on user input",
    "Prompt-injection hardening and sanitized retrieval context",
    "Response cache for repeated questions",
    "Request logging (latency, tokens, estimated cost)",
  ],
  outOfScopeMessage: `I don't have that in my portfolio sources. Email ${siteConfig.email} or [start a project](/contact) and Aliyas can help directly.`,
  budgetKillSwitchMessage:
    "The demo has reached today's usage budget. Please try again tomorrow or contact Aliyas directly.",
  rateLimitMessage: "Too many messages—please wait a moment and try again.",
} as const;
