import { getTodayDateString } from "@/lib/date-utils";
import { fetchHabitsWithCompletions, HabitsError } from "@/lib/habits";
import { fetchTaskBoard, TaskGroupsError } from "@/lib/task-groups";
import type { Habit } from "@/types/habit";
import type { TaskGroupWithTasks } from "@/types/task";

export class WorkplaceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WorkplaceError";
  }
}

export type WorkplaceData = {
  groups: TaskGroupWithTasks[];
  habits: Habit[];
  todayViewDate: string;
};

export async function fetchWorkplaceData(): Promise<WorkplaceData> {
  const todayViewDate = getTodayDateString();

  try {
    const [groups, habits] = await Promise.all([
      fetchTaskBoard(),
      fetchHabitsWithCompletions(),
    ]);

    return { groups, habits, todayViewDate };
  } catch (err) {
    if (
      err instanceof TaskGroupsError ||
      err instanceof HabitsError
    ) {
      throw new WorkplaceError(err.message);
    }
    throw new WorkplaceError("Failed to load workplace.");
  }
}
