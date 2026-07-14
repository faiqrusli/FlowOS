"use client";

import type { KpiCellKey } from "@/components/dashboard/dashboard-kpi-strip";
import { TodayRailStatsRow } from "@/components/today/today-rail-stats-row";
import { formatTodayHeading } from "@/lib/date-utils";
import type { OnTrackStatus } from "@/lib/dashboard-command";
import type { TodayProgress } from "@/types/dashboard";

type TodayStatusRailProps = {
  loading?: boolean;
  onTrack: OnTrackStatus;
  stats?: {
    progress: TodayProgress;
    onCellAction: (cell: KpiCellKey) => void;
  };
};

export function TodayStatusRail({
  loading,
  onTrack,
  stats,
}: TodayStatusRailProps) {
  const dateLabel = loading ? "…" : formatTodayHeading();
  const onTrackLabel = loading ? "…" : `${onTrack.percent}% on track`;
  const showStats = Boolean(stats && !loading);

  return (
    <header className="flow-surface-nav shrink-0 border-b border-border-subtle px-10">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 py-2.5 text-[13px] text-muted-foreground">
        <span className="font-medium text-foreground">{dateLabel}</span>
        <span aria-hidden className="text-muted-foreground/50">
          ·
        </span>
        <span>{onTrackLabel}</span>

        {showStats && stats ? (
          <>
            <span aria-hidden className="text-muted-foreground/50">
              ·
            </span>
            <TodayRailStatsRow
              progress={stats.progress}
              onCellAction={stats.onCellAction}
            />
          </>
        ) : null}
      </div>
    </header>
  );
}
