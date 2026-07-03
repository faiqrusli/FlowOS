"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sortSessionsChronological } from "@/lib/focus-analytics";
import { getDateKeyInTimezone } from "@/lib/date-utils";
import {
  formatDuration,
  formatSessionTime,
  getSessionBreakSeconds,
  getSessionFocusSeconds,
} from "@/lib/focus-utils";
import type { FocusSession } from "@/types/focus";

type FocusSessionHistoryListProps = {
  sessions: FocusSession[];
  filterDate?: string | null;
  loading?: boolean;
};

export function FocusSessionHistoryList({
  sessions,
  filterDate,
  loading,
}: FocusSessionHistoryListProps) {
  const list = useMemo(() => {
    const sorted = sortSessionsChronological(sessions, "desc");
    if (!filterDate) return sorted.slice(0, 50);
    return sorted.filter(
      (session) => getDateKeyInTimezone(session.started_at) === filterDate
    );
  }, [sessions, filterDate]);

  return (
    <Card className="border-border/40 bg-card/90">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Session history</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading sessions…</p>
        ) : list.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {filterDate
              ? "No sessions on the selected day."
              : "No focus sessions yet."}
          </p>
        ) : (
          <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {list.map((session) => {
              const breakSeconds = getSessionBreakSeconds(session);
              return (
                <li
                  key={session.id}
                  className="rounded-lg border border-border/30 bg-muted/10 px-3 py-2.5 text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-foreground">
                      {session.session_status === "completed"
                        ? "Focus session"
                        : "Stopped session"}
                    </p>
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {session.session_status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="mt-1.5 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                    <span>
                      Start {formatSessionTime(session.started_at)}
                    </span>
                    <span>
                      End{" "}
                      {session.ended_at
                        ? formatSessionTime(session.ended_at)
                        : "—"}
                    </span>
                    <span>
                      Duration {formatDuration(getSessionFocusSeconds(session))}
                    </span>
                    <span>
                      Breaks {breakSeconds > 0 ? formatDuration(breakSeconds) : "—"}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
