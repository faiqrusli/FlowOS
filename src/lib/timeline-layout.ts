import {
  getNowMinutesInAppTimezone,
  parseTimeToMinutes,
} from "@/lib/date-utils";
import { isHabitCompletedOnDate } from "@/lib/habits";
import { isHabitScheduledOnDate } from "@/lib/habit-stats";
import { getHabitDurationMinutes as getStoredHabitDurationMinutes } from "@/lib/schedule-durations";
import { isLaterGroup, isTodayGroup, taskBelongsInLaterView } from "@/lib/task-groups";
import type { Habit } from "@/types/habit";
import type { Task, TaskGroupWithTasks } from "@/types/task";

export const TIMELINE_START_HOUR = 6;
export const TIMELINE_END_HOUR = 24;
export const TIMELINE_START_MINUTES = TIMELINE_START_HOUR * 60;
export const TIMELINE_END_MINUTES = TIMELINE_END_HOUR * 60;
/** Unscheduled click-to-place window matches the visible timeline (6 AM – midnight). */
export const TIMELINE_PLACEMENT_END_MINUTES = TIMELINE_END_MINUTES;
export const SNAP_MINUTES = 15;
export const DEFAULT_TASK_DURATION = 30;
export const DEFAULT_HABIT_DURATION = 15;
export const MIN_BLOCK_HEIGHT_PX = 34;

export type TimelineZoom = "5" | "15" | "30" | "60";
export type TimelineEntryKind = "task" | "habit";

export type ScheduledTimelineSlot = {
  id: string;
  scheduled_time: string;
  durationMinutes: number;
};

const ZOOM_HOUR_HEIGHT_PX: Record<TimelineZoom, number> = {
  "5": 288,
  "15": 96,
  "30": 64,
  "60": 40,
};

export const TIMELINE_ZOOM_OPTIONS: {
  value: TimelineZoom;
  label: string;
}[] = [
  { value: "5", label: "5 min" },
  { value: "15", label: "15 min" },
  { value: "30", label: "30 min" },
  { value: "60", label: "1 hour" },
];

export function getHourHeightPx(zoom: TimelineZoom): number {
  return ZOOM_HOUR_HEIGHT_PX[zoom];
}

export function getTimelineHeightPx(zoom: TimelineZoom): number {
  return (TIMELINE_END_HOUR - TIMELINE_START_HOUR) * getHourHeightPx(zoom);
}

export function minutesToTopPx(minutes: number, zoom: TimelineZoom): number {
  return ((minutes - TIMELINE_START_MINUTES) / 60) * getHourHeightPx(zoom);
}

export function topPxToMinutes(topPx: number, zoom: TimelineZoom): number {
  const raw =
    TIMELINE_START_MINUTES + (topPx / getHourHeightPx(zoom)) * 60;
  return snapTimelineMinutes(raw);
}

export function snapTimelineMinutes(minutes: number): number {
  const snapped = Math.round(minutes / SNAP_MINUTES) * SNAP_MINUTES;
  return Math.max(
    TIMELINE_START_MINUTES,
    Math.min(TIMELINE_END_MINUTES - SNAP_MINUTES, snapped)
  );
}

