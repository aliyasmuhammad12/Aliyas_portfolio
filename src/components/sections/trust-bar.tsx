import { CountUp } from "@/components/shared/count-up";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Section } from "@/components/shared/section";
import { siteConfig } from "@/config/site";

export function TrustBarSection() {
  return (
    <Section className="border-b border-border bg-surface/30 py-12 md:py-14" ariaLabelledBy="trust-heading">
      <h2 id="trust-heading" className="sr-only">
        Track record
      </h2>
      <ul className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {siteConfig.stats.map((stat, index) => (
          <ScrollReveal key={stat.id} delay={index * 0.06}>
            <li className="text-center md:text-left">
              <p className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                {stat.value !== null ? (
                  <CountUp value={stat.value} suffix={stat.suffix ?? ""} />
                ) : (
                  stat.display
                )}
              </p>
              <p className="mt-2 text-sm leading-snug text-muted-foreground">{stat.label}</p>
            </li>
          </ScrollReveal>
        ))}
      </ul>
    </Section>
  );
}
