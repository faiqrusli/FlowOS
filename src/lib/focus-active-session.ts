import { parseTimestamp } from "@/lib/date-utils";
import { formatTimerClock } from "@/lib/focus-utils";
import type { FocusTargetType, PomodoroPhase, QuickFocusPhase } from "@/types/focus";

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
  /** Total accumulated focus minutes at which the break reminder should fire. Quick focus only. */
  breakAtMinutes?: number | null;
  /** Break length (minutes) used both as the modal's field and the break-finished threshold. */
  breakLengthMinutes?: number | null;
  /** Focus seconds elapsed when the schedule was last saved — audit / snooze baseline. */
  scheduledAtFocusTime?: number | null;
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

    return parsed;
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

  return {
    ...session,
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
  return {
    ...session,
    session_status: "in_progress",
    phase_started_at: new Date(Date.now() - elapsed * 1000).toISOString(),
    paused_segment_seconds: 0,
  };
}

export function quickStartBreak(
  session: StoredActiveFocusSession
): StoredActiveFocusSession {
  const focusSegment = getSegmentElapsedSeconds(session);
  const now = new Date().toISOString();

  return {
    ...session,
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

  return {
    ...session,
    mode: "focus",
    session_status: "in_progress",
    accumulated_break_seconds:
      session.accumulated_break_seconds + breakSegment,
    phase_started_at: now,
    paused_segment_seconds: 0,
  };
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

export function formatQuickClock(session: StoredActiveFocusSession): string {
  return formatTimerClock(getSegmentElapsedSeconds(session));
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

  const segment = getSegmentElapsedSeconds(session);
  if (session.mode === "break") {
    return segment;
  }

  return segment;
}

export function getActiveSessionStatusLabel(
  session: StoredActiveFocusSession
): string {
  if (session.session_status === "paused") {
    return session.mode === "focus" ? "Focus paused" : "Break paused";
  }

  return session.mode === "focus" ? "Focusing" : "On break";
}
