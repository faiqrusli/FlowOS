import type { TaskPriority } from "@/lib/task-priority";

export type Task = {
  id: string;
  title: string;
  description: string | null;
  scheduled_date: string | null;
  scheduled_time: string | null;
  priority: TaskPriority | null;
  user_id: string | null;
  completed: boolean;
  created_at: string;
};

export type TaskInsert = {
  title: string;
  description?: string | null;
  scheduled_date?: string | null;
  scheduled_time?: string | null;
  priority?: TaskPriority | null;
  user_id?: string | null;
};

export type TaskUpdate = Partial<TaskInsert>;
