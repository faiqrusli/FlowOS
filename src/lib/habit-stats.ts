import {
  APP_TIMEZONE,
  getTodayDateString,
} from "@/lib/date-utils";
import type { Habit } from "@/types/habit";

const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: APP_TIMEZONE,
  weekday: "short",
});

const WEEKDAY_TO_ABBREV: Record<string, string> = {
  Sun: "Sun",
  Mon: "Mon",
  Tue: "Tue",
  Wed: "Wed",
  Thu: "Thu",
  Fri: "Fri",
  Sat: "Sat",
};

export function offsetDateKey(dateKey: string, days: number): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);

  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getDayAbbrevFromDateKey(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 4));
  const weekday = weekdayFormatter.format(date);
  return WEEKDAY_TO_ABBREV[weekday] ?? weekday;
}

export function isHabitScheduledOnDate(habit: Habit, dateKey: string): boolean {
  if (!habit.days_of_week?.length) return true;
  return habit.days_of_week.includes(getDayAbbrevFromDateKey(dateKey));
}

export function getPreviousScheduledDateKey(
  habit: Habit,
  fromDateKey: string
): string | null {
  let cursor = offsetDateKey(fromDateKey, -1);

  for (let i = 0; i < 366; i++) {
    if (isHabitScheduledOnDate(habit, cursor)) {
      return cursor;
    }
    cursor = offsetDateKey(cursor, -1);
  }

  return null;
}

export function isHabitCompletedOnDate(
  habit: Habit,
  dateKey: string,
  completionDates: Set<string>
): boolean {
  const todayKey = getTodayDateString();

  if (dateKey === todayKey && habit.completed) {
    return true;
  }

  return completionDates.has(dateKey);
}

export function computeHabitStreak(
  habit: Habit,
  completionDates: Set<string>,
  todayKey = getTodayDateString()
): number {
  let streak = 0;
  let cursor: string | null = todayKey;

  if (
    isHabitScheduledOnDate(habit, todayKey) &&
    !isHabitCompletedOnDate(habit, todayKey, completionDates)
  ) {
    cursor = getPreviousScheduledDateKey(habit, todayKey);
  } else if (!isHabitScheduledOnDate(habit, todayKey)) {
    cursor = getPreviousScheduledDateKey(habit, todayKey);
  }

  while (cursor) {
    if (!isHabitCompletedOnDate(habit, cursor, completionDates)) {
      break;
    }

    streak++;
    cursor = getPreviousScheduledDateKey(habit, cursor);
  }

  return streak;
}

export function computeHabitCompletionRate(
  habit: Habit,
  completionDates: Set<string>,
  windowDays = 30,
  todayKey = getTodayDateString()
): number {
  let scheduled = 0;
  let completed = 0;

  for (let offset = 0; offset < windowDays; offset++) {
    const dateKey = offsetDateKey(todayKey, -offset);

    if (!isHabitScheduledOnDate(habit, dateKey)) {
      continue;
    }

    scheduled++;

    if (isHabitCompletedOnDate(habit, dateKey, completionDates)) {
      completed++;
    }
  }

  if (scheduled === 0) return 0;

  return Math.round((completed / scheduled) * 100);
}

export function computeHabitStats(
  habit: Habit,
  completionDates: string[]
): { streak: number; completionRate: number } {
  const dates = new Set(completionDates);

  return {
    streak: computeHabitStreak(habit, dates),
    completionRate: computeHabitCompletionRate(habit, dates),
  };
}

export function computeHabitStatsMap(
  habits: Habit[],
  completionsByHabit: Record<string, string[]>
): Record<string, { streak: number; completionRate: number }> {
  const stats: Record<string, { streak: number; completionRate: number }> = {};

  for (const habit of habits) {
    stats[habit.id] = computeHabitStats(
      habit,
      completionsByHabit[habit.id] ?? []
    );
  }

  return stats;
}