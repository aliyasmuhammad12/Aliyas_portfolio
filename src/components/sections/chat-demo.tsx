import Link from "next/link";

import { PortfolioChat } from "@/components/chat/portfolio-chat";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Section, SectionHeader } from "@/components/shared/section";
import { Button } from "@/components/ui/button";

export function ChatDemoSection() {
  return (
    <Section id="chat" className="border-y border-border" ariaLabelledBy="chat-heading">
      <ScrollReveal>
        <SectionHeader
          id="chat-heading"
          eyebrow="Live demo"
          title="Ask My Portfolio"
          description="Chat with a RAG bot trained on this site—stack, projects, and how I work."
        />
        <div className="mx-auto max-w-3xl">
          <PortfolioChat className="min-h-[460px]" />
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm">
            <Button asChild variant="secondary" size="sm">
              <Link href="/demo">Full demo &amp; architecture</Link>
            </Button>
            <Link href="/contact" className="text-muted-foreground hover:text-accent">
              Start a project
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </Section>
  );
}
