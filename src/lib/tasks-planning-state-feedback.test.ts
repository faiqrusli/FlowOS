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

describe("Tasks planning-state feedback", () => {
  it.each([
    ["handleMoveToLater", "Moved to Later"],
    ["handleClearPlanningState", "Set to Normal"],
  ])(
    "does not report %s success until persistence succeeds",
    (helperName, successMessage) => {
      const caller = getHandlerSource("handleSetPlanningState");
      const successToastIndex = caller.indexOf(successMessage);

      expect(successToastIndex).toBeGreaterThan(-1);
      expect(caller.slice(0, successToastIndex)).toMatch(
        new RegExp(
          `const\\s+\\w+\\s*=\\s*await\\s+${helperName}\\(taskId\\)[\\s\\S]*?if\\s*\\(!\\w+\\)\\s*return`,
        ),
      );
    },
  );
});
