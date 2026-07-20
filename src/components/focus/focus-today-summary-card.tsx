"use client";

import { formatDuration } from "@/lib/focus-utils";
import { type as typography } from "@/lib/typography";
import type { FocusTodaySummary } from "@/lib/focus-analytics";

type FocusTodaySummaryCardProps = {
  summary: FocusTodaySummary;
  loading?: boolean;
};

const STATS = [
  {
    key: "focused",
    label: "Focused",
    value: (s: FocusTodaySummary) => formatDuration(s.totalFocusSeconds),
  },
  {
    key: "sessions",
    label: "Sessions",
    value: (s: FocusTodaySummary) => String(s.sessionCount),
  },
  {
    key: "breaks",
    label: "Breaks",
    value: (s: FocusTodaySummary) => String(s.breakCount),
  },
  {
    key: "longest",
    label: "Longest",
    value: (s: FocusTodaySummary) => formatDuration(s.longestSessionSeconds),
  },
] as const;

export function FocusTodaySummaryCard({
  summary,
  loading,
}: FocusTodaySummaryCardProps) {
  return (
    <section className="rounded-xl bg-surface-section px-4 py-5 sm:px-5">
      <h2 className={typography.sectionTitle}>Today&apos;s focus</h2>
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {STATS.map((stat) => (
          <div
            key={stat.key}
            className="rounded-lg bg-surface-base px-3 py-2.5"
          >
            <p className={typography.meta}>{stat.label}</p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums text-foreground">
              {loading ? "—" : stat.value(summary)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
