"use client";

import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type MermaidDiagramProps = {
  chart: string;
  className?: string;
};

export function MermaidDiagram({ chart, className }: MermaidDiagramProps) {
  const id = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chart.trim()) return;

    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "strict",
          fontFamily: "inherit",
        });

        if (cancelled || !containerRef.current) return;

        const { svg } = await mermaid.render(`mermaid-${id}`, chart);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch {
        if (!cancelled) {
          setError("Could not render diagram.");
        }
      }
    }

    void render();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <pre className="overflow-x-auto rounded-lg border border-border bg-surface p-4 text-xs text-muted-foreground">
        {chart}
      </pre>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "not-prose overflow-x-auto rounded-xl border border-border bg-surface/40 p-4 [&_svg]:mx-auto",
        className,
      )}
      aria-label="Architecture diagram"
    />
  );
}
