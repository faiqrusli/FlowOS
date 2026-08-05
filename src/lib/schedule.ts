import { getTodayDateString } from "@/lib/date-utils";
import { fetchTodayHabits } from "@/lib/habits";
import { fetchTasks, fetchTodayTasks, partitionTasks } from "@/lib/tasks";
import type { ScheduleData } from "@/types/schedule";
import { buildScheduleItems } from "@/lib/schedule-items";

export { buildScheduleItems } from "@/lib/schedule-items";
export type { ScheduleLinkMode } from "@/lib/schedule-items";

export class ScheduleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ScheduleError";
  }
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
