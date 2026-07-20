import { describe, expect, it } from "vitest";
import {
  buildScheduleReminderEvents,
  selectDueScheduleReminderEvents,
  type ScheduleReminderEvent,
} from "@/lib/schedule-reminder-events";
import type { Habit } from "@/types/habit";
import type { Task } from "@/types/task";

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    title: "Ship notifications",
    description: null,
    scheduled_date: "2026-07-20",
    scheduled_time: "20:00:00",
    priority: "low",
    user_id: "user-1",
    group_id: null,
    sort_order: 1000,
    queue_order: null,
    duration_minutes: null,
    notification_enabled: true,
    notification_lead_minutes: 10,
    completed: false,
    planning_state: "none",
    created_at: "2026-07-20T00:00:00.000Z",
    updated_at: "2026-07-20T00:00:00.000Z",
    completed_at: null,
    ...overrides,
  };
}

function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: "habit-1",
    name: "Workout",
    scheduled_time: "07:00:00",
    days_of_week: ["Mon"],
    track_with_focus: false,
    completed: false,
    user_id: "user-1",
    created_at: "2026-07-20T00:00:00.000Z",
    ...overrides,
  };
}

describe("buildScheduleReminderEvents", () => {
  it("builds reminder + start for today tasks with lead minutes", () => {
    const events = buildScheduleReminderEvents({
      tasks: [makeTask()],
      habits: [],
      dateKey: "2026-07-20",
    });

    expect(events.map((e) => [e.kind, e.fireAtMinutes])).toEqual([
      ["reminder", 20 * 60 - 10],
      ["start", 20 * 60],
    ]);
  });

  it("skips silent and completed tasks", () => {
    expect(
      buildScheduleReminderEvents({
        tasks: [makeTask({ notification_enabled: false })],
        habits: [],
        dateKey: "2026-07-20",
      }),
    ).toHaveLength(0);

    expect(
      buildScheduleReminderEvents({
        tasks: [makeTask({ completed: true })],
        habits: [],
        dateKey: "2026-07-20",
      }),
    ).toHaveLength(0);
  });

  it("builds start-only habit events when scheduled that day", () => {
    // 2026-07-20 is a Monday.
    const events = buildScheduleReminderEvents({
      tasks: [],
      habits: [makeHabit({ days_of_week: ["Mon"] })],
      dateKey: "2026-07-20",
    });

    expect(events).toHaveLength(1);
    expect(events[0]?.kind).toBe("start");
    expect(events[0]?.fireAtMinutes).toBe(7 * 60);
  });
});

describe("selectDueScheduleReminderEvents", () => {
  const sample: ScheduleReminderEvent[] = [
    {
      id: "a",
      entity: "task",
      entityId: "1",
      kind: "reminder",
      fireAtMinutes: 100,
      title: "A",
      heading: "Task Reminder",
      body: "A",
    },
    {
      id: "b",
      entity: "task",
      entityId: "1",
      kind: "start",
      fireAtMinutes: 110,
      title: "A",
      heading: "Task Starting",
      body: "A",
    },
  ];

  it("fires events in (previous, current] window", () => {
    expect(
      selectDueScheduleReminderEvents(sample, 99, 100).map((e) => e.id),
    ).toEqual(["a"]);
    expect(
      selectDueScheduleReminderEvents(sample, 100, 110).map((e) => e.id),
    ).toEqual(["b"]);
  });

  it("returns nothing when the window has not advanced", () => {
    expect(selectDueScheduleReminderEvents(sample, 100, 100)).toEqual([]);
  });
});
