import type { ContentMetric } from "@/lib/content/schemas";

type MetricsGridProps = {
  metrics: ContentMetric[];
};

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-xl border border-border bg-background p-4"
        >
          <dt className="text-sm text-muted-foreground">{metric.label}</dt>
          <dd className="mt-1 text-2xl font-semibold tracking-tight text-accent">
            {metric.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
