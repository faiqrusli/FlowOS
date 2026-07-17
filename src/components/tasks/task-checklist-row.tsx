"use client";

import { Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type } from "@/lib/typography";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

type TaskChecklistRowProps = {
  task: Task;
  disabled?: boolean;
  showDelete?: boolean;
  compact?: boolean;
  onToggle: () => void;
  onDelete?: () => void;
};

export function TaskChecklistRow({
  task,
  disabled,
  showDelete = false,
  compact = false,
  onToggle,
  onDelete,
}: TaskChecklistRowProps) {
  return (
    <li
      className={cn(
        "group flex items-center gap-2.5",
        compact ? "py-1.5" : "gap-3 py-1.5 text-sm",
      )}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full border transition-colors",
          compact ? "size-4" : "size-5",
          task.completed
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/45 bg-transparent hover:border-muted-foreground/70",
          disabled && "opacity-50",
        )}
        aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
      >
        {task.completed && (
          <Check className={compact ? "size-2.5" : "size-3"} strokeWidth={3} />
        )}
      </button>
      <p
        className={cn(
          "min-w-0 flex-1 truncate",
          compact ? type.contentPrimary : "font-medium text-foreground",
          task.completed && "text-muted-foreground line-through",
        )}
      >
        {task.title}
      </p>
      {showDelete && onDelete && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground hover:text-destructive"
          onClick={onDelete}
          aria-label={`Delete "${task.title}"`}
        >
          <Trash2 className="size-4" />
        </Button>
      )}
    </li>
  );
}
