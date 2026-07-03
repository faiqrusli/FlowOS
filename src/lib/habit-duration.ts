import { formatTimeShort, parseTimeToMinutes } from "@/lib/date-utils";

export const HABIT_DURATION_MIN = 15;
export const HABIT_DURATION_MAX = 240;

export function clampHabitDuration(minutes: number): number {
  return Math.max(HABIT_DURATION_MIN, Math.min(HABIT_DURATION_MAX, minutes));
}

function minutesToTimeString(totalMinutes: number): string {
  const normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function getHabitTimeRange(
  scheduledTime: string | null,
  durationMinutes: number
): { start: string; end: string } | null {
  const startMinutes = parseTimeToMinutes(scheduledTime);
  if (!Number.isFinite(startMinutes) || startMinutes === Number.MAX_SAFE_INTEGER) {
    return null;
  }
  const endMinutes = startMinutes + clampHabitDuration(durationMinutes);
  const start = formatTimeShort(minutesToTimeString(startMinutes));
  const end = formatTimeShort(minutesToTimeString(endMinutes));
  if (!start || !end) return null;
  return { start, end };
}

export function formatHabitTimeRangeWithDuration(
  scheduledTime: string | null,
  durationMinutes: number
): string | null {
  const range = getHabitTimeRange(scheduledTime, durationMinutes);
  if (!range) return null;
  return `${range.start} - ${range.end} · ${clampHabitDuration(durationMinutes)}m`;
}

