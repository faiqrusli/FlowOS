import { describe, expect, it } from "vitest";
import {
  buildTimelineBlocks,
  findOverlappingEntryIds,
  minutesToTopPx,
  TIMELINE_START_MINUTES,
} from "@/lib/timeline-layout";
import type { Task } from "@/types/task";

const ZOOM = "10" as const;

function makeTask(scheduledTime: string, id = "task-1"): Task {
  return {
    id,
    title: "Scheduled task",
    description: null,
    scheduled_date: "2026-08-06",
    scheduled_time: scheduledTime,
    priority: "low",
    user_id: null,
    group_id: null,
    sort_order: 1,
    queue_order: null,
    duration_minutes: 15,
    notification_enabled: false,
    notification_lead_minutes: null,
    completed: false,
    planning_state: "none",
    created_at: "2026-08-06T00:00:00.000Z",
  };
}

describe("timeline block bounds", () => {
  it.each([
    ["05:59:00", TIMELINE_START_MINUTES],
    ["00:00:00", TIMELINE_START_MINUTES],
    ["06:00:00", TIMELINE_START_MINUTES],
    ["09:30:00", 570],
  ])("normalizes %s to a visible timeline position", (time, expectedStart) => {
    const [block] = buildTimelineBlocks([makeTask(time)], ZOOM);

    expect(block.startMinutes).toBe(expectedStart);
    expect(block.topPx).toBe(minutesToTopPx(expectedStart, ZOOM));
    expect(block.topPx).toBeGreaterThanOrEqual(0);
    expect(block.endMinutes).toBe(expectedStart + 15);
  });

  it("uses the normalized start for overlap calculations", () => {
    const blocks = buildTimelineBlocks(
      [makeTask("05:59:00", "early"), makeTask("06:00:00", "boundary")],
      ZOOM,
    );

    expect(blocks.map((block) => block.startMinutes)).toEqual([
      TIMELINE_START_MINUTES,
      TIMELINE_START_MINUTES,
    ]);
    expect(findOverlappingEntryIds(blocks)).toEqual(
      new Set(["early", "boundary"]),
    );
  });
});
