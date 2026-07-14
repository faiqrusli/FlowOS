import { getNowMinutesInAppTimezone, parseTimeToMinutes } from "@/lib/date-utils";
import { normalizeTaskPriority } from "@/lib/task-priority";
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
