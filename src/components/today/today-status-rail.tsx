"use client";

import { useEffect, useRef, useState } from "react";
import type { KpiCellKey } from "@/components/dashboard/dashboard-kpi-strip";
import { TodayRailStatsRow } from "@/components/today/today-rail-stats-row";
import { formatTodayHeading } from "@/lib/date-utils";
import type { OnTrackStatus } from "@/lib/dashboard-command";
import { WORKPLACE_STATUS_RAIL_HIDE_BELOW_PX } from "@/lib/workplace-layout";
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
  const probeRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const dateLabel = loading ? "…" : formatTodayHeading();
  const onTrackLabel = loading ? "…" : `${onTrack.percent}% on track`;
  const showStats = Boolean(stats && !loading);

  useEffect(() => {
    const probe = probeRef.current;
    if (!probe) return;

    const layout =
      probe.closest<HTMLElement>("[data-workplace-layout]") ??
      probe.parentElement;
    if (!layout) return;

    const sync = () => {
      setVisible(layout.clientWidth > WORKPLACE_STATUS_RAIL_HIDE_BELOW_PX);
    };

    const observer = new ResizeObserver(sync);
    observer.observe(layout);
    sync();
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={probeRef} className="contents" aria-hidden />
      {visible ? (
        <header className="flex h-[49px] shrink-0 items-center border-b border-border-subtle bg-surface-nav px-5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted-foreground">
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
      ) : null}
    </>
  );
}
