import { describe, expect, it } from "vitest";
import {
  applyLiveBoardReorderIfChanged,
  shouldPreviewLiveBoardReorder,
} from "@/lib/dnd/live-board-reorder";
import type { TaskGroupWithTasks } from "@/types/task";

function makeTask(
  id: string,
  groupId: string,
  sortOrder: number,
): TaskGroupWithTasks["tasks"][number] {
  return {
    id,
    title: id,
    description: null,
    scheduled_date: null,
    scheduled_time: null,
    priority: null,
    user_id: "user-1",
    group_id: groupId,
    sort_order: sortOrder,
    queue_order: null,
    duration_minutes: null,
    notification_enabled: false,
    notification_lead_minutes: null,
    completed: false,
    planning_state: "none",
    created_at: "2026-01-01T00:00:00.000Z",
  };
}

function makeBoard(): TaskGroupWithTasks[] {
  return [
    {
      id: "source",
      user_id: "user-1",
      title: "Source",
      slug: "source",
      sort_order: 0,
      created_at: "2026-01-01T00:00:00.000Z",
      tasks: [makeTask("moving", "source", 0)],
    },
    {
      id: "destination",
      user_id: "user-1",
      title: "Destination",
      slug: "destination",
      sort_order: 1,
      created_at: "2026-01-01T00:00:00.000Z",
      tasks: [makeTask("existing", "destination", 0)],
    },
  ];
}

function makeSameGroupBoard(
  overrides: Partial<
    Pick<TaskGroupWithTasks, "slug" | "title" | "sort_mode">
  > = {},
): TaskGroupWithTasks[] {
  return [
    {
      id: "source",
      user_id: "user-1",
      title: "Source",
      slug: "source",
      sort_order: 0,
      sort_mode: "manual",
      created_at: "2026-01-01T00:00:00.000Z",
      tasks: [makeTask("existing", "source", 0), makeTask("moving", "source", 1)],
      ...overrides,
    },
  ];
}

function makeManualSameGroupBoard(): TaskGroupWithTasks[] {
  return makeSameGroupBoard();
}

const destinationTarget = {
  groupId: "destination",
  beforeTaskId: "existing",
  zone: "active" as const,
  showInsertionLine: true,
};

describe("live board reorder", () => {
  it("enables a valid same-group manual preview", () => {
    expect(
      shouldPreviewLiveBoardReorder(
        makeManualSameGroupBoard(),
        {
          groupId: "source",
          beforeTaskId: "existing",
          zone: "active",
          showInsertionLine: true,
        },
        "moving",
        "source",
      ),
    ).toBe(true);
  });

  it("enables a valid cross-group active preview", () => {
    expect(
      shouldPreviewLiveBoardReorder(
        makeBoard(),
        destinationTarget,
        "moving",
        "source",
      ),
    ).toBe(true);
  });

  it.each([
    ["sorted", { sort_mode: "priority" as const }],
    ["Today", { slug: "today", title: "Today" }],
    ["Later/planning", { slug: "later", title: "Later" }],
  ])("does not enable same-group live preview for %s destinations", (_, overrides) => {
    expect(
      shouldPreviewLiveBoardReorder(
        makeSameGroupBoard(overrides),
        {
          groupId: "source",
          beforeTaskId: "existing",
          zone: "active",
          showInsertionLine: true,
        },
        "moving",
        "source",
      ),
    ).toBe(false);
  });

  it("does not enable live preview for a completed destination", () => {
    expect(
      shouldPreviewLiveBoardReorder(
        makeManualSameGroupBoard(),
        {
          groupId: "source",
          beforeTaskId: null,
          zone: "completed",
          showInsertionLine: false,
        },
        "moving",
        "source",
      ),
    ).toBe(false);
  });

  it("moves a same-group manual task in the live preview", () => {
    const result = applyLiveBoardReorderIfChanged(
      makeManualSameGroupBoard(),
      {
        groupId: "source",
        beforeTaskId: "existing",
        zone: "active",
        showInsertionLine: true,
      },
      "moving",
      "source",
      null,
      {},
    );

    expect(result?.board[0].tasks.map((task) => task.id)).toEqual([
      "moving",
      "existing",
    ]);
  });

  it("moves the task into the preview destination without persisting it", () => {
    const result = applyLiveBoardReorderIfChanged(
      makeBoard(),
      destinationTarget,
      "moving",
      "source",
      null,
      {},
    );

    expect(result?.sourceGroupId).toBe("source");
    expect(result?.board[0].tasks).toHaveLength(0);
    expect(result?.board[1].tasks.map((task) => task.id)).toEqual([
      "moving",
      "existing",
    ]);
  });

  it("does not apply the same target more than once", () => {
    const target = {
      groupId: "source",
      beforeTaskId: "existing",
      zone: "active" as const,
      showInsertionLine: true,
    };

    expect(
      applyLiveBoardReorderIfChanged(
        makeManualSameGroupBoard(),
        target,
        "moving",
        "source",
        target,
        {},
      ),
    ).toBeNull();
  });
});