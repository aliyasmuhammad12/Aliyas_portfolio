import { cacheLife } from "next/cache";

import { compileContent } from "@/lib/content/compile";
import { CONTENT_REVALIDATE_SECONDS } from "@/lib/content/constants";
import {
  getAllContentSummaries,
  getContentSummary,
  getRelatedContent,
} from "@/lib/content/posts";
import type { ContentKind } from "@/lib/content/types";

function applyContentCacheLife() {
  cacheLife({
    stale: CONTENT_REVALIDATE_SECONDS,
    revalidate: CONTENT_REVALIDATE_SECONDS,
    expire: CONTENT_REVALIDATE_SECONDS * 24,
  });
}

export async function getCachedContentSummaries(kind: ContentKind) {
  "use cache";
  applyContentCacheLife();
  return getAllContentSummaries(kind);
}

export async function getCachedContentSummary(kind: ContentKind, slug: string) {
  "use cache";
  applyContentCacheLife();
  return getContentSummary(kind, slug);
}

export async function getCachedCompiledContent(kind: ContentKind, slug: string) {
  "use cache";
  applyContentCacheLife();
  return compileContent(kind, slug);
}

export async function getCachedRelatedContent(
  kind: ContentKind,
  slug: string,
  limit = 3,
) {
  "use cache";
  applyContentCacheLife();
  return getRelatedContent(kind, slug, limit);
}
