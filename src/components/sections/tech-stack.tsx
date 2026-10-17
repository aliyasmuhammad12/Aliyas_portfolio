import {
  Bot,
  Cloud,
  Code2,
  Database,
  Layers,
  Smartphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Section, SectionHeader } from "@/components/shared/section";
import { siteConfig } from "@/config/site";

const categoryIcons: Record<string, LucideIcon> = {
  AI: Bot,
  "Full-stack": Code2,
  "Data & Auth": Database,
  DevOps: Cloud,
  "Mobile & Desktop": Smartphone,
};

const categoryLabels: Record<string, string> = {
  DevOps: "Deployment",
};

export function TechStackSection() {
  const entries = Object.entries(siteConfig.skills);

  return (
    <Section className="border-y border-border bg-surface/20" ariaLabelledBy="tech-heading">
      <SectionHeader
        id="tech-heading"
        eyebrow="Stack"
        title="Tools I ship with"
        description="Grouped by what clients usually ask for—AI features, full-stack product work, data layer, and deployment."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map(([category, items], index) => {
          const Icon = categoryIcons[category] ?? Layers;
          return (
            <ScrollReveal key={category} delay={index * 0.05}>
              <article className="rounded-xl border border-border bg-background p-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="font-semibold text-foreground">
                    {categoryLabels[category] ?? category}
                  </h3>
                </div>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {items.map((item) => (
                    <li
                      key={item}
                      className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </ScrollReveal>
          );
        })}
      </div>
    </Section>
  );
}
