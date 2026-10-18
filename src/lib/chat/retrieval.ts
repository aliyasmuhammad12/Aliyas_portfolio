import { embed } from "ai";
import { openai } from "@ai-sdk/openai";

import { prisma } from "@/lib/db";
import { getServerEnv } from "@/lib/env";

export type RetrievedChunk = {
  id: string;
  source: string;
  content: string;
  metadata: Record<string, unknown> | null;
  similarity: number;
};

function toVectorLiteral(values: number[]): string {
  return `[${values.join(",")}]`;
}

export async function embedQuery(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: openai.textEmbeddingModel("text-embedding-3-small"),
    value: text,
  });
  return embedding;
}

export async function retrieveTopChunks(query: string): Promise<RetrievedChunk[]> {
  const env = getServerEnv();
  const embedding = await embedQuery(query);
  const vector = toVectorLiteral(embedding);
  const topK = env.CHAT_TOP_K;

  const rows = await prisma.$queryRaw<
    {
      id: string;
      source: string;
      content: string;
      metadata: Record<string, unknown> | null;
      similarity: number;
    }[]
  >`
    SELECT
      id,
      source,
      content,
      metadata,
      1 - (embedding <=> ${vector}::vector) AS similarity
    FROM document_chunks
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> ${vector}::vector
    LIMIT ${topK}
  `;

  return rows.map((row) => ({
    id: row.id,
    source: row.source,
    content: row.content,
    metadata: row.metadata,
    similarity: Number(row.similarity),
  }));
}
