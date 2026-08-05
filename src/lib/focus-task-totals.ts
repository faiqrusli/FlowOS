import { requireUserId } from "@/lib/auth";
import {
  getTaskFocusTotals,
  type StoredActiveFocusSession,
} from "@/lib/focus-active-session";
import {
  aggregateTodayFocusedTaskRows,
  type TodayFocusedTaskRow,
} from "@/lib/focus-continue";
import { FocusSessionsError } from "@/lib/focus-sessions";
import { getTodayDateString } from "@/lib/date-utils";
import {
  FOCUS_ATTRIBUTION_UNAVAILABLE_MESSAGE,
  getPhase3Capability,
} from "@/lib/phase3-capabilities";
import { supabase } from "@/lib/supabase";

export class FocusTaskAttributionUnavailableError extends FocusSessionsError {
  constructor() {
    super(FOCUS_ATTRIBUTION_UNAVAILABLE_MESSAGE);
    this.name = "FocusTaskAttributionUnavailableError";
  }
}

/**
 * Writes task-focused time only at session transition boundaries. The active
 * session remains the immediate source of truth, so a transient network
 * failure never interrupts timing or target switching.
 */
export async function persistFocusTaskTotals(
  session: StoredActiveFocusSession
): Promise<void> {
  if (getPhase3Capability("focusTaskAttribution") === "unavailable") {
    return;
  }

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

/** Fetch persisted per-task focus rows updated today (app timezone). */
export async function fetchTodayFocusedTaskHistory(
  todayKey = getTodayDateString()
): Promise<TodayFocusedTaskRow[]> {
  if (getPhase3Capability("focusTaskAttribution") === "unavailable") {
    throw new FocusTaskAttributionUnavailableError();
  }

  const userId = await requireUserId();
  // Loose lower bound (~2 days) then filter to today's date key in APP_TIMEZONE.
  const since = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("focus_session_task_totals")
    .select("task_id, focused_seconds, updated_at")
    .eq("user_id", userId)
    .gte("updated_at", since)
    .order("updated_at", { ascending: false });

  if (error) throw new FocusSessionsError(error.message);

  return aggregateTodayFocusedTaskRows(data ?? [], todayKey);
}
