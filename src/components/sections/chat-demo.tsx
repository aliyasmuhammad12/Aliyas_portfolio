import Link from "next/link";

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
          description="Chat with a RAG bot trained on this site—stack, projects, and how I work. Full widget ships in a later pass; this is the anchor for the hero CTA."
        />
        <div
          className="rounded-xl border border-dashed border-border bg-surface/50 p-8 md:p-12"
          role="region"
          aria-label="Portfolio chat demo placeholder"
        >
          <p className="text-center text-muted-foreground">
            {/* TODO: Embed Ask My Portfolio chat UI (streaming, citations, rate limits). */}
            Chat interface coming soon. Try the button below once the widget is wired.
          </p>
          <div className="mt-6 flex justify-center">
            <Button variant="secondary" disabled aria-disabled="true">
              Open chat (TODO)
            </Button>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Prefer email?{" "}
            <Link href="/contact" className="text-accent hover:underline">
              Start a project
            </Link>
          </p>
        </div>
      </ScrollReveal>
    </Section>
  );
}
