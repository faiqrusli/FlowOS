import { describe, expect, it } from "vitest";
import {
  getDisplayNextUpTasks,
  getNextUpTask,
  insertNextUpTask,
  isEligibleForNextUp,
  reorderNextUpTasks,
} from "@/lib/task-next-up-logic";
import type { Task } from "@/types/task";

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: overrides.id ?? "task-1",
    title: overrides.title ?? "Draft spec",
    description: null,
    scheduled_date: "2026-07-10",
    scheduled_time: null,
    priority: "low",
    user_id: "user-1",
    group_id: null,
    sort_order: 1000,
    queue_order: 1,
    duration_minutes: null,
    notification_enabled: true,
    notification_lead_minutes: null,
    completed: false,
    planning_state: "none",
    created_at: "2026-07-10T00:00:00.000Z",
    updated_at: "2026-07-10T00:00:00.000Z",
    completed_at: null,
    ...overrides,
  };
}

describe("task-next-up", () => {
  it("only admits incomplete Today or unscheduled tasks", () => {
    expect(isEligibleForNextUp(makeTask(), "2026-07-10")).toBe(true);
    expect(
      isEligibleForNextUp(makeTask({ scheduled_date: null }), "2026-07-10")
    ).toBe(true);
    expect(
      isEligibleForNextUp(makeTask({ scheduled_date: "2026-07-11" }), "2026-07-10")
    ).toBe(false);
    expect(isEligibleForNextUp(makeTask({ completed: true }), "2026-07-10")).toBe(false);
    expect(
      isEligibleForNextUp(makeTask({ planning_state: "later" }), "2026-07-10")
    ).toBe(false);
  });

  it("reorders tasks and normalizes persistent queue order", () => {
    const reordered = reorderNextUpTasks(
      [
        makeTask({ id: "a", queue_order: 1 }),
        makeTask({ id: "b", queue_order: 2 }),
        makeTask({ id: "c", queue_order: 3 }),
      ],
      0,
      2
    );

    expect(reordered.map((task) => task.id)).toEqual(["b", "c", "a"]);
    expect(reordered.map((task) => task.queue_order)).toEqual([1, 2, 3]);
  });

  it("inserts an external task at the requested queue position", () => {
    const inserted = insertNextUpTask(
      [makeTask({ id: "a" }), makeTask({ id: "c" })],
      makeTask({ id: "b" }),
      "c"
    );

    expect(inserted.map((task) => task.id)).toEqual(["a", "b", "c"]);
    expect(inserted.map((task) => task.queue_order)).toEqual([1, 2, 3]);
  });

  it("excludes the active task from the future queue display", () => {
    const visible = getDisplayNextUpTasks(
      [makeTask({ id: "current" }), makeTask({ id: "next" })],
      "current"
    );

    expect(visible.map((task) => task.id)).toEqual(["next"]);
  });

  it("promotes the first actionable queued task after completion", () => {
    const nextTask = getNextUpTask(
      [
        makeTask({ id: "completed", completed: true, queue_order: 1 }),
        makeTask({ id: "later", planning_state: "later", queue_order: 2 }),
        makeTask({ id: "next", queue_order: 3 }),
      ],
      "current",
      "2026-07-10"
    );

    expect(nextTask?.id).toBe("next");
  });
});
