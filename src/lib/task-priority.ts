export const TASK_PRIORITIES = ["high", "medium", "low"] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; emoji: string; className: string }
> = {
  high: {
    label: "High",
    emoji: "🔴",
    className: "text-red-700",
  },
  medium: {
    label: "Medium",
    emoji: "🟡",
    className: "text-amber-700",
  },
  low: {
    label: "Low",
    emoji: "🟢",
    className: "text-green-700",
  },
};

export function normalizeTaskPriority(
  priority: string | null | undefined
): TaskPriority {
  if (priority === "high" || priority === "medium" || priority === "low") {
    return priority;
  }

  return "medium";
}
