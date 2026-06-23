"use client";

import { Check, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskPriorityEmoji } from "@/components/tasks/task-priority-badge";
import { formatTaskCardMeta } from "@/lib/tasks";
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

  return (
    <article
      className={cn(
        "group flex min-h-[90px] max-h-[120px] gap-3 rounded-xl border border-neutral-200/90 bg-white px-3.5 py-3 shadow-sm transition-colors",
        isCompleted && "border-neutral-100 bg-neutral-50/80 opacity-70",
        overdue && !isCompleted && "border-amber-200/80 bg-amber-50/30"
      )}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
          isCompleted
            ? "border-neutral-800 bg-neutral-800 text-white"
            : "border-neutral-400 bg-transparent hover:border-neutral-600",
          disabled && "opacity-50"
        )}
        aria-label={`Mark "${task.title}" as ${isCompleted ? "incomplete" : "complete"}`}
      >
        {isCompleted && <Check className="size-3" strokeWidth={3} />}
      </button>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex min-w-0 items-start gap-1.5">
          <TaskPriorityEmoji task={task} />
          <p
            className={cn(
              "line-clamp-1 text-sm font-semibold text-neutral-900",
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
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800">
              Overdue
            </span>
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
              className="text-muted-foreground opacity-70 transition-opacity hover:text-neutral-900 group-hover:opacity-100"
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
