import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Section, SectionHeader } from "@/components/shared/section";
import { twoWaysContent } from "@/content/home";

export function TwoWaysSection() {
  return (
    <Section ariaLabelledBy="two-ways-heading">
      <SectionHeader
        id="two-ways-heading"
        title={twoWaysContent.heading}
        description={twoWaysContent.subheading}
      />
      <ul className="grid gap-6 md:grid-cols-2">
        {twoWaysContent.cards.map((card, index) => (
          <ScrollReveal key={card.href} delay={index * 0.08}>
            <li>
              <Link
                href={card.href}
                className="group flex h-full flex-col rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent/40 hover:bg-surface/80"
              >
                <h3 className="text-xl font-semibold text-foreground group-hover:text-accent">
                  {card.title}
                </h3>
                <p className="mt-3 flex-1 text-muted-foreground">{card.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {card.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span className="text-accent" aria-hidden>
                        ·
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent">
                  Learn more
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          </ScrollReveal>
        ))}
      </ul>
    </Section>
  );
}
