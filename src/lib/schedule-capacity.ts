import { getItemDurationMinutes, TIMELINE_END_MINUTES } from "@/lib/schedule-layout";
import type { ScheduleItem } from "@/types/schedule";

export const DEFAULT_WORKDAY_HOURS = 8;
export const DEFAULT_SHUTDOWN_MINUTES = 18 * 60; // 6 PM

export type ScheduleCapacity = {
  plannedMinutes: number;
  plannedLabel: string;
  capacityMinutes: number;
  capacityLabel: string;
  loadPercent: number;
  isOverloaded: boolean;
  scheduledCount: number;
  completedCount: number;
};

export function formatHoursMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function computeScheduleCapacity(
  items: ScheduleItem[],
  capacityHours = DEFAULT_WORKDAY_HOURS
): ScheduleCapacity {
  const scheduled = items.filter(
    (item) => item.timeSort < Number.MAX_SAFE_INTEGER
  );
  const plannedMinutes = scheduled.reduce(
    (sum, item) => sum + getItemDurationMinutes(item),
    0
  );
  const capacityMinutes = capacityHours * 60;
  const loadPercent =
    capacityMinutes === 0
      ? 0
      : Math.min(150, Math.round((plannedMinutes / capacityMinutes) * 100));

  return {
    plannedMinutes,
    plannedLabel: formatHoursMinutes(plannedMinutes),
    capacityMinutes,
    capacityLabel: `${capacityHours}h`,
    loadPercent,
    isOverloaded: plannedMinutes > capacityMinutes,
    scheduledCount: scheduled.length,
    completedCount: scheduled.filter((item) => item.completed).length,
  };
}

export function getShutdownTopPercent(
  shutdownMinutes = DEFAULT_SHUTDOWN_MINUTES
): number {
  const start = 6 * 60;
  const total = TIMELINE_END_MINUTES - start;
  return ((shutdownMinutes - start) / total) * 100;
}
