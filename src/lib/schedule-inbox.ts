import { getTodayDateString } from "@/lib/date-utils";
import type { TaskBuckets } from "@/lib/tasks";
import type { Habit } from "@/types/habit";
import type { Task } from "@/types/task";

export type ScheduleInbox = {
  unscheduledTasks: Task[];
  backlogTasks: Task[];
  unscheduledHabits: Habit[];
};

export function buildScheduleInbox(
  tasks: Task[],
  habits: Habit[],
  buckets: TaskBuckets,
  todayKey = getTodayDateString()
): ScheduleInbox {
  const unscheduledTasks = tasks.filter(
    (task) => !task.scheduled_time && !task.completed
  );

  const backlogTasks = [
    ...buckets.missed,
    ...buckets.upcoming.filter(
      (task) => task.scheduled_date !== todayKey || !task.scheduled_time
    ),
  ].filter(
    (task, index, list) =>
      list.findIndex((entry) => entry.id === task.id) === index
  );

  const unscheduledHabits = habits.filter(
    (habit) => !habit.scheduled_time && !habit.completed
  );

  return { unscheduledTasks, backlogTasks, unscheduledHabits };
}
