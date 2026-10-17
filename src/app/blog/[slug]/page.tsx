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
  return getContentSlugs("blog").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getCachedContentSummary("blog", slug);
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

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const summary = await getCachedContentSummary("blog", slug);
  const compiled = await getCachedCompiledContent("blog", slug);

  if (!summary || !compiled) notFound();

  const related = await getCachedRelatedContent("blog", slug, 3);

  return (
    <ArticleShell
      header={<PostHeader post={summary} />}
      headings={compiled.headings}
      footer={<RelatedPosts kind="blog" posts={related} />}
    >
      <div className="prose prose-zinc dark:prose-invert mx-auto max-w-3xl prose-headings:scroll-mt-24 prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
        {compiled.content}
      </div>
    </ArticleShell>
  );
}
