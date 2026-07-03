"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { formatTaskSchedule } from "@/lib/tasks";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

type TaskCardProps = {
  task: Task;
  disabled?: boolean;
  onToggleComplete: (task: Task) => void;
  onDelete: (id: string) => void;
};

export function TaskCard({
  task,
  disabled,
  onToggleComplete,
  onDelete,
}: TaskCardProps) {
  const schedule = formatTaskSchedule(task);

  return (
    <Card
      className={cn(
        "group/task-card transition-[border-color,box-shadow] duration-150 hover:border-border/85 hover:shadow-sm",
        task.completed && "opacity-65 hover:opacity-80"
      )}
    >
      <CardContent className="flex items-start gap-3 py-4">
        <Checkbox
          checked={task.completed}
          disabled={disabled}
          onCheckedChange={() => onToggleComplete(task)}
          aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
        />
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "font-medium text-foreground",
              task.completed && "text-muted-foreground line-through"
            )}
          >
            {task.title}
          </p>
          {task.description && (
            <p className="mt-1 text-sm text-foreground-secondary">
              {task.description}
            </p>
          )}
          {schedule && (
            <p className="mt-1 text-xs text-muted-foreground">{schedule}</p>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          className="shrink-0 text-muted-foreground opacity-60 transition-opacity hover:text-destructive group-hover/task-card:opacity-100"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete "${task.title}"`}
        >
          <Trash2 className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
