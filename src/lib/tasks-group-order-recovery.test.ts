import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const taskGroupsSource = readFileSync(
  new URL("./task-groups.ts", import.meta.url),
  "utf8",
);

describe("task group order persistence", () => {
  it("surfaces a failed group-order update", () => {
    const start = taskGroupsSource.indexOf(
      "export async function reorderTaskGroups",
    );
    const end = taskGroupsSource.indexOf(
      "function persistableGroupOrderIds",
      start,
    );
    const handler = taskGroupsSource.slice(start, end);

    expect(handler).toContain("const results = await Promise.all");
    expect(handler).toMatch(/results\.find\([\s\S]*?result\.error/);
    expect(handler).toContain("throw new TaskGroupsError(groupOrderError.message)");
  });
});
