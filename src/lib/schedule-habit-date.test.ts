import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const habitsSource = readFileSync(new URL("./habits.ts", import.meta.url), "utf8");
const plannerSource = readFileSync(
  new URL("../components/tasks/timeline-planner.tsx", import.meta.url),
  "utf8",
);
const scheduleSource = readFileSync(
  new URL("../components/schedule/schedule-page-content.tsx", import.meta.url),
  "utf8",
);

describe("Schedule habit completion dates", () => {
  it("persists the selected date instead of always using Today", () => {
    expect(habitsSource).toContain("dateKey?: string");
    expect(habitsSource).toContain("const targetDate = dateKey ?? today");
    expect(habitsSource).toContain("isHabitCompletedOnDate(habit, targetDate)");
    expect(habitsSource).toContain("if (targetDate !== today) return habit");
  });

  it("threads the planner view date into the schedule handler", () => {
    expect(plannerSource).toContain("onToggleHabitComplete?: (");
    expect(plannerSource).toContain("dateKey: string");
    expect(plannerSource).toContain(
      "onToggleHabitComplete?.(block.habit, viewDate)",
    );
    expect(scheduleSource).toContain(
      "toggleHabitComplete(habit, dateKey)",
    );
  });
});
