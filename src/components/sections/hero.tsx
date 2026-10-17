import Link from "next/link";

import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { heroContent } from "@/content/home";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <ScrollReveal>
          <p className="mb-4 text-sm font-medium text-accent">{siteConfig.title}</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.08]">
            {siteConfig.tagline}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {heroContent.subheading}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">{siteConfig.locationNote}</p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <Link href={heroContent.primaryCta.href}>{heroContent.primaryCta.label}</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href={heroContent.secondaryCta.href}>{heroContent.secondaryCta.label}</Link>
            </Button>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            {siteConfig.availability.status} · {siteConfig.availability.responseTime}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
