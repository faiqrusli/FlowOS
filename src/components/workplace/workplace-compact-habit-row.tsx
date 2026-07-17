"use client";

import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type DragEvent,
  type MouseEvent,
} from "react";
import { registerContextMenuCloser } from "@/lib/task-detail-menu-coordinator";
import { Check, Clock, Play } from "lucide-react";
import { createPortal } from "react-dom";
import { TimelineHabitLabel } from "@/components/tasks/timeline-habit-label";
import { formatHabitTimeRangeWithDuration } from "@/lib/habit-duration";
import { getHabitDurationMinutes } from "@/lib/schedule-durations";
import { setCompactQueueDragImage } from "@/lib/list-drag-utils";
import {
  setActiveTimelineDrag,
  TIMELINE_DRAG_ID_MIME,
  TIMELINE_DRAG_KIND_MIME,
} from "@/lib/timeline-drag";
import { timelineHabitChipClassNames } from "@/lib/timeline-habit-appearance";
import { todayHabitAnchorId } from "@/lib/today-in-place";
import { cn } from "@/lib/utils";
import type { Habit } from "@/types/habit";

type WorkplaceCompactHabitRowProps = {
  habit: Habit;
  streak?: number;
  onToggleComplete: () => void;
  onStartFocus?: () => void;
};

function formatStreak(streak: number): string {
  if (streak <= 0) return "";
  return streak === 1 ? "🔥 1d" : `🔥 ${streak}d`;
}

function WorkplaceHabitContextMenu({
  habit,
  x,
  y,
  onClose,
  onStartFocus,
}: {
  habit: Habit;
  x: number;
  y: number;
  onClose: () => void;
  onStartFocus?: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ left: x, top: y });

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const padding = 8;
    let left = x;
    let top = y;

    if (left + menu.offsetWidth > window.innerWidth - padding) {
      left = window.innerWidth - menu.offsetWidth - padding;
    }
    if (top + menu.offsetHeight > window.innerHeight - padding) {
      top = window.innerHeight - menu.offsetHeight - padding;
    }

    setPosition({
      left: Math.max(padding, left),
      top: Math.max(padding, top),
    });
  }, [x, y]);

  if (!mounted) return null;

  return createPortal(
    <>
      <button
        type="button"
        className="fixed inset-0 z-[99] cursor-default bg-transparent"
        aria-label="Close menu"
        onClick={onClose}
      />
      <div
        ref={menuRef}
        data-timeline-context-menu
        className="flow-surface-elevated fixed z-[100] min-w-[10rem] p-1"
        style={{ left: position.left, top: position.top }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-divider px-2 py-1.5">
          <p className="truncate text-xs font-medium text-foreground">
            {habit.name}
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            {formatHabitTimeRangeWithDuration(
              habit.scheduled_time,
              getHabitDurationMinutes(habit.id),
            ) ?? "No time set"}
          </p>
        </div>
        {onStartFocus ? (
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors duration-100 hover:bg-surface-hover"
            onClick={onStartFocus}
          >
            <Play className="size-3.5 shrink-0" />
            Start now
          </button>
        ) : null}
      </div>
    </>,
    document.body,
  );
}

export const WorkplaceCompactHabitRow = memo(function WorkplaceCompactHabitRow({
  habit,
  streak = 0,
  onToggleComplete,
  onStartFocus,
}: WorkplaceCompactHabitRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const suppressDragRef = useRef(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    return registerContextMenuCloser(() => setContextMenu(null));
  }, []);
  const time = formatHabitTimeRangeWithDuration(
    habit.scheduled_time,
    getHabitDurationMinutes(habit.id),
  );
  const streakLabel = formatStreak(streak);
  const focusDraggable = habit.track_with_focus && !habit.completed;
  const durationMinutes = getHabitDurationMinutes(habit.id);
  const durationLabel = durationMinutes > 0 ? `${durationMinutes} min` : null;

  const restoreDraggable = useCallback(() => {
    suppressDragRef.current = false;
    if (rowRef.current) {
      rowRef.current.draggable = focusDraggable;
    }
  }, [focusDraggable]);

  const handleRowMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    const blockDrag = Boolean(
      event.target instanceof Element && event.target.closest("[data-no-dnd]"),
    );
    suppressDragRef.current = blockDrag;
    if (rowRef.current) {
      rowRef.current.draggable = focusDraggable && !blockDrag;
    }
  };

  const handleDragStart = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      if (
        suppressDragRef.current ||
        (event.target instanceof Element &&
          event.target.closest("[data-no-dnd]"))
      ) {
        event.preventDefault();
        restoreDraggable();
        return;
      }
      setActiveTimelineDrag({ kind: "habit", id: habit.id });
      event.dataTransfer.setData(TIMELINE_DRAG_KIND_MIME, "habit");
      event.dataTransfer.setData(TIMELINE_DRAG_ID_MIME, habit.id);
      event.dataTransfer.setData("text/plain", habit.id);
      event.dataTransfer.effectAllowed = "move";
      setCompactQueueDragImage(event, habit.name, durationLabel);
      setDragging(true);
    },
    [durationLabel, habit.id, habit.name, restoreDraggable],
  );

  const handleDragEnd = useCallback(() => {
    setActiveTimelineDrag(null);
    setDragging(false);
    restoreDraggable();
  }, [restoreDraggable]);

  return (
    <>
      <div
        ref={rowRef}
        id={todayHabitAnchorId(habit.id)}
        draggable={focusDraggable}
        onMouseDown={handleRowMouseDown}
        onMouseUp={restoreDraggable}
        onDragStart={focusDraggable ? handleDragStart : undefined}
        onDragEnd={focusDraggable ? handleDragEnd : undefined}
        onContextMenu={(event) => {
          event.preventDefault();
          setContextMenu({ x: event.clientX, y: event.clientY });
        }}
        className={cn(
          "flex items-center gap-1.5 rounded-md border px-1.5 py-1 transition-opacity duration-150",
          focusDraggable
            ? "cursor-grab active:cursor-grabbing"
            : "cursor-default",
          dragging && "opacity-40",
          timelineHabitChipClassNames(),
        )}
      >
        <button
          type="button"
          data-no-dnd
          onClick={onToggleComplete}
          className={cn(
            "flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors",
            habit.completed
              ? "border-warning bg-warning text-background"
              : "border-warning/45 hover:border-warning",
          )}
          aria-label={`Mark "${habit.name}" complete`}
        >
          {habit.completed ? (
            <Check className="size-2.5" strokeWidth={3} />
          ) : null}
        </button>

        <TimelineHabitLabel compact trackWithFocus={habit.track_with_focus} />

        <span
          className={cn(
            "min-w-0 flex-1 truncate text-[13px] font-medium leading-none text-foreground",
            habit.completed && "line-through opacity-60",
          )}
        >
          {habit.name}
        </span>

        {streakLabel ? (
          <span className="shrink-0 text-[11px] text-warning">
            {streakLabel}
          </span>
        ) : null}

        {time ? (
          <span className="shrink-0 text-[12px] tabular-nums text-muted-foreground/80">
            {time}
          </span>
        ) : null}

        {habit.track_with_focus && !habit.completed ? (
          <Clock className="size-3 shrink-0 text-accent-text" aria-hidden />
        ) : null}
      </div>

      {contextMenu ? (
        <WorkplaceHabitContextMenu
          habit={habit}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onStartFocus={
            habit.track_with_focus && !habit.completed && onStartFocus
              ? () => {
                  onStartFocus();
                  setContextMenu(null);
                }
              : undefined
          }
        />
      ) : null}
    </>
  );
});
