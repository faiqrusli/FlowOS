import {
  getNowMinutesInAppTimezone,
  parseTimeToMinutes,
} from "@/lib/date-utils";
import {
  taskBelongsInLaterView,
  taskBelongsInTodayView,
} from "@/lib/task-groups";
import {
  filterUnscheduledTasksForDay,
  getTaskDurationMinutes,
} from "@/lib/timeline-layout";
import type { Task } from "@/types/task";

export type WorkplaceTaskTab = "queue" | "unscheduled" | "missed" | "completed";

export type WorkplaceTaskSections = {
  queue: Task[];
  unscheduled: Task[];
  completed: Task[];
  missed: Task[];
};

export function partitionWorkplaceTasks(
  tasks: Task[],
  todayViewDate: string
): WorkplaceTaskSections {
  const nowMinutes = getNowMinutesInAppTimezone();

  const todayTasks = tasks.filter(
    (task) =>
      taskBelongsInTodayView(task, todayViewDate) &&
      !taskBelongsInLaterView(task)
  );

  const unscheduled = filterUnscheduledTasksForDay(tasks, todayViewDate);

  const completed = todayTasks
    .filter((task) => task.completed)
    .sort((a, b) => a.sort_order - b.sort_order);

  const missed = todayTasks
    .filter((task) => {
      if (task.completed || !task.scheduled_time) return false;
      const start = parseTimeToMinutes(task.scheduled_time);
      const duration = getTaskDurationMinutes(task);
      return start + duration < nowMinutes;
    })
    .sort((a, b) => a.sort_order - b.sort_order);

  const queue = todayTasks
    .filter((task) => {
      if (task.completed || !task.scheduled_time) return false;
      return parseTimeToMinutes(task.scheduled_time) >= nowMinutes;
    })
    .sort(
      (a, b) =>
        parseTimeToMinutes(a.scheduled_time!) -
        parseTimeToMinutes(b.scheduled_time!)
    );

  return { queue, unscheduled, completed, missed };
}
