import { parseTimestamp } from "@/lib/date-utils";
import { formatTimerClock } from "@/lib/focus-utils";
import type { FocusTargetType, PomodoroPhase, QuickFocusPhase } from "@/types/focus";
import type { NextUpItem } from "@/types/next-up";

export const FOCUS_ACTIVE_SESSION_KEY = "flowos.focus.active";

export type ActiveSessionStatus = "in_progress" | "paused";
export type ActiveTimerType = "quick" | "pomodoro";

export type StoredActiveFocusSession = {
  timer_type: ActiveTimerType;
  session_status: ActiveSessionStatus;
  started_at: string;
  focus_duration: number;
  break_duration: number;
  mode: "focus" | "break";
  phase_started_at: string | null;
  phase_end_at_ms: number | null;
  paused_segment_seconds: number;
  accumulated_focus_seconds: number;
  accumulated_break_seconds: number;
  label: string;
  target_type?: FocusTargetType | null;
  target_id?: string | null;
  /** Stable client id that groups durable per-task totals for one active session. */
  task_focus_session_id?: string;
  /** Finalized task-focused seconds keyed by task id. */
  task_focus_totals?: Record<string, number>;
  /** Current task-focus segment start; null during pause, break, or no task target. */
  task_focus_started_at?: string | null;
  /** Total accumulated focus minutes at which the break reminder should fire. Quick focus only. */
  breakAtMinutes?: number | null;
  /** Break length (minutes) used both as the modal's field and the break-finished threshold. */
  breakLengthMinutes?: number | null;
  /** Focus seconds elapsed when the schedule was last saved — audit / snooze baseline. */
  scheduledAtFocusTime?: number | null;
  /** Legacy V1 session queue data; no longer read by the product UI. */
  nextUpItems?: NextUpItem[] | null;
  /** Legacy V1 scheduled-suggestion snooze map. */
  nextUpDismissedSuggestions?: Record<string, string> | null;
};

export function readActiveSession(): StoredActiveFocusSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(FOCUS_ACTIVE_SESSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as StoredActiveFocusSession;
    if (
      !parsed ||
      (parsed.timer_type !== "quick" && parsed.timer_type !== "pomodoro") ||
      (parsed.session_status !== "in_progress" &&
        parsed.session_status !== "paused") ||
      !parsed.started_at
    ) {
      return null;
    }

    return {
      ...parsed,
    };
  } catch {
    return null;
  }
}

export function writeActiveSession(session: StoredActiveFocusSession): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FOCUS_ACTIVE_SESSION_KEY, JSON.stringify(session));
}

export function clearActiveSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(FOCUS_ACTIVE_SESSION_KEY);
}

export function getSegmentElapsedSeconds(
  session: StoredActiveFocusSession
): number {
  if (session.session_status === "paused") {
    return session.paused_segment_seconds;
  }

  if (!session.phase_started_at) return 0;

  const elapsedMs =
    Date.now() - parseTimestamp(session.phase_started_at).getTime();

  return Math.max(0, Math.floor(elapsedMs / 1000));
}

export function getPomodoroRemainingSeconds(
  session: StoredActiveFocusSession
): number {
  if (session.session_status === "paused") {
    return session.paused_segment_seconds;
  }

  if (session.phase_end_at_ms === null) return 0;

  return Math.max(
    0,
    Math.ceil((session.phase_end_at_ms - Date.now()) / 1000)
  );
}

export function getPomodoroPhaseTotalSeconds(
  session: StoredActiveFocusSession
): number {
  return (
    (session.mode === "focus" ? session.focus_duration : session.break_duration) *
    60
  );
}

export function deriveQuickPhase(
  session: StoredActiveFocusSession
): QuickFocusPhase {
  if (session.mode === "focus") {
    return session.session_status === "paused" ? "focus_paused" : "focus";
  }

  return session.session_status === "paused" ? "break_paused" : "break";
}

export function derivePomodoroPhase(
  session: StoredActiveFocusSession
): PomodoroPhase {
  if (session.session_status === "paused") return "paused";
  return session.mode;
}

