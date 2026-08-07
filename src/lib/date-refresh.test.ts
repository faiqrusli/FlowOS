import { describe, expect, it, vi } from "vitest";
import { createDateChangeDetector } from "@/lib/date-refresh";

describe("date refresh", () => {
  it("notifies once when the app date changes", () => {
    let currentDateKey = "2026-08-04";
    const onChange = vi.fn();
    const checkDate = createDateChangeDetector(
      () => currentDateKey,
      onChange,
    );

    expect(checkDate()).toBe(false);

    currentDateKey = "2026-08-05";
    expect(checkDate()).toBe(true);
    expect(onChange).toHaveBeenCalledWith("2026-08-05");

    expect(checkDate()).toBe(false);
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
