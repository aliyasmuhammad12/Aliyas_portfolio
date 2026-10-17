import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

const CASE_STUDIES_DIR = path.join(process.cwd(), "src/content/case-studies");

export type CaseStudyFrontmatter = {
  slug: string;
  title: string;
  excerpt: string;
  featured?: boolean;
  order?: number;
  tags?: string[];
  externalUrl?: string;
};

export type CaseStudy = CaseStudyFrontmatter;

function readCaseStudyFile(filename: string): CaseStudy | null {
  const filePath = path.join(CASE_STUDIES_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  const slug = typeof data.slug === "string" ? data.slug : filename.replace(/\.mdx$/, "");
  const title = typeof data.title === "string" ? data.title : slug;
  const excerpt = typeof data.excerpt === "string" ? data.excerpt : "";

  return {
    slug,
    title,
    excerpt,
    featured: data.featured === true,
    order: typeof data.order === "number" ? data.order : 999,
    tags: Array.isArray(data.tags) ? data.tags.filter((t): t is string => typeof t === "string") : [],
    externalUrl: typeof data.externalUrl === "string" ? data.externalUrl : undefined,
  };
}

export function getAllCaseStudies(): CaseStudy[] {
  if (!fs.existsSync(CASE_STUDIES_DIR)) {
    return [];
  }

  const files = fs.readdirSync(CASE_STUDIES_DIR).filter((f) => f.endsWith(".mdx"));
  return files
    .map(readCaseStudyFile)
    .filter((study): study is CaseStudy => study !== null)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export function getFeaturedCaseStudies(limit = 3): CaseStudy[] {
  const featured = getAllCaseStudies().filter((s) => s.featured);
  return featured.slice(0, limit);
}
