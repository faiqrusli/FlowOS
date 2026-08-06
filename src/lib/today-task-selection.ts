import type { PlanningState } from "@/types/task";

export function isTaskIncludedInTodaySurfaces(
  task: Pick<{ planning_state: PlanningState }, "planning_state">,
): boolean {
  return task.planning_state !== "later";
}
