export const TASK_PRIORITIES = ["high", "medium", "low"] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; emoji: string; className: string; flagClassName: string }
> = {
  high: {
    label: "Urgent",
    emoji: "🔴",
    className: "text-red-700",
    flagClassName: "fill-red-500 text-red-500",
  },
  medium: {
    label: "Priority",
    emoji: "🟡",
    className: "text-amber-700",
    flagClassName: "fill-amber-400 text-amber-500",
  },
  low: {
    label: "Normal",
    emoji: "🟢",
    className: "text-green-700",
    flagClassName: "fill-muted-foreground/45 text-muted-foreground",
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
