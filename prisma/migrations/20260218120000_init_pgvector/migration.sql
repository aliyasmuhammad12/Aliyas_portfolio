CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE "document_chunks" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "chunkIndex" INTEGER NOT NULL,
    "contentHash" TEXT NOT NULL,
    "embedding" vector(1536),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_chunks_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "document_chunks_contentHash_key" ON "document_chunks"("contentHash");
CREATE INDEX "document_chunks_source_idx" ON "document_chunks"("source");

CREATE TABLE "chat_request_logs" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipHash" TEXT,
    "userMessage" TEXT NOT NULL,
    "latencyMs" INTEGER NOT NULL,
    "promptTokens" INTEGER NOT NULL,
    "completionTokens" INTEGER NOT NULL,
    "estimatedCostUsd" DECIMAL(12,8) NOT NULL,
    "cached" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL,

    CONSTRAINT "chat_request_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "chat_request_logs_createdAt_idx" ON "chat_request_logs"("createdAt");

CREATE TABLE "chat_daily_spend" (
    "dayKey" TEXT NOT NULL,
    "spentUsd" DECIMAL(12,6) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_daily_spend_pkey" PRIMARY KEY ("dayKey")
);
