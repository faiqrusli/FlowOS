import {
  getDateKeyInTimezone,
  getTodayDateString,
  parseTimestamp,
  shiftDateKey,
} from "@/lib/date-utils";
import {
  getSessionBreakSeconds,
  getSessionFocusSeconds,
} from "@/lib/focus-utils";
import type { FocusSession } from "@/types/focus";

export type FocusDayMetrics = {
  date: string;
  focusSeconds: number;
  breakSeconds: number;
  sessionCount: number;
};

export type FocusAnalytics = {
  weeklyFocusSeconds: number;
  monthlyFocusSeconds: number;
  bestFocusHour: number | null;
  longestSessionSeconds: number;
  averageFocusSeconds: number;
  averageBreakSeconds: number;
  focusStreakDays: number;
  productivityScore: number | null;
};

export type FocusTodaySummary = {
  totalFocusSeconds: number;
  totalBreakSeconds: number;
  sessionCount: number;
  breakCount: number;
  longestSessionSeconds: number;
};

function sumFocusInRange(
  sessions: FocusSession[],
  startDate: string,
  endDate: string
): number {
  return sessions.reduce((total, session) => {
    const date = getDateKeyInTimezone(session.started_at);
    if (date < startDate || date > endDate) return total;
    return total + getSessionFocusSeconds(session);
  }, 0);
}

export function buildFocusDayMetricsMap(
  sessions: FocusSession[]
): Map<string, FocusDayMetrics> {
  const map = new Map<string, FocusDayMetrics>();

  for (const session of sessions) {
    const date = getDateKeyInTimezone(session.started_at);
    const existing = map.get(date) ?? {
      date,
      focusSeconds: 0,
      breakSeconds: 0,
      sessionCount: 0,
    };

    map.set(date, {
      date,
      focusSeconds: existing.focusSeconds + getSessionFocusSeconds(session),
      breakSeconds: existing.breakSeconds + getSessionBreakSeconds(session),
      sessionCount: existing.sessionCount + 1,
    });
  }

  return map;
}

export function computeFocusAnalytics(sessions: FocusSession[]): FocusAnalytics {
  const today = getTodayDateString();
  const weekStart = shiftDateKey(today, -6);
  const monthStart = shiftDateKey(today, -29);

  const weeklyFocusSeconds = sumFocusInRange(sessions, weekStart, today);
  const monthlyFocusSeconds = sumFocusInRange(sessions, monthStart, today);

  const hourTotals = new Array<number>(24).fill(0);
  let longestSessionSeconds = 0;
  let totalFocus = 0;
  let totalBreak = 0;

  for (const session of sessions) {
    const focusSeconds = getSessionFocusSeconds(session);
    const breakSeconds = getSessionBreakSeconds(session);
    totalFocus += focusSeconds;
    totalBreak += breakSeconds;
    longestSessionSeconds = Math.max(longestSessionSeconds, focusSeconds);

    const hour = parseTimestamp(session.started_at).getHours();
    hourTotals[hour] += focusSeconds;
  }

  const sessionCount = sessions.length;
  let bestFocusHour: number | null = null;
  let bestHourTotal = 0;
  hourTotals.forEach((value, hour) => {
    if (value > bestHourTotal) {
      bestHourTotal = value;
      bestFocusHour = hour;
    }
  });

  const dayMetrics = buildFocusDayMetricsMap(sessions);
  let focusStreakDays = 0;
  for (let offset = 0; offset < 365; offset += 1) {
    const date = shiftDateKey(today, -offset);
    const metrics = dayMetrics.get(date);
    if (!metrics || metrics.focusSeconds <= 0) break;
    focusStreakDays += 1;
  }

  return {
    weeklyFocusSeconds,
    monthlyFocusSeconds,
    bestFocusHour,
    longestSessionSeconds,
    averageFocusSeconds:
      sessionCount > 0 ? Math.round(totalFocus / sessionCount) : 0,
    averageBreakSeconds:
      sessionCount > 0 ? Math.round(totalBreak / sessionCount) : 0,
    focusStreakDays,
    productivityScore: null,
  };
}

export function computeFocusTodaySummary(
  sessions: FocusSession[],
  dateKey = getTodayDateString()
): FocusTodaySummary {
  const daySessions = sessions.filter(
    (session) => getDateKeyInTimezone(session.started_at) === dateKey
  );

  let totalFocusSeconds = 0;
  let totalBreakSeconds = 0;
  let breakCount = 0;
  let longestSessionSeconds = 0;

  for (const session of daySessions) {
    const focusSeconds = getSessionFocusSeconds(session);
    const breakSeconds = getSessionBreakSeconds(session);
    totalFocusSeconds += focusSeconds;
    totalBreakSeconds += breakSeconds;
    if (breakSeconds > 0) breakCount += 1;
    longestSessionSeconds = Math.max(longestSessionSeconds, focusSeconds);
  }

  return {
    totalFocusSeconds,
    totalBreakSeconds,
    sessionCount: daySessions.length,
    breakCount,
    longestSessionSeconds,
  };
}

export function sortSessionsChronological(
  sessions: FocusSession[],
  direction: "asc" | "desc" = "desc"
): FocusSession[] {
  return [...sessions].sort((a, b) => {
    const delta =
      parseTimestamp(a.started_at).getTime() -
      parseTimestamp(b.started_at).getTime();
    return direction === "asc" ? delta : -delta;
  });
}

export function buildHeatmapWeeks(
  sessions: FocusSession[],
  weeks = 16
): FocusDayMetrics[][] {
  const today = getTodayDateString();
  const dayMetrics = buildFocusDayMetricsMap(sessions);
  const totalDays = weeks * 7;
  const startDate = shiftDateKey(today, -(totalDays - 1));

  const days: FocusDayMetrics[] = [];
  for (let index = 0; index < totalDays; index += 1) {
    const date = shiftDateKey(startDate, index);
    days.push(
      dayMetrics.get(date) ?? {
        date,
        focusSeconds: 0,
        breakSeconds: 0,
        sessionCount: 0,
      }
    );
  }

  const result: FocusDayMetrics[][] = [];
  for (let week = 0; week < weeks; week += 1) {
    result.push(days.slice(week * 7, week * 7 + 7));
  }

  return result;
}

export function formatFocusHourLabel(hour: number | null): string {
  if (hour === null) return "—";
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:00 ${period}`;
}
