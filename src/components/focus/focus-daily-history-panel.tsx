"use client";

import { useMemo, useState } from "react";
import { buildDailyFocusHistory } from "@/lib/focus-storage";
import { formatDuration } from "@/lib/focus-utils";
import { type as typography } from "@/lib/typography";
import { cn } from "@/lib/utils";
import type { FocusSession } from "@/types/focus";

type FocusDailyHistoryPanelProps = {
  sessions: FocusSession[];
  loading?: boolean;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
};

export function FocusDailyHistoryPanel({
  sessions,
  loading,
  selectedDate,
  onSelectDate,
}: FocusDailyHistoryPanelProps) {
  const history = useMemo(() => buildDailyFocusHistory(sessions), [sessions]);

  return (
    <section className="rounded-xl bg-surface-section px-4 py-5 sm:px-5">
      <h2 className={typography.sectionTitle}>Focus history</h2>
      <div className="mt-4">
        {loading ? (
          <p className={typography.bodyMuted}>Loading history…</p>
        ) : history.length === 0 ? (
          <p className={cn(typography.bodyMuted, "py-8 text-center")}>
            No focus history yet.
          </p>
        ) : (
          <ul className="max-h-72 space-y-1.5 overflow-y-auto">
            {history.map((day) => (
              <li key={day.date}>
                <button
                  type="button"
                  onClick={() => onSelectDate(day.date)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-lg bg-surface-base px-3 py-2.5 text-left text-sm transition-colors hover:bg-surface-hover",
                    selectedDate === day.date && "bg-surface-selected",
                  )}
                >
                  <div>
                    <p className="font-medium text-foreground">{day.label}</p>
                    <p className="text-xs text-foreground-secondary">
                      {day.sessions.length}{" "}
                      {day.sessions.length === 1 ? "session" : "sessions"}
                    </p>
                  </div>
                  <div className="text-right text-xs tabular-nums">
                    <p className="text-foreground">
                      {formatDuration(day.focusSeconds)}
                    </p>
                    {day.breakSeconds > 0 ? (
                      <p className="text-foreground-secondary">
                        Break {formatDuration(day.breakSeconds)}
                      </p>
                    ) : null}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export function useFocusSelectedDate(
  sessions: FocusSession[],
  initialDate: string | null = null,
) {
  const [selectedDate, setSelectedDate] = useState<string | null>(initialDate);

  const daySessions = useMemo(() => {
    if (!selectedDate) return [];
    const history = buildDailyFocusHistory(sessions);
    return history.find((day) => day.date === selectedDate)?.sessions ?? [];
  }, [selectedDate, sessions]);

  return { selectedDate, setSelectedDate, daySessions };
}
