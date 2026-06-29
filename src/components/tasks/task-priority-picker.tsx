"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { TaskPriorityFlagIcon } from "@/components/tasks/task-priority-flag-icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  normalizeTaskPriority,
  TASK_PRIORITIES,
  TASK_PRIORITY_CONFIG,
  type TaskPriority,
} from "@/lib/task-priority";
import { cn } from "@/lib/utils";

type TaskPriorityPickerProps = {
  priority: string | null | undefined;
  onSelect: (priority: TaskPriority) => void;
  className?: string;
};

export function TaskPriorityPicker({
  priority: priorityValue,
  onSelect,
  className,
}: TaskPriorityPickerProps) {
  const [open, setOpen] = useState(false);
  const priority = normalizeTaskPriority(priorityValue);
  const currentConfig = TASK_PRIORITY_CONFIG[priority];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex max-w-full items-center gap-1.5 rounded-lg border border-border/50 bg-background px-2 py-1 text-xs font-medium outline-none transition-colors hover:bg-muted/50",
          className
        )}
        aria-label={`Priority: ${currentConfig.label}`}
      >
        <TaskPriorityFlagIcon priority={priority} />
        <span className="truncate">{currentConfig.label}</span>
        <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-40 p-1">
        {TASK_PRIORITIES.map((option) => {
          const config = TASK_PRIORITY_CONFIG[option];
          const selected = priority === option;

          return (
            <DropdownMenuItem
              key={option}
              onClick={() => {
                onSelect(option);
                setOpen(false);
              }}
              className={cn(
                "gap-2 py-2 text-xs",
                selected && option === "high" && "bg-red-500/10 font-medium text-red-700",
                selected && option === "medium" && "bg-amber-500/10 font-medium text-amber-700",
                selected && option === "low" && "bg-muted font-medium text-foreground"
              )}
            >
              <TaskPriorityFlagIcon priority={option} />
              {config.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