export function computeQuickFocusSeconds(
  session: StoredActiveFocusSession
): { focus: number; break: number } {
  const segment = getSegmentElapsedSeconds(session);

  let focus = session.accumulated_focus_seconds;
  let breakSeconds = session.accumulated_break_seconds;

  if (session.mode === "focus") {
    focus += segment;
  } else {
    breakSeconds += segment;
  }

  return { focus, break: breakSeconds };
}

/** Live focus seconds in the unsaved active session (mirrors stop payload). */
export function getActiveSessionFocusSeconds(
  session: StoredActiveFocusSession
): number {
  if (session.timer_type === "quick") {
    return computeQuickFocusSeconds(session).focus;
  }

  const phaseTotal = getPomodoroPhaseTotalSeconds(session);
  const remaining = getPomodoroRemainingSeconds(session);
  const elapsedInPhase = Math.max(0, phaseTotal - remaining);

  let focusSeconds = session.accumulated_focus_seconds;
  if (session.mode === "focus") {
    focusSeconds += elapsedInPhase;
  }
  return focusSeconds;
}

/** Persisted today focus + live active-session focus for display (rail / Today’s focus). */
export function getTodayFocusDisplaySeconds(
  persistedSeconds: number,
  activeSession: StoredActiveFocusSession | null
): number {
  if (!activeSession) return persistedSeconds;
  return persistedSeconds + getActiveSessionFocusSeconds(activeSession);
}

/** Persisted today break + live active-session break for the status rail. */
export function getTodayBreakDisplaySeconds(
  persistedSeconds: number,
  activeSession: StoredActiveFocusSession | null
): number {
  if (!activeSession) return persistedSeconds;
  if (activeSession.timer_type === "quick") {
    return persistedSeconds + computeQuickFocusSeconds(activeSession).break;
  }
  return persistedSeconds + activeSession.accumulated_break_seconds;
}

function createTaskFocusSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getTrackedTaskId(session: StoredActiveFocusSession): string | null {
  return session.target_type === "task" && session.target_id
    ? session.target_id
    : null;
}

function getElapsedSince(iso: string, now = Date.now()): number {
  const elapsed = now - parseTimestamp(iso).getTime();
  return Number.isFinite(elapsed) && elapsed > 0
    ? Math.floor(elapsed / 1000)
    : 0;
}

export function getTaskFocusTotals(
  session: StoredActiveFocusSession,
  now = Date.now()
): Record<string, number> {
  const totals = { ...(session.task_focus_totals ?? {}) };
  const taskId = getTrackedTaskId(session);
  const startedAt = session.task_focus_started_at;

  if (
    taskId &&
    startedAt &&
    session.timer_type === "quick" &&
    session.mode === "focus" &&
    session.session_status === "in_progress"
  ) {
    totals[taskId] = (totals[taskId] ?? 0) + getElapsedSince(startedAt, now);
  }

  return totals;
}

export function getTaskFocusedSeconds(
  session: StoredActiveFocusSession,
  taskId: string,
  now = Date.now()
): number {
  return getTaskFocusTotals(session, now)[taskId] ?? 0;
}

/** Freeze the active task segment so a pause, break, switch, or stop cannot misattribute it. */
export function finalizeCurrentTaskFocus(
  session: StoredActiveFocusSession,
  now = Date.now()
): StoredActiveFocusSession {
  return {
    ...session,
    task_focus_session_id:
      session.task_focus_session_id ?? createTaskFocusSessionId(),
    task_focus_totals: getTaskFocusTotals(session, now),
    task_focus_started_at: null,
  };
}

function beginCurrentTaskFocus(
  session: StoredActiveFocusSession,
  now = new Date().toISOString()
): StoredActiveFocusSession {
  return {
    ...session,
    task_focus_session_id:
      session.task_focus_session_id ?? createTaskFocusSessionId(),
    task_focus_totals: session.task_focus_totals ?? {},
    task_focus_started_at:
      session.timer_type === "quick" &&
      session.mode === "focus" &&
      session.session_status === "in_progress" &&
      getTrackedTaskId(session)
        ? now
        : null,
  };
}

