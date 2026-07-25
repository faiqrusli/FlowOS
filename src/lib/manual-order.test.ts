import { describe, expect, it } from "vitest";
import {
  applyManualOrderUpdates,
  coerceManualOrder,
  compareManualOrder,
  computeManualOrderRepairs,
  computeManualReorderUpdates,
  isValidManualOrder,
  MANUAL_ORDER_INITIAL,
  MANUAL_ORDER_STEP,
  manualOrderForNewTaskAtEnd,
  manualOrderForNewTaskAtTop,
  normalizeTaskManualOrder,
  resolveManualOrderForCreate,
  sortByManualOrder,
} from "@/lib/manual-order";
import type { Task } from "@/types/task";

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    title: "Draft spec",
    description: null,
    scheduled_date: null,
    scheduled_time: null,
    priority: "medium",
    user_id: "user-1",
    group_id: null,
    sort_order: MANUAL_ORDER_INITIAL,
    queue_order: null,
    duration_minutes: null,
    notification_enabled: false,
    notification_lead_minutes: null,
    completed: false,
    planning_state: "none",
    created_at: "2026-07-10T00:00:00.000Z",
    updated_at: "2026-07-10T00:00:00.000Z",
    completed_at: null,
    ...overrides,
  };
}

describe("isValidManualOrder", () => {
  it.each([
    [1, true],
    [MANUAL_ORDER_STEP, true],
    [0, false],
    [-1, false],
    [1.5, false],
    [Number.NaN, false],
    [Number.POSITIVE_INFINITY, false],
    ["1000", false],
    [null, false],
    [undefined, false],
  ])("%p → %p", (value, expected) => {
    expect(isValidManualOrder(value)).toBe(expected);
  });
});

describe("coerceManualOrder", () => {
  it("keeps a valid value", () => {
    expect(coerceManualOrder(42, 7)).toBe(42);
  });

  it("falls back when the value is invalid", () => {
    expect(coerceManualOrder(0, 7)).toBe(7);
  });

  it("uses the initial order when the fallback is also invalid", () => {
    expect(coerceManualOrder(null, Number.NaN)).toBe(MANUAL_ORDER_INITIAL);
  });
});

describe("normalizeTaskManualOrder", () => {
  it("repairs an invalid sort_order without mutating the input", () => {
    const task = makeTask({ sort_order: -5 });
    const normalized = normalizeTaskManualOrder(task);
    expect(normalized.sort_order).toBe(MANUAL_ORDER_INITIAL);
    expect(task.sort_order).toBe(-5);
  });
});

describe("resolveManualOrderForCreate", () => {
  it("passes through valid values and repairs the rest", () => {
    expect(resolveManualOrderForCreate(2000)).toBe(2000);
    expect(resolveManualOrderForCreate(null)).toBe(MANUAL_ORDER_INITIAL);
    expect(resolveManualOrderForCreate(undefined, 3000)).toBe(3000);
  });
});

describe("compareManualOrder / sortByManualOrder", () => {
  it("orders by sort_order then created_at", () => {
    const older = makeTask({
      id: "older",
      sort_order: 1000,
      created_at: "2026-07-01T00:00:00.000Z",
    });
    const newer = makeTask({
      id: "newer",
      sort_order: 1000,
      created_at: "2026-07-02T00:00:00.000Z",
    });
    const last = makeTask({ id: "last", sort_order: 2000 });

    expect(compareManualOrder(older, newer)).toBeLessThan(0);
    expect(sortByManualOrder([last, newer, older]).map((task) => task.id)).toEqual([
      "older",
      "newer",
      "last",
    ]);
  });

  it("does not mutate the input array", () => {
    const tasks = [makeTask({ id: "b", sort_order: 2000 }), makeTask({ id: "a" })];
    sortByManualOrder(tasks);
    expect(tasks.map((task) => task.id)).toEqual(["b", "a"]);
  });
});

describe("computeManualOrderRepairs", () => {
  it("returns no updates when every task already has a valid order", () => {
    expect(
      computeManualOrderRepairs([makeTask({ id: "a" }), makeTask({ id: "b", sort_order: 2000 })])
    ).toEqual([]);
  });

  it("appends repaired tasks after the highest valid order in their group", () => {
    const updates = computeManualOrderRepairs([
      makeTask({ id: "valid", group_id: "g1", sort_order: 5000 }),
      makeTask({
        id: "broken-late",
        group_id: "g1",
        sort_order: 0,
        created_at: "2026-07-05T00:00:00.000Z",
      }),
      makeTask({
        id: "broken-early",
        group_id: "g1",
        sort_order: Number.NaN,
        created_at: "2026-07-01T00:00:00.000Z",
      }),
    ]);

    expect(updates).toEqual([
      { id: "broken-early", sort_order: 6000 },
      { id: "broken-late", sort_order: 7000 },
    ]);
  });

  it("repairs each group independently and treats ungrouped tasks as one group", () => {
    const updates = computeManualOrderRepairs([
      makeTask({ id: "grouped", group_id: "g1", sort_order: -1 }),
      makeTask({ id: "ungrouped", group_id: null, sort_order: -1 }),
    ]);

    expect(updates).toEqual([
      { id: "grouped", sort_order: MANUAL_ORDER_INITIAL },
      { id: "ungrouped", sort_order: MANUAL_ORDER_INITIAL },
    ]);
  });
});

