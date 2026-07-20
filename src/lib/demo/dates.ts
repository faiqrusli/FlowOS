import {
  getNowMinutesInAppTimezone,
  getTodayDateString,
  shiftDateKey,
} from "@/lib/date-utils";

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Minutes from midnight → `HH:mm:ss` wall-clock string. */
export function minutesToTimeString(totalMinutes: number): string {
  const clamped = Math.max(0, Math.min(23 * 60 + 59, Math.floor(totalMinutes)));
  const hours = Math.floor(clamped / 60);
  const minutes = clamped % 60;
  return `${pad2(hours)}:${pad2(minutes)}:00`;
}

/** App-timezone local wall clock as ISO with +08:00 (matches date-utils naive schedule convention). */
export function dateKeyAtMinutesIso(dateKey: string, totalMinutes: number): string {
  const clamped = Math.max(0, Math.min(23 * 60 + 59, Math.floor(totalMinutes)));
  const hours = Math.floor(clamped / 60);
  const minutes = clamped % 60;
  return `${dateKey}T${pad2(hours)}:${pad2(minutes)}:00+08:00`;
}

export type DemoDateBand = {
  anchorDate: string;
  /** D+0 … relative keys */
  d: (offset: number) => string;
  /** Wall-clock minutes now (clone time T0). */
  t0Minutes: number;
  /** Clamp T0+offsetMinutes into the same calendar day. */
  fireTime: (offsetMinutes: number) => string;
};

export function createDemoDateBand(
  now: Date = new Date(),
): DemoDateBand {
  const anchorDate = getTodayDateString();
  const t0Minutes = getNowMinutesInAppTimezone(now);

  return {
    anchorDate,
    d: (offset) => shiftDateKey(anchorDate, offset),
    t0Minutes,
    fireTime: (offsetMinutes) => {
      const target = t0Minutes + offsetMinutes;
      if (target < 0) return minutesToTimeString(Math.max(0, t0Minutes + 2));
      if (target >= 24 * 60) {
        return minutesToTimeString(Math.min(23 * 60 + 50, t0Minutes + 2));
      }
      return minutesToTimeString(target);
    },
  };
}
