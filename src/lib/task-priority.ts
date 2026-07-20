export const TASK_PRIORITIES = ["high", "medium", "low"] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; emoji: string; className: string; flagClassName: string }
> = {
  high: {
    label: "Urgent",
    emoji: "🔴",
    className: "text-destructive",
    flagClassName: "fill-destructive text-destructive",
  },
  medium: {
    label: "Priority",
    emoji: "🟡",
    className: "text-warning",
    flagClassName: "fill-warning text-warning",
  },
  low: {
    label: "Normal",
    emoji: "🟢",
    className: "text-muted-foreground",
    flagClassName: "fill-none text-muted-foreground",
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
