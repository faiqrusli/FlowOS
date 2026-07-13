import {
  getNowMinutesInAppTimezone,
  getTodayDateString,
  parseTimeToMinutes,
} from "@/lib/date-utils";
import {
  DEFAULT_TASK_DURATION,
  getTaskDurationMinutes,
} from "@/lib/timeline-layout";
import type { Task } from "@/types/task";

/** Returns the task whose scheduled window contains `now`, if any. Auto-promotion is gated in `WorkplaceFocusTaskProvider` when Next Up has queue items. */
export function findTaskAtNow(
  tasks: Task[],
  viewDate: string,
  nowMinutes = getNowMinutesInAppTimezone()
): Task | null {
  if (viewDate !== getTodayDateString()) return null;

  for (const task of tasks) {
    if (task.completed || !task.scheduled_time) continue;
    if (task.scheduled_date && task.scheduled_date !== viewDate) continue;

    const start = parseTimeToMinutes(task.scheduled_time);
    const end = start + getTaskDurationMinutes(task);
    if (nowMinutes >= start && nowMinutes < end) {
      return task;
    }
  }

  return null;
}

export function findNextScheduledTask(
  tasks: Task[],
  viewDate: string,
  excludeTaskId: string | null,
  nowMinutes = getNowMinutesInAppTimezone()
): Task | null {
  if (viewDate !== getTodayDateString()) return null;

  const candidates = tasks
    .filter((task) => {
      if (task.completed || !task.scheduled_time) return false;
      if (task.id === excludeTaskId) return false;
      if (task.scheduled_date && task.scheduled_date !== viewDate) return false;
      return parseTimeToMinutes(task.scheduled_time) >= nowMinutes;
    })
    .sort(
      (a, b) =>
        parseTimeToMinutes(a.scheduled_time!) -
        parseTimeToMinutes(b.scheduled_time!)
    );

  return candidates[0] ?? null;
}
