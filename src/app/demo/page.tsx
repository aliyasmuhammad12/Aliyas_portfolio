import type { Metadata } from "next";

import { DemoPageClient } from "@/components/chat/demo-page-client";
import { Section, SectionHeader } from "@/components/shared/section";

export const metadata: Metadata = {
  title: "Ask My Portfolio demo",
  description: "Live RAG demo and how this portfolio chatbot is built.",
};

export default function DemoPage() {
  return (
    <Section ariaLabelledBy="demo-heading" className="pt-12 md:pt-16">
      <SectionHeader
        id="demo-heading"
        eyebrow="Live demo"
        title="Ask My Portfolio"
        description="Grounded answers from indexed site content—streaming, cited, and guarded for public traffic."
      />
      <DemoPageClient />
    </Section>
  );
}
