import {
  formatTimeShort,
  getTodayDateString,
  parseTimeToMinutes,
} from "@/lib/date-utils";
import {
  getHabitDurationMinutes,
  getTaskDurationMinutes,
} from "@/lib/schedule-durations";
import { fetchTodayHabits } from "@/lib/habits";
import { fetchTasks, fetchTodayTasks, partitionTasks } from "@/lib/tasks";
import type { ScheduleData, ScheduleItem } from "@/types/schedule";
import type { Habit } from "@/types/habit";
import type { Task } from "@/types/task";
import type { TaskBuckets } from "@/lib/tasks";

export class ScheduleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ScheduleError";
  }
}

export function buildScheduleItems(
  tasks: Task[],
  habits: Habit[]
): ScheduleItem[] {
  const items: ScheduleItem[] = [
    ...tasks.map((task) => {
      const timeSort = parseTimeToMinutes(task.scheduled_time);
      const durationMinutes = getTaskDurationMinutes(task.id, task.priority);
      return {
        id: `task-${task.id}`,
        entityId: task.id,
        title: task.title,
        type: "task" as const,
        time: formatTimeShort(task.scheduled_time),
        timeSort,
        timeEndSort:
          timeSort < Number.MAX_SAFE_INTEGER
            ? timeSort + durationMinutes
            : undefined,
        durationMinutes,
        priority: task.priority,
        completed: task.completed,
        href: "/tasks",
      };
    }),
    ...habits.map((habit) => {
      const timeSort = parseTimeToMinutes(habit.scheduled_time);
      const durationMinutes = getHabitDurationMinutes(habit.id);
      return {
        id: `habit-${habit.id}`,
        entityId: habit.id,
        title: habit.name,
        type: "habit" as const,
        time: formatTimeShort(habit.scheduled_time),
        timeSort,
        timeEndSort:
          timeSort < Number.MAX_SAFE_INTEGER
            ? timeSort + durationMinutes
            : undefined,
        durationMinutes,
        completed: habit.completed,
        href: "/habits",
      };
    }),
  ];

  return items.sort((a, b) => a.timeSort - b.timeSort);
}

export async function fetchScheduleData(): Promise<ScheduleData> {
  const today = getTodayDateString();

  try {
    const [tasks, habits, allTasks] = await Promise.all([
      fetchTodayTasks(today),
      fetchTodayHabits(),
      fetchTasks(),
    ]);

    const buckets = partitionTasks(allTasks, today);

    return {
      items: buildScheduleItems(tasks, habits),
      tasks,
      habits,
      buckets,
    };
  } catch (err) {
    throw new ScheduleError(
      err instanceof Error ? err.message : "Failed to load schedule."
    );
  }
}
