"use client";

import { type as typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

const PLACEHOLDERS = [
  "AI focus insights",
  "Achievement badges",
  "Compare days",
  "Focus forecasts",
  "Team focus",
] as const;

export function FocusFuturePlaceholders() {
  return (
    <section className="rounded-xl bg-surface-section px-4 py-5 sm:px-5">
      <h2 className={cn(typography.sectionTitle, "text-foreground-secondary")}>
        Coming soon
      </h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {PLACEHOLDERS.map((item) => (
          <span
            key={item}
            className="rounded-md bg-surface-base px-3 py-1 text-xs text-foreground-secondary"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
