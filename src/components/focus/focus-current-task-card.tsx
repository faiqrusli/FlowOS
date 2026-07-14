"use client";

import { useState, type MouseEvent as ReactMouseEvent } from "react";
import { createPortal } from "react-dom";
import {
  Calendar,
  Check,
  ExternalLink,
  MoreHorizontal,
  SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskGroupPill } from "@/components/tasks/task-group-pill";
import { TaskPriorityFlagIcon } from "@/components/tasks/task-priority-flag-icon";
import { formatDuration } from "@/lib/focus-utils";
import { getTaskGroupAppearance } from "@/lib/task-group-appearance";
import { normalizeTaskPriority } from "@/lib/task-priority";
import { cn } from "@/lib/utils";
import type { Task, TaskGroupWithTasks } from "@/types/task";

type CurrentTaskMenuProps = {
  x: number;
  y: number;
  onClose: () => void;
  onCompleteTask: () => void;
  onSkipFocus: () => void;
};

function CurrentTaskMenu({
  x,
  y,
  onClose,
  onCompleteTask,
  onSkipFocus,
}: CurrentTaskMenuProps) {
  if (typeof document === "undefined") return null;

  const run = (action: () => void) => {
    action();
    onClose();
  };

  return createPortal(
    <>
      <button
        type="button"
        className="fixed inset-0 z-[99] cursor-default bg-transparent"
        aria-label="Close Current Focus menu"
        onClick={onClose}
      />
      <div
        className="flow-surface-elevated fixed z-[100] min-w-48 overflow-hidden rounded-lg p-1"
        style={{
          left: Math.min(x, window.innerWidth - 208),
          top: Math.min(y, window.innerHeight - 112),
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-surface-hover"
          onClick={() => run(onCompleteTask)}
        >
          <Check className="size-3.5 text-muted-foreground" />
          Complete Task
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-surface-hover"
          onClick={() => run(onSkipFocus)}
        >
          <SkipForward className="size-3.5 text-muted-foreground" />
          Skip Focus
        </button>
      </div>
    </>,
    document.body
  );
}

type FocusCurrentTaskCardProps = {
  task: Task | null;
  groups: TaskGroupWithTasks[];
  statusLabel: string;
  focusedSeconds: number;
  onOpenTask: (task: Task) => void;
  onCompleteTask: (task: Task) => void;
  onSkipFocus: () => void;
  onChooseFromQueue: () => void;
};

const currentFocusCardShellClassName = cn(
  "mt-2 flex h-[clamp(220px,28vh,320px)] min-h-0 shrink-0 flex-col overflow-hidden rounded-lg",
  "border border-border-subtle bg-card"
);

export function FocusCurrentTaskCard({
  task,
  groups,
  statusLabel,
  focusedSeconds,
  onOpenTask,
  onCompleteTask,
  onSkipFocus,
  onChooseFromQueue,
}: FocusCurrentTaskCardProps) {
  const [menuPoint, setMenuPoint] = useState<{ x: number; y: number } | null>(
    null
  );

  if (!task) {
    return (
      <section className="mt-2 shrink-0 rounded-lg border border-border-subtle bg-card px-3 py-2.5 text-left">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Current Focus
        </p>
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[13px] text-muted-foreground">
            Select a task to track focused time.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 px-2.5 text-[12px]"
            onClick={onChooseFromQueue}
          >
            Choose from Next Up
          </Button>
        </div>
      </section>
    );
  }

  const group = groups.find((item) => item.id === task.group_id) ?? null;
  const appearance = group ? getTaskGroupAppearance(group) : null;
  const priority = normalizeTaskPriority(task.priority);
  const targetDurationSeconds =
    task.duration_minutes === null ? null : task.duration_minutes * 60;
  const description = task.description?.trim() ?? "";

  const handleContextMenu = (event: ReactMouseEvent<HTMLElement>) => {
    event.preventDefault();
    setMenuPoint({ x: event.clientX, y: event.clientY });
  };

  return (
    <>
      <section
        className={currentFocusCardShellClassName}
        onContextMenu={handleContextMenu}
      >
        <div className="shrink-0 px-3 pt-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Current Focus
              </p>
              <div className="mt-1 flex min-w-0 flex-wrap items-center gap-2">
                <p className="truncate text-[15px] font-semibold text-foreground">
                  {task.title}
                </p>
                <TaskPriorityFlagIcon priority={priority} className="size-3.5" />
                {group && appearance ? (
                  <TaskGroupPill
                    icon={appearance.icon}
                    name={group.title}
                    appearance={appearance}
                    className="max-w-32 text-[11px]"
                  />
                ) : null}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              {task.scheduled_date ? (
                <span
                  className="flex size-7 items-center justify-center rounded-md text-muted-foreground"
                  title="Scheduled"
                  aria-hidden
                >
                  <Calendar className="size-3.5" />
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => onOpenTask(task)}
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                aria-label={`Open details for ${task.title}`}
                title="Task details"
              >
                <ExternalLink className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  setMenuPoint({ x: rect.left, y: rect.bottom + 4 });
                }}
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                aria-label={`More actions for ${task.title}`}
              >
                <MoreHorizontal className="size-4" />
              </button>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 pb-2 text-[11px] text-muted-foreground">
            <span>
              Focused{" "}
              <span className="tabular-nums">{formatDuration(focusedSeconds)}</span>
            </span>
            <span aria-hidden>·</span>
            <span>
              Goal{" "}
              <span className="tabular-nums">
                {targetDurationSeconds === null
                  ? "—"
                  : formatDuration(targetDurationSeconds)}
              </span>
            </span>
            <span aria-hidden>·</span>
            <span>{statusLabel}</span>
          </div>
        </div>

        {description ? (
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-border-subtle/70 px-3 py-2">
            <p className="text-[11px] font-medium text-muted-foreground">
              Description
            </p>
            <p className="mt-0.5 whitespace-pre-wrap text-[13px] leading-snug text-foreground/85">
              {description}
            </p>
          </div>
        ) : (
          <div className="min-h-0 flex-1" aria-hidden />
        )}
      </section>

      {menuPoint ? (
        <CurrentTaskMenu
          x={menuPoint.x}
          y={menuPoint.y}
          onClose={() => setMenuPoint(null)}
          onCompleteTask={() => onCompleteTask(task)}
          onSkipFocus={onSkipFocus}
        />
      ) : null}
    </>
  );
}
