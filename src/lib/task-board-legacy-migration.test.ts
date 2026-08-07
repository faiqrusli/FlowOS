import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const taskGroupsSource = readFileSync(
  new URL("./task-groups.ts", import.meta.url),
  "utf8",
);

describe("legacy Today task migration", () => {
  it("surfaces failed task moves before returning normalized board state", () => {
    const start = taskGroupsSource.indexOf("if (legacyTodayTasks.length > 0");
    const end = taskGroupsSource.indexOf("normalizedTasks = migrateTasksFromTodayGroup", start);
    const migration = taskGroupsSource.slice(start, end);

    expect(migration).toContain("const migrationResults = await Promise.all");
    expect(migration).toMatch(/migrationResults\.find\([\s\S]*?result\.error/);
    expect(migration).toContain("throw new TaskGroupsError(migrationError.message)");
  });
});