export function minutesToTimeString(minutes: number): string {
  const clamped = Math.max(0, Math.min(23 * 60 + 59, minutes));
  const hours = Math.floor(clamped / 60);
  const mins = clamped % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function getTaskDurationMinutes(task: Task): number {
  return task.duration_minutes ?? DEFAULT_TASK_DURATION;
}

export function getHabitDurationMinutes(habitId: string): number {
  return getStoredHabitDurationMinutes(habitId);
}

export function filterHabitsForViewDate(
  habits: Habit[],
  viewDate: string
): Habit[] {
  return habits.filter((habit) => isHabitScheduledOnDate(habit, viewDate));
}

export function isHabitDoneOnDate(habit: Habit, viewDate: string): boolean {
  return isHabitCompletedOnDate(habit, viewDate);
}

export function buildScheduledSlots(
  tasks: Task[],
  habits: Habit[] = []
): ScheduledTimelineSlot[] {
  const slots: ScheduledTimelineSlot[] = [];

  for (const task of tasks) {
    if (!task.scheduled_time) continue;
    slots.push({
      id: task.id,
      scheduled_time: task.scheduled_time,
      durationMinutes: getTaskDurationMinutes(task),
    });
  }

  for (const habit of habits) {
    if (!habit.scheduled_time) continue;
    slots.push({
      id: habit.id,
      scheduled_time: habit.scheduled_time,
      durationMinutes: getHabitDurationMinutes(habit.id),
    });
  }

  return slots.sort((a, b) =>
    a.scheduled_time.localeCompare(b.scheduled_time)
  );
}

export function buildTimelineHourLabels(): { hour: number; label: string }[] {
  const labels: { hour: number; label: string }[] = [];
  for (let hour = TIMELINE_START_HOUR; hour < TIMELINE_END_HOUR; hour++) {
    const period = hour >= 12 ? "PM" : "AM";
    const display = hour % 12 === 0 ? 12 : hour % 12;
    labels.push({ hour, label: `${display} ${period}` });
  }
  return labels;
}

function isValidPlacementStart(
  start: number,
  durationMinutes: number,
  scheduledSlots: ScheduledTimelineSlot[]
): boolean {
  if (start < TIMELINE_START_MINUTES) return false;
  if (start + durationMinutes > TIMELINE_PLACEMENT_END_MINUTES) return false;

  for (const slot of scheduledSlots) {
    const slotStart = parseTimeToMinutes(slot.scheduled_time);
    const slotEnd = slotStart + slot.durationMinutes;
    if (start < slotEnd && start + durationMinutes > slotStart) {
      return false;
    }
  }

  return true;
}

function findGapContainingMinutes(
  minutes: number,
  durationMinutes: number,
  scheduledSlots: ScheduledTimelineSlot[]
): { start: number; end: number } | null {
  const ranges = scheduledSlots
    .map((slot) => ({
      start: parseTimeToMinutes(slot.scheduled_time),
      end: parseTimeToMinutes(slot.scheduled_time) + slot.durationMinutes,
    }))
    .sort((a, b) => a.start - b.start);

  let gapStart = TIMELINE_START_MINUTES;

  for (const range of ranges) {
    const gapEnd = Math.min(range.start, TIMELINE_PLACEMENT_END_MINUTES);
    if (minutes >= gapStart && minutes < gapEnd) {
      return gapEnd - gapStart >= durationMinutes
        ? { start: gapStart, end: gapEnd }
        : null;
    }
    gapStart = Math.max(gapStart, range.end);
  }

  const tailEnd = TIMELINE_PLACEMENT_END_MINUTES;
  if (minutes >= gapStart && minutes < tailEnd) {
    return tailEnd - gapStart >= durationMinutes
      ? { start: gapStart, end: tailEnd }
      : null;
  }

  return null;
}

/** Best valid placement for cursor Y — fits inside the gap under the pointer. */
export function resolvePlacementStartMinutes(
  rawMinutes: number,
  durationMinutes: number,
  scheduledSlots: ScheduledTimelineSlot[]
): number | null {
  const snapped = snapTimelineMinutes(rawMinutes);

  if (isValidPlacementStart(snapped, durationMinutes, scheduledSlots)) {
    return snapped;
  }

  const gap = findGapContainingMinutes(rawMinutes, durationMinutes, scheduledSlots);
  if (!gap) return null;

  let bestStart: number | null = null;
  let bestDistance = Infinity;

  for (
    let candidate = snapTimelineMinutes(gap.start);
    candidate + durationMinutes <= gap.end;
    candidate += SNAP_MINUTES
  ) {
    if (!isValidPlacementStart(candidate, durationMinutes, scheduledSlots)) {
      continue;
    }

    const distance = Math.abs(candidate - rawMinutes);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestStart = candidate;
    }
  }

  return bestStart;
}

export function getNowLineTopPx(
  zoom: TimelineZoom,
  nowMinutes = getNowMinutesInAppTimezone()
): number | null {
  if (
    nowMinutes < TIMELINE_START_MINUTES ||
    nowMinutes > TIMELINE_END_MINUTES
  ) {
    return null;
  }
  return minutesToTopPx(nowMinutes, zoom);
}

export type TimelineBlock = {
  kind: TimelineEntryKind;
  id: string;
  task?: Task;
  habit?: Habit;
  topPx: number;
  heightPx: number;
  startMinutes: number;
  endMinutes: number;
};

function buildTaskTimelineBlocks(
  tasks: Task[],
  zoom: TimelineZoom
): TimelineBlock[] {
  return tasks
    .filter((task) => task.scheduled_date && task.scheduled_time)
    .map((task) => {
      const startMinutes = parseTimeToMinutes(task.scheduled_time);
      const duration = getTaskDurationMinutes(task);
      const heightPx = Math.max(
        MIN_BLOCK_HEIGHT_PX,
        (duration / 60) * getHourHeightPx(zoom)
      );
      return {
        kind: "task" as const,
        id: task.id,
        task,
        topPx: minutesToTopPx(startMinutes, zoom),
        heightPx,
        startMinutes,
        endMinutes: startMinutes + duration,
      };
    });
}

