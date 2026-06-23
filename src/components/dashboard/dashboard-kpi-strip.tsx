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

type DashboardKpiStripProps = {
  progress: TodayProgress;
  reflection: Reflection | null;
  onTrack: OnTrackStatus;
};

type KpiCellProps = {
  label: string;
  value: string;
  href?: string;
  icon: ComponentType<{ className?: string }>;
  accent?: "neutral" | "orange" | "emerald" | "status";
  statusClass?: string;
};

function KpiCell({
  label,
  value,
  href,
  icon: Icon,
  accent = "neutral",
  statusClass,
}: KpiCellProps) {
  const accentClass =
    accent === "orange"
      ? "text-orange-600"
      : accent === "emerald"
        ? "text-emerald-600"
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
    "min-w-0 flex-1 px-4 py-3 transition-colors hover:bg-muted/30";

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
      return "text-emerald-700";
    case "Making progress":
      return "text-amber-700";
    case "Needs focus":
      return "text-orange-700";
    default:
      return "text-foreground";
  }
}

export function DashboardKpiStrip({
  progress,
  reflection,
  onTrack,
}: DashboardKpiStripProps) {
  const reflectionDone = Boolean(reflection);
  const onTrackValue =
    onTrack.percent > 0 ? `${onTrack.percent}%` : onTrack.label;

  return (
    <section className="overflow-hidden rounded-lg border border-border/60 bg-card">
      <div className="flex flex-col divide-y divide-border/60 sm:flex-row sm:divide-x sm:divide-y-0">
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
          href="/tasks"
          icon={CheckSquare}
        />
        <KpiCell
          label="Habits"
          value={`${progress.habitsCompleted}/${progress.habitsTotal}`}
          href="/habits"
          icon={Flame}
          accent="orange"
        />
        <KpiCell
          label="Focus"
          value={formatDuration(progress.focusSeconds)}
          href="/focus"
          icon={Timer}
        />
        <KpiCell
          label="Reflection"
          value={reflectionDone ? "Done" : "Pending"}
          href="/reflection"
          icon={NotebookPen}
          accent={reflectionDone ? "emerald" : "neutral"}
        />
      </div>
      <p className={cn("border-t border-border/60 px-4 py-2", type.meta)}>
        {onTrack.description}
      </p>
    </section>
  );
}
