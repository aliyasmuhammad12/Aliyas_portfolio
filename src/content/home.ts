export const heroContent = {
  subheading:
    "I add production-grade AI—OpenAI, LangChain, RAG—to existing products, and take AI-generated prototypes from v0, Lovable, Bolt, and Cursor to production-ready software.",
  primaryCta: { label: "Start a project", href: "/contact" },
  secondaryCta: { label: "Try the live demo", href: "#chat" },
} as const;

export const twoWaysContent = {
  heading: "Two ways I help",
  subheading:
    "Whether you need AI inside a live product or a prototype hardened for real users, I focus on reliability, cost control, and shipping.",
  cards: [
    {
      title: "AI integration",
      href: "/services/ai-integration",
      description:
        "Embed chat, search, and automation into your app with guardrails, observability, and sane OpenAI spend.",
      bullets: ["RAG over your docs & data", "Streaming UX & error handling", "Auth-aware AI endpoints"],
    },
    {
      title: "Prototype to production",
      href: "/services/prototype-to-production",
      description:
        "Turn v0/Lovable/Bolt/Cursor output into typed Next.js apps with tests, CI, and deployment you can trust.",
      bullets: ["Refactor & harden generated code", "Performance & accessibility pass", "Deploy on Vercel or AWS"],
    },
  ],
} as const;

export const problemSectionContent = {
  heading: "The problem I solve",
  subheading:
    "Demos impress in a meeting. Production breaks under traffic, bills, and missing fundamentals.",
  items: [
    {
      problem: "Traffic spikes take down the demo",
      symptom: "Cold starts, no caching, unbounded API calls.",
      fix: "Edge-friendly routes, rate limits, queues, and load testing before launch.",
    },
    {
      problem: "OpenAI costs run away",
      symptom: "Every click hits GPT-4 with full context and no caps.",
      fix: "Model routing, token budgets, caching, and usage dashboards clients can read.",
    },
    {
      problem: "No auth or tenancy",
      symptom: "Anyone can hit your AI endpoints or see other users' data.",
      fix: "NextAuth (or your IdP), row-level checks, and scoped API keys per environment.",
    },
    {
      problem: "No pipeline after “ship”",
      symptom: "Manual deploys, no staging, secrets in the repo.",
      fix: "CI/CD, preview environments, secret management, and rollback paths.",
    },
  ],
} as const;

export const faqContent = {
  heading: "FAQ",
  subheading: "Quick answers before we jump on a call.",
  items: [
    {
      question: "Do you work with existing codebases?",
      answer:
        "Yes. Most engagements start inside a product that already has users. I integrate AI and harden what you have instead of rewriting for sport.",
    },
    {
      question: "Can you fix a v0 or Lovable prototype?",
      answer:
        "That's a core offering. I keep what works in the UI, replace fragile generated backend code, and wire up auth, data, and deployment.",
    },
    {
      question: "How do you handle OpenAI costs?",
      answer:
        "Up front we define budgets per feature, pick models per task, and add logging so you see spend by route and customer tier.",
    },
    {
      question: "What's your timezone and availability?",
      answer:
        "I'm based in Gilgit-Baltistan (PKT, UTC+5) and overlap with US and EU teams. I reply within a few hours on business days.",
    },
    {
      question: "Fixed price or hourly?",
      answer:
        "Both. Small AI features often fit a sprint package; larger prototype-to-production work is scoped after a short audit.",
    },
  ],
} as const;

export const finalCtaContent = {
  heading: "Ready to ship AI that survives real users?",
  subheading:
    "Tell me about your product, timeline, and where you're stuck. I'll reply with next steps—not a generic pitch deck.",
  primary: { label: "Start a project", href: "/contact" },
  secondary: { label: "View services", href: "/services" },
} as const;
