"use client";

import { MoreHorizontal, Play } from "lucide-react";
import { useState, type MouseEvent as ReactMouseEvent } from "react";
import { createPortal } from "react-dom";
import { TaskGroupPill } from "@/components/tasks/task-group-pill";
import { TaskPriorityFlagIcon } from "@/components/tasks/task-priority-flag-icon";
import { formatDurationCompact } from "@/lib/focus-utils";
import { getTaskGroupAppearance } from "@/lib/task-group-appearance";
import { normalizeTaskPriority } from "@/lib/task-priority";
import type { Task, TaskGroupWithTasks } from "@/types/task";

type ContinueTaskMenuProps = {
  x: number;
  y: number;
  onClose: () => void;
  onStartFocus: () => void;
  onOpen: () => void;
  onAddToQueue: () => void;
};

function ContinueTaskMenu({
  x,
  y,
  onClose,
  onStartFocus,
  onOpen,
  onAddToQueue,
}: ContinueTaskMenuProps) {
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
        aria-label="Close Continue menu"
        onClick={onClose}
      />
      <div
        className="flow-surface-elevated fixed z-[100] min-w-48 overflow-hidden rounded-lg p-1"
        style={{
          left: Math.min(x, window.innerWidth - 208),
          top: Math.min(y, window.innerHeight - 160),
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          data-pending-focus-anchor=""
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-surface-hover"
          onClick={() => run(onStartFocus)}
        >
          <Play className="size-3.5 text-muted-foreground" />
          Start focus
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-surface-hover"
          onClick={() => run(onOpen)}
        >
          Open details
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-surface-hover"
          onClick={() => run(onAddToQueue)}
        >
          Add to Next Up
        </button>
      </div>
    </>,
    document.body,
  );
}

type ContinueTaskRowProps = {
  task: Task;
  groups: TaskGroupWithTasks[];
  focusedSeconds: number;
  onStartFocus: () => void;
  onOpen: () => void;
  onToggleComplete: () => void;
  onAddToQueue: () => void;
};

function ContinueTaskRow({
  task,
  groups,
  focusedSeconds,
  onStartFocus,
  onOpen,
  onToggleComplete,
  onAddToQueue,
}: ContinueTaskRowProps) {
  const [menuPoint, setMenuPoint] = useState<{ x: number; y: number } | null>(
    null,
  );
  const group = groups.find((item) => item.id === task.group_id) ?? null;
  const appearance = group ? getTaskGroupAppearance(group) : null;
  const priority = normalizeTaskPriority(task.priority);
  const showPriority = Boolean(task.priority) && priority !== "low";

  return (
    <>
      <div
        className="group/continue-item flex min-w-0 items-center gap-1.5 rounded-md border border-border-subtle/40 bg-surface-canvas/30 px-2 py-1 transition-[background-color,border-color] duration-150 hover:border-border-subtle/70 hover:bg-surface-hover"
        onContextMenu={(event: ReactMouseEvent<HTMLDivElement>) => {
          event.preventDefault();
          setMenuPoint({ x: event.clientX, y: event.clientY });
        }}
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleComplete();
          }}
          className="flex size-3.5 shrink-0 cursor-pointer items-center justify-center rounded-full border border-muted-foreground/35 transition-colors hover:border-foreground/55"
          aria-label={`Mark "${task.title}" complete`}
        />

        {showPriority ? (
          <TaskPriorityFlagIcon
            priority={priority}
            className="size-3 shrink-0"
          />
        ) : null}

        <button
          type="button"
          onClick={onOpen}
          className="min-w-0 flex-1 truncate text-left text-[13px] font-medium leading-tight text-foreground hover:underline"
        >
          {task.title}
        </button>

        {group && appearance ? (
          <TaskGroupPill
            icon={appearance.icon}
            name={group.title}
            appearance={appearance}
            className="max-w-[4.5rem] shrink-0 text-[10px]"
          />
        ) : null}

        <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
          {formatDurationCompact(focusedSeconds)}
        </span>

        <button
          type="button"
          data-pending-focus-anchor=""
          onClick={onStartFocus}
          className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-surface-hover hover:text-foreground group-hover/continue-item:opacity-100 focus-visible:opacity-100"
          aria-label={`Start focus on ${task.title}`}
        >
          <Play className="size-3.5" aria-hidden />
        </button>

        <button
          type="button"
          onClick={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            setMenuPoint({ x: rect.left, y: rect.bottom + 4 });
          }}
          className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-surface-hover hover:text-foreground group-hover/continue-item:opacity-100 focus-visible:opacity-100"
          aria-label={`More actions for ${task.title}`}
        >
          <MoreHorizontal className="size-3.5" aria-hidden />
        </button>
      </div>

      {menuPoint ? (
        <ContinueTaskMenu
          x={menuPoint.x}
          y={menuPoint.y}
          onClose={() => setMenuPoint(null)}
          onStartFocus={onStartFocus}
          onOpen={onOpen}
          onAddToQueue={onAddToQueue}
        />
      ) : null}
    </>
  );
}

export type ContinueFocusedMeta = {
  focusedSeconds: number;
};

type NextUpContinueSectionProps = {
  tasks: Task[];
  groups: TaskGroupWithTasks[];
  focusMetaByTaskId: Record<string, ContinueFocusedMeta>;
  onStartFocus: (task: Task) => void;
  onOpenTask: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
  onAddToQueue: (task: Task) => void;
};

export function NextUpContinueSection({
  tasks,
  groups,
  focusMetaByTaskId,
  onStartFocus,
  onOpenTask,
  onToggleComplete,
  onAddToQueue,
}: NextUpContinueSectionProps) {
  if (tasks.length === 0) return null;

  return (
    <div className="mt-3 flex min-h-0 flex-col">
      <p className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        Continue
        <span className="ml-1 font-medium normal-case tracking-normal text-muted-foreground/80">
          ({tasks.length})
        </span>
      </p>
      <div className="flex flex-col gap-1">
        {tasks.map((task) => (
          <ContinueTaskRow
            key={task.id}
            task={task}
            groups={groups}
            focusedSeconds={focusMetaByTaskId[task.id]?.focusedSeconds ?? 0}
            onStartFocus={() => onStartFocus(task)}
            onOpen={() => onOpenTask(task)}
            onToggleComplete={() => onToggleComplete(task)}
            onAddToQueue={() => onAddToQueue(task)}
          />
        ))}
      </div>
    </div>
  );
}