describe("computeManualReorderUpdates", () => {
  const a = makeTask({ id: "a", sort_order: 1000 });
  const b = makeTask({ id: "b", sort_order: 2000 });
  const c = makeTask({ id: "c", sort_order: 3000 });

  it("returns nothing for an unknown moving task", () => {
    expect(computeManualReorderUpdates([a, b], "missing", "a")).toEqual([]);
  });

  it("returns nothing for an unknown target task", () => {
    expect(computeManualReorderUpdates([a, b], "a", "missing")).toEqual([]);
  });

  it("moves to the end using the last order plus a step", () => {
    expect(computeManualReorderUpdates([a, b, c], "a", null)).toEqual([
      { id: "a", sort_order: 4000 },
    ]);
  });

  it("moves to the top using the first order minus a step", () => {
    const shifted = [
      makeTask({ id: "a", sort_order: 2000 }),
      makeTask({ id: "b", sort_order: 3000 }),
      makeTask({ id: "c", sort_order: 4000 }),
    ];

    expect(computeManualReorderUpdates(shifted, "c", "a")).toEqual([
      { id: "c", sort_order: 1000 },
    ]);
  });

  it("moves between neighbours using the midpoint", () => {
    expect(computeManualReorderUpdates([a, b, c], "c", "b")).toEqual([
      { id: "c", sort_order: 1500 },
    ]);
  });

  it("renumbers the whole list when the neighbouring gap is exhausted", () => {
    const tight = [
      makeTask({ id: "a", sort_order: 1 }),
      makeTask({ id: "b", sort_order: 2 }),
      makeTask({ id: "c", sort_order: 3 }),
    ];

    expect(computeManualReorderUpdates(tight, "c", "b")).toEqual([
      { id: "a", sort_order: 1000 },
      { id: "c", sort_order: 2000 },
      { id: "b", sort_order: 3000 },
    ]);
  });

  it("renumbers when moving to the top would produce a non-positive order", () => {
    const tight = [makeTask({ id: "a", sort_order: 1 }), makeTask({ id: "b", sort_order: 5000 })];

    expect(computeManualReorderUpdates(tight, "b", "a")).toEqual([
      { id: "b", sort_order: 1000 },
      { id: "a", sort_order: 2000 },
    ]);
  });

  it("assigns the initial order when the list holds only the moving task", () => {
    expect(computeManualReorderUpdates([a], "a", null)).toEqual([
      { id: "a", sort_order: MANUAL_ORDER_INITIAL },
    ]);
  });
});

describe("manualOrderForNewTaskAtTop / manualOrderForNewTaskAtEnd", () => {
  it("uses the initial order for an empty list", () => {
    expect(manualOrderForNewTaskAtTop([])).toBe(MANUAL_ORDER_INITIAL);
    expect(manualOrderForNewTaskAtEnd([])).toBe(MANUAL_ORDER_INITIAL);
  });

  it("steps below the first and above the last order", () => {
    const tasks = [makeTask({ id: "a", sort_order: 2000 }), makeTask({ id: "b", sort_order: 3000 })];
    expect(manualOrderForNewTaskAtTop(tasks)).toBe(1000);
    expect(manualOrderForNewTaskAtEnd(tasks)).toBe(4000);
  });

  it("never returns a non-positive order at the top", () => {
    expect(manualOrderForNewTaskAtTop([makeTask({ sort_order: 500 })])).toBe(
      MANUAL_ORDER_INITIAL
    );
  });
});

describe("applyManualOrderUpdates", () => {
  it("returns the same array reference when there is nothing to apply", () => {
    const tasks = [makeTask()];
    expect(applyManualOrderUpdates(tasks, [])).toBe(tasks);
  });

  it("applies updates only to matching tasks", () => {
    const tasks = [makeTask({ id: "a" }), makeTask({ id: "b", sort_order: 2000 })];
    const next = applyManualOrderUpdates(tasks, [{ id: "b", sort_order: 500 }]);

    expect(next.map((task) => task.sort_order)).toEqual([MANUAL_ORDER_INITIAL, 500]);
    expect(next[0]).toBe(tasks[0]);
    expect(tasks[1].sort_order).toBe(2000);
  });
});
