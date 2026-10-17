import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import readingTime from "reading-time";

import {
  blogFrontmatterSchema,
  caseStudyFrontmatterSchema,
} from "@/lib/content/schemas";
import type { ContentKind, ContentSummary } from "@/lib/content/types";

const CASE_STUDIES_PATH = path.join(
  /* turbopackIgnore: true */ process.cwd(),
  "src/content/case-studies",
);
const BLOG_PATH = path.join(/* turbopackIgnore: true */ process.cwd(), "src/content/blog");

function contentDir(kind: ContentKind) {
  return kind === "case-study" ? CASE_STUDIES_PATH : BLOG_PATH;
}

function parseFrontmatter(kind: ContentKind, data: unknown) {
  if (kind === "case-study") {
    return caseStudyFrontmatterSchema.parse(data);
  }
  return blogFrontmatterSchema.parse(data);
}

function listMdxFiles(kind: ContentKind): string[] {
  const dir = contentDir(kind);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((file) => file.endsWith(".mdx"));
}

function readRawPost(kind: ContentKind, slug: string) {
  const filePath = path.join(contentDir(kind), `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(raw);
  const frontmatter = parseFrontmatter(kind, data);
  const stats = readingTime(content);
  const readingMinutes = Math.max(1, Math.ceil(stats.minutes));

  return { content, frontmatter, readingMinutes };
}

export function getContentSlugs(kind: ContentKind): string[] {
  return listMdxFiles(kind).map((file) => file.replace(/\.mdx$/, ""));
}

export function getAllContentSummaries(kind: ContentKind): ContentSummary[] {
  return getContentSlugs(kind)
    .map((slug) => {
      const raw = readRawPost(kind, slug);
      if (!raw) return null;
      return {
        slug,
        kind,
        ...raw.frontmatter,
        readingMinutes: raw.readingMinutes,
      } satisfies ContentSummary;
    })
    .filter((item): item is ContentSummary => item !== null)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getContentSummary(kind: ContentKind, slug: string): ContentSummary | null {
  const raw = readRawPost(kind, slug);
  if (!raw) return null;
  return {
    slug,
    kind,
    ...raw.frontmatter,
    readingMinutes: raw.readingMinutes,
  };
}

export function getFeaturedCaseStudies(limit = 3): ContentSummary[] {
  return getAllContentSummaries("case-study")
    .filter((post) => post.featured)
    .slice(0, limit);
}

export function getRelatedContent(
  kind: ContentKind,
  slug: string,
  limit = 3,
): ContentSummary[] {
  const current = getContentSummary(kind, slug);
  if (!current) return [];

  const tagSet = new Set(current.tags);
  const candidates = getAllContentSummaries(kind).filter((post) => post.slug !== slug);

  const scored = candidates
    .map((post) => {
      const overlap = post.tags.filter((tag) => tagSet.has(tag)).length;
      return { post, score: overlap };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.post.date.getTime() - a.post.date.getTime();
    });

  const withTags = scored.filter((item) => item.score > 0).map((item) => item.post);
  if (withTags.length >= limit) return withTags.slice(0, limit);

  const fallback = scored.map((item) => item.post);
  const merged = [...withTags];
  for (const post of fallback) {
    if (merged.length >= limit) break;
    if (!merged.some((p) => p.slug === post.slug)) merged.push(post);
  }
  return merged.slice(0, limit);
}

export function getRawPostBody(kind: ContentKind, slug: string) {
  const raw = readRawPost(kind, slug);
  if (!raw) return null;
  return raw;
}

export type RawPost = NonNullable<ReturnType<typeof getRawPostBody>> & {
  slug: string;
  kind: ContentKind;
};

export function getRawPost(kind: ContentKind, slug: string): RawPost | null {
  const raw = readRawPost(kind, slug);
  if (!raw) return null;
  return { slug, kind, ...raw };
}
