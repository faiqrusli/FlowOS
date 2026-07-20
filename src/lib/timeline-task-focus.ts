import {
  getTaskFocusedSeconds,
  type StoredActiveFocusSession,
} from "@/lib/focus-active-session";
import { formatTimerClock } from "@/lib/focus-utils";

/** True when this task is the active focus target (including paused focus and break). */
export function isTimelineTaskInFocus(
  session: StoredActiveFocusSession | null | undefined,
  taskId: string
): boolean {
  if (!session) return false;
  if (session.target_type !== "task" || session.target_id !== taskId) {
    return false;
  }
  return true;
}

/** Pause or break — quieter in-focus cue, no breathe motion. */
export function isTimelineTaskFocusSoftened(
  session: StoredActiveFocusSession | null | undefined,
  taskId: string
): boolean {
  if (!isTimelineTaskInFocus(session, taskId) || !session) return false;
  return session.session_status === "paused" || session.mode === "break";
}

export function getTimelineTaskFocusClock(
  session: StoredActiveFocusSession,
  taskId: string,
  now = Date.now()
): string {
  return formatTimerClock(getTaskFocusedSeconds(session, taskId, now));
}
