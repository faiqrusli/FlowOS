import { describe, expect, it } from "vitest";
import {
  beginTaskOperation,
  buildCompleteTaskUpdate,
  buildDeferTaskUpdate,
  buildRestoreTaskUpdate,
  buildWithdrawTaskUpdate,
  createIdleTaskOperationState,
  failTaskOperation,
  getTaskRecordState,
  selectTaskForFocus,
  confirmTaskOperation,
} from "@/lib/task-core-loop";
import type { Task } from "@/types/task";

const baseTask = {
  id: "task-1",
  title: "Write the brief",
  description: null,
  scheduled_date: "2026-08-05",
  scheduled_time: null,
  priority: "medium" as const,
  user_id: "user-1",
  group_id: null,
  sort_order: 1,
  queue_order: null,
  duration_minutes: null,
  notification_enabled: true,
  notification_lead_minutes: null,
  completed: false,
  planning_state: "none" as const,
  withdrawn_at: null,
  created_at: "2026-08-05T00:00:00.000Z",
  updated_at: "2026-08-05T00:00:00.000Z",
  completed_at: null,
} satisfies Task;

describe("task core-loop state", () => {
  it("keeps task states distinct", () => {
    expect(getTaskRecordState(baseTask)).toBe("open");
    expect(getTaskRecordState({ ...baseTask, planning_state: "later" })).toBe("deferred");
    expect(getTaskRecordState({ ...baseTask, completed: true })).toBe("completed");
    expect(getTaskRecordState({ ...baseTask, withdrawn_at: "2026-08-05T01:00:00.000Z" })).toBe("withdrawn");
  });

  it("preserves the confirmed task while an operation is pending or failed", () => {
    const pending = beginTaskOperation(
      createIdleTaskOperationState(),
      "revise",
      baseTask,
      { ...baseTask, title: "New title" },
    );
    const failed = failTaskOperation(pending, "The revision was not confirmed.");

    expect(pending.phase).toBe("pending");
    expect(pending.confirmedTask?.title).toBe("Write the brief");
    expect(failed.phase).toBe("failed");
    expect(failed.confirmedTask?.title).toBe("Write the brief");
    expect(failed.errorMessage).toContain("not confirmed");
  });

  it("moves the confirmed owner state only after confirmation", () => {
    const pending = beginTaskOperation(
      createIdleTaskOperationState(),
      "complete",
      baseTask,
      { ...baseTask, ...buildCompleteTaskUpdate("2026-08-05T01:00:00.000Z") },
    );
    const confirmed = confirmTaskOperation(pending, pending.requestedTask);

    expect(confirmed.phase).toBe("confirmed");
    expect(confirmed.confirmedTask?.completed).toBe(true);
    expect(confirmed.requestedTask).toBeNull();
  });

  it("expresses owner lifecycle operations without collapsing their meaning", () => {
    expect(buildCompleteTaskUpdate("2026-08-05T01:00:00.000Z")).toEqual({
      completed: true,
      completed_at: "2026-08-05T01:00:00.000Z",
    });
    expect(buildDeferTaskUpdate()).toMatchObject({
      planning_state: "later",
      scheduled_date: null,
      scheduled_time: null,
    });
    expect(buildWithdrawTaskUpdate("2026-08-05T01:00:00.000Z")).toMatchObject({
      withdrawn_at: "2026-08-05T01:00:00.000Z",
      queue_order: null,
    });
    expect(buildRestoreTaskUpdate()).toMatchObject({
      completed: false,
      withdrawn_at: null,
    });
  });

  it("passes Focus a planned selection without changing task state", () => {
    expect(selectTaskForFocus(baseTask)).toEqual({
      taskId: "task-1",
      label: "Write the brief",
      meaning: "planned",
      taskStateUnchanged: true,
    });
  });
});

