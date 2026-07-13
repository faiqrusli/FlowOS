import type { ManualOrderUpdate } from "@/lib/manual-order";
import {
  applyManualOrderUpdates,
  computeManualOrderRepairs,
  MANUAL_ORDER_INITIAL,
  normalizeTaskManualOrder,
  resolveManualOrderForCreate,
} from "@/lib/manual-order";
import { supabase } from "@/lib/supabase";
import { requireUserId } from "@/lib/auth";
import { formatTimeShort, formatRelativeDateLabel, getTodayDateString } from "@/lib/date-utils";
import {
  normalizeTaskPriority,
  TASK_PRIORITY_CONFIG,
  type TaskPriority,
} from "@/lib/task-priority";
import { normalizePlanningState } from "@/lib/task-planning";
import { notifyNextUpUpdated } from "@/lib/next-up-events";
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

export type TaskScheduleDateTone = "none" | "today" | "overdue" | "future";

export function getTaskScheduleDateTone(
  task: Pick<Task, "scheduled_date" | "completed">,
  todayKey: string
): TaskScheduleDateTone {
  if (!task.scheduled_date) return "none";
  if (task.scheduled_date === todayKey) return "today";
  if (!task.completed && task.scheduled_date < todayKey) return "overdue";
  return "future";
}

export function getTaskScheduleDateColorClass(
  tone: TaskScheduleDateTone
): string {
  switch (tone) {
    case "today":
      return "text-sky-600";
    case "overdue":
      return "text-red-600";
    case "none":
    case "future":
    default:
      return "text-muted-foreground/70";
  }
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

  return (data ?? []).map((task) => normalizeTaskFromDb(task));
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

  return (data ?? []).map((task) => normalizeTaskFromDb(task));
}

function normalizeTaskFromDb(task: Task): Task {
  return normalizeTaskManualOrder({
    ...task,
    notification_lead_minutes: task.notification_lead_minutes ?? null,
    planning_state: normalizePlanningState(task.planning_state),
    queue_order: task.queue_order ?? null,
    updated_at: task.updated_at ?? task.created_at,
    completed_at: task.completed_at ?? null,
  });
}

/** Repair and persist tasks missing a valid manualOrder. Returns normalized tasks. */
export async function repairMissingManualOrders(tasks: Task[]): Promise<Task[]> {
  const normalized = tasks.map((task) =>
    normalizeTaskManualOrder({
      ...task,
      planning_state: normalizePlanningState(task.planning_state),
    })
  );
  const repairs = computeManualOrderRepairs(normalized);
  if (repairs.length === 0) return normalized;

  await batchUpdateManualOrders(repairs);
  return applyManualOrderUpdates(normalized, repairs);
}

export async function createTask(input: TaskInsert): Promise<Task> {
  const userId = await requireUserId();
  const sort_order = resolveManualOrderForCreate(
    input.sort_order,
    MANUAL_ORDER_INITIAL
  );

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      ...input,
      priority: input.priority ?? "low",
      user_id: userId,
      sort_order,
      notification_enabled: input.notification_enabled ?? true,
      scheduled_date: input.scheduled_date ?? null,
      planning_state: input.planning_state ?? "none",
    })
    .select()
    .single();

  if (error) {
    throw new TasksError(error.message);
  }

  return normalizeTaskFromDb(data);
}

export async function updateTask(id: string, input: TaskUpdate): Promise<Task> {
  const userId = await requireUserId();
  const payload: TaskUpdate = { ...input };
  if (payload.sort_order !== undefined) {
    payload.sort_order = resolveManualOrderForCreate(payload.sort_order);
  }
  const leavesNextUp =
    payload.completed === true ||
    payload.planning_state === "later" ||
    ("scheduled_date" in payload &&
      payload.scheduled_date !== null &&
      payload.scheduled_date !== getTodayDateString());
  if (leavesNextUp) {
    payload.queue_order = null;
  }

  const { data, error } = await supabase
    .from("tasks")
    .update(payload)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    throw new TasksError(error.message);
  }

  const updated = normalizeTaskFromDb(data);
  if (leavesNextUp) notifyNextUpUpdated({ kind: "changed" });
  return updated;
}

/** Single RPC round-trip to persist manual order changes after drop. */
export async function batchUpdateManualOrders(
  updates: ManualOrderUpdate[]
): Promise<void> {
  if (updates.length === 0) return;

  const userId = await requireUserId();
  const { error } = await supabase.rpc("batch_update_task_manual_orders", {
    p_user_id: userId,
    p_updates: updates,
  });

  if (error) {
    throw new TasksError(error.message);
  }
}

export async function toggleTaskComplete(task: Task): Promise<Task> {
  const userId = await requireUserId();
  const nextCompleted = !task.completed;
  const { data, error } = await supabase
    .from("tasks")
    .update({
      completed: nextCompleted,
      completed_at: nextCompleted ? new Date().toISOString() : null,
      ...(nextCompleted ? { queue_order: null } : {}),
    })
    .eq("id", task.id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    throw new TasksError(error.message);
  }

  const updated = normalizeTaskFromDb(data);
  if (nextCompleted) notifyNextUpUpdated({ kind: "changed" });
  return updated;
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

export async function duplicateTask(
  task: Task,
  groupId: string,
  sortOrder: number
): Promise<Task> {
  return createTask({
    title: task.title,
    description: task.description,
    scheduled_date: task.scheduled_date,
    scheduled_time: task.scheduled_time,
    priority: task.priority,
    group_id: groupId,
    sort_order: sortOrder,
    duration_minutes: task.duration_minutes,
    notification_enabled: task.notification_enabled,
    notification_lead_minutes: task.notification_lead_minutes,
    planning_state: task.planning_state,
  });
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
  return formatTaskScheduleParts(task, { includeYear: true });
}

export function formatTaskScheduleCompact(task: Task): string | null {
  return formatTaskScheduleParts(task, { includeYear: false });
}

function formatTaskScheduleParts(
  task: Task,
  { includeYear }: { includeYear: boolean }
): string | null {
  const parts: string[] = [];

  if (task.scheduled_date) {
    parts.push(
      includeYear
        ? new Date(`${task.scheduled_date}T12:00:00+08:00`).toLocaleDateString(
            "en-SG",
            {
              timeZone: "Asia/Singapore",
              month: "short",
              day: "numeric",
              year: "numeric",
            }
          )
        : formatRelativeDateLabel(task.scheduled_date)
    );
  }

  const time = formatTimeShort(task.scheduled_time);
  if (time) {
    parts.push(time);
  }

  return parts.length > 0 ? parts.join(" · ") : null;
}
