import Image from "next/image";
import Link from "next/link";

import { formatContentDate } from "@/lib/content/format";
import type { ContentSummary } from "@/lib/content/types";

type ContentCardProps = {
  post: ContentSummary;
  hrefPrefix: "/case-studies" | "/blog";
};

export function ContentCard({ post, hrefPrefix }: ContentCardProps) {
  const href = `${hrefPrefix}/${post.slug}`;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface">
      <Link href={href} className="relative block aspect-[16/9] bg-background">
        <Image
          src={post.coverImage}
          alt=""
          fill
          className="object-cover transition-opacity hover:opacity-90"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <time dateTime={post.date.toISOString()} className="text-xs text-muted-foreground">
          {formatContentDate(post.date)} · {post.readingMinutes} min read
        </time>
        <h2 className="mt-2 text-lg font-semibold leading-snug">
          <Link href={href} className="text-foreground hover:text-accent">
            {post.title}
          </Link>
        </h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {post.description}
        </p>
        {post.tags.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {post.tags.slice(0, 4).map((tag) => (
              <li
                key={tag}
                className="rounded-md bg-background px-2 py-0.5 text-xs text-muted-foreground ring-1 ring-border"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
