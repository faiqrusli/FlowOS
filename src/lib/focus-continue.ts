import {
  getTaskFocusTotals,
  type StoredActiveFocusSession,
} from "@/lib/focus-active-session";
import {
  getDateKeyInTimezone,
  getTodayDateString,
  parseTimestamp,
} from "@/lib/date-utils";
import type { Task } from "@/types/task";

export type TodayFocusedTaskRow = {
  taskId: string;
  focusedSeconds: number;
  lastFocusedAt: string;
};

/** Aggregate focus_session_task_totals rows that were updated today. */
export function aggregateTodayFocusedTaskRows(
  rows: Array<{
    task_id: string;
    focused_seconds: number;
    updated_at: string;
  }>,
  todayKey = getTodayDateString()
): TodayFocusedTaskRow[] {
  const byTask = new Map<string, TodayFocusedTaskRow>();

  for (const row of rows) {
    if (getDateKeyInTimezone(row.updated_at) !== todayKey) continue;
    if (row.focused_seconds <= 0) continue;

    const existing = byTask.get(row.task_id);
    if (!existing) {
      byTask.set(row.task_id, {
        taskId: row.task_id,
        focusedSeconds: row.focused_seconds,
        lastFocusedAt: row.updated_at,
      });
      continue;
    }

    const nextSeconds = existing.focusedSeconds + row.focused_seconds;
    const nextLast =
      parseTimestamp(row.updated_at).getTime() >
      parseTimestamp(existing.lastFocusedAt).getTime()
        ? row.updated_at
        : existing.lastFocusedAt;
    byTask.set(row.task_id, {
      taskId: row.task_id,
      focusedSeconds: nextSeconds,
      lastFocusedAt: nextLast,
    });
  }

  return Array.from(byTask.values());
}

/** Fold live active-session attribution into today's focus history. */
export function mergeActiveSessionIntoTodayFocus(
  history: TodayFocusedTaskRow[],
  session: StoredActiveFocusSession | null,
  now = Date.now()
): TodayFocusedTaskRow[] {
  if (!session || session.timer_type !== "quick") return history;

  const totals = getTaskFocusTotals(session, now);
  const byTask = new Map(history.map((row) => [row.taskId, { ...row }]));
  const nowIso = new Date(now).toISOString();
  const currentTaskId =
    session.target_type === "task" && session.target_id
      ? session.target_id
      : null;

  for (const [taskId, focusedSeconds] of Object.entries(totals)) {
    if (focusedSeconds <= 0) continue;
    const existing = byTask.get(taskId);
    const lastFocusedAt =
      taskId === currentTaskId
        ? nowIso
        : (existing?.lastFocusedAt ?? session.started_at);
    byTask.set(taskId, {
      taskId,
      focusedSeconds: Math.max(existing?.focusedSeconds ?? 0, focusedSeconds),
      lastFocusedAt,
    });
  }

  return Array.from(byTask.values());
}

/**
 * Continue = unfinished tasks focused today, excluding Now and Next Up.
 * Ordered most recently focused first.
 */
export function selectContinueTasks(options: {
  tasks: Task[];
  focusedToday: TodayFocusedTaskRow[];
  nowTaskId: string | null;
  nextUpTaskIds: Iterable<string>;
}): Task[] {
  const queued = new Set(options.nextUpTaskIds);
  const byId = new Map(options.tasks.map((task) => [task.id, task]));
  const ranked = [...options.focusedToday].sort(
    (a, b) =>
      parseTimestamp(b.lastFocusedAt).getTime() -
      parseTimestamp(a.lastFocusedAt).getTime()
  );

  const result: Task[] = [];
  for (const row of ranked) {
    if (row.focusedSeconds <= 0) continue;
    if (row.taskId === options.nowTaskId) continue;
    if (queued.has(row.taskId)) continue;
    const task = byId.get(row.taskId);
    if (!task || task.completed) continue;
    result.push(task);
  }
  return result;
}
