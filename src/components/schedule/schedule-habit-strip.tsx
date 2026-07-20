"use client";

import { Bell, BellOff, Check } from "lucide-react";
import {
  getChannelStyle,
  SCHEDULE_BLOCK_CURRENT_CLASS,
} from "@/lib/schedule-palette";
import type { ScheduleBlockLayout } from "@/lib/schedule-layout";
import { cn } from "@/lib/utils";
import type { ScheduleItem } from "@/types/schedule";

type ScheduleHabitStripProps = {
  layout: ScheduleBlockLayout;
  interactive?: boolean;
  disabled?: boolean;
  isCurrent?: boolean;
  notifyOn?: boolean;
  onToggle?: (item: ScheduleItem) => void;
  onToggleNotification?: (item: ScheduleItem) => void;
  onDragStart?: (item: ScheduleItem, event: React.DragEvent) => void;
};

export function ScheduleHabitStrip({
  layout,
  interactive,
  disabled,
  isCurrent,
  notifyOn = true,
  onToggle,
  onToggleNotification,
  onDragStart,
}: ScheduleHabitStripProps) {
  const { item, topPx, heightPx } = layout;
  const channel = getChannelStyle("habit");

  return (
    <div
      draggable={interactive && !item.completed}
      onDragStart={(event) => onDragStart?.(item, event)}
      className={cn(
        "group absolute right-3 left-3 z-10 flex items-center gap-2 overflow-hidden rounded-lg border-0 px-3 py-1 shadow-none transition-[box-shadow] duration-150",
        channel.bg,
        channel.border,
        channel.hover,
        interactive && !item.completed && "cursor-grab active:cursor-grabbing",
        isCurrent && SCHEDULE_BLOCK_CURRENT_CLASS,
        item.completed && "timeline-event-completed",
      )}
      style={{ top: topPx, height: heightPx }}
    >
      <div
        className={cn("absolute top-0 bottom-0 left-0 w-1", channel.accent)}
      />
      <span
        className={cn(
          "shrink-0 pl-2 text-[11px] font-semibold tabular-nums",
          channel.text,
        )}
      >
        {item.time ?? "—"}
      </span>
      <span className="text-muted-foreground/40">·</span>
      <p
        className={cn(
          "min-w-0 flex-1 truncate text-sm font-medium",
          item.completed && "line-through opacity-70",
        )}
      >
        {item.title}
      </p>

      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        {onToggleNotification && (
          <button
            type="button"
            onClick={() => onToggleNotification(item)}
            className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover"
            aria-label={notifyOn ? "Notifications on" : "Notifications off"}
          >
            {notifyOn ? (
              <Bell className="size-3 fill-current" />
            ) : (
              <BellOff className="size-3" />
            )}
          </button>
        )}
        {interactive && onToggle && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onToggle(item)}
            className={cn(
              "flex size-6 items-center justify-center rounded-md border transition-colors",
              item.completed
                ? "border-warning bg-warning text-background"
                : "border-warning/40 bg-background/70 hover:border-warning/60",
              disabled && "opacity-50",
            )}
            aria-label={`Mark ${item.title} complete`}
          >
            {item.completed && <Check className="size-3" strokeWidth={3} />}
          </button>
        )}
      </div>
    </div>
  );
}
