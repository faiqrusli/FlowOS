"use client";

import {
  useEffect,
  useState,
  type DragEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  MoreHorizontal,
  Play,
} from "lucide-react";
import { NextUpQueueMenu } from "@/components/focus/next-up-queue-menu";
import { TaskGroupPill } from "@/components/tasks/task-group-pill";
import { TaskPriorityFlagIcon } from "@/components/tasks/task-priority-flag-icon";
import { TaskBoardInsertLine } from "@/components/tasks/task-board-insert-line";
import { formatTaskFocusSchedule } from "@/lib/task-focus-display";
import { getTaskGroupAppearance } from "@/lib/task-group-appearance";
import { normalizeTaskPriority } from "@/lib/task-priority";
import { cn } from "@/lib/utils";
import type { Task, TaskGroupWithTasks } from "@/types/task";

/** Collapsed preview shows the immediate next item only. */
export const NEXT_UP_PREVIEW_CAP = 1;
/** Inline expand shows at most this many before sending users to the full panel. */
export const NEXT_UP_PREVIEW_EXPANDED_CAP = 3;

type NextUpPreviewProps = {
  tasks: Task[];
  groups: TaskGroupWithTasks[];
  /** Shrink empty drop zone while an active focus session owns attention. */
  demoted?: boolean;
  /** Queue item awaiting switch-focus confirmation. */
  pendingTaskId?: string | null;
  onViewAll?: () => void;
  onHeaderClick?: () => void;
  /** When true, the open-panel control shows a close affordance. */
  queueOpen?: boolean;
  onStartFocus?: (task: Task) => void;
  onOpenTask?: (task: Task) => void;
  onMoveToTop?: (task: Task) => void;
  onMoveToEnd?: (task: Task) => void;
  onRemove?: (task: Task) => void;
  dropActive?: boolean;
  dropBeforeTaskId?: string | null;
  onExternalDragOver?: (taskId: string | null) => void;
  onExternalDrop?: (
    event: DragEvent<HTMLDivElement>,
    taskId: string | null,
  ) => void;
};

/** Time only, duration only, or start–end when both. */
function formatNextUpPreviewMeta(task: Task): string | null {
  const label = formatTaskFocusSchedule(task);
  return label === "—" ? null : label;
}

