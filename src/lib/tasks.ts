import { supabase } from "@/lib/supabase";
import { requireUserId } from "@/lib/auth";
import { formatTimeShort, getTodayDateString } from "@/lib/date-utils";
import {
  normalizeTaskPriority,
  TASK_PRIORITY_CONFIG,
  type TaskPriority,
} from "@/lib/task-priority";
import type { Task, TaskInsert, TaskUpdate } from "@/types/task";

export class TasksError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TasksError";
  }
}

export type TaskBuckets = {
  today: Task[];
  todayIncomplete: Task[];
  todayCompleted: Task[];
  missed: Task[];
  upcoming: Task[];
  completedPast: Task[];
};

export type TodayTaskProgress = {
  completed: number;
  total: number;
  percent: number;
};

export function computeTodayTaskProgress(today: Task[]): TodayTaskProgress {
  const total = today.length;
  const completed = today.filter((task) => task.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { completed, total, percent };
}

export function isTaskToday(
  task: Task,
  todayKey = getTodayDateString()
): boolean {
  return task.scheduled_date === todayKey;
}

export function isTaskMissed(
  task: Task,
  todayKey = getTodayDateString()
): boolean {
  return (
    !task.completed &&
    Boolean(task.scheduled_date && task.scheduled_date < todayKey)
  );
}

function sortBySchedule(a: Task, b: Task): number {
  const dateCompare = (a.scheduled_date ?? "").localeCompare(
    b.scheduled_date ?? ""
  );
  if (dateCompare !== 0) return dateCompare;

  const aTime = a.scheduled_time ?? "99:99";
  const bTime = b.scheduled_time ?? "99:99";
  return aTime.localeCompare(bTime);
}

function sortTodayTasks(a: Task, b: Task): number {
  if (a.completed !== b.completed) {
    return a.completed ? 1 : -1;
  }

  return sortBySchedule(a, b);
}

export function partitionTasks(
  tasks: Task[],
  todayKey = getTodayDateString()
): TaskBuckets {
  const today: Task[] = [];
  const missed: Task[] = [];
  const upcoming: Task[] = [];
  const completedPast: Task[] = [];

  for (const task of tasks) {
    if (isTaskToday(task, todayKey)) {
      today.push(task);
      continue;
    }

    if (task.completed) {
      completedPast.push(task);
      continue;
    }

    if (isTaskMissed(task, todayKey)) {
      missed.push(task);
      continue;
    }

    upcoming.push(task);
  }

  today.sort(sortTodayTasks);
  missed.sort(sortBySchedule);
  upcoming.sort(sortBySchedule);
  completedPast.sort((a, b) => {
    const dateCompare = (b.scheduled_date ?? "").localeCompare(
      a.scheduled_date ?? ""
    );
    if (dateCompare !== 0) return dateCompare;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const todayIncomplete = today.filter((task) => !task.completed);
  const todayCompleted = today.filter((task) => task.completed);

  return {
    today,
    todayIncomplete,
    todayCompleted,
    missed,
    upcoming,
    completedPast,
  };
}

export async function fetchTodayTasks(dateKey = getTodayDateString()): Promise<Task[]> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .eq("scheduled_date", dateKey)
    .order("scheduled_time", { ascending: true, nullsFirst: false });

  if (error) {
    throw new TasksError(error.message);
  }

  return data ?? [];
}

export async function fetchTasks(): Promise<Task[]> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new TasksError(error.message);
  }

  return data ?? [];
}

export async function createTask(input: TaskInsert): Promise<Task> {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      ...input,
      priority: input.priority ?? "medium",
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
    throw new TasksError(error.message);
  }

  return data;
}

export async function updateTask(id: string, input: TaskUpdate): Promise<Task> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("tasks")
    .update(input)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    throw new TasksError(error.message);
  }

  return data;
}

export async function toggleTaskComplete(task: Task): Promise<Task> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("tasks")
    .update({ completed: !task.completed })
    .eq("id", task.id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    throw new TasksError(error.message);
  }

  return data;
}

export async function deleteTask(id: string): Promise<void> {
  const userId = await requireUserId();
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new TasksError(error.message);
  }
}

export function getTaskPriority(task: Task): TaskPriority {
  return normalizeTaskPriority(task.priority);
}

export function formatTaskCardMeta(
  task: Task,
  variant: "today" | "upcoming" | "completed"
): string | null {
  const priority = TASK_PRIORITY_CONFIG[getTaskPriority(task)].label;

  if (variant === "upcoming") {
    const dateLabel = formatTaskDateLabel(task.scheduled_date);
    if (dateLabel && task.scheduled_time) {
      const time = formatTimeShort(task.scheduled_time);
      return time ? `${dateLabel} · ${time}` : dateLabel;
    }
    return dateLabel;
  }

  const time = formatTimeShort(task.scheduled_time);
  if (time) {
    return `${time} • ${priority}`;
  }

  if (variant === "completed") {
    return priority;
  }

  return priority;
}

function formatTaskDateLabel(date: string | null): string | null {
  if (!date) return null;

  return new Date(`${date}T12:00:00+08:00`).toLocaleDateString("en-SG", {
    timeZone: "Asia/Singapore",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTaskSchedule(task: Task): string | null {
  const parts: string[] = [];

  if (task.scheduled_date) {
    parts.push(
      new Date(`${task.scheduled_date}T12:00:00+08:00`).toLocaleDateString(
        "en-SG",
        {
          timeZone: "Asia/Singapore",
          month: "short",
          day: "numeric",
          year: "numeric",
        }
      )
    );
  }

  const time = formatTimeShort(task.scheduled_time);
  if (time) {
    parts.push(time);
  }

  return parts.length > 0 ? parts.join(" · ") : null;
}
