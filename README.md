# Aliyas Portfolio

Next.js portfolio with MDX content and a production-style **Ask My Portfolio** RAG demo (`/demo` + floating widget on the home page).

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Ask My Portfolio (RAG chat) setup

### 1. Environment

Copy `.env.example` to `.env.local` and fill in:

- `DATABASE_URL` — PostgreSQL with the [pgvector](https://github.com/pgvector/pgvector) extension
- `OPENAI_API_KEY`
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

Optional tuning: `CHAT_DAILY_BUDGET_USD`, `CHAT_RATE_LIMIT`, `CHAT_MAX_INPUT_CHARS`, etc.

### 2. Database

Apply migrations (creates `document_chunks`, `chat_request_logs`, `chat_daily_spend`):

```bash
pnpm db:migrate
```

Or during early development:

```bash
pnpm db:push
```

Ensure pgvector is enabled on the database (`CREATE EXTENSION IF NOT EXISTS vector;` — included in the migration).

### 3. Ingest content

Indexes MDX under `src/content/case-studies`, `src/content/blog`, and markdown under `src/content/knowledge/`:

```bash
pnpm ingest
```

Re-run after content changes.

### 4. Try the demo

- Full UI: [/demo](http://localhost:3000/demo)
- Home: `#chat` section + floating **Ask AI** button

### Architecture (summary)

- **Retrieval:** OpenAI `text-embedding-3-small` + pgvector cosine search (top-k via raw SQL)
- **Generation:** Vercel AI SDK `streamText` with `gpt-4o-mini`, grounded system prompt, citations
- **Guardrails:** Upstash sliding-window rate limit, daily spend cap + kill-switch, moderation, input/output limits, sanitized context, Redis response cache, request logging to Postgres

### Tests

```bash
pnpm test
```

Unit tests cover budget and rate-limit helper logic.

## Scripts

| Command        | Description                |
| -------------- | -------------------------- |
| `pnpm dev`     | Development server         |
| `pnpm build`   | Production build           |
| `pnpm ingest`  | Re-index MDX for RAG       |
| `pnpm test`    | Vitest unit tests          |
| `pnpm db:migrate` | Apply Prisma migrations |
