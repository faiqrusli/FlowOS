import { getTodayDateString } from "@/lib/date-utils";

export type CalendarDayCell = {
  dateKey: string;
  day: number;
  inMonth: boolean;
};

export function parseDateKey(dateKey: string): {
  year: number;
  month: number;
  day: number;
} {
  const [year, month, day] = dateKey.split("-").map(Number);
  return { year, month, day };
}

export function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function getMonthLabel(year: number, month: number): string {
  const date = new Date(Date.UTC(year, month - 1, 1, 12));
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function shiftMonth(
  year: number,
  month: number,
  delta: number
): { year: number; month: number } {
  const date = new Date(Date.UTC(year, month - 1 + delta, 1, 12));
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
  };
}

export function getCalendarMonthGrid(
  year: number,
  month: number,
  todayKey = getTodayDateString()
): CalendarDayCell[] {
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1, 12)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0, 12)).getUTCDate();
  const prevMonth = shiftMonth(year, month, -1);
  const daysInPrevMonth = new Date(
    Date.UTC(prevMonth.year, prevMonth.month, 0, 12)
  ).getUTCDate();

  const cells: CalendarDayCell[] = [];

  for (let index = 0; index < 42; index += 1) {
    const dayOffset = index - firstWeekday + 1;

    if (dayOffset < 1) {
      const day = daysInPrevMonth + dayOffset;
      cells.push({
        dateKey: toDateKey(prevMonth.year, prevMonth.month, day),
        day,
        inMonth: false,
      });
      continue;
    }

    if (dayOffset > daysInMonth) {
      const nextMonth = shiftMonth(year, month, 1);
      const day = dayOffset - daysInMonth;
      cells.push({
        dateKey: toDateKey(nextMonth.year, nextMonth.month, day),
        day,
        inMonth: false,
      });
      continue;
    }

    cells.push({
      dateKey: toDateKey(year, month, dayOffset),
      day: dayOffset,
      inMonth: true,
    });
  }

  return cells;
}

export function resolveCalendarViewMonth(
  selectedDateKey: string | null | undefined,
  fallbackDateKey = getTodayDateString()
): { year: number; month: number } {
  const source = selectedDateKey || fallbackDateKey;
  const { year, month } = parseDateKey(source);
  return { year, month };
}

export const CALENDAR_WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

export function isTodayDateKey(dateKey: string, todayKey = getTodayDateString()) {
  return dateKey === todayKey;
}

export { shiftDateKey } from "@/lib/date-utils";
