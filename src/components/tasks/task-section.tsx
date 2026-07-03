"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { TaskCompactCard } from "@/components/tasks/task-compact-card";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

type TaskSectionProps = {
  title: string;
  count: number;
  tasks: Task[];
  pendingId: string | null;
  variant?: "today" | "upcoming" | "completed";
  emptyMessage?: string;
  showDelete?: boolean;
  showEdit?: boolean;
  hideWhenEmpty?: boolean;
  collapsible?: boolean;
  defaultOpen?: boolean;
  overdueTaskIds?: Set<string>;
  layout?: "list" | "grid";
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
};

export function TaskSection({
  title,
  count,
  tasks,
  pendingId,
  variant = "today",
  emptyMessage,
  showDelete = false,
  showEdit = false,
  hideWhenEmpty = false,
  collapsible = false,
  defaultOpen = true,
  overdueTaskIds,
  layout = "list",
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  if (hideWhenEmpty && count === 0) {
    return null;
  }

  const isOpen = collapsible ? open : true;

  return (
    <section className="space-y-3">
      {collapsible ? (
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full items-center gap-2 text-left"
          aria-expanded={isOpen}
        >
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform",
              isOpen && "rotate-180"
            )}
          />
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <span className="text-sm text-muted-foreground">({count})</span>
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <span className="text-sm text-muted-foreground">({count})</span>
        </div>
      )}

      <hr className="border-border/50" />

      {isOpen &&
        (tasks.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">{emptyMessage}</p>
        ) : (
          <ul
            className={cn(
              "grid gap-2.5",
              layout === "grid" && "grid-cols-2 gap-x-4 sm:gap-x-6"
            )}
          >
            {tasks.map((task) => (
              <li key={task.id}>
                <TaskCompactCard
                  task={task}
                  variant={variant}
                  overdue={overdueTaskIds?.has(task.id)}
                  disabled={pendingId === task.id}
                  showDelete={showDelete}
                  showEdit={showEdit}
                  onToggle={() => onToggleComplete(task)}
                  onEdit={() => onEdit(task)}
                  onDelete={() => onDelete(task.id)}
                />
              </li>
            ))}
          </ul>
        ))}
    </section>
  );
}
