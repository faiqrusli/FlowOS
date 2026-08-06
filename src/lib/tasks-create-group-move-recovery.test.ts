import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const tasksPageSource = readFileSync(
  new URL("../components/tasks/tasks-page-content.tsx", import.meta.url),
  "utf8",
);

describe("Tasks create-group move recovery", () => {
  it("reloads the board when moving into a new group cannot persist", () => {
    const start = tasksPageSource.indexOf(
      "async function handleCreateGroupAndMoveTask",
    );
    const end = tasksPageSource.indexOf("\n  async function handleDeleteTask", start);
    const handler = tasksPageSource.slice(start, end);

    expect(handler).toMatch(/catch \(err\)[\s\S]*?setError\([\s\S]*?void loadBoard\(\)/);
  });
});
