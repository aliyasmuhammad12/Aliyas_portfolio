import Link from "next/link";

import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Section } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { finalCtaContent } from "@/content/home";

export function FinalCtaSection() {
  return (
    <Section className="pb-24 md:pb-32">
      <ScrollReveal>
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface px-6 py-12 text-center md:px-12 md:py-16">
          <div className="hero-glow pointer-events-none absolute inset-0 opacity-60" aria-hidden />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {finalCtaContent.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              {finalCtaContent.subheading}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={finalCtaContent.primary.href}>{finalCtaContent.primary.label}</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href={finalCtaContent.secondary.href}>
                  {finalCtaContent.secondary.label}
                </Link>
              </Button>
            </div>
            {/* TODO: Replace with Cal.com or booking link when ready. */}
          </div>
        </div>
      </ScrollReveal>
    </Section>
  );
}
