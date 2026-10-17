import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
  ariaLabelledBy?: string;
};

export function Section({
  id,
  className,
  containerClassName,
  children,
  ariaLabelledBy,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("py-16 md:py-24", className)}
      aria-labelledby={ariaLabelledBy}
    >
      <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", containerClassName)}>
        {children}
      </div>
    </section>
  );
}

type SectionHeaderProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeader({ id, eyebrow, title, description, className }: SectionHeaderProps) {
  return (
    <header className={cn("mb-10 max-w-2xl md:mb-12", className)}>
      {eyebrow ? (
        <p className="mb-2 text-sm font-medium uppercase tracking-wider text-accent">{eyebrow}</p>
      ) : null}
      <h2 id={id} className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </header>
  );
}
