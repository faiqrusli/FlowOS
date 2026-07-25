import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  computeHabitCompletionRate,
  computeHabitStats,
  computeHabitStatsMap,
  computeHabitStreak,
  getDayAbbrevFromDateKey,
  getPreviousScheduledDateKey,
  isHabitCompletedOnDate,
  isHabitScheduledOnDate,
  offsetDateKey,
} from "@/lib/habit-stats";
import type { Habit } from "@/types/habit";

/** 2026-07-08 is a Wednesday; noon in Asia/Singapore is 04:00 UTC. */
const TODAY = "2026-07-08";
const TODAY_NOON_SGT = new Date("2026-07-08T04:00:00.000Z");

function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: "habit-1",
    name: "Morning run",
    scheduled_time: null,
    days_of_week: null,
    completed: false,
    track_with_focus: false,
    user_id: "user-1",
    created_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("offsetDateKey", () => {
  it("shifts forward and backward", () => {
    expect(offsetDateKey("2026-07-08", 1)).toBe("2026-07-09");
    expect(offsetDateKey("2026-07-08", -1)).toBe("2026-07-07");
    expect(offsetDateKey("2026-07-08", 0)).toBe("2026-07-08");
  });

  it("crosses month and year boundaries", () => {
    expect(offsetDateKey("2026-07-31", 1)).toBe("2026-08-01");
    expect(offsetDateKey("2026-01-01", -1)).toBe("2025-12-31");
    expect(offsetDateKey("2024-02-28", 1)).toBe("2024-02-29");
  });
});

describe("getDayAbbrevFromDateKey", () => {
  it("returns the weekday abbreviation in the app timezone", () => {
    expect(getDayAbbrevFromDateKey("2026-07-08")).toBe("Wed");
    expect(getDayAbbrevFromDateKey("2026-07-12")).toBe("Sun");
  });
});

describe("isHabitScheduledOnDate", () => {
  it("treats an empty schedule as every day", () => {
    expect(isHabitScheduledOnDate(makeHabit({ days_of_week: null }), TODAY)).toBe(true);
    expect(isHabitScheduledOnDate(makeHabit({ days_of_week: [] }), TODAY)).toBe(true);
  });

  it("matches the weekday abbreviation", () => {
    const habit = makeHabit({ days_of_week: ["Mon", "Wed", "Fri"] });
    expect(isHabitScheduledOnDate(habit, "2026-07-08")).toBe(true);
    expect(isHabitScheduledOnDate(habit, "2026-07-09")).toBe(false);
  });
});

describe("getPreviousScheduledDateKey", () => {
  it("returns the previous day for a daily habit", () => {
    expect(getPreviousScheduledDateKey(makeHabit(), TODAY)).toBe("2026-07-07");
  });

  it("skips unscheduled days", () => {
    const habit = makeHabit({ days_of_week: ["Mon", "Wed"] });
    expect(getPreviousScheduledDateKey(habit, "2026-07-08")).toBe("2026-07-06");
  });

  it("returns null when the habit is never scheduled", () => {
    const habit = makeHabit({ days_of_week: ["Nope"] });
    expect(getPreviousScheduledDateKey(habit, TODAY)).toBeNull();
  });
});

describe("isHabitCompletedOnDate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(TODAY_NOON_SGT);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("uses the live completed flag for today", () => {
    expect(isHabitCompletedOnDate(makeHabit({ completed: true }), TODAY, new Set())).toBe(true);
    expect(isHabitCompletedOnDate(makeHabit(), TODAY, new Set())).toBe(false);
  });

  it("uses recorded completions for other days", () => {
    const habit = makeHabit({ completed: true });
    expect(isHabitCompletedOnDate(habit, "2026-07-07", new Set())).toBe(false);
    expect(isHabitCompletedOnDate(habit, "2026-07-07", new Set(["2026-07-07"]))).toBe(true);
  });
});

describe("computeHabitStreak", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(TODAY_NOON_SGT);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("counts consecutive completed days including today", () => {
    const dates = new Set(["2026-07-08", "2026-07-07", "2026-07-06"]);
    expect(computeHabitStreak(makeHabit(), dates, TODAY)).toBe(3);
  });

  it("keeps yesterday's streak alive when today is not done yet", () => {
    const dates = new Set(["2026-07-07", "2026-07-06"]);
    expect(computeHabitStreak(makeHabit(), dates, TODAY)).toBe(2);
  });

  it("is zero when the streak already broke", () => {
    const dates = new Set(["2026-07-06"]);
    expect(computeHabitStreak(makeHabit(), dates, TODAY)).toBe(0);
  });

  it("only counts scheduled days", () => {
    const habit = makeHabit({ days_of_week: ["Mon", "Wed", "Fri"] });
    // Wed 8th, Mon 6th, Fri 3rd — the unscheduled days in between are skipped.
    const dates = new Set(["2026-07-08", "2026-07-06", "2026-07-03"]);
    expect(computeHabitStreak(habit, dates, TODAY)).toBe(3);
  });

  it("looks back from the last scheduled day when today is off-schedule", () => {
    const habit = makeHabit({ days_of_week: ["Tue"] });
    const dates = new Set(["2026-07-07"]);
    expect(computeHabitStreak(habit, dates, TODAY)).toBe(1);
  });
});

describe("computeHabitCompletionRate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(TODAY_NOON_SGT);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("is a percentage of scheduled days in the window", () => {
    const dates = new Set(["2026-07-08", "2026-07-07"]);
    expect(computeHabitCompletionRate(makeHabit(), dates, 4, TODAY)).toBe(50);
  });

  it("rounds to the nearest percent", () => {
    const dates = new Set(["2026-07-08"]);
    expect(computeHabitCompletionRate(makeHabit(), dates, 3, TODAY)).toBe(33);
  });

  it("counts only scheduled days", () => {
    const habit = makeHabit({ days_of_week: ["Wed"] });
    const dates = new Set(["2026-07-08"]);
    expect(computeHabitCompletionRate(habit, dates, 7, TODAY)).toBe(100);
  });

  it("is zero when nothing is scheduled in the window", () => {
    const habit = makeHabit({ days_of_week: ["Mon"] });
    expect(computeHabitCompletionRate(habit, new Set(), 3, TODAY)).toBe(0);
  });
});

describe("computeHabitStats / computeHabitStatsMap", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(TODAY_NOON_SGT);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("combines streak and completion rate", () => {
    expect(computeHabitStats(makeHabit(), ["2026-07-08", "2026-07-07"])).toEqual({
      streak: 2,
      completionRate: 7,
    });
  });

  it("maps stats by habit id and defaults missing completions to none", () => {
    const stats = computeHabitStatsMap(
      [makeHabit({ id: "a" }), makeHabit({ id: "b" })],
      { a: ["2026-07-08"] }
    );

    expect(stats.a.streak).toBe(1);
    expect(stats.b).toEqual({ streak: 0, completionRate: 0 });
  });
});
