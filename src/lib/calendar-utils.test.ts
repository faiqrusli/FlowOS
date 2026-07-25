import { describe, expect, it } from "vitest";
import {
  CALENDAR_WEEKDAY_LABELS,
  getCalendarMonthGrid,
  getMonthLabel,
  isTodayDateKey,
  parseDateKey,
  resolveCalendarViewMonth,
  shiftMonth,
  toDateKey,
} from "@/lib/calendar-utils";

describe("parseDateKey / toDateKey", () => {
  it("parses a date key into numbers", () => {
    expect(parseDateKey("2026-07-09")).toEqual({ year: 2026, month: 7, day: 9 });
  });

  it("pads month and day", () => {
    expect(toDateKey(2026, 7, 9)).toBe("2026-07-09");
    expect(toDateKey(2026, 12, 31)).toBe("2026-12-31");
  });

  it("round-trips", () => {
    const { year, month, day } = parseDateKey("2026-02-28");
    expect(toDateKey(year, month, day)).toBe("2026-02-28");
  });
});

describe("getMonthLabel", () => {
  it("formats month and year", () => {
    expect(getMonthLabel(2026, 7)).toBe("July 2026");
    expect(getMonthLabel(2026, 1)).toBe("January 2026");
  });
});

describe("shiftMonth", () => {
  it("moves forward and backward within a year", () => {
    expect(shiftMonth(2026, 7, 1)).toEqual({ year: 2026, month: 8 });
    expect(shiftMonth(2026, 7, -1)).toEqual({ year: 2026, month: 6 });
  });

  it("rolls over year boundaries", () => {
    expect(shiftMonth(2026, 12, 1)).toEqual({ year: 2027, month: 1 });
    expect(shiftMonth(2026, 1, -1)).toEqual({ year: 2025, month: 12 });
    expect(shiftMonth(2026, 1, -13)).toEqual({ year: 2024, month: 12 });
  });
});

describe("getCalendarMonthGrid", () => {
  it("always returns six weeks of cells", () => {
    expect(getCalendarMonthGrid(2026, 7)).toHaveLength(42);
  });

  it("starts on Sunday and pads with the previous month", () => {
    // 1 July 2026 is a Wednesday.
    const cells = getCalendarMonthGrid(2026, 7);

    expect(cells.slice(0, 3)).toEqual([
      { dateKey: "2026-06-28", day: 28, inMonth: false },
      { dateKey: "2026-06-29", day: 29, inMonth: false },
      { dateKey: "2026-06-30", day: 30, inMonth: false },
    ]);
    expect(cells[3]).toEqual({ dateKey: "2026-07-01", day: 1, inMonth: true });
  });

  it("pads the tail with the next month", () => {
    const cells = getCalendarMonthGrid(2026, 7);
    const inMonth = cells.filter((cell) => cell.inMonth);

    expect(inMonth).toHaveLength(31);
    expect(inMonth.at(-1)).toEqual({ dateKey: "2026-07-31", day: 31, inMonth: true });
    expect(cells.at(-1)).toEqual({ dateKey: "2026-08-08", day: 8, inMonth: false });
  });

  it("handles a February that starts on a Sunday in a leap year", () => {
    // 1 February 2032 is a Sunday; 2032 is a leap year.
    const cells = getCalendarMonthGrid(2032, 2);

    expect(cells[0]).toEqual({ dateKey: "2032-02-01", day: 1, inMonth: true });
    expect(cells.filter((cell) => cell.inMonth)).toHaveLength(29);
    expect(cells[29]).toEqual({ dateKey: "2032-03-01", day: 1, inMonth: false });
  });

  it("rolls the leading padding into the previous year", () => {
    const cells = getCalendarMonthGrid(2027, 1);
    expect(cells[0].dateKey.startsWith("2026-12")).toBe(true);
  });
});

describe("resolveCalendarViewMonth", () => {
  it("uses the selected date key when present", () => {
    expect(resolveCalendarViewMonth("2026-03-15")).toEqual({ year: 2026, month: 3 });
  });

  it("falls back when the selection is empty", () => {
    expect(resolveCalendarViewMonth(null, "2026-11-02")).toEqual({ year: 2026, month: 11 });
    expect(resolveCalendarViewMonth("", "2026-11-02")).toEqual({ year: 2026, month: 11 });
    expect(resolveCalendarViewMonth(undefined, "2026-11-02")).toEqual({
      year: 2026,
      month: 11,
    });
  });
});

describe("isTodayDateKey", () => {
  it("compares against the provided today key", () => {
    expect(isTodayDateKey("2026-07-09", "2026-07-09")).toBe(true);
    expect(isTodayDateKey("2026-07-10", "2026-07-09")).toBe(false);
  });
});

describe("CALENDAR_WEEKDAY_LABELS", () => {
  it("starts the week on Sunday", () => {
    expect(CALENDAR_WEEKDAY_LABELS).toEqual(["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]);
  });
});
