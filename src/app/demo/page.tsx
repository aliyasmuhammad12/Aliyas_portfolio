import type { Metadata } from "next";
import Link from "next/link";

import { Section, SectionHeader } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

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
        description="Chat with the RAG assistant on this site. Architecture and live stats appear here as telemetry ships."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-dashed border-border bg-surface/50 p-8">
          <h2 className="text-lg font-semibold text-foreground">Chat</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {/* TODO: Embed streaming chat widget with citations. */}
            Widget wiring in progress. Until then, use the home page anchor.
          </p>
          <Button asChild className="mt-4">
            <Link href="/#chat">Open chat on home</Link>
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-surface p-8">
          <h2 className="text-lg font-semibold text-foreground">How this is built</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Ingestion and chunking of site MDX content</li>
            <li>pgvector retrieval scoped to portfolio sources</li>
            <li>Citations, rate limits, daily budget kill-switch, caching</li>
            <li>Prompt-injection mitigations and request observability</li>
          </ul>
          <p className="mt-6 text-sm font-medium text-foreground">Live stats</p>
          <dl className="mt-2 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-background p-3">
              <dt className="text-xs text-muted-foreground">Avg latency</dt>
              <dd className="text-lg font-semibold text-accent">TODO: add metric</dd>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <dt className="text-xs text-muted-foreground">Avg cost per query</dt>
              <dd className="text-lg font-semibold text-accent">TODO: add metric</dd>
            </div>
          </dl>
          {/* TODO: Pull stats from DB once telemetry endpoint exists. */}
          <Link
            href={siteConfig.socials.github}
            className="mt-6 inline-block text-sm text-accent hover:underline"
          >
            GitHub {/* TODO: Link to RAG repo when public. */}
          </Link>
        </div>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Deep dive:{" "}
        <Link href="/case-studies/ask-my-portfolio" className="text-accent hover:underline">
          Ask My Portfolio case study
        </Link>
      </p>
    </Section>
  );
}
