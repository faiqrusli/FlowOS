import {
  getTaskFocusedSeconds,
  type StoredActiveFocusSession,
} from "@/lib/focus-active-session";
import { formatTimerClock } from "@/lib/focus-utils";

/** True when this task is the active focus target (including paused focus). */
export function isTimelineTaskInFocus(
  session: StoredActiveFocusSession | null | undefined,
  taskId: string
): boolean {
  if (!session) return false;
  if (session.target_type !== "task" || session.target_id !== taskId) {
    return false;
  }
  // Break mode is not "working on" the task — hide focus chrome.
  return session.mode === "focus";
}

export function getTimelineTaskFocusClock(
  session: StoredActiveFocusSession,
  taskId: string,
  now = Date.now()
): string {
  return formatTimerClock(getTaskFocusedSeconds(session, taskId, now));
}
