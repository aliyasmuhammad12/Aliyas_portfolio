import Image from "next/image";
import Link from "next/link";
import type { AnchorHTMLAttributes, ComponentType, ReactNode } from "react";

import { MermaidDiagram } from "@/components/mdx/mermaid-diagram";
import { MetricsGrid } from "@/components/content/metrics-grid";
import { Button } from "@/components/ui/button";
import type { ContentMetric } from "@/lib/content/schemas";
import type { ContentKind } from "@/lib/content/types";
import { cn } from "@/lib/utils";

type MdxContext = {
  kind: ContentKind;
  metrics: ContentMetric[];
};

function CaseStudySection({
  title,
  children,
  id,
}: {
  title: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="not-prose scroll-mt-24 border-t border-border pt-10 first:border-t-0 first:pt-0">
      <h2 id={id} className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        {title}
      </h2>
      <div className="prose prose-zinc dark:prose-invert mt-6 max-w-none prose-headings:scroll-mt-24 prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
        {children}
      </div>
    </section>
  );
}

function Architecture({
  image,
  alt = "",
  children,
}: {
  image?: string;
  alt?: string;
  children?: ReactNode;
}) {
  return (
    <div className="not-prose mt-6 space-y-6">
      {image ? (
        <figure className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="relative aspect-video w-full">
            <Image src={image} alt={alt || "Architecture diagram"} fill className="object-cover" />
          </div>
          {/* TODO: Replace placeholder cover with real architecture diagram export. */}
        </figure>
      ) : null}
      {children}
    </div>
  );
}

function Testimonial({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role?: string;
}) {
  return (
    <blockquote className="not-prose mt-6 rounded-xl border border-border bg-surface/60 p-6">
      <p className="text-lg leading-relaxed text-foreground">&ldquo;{quote}&rdquo;</p>
      <footer className="mt-4 text-sm text-muted-foreground">
        — {author}
        {role ? `, ${role}` : ""}
      </footer>
    </blockquote>
  );
}

function CaseStudyCta() {
  return (
    <div className="not-prose mt-8 rounded-xl border border-border bg-surface/50 p-6 md:p-8">
      <p className="text-lg font-medium text-foreground">Want similar results on your product?</p>
      <p className="mt-2 text-muted-foreground">
        {/* TODO: Personalize CTA copy per case study when publishing. */}
        Tell me where you are stuck—I&apos;ll reply with concrete next steps.
      </p>
      <Button asChild className="mt-4">
        <Link href="/contact">Start a project</Link>
      </Button>
    </div>
  );
}

function createCaseStudyComponents(metrics: ContentMetric[]) {
  return {
    Problem: ({ children }: { children: ReactNode }) => (
      <CaseStudySection id="problem" title="Problem">
        {children}
      </CaseStudySection>
    ),
    WhatWouldHaveBroken: ({ children }: { children: ReactNode }) => (
      <CaseStudySection id="what-would-have-broken" title="What would have broken">
        {children}
      </CaseStudySection>
    ),
    Approach: ({ children }: { children: ReactNode }) => (
      <CaseStudySection id="my-approach" title="My approach">
        {children}
      </CaseStudySection>
    ),
    Architecture,
    Results: ({ children }: { children?: ReactNode }) => (
      <CaseStudySection id="results" title="Results">
        {children}
        {metrics.length > 0 ? (
          <div className="not-prose mt-6">
            <MetricsGrid metrics={metrics} />
          </div>
        ) : null}
      </CaseStudySection>
    ),
    TechStack: ({ children }: { children: ReactNode }) => (
      <CaseStudySection id="tech-stack" title="Tech stack">
        {children}
      </CaseStudySection>
    ),
    Testimonial,
    CTA: CaseStudyCta,
  };
}

function Pre({ children, ...props }: React.ComponentPropsWithoutRef<"pre">) {
  const child = Array.isArray(children) ? children[0] : children;
  if (
    child &&
    typeof child === "object" &&
    "props" in child &&
    child.props &&
    typeof child.props === "object" &&
    "className" in child.props &&
    typeof child.props.className === "string" &&
    child.props.className.includes("language-mermaid")
  ) {
    const chart =
      "children" in child.props && typeof child.props.children === "string"
        ? child.props.children
        : "";
    return <MermaidDiagram chart={chart.trim()} />;
  }

  return (
    <pre
      {...props}
      className={cn(
        "overflow-x-auto rounded-lg border border-border bg-surface/80 p-4 text-sm",
        props.className,
      )}
    >
      {children}
    </pre>
  );
}

type MdxComponentsMap = Record<string, ComponentType<Record<string, unknown>>>;

export function getMdxComponents({ kind, metrics }: MdxContext): MdxComponentsMap {
  const shared: MdxComponentsMap = {
    pre: Pre as ComponentType<Record<string, unknown>>,
    a: ({
      href,
      children,
      ...props
    }: AnchorHTMLAttributes<HTMLAnchorElement> & { href?: string }) => {
      const isExternal = href?.startsWith("http");
      if (isExternal) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
            {children}
          </a>
        );
      }
      return (
        <Link href={href ?? "#"} {...props}>
          {children}
        </Link>
      );
    },
  };

  if (kind === "case-study") {
    return { ...shared, ...createCaseStudyComponents(metrics) } as unknown as MdxComponentsMap;
  }

  return shared;
}
