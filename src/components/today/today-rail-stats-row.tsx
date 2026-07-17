"use client";

import type { KpiCellKey } from "@/components/dashboard/dashboard-kpi-strip";
import { formatDurationCompact } from "@/lib/focus-utils";
import type { TodayProgress } from "@/types/dashboard";

type TodayRailStatsRowProps = {
  progress: TodayProgress;
  onCellAction: (cell: KpiCellKey) => void;
};

function RailDivider() {
  return (
    <span aria-hidden className="text-muted-foreground/50">
      ·
    </span>
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
      <span className="font-semibold tabular-nums text-foreground">
        {value}
      </span>
      <span className="text-muted-foreground">{label}</span>
    </>
  );

  const className =
    "inline-flex items-baseline gap-1 rounded-md px-0.5 py-0.5 transition-colors hover:bg-surface-hover";

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return <span className={className}>{content}</span>;
}

/** Inline Tasks │ Habits │ Focus │ Break chips for the Today status rail. */
export function TodayRailStatsRow({
  progress,
  onCellAction,
}: TodayRailStatsRowProps) {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
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
        value={formatDurationCompact(progress.focusSeconds)}
        label="Focus"
        onClick={() => onCellAction("focus")}
      />
      <RailDivider />
      <InlineStatChip
        value={formatDurationCompact(progress.breakSeconds)}
        label="Break"
        onClick={() => onCellAction("focus")}
      />
    </span>
  );
}
