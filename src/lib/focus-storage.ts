import {
  compareHistoryDateKeys,
  formatWeekdayLabel,
  getTodayDateString,
  getYesterdayDateString,
  getDateKeyInTimezone,
  parseTimestamp,
} from "@/lib/date-utils";
import {
  getSessionBreakSeconds,
  getSessionFocusSeconds,
} from "@/lib/focus-utils";
import {
  computeFocusStatsForDate,
  fetchFocusSessions,
  mergeFocusSessions,
  saveFocusSession,
} from "@/lib/focus-sessions";
import type { FocusSession, TodayFocusStats } from "@/types/focus";

export {
  fetchFocusSessions,
  saveFocusSession,
  computeFocusStatsForDate,
  mergeFocusSessions,
};

export function computeTodayStats(sessions: FocusSession[]): TodayFocusStats {
  return computeFocusStatsForDate(sessions, getTodayDateString());
}

export function buildDailyFocusHistory(sessions: FocusSession[]) {
  const byDate = new Map<
    string,
    { focusSeconds: number; breakSeconds: number; sessions: FocusSession[] }
  >();

  for (const session of sessions) {
    const date = getDateKeyInTimezone(session.started_at);
    const existing = byDate.get(date) ?? {
      focusSeconds: 0,
      breakSeconds: 0,
      sessions: [],
    };

    byDate.set(date, {
      focusSeconds: existing.focusSeconds + getSessionFocusSeconds(session),
      breakSeconds: existing.breakSeconds + getSessionBreakSeconds(session),
      sessions: [...existing.sessions, session],
    });
  }

  const todayKey = getTodayDateString();
  const yesterdayKey = getYesterdayDateString();

  return Array.from(byDate.entries())
    .sort(([dateA], [dateB]) =>
      compareHistoryDateKeys(dateA, dateB, todayKey, yesterdayKey)
    )
    .map(([date, data]) => {
      let label: string;
      if (date === todayKey) label = "Today";
      else if (date === yesterdayKey) label = "Yesterday";
      else label = formatWeekdayLabel(date);

      return {
        label,
        date,
        focusSeconds: data.focusSeconds,
        breakSeconds: data.breakSeconds,
        sessions: [...data.sessions].sort(
          (a, b) =>
            parseTimestamp(b.ended_at ?? b.started_at).getTime() -
            parseTimestamp(a.ended_at ?? a.started_at).getTime()
        ),
      };
    });
}
