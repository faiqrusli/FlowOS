import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const taskRowSource = readFileSync(
  new URL("../components/tasks/task-row.tsx", import.meta.url),
  "utf8",
);

function getActionSource(startMarker: string, endMarker: string): string {
  const start = taskRowSource.indexOf(startMarker);
  const end = taskRowSource.indexOf(endMarker, start);
  expect(start).toBeGreaterThan(-1);
  expect(end).toBeGreaterThan(start);
  return taskRowSource.slice(start, end);
}

describe("Task row update feedback", () => {
  it.each([
    ["Add to Today", "onAddToToday={", "onSetPlanningState="],
    ["alert updates", "onSetAlertBefore={", "onCloseMenu="],
  ])("waits for %s persistence before success feedback", (_label, start, end) => {
    const action = getActionSource(start, end);

    expect(action).toMatch(
      /const updated = await onUpdate\([\s\S]*?if \(updated === false\) return;[\s\S]*?showActionToast/,
    );
  });

  it("does not close the custom alert editor before its update succeeds", () => {
    const customAlertStart = taskRowSource.indexOf(
      "<AlertBeforeCustomInput",
    );
    const customAlertEnd = taskRowSource.indexOf("        />", customAlertStart);
    const customAlert = taskRowSource.slice(customAlertStart, customAlertEnd);

    expect(customAlert).not.toContain("onCommitDone={onCloseMenu}");
  });
});
