import { describe, expect, it } from "vitest";
import {
  clampHour12,
  clampMinute,
  formatTimePickerDisplayLabel,
  formatTimePickerParts,
  parseSequentialTimeDigits,
  parseTimePickerParts,
  shiftHour12,
  shiftMinute,
  TIME_PICKER_HOURS,
  TIME_PICKER_MINUTES,
  timePickerPartsToInputValue,
  timePickerPartsToScheduledTime,
  toggleTimePickerPeriod,
  type TimePickerParts,
} from "@/lib/time-picker-utils";

const DEFAULT_PARTS: TimePickerParts = { hour12: 9, minute: 0, period: "AM" };

describe("option lists", () => {
  it("exposes 1–12 hours and 0–59 minutes", () => {
    expect(TIME_PICKER_HOURS[0]).toBe(1);
    expect(TIME_PICKER_HOURS.at(-1)).toBe(12);
    expect(TIME_PICKER_MINUTES).toHaveLength(60);
    expect(TIME_PICKER_MINUTES.at(-1)).toBe(59);
  });
});

describe("parseTimePickerParts", () => {
  it.each([
    ["00:00", { hour12: 12, minute: 0, period: "AM" }],
    ["09:05:00", { hour12: 9, minute: 5, period: "AM" }],
    ["12:30", { hour12: 12, minute: 30, period: "PM" }],
    ["13:45", { hour12: 1, minute: 45, period: "PM" }],
    ["23:59", { hour12: 11, minute: 59, period: "PM" }],
  ])("parses %s", (time, expected) => {
    expect(parseTimePickerParts(time)).toEqual(expected);
  });

  it("returns the fallback for missing or invalid input", () => {
    expect(parseTimePickerParts(null)).toEqual(DEFAULT_PARTS);
    expect(parseTimePickerParts("")).toEqual(DEFAULT_PARTS);
    expect(parseTimePickerParts("25:00")).toEqual(DEFAULT_PARTS);
    expect(parseTimePickerParts("nope", { hour12: 7, minute: 15, period: "PM" })).toEqual({
      hour12: 7,
      minute: 15,
      period: "PM",
    });
  });
});

describe("timePickerPartsToScheduledTime", () => {
  it.each([
    [{ hour12: 12, minute: 0, period: "AM" } as TimePickerParts, "00:00:00"],
    [{ hour12: 12, minute: 30, period: "PM" } as TimePickerParts, "12:30:00"],
    [{ hour12: 9, minute: 5, period: "AM" } as TimePickerParts, "09:05:00"],
    [{ hour12: 11, minute: 59, period: "PM" } as TimePickerParts, "23:59:00"],
  ])("%o → %s", (parts, expected) => {
    expect(timePickerPartsToScheduledTime(parts)).toBe(expected);
  });

  it("round-trips through parseTimePickerParts", () => {
    const parts: TimePickerParts = { hour12: 4, minute: 20, period: "PM" };
    expect(parseTimePickerParts(timePickerPartsToScheduledTime(parts))).toEqual(parts);
  });
});

describe("formatting helpers", () => {
  it("drops seconds for input values", () => {
    expect(timePickerPartsToInputValue({ hour12: 1, minute: 5, period: "PM" })).toBe("13:05");
  });

  it("formats compact and display labels", () => {
    const parts: TimePickerParts = { hour12: 7, minute: 5, period: "PM" };
    expect(formatTimePickerParts(parts)).toBe("7:05 pm");
    expect(formatTimePickerDisplayLabel(parts)).toBe("7:05 p.m.");
    expect(formatTimePickerDisplayLabel({ hour12: 7, minute: 5, period: "AM" })).toBe(
      "7:05 a.m."
    );
  });
});

describe("clamping and stepping", () => {
  it("clamps hours to 1–12", () => {
    expect(clampHour12(0)).toBe(1);
    expect(clampHour12(13)).toBe(12);
    expect(clampHour12(Number.NaN)).toBe(1);
    expect(clampHour12(6)).toBe(6);
  });

  it("clamps minutes to 0–59", () => {
    expect(clampMinute(-1)).toBe(0);
    expect(clampMinute(60)).toBe(59);
    expect(clampMinute(Number.NaN)).toBe(0);
    expect(clampMinute(30)).toBe(30);
  });

  it("toggles the period", () => {
    expect(toggleTimePickerPeriod("AM")).toBe("PM");
    expect(toggleTimePickerPeriod("PM")).toBe("AM");
  });

  it("wraps hours and minutes when stepping", () => {
    expect(shiftHour12(12, 1)).toBe(1);
    expect(shiftHour12(1, -1)).toBe(12);
    expect(shiftHour12(5, 2)).toBe(7);
    expect(shiftMinute(59, 1)).toBe(0);
    expect(shiftMinute(0, -1)).toBe(59);
    expect(shiftMinute(10, 5)).toBe(15);
  });
});

describe("parseSequentialTimeDigits", () => {
  it("returns null when there are no digits", () => {
    expect(parseSequentialTimeDigits("", DEFAULT_PARTS)).toBeNull();
    expect(parseSequentialTimeDigits("abc", DEFAULT_PARTS)).toBeNull();
  });

  it("treats one digit as the hour and keeps the current minute", () => {
    expect(parseSequentialTimeDigits("7", { hour12: 9, minute: 42, period: "PM" })).toEqual({
      hour12: 7,
      minute: 42,
      period: "PM",
    });
  });

  it("treats two digits as the hour and resets the minute", () => {
    expect(parseSequentialTimeDigits("11", { hour12: 9, minute: 42, period: "AM" })).toEqual({
      hour12: 11,
      minute: 0,
      period: "AM",
    });
  });

  it("splits three and four digits into hour and minute", () => {
    expect(parseSequentialTimeDigits("930", DEFAULT_PARTS)).toEqual({
      hour12: 9,
      minute: 30,
      period: "AM",
    });
    expect(parseSequentialTimeDigits("1145", DEFAULT_PARTS)).toEqual({
      hour12: 11,
      minute: 45,
      period: "AM",
    });
  });

  it("ignores non-digits, extra digits, and clamps out-of-range values", () => {
    expect(parseSequentialTimeDigits("1:2:3:4:5", DEFAULT_PARTS)).toEqual({
      hour12: 12,
      minute: 34,
      period: "AM",
    });
    expect(parseSequentialTimeDigits("2599", DEFAULT_PARTS)).toEqual({
      hour12: 12,
      minute: 59,
      period: "AM",
    });
  });
});
