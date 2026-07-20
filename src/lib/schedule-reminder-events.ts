import {
  getTodayDateString,
  parseTimeToMinutes,
} from "@/lib/date-utils";
import { getEffectiveHabitScheduledTime } from "@/lib/habit-daily-schedule-store";
import { isHabitScheduledOnDate } from "@/lib/habit-stats";
import type { Habit } from "@/types/habit";
import type { Task } from "@/types/task";

export type ScheduleReminderKind = "reminder" | "start";
export type ScheduleReminderEntity = "task" | "habit";

export type ScheduleReminderEvent = {
  /** Stable id — used for once-only delivery. */
  id: string;
  entity: ScheduleReminderEntity;
  entityId: string;
  kind: ScheduleReminderKind;
  /** Minutes from midnight (app timezone wall clock). */
  fireAtMinutes: number;
  title: string;
  /** In-app / OS heading */
  heading: string;
  /** In-app / OS body line */
  body: string;
};

function eventId(
  dateKey: string,
  entity: ScheduleReminderEntity,
  entityId: string,
  kind: ScheduleReminderKind,
): string {
  return `${dateKey}:${entity}:${entityId}:${kind}`;
}

function taskEventsForToday(
  task: Task,
  dateKey: string,
): ScheduleReminderEvent[] {
  if (task.completed) return [];
  if (task.scheduled_date !== dateKey) return [];
  if (!task.scheduled_time) return [];
  if (!task.notification_enabled) return [];

  const startMinutes = parseTimeToMinutes(task.scheduled_time);
  if (!Number.isFinite(startMinutes) || startMinutes === Number.MAX_SAFE_INTEGER) {
    return [];
  }

  const events: ScheduleReminderEvent[] = [];
  const lead = task.notification_lead_minutes;

  if (lead != null && lead > 0) {
    const reminderAt = startMinutes - lead;
    if (reminderAt >= 0) {
      events.push({
        id: eventId(dateKey, "task", task.id, "reminder"),
        entity: "task",
        entityId: task.id,
        kind: "reminder",
        fireAtMinutes: reminderAt,
        title: task.title,
        heading: "Task Reminder",
        body: task.title,
      });
    }
  }

  events.push({
    id: eventId(dateKey, "task", task.id, "start"),
    entity: "task",
    entityId: task.id,
    kind: "start",
    fireAtMinutes: startMinutes,
    title: task.title,
    heading: "Task Starting",
    body: task.title,
  });

  return events;
}

function habitEventsForToday(
  habit: Habit,
  dateKey: string,
): ScheduleReminderEvent[] {
  if (habit.completed) return [];
  if (!isHabitScheduledOnDate(habit, dateKey)) return [];

  const scheduledTime = getEffectiveHabitScheduledTime(
    habit.id,
    habit.scheduled_time,
    dateKey,
  );
  if (!scheduledTime) return [];

  const startMinutes = parseTimeToMinutes(scheduledTime);
  if (!Number.isFinite(startMinutes) || startMinutes === Number.MAX_SAFE_INTEGER) {
    return [];
  }

  // Habits have no lead-minutes column yet — start-time only for MVP.
  return [
    {
      id: eventId(dateKey, "habit", habit.id, "start"),
      entity: "habit",
      entityId: habit.id,
      kind: "start",
      fireAtMinutes: startMinutes,
      title: habit.name,
      heading: "Habit Time",
      body: habit.name,
    },
  ];
}

/** Build all reminder/start events for Today's scheduled tasks and habits. */
export function buildScheduleReminderEvents(input: {
  tasks: Task[];
  habits: Habit[];
  dateKey?: string;
}): ScheduleReminderEvent[] {
  const dateKey = input.dateKey ?? getTodayDateString();
  const events: ScheduleReminderEvent[] = [];

  for (const task of input.tasks) {
    events.push(...taskEventsForToday(task, dateKey));
  }
  for (const habit of input.habits) {
    events.push(...habitEventsForToday(habit, dateKey));
  }

  return events.sort((a, b) => a.fireAtMinutes - b.fireAtMinutes);
}

/**
 * Events whose fire time falls in (previousMinutes, currentMinutes].
 * First tick should pass previousMinutes === currentMinutes to skip catch-up.
 */
export function selectDueScheduleReminderEvents(
  events: ScheduleReminderEvent[],
  previousMinutes: number,
  currentMinutes: number,
): ScheduleReminderEvent[] {
  if (currentMinutes < previousMinutes) {
    // Day rolled or clock jumped backward — only fire exact current minute.
    return events.filter((event) => event.fireAtMinutes === currentMinutes);
  }
  return events.filter(
    (event) =>
      event.fireAtMinutes > previousMinutes &&
      event.fireAtMinutes <= currentMinutes,
  );
}
