"use client";

import type { KpiCellKey } from "@/components/dashboard/dashboard-kpi-strip";
import { formatDuration } from "@/lib/focus-utils";
import { type } from "@/lib/typography";
import { cn } from "@/lib/utils";
import type { TodayProgress } from "@/types/dashboard";
import type { Reflection } from "@/types/reflection";

type TodayRailStatsRowProps = {
  progress: TodayProgress;
  reflection: Reflection | null;
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
  valueClassName,
}: {
  value: string;
  label: string;
  onClick?: () => void;
  valueClassName?: string;
}) {
  const content = (
    <>
      <span
        className={cn(
          "text-sm font-semibold tabular-nums text-foreground",
          valueClassName
        )}
      >
        {value}
      </span>
      <span className={type.meta}>{label}</span>
    </>
  );

  const className =
    "inline-flex items-baseline gap-1 rounded-md px-1 py-0.5 transition-colors hover:bg-muted/40";

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return <span className={className}>{content}</span>;
}

export function TodayRailStatsRow({
  progress,
  reflection,
  onCellAction,
}: TodayRailStatsRowProps) {
  const reflectionDone = Boolean(reflection);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 py-0.5 text-[13px] text-muted-foreground">
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
      <RailDivider />
      <InlineStatChip
        value={reflectionDone ? "Done" : "Pending"}
        label="Reflection"
        onClick={() => onCellAction("reflection")}
        valueClassName={reflectionDone ? "text-success" : undefined}
      />
    </div>
  );
}
