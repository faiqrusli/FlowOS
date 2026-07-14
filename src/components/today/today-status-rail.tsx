"use client";

import type { KpiCellKey } from "@/components/dashboard/dashboard-kpi-strip";
import { TodayRailStatsRow } from "@/components/today/today-rail-stats-row";
import { formatTodayHeading } from "@/lib/date-utils";
import type { OnTrackStatus } from "@/lib/dashboard-command";
import { SHELL_HEADER_HEIGHT_PX } from "@/lib/shell-dimensions";
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
    <header
      className="flow-surface-nav flow-shell-topbar flex shrink-0 items-center overflow-hidden border-b border-border-subtle px-5"
      style={{ height: SHELL_HEADER_HEIGHT_PX }}
    >
      <div className="flex min-w-0 items-center gap-2 whitespace-nowrap text-sm leading-none text-muted-foreground">
        <span className="font-semibold text-foreground">{dateLabel}</span>
        <span aria-hidden className="text-muted-foreground/50">
          ·
        </span>
        <span className="font-normal">{onTrackLabel}</span>

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
