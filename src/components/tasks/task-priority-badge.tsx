import {
  normalizeTaskPriority,
  TASK_PRIORITY_CONFIG,
  type TaskPriority,
} from "@/lib/task-priority";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

function resolvePriority(
  priority?: TaskPriority | null,
  task?: Task
): TaskPriority {
  if (task) return normalizeTaskPriority(task.priority);
  return normalizeTaskPriority(priority);
}

type TaskPriorityBadgeProps = {
  priority?: TaskPriority | null;
  task?: Task;
  showEmoji?: boolean;
  className?: string;
};

export function TaskPriorityBadge({
  priority,
  task,
  showEmoji = true,
  className,
}: TaskPriorityBadgeProps) {
  const resolved = resolvePriority(priority, task);
  const config = TASK_PRIORITY_CONFIG[resolved];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium",
        config.className,
        className
      )}
    >
      {showEmoji && <span aria-hidden>{config.emoji}</span>}
      {config.label}
    </span>
  );
}

export function TaskPriorityEmoji({ task }: { task: Task }) {
  const config = TASK_PRIORITY_CONFIG[normalizeTaskPriority(task.priority)];

  return (
    <span className="shrink-0 text-sm leading-none" aria-hidden>
      {config.emoji}
    </span>
  );
}
