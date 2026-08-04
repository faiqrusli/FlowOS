import { describe, expect, it } from "vitest";

import {
  dateKeyToUtcDate,
  getDateKeyInTimezone,
  parseTimestamp,
  shiftDateKey,
} from "@/lib/date-utils";

describe("dateKeyToUtcDate", () => {
  it("parses a YYYY-MM-DD key at noon UTC by default", () => {
    const date = dateKeyToUtcDate("2026-07-25");
    expect(date.getUTCFullYear()).toBe(2026);
    expect(date.getUTCMonth()).toBe(6); // July (0-indexed)
    expect(date.getUTCDate()).toBe(25);
    expect(date.getUTCHours()).toBe(12);
  });

  it("honours an explicit UTC hour", () => {
    expect(dateKeyToUtcDate("2026-07-25", 0).getUTCHours()).toBe(0);
    expect(dateKeyToUtcDate("2026-07-25", 4).getUTCHours()).toBe(4);
  });

  it("keeps shiftDateKey stable across month boundaries", () => {
    expect(shiftDateKey("2026-07-31", 1)).toBe("2026-08-01");
    expect(shiftDateKey("2026-01-01", -1)).toBe("2025-12-31");
  });

  it("keeps malformed timestamps invalid", () => {
    expect(Number.isNaN(parseTimestamp("not-a-timestamp").getTime())).toBe(true);
  });

  it("uses the Singapore date at a UTC midnight boundary", () => {
    expect(getDateKeyInTimezone("2026-08-04T16:00:00Z")).toBe("2026-08-05");
  });
});
