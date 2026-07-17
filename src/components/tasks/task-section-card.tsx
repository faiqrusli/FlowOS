"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { TaskCard } from "@/components/tasks/task-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

type TaskSectionCardProps = {
  title: string;
  description?: string;
  tasks: Task[];
  pendingId: string | null;
  defaultOpen?: boolean;
  tone?: "default" | "today" | "missed";
  emptyMessage: string;
  onToggleComplete: (task: Task) => void;
  onDelete: (id: string) => void;
};

export function TaskSectionCard({
  title,
  description,
  tasks,
  pendingId,
  defaultOpen = true,
  tone = "default",
  emptyMessage,
  onToggleComplete,
  onDelete,
}: TaskSectionCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card
      className={cn(
        "ring-border/40",
        tone === "today" && "border-selected-border bg-primary-soft",
        tone === "missed" &&
          "border-warning/30 bg-warning-muted/40 dark:border-warning/25 dark:bg-warning-muted/20",
        tone === "default" && "bg-surface-raised",
      )}
    >
      <CardHeader className="pb-3">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full items-start justify-between gap-3 text-left"
          aria-expanded={open}
        >
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform",
                  open && "rotate-180",
                )}
              />
              <h2 className="text-sm font-semibold text-foreground">{title}</h2>
              <span className="text-xs text-muted-foreground">
                ({tasks.length})
              </span>
            </div>
            {description && (
              <p className="pl-6 text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </button>
      </CardHeader>

      {open && (
        <CardContent className="pt-0">
          {tasks.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {tasks.map((task) => (
                <li key={task.id}>
                  <TaskCard
                    task={task}
                    disabled={pendingId === task.id}
                    onToggleComplete={onToggleComplete}
                    onDelete={onDelete}
                  />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      )}
    </Card>
  );
}
