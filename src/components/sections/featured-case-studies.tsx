import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Section, SectionHeader } from "@/components/shared/section";
import type { CaseStudy } from "@/lib/case-studies";

type FeaturedCaseStudiesSectionProps = {
  studies: CaseStudy[];
};

export function FeaturedCaseStudiesSection({ studies }: FeaturedCaseStudiesSectionProps) {
  return (
    <Section ariaLabelledBy="case-studies-heading">
      <SectionHeader
        id="case-studies-heading"
        eyebrow="Case studies"
        title="Featured work"
        description="Real products in production—ride-hailing in the mountains, hospitality ops, and the RAG demo on this site."
      />
      <ul className="grid gap-6 md:grid-cols-3">
        {studies.map((study, index) => (
          <ScrollReveal key={study.slug} delay={index * 0.08}>
            <li className="flex h-full flex-col rounded-xl border border-border bg-surface p-6">
              <h3 className="text-lg font-semibold text-foreground">
                <Link
                  href={`/case-studies/${study.slug}`}
                  className="hover:text-accent"
                >
                  {study.title}
                </Link>
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {study.excerpt}
              </p>
              {study.tags && study.tags.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {study.tags.slice(0, 4).map((tag) => (
                    <li
                      key={tag}
                      className="rounded-md bg-background px-2 py-0.5 text-xs text-muted-foreground ring-1 ring-border"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
                <Link
                  href={`/case-studies/${study.slug}`}
                  className="font-medium text-accent hover:underline"
                >
                  Read case study
                </Link>
                {study.externalUrl ? (
                  <Link
                    href={study.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    Live site
                    <ArrowUpRight className="size-3.5" aria-hidden />
                  </Link>
                ) : null}
              </div>
            </li>
          </ScrollReveal>
        ))}
      </ul>
      {/* TODO: Add client logos or testimonial strip when approved for public use. */}
    </Section>
  );
}
