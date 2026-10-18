import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { PrismaClient } from "@prisma/client";
import matter from "gray-matter";
import OpenAI from "openai";

import { chunkText } from "../src/lib/chat/chunking";

const prisma = new PrismaClient();

const ROOT = process.cwd();
const CONTENT_DIRS = [
  path.join(ROOT, "src/content/case-studies"),
  path.join(ROOT, "src/content/blog"),
  path.join(ROOT, "src/content/knowledge"),
];

function hashContent(source: string, index: number, content: string) {
  return createHash("sha256").update(`${source}:${index}:${content}`).digest("hex");
}

function stripMdxMarkup(text: string): string {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function collectMdxFiles(): { source: string; body: string }[] {
  const files: { source: string; body: string }[] = [];

  for (const dir of CONTENT_DIRS) {
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".mdx") && !file.endsWith(".md")) continue;
      const fullPath = path.join(dir, file);
      const raw = fs.readFileSync(fullPath, "utf8");
      const { content, data } = matter(raw);
      const relativeSource = path.relative(ROOT, fullPath).replace(/\\/g, "/");
      const title = typeof data.title === "string" ? data.title : file;
      const description = typeof data.description === "string" ? data.description : "";
      const header = `# ${title}\n${description}\n\n`;
      files.push({
        source: relativeSource,
        body: stripMdxMarkup(`${header}${content}`),
      });
    }
  }

  return files;
}

async function embedBatch(openai: OpenAI, inputs: string[]): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: inputs,
  });
  return response.data.map((row) => row.embedding);
}

function toVectorLiteral(values: number[]): string {
  return `[${values.join(",")}]`;
}

async function upsertChunk(params: {
  source: string;
  content: string;
  chunkIndex: number;
  contentHash: string;
  embedding: number[];
  metadata: Record<string, unknown>;
}) {
  const vector = toVectorLiteral(params.embedding);
  const id = params.contentHash.slice(0, 24);

  await prisma.$executeRaw`
    INSERT INTO document_chunks (id, source, content, metadata, "chunkIndex", "contentHash", embedding, "createdAt", "updatedAt")
    VALUES (
      ${id},
      ${params.source},
      ${params.content},
      ${JSON.stringify(params.metadata)}::jsonb,
      ${params.chunkIndex},
      ${params.contentHash},
      ${vector}::vector,
      NOW(),
      NOW()
    )
    ON CONFLICT ("contentHash") DO UPDATE SET
      content = EXCLUDED.content,
      metadata = EXCLUDED.metadata,
      embedding = EXCLUDED.embedding,
      "updatedAt" = NOW()
  `;
}

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required.");
  }
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required.");
  }

  const openai = new OpenAI({ apiKey });
  const documents = collectMdxFiles();
  let totalChunks = 0;

  for (const doc of documents) {
    const chunks = chunkText(doc.body);
    for (let i = 0; i < chunks.length; i += 20) {
      const batch = chunks.slice(i, i + 20);
      const embeddings = await embedBatch(openai, batch);

      for (let j = 0; j < batch.length; j += 1) {
        const chunkIndex = i + j;
        const content = batch[j] ?? "";
        const contentHash = hashContent(doc.source, chunkIndex, content);
        await upsertChunk({
          source: doc.source,
          content,
          chunkIndex,
          contentHash,
          embedding: embeddings[j] ?? [],
          metadata: { source: doc.source, chunkIndex },
        });
        totalChunks += 1;
      }
    }
    console.log(`Indexed ${chunks.length} chunks from ${doc.source}`);
  }

  console.log(`Done. Upserted ${totalChunks} chunks.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
