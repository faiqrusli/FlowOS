import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const tasksPageSource = readFileSync(
  new URL("../components/tasks/tasks-page-content.tsx", import.meta.url),
  "utf8",
);

describe("Tasks group-delete optimistic state", () => {
  it("moves deleted-group tasks into Inbox before removing the group", () => {
    const start = tasksPageSource.indexOf("async function handleDeleteGroup");
    const end = tasksPageSource.indexOf("\n  async function handleRenameGroup", start);
    const handler = tasksPageSource.slice(start, end);

    expect(handler).toContain("const group = groups.find");
    expect(handler).toContain('const inboxGroup = groups.find((item) => item.slug === "inbox")');
    expect(handler).toContain("const movedTasks = (group?.tasks ?? []).map");
    expect(handler).toContain("group_id: inboxGroup?.id ?? null");
    expect(handler).toContain("setGroups((prev) =>");
  });
});
