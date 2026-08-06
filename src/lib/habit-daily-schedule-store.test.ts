import { afterEach, describe, expect, it, vi } from "vitest";

describe("habit daily schedule storage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("restores the previous override when storage write fails", async () => {
    vi.resetModules();
    const key = "flowos.habit.daily-schedule";
    const previous = JSON.stringify({
      "habit-1": { "2026-08-07": "09:00" },
    });

    vi.stubGlobal("window", {
      localStorage: {
        getItem: (requested: string) => (requested === key ? previous : null),
        setItem: () => {
          throw new Error("quota");
        },
        removeItem: () => {},
      },
    });

    const store = await import("@/lib/habit-daily-schedule-store");

    expect(
      store.setHabitDailyScheduleOverride(
        "habit-1",
        "2026-08-07",
        "11:00",
      ),
    ).toBe(false);
    expect(
      store.getEffectiveHabitScheduledTime(
        "habit-1",
        "08:00",
        "2026-08-07",
      ),
    ).toBe("09:00");
  });
});
