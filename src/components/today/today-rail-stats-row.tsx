"use client";

import type { KpiCellKey } from "@/components/dashboard/dashboard-kpi-strip";
import { formatDuration } from "@/lib/focus-utils";
import { type } from "@/lib/typography";
import type { TodayProgress } from "@/types/dashboard";

type TodayRailStatsRowProps = {
  progress: TodayProgress;
  onCellAction: (cell: KpiCellKey) => void;
};

function RailDivider() {
  return (
    <span
      aria-hidden
      className="hidden h-3 w-px shrink-0 bg-border/60 sm:block"
    />
  );
}

function InlineStatChip({
  value,
  label,
  onClick,
}: {
  value: string;
  label: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span className="text-sm font-semibold tabular-nums text-foreground">
        {value}
      </span>
      <span className={type.meta}>{label}</span>
    </>
  );

  const className =
    "inline-flex items-baseline gap-1 rounded-md px-1 py-0.5 transition-colors hover:bg-surface-hover";

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return <span className={className}>{content}</span>;
}

/** Inline Tasks / Habits / Focus chips for the Today status rail (no Reflection). */
export function TodayRailStatsRow({
  progress,
  onCellAction,
}: TodayRailStatsRowProps) {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
      <InlineStatChip
        value={`${progress.tasksCompleted}/${progress.tasksTotal}`}
        label="Tasks"
        onClick={() => onCellAction("tasks")}
      />
      <RailDivider />
      <InlineStatChip
        value={`${progress.habitsCompleted}/${progress.habitsTotal}`}
        label="Habits"
        onClick={() => onCellAction("habits")}
      />
      <RailDivider />
      <InlineStatChip
        value={formatDuration(progress.focusSeconds)}
        label="Focus"
        onClick={() => onCellAction("focus")}
      />
    </span>
  );
}
