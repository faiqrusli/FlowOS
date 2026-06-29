import type { PlanningState } from "@/types/task";

export type { PlanningState };

/** Exposed planning options in the UI. Extend this list as new states ship. */
export const PLANNING_STATES = ["none", "later"] as const satisfies readonly PlanningState[];

export type ExposedPlanningState = (typeof PLANNING_STATES)[number];

export const PLANNING_INTRO =
  "Planning determines whether this task is ready to be scheduled.";

export const PLANNING_STATE_CONFIG: Record<
  ExposedPlanningState,
  { label: string; description: string }
> = {
  none: {
    label: "Normal",
    description:
      "Keep the task in your regular task list. You can schedule it for any date at any time.",
  },
  later: {
    label: "Later",
    description:
      "Set the task aside until you're ready to schedule it. Moving a task to Later removes its scheduled date and time.",
  },
};

export function normalizePlanningState(
  value: string | null | undefined
): PlanningState {
  if (value === "later" || value === "backlog") return "later";
  return "none";
}

export function isLaterPlanningState(
  value: PlanningState | string | null | undefined
): boolean {
  return normalizePlanningState(value) === "later";
}

export function getPlanningStateLabel(
  value: PlanningState | string | null | undefined
): string {
  const state = normalizePlanningState(value);
  return PLANNING_STATE_CONFIG[state as ExposedPlanningState]?.label ?? "Normal";
}
