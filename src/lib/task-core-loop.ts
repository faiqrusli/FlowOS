import type { Task, TaskUpdate } from "@/types/task";

export type TaskRecordState =
  | "open"
  | "deferred"
  | "completed"
  | "withdrawn";

export type TaskOperation =
  | "create"
  | "revise"
  | "complete"
  | "restore"
  | "defer"
  | "withdraw"
  | "correct"
  | "select-for-focus";

export type TaskOperationPhase = "idle" | "pending" | "confirmed" | "failed";

export type TaskOperationState = {
  phase: TaskOperationPhase;
  operation: TaskOperation | null;
  requestId: number;
  confirmedTask: Task | null;
  requestedTask: Task | null;
  errorMessage: string | null;
};

export type PlannedTaskSelection = {
  taskId: string;
  label: string;
  meaning: "planned";
  taskStateUnchanged: true;
};

export function getTaskRecordState(task: Pick<Task, "completed" | "planning_state" | "withdrawn_at">): TaskRecordState {
  if (task.withdrawn_at) return "withdrawn";
  if (task.completed) return "completed";
  if (task.planning_state === "later") return "deferred";
  return "open";
}

export function isTaskActive(task: Pick<Task, "withdrawn_at">): boolean {
  return !task.withdrawn_at;
}

export function getTaskRecordStateLabel(state: TaskRecordState): string {
  switch (state) {
    case "completed":
      return "Completed commitment";
    case "deferred":
      return "Deferred commitment";
    case "withdrawn":
      return "Withdrawn; history retained";
    case "open":
    default:
      return "Open commitment";
  }
}

export function createIdleTaskOperationState(): TaskOperationState {
  return {
    phase: "idle",
    operation: null,
    requestId: 0,
    confirmedTask: null,
    requestedTask: null,
    errorMessage: null,
  };
}

export function beginTaskOperation(
  previous: TaskOperationState,
  operation: TaskOperation,
  confirmedTask: Task | null,
  requestedTask: Task | null,
): TaskOperationState {
  return {
    phase: "pending",
    operation,
    requestId: previous.requestId + 1,
    confirmedTask,
    requestedTask,
    errorMessage: null,
  };
}

export function confirmTaskOperation(
  state: TaskOperationState,
  confirmedTask: Task | null,
): TaskOperationState {
  return {
    ...state,
    phase: "confirmed",
    confirmedTask,
    requestedTask: null,
    errorMessage: null,
  };
}

export function failTaskOperation(
  state: TaskOperationState,
  errorMessage: string,
): TaskOperationState {
  return {
    ...state,
    phase: "failed",
    requestedTask: null,
    errorMessage,
  };
}

export function buildCompleteTaskUpdate(
  completedAt = new Date().toISOString(),
): TaskUpdate {
  return { completed: true, completed_at: completedAt };
}

export function buildRestoreTaskUpdate(): TaskUpdate {
  return { completed: false, completed_at: null, withdrawn_at: null, planning_state: "none" };
}

export function buildDeferTaskUpdate(): TaskUpdate {
  return {
    planning_state: "later",
    scheduled_date: null,
    scheduled_time: null,
    queue_order: null,
  };
}

export function buildWithdrawTaskUpdate(
  withdrawnAt = new Date().toISOString(),
): TaskUpdate {
  return {
    withdrawn_at: withdrawnAt,
    queue_order: null,
  };
}

export function buildCorrectionTaskUpdate(input: TaskUpdate): TaskUpdate {
  return { ...input };
}

/**
 * Focus receives a planned identity only. This helper deliberately returns no
 * task mutation so callers cannot accidentally turn selection into evidence.
 */
export function selectTaskForFocus(task: Pick<Task, "id" | "title">): PlannedTaskSelection {
  return {
    taskId: task.id,
    label: task.title,
    meaning: "planned",
    taskStateUnchanged: true,
  };
}

