import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildFocusDayMetricsMap,
  buildHeatmapWeeks,
  computeFocusAnalytics,
  computeFocusTodaySummary,
  formatFocusHourLabel,
  sortSessionsChronological,
} from "@/lib/focus-analytics";
import type { FocusSession } from "@/types/focus";

/** 2026-07-08 noon in Asia/Singapore, the app timezone. */
const TODAY = "2026-07-08";
const TODAY_NOON_SGT = new Date("2026-07-08T04:00:00.000Z");

let sessionCounter = 0;

/**
 * Sessions with a `target_type` store durations in seconds, so focus/break
 * seconds come straight from the row (capped by the elapsed wall time).
 */
function makeSession(
  startedAt: string,
  focusSeconds: number,
  breakSeconds = 0,
  overrides: Partial<FocusSession> = {}
): FocusSession {
  sessionCounter += 1;
  const endedAt = new Date(
    new Date(startedAt).getTime() + (focusSeconds + breakSeconds) * 1000
  ).toISOString();

  return {
    id: `session-${sessionCounter}`,
    focus_duration: focusSeconds,
    break_duration: breakSeconds,
    started_at: startedAt,
    ended_at: endedAt,
    session_status: "completed",
    target_type: "task",
    target_id: "task-1",
    user_id: "user-1",
    ...overrides,
  };
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(TODAY_NOON_SGT);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("buildFocusDayMetricsMap", () => {
  it("aggregates focus, break, and session counts per day key", () => {
    const map = buildFocusDayMetricsMap([
      makeSession("2026-07-08T01:00:00.000Z", 1500, 300),
      makeSession("2026-07-08T05:00:00.000Z", 600),
      makeSession("2026-07-06T01:00:00.000Z", 900),
    ]);

    expect(map.get(TODAY)).toEqual({
      date: TODAY,
      focusSeconds: 2100,
      breakSeconds: 300,
      sessionCount: 2,
    });
    expect(map.get("2026-07-06")?.sessionCount).toBe(1);
    expect(map.has("2026-07-07")).toBe(false);
  });

  it("buckets sessions by the app timezone, not UTC", () => {
    // 17:00 UTC on the 7th is 01:00 on the 8th in Singapore.
    const map = buildFocusDayMetricsMap([makeSession("2026-07-07T17:00:00.000Z", 600)]);
    expect([...map.keys()]).toEqual([TODAY]);
  });
});

describe("computeFocusAnalytics", () => {
  it("returns zeroed analytics for no sessions", () => {
    expect(computeFocusAnalytics([])).toEqual({
      weeklyFocusSeconds: 0,
      monthlyFocusSeconds: 0,
      bestFocusHour: null,
      longestSessionSeconds: 0,
      averageFocusSeconds: 0,
      averageBreakSeconds: 0,
      focusStreakDays: 0,
      productivityScore: null,
    });
  });

  it("sums the trailing 7- and 30-day windows", () => {
    const sessions = [
      makeSession("2026-07-08T01:00:00.000Z", 600),
      makeSession("2026-07-03T01:00:00.000Z", 900),
      makeSession("2026-06-25T01:00:00.000Z", 1200),
      makeSession("2026-05-01T01:00:00.000Z", 3000),
    ];

    const analytics = computeFocusAnalytics(sessions);
    expect(analytics.weeklyFocusSeconds).toBe(1500);
    expect(analytics.monthlyFocusSeconds).toBe(2700);
  });

  it("reports longest session and rounded averages", () => {
    const analytics = computeFocusAnalytics([
      makeSession("2026-07-08T01:00:00.000Z", 1000, 100),
      makeSession("2026-07-08T05:00:00.000Z", 1501, 200),
    ]);

    expect(analytics.longestSessionSeconds).toBe(1501);
    expect(analytics.averageFocusSeconds).toBe(1251);
    expect(analytics.averageBreakSeconds).toBe(150);
  });

  it("picks the hour with the most focus time", () => {
    const quiet = "2026-07-08T01:00:00.000Z";
    const busy = "2026-07-08T05:00:00.000Z";
    const analytics = computeFocusAnalytics([
      makeSession(quiet, 600),
      makeSession(busy, 3000),
    ]);

    expect(analytics.bestFocusHour).toBe(new Date(busy).getHours());
  });

  it("counts the streak back from today and stops at the first gap", () => {
    const analytics = computeFocusAnalytics([
      makeSession("2026-07-08T01:00:00.000Z", 600),
      makeSession("2026-07-07T01:00:00.000Z", 600),
      makeSession("2026-07-05T01:00:00.000Z", 600),
    ]);

    expect(analytics.focusStreakDays).toBe(2);
  });

  it("has no streak when today has no focus time", () => {
    const analytics = computeFocusAnalytics([makeSession("2026-07-07T01:00:00.000Z", 600)]);
    expect(analytics.focusStreakDays).toBe(0);
  });
});

describe("computeFocusTodaySummary", () => {
  it("summarises only the requested day", () => {
    const summary = computeFocusTodaySummary(
      [
        makeSession("2026-07-08T01:00:00.000Z", 1500, 300),
        makeSession("2026-07-08T05:00:00.000Z", 600),
        makeSession("2026-07-06T01:00:00.000Z", 900, 60),
      ],
      TODAY
    );

    expect(summary).toEqual({
      totalFocusSeconds: 2100,
      totalBreakSeconds: 300,
      sessionCount: 2,
      breakCount: 1,
      longestSessionSeconds: 1500,
    });
  });

  it("defaults to today and returns zeros when the day is empty", () => {
    expect(computeFocusTodaySummary([makeSession("2026-07-01T01:00:00.000Z", 600)])).toEqual({
      totalFocusSeconds: 0,
      totalBreakSeconds: 0,
      sessionCount: 0,
      breakCount: 0,
      longestSessionSeconds: 0,
    });
  });
});

describe("sortSessionsChronological", () => {
  const older = makeSession("2026-07-06T01:00:00.000Z", 600);
  const newer = makeSession("2026-07-08T01:00:00.000Z", 600);

  it("defaults to newest first", () => {
    expect(sortSessionsChronological([older, newer]).map((s) => s.id)).toEqual([
      newer.id,
      older.id,
    ]);
  });

  it("supports ascending order and leaves the input untouched", () => {
    const input = [newer, older];
    expect(sortSessionsChronological(input, "asc").map((s) => s.id)).toEqual([
      older.id,
      newer.id,
    ]);
    expect(input.map((s) => s.id)).toEqual([newer.id, older.id]);
  });
});

describe("buildHeatmapWeeks", () => {
  it("returns a grid of weeks ending today", () => {
    const weeks = buildHeatmapWeeks([makeSession("2026-07-08T01:00:00.000Z", 600)], 4);

    expect(weeks).toHaveLength(4);
    expect(weeks.every((week) => week.length === 7)).toBe(true);
    expect(weeks[0][0].date).toBe("2026-06-11");
    expect(weeks.at(-1)?.at(-1)).toEqual({
      date: TODAY,
      focusSeconds: 600,
      breakSeconds: 0,
      sessionCount: 1,
    });
  });

  it("fills days without sessions with zeros", () => {
    const weeks = buildHeatmapWeeks([], 1);
    expect(weeks[0][0]).toEqual({
      date: "2026-07-02",
      focusSeconds: 0,
      breakSeconds: 0,
      sessionCount: 0,
    });
  });
});

describe("formatFocusHourLabel", () => {
  it.each([
    [null, "—"],
    [0, "12:00 AM"],
    [9, "9:00 AM"],
    [12, "12:00 PM"],
    [23, "11:00 PM"],
  ])("%p → %s", (hour, expected) => {
    expect(formatFocusHourLabel(hour)).toBe(expected);
  });
});
