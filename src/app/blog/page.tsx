import type { Metadata } from "next";

import { ContentCard } from "@/components/content/content-card";
import { Section, SectionHeader } from "@/components/shared/section";
import { siteConfig } from "@/config/site";
import { getCachedContentSummaries } from "@/lib/content/cached-posts";

export const metadata: Metadata = {
  title: "Blog",
  description: `Notes on shipping AI in production by ${siteConfig.name}.`,
};

export default async function BlogPage() {
  const posts = await getCachedContentSummaries("blog");

  return (
    <Section ariaLabelledBy="blog-index-heading" className="pt-12 md:pt-16">
      <SectionHeader
        id="blog-index-heading"
        eyebrow="Writing"
        title="Blog"
        description="Practical posts on RAG, LLM cost control, and prototype-to-production."
      />
      {posts.length === 0 ? (
        <p className="text-muted-foreground">Posts coming soon.</p>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <ContentCard post={post} hrefPrefix="/blog" />
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
