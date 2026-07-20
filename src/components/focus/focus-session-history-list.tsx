"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { sortSessionsChronological } from "@/lib/focus-analytics";
import { getDateKeyInTimezone } from "@/lib/date-utils";
import {
  formatDuration,
  formatSessionTime,
  getSessionBreakSeconds,
  getSessionFocusSeconds,
} from "@/lib/focus-utils";
import { type as typography } from "@/lib/typography";
import { cn } from "@/lib/utils";
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
    <section className="rounded-xl bg-surface-section px-4 py-5 sm:px-5">
      <h2 className={typography.sectionTitle}>Session history</h2>
      <div className="mt-4">
        {loading ? (
          <p className={typography.bodyMuted}>Loading sessions…</p>
        ) : list.length === 0 ? (
          <p className={cn(typography.bodyMuted, "py-8 text-center")}>
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
                  className="rounded-lg bg-surface-base px-3 py-2.5 text-sm transition-colors hover:bg-surface-hover"
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
                  <div className="mt-1.5 grid gap-1 text-xs text-foreground-secondary sm:grid-cols-2">
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
                      Breaks{" "}
                      {breakSeconds > 0 ? formatDuration(breakSeconds) : "—"}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
