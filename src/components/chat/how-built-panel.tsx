"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import type { ChatResponseStats } from "@/components/chat/portfolio-chat";
import { chatConfig } from "@/config/chat";
import { cn } from "@/lib/utils";

type HowBuiltPanelProps = {
  lastStats: ChatResponseStats | null;
  aggregate?: {
    count: number;
    avgLatencyMs: number | null;
    avgCostUsd: number | null;
  } | null;
};

export function HowBuiltPanel({ lastStats, aggregate }: HowBuiltPanelProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-xl border border-border bg-surface">
      <button
        type="button"
        className="flex w-full items-center justify-between px-5 py-4 text-left"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="font-semibold text-foreground">How this is built</span>
        <ChevronDown
          className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open ? (
        <div className="space-y-6 border-t border-border px-5 pb-5 pt-4">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Last response
            </p>
            {lastStats ? (
              <dl className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-background p-3">
                  <dt className="text-xs text-muted-foreground">Latency</dt>
                  <dd className="text-lg font-semibold text-accent">{lastStats.latencyMs} ms</dd>
                </div>
                <div className="rounded-lg border border-border bg-background p-3">
                  <dt className="text-xs text-muted-foreground">Tokens</dt>
                  <dd className="text-lg font-semibold text-accent">
                    {lastStats.promptTokens + lastStats.completionTokens}
                  </dd>
                </div>
                <div className="rounded-lg border border-border bg-background p-3">
                  <dt className="text-xs text-muted-foreground">Est. cost</dt>
                  <dd className="text-lg font-semibold text-accent">
                    ${lastStats.estimatedCostUsd.toFixed(5)}
                    {lastStats.cached ? " (cached)" : ""}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">Send a message to see live stats.</p>
            )}
          </div>

          {aggregate && aggregate.count > 0 ? (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                24h aggregate (logged requests)
              </p>
              <dl className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-background p-3">
                  <dt className="text-xs text-muted-foreground">Avg latency</dt>
                  <dd className="text-lg font-semibold text-foreground">
                    {aggregate.avgLatencyMs ?? "TODO: add metric"} ms
                  </dd>
                </div>
                <div className="rounded-lg border border-border bg-background p-3">
                  <dt className="text-xs text-muted-foreground">Avg cost / query</dt>
                  <dd className="text-lg font-semibold text-foreground">
                    {aggregate.avgCostUsd != null
                      ? `$${aggregate.avgCostUsd.toFixed(5)}`
                      : "TODO: add metric"}
                  </dd>
                </div>
              </dl>
            </div>
          ) : null}

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Guardrails
            </p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {chatConfig.guardrails.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-accent" aria-hidden>
                    ·
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
