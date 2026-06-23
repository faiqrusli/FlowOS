"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CustomFocusSession } from "@/components/focus/custom-focus-session";
import { FocusHistoryList } from "@/components/focus/focus-history-list";
import { FocusTodayBar } from "@/components/focus/focus-today-bar";
import { QuickFocusSession } from "@/components/focus/quick-focus-session";
import { ErrorBanner } from "@/components/shared/error-banner";
import { PageHeader } from "@/components/shared/page-header";
import { useFocusSessionContext } from "@/contexts/focus-session-context";
import { usePomodoroTimer } from "@/hooks/use-pomodoro-timer";
import { useQuickFocus } from "@/hooks/use-quick-focus";
import {
  formatDuration,
  getSessionBreakSeconds,
  getSessionFocusSeconds,
} from "@/lib/focus-utils";
import {
  buildDailyFocusHistory,
  computeTodayStats,
  fetchFocusSessions,
  mergeFocusSessions,
} from "@/lib/focus-storage";

export function FocusPageContent() {
  const [sessions, setSessions] = useState<Awaited<
    ReturnType<typeof fetchFocusSessions>
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const { lastSavedSession, notification, clearNotification } =
    useFocusSessionContext();

  const loadSessions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchFocusSessions();
      setSessions(data);
    } catch {
      setError("Failed to load focus sessions.");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    if (!lastSavedSession) return;

    setSessions((prev) =>
      mergeFocusSessions(prev ?? [], [lastSavedSession])
    );
    setLastSaved(
      `Saved — Focus: ${formatDuration(getSessionFocusSeconds(lastSavedSession))}, Break: ${formatDuration(getSessionBreakSeconds(lastSavedSession))}`
    );

    const timer = window.setTimeout(() => setLastSaved(null), 5000);
    return () => window.clearTimeout(timer);
  }, [lastSavedSession]);

  useEffect(() => {
    if (!notification) return;

    const timer = window.setTimeout(() => clearNotification(), 6000);
    return () => window.clearTimeout(timer);
  }, [notification, clearNotification]);

  const quick = useQuickFocus();
  const pomodoro = usePomodoroTimer();

  const todayStats = computeTodayStats(sessions ?? []);
  const dailyHistory = useMemo(
    () => buildDailyFocusHistory(sessions ?? []),
    [sessions]
  );

  const pomodoroDisabled = quick.isActive;
  const quickStartDisabled = pomodoro.isRunning || pomodoro.isPaused;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Focus"
        description="Start instantly. Track time. Take breaks when you need them."
      />

      {error && <ErrorBanner message={error} />}
      {notification && (
        <p
          className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-900"
          role="status"
        >
          {notification}
        </p>
      )}
      {lastSaved && (
        <p
          className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800"
          role="status"
        >
          {lastSaved}
        </p>
      )}

      <FocusTodayBar stats={todayStats} loading={loading} />

      <QuickFocusSession
        clock={quick.clock}
        statusLabel={quick.statusLabel}
        isIdle={quick.isIdle}
        isOnBreak={quick.isOnBreak}
        isPaused={quick.isPaused}
        isFocusing={quick.isFocusing}
        currentFocusSeconds={quick.currentFocusSeconds}
        currentBreakSeconds={quick.currentBreakSeconds}
        onStartFocus={quick.startFocus}
        startDisabled={quickStartDisabled}
        onPause={quick.pause}
        onResume={quick.resume}
        onBreak={quick.startBreak}
        onResumeFocus={quick.resumeFocus}
        onStop={quick.stopSession}
      />

      <CustomFocusSession
        clock={pomodoro.clock}
        progress={pomodoro.progress}
        mode={pomodoro.mode}
        focusMinutes={pomodoro.focusMinutes}
        breakMinutes={pomodoro.breakMinutes}
        onFocusMinutesChange={pomodoro.setFocusMinutes}
        onBreakMinutesChange={pomodoro.setBreakMinutes}
        isIdle={pomodoro.isIdle}
        isRunning={pomodoro.isRunning}
        isPaused={pomodoro.isPaused}
        disabled={pomodoroDisabled}
        onStart={pomodoro.startPomodoro}
        onPause={pomodoro.pause}
        onResume={pomodoro.resume}
        onStop={pomodoro.stop}
      />

      <FocusHistoryList history={dailyHistory} loading={loading} />
    </div>
  );
}
