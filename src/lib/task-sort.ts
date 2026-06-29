import { normalizeTaskPriority, type TaskPriority } from "@/lib/task-priority";
import { sortByManualOrder } from "@/lib/manual-order";
import type { Task, TaskGroup } from "@/types/task";

const LATER_COLUMN_ID = "__flowos_later_column__";
const TODAY_GROUP_SLUG = "today";
const LATER_GROUP_SLUG = "later";

function isLaterGroupLocal(
  group: Pick<TaskGroup, "slug" | "id"> & Partial<Pick<TaskGroup, "title">>
): boolean {
  if (group.id === LATER_COLUMN_ID) return true;
  if (group.slug === LATER_GROUP_SLUG) return true;
  return group.title === "Later" || group.title === "Backlog";
}

function isTodayGroupLocal(
  group: Pick<TaskGroup, "slug"> & Partial<Pick<TaskGroup, "title">>
): boolean {
  if (group.slug === TODAY_GROUP_SLUG) return true;
  return group.title === "Today" || group.title === "Today's Tasks";
}

export type TaskSortMode =
  | "manual"
  | "priority"
  | "created"
  | "updated"
  | "alphabetical";

export const TASK_SORT_MODES: TaskSortMode[] = [
  "manual",
  "priority",
  "created",
  "updated",
  "alphabetical",
];

export const DEFAULT_TASK_SORT_MODE: TaskSortMode = "manual";

export const TASK_SORT_MODE_LABELS: Record<TaskSortMode, string> = {
  manual: "Manual",
  priority: "Priority",
  created: "Created",
  updated: "Updated",
  alphabetical: "Alphabetical",
};

const PRIORITY_RANK: Record<TaskPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function normalizeTaskSortMode(value: unknown): TaskSortMode {
  if (
    typeof value === "string" &&
    TASK_SORT_MODES.includes(value as TaskSortMode)
  ) {
    return value as TaskSortMode;
  }
  return DEFAULT_TASK_SORT_MODE;
}

export function isManualTaskSortMode(mode: TaskSortMode): boolean {
  return mode === "manual";
}

export function isSortableTaskColumn(
  group: Pick<TaskGroup, "slug" | "id" | "title">
): boolean {
  return !isTodayGroupLocal(group);
}

export function sortTasksForTodayView(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const aTime = a.scheduled_time ?? "99:99";
    const bTime = b.scheduled_time ?? "99:99";
    const timeDiff = aTime.localeCompare(bTime);
    if (timeDiff !== 0) return timeDiff;

    const priorityDiff =
      PRIORITY_RANK[normalizeTaskPriority(a.priority)] -
      PRIORITY_RANK[normalizeTaskPriority(b.priority)];
    if (priorityDiff !== 0) return priorityDiff;

    return a.created_at.localeCompare(b.created_at);
  });
}

export function sortTasksByMode(tasks: Task[], mode: TaskSortMode): Task[] {
  const sorted = [...tasks];

  switch (mode) {
    case "manual":
      return sortByManualOrder(sorted);
    case "priority":
      return sorted.sort((a, b) => {
        const priorityDiff =
          PRIORITY_RANK[normalizeTaskPriority(a.priority)] -
          PRIORITY_RANK[normalizeTaskPriority(b.priority)];
        if (priorityDiff !== 0) return priorityDiff;

        const dateDiff = (a.scheduled_date ?? "").localeCompare(
          b.scheduled_date ?? ""
        );
        if (dateDiff !== 0) return dateDiff;

        const aTime = a.scheduled_time ?? "99:99";
        const bTime = b.scheduled_time ?? "99:99";
        const timeDiff = aTime.localeCompare(bTime);
        if (timeDiff !== 0) return timeDiff;

        return a.created_at.localeCompare(b.created_at);
      });
    case "created":
      return sorted.sort((a, b) => b.created_at.localeCompare(a.created_at));
    case "updated":
      return sorted.sort((a, b) => {
        const aUpdated = a.updated_at ?? a.created_at;
        const bUpdated = b.updated_at ?? b.created_at;
        return bUpdated.localeCompare(aUpdated);
      });
    case "alphabetical":
      return sorted.sort((a, b) => {
        const titleDiff = a.title.localeCompare(b.title, undefined, {
          sensitivity: "base",
        });
        if (titleDiff !== 0) return titleDiff;
        return a.created_at.localeCompare(b.created_at);
      });
    default:
      return sorted;
  }
}

export function sortCompletedTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const aCompleted = a.completed_at ?? a.created_at;
    const bCompleted = b.completed_at ?? b.created_at;
    return bCompleted.localeCompare(aCompleted);
  });
}

export type TaskSortContext = {
  sortMode: TaskSortMode;
  isTodayColumn?: boolean;
};

export function getSortContextForGroup(group: TaskGroup): TaskSortContext {
  return {
    sortMode: getTaskGroupSortMode(group),
    isTodayColumn: isTodayGroupLocal(group),
  };
}

export function sortActiveAndCompletedForContext(
  tasks: Task[],
  context: TaskSortContext
) {
  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  const active = context.isTodayColumn
    ? sortTasksForTodayView(activeTasks)
    : sortTasksByMode(activeTasks, context.sortMode);

  const completed = sortCompletedTasks(completedTasks);

  return { active, completed };
}

const LATER_SORT_STORAGE_KEY = "flowos:later-column-sort-mode";

function readLaterSortModeFromStorage(): TaskSortMode | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LATER_SORT_STORAGE_KEY);
    if (!raw) return null;
    return normalizeTaskSortMode(raw);
  } catch {
    return null;
  }
}

export function getLaterColumnSortMode(): TaskSortMode {
  return readLaterSortModeFromStorage() ?? DEFAULT_TASK_SORT_MODE;
}

export function setLaterColumnSortMode(mode: TaskSortMode): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LATER_SORT_STORAGE_KEY, mode);
}

export function getTaskGroupSortMode(group: TaskGroup): TaskSortMode {
  if (isLaterGroupLocal(group)) {
    return getLaterColumnSortMode();
  }
  return normalizeTaskSortMode(group.sort_mode);
}

export function applyLaterColumnSortMode<T extends TaskGroup>(groups: T[]): T[] {
  const laterMode = getLaterColumnSortMode();
  return groups.map((group) =>
    isLaterGroupLocal(group) ? { ...group, sort_mode: laterMode } : group
  );
}

export function canReorderTasksInGroup(group: TaskGroup): boolean {
  if (!isSortableTaskColumn(group)) return false;
  return isManualTaskSortMode(getTaskGroupSortMode(group));
}

export { LATER_COLUMN_ID as TASK_SORT_LATER_COLUMN_ID };

export const REORDER_DISABLED_TOOLTIP =
  "Switch to Manual sorting to reorder tasks.";
