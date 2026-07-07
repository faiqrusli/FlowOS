import { computeQuickFocusSeconds, type StoredActiveFocusSession } from "@/lib/focus-active-session";

/**
 * Schedule Break — pure helpers only. No React, no side effects.
 * See docs/review/design/schedule-break-modal-spec.md for the product spec
 * and docs/execution/runbooks/m2-schedule-break.md for the implementation plan.
 */

const BASE_BREAK_MILESTONES_MINUTES = [25, 45, 60, 90, 120] as const;
const EXTENDED_MILESTONE_STEP_MINUTES = 30;

export const BREAK_AT_STEP_MINUTES = 5;
export const BREAK_LENGTH_STEP_MINUTES = 5;
export const MIN_BREAK_LENGTH_MINUTES = 5;
export const DEFAULT_BREAK_LENGTH_MINUTES = 10;
export const BREAK_SNOOZE_MINUTES = 5;

/** Next milestone strictly greater than currentFocusMinutes; extends by +30min past the table. */
export function getDefaultBreakAtMinutes(currentFocusMinutes: number): number {
  const safeCurrent = Math.max(0, currentFocusMinutes);
  const milestone = BASE_BREAK_MILESTONES_MINUTES.find((m) => m > safeCurrent);
  if (milestone !== undefined) return milestone;

  let candidate = BASE_BREAK_MILESTONES_MINUTES[BASE_BREAK_MILESTONES_MINUTES.length - 1];
  while (candidate <= safeCurrent) {
    candidate += EXTENDED_MILESTONE_STEP_MINUTES;
  }
  return candidate;
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
  const { break: breakSeconds } = computeQuickFocusSeconds(session);
  return breakSeconds >= session.breakLengthMinutes * 60;
}

export function hasScheduledBreak(session: StoredActiveFocusSession): boolean {
  return Boolean(session.breakAtMinutes && session.breakLengthMinutes);
}

/** Save (or replace) the session's single scheduled break. */
export function setScheduledBreak(
  session: StoredActiveFocusSession,
  breakAtMinutes: number,
  breakLengthMinutes: number
): StoredActiveFocusSession {
  const { focus } = computeQuickFocusSeconds(session);
  return {
    ...session,
    breakAtMinutes,
    breakLengthMinutes,
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
  return { ...session, breakAtMinutes: session.breakAtMinutes + minutes };
}

/** Push the "break finished" reminder further out — user-initiated, never automatic. */
export function snoozeBreakFinished(
  session: StoredActiveFocusSession,
  minutes: number = BREAK_SNOOZE_MINUTES
): StoredActiveFocusSession {
  if (!session.breakLengthMinutes) return session;
  return { ...session, breakLengthMinutes: session.breakLengthMinutes + minutes };
}

/** "Break in 41 min 40 sec" / "Break ready" — matches spec wording exactly. */
export function formatBreakCountdownLabel(remainingSeconds: number): string {
  if (remainingSeconds <= 0) return "Break ready";
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  return `Break in ${minutes} min ${seconds} sec`;
}
