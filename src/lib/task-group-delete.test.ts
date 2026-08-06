import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const taskGroupsSource = readFileSync(
  new URL("./task-groups.ts", import.meta.url),
  "utf8",
);

describe("task group deletion persistence", () => {
  it("moves owned tasks to Inbox before deleting the group", () => {
    const start = taskGroupsSource.indexOf(
      "export async function deleteTaskGroup",
    );
    const end = taskGroupsSource.indexOf(
      "export async function reorderTaskGroups",
      start,
    );
    const handler = taskGroupsSource.slice(start, end);
    const taskMoveIndex = handler.indexOf('.from("tasks")');
    const groupDeleteIndex = handler.indexOf(
      '.from("task_groups")\n    .delete',
    );

    expect(taskMoveIndex).toBeGreaterThan(-1);
    expect(groupDeleteIndex).toBeGreaterThan(taskMoveIndex);
    expect(handler).toContain(".update({ group_id: inbox.id })");
    expect(handler).toContain('.eq("group_id", groupId)');
    expect(handler).toContain('.eq("user_id", userId)');
  });
});
