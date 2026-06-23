import { computeFocusStatsForDate, fetchFocusSessions } from "@/lib/focus-sessions";
import { fetchHabitsWithCompletions, isHabitCompletedOnDate } from "@/lib/habits";
import { isHabitScheduledOnDate } from "@/lib/habit-stats";
import { fetchTodayTasks } from "@/lib/tasks";
import type { DaySummary } from "@/types/reflection";
import type { Habit } from "@/types/habit";
import type { Task } from "@/types/task";

export type ReflectionDayReview = {
  dateKey: string;
  summary: DaySummary;
  completedTasks: Task[];
  remainingTasks: Task[];
  completedHabits: Habit[];
  missedHabits: Habit[];
};

function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const aTime = a.scheduled_time ?? "99:99";
    const bTime = b.scheduled_time ?? "99:99";
    return aTime.localeCompare(bTime);
  });
}

function sortHabits(habits: Habit[]): Habit[] {
  return [...habits].sort((a, b) => {
    const aTime = a.scheduled_time ?? "99:99";
    const bTime = b.scheduled_time ?? "99:99";
    return aTime.localeCompare(bTime);
  });
}

export async function fetchReflectionDayReview(
  dateKey: string
): Promise<ReflectionDayReview> {
  const [tasks, habits, focusSessions] = await Promise.all([
    fetchTodayTasks(dateKey),
    fetchHabitsWithCompletions(),
    fetchFocusSessions(),
  ]);

  const completedTasks = sortTasks(tasks.filter((task) => task.completed));
  const remainingTasks = sortTasks(tasks.filter((task) => !task.completed));

  const scheduledHabits = habits.filter((habit) =>
    isHabitScheduledOnDate(habit, dateKey)
  );
  const completedHabits = sortHabits(
    scheduledHabits.filter((habit) => isHabitCompletedOnDate(habit, dateKey))
  );
  const missedHabits = sortHabits(
    scheduledHabits.filter((habit) => !isHabitCompletedOnDate(habit, dateKey))
  );

  const focus = computeFocusStatsForDate(focusSessions, dateKey);

  return {
    dateKey,
    summary: {
      tasksCompleted: completedTasks.length,
      tasksTotal: tasks.length,
      habitsCompleted: completedHabits.length,
      habitsTotal: scheduledHabits.length,
      focusSeconds: focus.totalFocusSeconds,
    },
    completedTasks,
    remainingTasks,
    completedHabits,
    missedHabits,
  };
}
