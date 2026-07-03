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
