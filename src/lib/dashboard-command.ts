import { getNowMinutesInAppTimezone, parseTimeToMinutes } from "@/lib/date-utils";
import { computeScheduleSummary } from "@/lib/schedule-utils";
import { normalizeTaskPriority, TASK_PRIORITY_CONFIG } from "@/lib/task-priority";
import type { TodayProgress } from "@/types/dashboard";
import type { Habit } from "@/types/habit";
import type { Reflection } from "@/types/reflection";
import type { ScheduleItem } from "@/types/schedule";
import type { Task } from "@/types/task";

export type OnTrackStatus = {
  label: string;
  description: string;
  percent: number;
};

export type NextAction = {
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  type: "task" | "habit" | "focus" | "reflection" | "schedule" | "empty";
  entityId?: string;
};

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

export function computeOnTrackStatus(
  progress: TodayProgress,
  reflection: Reflection | null
): OnTrackStatus {
  const totalItems = progress.tasksTotal + progress.habitsTotal;

  let percent = 0;
  if (totalItems > 0) {
    const completed = progress.tasksCompleted + progress.habitsCompleted;
    percent = Math.round((completed / totalItems) * 100);
  } else if (progress.focusSeconds > 0 || reflection) {
    percent = 100;
  }

  if (totalItems === 0 && progress.focusSeconds === 0 && !reflection) {
    return {
      label: "Fresh start",
      description: "Plan your day with a task or focus session.",
      percent: 0,
    };
  }

  if (percent >= 80) {
    return {
      label: "On track",
      description: reflection
        ? "Strong day — keep the momentum going."
        : "Nearly there — wrap up with a quick reflection.",
      percent,
    };
  }

  if (percent >= 40) {
    return {
      label: "Making progress",
      description: "A few items left — focus on what's next.",
      percent,
    };
  }

  return {
    label: "Needs focus",
    description: "Prioritize your next task or habit to get back on track.",
    percent,
  };
}

export function sortTasksForPreview(tasks: Task[], limit = 3): Task[] {
  return tasks
    .filter((task) => !task.completed)
    .sort((a, b) => {
      const priorityA = PRIORITY_ORDER[normalizeTaskPriority(a.priority)];
      const priorityB = PRIORITY_ORDER[normalizeTaskPriority(b.priority)];
      if (priorityA !== priorityB) return priorityA - priorityB;

      return (
        parseTimeToMinutes(a.scheduled_time) - parseTimeToMinutes(b.scheduled_time)
      );
    })
    .slice(0, limit);
}

export function sortHabitsForPreview(habits: Habit[], limit = 3): Habit[] {
  return habits
    .filter((habit) => !habit.completed)
    .sort(
      (a, b) =>
        parseTimeToMinutes(a.scheduled_time) - parseTimeToMinutes(b.scheduled_time)
    )
    .slice(0, limit);
}

export function getUpcomingSchedulePreview(
  items: ScheduleItem[],
  limit = 5,
  nowMinutes = getNowMinutesInAppTimezone()
): ScheduleItem[] {
  return items
    .filter((item) => !item.completed && item.timeSort >= nowMinutes - 30)
    .sort((a, b) => a.timeSort - b.timeSort)
    .slice(0, limit);
}

export function getNextActionRecommendation(
  tasks: Task[],
  habits: Habit[],
  timeline: ScheduleItem[],
  reflection: Reflection | null,
  focusSeconds: number,
  options?: { hasActiveFocus?: boolean }
): NextAction {
  if (options?.hasActiveFocus) {
    return {
      title: "Continue your focus session",
      description: "You're in the zone — pick up where you left off.",
      href: "/focus",
      actionLabel: "Return to Focus",
      type: "focus",
    };
  }

  const summary = computeScheduleSummary(timeline);
  if (summary.nextItem) {
    const item = summary.nextItem;
    const typeLabel = item.type === "habit" ? "habit" : "task";

    return {
      title: item.title,
      description: item.time
        ? `Scheduled for ${item.time} — your next ${typeLabel} on the timeline.`
        : `Your next ${typeLabel} for today.`,
      href: item.href,
      actionLabel: item.type === "habit" ? "Complete habit" : "Open task",
      type: item.type === "habit" ? "habit" : "task",
      entityId: item.entityId,
    };
  }

  const nextTask = sortTasksForPreview(tasks, 1)[0];
  if (nextTask) {
    const priority = normalizeTaskPriority(nextTask.priority);

    return {
      title: nextTask.title,
      description: `${TASK_PRIORITY_CONFIG[priority].label} priority task — knock this out first.`,
      href: "/tasks",
      actionLabel: "View task",
      type: "task",
      entityId: nextTask.id,
    };
  }

  const nextHabit = sortHabitsForPreview(habits, 1)[0];
  if (nextHabit) {
    return {
      title: nextHabit.name,
      description: "Last habit standing for today.",
      href: "/habits",
      actionLabel: "Complete habit",
      type: "habit",
      entityId: nextHabit.id,
    };
  }

  const allTasksDone =
    tasks.length === 0 || tasks.every((task) => task.completed);
  const allHabitsDone =
    habits.length === 0 || habits.every((habit) => habit.completed);

  if (allTasksDone && allHabitsDone && !reflection) {
    return {
      title: "Reflect on your day",
      description: "Capture wins and lessons while they're fresh.",
      href: "/reflection",
      actionLabel: "Start reflection",
      type: "reflection",
    };
  }

  if (focusSeconds === 0 && (tasks.length > 0 || habits.length > 0)) {
    return {
      title: "Start a focus session",
      description: "Block time for deep work on what matters most.",
      href: "/focus",
      actionLabel: "Start Focus",
      type: "focus",
    };
  }

  return {
    title: "Plan your day",
    description: "Add a task or habit to build your command center.",
    href: "/tasks",
    actionLabel: "Add task",
    type: "empty",
  };
}
