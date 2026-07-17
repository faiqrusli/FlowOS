"use client";

import { ChevronDown } from "lucide-react";
import { TaskPriorityFlagIcon } from "@/components/tasks/task-priority-flag-icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_CONFIG,
  type TaskPriority,
} from "@/lib/task-priority";
import { cn } from "@/lib/utils";

type TaskPrioritySelectProps = {
  value: TaskPriority;
  onChange: (priority: TaskPriority) => void;
  className?: string;
  disabled?: boolean;
};

export function TaskPrioritySelect({
  value,
  onChange,
  className,
  disabled,
}: TaskPrioritySelectProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled}
        className={cn(
          "flex h-9 w-full items-center gap-2 rounded-md border border-input bg-background px-2.5 text-sm outline-none",
          className,
        )}
        aria-label="Priority"
      >
        <TaskPriorityFlagIcon priority={value} className="size-3.5" />
        <span className="min-w-0 flex-1 truncate text-left">
          {TASK_PRIORITY_CONFIG[value].label}
        </span>
        <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        className="min-w-[10rem] rounded-xl"
      >
        {TASK_PRIORITIES.map((priority) => {
          const selected = value === priority;
          const config = TASK_PRIORITY_CONFIG[priority];

          return (
            <DropdownMenuItem
              key={priority}
              onClick={() => onChange(priority)}
              className={cn(
                "gap-2",
                selected &&
                  priority === "high" &&
                  "bg-destructive-muted font-medium text-destructive",
                selected &&
                  priority === "medium" &&
                  "bg-warning-muted font-medium text-warning",
                selected &&
                  priority === "low" &&
                  "bg-muted font-medium text-foreground",
              )}
            >
              <TaskPriorityFlagIcon priority={priority} className="size-3.5" />
              {config.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
