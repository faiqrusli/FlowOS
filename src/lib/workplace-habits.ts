import {
  getNowMinutesInAppTimezone,
  parseTimeToMinutes,
} from "@/lib/date-utils";
import { isHabitCompletedOnDate } from "@/lib/habits";
import { isHabitScheduledOnDate } from "@/lib/habit-stats";
import type { Habit } from "@/types/habit";

export type WorkplaceHabitTab = "incomplete" | "missed" | "completed";

export type WorkplaceHabitSections = {
  incomplete: Habit[];
  missed: Habit[];
  completed: Habit[];
};

export function partitionWorkplaceHabits(
  habits: Habit[],
  todayViewDate: string
): WorkplaceHabitSections {
  const nowMinutes = getNowMinutesInAppTimezone();
  const todayHabits = habits.filter((habit) =>
    isHabitScheduledOnDate(habit, todayViewDate)
  );

  const completed = todayHabits
    .filter((habit) => isHabitCompletedOnDate(habit, todayViewDate))
    .sort((a, b) => a.name.localeCompare(b.name));

  const missed = todayHabits
    .filter((habit) => {
      if (isHabitCompletedOnDate(habit, todayViewDate)) return false;
      if (!habit.scheduled_time) return false;
      return parseTimeToMinutes(habit.scheduled_time) < nowMinutes;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const incomplete = todayHabits
    .filter((habit) => {
      if (isHabitCompletedOnDate(habit, todayViewDate)) return false;
      if (!habit.scheduled_time) return true;
      return parseTimeToMinutes(habit.scheduled_time) >= nowMinutes;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return { incomplete, missed, completed };
}

/** Which Today habits-card tab owns this habit (null if not scheduled today). */
export function resolveWorkplaceHabitTab(
  habit: Habit,
  habits: Habit[],
  todayViewDate: string
): WorkplaceHabitTab | null {
  const sections = partitionWorkplaceHabits(habits, todayViewDate);

  if (sections.incomplete.some((item) => item.id === habit.id)) {
    return "incomplete";
  }
  if (sections.missed.some((item) => item.id === habit.id)) return "missed";
  if (sections.completed.some((item) => item.id === habit.id)) {
    return "completed";
  }

  return null;
}
