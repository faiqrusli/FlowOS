import { afterEach, describe, expect, it } from "vitest";
import {
  applyLaterColumnSortMode,
  canReorderTasksInGroup,
  DEFAULT_TASK_SORT_MODE,
  getLaterColumnSortMode,
  getSortContextForGroup,
  getTaskGroupSortMode,
  isManualTaskSortMode,
  isSortableTaskColumn,
  normalizeTaskSortMode,
  setLaterColumnSortMode,
  sortActiveAndCompletedForContext,
  sortCompletedTasks,
  sortTasksByMode,
  sortTasksForTodayView,
  TASK_SORT_LATER_COLUMN_ID,
} from "@/lib/task-sort";
import type { Task, TaskGroup } from "@/types/task";

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
    sort_order: 1000,
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

function makeGroup(overrides: Partial<TaskGroup> = {}): TaskGroup {
  return {
    id: "group-1",
    user_id: "user-1",
    title: "Work",
    slug: "work",
    sort_order: 1,
    sort_mode: "manual",
    created_at: "2026-07-01T00:00:00.000Z",
    ...overrides,
  };
}

/** task-sort reads/writes the Later sort mode through window.localStorage. */
function stubLocalStorage(initial: Record<string, string> = {}) {
  const store = new Map(Object.entries(initial));
  const localStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
  };

  (globalThis as { window?: unknown }).window = { localStorage };
  return store;
}

afterEach(() => {
  delete (globalThis as { window?: unknown }).window;
});

describe("normalizeTaskSortMode", () => {
  it("keeps known modes", () => {
    expect(normalizeTaskSortMode("priority")).toBe("priority");
    expect(normalizeTaskSortMode("alphabetical")).toBe("alphabetical");
  });

  it("falls back to the default for unknown values", () => {
    expect(normalizeTaskSortMode("nope")).toBe(DEFAULT_TASK_SORT_MODE);
    expect(normalizeTaskSortMode(null)).toBe(DEFAULT_TASK_SORT_MODE);
    expect(normalizeTaskSortMode(7)).toBe(DEFAULT_TASK_SORT_MODE);
  });
});

describe("isManualTaskSortMode", () => {
  it("is true only for manual", () => {
    expect(isManualTaskSortMode("manual")).toBe(true);
    expect(isManualTaskSortMode("created")).toBe(false);
  });
});

describe("isSortableTaskColumn", () => {
  it("excludes the Today column by slug or title", () => {
    expect(isSortableTaskColumn(makeGroup({ slug: "today" }))).toBe(false);
    expect(isSortableTaskColumn(makeGroup({ slug: null, title: "Today" }))).toBe(false);
    expect(
      isSortableTaskColumn(makeGroup({ slug: null, title: "Today's Tasks" }))
    ).toBe(false);
  });

  it("includes other columns", () => {
    expect(isSortableTaskColumn(makeGroup())).toBe(true);
  });
});

describe("sortTasksForTodayView", () => {
  it("orders by time, then priority, then creation", () => {
    const untimed = makeTask({ id: "untimed", scheduled_time: null, priority: "high" });
    const earlyLow = makeTask({ id: "early-low", scheduled_time: "09:00", priority: "low" });
    const earlyHigh = makeTask({ id: "early-high", scheduled_time: "09:00", priority: "high" });
    const late = makeTask({ id: "late", scheduled_time: "17:00" });

    expect(
      sortTasksForTodayView([untimed, earlyLow, late, earlyHigh]).map((task) => task.id)
    ).toEqual(["early-high", "early-low", "late", "untimed"]);
  });

  it("breaks priority ties with created_at and leaves the input untouched", () => {
    const tasks = [
      makeTask({ id: "b", created_at: "2026-07-11T00:00:00.000Z" }),
      makeTask({ id: "a", created_at: "2026-07-10T00:00:00.000Z" }),
    ];

    expect(sortTasksForTodayView(tasks).map((task) => task.id)).toEqual(["a", "b"]);
    expect(tasks.map((task) => task.id)).toEqual(["b", "a"]);
  });
});

describe("sortTasksByMode", () => {
  const high = makeTask({ id: "high", priority: "high", scheduled_date: "2026-07-20" });
  const mediumEarly = makeTask({
    id: "medium-early",
    priority: "medium",
    scheduled_date: "2026-07-10",
  });
  const mediumLate = makeTask({
    id: "medium-late",
    priority: "medium",
    scheduled_date: "2026-07-15",
  });
  const low = makeTask({ id: "low", priority: "low" });

  it("sorts by priority, then date, then time, then creation", () => {
    expect(
      sortTasksByMode([low, mediumLate, high, mediumEarly], "priority").map((task) => task.id)
    ).toEqual(["high", "medium-early", "medium-late", "low"]);
  });

  it("treats an unknown priority as medium", () => {
    const unknown = makeTask({ id: "unknown", priority: null });
    expect(sortTasksByMode([low, unknown, high], "priority").map((task) => task.id)).toEqual([
      "high",
      "unknown",
      "low",
    ]);
  });

  it("sorts newest first for created and updated", () => {
    const older = makeTask({
      id: "older",
      created_at: "2026-07-01T00:00:00.000Z",
      updated_at: "2026-07-02T00:00:00.000Z",
    });
    const newer = makeTask({
      id: "newer",
      created_at: "2026-07-05T00:00:00.000Z",
      updated_at: null,
    });

    expect(sortTasksByMode([older, newer], "created").map((task) => task.id)).toEqual([
      "newer",
      "older",
    ]);
    expect(sortTasksByMode([older, newer], "updated").map((task) => task.id)).toEqual([
      "newer",
      "older",
    ]);
  });

  it("sorts alphabetically, case-insensitively", () => {
    const tasks = [
      makeTask({ id: "b", title: "banana" }),
      makeTask({ id: "a", title: "Apple" }),
    ];

    expect(sortTasksByMode(tasks, "alphabetical").map((task) => task.id)).toEqual(["a", "b"]);
  });

  it("sorts by manual order (sort_order) in manual mode", () => {
    const tasks = [
      makeTask({ id: "second", sort_order: 2000, title: "aaa" }),
      makeTask({ id: "first", sort_order: 1000, title: "zzz" }),
    ];

    expect(sortTasksByMode(tasks, "manual").map((task) => task.id)).toEqual([
      "first",
      "second",
    ]);
  });
});

