import type { ComponentType } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Flame,
  NotebookPen,
  Timer,
  TrendingUp,
} from "lucide-react";
import { formatDuration } from "@/lib/focus-utils";
import type { OnTrackStatus } from "@/lib/dashboard-command";
import { type } from "@/lib/typography";
import type { TodayProgress } from "@/types/dashboard";
import type { Reflection } from "@/types/reflection";
import { cn } from "@/lib/utils";

export type KpiCellKey = "tasks" | "habits" | "focus" | "reflection";

type DashboardKpiStripProps = {
  progress: TodayProgress;
  reflection: Reflection | null;
  onTrack: OnTrackStatus;
  onCellAction?: (cell: KpiCellKey) => void;
};

type KpiCellProps = {
  label: string;
  value: string;
  href?: string;
  onAction?: () => void;
  icon: ComponentType<{ className?: string }>;
  accent?: "neutral" | "warning" | "success" | "status";
  statusClass?: string;
};

function KpiCell({
  label,
  value,
  href,
  onAction,
  icon: Icon,
  accent = "neutral",
  statusClass,
}: KpiCellProps) {
  const accentClass =
    accent === "warning"
      ? "text-warning"
      : accent === "success"
        ? "text-success"
        : accent === "status"
          ? ""
          : "text-muted-foreground";

  const content = (
    <>
      <div className="flex items-center gap-1.5">
        <Icon className={cn("size-3.5 shrink-0", accentClass, statusClass)} />
        <span className={type.kpiLabel}>{label}</span>
      </div>
      <p className={cn("mt-1.5", type.kpiValue, statusClass)}>{value}</p>
    </>
  );

  const cellClassName =
    "min-w-0 flex-1 px-4 py-3 transition-colors hover:bg-surface-hover/30";

  if (onAction) {
    return (
      <button type="button" onClick={onAction} className={cellClassName}>
        {content}
      </button>
    );
  }

  if (href) {
    return (
      <Link href={href} className={cellClassName}>
        {content}
      </Link>
    );
  }

  return <div className={cellClassName}>{content}</div>;
}

function getOnTrackClass(label: OnTrackStatus["label"]): string {
  switch (label) {
    case "On track":
      return "text-success";
    case "Making progress":
      return "text-warning";
    case "Needs focus":
      return "text-warning";
    default:
      return "text-foreground";
  }
}

export function DashboardKpiStrip({
  progress,
  reflection,
  onTrack,
  onCellAction,
}: DashboardKpiStripProps) {
  const reflectionDone = Boolean(reflection);
  const onTrackValue =
    onTrack.percent > 0 ? `${onTrack.percent}%` : onTrack.label;

  return (
    <section className="overflow-hidden rounded-lg border-0 bg-surface-section shadow-none">
      <div className="flex flex-col divide-y divide-divider sm:flex-row sm:divide-x sm:divide-y-0">
        <KpiCell
          label="Today"
          value={onTrackValue}
          icon={TrendingUp}
          accent="status"
          statusClass={getOnTrackClass(onTrack.label)}
        />
        <KpiCell
          label="Tasks"
          value={`${progress.tasksCompleted}/${progress.tasksTotal}`}
          href={onCellAction ? undefined : "/tasks"}
          onAction={onCellAction ? () => onCellAction("tasks") : undefined}
          icon={CheckSquare}
        />
        <KpiCell
          label="Habits"
          value={`${progress.habitsCompleted}/${progress.habitsTotal}`}
          href={onCellAction ? undefined : "/habits"}
          onAction={onCellAction ? () => onCellAction("habits") : undefined}
          icon={Flame}
          accent="warning"
        />
        <KpiCell
          label="Focus"
          value={formatDuration(progress.focusSeconds)}
          href={onCellAction ? undefined : "/focus"}
          onAction={onCellAction ? () => onCellAction("focus") : undefined}
          icon={Timer}
        />
        <KpiCell
          label="Reflection"
          value={reflectionDone ? "Done" : "Pending"}
          href={onCellAction ? undefined : "/reflection"}
          onAction={onCellAction ? () => onCellAction("reflection") : undefined}
          icon={NotebookPen}
          accent={reflectionDone ? "success" : "neutral"}
        />
      </div>
      <p className={cn("border-t border-border/60 px-4 py-2", type.meta)}>
        {onTrack.description}
      </p>
    </section>
  );
}
