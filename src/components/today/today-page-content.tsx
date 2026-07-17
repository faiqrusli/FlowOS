"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type KpiCellKey } from "@/components/dashboard/dashboard-kpi-strip";
import { ErrorBanner } from "@/components/shared/error-banner";
import { TodayStatusRail } from "@/components/today/today-status-rail";
import type { WorkplaceHabitsCardHandle } from "@/components/workplace/workplace-habits-card";
import type { WorkplaceTasksCardHandle } from "@/components/workplace/workplace-tasks-card";
import { WorkplacePageContent } from "@/components/workplace/workplace-page-content";
import { useFocusSessionContext } from "@/contexts/focus-session-context";
import { useGlobalRightSidebar } from "@/contexts/global-right-sidebar-context";
import { computeOnTrackStatus } from "@/lib/dashboard-command";
import { DashboardError, fetchDashboardData } from "@/lib/dashboard";
import { getTodayBreakDisplaySeconds, getTodayFocusDisplaySeconds } from "@/lib/focus-active-session";
import {
  scrollToTodayTarget,
  TODAY_FOCUS_ANCHOR_ID,
} from "@/lib/today-in-place";
import type { DashboardData } from "@/types/dashboard";

export function TodayPageContent() {
  const { activeSession, lastSavedSession, tick } = useFocusSessionContext();
  const { openReflection } = useGlobalRightSidebar();
  const tasksTabRef = useRef<WorkplaceTasksCardHandle>(null);
  const habitsTabRef = useRef<WorkplaceHabitsCardHandle>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const appliedSavedSessionIdRef = useRef<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const dashboard = await fetchDashboardData();
      setData(dashboard);
    } catch (err) {
      setError(
        err instanceof DashboardError ? err.message : "Failed to load today."
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const displayFocusSeconds = useMemo(() => {
    void tick;
    return getTodayFocusDisplaySeconds(
      data?.progress.focusSeconds ?? 0,
      activeSession
    );
  }, [activeSession, data?.progress.focusSeconds, tick]);

  const displayBreakSeconds = useMemo(() => {
    void tick;
    return getTodayBreakDisplaySeconds(
      data?.progress.breakSeconds ?? 0,
      activeSession
    );
  }, [activeSession, data?.progress.breakSeconds, tick]);

  const railProgress = useMemo(() => {
    if (!data) return undefined;
    return {
      ...data.progress,
      focusSeconds: displayFocusSeconds,
      breakSeconds: displayBreakSeconds,
    };
  }, [data, displayBreakSeconds, displayFocusSeconds]);

  useEffect(() => {
    if (!lastSavedSession?.id) return;
    if (appliedSavedSessionIdRef.current === lastSavedSession.id) return;
    appliedSavedSessionIdRef.current = lastSavedSession.id;

    void fetchDashboardData()
      .then((dashboard) => setData(dashboard))
      .catch(() => {
        /* keep optimistic live overlay until next full load */
      });
  }, [lastSavedSession]);

  const onTrack = useMemo(
    () =>
      data
        ? computeOnTrackStatus(
            {
              ...data.progress,
              focusSeconds: displayFocusSeconds,
              breakSeconds: displayBreakSeconds,
            },
            data.reflection
          )
        : { label: "Fresh start", description: "", percent: 0 },
    [data, displayBreakSeconds, displayFocusSeconds]
  );

  const handleKpiCellAction = useCallback(
    (cell: KpiCellKey) => {
      switch (cell) {
        case "tasks":
          tasksTabRef.current?.ensureTaskVisible("");
          return;
        case "habits":
          habitsTabRef.current?.ensureHabitVisible("");
          return;
        case "focus":
          scrollToTodayTarget(TODAY_FOCUS_ANCHOR_ID);
          return;
        case "reflection":
          openReflection();
          return;
        default:
          return;
      }
    },
    [openReflection]
  );

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <WorkplacePageContent
        tasksTabRef={tasksTabRef}
        habitsTabRef={habitsTabRef}
        statusRail={
          <div className="shrink-0 space-y-2">
            <TodayStatusRail
              loading={loading}
              onTrack={onTrack}
              stats={
                railProgress
                  ? {
                      progress: railProgress,
                      onCellAction: handleKpiCellAction,
                    }
                  : undefined
              }
            />

            {error ? (
              <div className="px-5">
                <ErrorBanner message={error} />
              </div>
            ) : null}
          </div>
        }
      />
    </div>
  );
}
