import type { TaskPriority } from "@/lib/task-priority";
import type { TaskSortMode } from "@/lib/task-sort";

export type PlanningState = "none" | "later";

export type TaskGroup = {
  id: string;
  user_id: string;
  title: string;
  slug: string | null;
  sort_order: number;
  icon?: string | null;
  color?: string | null;
  sort_mode?: TaskSortMode | null;
  created_at: string;
};

export type TaskGroupInsert = {
  title: string;
  slug?: string | null;
  sort_order?: number;
  icon?: string | null;
  color?: string | null;
  sort_mode?: TaskSortMode;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  scheduled_date: string | null;
  scheduled_time: string | null;
  priority: TaskPriority | null;
  user_id: string | null;
  group_id: string | null;
  /** Persistent manualOrder — always a positive integer (stored as sort_order). */
  sort_order: number;
  duration_minutes: number | null;
  notification_enabled: boolean;
  notification_lead_minutes: number | null;
  completed: boolean;
  planning_state: PlanningState;
  created_at: string;
  updated_at?: string | null;
  completed_at?: string | null;
};

export type TaskGroupWithTasks = TaskGroup & {
  tasks: Task[];
};

export type TaskInsert = {
  title: string;
  description?: string | null;
  scheduled_date?: string | null;
  scheduled_time?: string | null;
  priority?: TaskPriority | null;
  user_id?: string | null;
  group_id?: string | null;
  sort_order?: number;
  duration_minutes?: number | null;
  notification_enabled?: boolean;
  notification_lead_minutes?: number | null;
  planning_state?: PlanningState;
};

export type TaskUpdate = Partial<TaskInsert> & {
  completed?: boolean;
  planning_state?: PlanningState;
  completed_at?: string | null;
};
