"use client";

import { LayoutGrid } from "lucide-react";
import type { KpiCellKey } from "@/components/dashboard/dashboard-kpi-strip";
import { TodayEscapeLink } from "@/components/shared/today-escape-link";
import { TodayRailStatsRow } from "@/components/today/today-rail-stats-row";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatTodayHeading } from "@/lib/date-utils";
import type { OnTrackStatus } from "@/lib/dashboard-command";
import type { WorkplaceDensity } from "@/lib/workplace-density";
import { cn } from "@/lib/utils";
import type { TodayProgress } from "@/types/dashboard";
import type { Reflection } from "@/types/reflection";

const DENSITY_LABELS: Record<WorkplaceDensity, string> = {
  full: "Full",
  work: "Work",
  focus: "Focus",
};

type TodayStatusRailProps = {
  loading?: boolean;
  onTrack: OnTrackStatus;
  density: WorkplaceDensity;
  onDensityChange: (density: WorkplaceDensity) => void;
  stats?: {
    progress: TodayProgress;
    reflection: Reflection | null;
    showKpiStats: boolean;
    onCellAction: (cell: KpiCellKey) => void;
  };
};

export function TodayStatusRail({
  loading,
  onTrack,
  density,
  onDensityChange,
  stats,
}: TodayStatusRailProps) {
  const dateLabel = loading ? "…" : formatTodayHeading();
  const onTrackLabel = loading ? "…" : `${onTrack.percent}% on track`;
  const showStatsRow = stats?.showKpiStats && !loading;

  return (
    <header className="shrink-0 space-y-0.5 px-10">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 py-1 text-[13px] text-muted-foreground">
        <span className="font-medium text-foreground">{dateLabel}</span>
        <span aria-hidden className="text-muted-foreground/50">
          ·
        </span>
        <span>{onTrackLabel}</span>
        <span aria-hidden className="text-muted-foreground/50">
          ·
        </span>
        <TodayEscapeLink
          href="/schedule"
          className="h-7 rounded-full px-2.5 text-[13px]"
        >
          Timeline
        </TodayEscapeLink>
        <span aria-hidden className="text-muted-foreground/50">
          ·
        </span>
        <TodayEscapeLink
          href="/notes"
          className="h-7 rounded-full px-2.5 text-[13px]"
        >
          Notes
        </TodayEscapeLink>

        <div className="ml-auto flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "inline-flex h-7 items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-2.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              )}
              aria-label={`Workspace density: ${DENSITY_LABELS[density]}`}
              title="Workspace density"
            >
              <LayoutGrid className="size-3.5 shrink-0" />
              {DENSITY_LABELS[density]}
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end" className="min-w-[8rem]">
              {(Object.keys(DENSITY_LABELS) as WorkplaceDensity[]).map((preset) => (
                <DropdownMenuItem
                  key={preset}
                  onClick={() => onDensityChange(preset)}
                  className={cn(
                    "text-[13px]",
                    preset === density && "bg-muted font-medium"
                  )}
                >
                  {DENSITY_LABELS[preset]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {showStatsRow ? (
        <TodayRailStatsRow
          progress={stats.progress}
          reflection={stats.reflection}
          onCellAction={stats.onCellAction}
        />
      ) : null}
    </header>
  );
}