describe("sortCompletedTasks", () => {
  it("sorts by completion time descending, falling back to created_at", () => {
    const completedLater = makeTask({
      id: "later",
      completed: true,
      completed_at: "2026-07-12T10:00:00.000Z",
    });
    const completedEarlier = makeTask({
      id: "earlier",
      completed: true,
      completed_at: "2026-07-11T10:00:00.000Z",
    });
    const noCompletedAt = makeTask({
      id: "fallback",
      completed: true,
      completed_at: null,
      created_at: "2026-07-01T00:00:00.000Z",
    });

    expect(
      sortCompletedTasks([completedEarlier, noCompletedAt, completedLater]).map(
        (task) => task.id
      )
    ).toEqual(["later", "earlier", "fallback"]);
  });
});

describe("sortActiveAndCompletedForContext", () => {
  const active = makeTask({ id: "active", scheduled_time: "10:00" });
  const activeEarly = makeTask({ id: "active-early", scheduled_time: "08:00", sort_order: 5000 });
  const done = makeTask({ id: "done", completed: true, completed_at: "2026-07-12T00:00:00.000Z" });

  it("uses the Today ordering for the Today column", () => {
    const result = sortActiveAndCompletedForContext([active, activeEarly, done], {
      sortMode: "manual",
      isTodayColumn: true,
    });

    expect(result.active.map((task) => task.id)).toEqual(["active-early", "active"]);
    expect(result.completed.map((task) => task.id)).toEqual(["done"]);
  });

  it("uses the group's sort mode elsewhere", () => {
    const result = sortActiveAndCompletedForContext([activeEarly, active, done], {
      sortMode: "manual",
    });

    expect(result.active.map((task) => task.id)).toEqual(["active", "active-early"]);
  });
});

describe("Later column sort mode", () => {
  it("defaults to manual when storage is unavailable", () => {
    expect(getLaterColumnSortMode()).toBe(DEFAULT_TASK_SORT_MODE);
  });

  it("round-trips through localStorage", () => {
    stubLocalStorage();
    setLaterColumnSortMode("priority");
    expect(getLaterColumnSortMode()).toBe("priority");
  });

  it("normalizes unknown stored values", () => {
    stubLocalStorage({ "flowos:later-column-sort-mode": "bogus" });
    expect(getLaterColumnSortMode()).toBe(DEFAULT_TASK_SORT_MODE);
  });

  it("overrides the stored mode on every Later group", () => {
    stubLocalStorage();
    setLaterColumnSortMode("alphabetical");

    const groups = applyLaterColumnSortMode([
      makeGroup({ id: TASK_SORT_LATER_COLUMN_ID, slug: null, sort_mode: "manual" }),
      makeGroup({ id: "other", slug: "later", sort_mode: "manual" }),
      makeGroup({ id: "work", sort_mode: "created" }),
    ]);

    expect(groups.map((group) => group.sort_mode)).toEqual([
      "alphabetical",
      "alphabetical",
      "created",
    ]);
  });
});

describe("getTaskGroupSortMode / getSortContextForGroup", () => {
  it("reads the shared Later mode for Later-like groups", () => {
    stubLocalStorage();
    setLaterColumnSortMode("created");

    expect(getTaskGroupSortMode(makeGroup({ slug: "later", sort_mode: "manual" }))).toBe(
      "created"
    );
    expect(
      getTaskGroupSortMode(makeGroup({ slug: null, title: "Backlog", sort_mode: "manual" }))
    ).toBe("created");
  });

  it("reads the group's own mode otherwise", () => {
    expect(getTaskGroupSortMode(makeGroup({ sort_mode: "priority" }))).toBe("priority");
    expect(getTaskGroupSortMode(makeGroup({ sort_mode: null }))).toBe(DEFAULT_TASK_SORT_MODE);
  });

  it("flags the Today column in the sort context", () => {
    expect(getSortContextForGroup(makeGroup({ slug: "today" }))).toEqual({
      sortMode: DEFAULT_TASK_SORT_MODE,
      isTodayColumn: true,
    });
    expect(getSortContextForGroup(makeGroup({ sort_mode: "priority" }))).toEqual({
      sortMode: "priority",
      isTodayColumn: false,
    });
  });
});

describe("canReorderTasksInGroup", () => {
  it("requires a sortable column in manual mode", () => {
    expect(canReorderTasksInGroup(makeGroup({ sort_mode: "manual" }))).toBe(true);
    expect(canReorderTasksInGroup(makeGroup({ sort_mode: "priority" }))).toBe(false);
    expect(canReorderTasksInGroup(makeGroup({ slug: "today", sort_mode: "manual" }))).toBe(
      false
    );
  });
});
