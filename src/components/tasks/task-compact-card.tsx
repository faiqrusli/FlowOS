"use client";

import { Check, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskPriorityFlagIcon } from "@/components/tasks/task-priority-flag-icon";
import { formatTaskCardMeta } from "@/lib/tasks";
import { normalizeTaskPriority } from "@/lib/task-priority";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

type TaskCompactCardProps = {
  task: Task;
  variant?: "today" | "upcoming" | "completed";
  overdue?: boolean;
  disabled?: boolean;
  showDelete?: boolean;
  showEdit?: boolean;
  onToggle: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function TaskCompactCard({
  task,
  variant = "today",
  overdue = false,
  disabled,
  showDelete = false,
  showEdit = false,
  onToggle,
  onEdit,
  onDelete,
}: TaskCompactCardProps) {
  const meta = formatTaskCardMeta(task, variant);
  const isCompleted = task.completed || variant === "completed";
  const priority = normalizeTaskPriority(task.priority);

  return (
    <article
      className={cn(
        "group flex min-h-[90px] max-h-[120px] gap-3 rounded-xl border border-border bg-card px-3.5 py-3 shadow-xs transition-[border-color,box-shadow,background-color,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:border-border hover:shadow-sm",
        isCompleted && "border-border/70 bg-muted/25 opacity-70 hover:translate-y-0 hover:shadow-xs",
        overdue &&
          !isCompleted &&
          "border-l-[3px] border-l-warning/50"
      )}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
          isCompleted
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/45 bg-transparent hover:border-muted-foreground/70",
          disabled && "opacity-50"
        )}
        aria-label={`Mark "${task.title}" as ${isCompleted ? "incomplete" : "complete"}`}
      >
        {isCompleted && <Check className="size-3" strokeWidth={3} />}
      </button>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex min-w-0 items-start gap-1.5">
          <TaskPriorityFlagIcon priority={priority} className="mt-0.5 size-3.5 shrink-0" />
          <p
            className={cn(
              "line-clamp-1 text-sm font-semibold text-foreground",
              isCompleted && "text-muted-foreground line-through"
            )}
          >
            {task.title}
          </p>
        </div>

        {task.description && (
          <p
            className={cn(
              "line-clamp-1 text-xs text-muted-foreground",
              isCompleted && "line-through"
            )}
          >
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          {meta && (
            <p className="text-xs text-muted-foreground">{meta}</p>
          )}
          {overdue && !isCompleted && (
            <Badge variant="status-warning">Overdue</Badge>
          )}
        </div>
      </div>

      {(showEdit || showDelete) && (
        <div className="flex shrink-0 self-start gap-0.5">
          {showEdit && onEdit && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={disabled}
              className="text-muted-foreground opacity-70 transition-opacity hover:text-foreground group-hover:opacity-100"
              onClick={onEdit}
              aria-label={`Edit "${task.title}"`}
            >
              <Pencil className="size-4" />
            </Button>
          )}
          {showDelete && onDelete && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={disabled}
              className="text-muted-foreground opacity-70 transition-opacity hover:text-destructive group-hover:opacity-100"
              onClick={onDelete}
              aria-label={`Delete "${task.title}"`}
            >
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
      )}
    </article>
  );
}
