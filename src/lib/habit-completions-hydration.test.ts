import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const habitsSource = readFileSync(new URL("./habits.ts", import.meta.url), "utf8");
const storeSource = readFileSync(
  new URL("./habit-completions-store.ts", import.meta.url),
  "utf8",
);

describe("habit completion hydration", () => {
  it("resets legacy flags only after a successful remote load", () => {
    const loadIndex = habitsSource.indexOf("await loadHabitCompletions()");
    const resetIndex = habitsSource.indexOf(
      "resetStaleHabitCompletedFlags",
      loadIndex,
    );

    expect(resetIndex).toBeGreaterThan(loadIndex);
    expect(habitsSource).toContain(
      "wasLastHabitCompletionsRemoteLoadSuccessful()",
    );
  });

  it("does not delete a remote today completion because of a false legacy flag", () => {
    expect(storeSource).toContain("if (habit.completed && !dates.has(todayKey))");
    expect(storeSource).not.toContain(
      "if (!habit.completed && dates.has(todayKey))",
    );
  });
});
