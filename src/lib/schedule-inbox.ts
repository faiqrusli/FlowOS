import { getTodayDateString } from "@/lib/date-utils";
import type { TaskBuckets } from "@/lib/tasks";
import type { Habit } from "@/types/habit";
import type { Task } from "@/types/task";

export type ScheduleInbox = {
  unscheduledTasks: Task[];
  laterTasks: Task[];
  unscheduledHabits: Habit[];
};

export function buildScheduleInbox(
  tasks: Task[],
  habits: Habit[],
  buckets: TaskBuckets,
  todayKey = getTodayDateString()
): ScheduleInbox {
  const unscheduledTasks = tasks.filter(
    (task) =>
      !task.scheduled_date &&
      !task.completed &&
      task.planning_state !== "later"
  );

  const laterTasks = tasks.filter(
    (task) => !task.completed && task.planning_state === "later"
  );

  const unscheduledHabits = habits.filter(
    (habit) => !habit.scheduled_time && !habit.completed
  );

  return { unscheduledTasks, laterTasks, unscheduledHabits };
}
