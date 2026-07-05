"use client";

import { ArrowRight, Check, X } from "lucide-react";
import type { KpiCellKey } from "@/components/dashboard/dashboard-kpi-strip";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/focus-utils";
import type { NextAction } from "@/lib/dashboard-command";
import { type } from "@/lib/typography";
import { cn } from "@/lib/utils";
import type { TodayProgress } from "@/types/dashboard";
import type { Reflection } from "@/types/reflection";

type TodayRailStatsRowProps = {
  progress: TodayProgress;
  reflection: Reflection | null;
  showKpiStats: boolean;
  showNextAction: boolean;
  nextAction: NextAction;
  onCellAction: (cell: KpiCellKey) => void;
  onNextAction: (action: NextAction) => void;
  onDismiss?: () => void;
  onQuickComplete?: () => void;
  completing?: boolean;
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
  showKpiStats,
  showNextAction,
  nextAction,
  onCellAction,
  onNextAction,
  onDismiss,
  onQuickComplete,
  completing,
}: TodayRailStatsRowProps) {
  if (!showKpiStats && !showNextAction) return null;

  const reflectionDone = Boolean(reflection);
  const useInPlace = Boolean(nextAction.inPlaceAction);
  const showQuickComplete =
    showNextAction &&
    onQuickComplete &&
    nextAction.entityId &&
    (nextAction.type === "task" || nextAction.type === "habit");

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 py-0.5 text-[13px] text-muted-foreground">
      {showKpiStats ? (
        <>
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
        </>
      ) : null}

      {showNextAction ? (
        <div
          className={cn(
            "flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1",
            showKpiStats ? "sm:ml-auto" : ""
          )}
        >
          {showKpiStats ? (
            <span
              aria-hidden
              className="hidden h-3 w-px shrink-0 bg-border/60 sm:block"
            />
          ) : null}
          <span className={cn(type.metaMedium, "shrink-0")}>Next:</span>
          <span className="min-w-0 truncate text-sm font-medium text-foreground">
            {nextAction.title}
          </span>
          <div className="flex shrink-0 items-center gap-1">
            {showQuickComplete ? (
              <Button
                type="button"
                variant="outline"
                size="icon-xs"
                disabled={completing}
                onClick={onQuickComplete}
                aria-label="Mark complete"
                title="Mark complete"
              >
                <Check className="size-3" />
              </Button>
            ) : null}
            {useInPlace ? (
              <Button
                type="button"
                size="xs"
                className="h-6 gap-1 px-2 text-xs"
                onClick={() => onNextAction(nextAction)}
              >
                {nextAction.actionLabel}
                <ArrowRight className="size-3" />
              </Button>
            ) : null}
            {onDismiss ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={onDismiss}
                aria-label="Dismiss"
                title="Dismiss"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
