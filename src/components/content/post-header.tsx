import Image from "next/image";

import { formatContentDate } from "@/lib/content/format";
import type { ContentSummary } from "@/lib/content/types";

type PostHeaderProps = {
  post: ContentSummary;
};

export function PostHeader({ post }: PostHeaderProps) {
  return (
    <header className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <time dateTime={post.date.toISOString()}>{formatContentDate(post.date)}</time>
        <span aria-hidden>·</span>
        <span>{post.readingMinutes} min read</span>
        {post.role ? (
          <>
            <span aria-hidden>·</span>
            <span>{post.role}</span>
          </>
        ) : null}
      </div>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
        {post.title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{post.description}</p>
      {post.stack.length > 0 ? (
        <ul className="mt-6 flex flex-wrap gap-2">
          {post.stack.map((item) => (
            <li
              key={item}
              className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-muted-foreground"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl border border-border bg-surface">
        <Image
          src={post.coverImage}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 896px"
        />
      </div>
    </header>
  );
}
