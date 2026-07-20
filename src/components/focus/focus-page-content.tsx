"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FocusAnalyticsStrip } from "@/components/focus/focus-analytics-strip";
import { FocusCurrentSessionCard } from "@/components/focus/focus-current-session-card";
import {
  FocusDailyHistoryPanel,
  useFocusSelectedDate,
} from "@/components/focus/focus-daily-history-panel";
import { FocusFuturePlaceholders } from "@/components/focus/focus-future-placeholders";
import { FocusHeatmap } from "@/components/focus/focus-heatmap";
import { FocusReflectionWeekBoard } from "@/components/focus/focus-reflection-week-board";
import { FocusSessionHistoryList } from "@/components/focus/focus-session-history-list";
import { FocusSettingsPanel } from "@/components/focus/focus-settings-panel";
import { FocusTodaySummaryCard } from "@/components/focus/focus-today-summary-card";
import { ErrorBanner } from "@/components/shared/error-banner";
import { PageHeader } from "@/components/shared/page-header";
import { useFocusSessionContext } from "@/contexts/focus-session-context";
import {
  computeFocusAnalytics,
  computeFocusTodaySummary,
} from "@/lib/focus-analytics";
import { getTodayDateString } from "@/lib/date-utils";
import {
  fetchFocusSessions,
  mergeFocusSessions,
} from "@/lib/focus-storage";
import { fetchReflections } from "@/lib/reflection-storage";
import type { FocusSession } from "@/types/focus";
import type { Reflection } from "@/types/reflection";

export function FocusPageContent() {
  const { lastSavedSession } = useFocusSessionContext();
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const todayKey = getTodayDateString();
  const { selectedDate, setSelectedDate } = useFocusSelectedDate(sessions, todayKey);

  const loadFocusHub = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [focusSessions, allReflections] = await Promise.all([
        fetchFocusSessions(),
        fetchReflections(),
      ]);
      setSessions(focusSessions);
      setReflections(allReflections);
    } catch {
      setError("Failed to load focus data.");
      setSessions([]);
      setReflections([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFocusHub();
  }, [loadFocusHub]);

  useEffect(() => {
    if (!lastSavedSession) return;
    setSessions((prev) => mergeFocusSessions(prev, [lastSavedSession]));
  }, [lastSavedSession]);

  const todaySummary = useMemo(
    () => computeFocusTodaySummary(sessions, todayKey),
    [sessions, todayKey]
  );
  const analytics = useMemo(
    () => computeFocusAnalytics(sessions),
    [sessions]
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-8">
      <PageHeader title="Focus" />

      {error ? <ErrorBanner message={error} /> : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <FocusCurrentSessionCard />
        <FocusTodaySummaryCard summary={todaySummary} loading={loading} />
      </div>

      <FocusAnalyticsStrip analytics={analytics} loading={loading} />

      <div className="grid gap-4 lg:grid-cols-2">
        <FocusDailyHistoryPanel
          sessions={sessions}
          loading={loading}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
        <FocusHeatmap sessions={sessions} loading={loading} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <FocusSessionHistoryList
          sessions={sessions}
          filterDate={selectedDate}
          loading={loading}
        />
        <FocusReflectionWeekBoard reflections={reflections} loading={loading} />
      </div>

      <FocusSettingsPanel />
      <FocusFuturePlaceholders />
    </div>
  );
}
