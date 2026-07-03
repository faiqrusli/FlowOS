import {
  formatTimeShort,
  getNowMinutesInAppTimezone,
  parseTimeToMinutes,
} from "@/lib/date-utils";
import { getTaskDurationMinutes } from "@/lib/timeline-layout";
import type { Task } from "@/types/task";

export function formatTaskFocusSchedule(task: Task): string {
  const hasTime = Boolean(task.scheduled_time);
  const duration = task.duration_minutes ?? null;
  const startLabel = formatTimeShort(task.scheduled_time);

  if (hasTime && duration) {
    const endMinutes =
      parseTimeToMinutes(task.scheduled_time!) + getTaskDurationMinutes(task);
    const endHours = Math.floor(endMinutes / 60) % 24;
    const endMins = endMinutes % 60;
    const endTime = `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`;
    const endLabel = formatTimeShort(endTime);
    if (startLabel && endLabel) return `${startLabel} – ${endLabel}`;
  }

  if (hasTime && startLabel) return startLabel;
  if (duration) return `${duration}m`;
  return "—";
}

export function getTaskFocusTimingTone(
  task: Task,
  nowMinutes = getNowMinutesInAppTimezone()
): "before" | "during-or-after" | "neutral" {
  if (!task.scheduled_time) return "neutral";
  const start = parseTimeToMinutes(task.scheduled_time);
  if (nowMinutes < start) return "before";
  return "during-or-after";
}