export function setQuickFocusTarget(
  session: StoredActiveFocusSession,
  target: { type: FocusTargetType; id: string; label?: string } | null
): StoredActiveFocusSession {
  const finalized = finalizeCurrentTaskFocus(session);
  const next: StoredActiveFocusSession = {
    ...finalized,
    target_type: target?.type ?? null,
    target_id: target?.id ?? null,
    label: target?.label ?? finalized.label,
  };

  return beginCurrentTaskFocus(next);
}

export function createQuickFocusSession(options?: {
  target_type?: FocusTargetType | null;
  target_id?: string | null;
  label?: string;
}): StoredActiveFocusSession {
  const now = new Date().toISOString();

  return {
    timer_type: "quick",
    session_status: "in_progress",
    started_at: now,
    focus_duration: 0,
    break_duration: 0,
    mode: "focus",
    phase_started_at: now,
    phase_end_at_ms: null,
    paused_segment_seconds: 0,
    accumulated_focus_seconds: 0,
    accumulated_break_seconds: 0,
    label: options?.label ?? "Quick Focus",
    target_type: options?.target_type ?? null,
    target_id: options?.target_id ?? null,
    task_focus_session_id: createTaskFocusSessionId(),
    task_focus_totals: {},
    task_focus_started_at:
      options?.target_type === "task" && options.target_id ? now : null,
  };
}

export function createPomodoroSession(
  focusMinutes: number,
  breakMinutes: number
): StoredActiveFocusSession {
  const now = new Date().toISOString();
  const focusSecs = focusMinutes * 60;

  return {
    timer_type: "pomodoro",
    session_status: "in_progress",
    started_at: now,
    focus_duration: focusMinutes,
    break_duration: breakMinutes,
    mode: "focus",
    phase_started_at: now,
    phase_end_at_ms: Date.now() + focusSecs * 1000,
    paused_segment_seconds: 0,
    accumulated_focus_seconds: 0,
    accumulated_break_seconds: 0,
    label: "Pomodoro",
  };
}

export function pauseSession(
  session: StoredActiveFocusSession
): StoredActiveFocusSession {
  if (session.timer_type === "pomodoro") {
    return {
      ...session,
      session_status: "paused",
      paused_segment_seconds: getPomodoroRemainingSeconds(session),
      phase_end_at_ms: null,
      phase_started_at: null,
    };
  }

  const finalized = finalizeCurrentTaskFocus(session);
  return {
    ...finalized,
    session_status: "paused",
    paused_segment_seconds: getSegmentElapsedSeconds(session),
    phase_started_at: null,
  };
}

export function resumeSession(
  session: StoredActiveFocusSession
): StoredActiveFocusSession {
  if (session.timer_type === "pomodoro") {
    const remaining = session.paused_segment_seconds;
    return {
      ...session,
      session_status: "in_progress",
      phase_end_at_ms: Date.now() + remaining * 1000,
      phase_started_at: new Date().toISOString(),
      paused_segment_seconds: 0,
    };
  }

  const elapsed = session.paused_segment_seconds;
  const next: StoredActiveFocusSession = {
    ...session,
    session_status: "in_progress",
    phase_started_at: new Date(Date.now() - elapsed * 1000).toISOString(),
    paused_segment_seconds: 0,
  };
  return beginCurrentTaskFocus(next);
}

export function quickStartBreak(
  session: StoredActiveFocusSession
): StoredActiveFocusSession {
  const focusSegment = getSegmentElapsedSeconds(session);
  const now = new Date().toISOString();
  const finalized = finalizeCurrentTaskFocus(session);

  return {
    ...finalized,
    mode: "break",
    session_status: "in_progress",
    accumulated_focus_seconds:
      session.accumulated_focus_seconds + focusSegment,
    phase_started_at: now,
    paused_segment_seconds: 0,
  };
}

export function quickResumeFocus(
  session: StoredActiveFocusSession
): StoredActiveFocusSession {
  const breakSegment = getSegmentElapsedSeconds(session);
  const now = new Date().toISOString();

  const next: StoredActiveFocusSession = {
    ...session,
    mode: "focus",
    session_status: "in_progress",
    accumulated_break_seconds:
      session.accumulated_break_seconds + breakSegment,
    phase_started_at: now,
    paused_segment_seconds: 0,
  };
  return beginCurrentTaskFocus(next, now);
}

