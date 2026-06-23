export const APP_TIMEZONE = "Asia/Singapore";
export const APP_LOCALE = "en-SG";

export const DAYS_OF_WEEK = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

const dateKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: APP_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: APP_TIMEZONE,
  weekday: "short",
});

const weekdayLongFormatter = new Intl.DateTimeFormat(APP_LOCALE, {
  timeZone: APP_TIMEZONE,
  weekday: "long",
});

const todayHeadingFormatter = new Intl.DateTimeFormat(APP_LOCALE, {
  timeZone: APP_TIMEZONE,
  weekday: "long",
  day: "numeric",
  month: "long",
});

const WEEKDAY_TO_ABBREV: Record<string, string> = {
  Sun: "Sun",
  Mon: "Mon",
  Tue: "Tue",
  Wed: "Wed",
  Thu: "Thu",
  Fri: "Fri",
  Sat: "Sat",
};

export function parseTimestamp(value: string): Date {
  if (!value) return new Date(Number.NaN);

  const trimmed = value.trim();

  if (/[+-]\d{2}:\d{2}$/.test(trimmed) || trimmed.endsWith("Z")) {
    return new Date(trimmed);
  }

  if (trimmed.includes("T")) {
    // Live session saves include fractional seconds and are stored as UTC.
    if (/\.\d+/.test(trimmed)) {
      return new Date(`${trimmed}Z`);
    }

    // Naive timestamps (e.g. seeded schedule rows) are Singapore local time.
    return new Date(`${trimmed}+08:00`);
  }

  // "YYYY-MM-DD HH:mm:ss" — UTC from Postgres exports.
  return new Date(`${trimmed.replace(" ", "T")}Z`);
}

export function getDateKeyInTimezone(
  isoOrDate: string | Date,
  timeZone: string = APP_TIMEZONE
): string {
  const date =
    typeof isoOrDate === "string" ? parseTimestamp(isoOrDate) : isoOrDate;

  if (timeZone === APP_TIMEZONE) {
    return dateKeyFormatter.format(date);
  }

  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getTodayDateString(timeZone: string = APP_TIMEZONE): string {
  return getDateKeyInTimezone(new Date(), timeZone);
}

export function getYesterdayDateString(timeZone: string = APP_TIMEZONE): string {
  const todayKey = getTodayDateString(timeZone);
  const [year, month, day] = todayKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() - 1);

  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getTodayDayAbbrev(timeZone: string = APP_TIMEZONE): string {
  const weekday = weekdayFormatter.format(new Date());
  return WEEKDAY_TO_ABBREV[weekday] ?? weekday;
}

export function formatTodayHeading(timeZone: string = APP_TIMEZONE): string {
  return todayHeadingFormatter.format(new Date());
}

export function formatWeekdayLabel(
  dateKey: string,
  timeZone: string = APP_TIMEZONE
): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12));
  return weekdayLongFormatter.format(date);
}

export function isSameDay(
  isoOrDate: string,
  dateKey: string,
  timeZone: string = APP_TIMEZONE
): boolean {
  return getDateKeyInTimezone(isoOrDate, timeZone) === dateKey;
}

export function compareHistoryDateKeys(
  a: string,
  b: string,
  todayKey: string,
  yesterdayKey: string
): number {
  const rank = (dateKey: string) => {
    if (dateKey === todayKey) return 0;
    if (dateKey === yesterdayKey) return 1;
    return 2;
  };

  const rankDiff = rank(a) - rank(b);
  if (rankDiff !== 0) return rankDiff;

  return b.localeCompare(a);
}

export function parseTimeToMinutes(time: string | null): number {
  if (!time) return Number.MAX_SAFE_INTEGER;
  const [hours, minutes] = time.split(":");
  return Number(hours) * 60 + Number(minutes);
}

export function formatTimeShort(time: string | null): string | null {
  if (!time) return null;

  const [hours, minutes] = time.split(":");
  const date = new Date(
    `1970-01-01T${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00+08:00`
  );

  return new Intl.DateTimeFormat(APP_LOCALE, {
    timeZone: APP_TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatInAppTimezone(
  isoOrDate: string | Date,
  options: Intl.DateTimeFormatOptions
): string {
  const date =
    typeof isoOrDate === "string" ? parseTimestamp(isoOrDate) : isoOrDate;

  return new Intl.DateTimeFormat(APP_LOCALE, {
    timeZone: APP_TIMEZONE,
    ...options,
  }).format(date);
}

export function getNowMinutesInAppTimezone(date = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: APP_TIMEZONE,
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(date);

  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(
    parts.find((part) => part.type === "minute")?.value ?? 0
  );

  return hour * 60 + minute;
}

export function formatNowTimeInAppTimezone(date = new Date()): string {
  return formatInAppTimezone(date, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getMinutesFromTimestamp(isoOrDate: string | Date): number {
  const date =
    typeof isoOrDate === "string" ? parseTimestamp(isoOrDate) : isoOrDate;

  return getNowMinutesInAppTimezone(date);
}
