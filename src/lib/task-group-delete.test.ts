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

    expect(handler).toContain(
      'supabase.rpc(\n    "delete_task_group_with_tasks_to_inbox"',
    );
    expect(handler).toContain("p_group_id: groupId");
    expect(groupDeleteIndex).toBe(-1);
    expect(taskMoveIndex).toBe(-1);
  });
});
