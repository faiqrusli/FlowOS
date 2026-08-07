import { describe, expect, it } from "vitest";
import {
  aggregateTodayFocusedTaskRows,
  selectContinueTasks,
} from "@/lib/focus-continue";
import type { Task } from "@/types/task";

function makeTask(partial: Partial<Task> & Pick<Task, "id" | "title">): Task {
  return {
    ...partial,
    user_id: partial.user_id ?? null,
<<<<<<< HEAD
    group_id: partial.group_id ?? "g1",
    completed: partial.completed ?? false,
    description: partial.description ?? null,
    priority: partial.priority ?? "low",
    scheduled_date: partial.scheduled_date ?? "2026-07-17",
    scheduled_time: partial.scheduled_time ?? null,
    queue_order: partial.queue_order ?? null,
    duration_minutes: partial.duration_minutes ?? null,
    notification_enabled: partial.notification_enabled ?? true,
    notification_lead_minutes: partial.notification_lead_minutes ?? null,
    planning_state: partial.planning_state ?? "none",
    sort_order: partial.sort_order ?? 0,
    created_at: partial.created_at ?? "2026-07-17T00:00:00.000Z",
    updated_at: partial.updated_at ?? "2026-07-17T00:00:00.000Z",
=======
    queue_order: partial.queue_order ?? null,
    notification_enabled: partial.notification_enabled ?? true,
    notification_lead_minutes: partial.notification_lead_minutes ?? null,
    planning_state: partial.planning_state ?? "none",
>>>>>>> feature/reflection
  };
}

describe("focus-continue", () => {
  it("aggregates today's focus rows and keeps latest timestamp", () => {
    const rows = aggregateTodayFocusedTaskRows(
      [
        {
          task_id: "a",
          focused_seconds: 60,
          updated_at: "2026-07-17T02:00:00.000Z",
        },
        {
          task_id: "a",
          focused_seconds: 30,
          updated_at: "2026-07-17T04:00:00.000Z",
        },
        {
          task_id: "b",
          focused_seconds: 10,
          updated_at: "2026-07-16T04:00:00.000Z",
        },
      ],
      "2026-07-17"
    );

    expect(rows).toEqual([
      {
        taskId: "a",
        focusedSeconds: 90,
        lastFocusedAt: "2026-07-17T04:00:00.000Z",
      },
    ]);
  });

  it("selects unfinished focused tasks excluding now and queue", () => {
    const tasks = [
      makeTask({ id: "now", title: "Now" }),
      makeTask({ id: "queued", title: "Queued" }),
      makeTask({ id: "done", title: "Done", completed: true }),
      makeTask({ id: "old", title: "Older" }),
      makeTask({ id: "recent", title: "Recent" }),
    ];

    const selected = selectContinueTasks({
      tasks,
      focusedToday: [
        {
          taskId: "now",
          focusedSeconds: 20,
          lastFocusedAt: "2026-07-17T05:00:00.000Z",
        },
        {
          taskId: "queued",
          focusedSeconds: 20,
          lastFocusedAt: "2026-07-17T04:30:00.000Z",
        },
        {
          taskId: "done",
          focusedSeconds: 20,
          lastFocusedAt: "2026-07-17T04:00:00.000Z",
        },
        {
          taskId: "recent",
          focusedSeconds: 20,
          lastFocusedAt: "2026-07-17T03:00:00.000Z",
        },
        {
          taskId: "old",
          focusedSeconds: 20,
          lastFocusedAt: "2026-07-17T01:00:00.000Z",
        },
      ],
      nowTaskId: "now",
      nextUpTaskIds: ["queued"],
    });

    expect(selected.map((task) => task.id)).toEqual(["recent", "old"]);
  });
});