export function pomodoroCompleteFocusPhase(
  session: StoredActiveFocusSession
): StoredActiveFocusSession {
  const breakSecs = session.break_duration * 60;
  const now = new Date().toISOString();

  return {
    ...session,
    mode: "break",
    session_status: "in_progress",
    accumulated_focus_seconds: session.focus_duration * 60,
    phase_started_at: now,
    phase_end_at_ms: Date.now() + breakSecs * 1000,
    paused_segment_seconds: 0,
  };
}

export function buildStopPayload(session: StoredActiveFocusSession): {
  focus_seconds: number;
  break_seconds: number;
  started_at: string;
  session_status: "stopped";
  focus_duration?: number;
  break_duration?: number;
  target_type?: FocusTargetType | null;
  target_id?: string | null;
} {
  if (session.timer_type === "quick") {
    const { focus, break: breakSeconds } = computeQuickFocusSeconds(session);
    return {
      focus_seconds: focus,
      break_seconds: breakSeconds,
      started_at: session.started_at,
      session_status: "stopped",
      target_type: session.target_type ?? null,
      target_id: session.target_id ?? null,
    };
  }

  const phaseTotal = getPomodoroPhaseTotalSeconds(session);
  const remaining = getPomodoroRemainingSeconds(session);
  const elapsedInPhase = Math.max(0, phaseTotal - remaining);

  let focusSeconds = session.accumulated_focus_seconds;
  let breakSeconds = session.accumulated_break_seconds;

  if (session.mode === "focus") {
    focusSeconds += elapsedInPhase;
  } else {
    breakSeconds += elapsedInPhase;
  }

  return {
    focus_seconds: focusSeconds,
    break_seconds: breakSeconds,
    focus_duration: session.focus_duration,
    break_duration: session.break_duration,
    started_at: session.started_at,
    session_status: "stopped",
    target_type: session.target_type ?? null,
    target_id: session.target_id ?? null,
  };
}

export function buildCompletedPayload(session: StoredActiveFocusSession): {
  focus_seconds: number;
  break_seconds: number;
  focus_duration: number;
  break_duration: number;
  started_at: string;
  session_status: "completed";
  target_type?: FocusTargetType | null;
  target_id?: string | null;
} {
  return {
    focus_seconds: session.focus_duration * 60,
    break_seconds: session.break_duration * 60,
    focus_duration: session.focus_duration,
    break_duration: session.break_duration,
    started_at: session.started_at,
    session_status: "completed",
    target_type: session.target_type ?? null,
    target_id: session.target_id ?? null,
  };
}

/**
 * Continuous focused (execution) seconds — never resets within one session.
 * Pause freezes this; break does not (break has its own segment clock).
 */
export function getQuickExecutionSeconds(
  session: StoredActiveFocusSession
): number {
  return computeQuickFocusSeconds(session).focus;
}

/**
 * Hero clock seconds: continuous focus while focusing; break segment while on break
 * (same break display as before). Resume Focus continues from accumulated focus.
 */
export function getQuickClockSeconds(
  session: StoredActiveFocusSession
): number {
  if (session.mode === "break") {
    return getSegmentElapsedSeconds(session);
  }
  return getQuickExecutionSeconds(session);
}

export function formatQuickClock(session: StoredActiveFocusSession): string {
  return formatTimerClock(getQuickClockSeconds(session));
}

export function formatPomodoroClock(session: StoredActiveFocusSession): string {
  return formatTimerClock(getPomodoroRemainingSeconds(session));
}

export function getDashboardRemainingSeconds(
  session: StoredActiveFocusSession
): number {
  if (session.timer_type === "pomodoro") {
    return getPomodoroRemainingSeconds(session);
  }

  return getQuickClockSeconds(session);
}

export function getActiveSessionStatusLabel(
  session: StoredActiveFocusSession
): string {
  if (session.session_status === "paused") {
    return session.mode === "focus" ? "Focus paused" : "Break paused";
  }

  return session.mode === "focus" ? "In Focus" : "On break";
}
