"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { HowBuiltPanel } from "@/components/chat/how-built-panel";
import { PortfolioChat, type ChatResponseStats } from "@/components/chat/portfolio-chat";
import { siteConfig } from "@/config/site";

export function DemoPageClient() {
  const [lastStats, setLastStats] = useState<ChatResponseStats | null>(null);
  const [aggregate, setAggregate] = useState<{
    count: number;
    avgLatencyMs: number | null;
    avgCostUsd: number | null;
  } | null>(null);

  useEffect(() => {
    void fetch("/api/chat/stats")
      .then((res) => res.json())
      .then((data) => setAggregate(data.aggregate ?? null))
      .catch(() => setAggregate(null));
  }, [lastStats]);

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <PortfolioChat className="min-h-[520px]" onStatsUpdate={setLastStats} />
      </div>
      <div className="lg:col-span-2">
        <HowBuiltPanel lastStats={lastStats} aggregate={aggregate} />
        <p className="mt-4 text-sm text-muted-foreground">
          <Link href="/case-studies/ask-my-portfolio" className="text-accent hover:underline">
            Read the case study
          </Link>{" "}
          ·{" "}
          <Link href={siteConfig.socials.github} className="text-accent hover:underline">
            GitHub
          </Link>
        </p>
      </div>
    </div>
  );
}
