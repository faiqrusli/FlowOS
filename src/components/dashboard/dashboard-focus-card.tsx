"use client";

import {
  DashboardEmptyLine,
  DashboardMetric,
  DashboardPanel,
  DashboardSupportingText,
} from "@/components/dashboard/dashboard-card-shell";
import { useFocusSessionContext } from "@/contexts/focus-session-context";
import { formatDuration } from "@/lib/focus-utils";
import { type } from "@/lib/typography";
import { cn } from "@/lib/utils";
import type { DashboardFocusStats } from "@/types/dashboard";

type DashboardFocusCardProps = {
  stats: DashboardFocusStats;
};

function FocusStatsSummary({ stats }: { stats: DashboardFocusStats }) {
  const focusLabel = formatDuration(stats.totalFocusSeconds);
  const breakLabel =
    stats.totalBreakSeconds > 0
      ? formatDuration(stats.totalBreakSeconds)
      : null;

  return (
    <DashboardMetric>
      <span className="font-semibold">{focusLabel}</span>
      <span className="font-normal text-muted-foreground"> focused today</span>
      {breakLabel && (
        <>
          <span className="text-muted-foreground"> · </span>
          <span className="font-semibold">{breakLabel}</span>
          <span className="font-normal text-muted-foreground"> break</span>
        </>
      )}
    </DashboardMetric>
  );
}

export function DashboardFocusCard({ stats }: DashboardFocusCardProps) {
  const { dashboardActive } = useFocusSessionContext();
  const hasActivity = stats.sessionCount > 0 || dashboardActive.isActive;

  return (
    <DashboardPanel title="Focus" href="/focus" actionLabel="Open">
      {dashboardActive.isActive && (
        <div className="rounded-md border border-border/60 bg-muted/30 px-3 py-2.5">
          <p className={cn(type.contentPrimary, "text-foreground")}>
            {dashboardActive.label}
          </p>
          <DashboardSupportingText className="mt-1">
            {dashboardActive.statusLabel} ·{" "}
            {formatDuration(dashboardActive.remainingSeconds)} left
          </DashboardSupportingText>
        </div>
      )}

      {hasActivity ? (
        <>
          <FocusStatsSummary stats={stats} />
          <DashboardSupportingText>
            {stats.sessionCount}{" "}
            {stats.sessionCount === 1 ? "session" : "sessions"} completed
          </DashboardSupportingText>
        </>
      ) : (
        <DashboardEmptyLine message="No focus sessions yet today." />
      )}
    </DashboardPanel>
  );
}
