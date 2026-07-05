import { parseTimeToMinutes } from "@/lib/date-utils";
import { normalizeTaskPriority } from "@/lib/task-priority";
import { partitionWorkplaceHabits } from "@/lib/workplace-habits";
import { partitionWorkplaceTasks } from "@/lib/workplace-tasks";
import type { Habit } from "@/types/habit";
import type { ScheduleItem } from "@/types/schedule";
import type { Task } from "@/types/task";

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };
const NO_SCHEDULE_SORT = Number.MAX_SAFE_INTEGER;

export type NextQueueItem =
  | { kind: "task"; task: Task }
  | { kind: "habit"; habit: Habit };

function scheduleSortMinutes(item: NextQueueItem): number {
  const scheduledTime =
    item.kind === "task" ? item.task.scheduled_time : item.habit.scheduled_time;
  if (!scheduledTime) return NO_SCHEDULE_SORT;
  return parseTimeToMinutes(scheduledTime);
}

function priorityRank(item: NextQueueItem): number {
  if (item.kind === "habit") return PRIORITY_ORDER.medium;
  return PRIORITY_ORDER[normalizeTaskPriority(item.task.priority)];
}

function createdAt(item: NextQueueItem): string {
  return item.kind === "task" ? item.task.created_at : item.habit.created_at;
}

function compareNextQueueItems(a: NextQueueItem, b: NextQueueItem): number {
  const scheduleDelta = scheduleSortMinutes(a) - scheduleSortMinutes(b);
  if (scheduleDelta !== 0) return scheduleDelta;

  const priorityDelta = priorityRank(a) - priorityRank(b);
  if (priorityDelta !== 0) return priorityDelta;

  return createdAt(a).localeCompare(createdAt(b));
}

export function buildNextQueue(
  tasks: Task[],
  habits: Habit[],
  todayViewDate: string,
  _options?: { timeline?: ScheduleItem[] }
): NextQueueItem[] {
  const taskSections = partitionWorkplaceTasks(tasks, todayViewDate);
  const habitSections = partitionWorkplaceHabits(habits, todayViewDate);

  const items: NextQueueItem[] = [
    ...taskSections.queue.map((task) => ({ kind: "task" as const, task })),
    ...habitSections.incomplete.map((habit) => ({
      kind: "habit" as const,
      habit,
    })),
  ];

  return items.sort(compareNextQueueItems);
}

export function nextQueueItemKey(item: NextQueueItem): string {
  return item.kind === "task" ? `task:${item.task.id}` : `habit:${item.habit.id}`;
}
