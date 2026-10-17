export const siteConfig = {
  name: "Aliyas Muhammad",
  title: "Full-Stack AI Developer",
  tagline: "AI features that survive real users.",
  location: "Gilgit-Baltistan, Pakistan",
  locationNote: "Based in Gilgit-Baltistan, working with clients worldwide.",
  url: "https://aliyas.dev",
  email: "hello@example.com",
  socials: {
    github: "https://github.com/aliyasmuhammad12",
    linkedin: "https://www.linkedin.com/in/aliyas-muhammad/",
    upwork: "https://www.upwork.com/freelancers/~01f64ca796637a4b98",
  },
  pricing: {
    hourly: "$15/hr",
    packages: [
      { name: "AI Feature Sprint", price: "TODO" },
      { name: "Prototype-to-Production", price: "TODO" },
    ],
  },
  availability: {
    status: "Available for work",
    responseTime: "I reply within a few hours",
  },
  stats: [
    {
      id: "features",
      label: "Client-facing features shipped",
      value: 50,
      suffix: "+",
      display: "50+",
    },
    {
      id: "lighthouse",
      label: "Typical Lighthouse gains",
      value: null,
      display: "60→90+",
    },
    {
      id: "jss",
      label: "Job Success Score",
      value: 100,
      suffix: "%",
      display: "100%",
    },
    {
      id: "upwork",
      label: "Upwork Rising Talent",
      value: null,
      display: "Rising Talent",
    },
  ] as const,
  skills: {
    AI: ["OpenAI API", "LangChain", "RAG"],
    "Full-stack": ["Next.js", "React", "Remix", "Node/Express", "TypeScript", "MERN"],
    "Data & Auth": ["PostgreSQL", "MongoDB", "RxDB", "Prisma", "NextAuth", "Stripe"],
    DevOps: ["Vercel", "AWS", "Docker", "CI/CD"],
    "Mobile & Desktop": ["Mobile apps", "Electron"],
  },
  projects: [
    {
      slug: "north-travena",
      name: "North Travena",
      url: "https://northtravena.com",
      description:
        "Ride-hailing for the Karakoram Highway region, built in Gilgit. 100+ captains, 500+ riders.",
      role: "Full-stack developer, mostly backend",
      featured: true,
    },
    {
      slug: "hotela",
      name: "Hotela",
      url: "https://hotelaapp.com",
      description: "Hotel management application for properties and staff workflows.",
      role: "Full-stack developer",
      featured: true,
    },
    {
      slug: "stc-sso",
      name: "STC SSO portal revamp",
      description: "Next.js and TypeScript SSO portal modernization.",
      role: "Full-stack developer",
      featured: false,
    },
    {
      slug: "ask-my-portfolio",
      name: "Ask My Portfolio",
      description: "RAG chatbot built for this site — ask about my work and stack.",
      role: "Solo project",
      featured: true,
    },
  ],
  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Blog", href: "/blog" },
    { label: "Resources", href: "/resources" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
