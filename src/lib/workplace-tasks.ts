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

export type WorkplaceTaskTab = "todo" | "missed" | "completed";

export type WorkplaceTaskTodoSections = {
  scheduled: Task[];
  anytime: Task[];
};

export type WorkplaceTaskSections = {
  todo: WorkplaceTaskTodoSections;
  missed: Task[];
  completed: Task[];
};

/** Incomplete scheduled task whose window has ended (end = start + duration). */
export function isTaskIntradayMissed(
  task: Task,
  nowMinutes: number = getNowMinutesInAppTimezone()
): boolean {
  if (task.completed || !task.scheduled_time) return false;
  const start = parseTimeToMinutes(task.scheduled_time);
  const duration = getTaskDurationMinutes(task);
  return start + duration < nowMinutes;
}

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

  const anytime = filterUnscheduledTasksForDay(tasks, todayViewDate);

  const completed = todayTasks
    .filter((task) => task.completed)
    .sort((a, b) => a.sort_order - b.sort_order);

  const missed = todayTasks
    .filter((task) => isTaskIntradayMissed(task, nowMinutes))
    .sort((a, b) => a.sort_order - b.sort_order);

  /** Upcoming + in-progress scheduled tasks (not yet past end time). */
  const scheduled = todayTasks
    .filter((task) => {
      if (task.completed || !task.scheduled_time) return false;
      return !isTaskIntradayMissed(task, nowMinutes);
    })
    .sort(
      (a, b) =>
        parseTimeToMinutes(a.scheduled_time!) -
        parseTimeToMinutes(b.scheduled_time!)
    );

  return {
    todo: { scheduled, anytime },
    missed,
    completed,
  };
}

export function workplaceTaskTodoCount(sections: WorkplaceTaskSections): number {
  return sections.todo.scheduled.length + sections.todo.anytime.length;
}

/** Which Today tasks-card tab owns this task (null if not in any tab). */
export function resolveWorkplaceTaskTab(
  task: Task,
  tasks: Task[],
  todayViewDate: string
): WorkplaceTaskTab | null {
  const sections = partitionWorkplaceTasks(tasks, todayViewDate);

  if (
    sections.todo.scheduled.some((item) => item.id === task.id) ||
    sections.todo.anytime.some((item) => item.id === task.id)
  ) {
    return "todo";
  }
  if (sections.missed.some((item) => item.id === task.id)) return "missed";
  if (sections.completed.some((item) => item.id === task.id)) return "completed";

  return null;
}
