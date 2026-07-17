import { requireUserId } from "@/lib/auth";
import { getTodayDateString } from "@/lib/date-utils";
import { notifyNextUpUpdated } from "@/lib/next-up-events";
import { supabase } from "@/lib/supabase";
import { TasksError } from "@/lib/tasks";
import type { Task } from "@/types/task";
export {
  getDisplayNextUpTasks,
  getNextUpTask,
  insertNextUpTask,
  isEligibleForNextUp,
  pruneNextUpTasks,
  reorderNextUpTasks,
} from "@/lib/task-next-up-logic";
import {
  insertNextUpTask,
  isEligibleForNextUp,
} from "@/lib/task-next-up-logic";

export type TaskQueueOrderUpdate = {
  id: string;
  queue_order: number | null;
};

function normalizeQueuedTask(task: Task): Task {
  return {
    ...task,
    queue_order: task.queue_order ?? null,
    planning_state: task.planning_state ?? "none",
    notification_lead_minutes: task.notification_lead_minutes ?? null,
    updated_at: task.updated_at ?? task.created_at,
    completed_at: task.completed_at ?? null,
  };
}

export async function fetchNextUpTasks(
  todayKey = getTodayDateString()
): Promise<Task[]> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .eq("completed", false)
    .neq("planning_state", "later")
    .not("queue_order", "is", null)
    .or(`scheduled_date.eq.${todayKey},scheduled_date.is.null`)
    .order("queue_order", { ascending: true });

  if (error) throw new TasksError(error.message);
  return (data ?? []).map((task) => normalizeQueuedTask(task));
}

export async function insertTaskToNextUp(
  taskId: string,
  beforeTaskId: string | null = null
): Promise<Task | null> {
  const items = await fetchNextUpTasks();
  if (items.some((item) => item.id === taskId)) return null;

  const userId = await requireUserId();
  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .eq("user_id", userId)
    .single();
  if (taskError) throw new TasksError(taskError.message);
  if (!isEligibleForNextUp(normalizeQueuedTask(task))) {
    throw new TasksError("Only incomplete Today or unscheduled tasks can be added to Next Up.");
  }

  const queuedTask = normalizeQueuedTask(task);
  const ordered = insertNextUpTask(items, queuedTask, beforeTaskId);
  const updates: TaskQueueOrderUpdate[] = ordered.map((item, index) => ({
    id: item.id,
    queue_order: index + 1,
  }));
  const { error } = await supabase.rpc("batch_update_task_queue_orders", {
    p_updates: updates,
  });

  if (error) throw new TasksError(error.message);
  const inserted = ordered.find((item) => item.id === taskId) ?? queuedTask;
  notifyNextUpUpdated({ kind: "added", task: inserted });
  return inserted;
}

export async function appendTaskToNextUp(taskId: string): Promise<Task | null> {
  return insertTaskToNextUp(taskId);
}

export async function removeTaskFromNextUp(taskId: string): Promise<void> {
  const userId = await requireUserId();
  const { error } = await supabase
    .from("tasks")
    .update({ queue_order: null })
    .eq("id", taskId)
    .eq("user_id", userId);

  if (error) throw new TasksError(error.message);
  notifyNextUpUpdated({ kind: "changed" });
}

export async function persistNextUpOrder(tasks: Task[]): Promise<void> {
  const updates: TaskQueueOrderUpdate[] = tasks.map((task, index) => ({
    id: task.id,
    queue_order: index + 1,
  }));
  const { error } = await supabase.rpc("batch_update_task_queue_orders", {
    p_updates: updates,
  });

  if (error) throw new TasksError(error.message);
  notifyNextUpUpdated({ kind: "changed" });
}
