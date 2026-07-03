import { TaskPriorityFlagIcon } from "@/components/tasks/task-priority-flag-icon";
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
  showEmoji = false,
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
      {showEmoji ? (
        <span aria-hidden>{config.emoji}</span>
      ) : (
        <TaskPriorityFlagIcon priority={resolved} />
      )}
      {config.label}
    </span>
  );
}

export function TaskPriorityEmoji({ task }: { task: Task }) {
  const priority = normalizeTaskPriority(task.priority);

  return (
    <TaskPriorityFlagIcon
      priority={priority}
      className="size-3.5 shrink-0"
    />
  );
}
