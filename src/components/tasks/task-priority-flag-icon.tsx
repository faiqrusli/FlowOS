import { Flag } from "lucide-react";
import { TASK_PRIORITY_CONFIG, type TaskPriority } from "@/lib/task-priority";
import { cn } from "@/lib/utils";

type TaskPriorityFlagIconProps = {
  priority: TaskPriority;
  className?: string;
};

export function TaskPriorityFlagIcon({
  priority,
  className,
}: TaskPriorityFlagIconProps) {
  const config = TASK_PRIORITY_CONFIG[priority];

  return (
    <Flag
      className={cn("size-3.5 shrink-0", config.flagClassName, className)}
      strokeWidth={1.5}
      aria-label={config.label}
    />
  );
}
