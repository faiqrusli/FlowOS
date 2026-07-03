import {
  APP_LOCALE,
  APP_TIMEZONE,
  getDateKeyInTimezone,
  getTodayDateString,
  parseTimestamp,
} from "@/lib/date-utils";
import type { FocusSession } from "@/types/focus";

export function formatDuration(seconds: number): string {
  const safeSeconds = Math.max(0, Math.round(seconds));
  const h = Math.floor(safeSeconds / 3600);
  const m = Math.floor((safeSeconds % 3600) / 60);
  const s = safeSeconds % 60;

  if (h > 0) {
    return `${h}h ${m}m ${s}s`;
  }

  if (m > 0) {
    return `${m}m ${s}s`;
  }

  return `${s}s`;
}

export function formatTimerClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function formatSessionTime(iso: string): string {
  return new Intl.DateTimeFormat(APP_LOCALE, {
    timeZone: APP_TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(parseTimestamp(iso));
}

export function formatSessionDate(iso: string): string {
  return new Intl.DateTimeFormat(APP_LOCALE, {
    timeZone: APP_TIMEZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parseTimestamp(iso));
}

function getSessionElapsedSeconds(session: FocusSession): number | null {
  if (!session.ended_at) return null;

  const elapsedMs =
    parseTimestamp(session.ended_at).getTime() -
    parseTimestamp(session.started_at).getTime();

  if (!Number.isFinite(elapsedMs) || elapsedMs < 0) return null;

  return Math.round(elapsedMs / 1000);
}

/** Older rows store minutes; new quick-focus rows store seconds. */
function sessionUsesMinuteStorage(session: FocusSession): boolean {
  const elapsed = getSessionElapsedSeconds(session);

  // Rows saved by quick focus / workplace timer store seconds in focus_duration.
  if (session.target_type !== null && session.target_type !== undefined) {
    return false;
  }

  const minuteTotal =
    (session.focus_duration + session.break_duration) * 60;
  const secondTotal = session.focus_duration + session.break_duration;

  if (elapsed !== null) {
    if (minuteTotal > 0 && Math.abs(minuteTotal - elapsed) <= 120) {
      return true;
    }

    if (secondTotal > 0 && Math.abs(secondTotal - elapsed) <= 5) {
      return false;
    }
  }

  // Minute-based pomodoro sessions stay small (typically <= 120).
  if (session.focus_duration <= 180 && session.break_duration <= 60) {
    return true;
  }

  return false;
}

export function getSessionFocusSeconds(session: FocusSession): number {
  const raw = sessionUsesMinuteStorage(session)
    ? session.focus_duration * 60
    : session.focus_duration;

  const elapsed = getSessionElapsedSeconds(session);
  if (elapsed === null) return raw;

  return Math.min(raw, elapsed);
}

export function getSessionBreakSeconds(session: FocusSession): number {
  const raw = sessionUsesMinuteStorage(session)
    ? session.break_duration * 60
    : session.break_duration;

  const elapsed = getSessionElapsedSeconds(session);
  if (elapsed === null) return raw;

  const focusSeconds = getSessionFocusSeconds(session);
  return Math.min(raw, Math.max(0, elapsed - focusSeconds));
}

export function getSessionTotalSeconds(session: FocusSession): number {
  return getSessionFocusSeconds(session) + getSessionBreakSeconds(session);
}

export function isToday(iso: string): boolean {
  const dateKey = getDateKeyInTimezone(iso);
  return dateKey === getTodayDateString();
}

export function playAlertSound() {
  try {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.frequency.value = 880;
    oscillator.type = "sine";
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  } catch {
    // Audio not available
  }
}

export async function showBrowserNotification(title: string, body: string) {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }

  if (Notification.permission === "granted") {
    new Notification(title, { body });
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      new Notification(title, { body });
      return true;
    }
  }

  return false;
}
