import type { ReactNode } from "react";

import { TableOfContents } from "@/components/content/table-of-contents";
import type { TocHeading } from "@/lib/content/types";

type ArticleShellProps = {
  header: ReactNode;
  children: ReactNode;
  headings: TocHeading[];
  footer?: ReactNode;
};

export function ArticleShell({ header, children, headings, footer }: ArticleShellProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      {header}
      <div className="mt-12 lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_240px]">
        <article className="min-w-0">{children}</article>
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      </div>
      {footer ? <div className="mx-auto mt-16 max-w-3xl">{footer}</div> : null}
    </div>
  );
}
