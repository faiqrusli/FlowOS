import { getNowMinutesInAppTimezone } from "@/lib/date-utils";
import {
  getItemDurationMinutes,
  minutesToTopPx,
  getBlockHeightPx,
  TIMELINE_START_MINUTES,
} from "@/lib/schedule-layout";
import type { ScheduleBlockLayout } from "@/lib/schedule-layout";
import type { ScheduleItem } from "@/types/schedule";

export type ProjectionLayout = ScheduleBlockLayout & {
  isProjection: true;
};

export function buildProjectionLayouts(
  scheduledItems: ScheduleItem[],
  unscheduledItems: ScheduleItem[]
): ProjectionLayout[] {
  if (unscheduledItems.length === 0) return [];

  const scheduled = scheduledItems
    .filter((item) => item.timeSort < Number.MAX_SAFE_INTEGER)
    .sort((a, b) => a.timeSort - b.timeSort);

  let cursor = Math.max(
    TIMELINE_START_MINUTES,
    getNowMinutesInAppTimezone()
  );

  if (scheduled.length > 0) {
    const last = scheduled[scheduled.length - 1];
    const lastEnd =
      last.timeSort + getItemDurationMinutes(last);
    cursor = Math.max(cursor, lastEnd);
  }

  const projections: ProjectionLayout[] = [];

  for (const item of unscheduledItems) {
    const durationMinutes = getItemDurationMinutes(item);
    const layout: ProjectionLayout = {
      item: {
        ...item,
        timeSort: cursor,
        timeEndSort: cursor + durationMinutes,
      },
      topPx: minutesToTopPx(cursor),
      heightPx: getBlockHeightPx(item, durationMinutes),
      durationMinutes,
      variant: item.type === "habit" ? "habit" : item.type === "focus" ? "focus" : "task",
      isProjection: true,
    };

    projections.push(layout);
    cursor += durationMinutes;
  }

  return projections;
}
