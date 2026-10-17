import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleShell } from "@/components/content/article-shell";
import { PostHeader } from "@/components/content/post-header";
import { RelatedPosts } from "@/components/content/related-posts";
import {
  getCachedCompiledContent,
  getCachedContentSummary,
  getCachedRelatedContent,
} from "@/lib/content/cached-posts";
import { getContentSlugs } from "@/lib/content/posts";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getContentSlugs("case-study").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getCachedContentSummary("case-study", slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [{ url: post.coverImage }],
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const summary = await getCachedContentSummary("case-study", slug);
  const compiled = await getCachedCompiledContent("case-study", slug);

  if (!summary || !compiled) notFound();

  const related = await getCachedRelatedContent("case-study", slug, 3);

  return (
    <ArticleShell
      header={<PostHeader post={summary} />}
      headings={compiled.headings}
      footer={<RelatedPosts kind="case-study" posts={related} />}
    >
      <div className="mx-auto max-w-3xl space-y-2">{compiled.content}</div>
    </ArticleShell>
  );
}
