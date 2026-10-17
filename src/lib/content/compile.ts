import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { createRehypeCollectHeadings } from "@/lib/content/rehype-collect-headings";
import { getMdxComponents } from "@/lib/content/mdx-components";
import { getRawPost } from "@/lib/content/posts";
import type { CaseStudyFrontmatter } from "@/lib/content/schemas";
import type { CompiledContent, ContentKind, TocHeading } from "@/lib/content/types";

const CASE_STUDY_TOC: TocHeading[] = [
  { id: "problem", text: "Problem", level: 2 },
  { id: "what-would-have-broken", text: "What would have broken", level: 2 },
  { id: "my-approach", text: "My approach", level: 2 },
  { id: "results", text: "Results", level: 2 },
  { id: "tech-stack", text: "Tech stack", level: 2 },
];

async function buildRehypePlugins(headings: TocHeading[]) {
  return [
    rehypeSlug,
    [
      rehypePrettyCode,
      {
        theme: {
          dark: "github-dark",
          light: "github-light",
        },
        keepBackground: false,
        filterNodes: (node: { tagName?: string; properties?: { className?: string[] }; children?: { properties?: { className?: string[] } }[] }) => {
          if (node.tagName !== "pre") return true;
          const code = node.children?.[0];
          const className = code?.properties?.className;
          if (Array.isArray(className) && className.some((c) => c.includes("mermaid"))) {
            return false;
          }
          return true;
        },
      },
    ] as const,
    createRehypeCollectHeadings(headings),
  ];
}

export async function compileContent(
  kind: ContentKind,
  slug: string,
): Promise<CompiledContent | null> {
  const raw = getRawPost(kind, slug);
  if (!raw) return null;

  const headings: TocHeading[] = [];
  const rehypePlugins = await buildRehypePlugins(headings);

  const metrics =
    kind === "case-study" ? (raw.frontmatter as CaseStudyFrontmatter).metrics : raw.frontmatter.metrics;

  const { content } = await compileMDX({
    source: raw.content,
    components: getMdxComponents({
      kind,
      metrics,
    }),
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: rehypePlugins as never,
      },
    },
  });

  const mergedHeadings =
    kind === "case-study"
      ? [
          ...CASE_STUDY_TOC,
          ...headings.filter((h) => !CASE_STUDY_TOC.some((fixed) => fixed.id === h.id)),
        ]
      : headings;

  return {
    slug,
    kind,
    frontmatter: raw.frontmatter,
    content,
    headings: mergedHeadings,
    readingMinutes: raw.readingMinutes,
  };
}
