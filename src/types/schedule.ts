import type { TaskBuckets } from "@/lib/tasks";
import type { TaskPriority } from "@/lib/task-priority";
import type { Habit } from "@/types/habit";
import type { Task } from "@/types/task";

export type ScheduleItemType = "task" | "habit" | "focus";

export type ScheduleItem = {
  id: string;
  entityId: string;
  title: string;
  subtitle?: string;
  type: ScheduleItemType;
  time: string | null;
  timeEnd?: string | null;
  timeSort: number;
  timeEndSort?: number;
  durationMinutes?: number;
  priority?: TaskPriority | null;
  completed: boolean;
  href: string;
  isActiveFocus?: boolean;
};

export type ScheduleSummary = {
  completed: number;
  total: number;
  remaining: number;
  nextItem: ScheduleItem | null;
};

export type ScheduleData = {
  items: ScheduleItem[];
  tasks: Task[];
  habits: Habit[];
  buckets: TaskBuckets;
};
