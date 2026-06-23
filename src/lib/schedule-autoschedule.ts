import { getNowMinutesInAppTimezone } from "@/lib/date-utils";
import { getItemDurationMinutes } from "@/lib/schedule-layout";
import {
  SNAP_MINUTES,
  TIMELINE_END_MINUTES,
  TIMELINE_START_MINUTES,
} from "@/lib/schedule-layout";
import type { ScheduleItem } from "@/types/schedule";

type TimeRange = { start: number; end: number };

function getOccupiedRanges(items: ScheduleItem[]): TimeRange[] {
  return items
    .filter((item) => item.timeSort < Number.MAX_SAFE_INTEGER)
    .map((item) => {
      const duration = getItemDurationMinutes(item);
      return {
        start: item.timeSort,
        end: Math.min(TIMELINE_END_MINUTES, item.timeSort + duration),
      };
    })
    .sort((a, b) => a.start - b.start);
}

export function findNextAvailableSlot(
  items: ScheduleItem[],
  durationMinutes: number,
  searchFrom?: number
): number | null {
  const from = Math.max(
    TIMELINE_START_MINUTES,
    searchFrom ?? getNowMinutesInAppTimezone()
  );
  const occupied = getOccupiedRanges(items);
  let cursor = snapToGrid(from);

  for (const block of occupied) {
    if (cursor + durationMinutes <= block.start) {
      return cursor;
    }
    if (block.end > cursor) {
      cursor = snapToGrid(block.end);
    }
  }

  if (cursor + durationMinutes <= TIMELINE_END_MINUTES) {
    return cursor;
  }

  return null;
}

function snapToGrid(minutes: number): number {
  return Math.max(
    TIMELINE_START_MINUTES,
    Math.min(
      TIMELINE_END_MINUTES - SNAP_MINUTES,
      Math.round(minutes / SNAP_MINUTES) * SNAP_MINUTES
    )
  );
}

export type AutoscheduleCandidate = {
  type: "task" | "habit";
  entityId: string;
  durationMinutes: number;
};

export function planAutoscheduleSlots(
  items: ScheduleItem[],
  candidates: AutoscheduleCandidate[],
  searchFrom?: number
): { type: "task" | "habit"; entityId: string; minutes: number }[] {
  const workingItems = [...items];
  const results: { type: "task" | "habit"; entityId: string; minutes: number }[] =
    [];
  let cursor = searchFrom;

  for (const candidate of candidates) {
    const slot = findNextAvailableSlot(
      workingItems,
      candidate.durationMinutes,
      cursor
    );
    if (slot === null) break;

    results.push({
      type: candidate.type,
      entityId: candidate.entityId,
      minutes: slot,
    });

    workingItems.push({
      id: `temp-${candidate.entityId}`,
      entityId: candidate.entityId,
      title: "",
      type: candidate.type,
      time: null,
      timeSort: slot,
      timeEndSort: slot + candidate.durationMinutes,
      completed: false,
      href: "",
      durationMinutes: candidate.durationMinutes,
    });

    cursor = slot + candidate.durationMinutes;
  }

  return results;
}
