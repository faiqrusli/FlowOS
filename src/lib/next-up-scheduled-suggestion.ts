import {
  getNowMinutesInAppTimezone,
  getTodayDateString,
  parseTimeToMinutes,
} from "@/lib/date-utils";
import { getHabitDurationMinutes, getTaskDurationMinutes } from "@/lib/schedule-durations";
import type { FocusTargetType } from "@/types/focus";
import type { Habit } from "@/types/habit";
import type { Task } from "@/types/task";
import type { StoredActiveFocusSession } from "@/lib/focus-active-session";

/**
 * Next Up scheduled suggestions — pure helpers only.
 * See docs/review/design/next-up-queue-spec.md §11–12.
 */

export const NEXT_UP_SUGGESTION_SNOOZE_MS = 5 * 60 * 1000;

export type ScheduledSuggestion = {
  type: FocusTargetType;
  originId: string;
  title: string;
  startMinutes: number;
};

type ScheduledSuggestionOptions = {
  tasks: Task[];
  habits: Habit[];
  viewDate: string;
  activeTarget: { type: FocusTargetType; id: string } | null;
  dismissedUntil: Record<string, string> | null | undefined;
  isFocusableHabit: (habitId: string) => boolean;
  nowMinutes?: number;
  nowMs?: number;
};

function isScheduledTaskAtNow(
  task: Task,
  viewDate: string,
  nowMinutes: number
): boolean {
  if (task.completed || !task.scheduled_time) return false;
  if (task.scheduled_date && task.scheduled_date !== viewDate) return false;

  const start = parseTimeToMinutes(task.scheduled_time);
  const end = start + getTaskDurationMinutes(task.id, task.priority);
  return nowMinutes >= start && nowMinutes < end;
}

function isScheduledHabitAtNow(
  habit: Habit,
  nowMinutes: number,
  isFocusableHabit: (habitId: string) => boolean
): boolean {
  if (!habit.scheduled_time || !isFocusableHabit(habit.id)) return false;

  const start = parseTimeToMinutes(habit.scheduled_time);
  const end = start + getHabitDurationMinutes(habit.id);
  return nowMinutes >= start && nowMinutes < end;
}

export function isSuggestionDismissed(
  originId: string,
  dismissedUntil: Record<string, string> | null | undefined,
  nowMs: number = Date.now()
): boolean {
  const snoozeUntil = dismissedUntil?.[originId];
  if (!snoozeUntil) return false;
  return nowMs < Date.parse(snoozeUntil);
}

export function collectScheduledSuggestionsAtNow(
  options: Omit<
    ScheduledSuggestionOptions,
    "activeTarget" | "dismissedUntil" | "nowMs"
  >
): ScheduledSuggestion[] {
  const {
    tasks,
    habits,
    viewDate,
    isFocusableHabit,
    nowMinutes = getNowMinutesInAppTimezone(),
  } = options;

  if (viewDate !== getTodayDateString()) return [];

  const suggestions: ScheduledSuggestion[] = [];

  for (const task of tasks) {
    if (!isScheduledTaskAtNow(task, viewDate, nowMinutes)) continue;
    suggestions.push({
      type: "task",
      originId: task.id,
      title: task.title,
      startMinutes: parseTimeToMinutes(task.scheduled_time!),
    });
  }

  for (const habit of habits) {
    if (!isScheduledHabitAtNow(habit, nowMinutes, isFocusableHabit)) {
      continue;
    }
    suggestions.push({
      type: "habit",
      originId: habit.id,
      title: habit.name,
      startMinutes: parseTimeToMinutes(habit.scheduled_time!),
    });
  }

  return suggestions.sort((a, b) => a.startMinutes - b.startMinutes);
}

export function findNextUpScheduledSuggestion(
  options: ScheduledSuggestionOptions
): ScheduledSuggestion | null {
  const {
    activeTarget,
    dismissedUntil,
    nowMs = Date.now(),
    ...collectOptions
  } = options;

  for (const suggestion of collectScheduledSuggestionsAtNow(collectOptions)) {
    if (
      activeTarget?.type === suggestion.type &&
      activeTarget.id === suggestion.originId
    ) {
      continue;
    }

    if (isSuggestionDismissed(suggestion.originId, dismissedUntil, nowMs)) {
      continue;
    }

    return suggestion;
  }

  return null;
}

export function snoozeNextUpSuggestion(
  session: StoredActiveFocusSession,
  originId: string,
  snoozeMs: number = NEXT_UP_SUGGESTION_SNOOZE_MS
): StoredActiveFocusSession {
  const snoozeUntil = new Date(Date.now() + snoozeMs).toISOString();
  return {
    ...session,
    nextUpDismissedSuggestions: {
      ...(session.nextUpDismissedSuggestions ?? {}),
      [originId]: snoozeUntil,
    },
  };
}

export function pruneExpiredSuggestionDismissals(
  session: StoredActiveFocusSession,
  nowMs: number = Date.now()
): StoredActiveFocusSession {
  const dismissed = session.nextUpDismissedSuggestions;
  if (!dismissed) return session;

  const nextEntries = Object.entries(dismissed).filter(
    ([, until]) => Number.isFinite(Date.parse(until)) && Date.parse(until) > nowMs
  );

  if (nextEntries.length === 0) {
    return { ...session, nextUpDismissedSuggestions: null };
  }

  return {
    ...session,
    nextUpDismissedSuggestions: Object.fromEntries(nextEntries),
  };
}
