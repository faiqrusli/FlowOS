"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTodayDateString } from "@/lib/date-utils";
import { formatDuration, formatSessionTime, getSessionBreakSeconds, getSessionFocusSeconds, getSessionTotalSeconds } from "@/lib/focus-utils";
import { cn } from "@/lib/utils";
import type { DailyFocusHistory } from "@/types/focus";

type FocusHistoryListProps = {
  history: DailyFocusHistory[];
  loading?: boolean;
};

export function FocusHistoryList({ history, loading }: FocusHistoryListProps) {
  const todayKey = getTodayDateString();
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(history.some((day) => day.date === todayKey) ? [todayKey] : [])
  );

  useEffect(() => {
    if (history.some((day) => day.date === todayKey)) {
      setExpanded((prev) => {
        if (prev.has(todayKey)) return prev;
        return new Set([todayKey, ...prev]);
      });
    }
  }, [history, todayKey]);

  function toggle(date: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(date)) {
        next.delete(date);
      } else {
        next.add(date);
      }
      return next;
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Focus history</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading history…</p>
        ) : history.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No focus sessions yet.
          </p>
        ) : (
          <ul className="divide-y divide-border/40">
            {history.map((day) => {
              const isOpen = expanded.has(day.date);

              return (
                <li key={day.date} className="py-3 first:pt-0 last:pb-0">
                  <button
                    type="button"
                    onClick={() => toggle(day.date)}
                    className="flex w-full items-center justify-between gap-3 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronDown
                        className={cn(
                          "size-4 shrink-0 text-muted-foreground transition-transform",
                          isOpen && "rotate-180"
                        )}
                      />
                      <span className="font-medium text-foreground">
                        {day.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({day.sessions.length}{" "}
                        {day.sessions.length === 1 ? "session" : "sessions"})
                      </span>
                    </div>
                    <div className="text-right text-sm tabular-nums">
                      <p className="text-foreground/85">
                        {formatDuration(day.focusSeconds)}
                      </p>
                      {day.breakSeconds > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Break {formatDuration(day.breakSeconds)}
                        </p>
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <ul className="mt-3 space-y-2 border-l-2 border-border/50 pl-4">
                      {day.sessions.map((session) => (
                        <li
                          key={session.id}
                          className="rounded-lg border-0 bg-surface-base px-3 py-2.5 text-sm transition-colors hover:bg-surface-hover"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-medium text-foreground/90">
                              {formatSessionTime(
                                session.ended_at ?? session.started_at
                              )}
                            </span>
                            <Badge variant="outline" className="text-[10px]">
                              {session.session_status}
                            </Badge>
                          </div>
                          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span>
                              Focus:{" "}
                              <span className="text-foreground/90">
                                {formatDuration(getSessionFocusSeconds(session))}
                              </span>
                            </span>
                            <span>
                              Break:{" "}
                              <span className="text-foreground/90">
                                {formatDuration(getSessionBreakSeconds(session))}
                              </span>
                            </span>
                            <span>
                              Total:{" "}
                              <span className="text-foreground/90">
                                {formatDuration(getSessionTotalSeconds(session))}
                              </span>
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
