import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockFrom, mockRequireUserId } = vi.hoisted(() => ({
  mockFrom: vi.fn(),
  mockRequireUserId: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  supabase: { from: mockFrom },
}));

vi.mock("@/lib/auth", () => ({
  requireUserId: mockRequireUserId,
}));

import { moveTaskInBoard, type TaskDragTarget } from "@/lib/task-drag-utils";
import { persistTaskBoardDiff } from "@/lib/task-groups";
import type { Task, TaskGroupWithTasks } from "@/types/task";

const userId = "user-1";

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    title: "Move the task",
    description: null,
    scheduled_date: null,
    scheduled_time: null,
    priority: "medium",
    user_id: userId,
    group_id: "inbox-1",
    sort_order: 1,
    queue_order: null,
    duration_minutes: null,
    notification_enabled: true,
    notification_lead_minutes: null,
    completed: false,
    planning_state: "none",
    created_at: "2026-08-04T00:00:00.000Z",
    ...overrides,
  };
}

function makeGroup(
  id: string,
  title: string,
  slug: string | null,
  tasks: Task[] = [],
): TaskGroupWithTasks {
  return {
    id,
    user_id: userId,
    title,
    slug,
    sort_order: 0,
    sort_mode: "manual",
    created_at: "2026-08-04T00:00:00.000Z",
    tasks,
  };
}

describe("task planning drag projections", () => {
  it("keeps the task in its organization group while adding Today", () => {
    const task = makeTask();
    const board = [
      makeGroup("today-1", "Today", "today"),
      makeGroup("later-1", "Later", "later"),
      makeGroup("inbox-1", "Inbox", "inbox", [task]),
    ];
    const target: TaskDragTarget = {
      groupId: "today-1",
      beforeTaskId: null,
      zone: "active",
    };

    const next = moveTaskInBoard(board, task.id, target, {
      todayGroupId: "today-1",
      laterGroupId: "later-1",
      todayViewDate: "2026-08-04",
      sourceGroupId: "inbox-1",
    });

    expect(next.find((group) => group.id === "inbox-1")?.tasks).toHaveLength(1);
    expect(next.find((group) => group.id === "today-1")?.tasks).toHaveLength(1);
    expect(next.find((group) => group.id === "inbox-1")?.tasks[0]).toMatchObject({
      id: task.id,
      group_id: "inbox-1",
      scheduled_date: "2026-08-04",
      planning_state: "none",
    });
  });
});

describe("task board persistence", () => {
  beforeEach(() => {
    mockRequireUserId.mockResolvedValue(userId);
  });

  it("surfaces a failed layout write instead of claiming the drag was saved", async () => {
    const updateChain = { eq: vi.fn() };
    updateChain.eq
      .mockReturnValueOnce(updateChain)
      .mockResolvedValueOnce({
        data: null,
        error: { message: "task layout update failed" },
      });
    mockFrom.mockReturnValue({ update: vi.fn(() => updateChain) });

    const previous = [makeGroup("inbox-1", "Inbox", "inbox", [makeTask()])];
    const next = [
      makeGroup(
        "inbox-1",
        "Inbox",
        "inbox",
        [makeTask({ scheduled_date: "2026-08-04" })],
      ),
    ];

    await expect(persistTaskBoardDiff(previous, next)).rejects.toThrow(
      "task layout update failed",
    );
  });
});