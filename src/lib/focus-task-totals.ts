import { requireUserId } from "@/lib/auth";
import {
  getTaskFocusTotals,
  type StoredActiveFocusSession,
} from "@/lib/focus-active-session";
import { supabase } from "@/lib/supabase";
import { FocusSessionsError } from "@/lib/focus-sessions";

/**
 * Writes task-focused time only at session transition boundaries. The active
 * session remains the immediate source of truth, so a transient network
 * failure never interrupts timing or target switching.
 */
export async function persistFocusTaskTotals(
  session: StoredActiveFocusSession
): Promise<void> {
  if (
    session.timer_type !== "quick" ||
    !session.task_focus_session_id
  ) {
    return;
  }

  const userId = await requireUserId();
  const totals = getTaskFocusTotals(session);
  const updatedAt = new Date().toISOString();
  const rows = Object.entries(totals)
    .filter(([, focusedSeconds]) => focusedSeconds > 0)
    .map(([task_id, focused_seconds]) => ({
      user_id: userId,
      focus_session_id: session.task_focus_session_id!,
      task_id,
      focused_seconds,
      updated_at: updatedAt,
    }));

  if (rows.length === 0) return;

  const { error } = await supabase
    .from("focus_session_task_totals")
    .upsert(rows, { onConflict: "user_id,focus_session_id,task_id" });

  if (error) throw new FocusSessionsError(error.message);
}
