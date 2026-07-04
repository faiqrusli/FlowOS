import { getTodayDateString } from "@/lib/date-utils";
import { computeFocusStatsForDate, fetchFocusSessions } from "@/lib/focus-sessions";
import { fetchTodayHabits } from "@/lib/habits";
import { buildScheduleItems } from "@/lib/schedule";
import { fetchTodayReflection } from "@/lib/reflections-db";
import { fetchTodayTasks } from "@/lib/tasks";
import type { DashboardData, TodayProgress } from "@/types/dashboard";
import type { Habit } from "@/types/habit";
import type { Task } from "@/types/task";

export class DashboardError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DashboardError";
  }
}

function buildProgress(
  tasks: Task[],
  habits: Habit[],
  focusSeconds: number
): TodayProgress {
  return {
    tasksCompleted: tasks.filter((t) => t.completed).length,
    tasksTotal: tasks.length,
    habitsCompleted: habits.filter((h) => h.completed).length,
    habitsTotal: habits.length,
    focusSeconds,
  };
}

export async function fetchDashboardData(): Promise<DashboardData> {
  const today = getTodayDateString();

  try {
    const [tasks, habits, focusSessions, reflection] = await Promise.all([
      fetchTodayTasks(today),
      fetchTodayHabits(),
      fetchFocusSessions(),
      fetchTodayReflection(today),
    ]);

    const focus = computeFocusStatsForDate(focusSessions, today);
    const progress = buildProgress(tasks, habits, focus.totalFocusSeconds);
    const timeline = buildScheduleItems(tasks, habits, "today");

    return {
      progress,
      tasks,
      habits,
      focus,
      reflection,
      timeline,
    };
  } catch (err) {
    throw new DashboardError(
      err instanceof Error ? err.message : "Failed to load dashboard."
    );
  }
}
