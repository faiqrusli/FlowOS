import {
  computeQuickFocusSeconds,
  getSegmentElapsedSeconds,
  type StoredActiveFocusSession,
} from "@/lib/focus-active-session";

/**
 * Schedule Break — pure helpers only. No React, no side effects.
 * See docs/review/design/schedule-break-modal-spec.md for the product spec
 * and docs/execution/runbooks/m2-schedule-break.md for the implementation plan.
 */

export const BREAK_AT_PRESET_MINUTES = [25, 45, 60, 90, 120] as const;
export const BREAK_LENGTH_PRESET_MINUTES = [5, 10, 15, 20, 30] as const;
export const BREAK_AT_EXTEND_STEP_MINUTES = 30;
export const BREAK_AT_VISIBLE_ROWS = 6;

export const BREAK_AT_STEP_MINUTES = 5;
export const BREAK_LENGTH_STEP_MINUTES = 5;
export const MIN_BREAK_LENGTH_MINUTES = 5;
export const MAX_BREAK_LENGTH_MINUTES = 180;
export const DEFAULT_BREAK_LENGTH_MINUTES = 10;
export const BREAK_SNOOZE_MINUTES = 5;

export type BreakAtMenuOption =
  | { kind: "preset"; minutes: number }
  | { kind: "extend"; minutes: number; label: "+30" };

/** Presets strictly above current focus, plus a trailing +30 extend row. */
export function getBreakAtMenuOptions(currentFocusMinutes: number): BreakAtMenuOption[] {
  const safeCurrent = Math.max(0, currentFocusMinutes);
  const options: BreakAtMenuOption[] = BREAK_AT_PRESET_MINUTES.filter(
    (minutes) => minutes > safeCurrent
  ).map((minutes) => ({ kind: "preset", minutes }));

  if (options.length > 0) {
    const extendMinutes =
      options[options.length - 1]!.minutes + BREAK_AT_EXTEND_STEP_MINUTES;
    if (extendMinutes > safeCurrent) {
      options.push({ kind: "extend", minutes: extendMinutes, label: "+30" });
    }
    return options;
  }

  const lastPreset = BREAK_AT_PRESET_MINUTES[BREAK_AT_PRESET_MINUTES.length - 1]!;
  let extendMinutes = lastPreset + BREAK_AT_EXTEND_STEP_MINUTES;
  while (extendMinutes <= safeCurrent) {
    extendMinutes += BREAK_AT_EXTEND_STEP_MINUTES;
  }
  options.push({ kind: "extend", minutes: extendMinutes, label: "+30" });
  return options;
}

/** Next preset strictly greater than current focus; falls back to +30 extend. */
export function getDefaultBreakAtMinutes(currentFocusMinutes: number): number {
  const options = getBreakAtMenuOptions(currentFocusMinutes);
  return options[0]?.minutes ?? getMinBreakAtMinutes(currentFocusMinutes);
}

/** Lowest valid "Break at" value for the stepper: next 5-min step above current focus. */
export function getMinBreakAtMinutes(currentFocusMinutes: number): number {
  const safeCurrent = Math.max(0, currentFocusMinutes);
  const floor = safeCurrent + BREAK_AT_STEP_MINUTES;
  return Math.ceil(floor / BREAK_AT_STEP_MINUTES) * BREAK_AT_STEP_MINUTES;
}

export function getRemainingToBreakSeconds(session: StoredActiveFocusSession): number {
  if (!session.breakAtMinutes) return 0;
  const { focus } = computeQuickFocusSeconds(session);
  return Math.max(0, session.breakAtMinutes * 60 - focus);
}

/** True once accumulated focus reaches the scheduled threshold. */
export function isBreakReady(session: StoredActiveFocusSession): boolean {
  if (!session.breakAtMinutes) return false;
  const { focus } = computeQuickFocusSeconds(session);
  return focus >= session.breakAtMinutes * 60;
}

