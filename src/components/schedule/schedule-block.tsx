"use client";

import Link from "next/link";
import { Bell, BellOff, Check, Play, Timer } from "lucide-react";
import {
  formatDurationLabel,
  HOUR_HEIGHT_PX,
  SNAP_MINUTES,
  type ScheduleBlockLayout,
} from "@/lib/schedule-layout";
import {
  getChannelStyle,
  SCHEDULE_BLOCK_CURRENT_CLASS,
} from "@/lib/schedule-palette";
import { cn } from "@/lib/utils";
import type { ScheduleItem } from "@/types/schedule";

type ScheduleBlockProps = {
  layout: ScheduleBlockLayout;
  interactive?: boolean;
  disabled?: boolean;
  isCurrent?: boolean;
  notifyOn?: boolean;
  onToggle?: (item: ScheduleItem) => void;
  onToggleNotification?: (item: ScheduleItem) => void;
  onDragStart?: (item: ScheduleItem, event: React.DragEvent) => void;
  onResize?: (item: ScheduleItem, durationMinutes: number) => void;
};

export function ScheduleBlock({
  layout,
  interactive,
  disabled,
  isCurrent,
  notifyOn = true,
  onToggle,
  onToggleNotification,
  onDragStart,
  onResize,
}: ScheduleBlockProps) {
  const { item, topPx, heightPx, durationMinutes } = layout;
  const channel = getChannelStyle(item.type, item.priority);
  const isFocus = item.type === "focus";
  const isCompact = heightPx < 52;

  function handleResizeStart(event: React.MouseEvent) {
    if (!onResize || isFocus) return;
    const resize = onResize;
    event.preventDefault();
    event.stopPropagation();

    const startY = event.clientY;
    const startDuration = durationMinutes;
    let latestDuration = startDuration;

    function onMove(moveEvent: MouseEvent) {
      const deltaPx = moveEvent.clientY - startY;
      const deltaMinutes =
        Math.round(((deltaPx / HOUR_HEIGHT_PX) * 60) / SNAP_MINUTES) *
        SNAP_MINUTES;
      latestDuration = Math.max(SNAP_MINUTES, startDuration + deltaMinutes);
    }

    function onUp() {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      if (latestDuration !== startDuration) {
        resize(item, latestDuration);
      }
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  return (
    <div
      draggable={interactive && !isFocus && !item.completed}
      onDragStart={(event) => onDragStart?.(item, event)}
      className={cn(
        "group absolute right-3 left-3 z-10 overflow-hidden rounded-lg border-0 transition-[box-shadow] duration-150",
        channel.bg,
        channel.border,
        channel.hover,
        interactive &&
          !isFocus &&
          !item.completed &&
          "cursor-grab active:cursor-grabbing",
        isCurrent && SCHEDULE_BLOCK_CURRENT_CLASS,
        item.completed && "timeline-event-completed",
      )}
      style={{ top: topPx, height: heightPx }}
    >
      <div
        className={cn("absolute top-0 bottom-0 left-0 w-1", channel.accent)}
      />

      <div
        className={cn(
          "flex h-full min-w-0",
          isCompact
            ? "items-center gap-2 px-3 py-1 pl-4"
            : "flex-col px-3 py-2 pl-4",
        )}
      >
        <div className="flex min-w-0 flex-1 items-start gap-2">
          {interactive && onToggle && !isFocus && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => onToggle(item)}
              className={cn(
                "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                item.completed
                  ? "border-foreground bg-foreground text-background"
                  : "border-muted-foreground/40 bg-surface-base hover:border-foreground/50",
                disabled && "opacity-50",
              )}
              aria-label={`Mark ${item.title} complete`}
            >
              {item.completed && <Check className="size-2.5" strokeWidth={3} />}
            </button>
          )}

          <div className="min-w-0 flex-1">
            {item.time && (
              <p
                className={cn(
                  "text-[11px] font-semibold tracking-wide tabular-nums uppercase",
                  channel.text,
                )}
              >
                {item.time}
              </p>
            )}
            <p
              className={cn(
                "truncate font-medium text-foreground",
                isCompact ? "text-sm" : "text-[15px] leading-snug",
                item.completed && "line-through opacity-70",
              )}
            >
              {item.title}
            </p>
            {!isCompact && (
              <p className="mt-0.5 text-xs text-foreground-secondary">
                {isFocus ? "Focus session" : "Task"} ·{" "}
                {formatDurationLabel(durationMinutes)}
              </p>
            )}
          </div>
        </div>

        <div
          className={cn(
            "flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100",
            isCompact ? "" : "mt-auto self-end",
          )}
        >
          {isFocus ? (
            <Link
              href={item.href}
              className="flex size-7 items-center justify-center rounded-lg bg-primary/15 text-accent-text transition-colors hover:bg-primary/25"
              aria-label="Open focus session"
            >
              <Play className="size-3.5 fill-current" />
            </Link>
          ) : (
            <>
              <Link
                href="/focus"
                className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
                aria-label={`Start focus on ${item.title}`}
              >
                <Timer className="size-3.5" />
              </Link>
              {onToggleNotification && (
                <button
                  type="button"
                  onClick={() => onToggleNotification(item)}
                  className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
                  aria-label={
                    notifyOn ? "Notifications on" : "Notifications off"
                  }
                >
                  {notifyOn ? (
                    <Bell className="size-3.5 fill-current" />
                  ) : (
                    <BellOff className="size-3.5" />
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {interactive && onResize && !isFocus && !item.completed && (
        <div
          onMouseDown={handleResizeStart}
          className="absolute right-0 bottom-0 left-0 h-2 cursor-ns-resize opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden
        >
          <div className="mx-auto mt-0.5 h-1 w-8 rounded-full bg-foreground/15" />
        </div>
      )}
    </div>
  );
}