function buildHabitTimelineBlocks(
  habits: Habit[],
  zoom: TimelineZoom
): TimelineBlock[] {
  return habits
    .filter((habit) => habit.scheduled_time)
    .map((habit) => {
      const startMinutes = parseTimeToMinutes(habit.scheduled_time);
      const duration = getHabitDurationMinutes(habit.id);
      const heightPx = Math.max(
        MIN_BLOCK_HEIGHT_PX,
        (duration / 60) * getHourHeightPx(zoom)
      );
      return {
        kind: "habit" as const,
        id: habit.id,
        habit,
        topPx: minutesToTopPx(startMinutes, zoom),
        heightPx,
        startMinutes,
        endMinutes: startMinutes + duration,
      };
    });
}

export function buildTimelineBlocks(
  tasks: Task[],
  zoom: TimelineZoom,
  habits: Habit[] = []
): TimelineBlock[] {
  return [...buildTaskTimelineBlocks(tasks, zoom), ...buildHabitTimelineBlocks(habits, zoom)].sort(
    (a, b) => a.startMinutes - b.startMinutes
  );
}

export function findOverlappingEntryIds(blocks: TimelineBlock[]): Set<string> {
  const overlapping = new Set<string>();

  for (let i = 0; i < blocks.length; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      const a = blocks[i];
      const b = blocks[j];
      if (a.startMinutes < b.endMinutes && b.startMinutes < a.endMinutes) {
        overlapping.add(a.id);
        overlapping.add(b.id);
      }
    }
  }

  return overlapping;
}

/** @deprecated Use findOverlappingEntryIds */
export function findOverlappingTaskIds(blocks: TimelineBlock[]): Set<string> {
  return findOverlappingEntryIds(blocks);
}

export function resolveDropStartMinutes(
  rawMinutes: number,
  scheduledSlots: ScheduledTimelineSlot[],
  excludeId: string | null,
  durationMinutes: number
): number {
  let start = snapTimelineMinutes(rawMinutes);

  const ranges = scheduledSlots
    .filter((slot) => slot.id !== excludeId)
    .map((slot) => ({
      start: parseTimeToMinutes(slot.scheduled_time),
      end: parseTimeToMinutes(slot.scheduled_time) + slot.durationMinutes,
    }))
    .sort((a, b) => a.start - b.start);

  for (const range of ranges) {
    if (start >= range.start && start < range.end) {
      start = range.end;
    } else if (start < range.end && start + durationMinutes > range.start) {
      start = range.end;
    }
  }

  return snapTimelineMinutes(
    Math.min(start, TIMELINE_END_MINUTES - durationMinutes)
  );
}

export function collectTasksForViewDate(
  groups: TaskGroupWithTasks[],
  viewDate: string
): Task[] {
  const tasksById = new Map<string, Task>();

  for (const group of groups) {
    if (isTodayGroup(group)) continue;
    for (const task of group.tasks) {
      if (task.scheduled_date === viewDate) {
        tasksById.set(task.id, task);
      }
    }
  }

  const todayGroup = groups.find(isTodayGroup);
  if (todayGroup) {
    for (const task of todayGroup.tasks) {
      if (task.scheduled_date === viewDate && !tasksById.has(task.id)) {
        tasksById.set(task.id, task);
      }
    }
  }

  return [...tasksById.values()];
}

export function collectPoolGroups(
  groups: TaskGroupWithTasks[]
): TaskGroupWithTasks[] {
  return groups.filter((group) => !isTodayGroup(group) && !isLaterGroup(group));
}

export function collectAllBoardTasks(
  groups: TaskGroupWithTasks[]
): Task[] {
  const tasksById = new Map<string, Task>();

  for (const group of groups) {
    if (isTodayGroup(group)) continue;
    for (const task of group.tasks) {
      tasksById.set(task.id, task);
    }
  }

  const todayGroup = groups.find(isTodayGroup);
  if (todayGroup) {
    for (const task of todayGroup.tasks) {
      if (!tasksById.has(task.id)) {
        tasksById.set(task.id, task);
      }
    }
  }

  return [...tasksById.values()];
}

export function filterUnscheduledTasksForDay(
  tasks: Task[],
  viewDate: string
): Task[] {
  return tasks
    .filter(
      (task) =>
        !task.completed &&
        !taskBelongsInLaterView(task) &&
        task.scheduled_date === viewDate &&
        !task.scheduled_time
    )
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function filterUnscheduledTasksOther(
  tasks: Task[],
  viewDate: string
): Task[] {
  return tasks
    .filter(
      (task) =>
        !task.completed &&
        !task.scheduled_time &&
        task.scheduled_date !== viewDate
    )
    .sort((a, b) => a.title.localeCompare(b.title));
}
