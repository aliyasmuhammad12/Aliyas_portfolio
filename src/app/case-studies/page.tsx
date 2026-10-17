import type { Metadata } from "next";

import { ContentCard } from "@/components/content/content-card";
import { Section, SectionHeader } from "@/components/shared/section";
import { siteConfig } from "@/config/site";
import { getCachedContentSummaries } from "@/lib/content/cached-posts";

export const metadata: Metadata = {
  title: "Case Studies",
  description: `Production AI and full-stack work by ${siteConfig.name}.`,
};

export default async function CaseStudiesPage() {
  const studies = await getCachedContentSummaries("case-study");

  return (
    <Section ariaLabelledBy="case-studies-index-heading" className="pt-12 md:pt-16">
      <SectionHeader
        id="case-studies-index-heading"
        eyebrow="Work"
        title="Case studies"
        description="How I ship RAG, control LLM costs, and take AI prototypes to production."
      />
      {studies.length === 0 ? (
        <p className="text-muted-foreground">Case studies coming soon.</p>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {studies.map((study) => (
            <li key={study.slug}>
              <ContentCard post={study} hrefPrefix="/case-studies" />
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
