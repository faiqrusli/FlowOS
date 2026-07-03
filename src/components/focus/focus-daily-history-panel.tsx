"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildDailyFocusHistory } from "@/lib/focus-storage";
import { formatDuration } from "@/lib/focus-utils";
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
    <Card className="border-border/40 bg-card/90">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Focus history</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading history…</p>
        ) : history.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No focus history yet.
          </p>
        ) : (
          <ul className="max-h-72 space-y-1 overflow-y-auto">
            {history.map((day) => (
              <li key={day.date}>
                <button
                  type="button"
                  onClick={() => onSelectDate(day.date)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-muted/40",
                    selectedDate === day.date && "bg-muted/50"
                  )}
                >
                  <div>
                    <p className="font-medium">{day.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {day.sessions.length}{" "}
                      {day.sessions.length === 1 ? "session" : "sessions"}
                    </p>
                  </div>
                  <div className="text-right text-xs tabular-nums">
                    <p>{formatDuration(day.focusSeconds)}</p>
                    {day.breakSeconds > 0 ? (
                      <p className="text-muted-foreground">
                        Break {formatDuration(day.breakSeconds)}
                      </p>
                    ) : null}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export function useFocusSelectedDate(
  sessions: FocusSession[],
  initialDate: string | null = null
) {
  const [selectedDate, setSelectedDate] = useState<string | null>(initialDate);

  const daySessions = useMemo(() => {
    if (!selectedDate) return [];
    const history = buildDailyFocusHistory(sessions);
    return history.find((day) => day.date === selectedDate)?.sessions ?? [];
  }, [selectedDate, sessions]);

  return { selectedDate, setSelectedDate, daySessions };
}