function NextUpPreviewRow({
  task,
  groups,
  position,
  selected = false,
  onOpenQueue,
  onStartFocus,
  onOpenTask,
  onMoveToTop,
  onMoveToEnd,
  onRemove,
  dropBefore,
  onExternalDragOver,
  onExternalDrop,
}: {
  task: Task;
  groups: TaskGroupWithTasks[];
  position: number;
  selected?: boolean;
  onOpenQueue?: () => void;
  onStartFocus?: (task: Task) => void;
  onOpenTask?: (task: Task) => void;
  onMoveToTop?: (task: Task) => void;
  onMoveToEnd?: (task: Task) => void;
  onRemove?: (task: Task) => void;
  dropBefore: boolean;
  onExternalDragOver?: () => void;
  onExternalDrop?: (event: DragEvent<HTMLDivElement>) => void;
}) {
  const [menuPoint, setMenuPoint] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [rowActive, setRowActive] = useState(false);
  const group = groups.find((item) => item.id === task.group_id) ?? null;
  const appearance = group ? getTaskGroupAppearance(group) : null;
  const meta = formatNextUpPreviewMeta(task);
  const hasActions = Boolean(
    onStartFocus || onOpenTask || onMoveToTop || onMoveToEnd || onRemove,
  );
  const showActions =
    hasActions && (selected || rowActive || menuPoint != null);

  const openMenu = (event: ReactMouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPoint({ x: rect.left, y: rect.bottom + 4 });
  };

  const openContextMenu = (event: ReactMouseEvent<HTMLElement>) => {
    if (
      !onOpenTask &&
      !onMoveToTop &&
      !onMoveToEnd &&
      !onRemove &&
      !onStartFocus
    )
      return;
    event.preventDefault();
    event.stopPropagation();
    setMenuPoint({ x: event.clientX, y: event.clientY });
  };

  return (
    <div
      className="group/preview-row"
      onContextMenu={openContextMenu}
      onPointerEnter={() => setRowActive(true)}
      onPointerLeave={() => {
        if (!menuPoint) setRowActive(false);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onExternalDragOver?.();
      }}
      onDrop={onExternalDrop}
    >
      {dropBefore ? <TaskBoardInsertLine className="mb-1" /> : null}
      <div
        role={onOpenQueue ? "button" : undefined}
        tabIndex={onOpenQueue ? 0 : undefined}
        onClick={onOpenQueue}
        onKeyDown={
          onOpenQueue
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onOpenQueue();
                }
              }
            : undefined
        }
        className={cn(
          "flex w-full min-w-0 items-center gap-2 rounded-md px-1.5 py-1.5 text-left transition-colors duration-150",
          selected ? "bg-primary/10 ring-1 ring-primary/35" : "bg-transparent",
          onOpenQueue &&
            !selected &&
            "cursor-pointer hover:bg-surface-hover/70",
          onOpenQueue && selected && "cursor-pointer",
        )}
      >
        <span
          aria-hidden
          className="w-3.5 shrink-0 text-center text-[11px] font-medium tabular-nums text-muted-foreground/70"
        >
          {position}
        </span>
        {task.priority && normalizeTaskPriority(task.priority) !== "low" ? (
          <TaskPriorityFlagIcon
            priority={normalizeTaskPriority(task.priority)}
            className="size-3.5 shrink-0"
          />
        ) : null}
        <span className="min-w-0 flex-1 truncate text-[13px] font-medium leading-snug text-foreground">
          {task.title}
        </span>
        <div className="flex h-6 shrink-0 items-center justify-end gap-0.5">
          {showActions ? (
            <div
              className="flex items-center gap-0.5"
              data-no-row-click
              onClick={(event) => event.stopPropagation()}
            >
              {onStartFocus ? (
                <button
                  type="button"
                  data-pending-focus-anchor=""
                  onClick={() => onStartFocus(task)}
                  className="inline-flex h-6 items-center gap-1 rounded-md px-1.5 text-[11px] font-medium text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                  aria-label={`Start focus on ${task.title}`}
                  title="Start"
                >
                  <Play className="size-3 fill-current" />
                  Start
                </button>
              ) : null}
              {onOpenTask || onMoveToTop || onMoveToEnd || onRemove ? (
                <button
                  type="button"
                  onClick={openMenu}
                  className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                  aria-label={`More actions for ${task.title}`}
                >
                  <MoreHorizontal className="size-3.5" />
                </button>
              ) : null}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              {group && appearance ? (
                <TaskGroupPill
                  icon={appearance.icon}
                  name={group.title}
                  appearance={appearance}
                  className="max-w-24 shrink text-[11px]"
                />
              ) : null}
              {meta ? (
                <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                  {meta}
                </span>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {menuPoint ? (
        <NextUpQueueMenu
          x={menuPoint.x}
          y={menuPoint.y}
          kind="task"
          onClose={() => {
            setMenuPoint(null);
            setRowActive(false);
          }}
          onStartFocus={() => onStartFocus?.(task)}
          onOpen={() => onOpenTask?.(task)}
          onMoveToTop={() => onMoveToTop?.(task)}
          onMoveToBottom={() => onMoveToEnd?.(task)}
          onRemove={() => onRemove?.(task)}
        />
      ) : null}
    </div>
  );
}

export function NextUpPreview({
  tasks,
  groups,
  demoted = false,
  pendingTaskId = null,
  onViewAll,
  onHeaderClick,
  queueOpen = false,
  onStartFocus,
  onOpenTask,
  onMoveToTop,
  onMoveToEnd,
  onRemove,
  dropActive = false,
  dropBeforeTaskId = null,
  onExternalDragOver,
  onExternalDrop,
}: NextUpPreviewProps) {
  const [expanded, setExpanded] = useState(false);
  const openQueue = onViewAll ?? onHeaderClick;
  const toggleQueue = onHeaderClick ?? onViewAll;
  const isEmpty = tasks.length === 0;
  const canTogglePreview = tasks.length > NEXT_UP_PREVIEW_CAP;

  useEffect(() => {
    if (tasks.length <= NEXT_UP_PREVIEW_CAP) setExpanded(false);
  }, [tasks.length]);

  const visibleCap = expanded
    ? NEXT_UP_PREVIEW_EXPANDED_CAP
    : NEXT_UP_PREVIEW_CAP;
  const visibleTasks = tasks.slice(0, visibleCap);
  const overflowCount = Math.max(0, tasks.length - visibleTasks.length);

  const handleOverflowClick = () => {
    if (!expanded && canTogglePreview) {
      setExpanded(true);
      return;
    }
    openQueue?.();
  };

  return (
    <div className="mt-2.5 flex shrink-0 flex-col gap-4 overflow-hidden rounded-lg border border-border-subtle/55 bg-surface-base px-2.5 py-2.5">
      <div className="flex items-center gap-2">
        <Clock
          className="size-3.5 shrink-0 text-muted-foreground"
          aria-hidden
        />
        <button
          type="button"
          onClick={onHeaderClick}
          disabled={!onHeaderClick}
          className={cn(
            "min-w-0 flex-1 truncate text-left text-[12px] font-semibold uppercase tracking-wide text-foreground/90",
            onHeaderClick && "hover:text-foreground",
          )}
        >
          Next Up
          {tasks.length > 0 ? (
            <span className="ml-1 font-medium normal-case tracking-normal text-muted-foreground">
              ({tasks.length})
            </span>
          ) : null}
        </button>
        <div className="flex shrink-0 items-center gap-0.5">
          {toggleQueue ? (
            <button
              type="button"
              onClick={toggleQueue}
              aria-expanded={queueOpen}
              aria-label={
                queueOpen ? "Close Next Up queue" : "Open Next Up queue"
              }
              title={queueOpen ? "Close Next Up queue" : "Open Next Up queue"}
              className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              <ExternalLink className="size-3.5" aria-hidden />
            </button>
          ) : null}
          {canTogglePreview ? (
            <button
              type="button"
              onClick={() => setExpanded((current) => !current)}
              aria-expanded={expanded}
              aria-label={
                expanded
                  ? "Show one Next Up task"
                  : "Show up to three Next Up tasks"
              }
              className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              {expanded ? (
                <ChevronUp className="size-3.5" aria-hidden />
              ) : (
                <ChevronDown className="size-3.5" aria-hidden />
              )}
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {isEmpty ? (
          <div
            className={cn(
              "flex items-center justify-center rounded-md border border-dashed px-3 text-center text-[12px] transition-colors",
              demoted ? "min-h-9 py-1.5" : "min-h-14",
              dropActive
                ? "border-primary/60 bg-primary/10 text-foreground"
                : demoted
                  ? "border-border-subtle/70 bg-transparent text-muted-foreground/60"
                  : "border-border-subtle bg-surface-canvas/30 text-muted-foreground/85",
            )}
            onDragOver={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onExternalDragOver?.(null);
            }}
            onDrop={(event) => onExternalDrop?.(event, null)}
          >
            {dropActive
              ? "Release to add to Next Up"
              : demoted
                ? "Drop a task for what’s next"
                : "Drag a task here to decide what’s next."}
          </div>
        ) : (
          <div className="space-y-1">
            {visibleTasks.map((task, index) => (
              <NextUpPreviewRow
                key={task.id}
                task={task}
                groups={groups}
                position={index + 1}
                selected={pendingTaskId === task.id}
                onOpenQueue={openQueue}
                onStartFocus={onStartFocus}
                onOpenTask={onOpenTask}
                onMoveToTop={onMoveToTop}
                onMoveToEnd={onMoveToEnd}
                onRemove={onRemove}
                dropBefore={dropActive && dropBeforeTaskId === task.id}
                onExternalDragOver={() => onExternalDragOver?.(task.id)}
                onExternalDrop={(event) => onExternalDrop?.(event, task.id)}
              />
            ))}
            {dropActive && dropBeforeTaskId === null ? (
              <TaskBoardInsertLine className="mt-1" />
            ) : null}
          </div>
        )}

        {overflowCount > 0 ? (
          <button
            type="button"
            onClick={handleOverflowClick}
            className="flex w-full items-center gap-1 text-left text-[12px] text-muted-foreground/80 transition-colors hover:text-foreground"
          >
            <span>
              {expanded
                ? `View ${overflowCount} more in queue`
                : `View ${overflowCount} more`}
            </span>
            <ChevronDown className="size-3.5 opacity-70" aria-hidden />
          </button>
        ) : null}
      </div>
    </div>
  );
}
