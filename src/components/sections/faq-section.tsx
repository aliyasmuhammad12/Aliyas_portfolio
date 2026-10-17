"use client";

import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Section, SectionHeader } from "@/components/shared/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqContent } from "@/content/home";

export function FaqSection() {
  return (
    <Section ariaLabelledBy="faq-heading">
      <ScrollReveal>
        <SectionHeader
          id="faq-heading"
          title={faqContent.heading}
          description={faqContent.subheading}
        />
        <Accordion type="single" collapsible className="max-w-3xl">
          {faqContent.items.map((item, index) => (
            <AccordionItem key={item.question} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollReveal>
    </Section>
  );
}
