"use client";

import { Check, MoreHorizontal, Play } from "lucide-react";
import {
  useCallback,
  useRef,
  useState,
  type DragEvent as ReactDragEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { TaskGroupPill } from "@/components/tasks/task-group-pill";
import { TaskPriorityFlagIcon } from "@/components/tasks/task-priority-flag-icon";
import { formatDurationCompact } from "@/lib/focus-utils";
import { setCompactQueueDragImage } from "@/lib/list-drag-utils";
import { getTaskGroupAppearance } from "@/lib/task-group-appearance";
import { normalizeTaskPriority } from "@/lib/task-priority";
import {
  setActiveTaskDragId,
  setActiveTimelineDrag,
  setBoardTaskDragData,
} from "@/lib/timeline-drag";
import { cn } from "@/lib/utils";
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

function isNoDragTarget(target: EventTarget | null): boolean {
  return Boolean(target instanceof Element && target.closest("[data-no-dnd]"));
}

function ContinueTaskRow({
  task,
  groups,
  focusedSeconds,
  onStartFocus,
  onOpen,
  onToggleComplete,
  onAddToQueue,
}: ContinueTaskRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const suppressDragRef = useRef(false);
  const [menuPoint, setMenuPoint] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [rowActive, setRowActive] = useState(false);
  const [dragging, setDragging] = useState(false);
  const group = groups.find((item) => item.id === task.group_id) ?? null;
  const appearance = group ? getTaskGroupAppearance(group) : null;
  const priority = normalizeTaskPriority(task.priority);
  const showPriority = Boolean(task.priority) && priority !== "low";
  const durationLabel = formatDurationCompact(focusedSeconds);
  const canDrag = !task.completed;
  const hasMeta = Boolean(group && appearance) || focusedSeconds > 0;
  const showActions = Boolean(menuPoint) || rowActive;

  const restoreDraggable = useCallback(() => {
    suppressDragRef.current = false;
    if (rowRef.current) {
      rowRef.current.draggable = canDrag;
    }
  }, [canDrag]);

  const handleRowMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    const blockDrag = isNoDragTarget(event.target);
    suppressDragRef.current = blockDrag;
    if (rowRef.current) {
      rowRef.current.draggable = canDrag && !blockDrag;
    }
  };

  const handleDragStart = useCallback(
    (event: ReactDragEvent<HTMLDivElement>) => {
      if (suppressDragRef.current || isNoDragTarget(event.target)) {
        event.preventDefault();
        restoreDraggable();
        return;
      }
      setBoardTaskDragData(event, task.id);
      event.dataTransfer.effectAllowed = "move";
      setCompactQueueDragImage(event, task.title, durationLabel);
      setDragging(true);
    },
    [durationLabel, restoreDraggable, task.id, task.title],
  );

  const handleDragEnd = useCallback(() => {
    setActiveTaskDragId(null);
    setActiveTimelineDrag(null);
    setDragging(false);
    restoreDraggable();
  }, [restoreDraggable]);

  return (
    <>
      <div
        ref={rowRef}
        draggable={canDrag}
        onMouseDown={handleRowMouseDown}
        onMouseUp={restoreDraggable}
        onDragStart={canDrag ? handleDragStart : undefined}
        onDragEnd={handleDragEnd}
        onPointerEnter={() => setRowActive(true)}
        onPointerLeave={() => {
          if (!menuPoint) setRowActive(false);
        }}
        className={cn(
          "group/continue-item flow-interactive flex min-w-0 items-center gap-2 rounded-lg border-0 bg-transparent px-1.5 py-1.5 shadow-none hover:bg-surface-hover",
          canDrag && "cursor-grab active:cursor-grabbing",
          dragging && "opacity-40",
        )}
        onContextMenu={(event: ReactMouseEvent<HTMLDivElement>) => {
          event.preventDefault();
          setMenuPoint({ x: event.clientX, y: event.clientY });
        }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <button
            type="button"
            data-no-dnd
            onClick={onOpen}
            className="flow-type-title min-w-0 truncate text-left text-[13px] leading-snug hover:underline"
          >
            {task.title}
          </button>
          {showPriority ? (
            <TaskPriorityFlagIcon
              priority={priority}
              className="size-3 shrink-0"
            />
          ) : null}
        </div>

        <div className="flex h-6 shrink-0 items-center justify-end gap-0.5">
          {showActions ? (
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                data-no-dnd
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleComplete();
                }}
                className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                aria-label={`Mark "${task.title}" complete`}
                title="Complete task"
              >
                <Check className="size-3.5" strokeWidth={2.25} aria-hidden />
              </button>
              <button
                type="button"
                data-no-dnd
                data-pending-focus-anchor=""
                onClick={onStartFocus}
                className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                aria-label={`Start focus on ${task.title}`}
                title="Start focus"
              >
                <Play className="size-3.5" aria-hidden />
              </button>
              <button
                type="button"
                data-no-dnd
                onClick={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  setMenuPoint({ x: rect.left, y: rect.bottom + 4 });
                }}
                className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                aria-label={`More actions for ${task.title}`}
                title="More"
              >
                <MoreHorizontal className="size-3.5" aria-hidden />
              </button>
            </div>
          ) : hasMeta ? (
            <div className="flow-meta-row">
              {group && appearance ? (
                <TaskGroupPill
                  icon={appearance.icon}
                  name={group.title}
                  appearance={appearance}
                  className="flow-meta-group max-w-28 shrink-0 text-[11px]"
                />
              ) : null}
              {focusedSeconds > 0 ? (
                <span className="flow-type-meta flow-meta-group shrink-0 text-[11px] tabular-nums">
                  {durationLabel}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {menuPoint ? (
        <ContinueTaskMenu
          x={menuPoint.x}
          y={menuPoint.y}
          onClose={() => {
            setMenuPoint(null);
            setRowActive(false);
          }}
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
    <div className="mt-5 flex min-h-0 flex-col">
      <div className="mb-3 flex items-baseline px-1">
        <p className="flow-section-label text-[10px] uppercase">
          Continue
          <span className="flow-section-count normal-case tracking-normal">
            {" "}
            ({tasks.length})
          </span>
        </p>
      </div>
      <div className="flex flex-col gap-2">
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
