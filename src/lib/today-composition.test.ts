import { describe, expect, it } from "vitest";

import {
  loadTodayComposition,
  type TodayCompositionReaders,
  type TodayComposition,
} from "@/lib/today-composition";
import type { FocusSession } from "@/types/focus";
import type { Habit } from "@/types/habit";
import type { Reflection } from "@/types/reflection";
import type { Task } from "@/types/task";

const DATE_KEY = "2026-08-05";

const task: Task = {
  id: "task-1",
  title: "Prepare review",
  description: null,
  scheduled_date: DATE_KEY,
  scheduled_time: "09:00",
  priority: "high",
  user_id: "account-a",
  group_id: null,
  sort_order: 1,
  queue_order: null,
  duration_minutes: 30,
  notification_enabled: false,
  notification_lead_minutes: null,
  completed: false,
  planning_state: "none",
  created_at: "2026-08-04T00:00:00Z",
  updated_at: "2026-08-04T00:00:00Z",
  completed_at: null,
};

const habit: Habit = {
  id: "habit-1",
  name: "Walk",
  scheduled_time: "12:00",
  days_of_week: null,
  completed: false,
  track_with_focus: false,
  user_id: "account-a",
  created_at: "2026-08-04T00:00:00Z",
};

const session: FocusSession = {
  id: "session-1",
  focus_duration: 600,
  break_duration: 0,
  started_at: "2026-08-05T01:00:00Z",
  ended_at: "2026-08-05T01:10:00Z",
  session_status: "completed",
  target_type: "task",
  target_id: task.id,
  user_id: "account-a",
  created_at: "2026-08-05T01:10:00Z",
};

const reflection: Reflection = {
  id: "reflection-1",
  reflection_date: DATE_KEY,
  went_well: "The review was clear.",
  went_wrong: "",
  custom_entries: [],
  custom_kanbans: [],
  user_id: "account-a",
  created_at: "2026-08-05T10:00:00Z",
};

function readers(overrides: Partial<TodayCompositionReaders> = {}) {
  return {
    tasks: async () => [task],
    focus: async () => [session],
    reflection: async () => reflection,
    habits: async () => [habit],
    ...overrides,
  };
}

async function readyComposition(): Promise<TodayComposition> {
  return loadTodayComposition({
    dateKey: DATE_KEY,
    readers: readers(),
  });
}

describe("Today composition", () => {
  it("settles ready source data without creating score semantics", async () => {
    const result = await readyComposition();

    expect(result.dateKey).toBe(DATE_KEY);
    expect(result.tasks.state).toBe("partial");
    expect(result.tasks.data?.tasks).toEqual([task]);
    expect(result.tasks.data?.nextUp.state).toBe("unavailable");
    expect(result.focus.state).toBe("partial");
    expect(result.focus.data?.attribution.state).toBe("unavailable");
    expect(result.reflection.state).toBe("ready");
    expect(result.habits.state).toBe("ready");
    expect(result.schedule.state).toBe("ready");
    expect(result.state).toBe("partial");
    expect(JSON.stringify(result)).not.toContain("on track");
  });

  it("represents confirmed empty sources as empty, not as failure", async () => {
    const result = await loadTodayComposition({
      dateKey: DATE_KEY,
      readers: {
        tasks: async () => [],
        focus: async () => [],
        reflection: async () => null,
        habits: async () => [],
      },
    });

    expect(result.tasks.state).toBe("empty");
    expect(result.focus.state).toBe("empty");
    expect(result.reflection.state).toBe("empty");
    expect(result.habits.state).toBe("empty");
    expect(result.schedule.state).toBe("empty");
    expect(result.state).toBe("ready");
  });

  it("keeps unrelated confirmed sources when one read fails", async () => {
    const result = await loadTodayComposition({
      dateKey: DATE_KEY,
      readers: readers({
        tasks: async () => {
          throw new Error("database details must not reach the UI");
        },
        habits: async () => [],
      }),
    });

    expect(result.tasks.state).toBe("error");
    expect(result.tasks.limitation).toBe(
      "Tasks could not be confirmed. Retry or open Tasks.",
    );
    expect(result.tasks.limitation).not.toContain("database");
    expect(result.focus.state).toBe("partial");
    expect(result.reflection.state).toBe("ready");
    expect(result.habits.state).toBe("empty");
    expect(result.schedule.state).toBe("unavailable");
    expect(result.state).toBe("partial");
  });

  it("keeps last-confirmed data as stale after a refresh failure", async () => {
    const previous = await readyComposition();
    const result = await loadTodayComposition({
      dateKey: DATE_KEY,
      previous,
      sources: ["tasks"],
      readers: {
        tasks: async () => {
          throw new Error("temporary connection failure");
        },
      },
    });

    expect(result.tasks.state).toBe("stale");
    expect(result.tasks.freshness).toBe("last-confirmed");
    expect(result.tasks.data?.tasks).toEqual([task]);
    expect(result.schedule.state).toBe("stale");
    expect(result.state).toBe("stale");
  });

  it("retries only the requested source", async () => {
    const previous = await readyComposition();
    let taskReads = 0;
    let focusReads = 0;

    const result = await loadTodayComposition({
      dateKey: DATE_KEY,
      previous,
      sources: ["tasks"],
      readers: {
        tasks: async () => {
          taskReads += 1;
          return [task];
        },
        focus: async () => {
          focusReads += 1;
          return [];
        },
      },
    });

    expect(taskReads).toBe(1);
    expect(focusReads).toBe(0);
    expect(result.tasks.state).toBe("partial");
    expect(result.focus.data?.sessions).toEqual([session]);
  });

  it("keeps pending Focus attribution unavailable even when a task was selected", async () => {
    const result = await readyComposition();

    expect(result.focus.data?.sessions[0]?.target_id).toBe(task.id);
    expect(result.focus.data?.attribution.state).toBe("unavailable");
    expect(result.focus.data?.attribution.limitation).toContain("migration");
  });

  it("passes the explicit Singapore date key to date-scoped readers", async () => {
    const requested: string[] = [];

    await loadTodayComposition({
      dateKey: DATE_KEY,
      readers: {
        tasks: async (dateKey) => {
          requested.push(dateKey);
          return [];
        },
        focus: async () => [],
        reflection: async (dateKey) => {
          requested.push(dateKey);
          return null;
        },
        habits: async (dateKey) => {
          requested.push(dateKey);
          return [];
        },
      },
    });

    expect(requested).toEqual([DATE_KEY, DATE_KEY, DATE_KEY]);
  });
});
