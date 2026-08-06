import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const tasksPageSource = readFileSync(
  new URL("../components/tasks/tasks-page-content.tsx", import.meta.url),
  "utf8",
);

function getHandlerSource(name: string): string {
  const start = tasksPageSource.indexOf(`async function ${name}`);
  expect(start).toBeGreaterThan(-1);

  const end = tasksPageSource.indexOf("\n  async function ", start + 1);
  return tasksPageSource.slice(start, end === -1 ? undefined : end);
}

describe("Tasks move persistence ordering", () => {
  it.each(["handleMoveTask", "handleCreateGroupAndMoveTask"])(
    "projects the next board before scheduling the %s state update",
    (handlerName) => {
      const handler = getHandlerSource(handlerName);
      const projectionIndex = handler.indexOf("moveTaskInBoard(");
      const stateUpdateIndex = handler.indexOf("setGroups(");

      expect(projectionIndex).toBeGreaterThan(-1);
      expect(stateUpdateIndex).toBeGreaterThan(-1);
      expect(projectionIndex).toBeLessThan(stateUpdateIndex);
    },
  );
});
