import { filterTasksForGroup, sortActiveAndCompleted } from "@/lib/task-groups";
import type { Task, TaskGroupWithTasks } from "@/types/task";

export type ColumnDisplayedTasks = {
  active: Task[];
  completed: Task[];
};

const cache = new WeakMap<
  TaskGroupWithTasks,
  { tasksRef: Task[]; todayViewDate: string; value: ColumnDisplayedTasks }
>();

/** Memoize filtered/sorted column lists — avoids rebuilding on unrelated board updates. */
export function getCachedColumnDisplayedTasks(
  group: TaskGroupWithTasks,
  todayViewDate: string
): ColumnDisplayedTasks {
  const hit = cache.get(group);
  if (
    hit &&
    hit.tasksRef === group.tasks &&
    hit.todayViewDate === todayViewDate
  ) {
    return hit.value;
  }

  const visible = filterTasksForGroup(group, group.tasks, todayViewDate);
  const value = sortActiveAndCompleted(visible, group);
  cache.set(group, { tasksRef: group.tasks, todayViewDate, value });
  return value;
}

export function getCachedActiveTaskIds(
  group: TaskGroupWithTasks,
  todayViewDate: string
): string[] {
  return getCachedColumnDisplayedTasks(group, todayViewDate).active.map(
    (task) => task.id
  );
}
