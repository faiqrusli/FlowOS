import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const habitsSource = readFileSync(new URL("./habits.ts", import.meta.url), "utf8");

describe("habit completion date targeting", () => {
  it("writes the requested date and preserves the today flag off Today", () => {
    expect(habitsSource).toContain("dateKey?: string");
    expect(habitsSource).toContain("const targetDate = dateKey ?? today");
    expect(habitsSource).toContain("isHabitCompletedOnDate(habit, targetDate)");
    expect(habitsSource).toContain("removeHabitCompletion(habit.id, targetDate)");
    expect(habitsSource).toContain("recordHabitCompletion(habit.id, targetDate)");
    expect(habitsSource).toContain("if (targetDate !== today) return habit");
  });
});
