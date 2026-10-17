import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Section, SectionHeader } from "@/components/shared/section";
import { problemSectionContent } from "@/content/home";

export function ProblemSection() {
  return (
    <Section className="bg-surface/25" ariaLabelledBy="problem-heading">
      <SectionHeader
        id="problem-heading"
        title={problemSectionContent.heading}
        description={problemSectionContent.subheading}
      />
      <ul className="grid gap-6 md:grid-cols-2">
        {problemSectionContent.items.map((item, index) => (
          <ScrollReveal key={item.problem} delay={index * 0.06}>
            <li className="rounded-xl border border-border bg-background p-6">
              <h3 className="text-lg font-semibold text-foreground">{item.problem}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground/80">What goes wrong: </span>
                {item.symptom}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                <span className="font-medium text-accent">How I fix it: </span>
                {item.fix}
              </p>
            </li>
          </ScrollReveal>
        ))}
      </ul>
    </Section>
  );
}
