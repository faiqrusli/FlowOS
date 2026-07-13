import { getTodayDateString } from "@/lib/date-utils";
import type { Task } from "@/types/task";

export function isEligibleForNextUp(
  task: Pick<Task, "completed" | "planning_state" | "scheduled_date">,
  todayKey = getTodayDateString()
): boolean {
  return (
    !task.completed &&
    task.planning_state !== "later" &&
    (task.scheduled_date === null || task.scheduled_date === todayKey)
  );
}

export function reorderNextUpTasks(
  tasks: Task[],
  fromIndex: number,
  toIndex: number
): Task[] {
  if (
    fromIndex < 0 ||
    fromIndex >= tasks.length ||
    toIndex < 0 ||
    toIndex >= tasks.length ||
    fromIndex === toIndex
  ) {
    return tasks;
  }

  const next = [...tasks];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next.map((task, index) => ({ ...task, queue_order: index + 1 }));
}

export function insertNextUpTask(
  tasks: Task[],
  task: Task,
  beforeTaskId: string | null = null
): Task[] {
  if (tasks.some((item) => item.id === task.id)) return tasks;

  const beforeIndex = beforeTaskId
    ? tasks.findIndex((item) => item.id === beforeTaskId)
    : -1;
  const insertIndex = beforeIndex >= 0 ? beforeIndex : tasks.length;
  const next = [...tasks];
  next.splice(insertIndex, 0, task);

  return next.map((item, index) => ({ ...item, queue_order: index + 1 }));
}

export function getDisplayNextUpTasks(
  tasks: Task[],
  currentTaskId: string | null
): Task[] {
  return currentTaskId
    ? tasks.filter((task) => task.id !== currentTaskId)
    : tasks;
}

export function getNextUpTask(
  tasks: Task[],
  currentTaskId: string | null,
  todayKey = getTodayDateString()
): Task | null {
  return (
    tasks.find(
      (task) =>
        task.id !== currentTaskId && isEligibleForNextUp(task, todayKey)
    ) ?? null
  );
}