/** True once elapsed break time reaches the scheduled break length. Only meaningful on break. */
export function isBreakFinished(session: StoredActiveFocusSession): boolean {
  if (!session.breakLengthMinutes) return false;
  if (session.mode !== "break") return false;
  const segmentSeconds = getSegmentElapsedSeconds(session);
  return segmentSeconds >= session.breakLengthMinutes * 60;
}

export function hasScheduledBreak(session: StoredActiveFocusSession): boolean {
  return session.breakAtMinutes != null;
}

export function clampBreakLengthMinutes(minutes: number): number {
  return Math.min(
    MAX_BREAK_LENGTH_MINUTES,
    Math.max(MIN_BREAK_LENGTH_MINUTES, minutes)
  );
}

/** Save (or replace) the session's single scheduled break. */
export function setScheduledBreak(
  session: StoredActiveFocusSession,
  breakAtMinutes: number,
  breakLengthMinutes: number | null
): StoredActiveFocusSession {
  const { focus } = computeQuickFocusSeconds(session);
  const length =
    breakLengthMinutes == null ? null : clampBreakLengthMinutes(breakLengthMinutes);
  return {
    ...session,
    breakAtMinutes,
    breakLengthMinutes: length,
    scheduledAtFocusTime: focus,
  };
}

export function clearScheduledBreak(
  session: StoredActiveFocusSession
): StoredActiveFocusSession {
  return {
    ...session,
    breakAtMinutes: null,
    breakLengthMinutes: null,
    scheduledAtFocusTime: null,
  };
}

/** Push the "time for a break" reminder further out — user-initiated, never automatic. */
export function snoozeBreak(
  session: StoredActiveFocusSession,
  minutes: number = BREAK_SNOOZE_MINUTES
): StoredActiveFocusSession {
  if (!session.breakAtMinutes) return session;
  const { focus } = computeQuickFocusSeconds(session);
  const floor = getMinBreakAtMinutes(Math.floor(focus / 60));
  const next = session.breakAtMinutes + minutes;
  return { ...session, breakAtMinutes: Math.max(floor, next) };
}

/** Restart break-finished countdown from now (wall-clock snooze). */
export function snoozeBreakFinished(
  session: StoredActiveFocusSession,
  minutes: number = BREAK_SNOOZE_MINUTES
): StoredActiveFocusSession {
  if (!session.breakLengthMinutes) return session;
  if (session.mode !== "break") {
    return {
      ...session,
      breakLengthMinutes: clampBreakLengthMinutes(session.breakLengthMinutes + minutes),
    };
  }

  const breakSegment = getSegmentElapsedSeconds(session);
  const now = new Date().toISOString();
  return {
    ...session,
    breakLengthMinutes: clampBreakLengthMinutes(minutes),
    accumulated_break_seconds: session.accumulated_break_seconds + breakSegment,
    phase_started_at: now,
    session_status: "in_progress",
    paused_segment_seconds: 0,
  };
}

/** "Break in 41 min 40 sec" / "Break ready" — matches spec wording exactly. */
export function formatBreakCountdownLabel(remainingSeconds: number): string {
  if (remainingSeconds <= 0) return "Break ready";
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  return `Break in ${minutes} min ${seconds} sec`;
}

/** Compact strip variant — minutes only (no seconds). */
export function formatCompactBreakCountdownLabel(remainingSeconds: number): string {
  if (remainingSeconds <= 0) return "Break ready";
  const minutes = Math.max(1, Math.ceil(remainingSeconds / 60));
  return `Break in ${minutes} min`;
}

/** Focus-threshold label: "25 min", "1h", "1h 30m", "3h". */
export function formatBreakAtMinutes(minutes: number): string {
  const safe = Math.max(0, Math.round(minutes));
  if (safe < 60) return `${safe} min`;
  const hours = Math.floor(safe / 60);
  const rest = safe % 60;
  if (rest === 0) return `${hours}h`;
  return `${hours}h ${rest}m`;
}

export function formatBreakLengthMinutes(minutes: number | null): string {
  if (minutes == null) return "Not set";
  return formatBreakAtMinutes(minutes);
}
