import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const taskRowSource = readFileSync(
  new URL("../components/tasks/task-row.tsx", import.meta.url),
  "utf8",
);

describe("Tasks Add to Today action", () => {
  it("uses the board's canonical Today view date", () => {
    const actionStart = taskRowSource.indexOf("onAddToToday=");
    const actionEnd = taskRowSource.indexOf("          onSetPlanningState=", actionStart);
    const action = taskRowSource.slice(actionStart, actionEnd);

    expect(action).toContain("task.scheduled_date !== todayViewDate");
    expect(action).toContain("scheduled_date: todayViewDate");
    expect(action).not.toContain("getTodayDateString()");
  });
});
