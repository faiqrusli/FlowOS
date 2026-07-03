import { parseWallClockTime } from "@/lib/date-utils";

export type TimePickerParts = {
  hour12: number;
  minute: number;
  period: "AM" | "PM";
};

export const TIME_PICKER_HOURS = Array.from({ length: 12 }, (_, index) => index + 1);
export const TIME_PICKER_MINUTES = Array.from({ length: 60 }, (_, index) => index);
export const TIME_PICKER_PERIODS = ["AM", "PM"] as const;

export function parseTimePickerParts(
  time: string | null | undefined,
  fallback: TimePickerParts = { hour12: 9, minute: 0, period: "AM" }
): TimePickerParts {
  const parsed = parseWallClockTime(time);
  if (!parsed) return fallback;

  const period: "AM" | "PM" = parsed.hours >= 12 ? "PM" : "AM";
  let hour12 = parsed.hours % 12;
  if (hour12 === 0) hour12 = 12;

  return {
    hour12,
    minute: parsed.minutes,
    period,
  };
}

export function timePickerPartsToScheduledTime(parts: TimePickerParts): string {
  let hours = parts.hour12 % 12;
  if (parts.period === "PM") {
    hours += 12;
  }
  if (parts.period === "AM" && parts.hour12 === 12) {
    hours = 0;
  }
  if (parts.period === "PM" && parts.hour12 === 12) {
    hours = 12;
  }

  return `${String(hours).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}:00`;
}

export function timePickerPartsToInputValue(parts: TimePickerParts): string {
  const scheduled = timePickerPartsToScheduledTime(parts);
  return scheduled.slice(0, 5);
}

export function formatTimePickerParts(parts: TimePickerParts): string {
  const minute = String(parts.minute).padStart(2, "0");
  return `${parts.hour12}:${minute} ${parts.period.toLowerCase()}`;
}

export function formatTimePickerDisplayLabel(parts: TimePickerParts): string {
  const minute = String(parts.minute).padStart(2, "0");
  const period = parts.period === "AM" ? "a.m." : "p.m.";
  return `${parts.hour12}:${minute} ${period}`;
}

export function clampHour12(hour: number): number {
  if (!Number.isFinite(hour) || hour < 1) return 1;
  if (hour > 12) return 12;
  return hour;
}

export function clampMinute(minute: number): number {
  if (!Number.isFinite(minute) || minute < 0) return 0;
  if (minute > 59) return 59;
  return minute;
}

export function toggleTimePickerPeriod(period: "AM" | "PM"): "AM" | "PM" {
  return period === "AM" ? "PM" : "AM";
}

export function shiftHour12(hour12: number, delta: number): number {
  let next = hour12 + delta;
  if (next > 12) next = 1;
  if (next < 1) next = 12;
  return next;
}

export function shiftMinute(minute: number, delta: number): number {
  let next = minute + delta;
  if (next > 59) next = 0;
  if (next < 0) next = 59;
  return next;
}

/** Parse 1–4 typed digits as hour then minute (e.g. 930 → 9:30). */
export function parseSequentialTimeDigits(
  digits: string,
  base: TimePickerParts
): TimePickerParts | null {
  const clean = digits.replace(/\D/g, "").slice(0, 4);
  if (!clean) return null;

  if (clean.length === 1) {
    const hour = clampHour12(Number(clean));
    return { ...base, hour12: hour };
  }

  if (clean.length === 2) {
    const hour = clampHour12(Number(clean));
    return { ...base, hour12: hour, minute: 0 };
  }

  if (clean.length === 3) {
    const hour = clampHour12(Number(clean.slice(0, 1)));
    const minute = clampMinute(Number(clean.slice(1)));
    return { ...base, hour12: hour, minute };
  }

  const hour = clampHour12(Number(clean.slice(0, 2)));
  const minute = clampMinute(Number(clean.slice(2)));
  return { ...base, hour12: hour, minute };
}
