import type { ReactElement } from "react";

import type { BlogFrontmatter, CaseStudyFrontmatter, ContentFrontmatter } from "@/lib/content/schemas";

export type ContentKind = "case-study" | "blog";

export type TocHeading = {
  id: string;
  text: string;
  level: 2 | 3 | 4;
};

export type ContentSummary = ContentFrontmatter & {
  slug: string;
  kind: ContentKind;
  readingMinutes: number;
};

export type CaseStudySummary = CaseStudyFrontmatter & {
  slug: string;
  kind: "case-study";
  readingMinutes: number;
};

export type CompiledContent = {
  slug: string;
  kind: ContentKind;
  frontmatter: ContentFrontmatter | CaseStudyFrontmatter | BlogFrontmatter;
  content: ReactElement;
  headings: TocHeading[];
  readingMinutes: number;
};
