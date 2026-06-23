import { getNowMinutesInAppTimezone, parseTimeToMinutes } from "@/lib/date-utils";
import type { ScheduleItem, ScheduleItemType } from "@/types/schedule";
import type { Habit } from "@/types/habit";
import type { Task } from "@/types/task";

export const SCHEDULE_START_HOUR = 6;
export const SCHEDULE_END_HOUR = 24;
export const HOUR_HEIGHT_PX = 64;
export const SNAP_MINUTES = 15;
export const TIMELINE_START_MINUTES = SCHEDULE_START_HOUR * 60;
export const TIMELINE_END_MINUTES = SCHEDULE_END_HOUR * 60;
export const TIMELINE_HEIGHT_PX =
  ((SCHEDULE_END_HOUR - SCHEDULE_START_HOUR) * HOUR_HEIGHT_PX);

export type ScheduleKpis = {
  scheduledToday: number;
  unscheduled: number;
  tasksDone: string;
  tasksDonePercent: number;
  onTrackPercent: number;
};

export type ScheduleBlockLayout = {
  item: ScheduleItem;
  topPx: number;
  heightPx: number;
  durationMinutes: number;
  variant: "habit" | "task" | "focus";
};

export function getBlockHeightPx(
  item: ScheduleItem,
  durationMinutes: number
): number {
  if (item.type === "habit") {
    return HABIT_HEIGHT_PX;
  }

  const raw = (durationMinutes / 60) * HOUR_HEIGHT_PX;
  if (item.type === "focus") {
    return Math.max(FOCUS_HEIGHT_MIN, raw);
  }

  return Math.max(TASK_HEIGHT_MIN, raw);
}

export type ScheduleTypeStyle = {
  block: string;
  badge: string;
  bell: string;
  dot: string;
};

export const SCHEDULE_TYPE_STYLES: Record<ScheduleItemType, ScheduleTypeStyle> = {
  task: {
    block: "border-blue-400/50 bg-blue-500/10",
    badge: "bg-blue-500/15 text-blue-700",
    bell: "text-blue-600 hover:bg-blue-500/10",
    dot: "bg-blue-500",
  },
  habit: {
    block: "border-orange-400/50 bg-orange-500/10",
    badge: "bg-orange-500/15 text-orange-800",
    bell: "text-orange-600 hover:bg-orange-500/10",
    dot: "bg-orange-500",
  },
  focus: {
    block: "border-violet-400/50 bg-violet-500/10",
    badge: "bg-violet-500/15 text-violet-800",
    bell: "text-violet-600 hover:bg-violet-500/10",
    dot: "bg-violet-500",
  },
};

const DEFAULT_DURATIONS: Record<ScheduleItemType, number> = {
  task: 45,
  habit: 15,
  focus: 50,
};

const TASK_HEIGHT_MIN = 36;
const HABIT_HEIGHT_PX = 28;
const FOCUS_HEIGHT_MIN = 48;

export function minutesToTimeString(minutes: number): string {
  const clamped = Math.max(0, Math.min(23 * 60 + 59, minutes));
  const hours = Math.floor(clamped / 60);
  const mins = clamped % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function snapToScheduleGrid(minutes: number): number {
  const snapped =
    Math.round(minutes / SNAP_MINUTES) * SNAP_MINUTES;
  return Math.max(
    TIMELINE_START_MINUTES,
    Math.min(TIMELINE_END_MINUTES - SNAP_MINUTES, snapped)
  );
}

export function minutesToTopPx(minutes: number): number {
  return ((minutes - TIMELINE_START_MINUTES) / 60) * HOUR_HEIGHT_PX;
}

export function topPxToMinutes(topPx: number): number {
  const raw =
    TIMELINE_START_MINUTES + (topPx / HOUR_HEIGHT_PX) * 60;
  return snapToScheduleGrid(raw);
}

export function getItemDurationMinutes(item: ScheduleItem): number {
  if (item.durationMinutes) return item.durationMinutes;
  if (item.timeEndSort !== undefined && item.timeSort < item.timeEndSort) {
    return Math.max(SNAP_MINUTES, item.timeEndSort - item.timeSort);
  }
  return DEFAULT_DURATIONS[item.type];
}

export function formatDurationLabel(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function buildScheduleBlockLayouts(
  items: ScheduleItem[]
): ScheduleBlockLayout[] {
  return items
    .filter((item) => item.timeSort < Number.MAX_SAFE_INTEGER)
    .map((item) => {
      const durationMinutes = getItemDurationMinutes(item);
      const variant =
        item.type === "habit"
          ? "habit"
          : item.type === "focus"
            ? "focus"
            : "task";

      return {
        item,
        topPx: minutesToTopPx(item.timeSort),
        heightPx: getBlockHeightPx(item, durationMinutes),
        durationMinutes,
        variant,
      };
    });
}

export function computeScheduleKpis(
  tasks: Task[],
  habits: Habit[],
  items: ScheduleItem[]
): ScheduleKpis {
  const scheduledToday = items.filter(
    (item) => item.timeSort < Number.MAX_SAFE_INTEGER
  ).length;
  const unscheduledTasks = tasks.filter((task) => !task.scheduled_time).length;
  const unscheduledHabits = habits.filter((habit) => !habit.scheduled_time).length;
  const tasksCompleted = tasks.filter((task) => task.completed).length;
  const completable = tasks.length + habits.length;
  const completed = tasksCompleted + habits.filter((h) => h.completed).length;
  const onTrackPercent =
    completable === 0 ? 0 : Math.round((completed / completable) * 100);

  return {
    scheduledToday,
    unscheduled: unscheduledTasks + unscheduledHabits,
    tasksDone: `${tasksCompleted}/${tasks.length}`,
    tasksDonePercent:
      tasks.length === 0
        ? 0
        : Math.round((tasksCompleted / tasks.length) * 100),
    onTrackPercent,
  };
}

export function buildHourLabels(): string[] {
  const labels: string[] = [];
  for (let hour = SCHEDULE_START_HOUR; hour <= SCHEDULE_END_HOUR; hour++) {
    if (hour === 24) {
      labels.push("12 AM");
      continue;
    }
    const period = hour >= 12 ? "PM" : "AM";
    const display = hour % 12 === 0 ? 12 : hour % 12;
    labels.push(`${display} ${period}`);
  }
  return labels;
}

export function getNowLineTopPx(nowMinutes = getNowMinutesInAppTimezone()): number | null {
  if (
    nowMinutes < TIMELINE_START_MINUTES ||
    nowMinutes > TIMELINE_END_MINUTES
  ) {
    return null;
  }
  return minutesToTopPx(nowMinutes);
}

export function isScheduledTask(task: Task): boolean {
  return Boolean(task.scheduled_time);
}

export function isScheduledHabit(habit: Habit): boolean {
  return Boolean(habit.scheduled_time);
}

export function taskSortMinutes(task: Task): number {
  return parseTimeToMinutes(task.scheduled_time);
}
