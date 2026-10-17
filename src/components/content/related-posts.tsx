import Link from "next/link";

import { ContentCard } from "@/components/content/content-card";
import type { ContentKind, ContentSummary } from "@/lib/content/types";

type RelatedPostsProps = {
  kind: ContentKind;
  posts: ContentSummary[];
};

export function RelatedPosts({ kind, posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  const hrefPrefix = kind === "case-study" ? "/case-studies" : "/blog";
  const label = kind === "case-study" ? "Related case studies" : "Related posts";

  return (
    <section className="border-t border-border pt-12" aria-labelledby="related-posts-heading">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2 id="related-posts-heading" className="text-2xl font-semibold text-foreground">
          {label}
        </h2>
        <Link href={hrefPrefix} className="text-sm font-medium text-accent hover:underline">
          View all
        </Link>
      </div>
      <ul className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <ContentCard post={post} hrefPrefix={hrefPrefix} />
          </li>
        ))}
      </ul>
    </section>
  );
}
