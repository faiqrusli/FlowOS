"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { CalendarPanel, CALENDAR_PANEL_WIDTH_CLASS } from "@/components/ui/calendar-panel";
import {
  TimePickerPanel,
  TIME_PICKER_PANEL_WIDTH_CLASS,
} from "@/components/ui/time-picker-panel";
import {
  parseTimePickerParts,
  timePickerPartsToScheduledTime,
} from "@/lib/time-picker-utils";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

const SCHEDULE_POPOVER_ESTIMATED_WIDTH_PX = 394;
const SCHEDULE_POPOVER_ESTIMATED_HEIGHT_PX = 320;

function formatScheduleDateLabel(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12));
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

type TaskSchedulePopoverProps = {
  task: Task;
  anchorRef: RefObject<HTMLDivElement | null>;
  popoverRef: RefObject<HTMLDivElement | null>;
  onUpdate: (updates: Partial<Task>) => void;
};

export function TaskSchedulePopover({
  task,
  anchorRef,
  popoverRef,
  onUpdate,
}: TaskSchedulePopoverProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [timeParts, setTimeParts] = useState(() =>
    parseTimePickerParts(task.scheduled_time)
  );
  const [position, setPosition] = useState<{ top: number; left: number } | null>(
    null
  );

  useEffect(() => {
    setTimeParts(parseTimePickerParts(task.scheduled_time));
  }, [task.scheduled_time]);

  const selectDate = useCallback(
    (dateKey: string) => {
      onUpdate({ scheduled_date: dateKey });
    },
    [onUpdate]
  );

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const popoverWidth = popoverRef.current?.offsetWidth ?? SCHEDULE_POPOVER_ESTIMATED_WIDTH_PX;
    const popoverHeight = popoverRef.current?.offsetHeight ?? SCHEDULE_POPOVER_ESTIMATED_HEIGHT_PX;
    const gap = 6;
    const padding = 8;

    let left = rect.right - popoverWidth;
    left = Math.max(
      padding,
      Math.min(left, window.innerWidth - popoverWidth - padding)
    );

    let top = rect.bottom + gap;
    if (top + popoverHeight > window.innerHeight - padding) {
      top = rect.top - popoverHeight - gap;
    }
    top = Math.max(
      padding,
      Math.min(top, window.innerHeight - popoverHeight - padding)
    );

    setPosition({ top, left });
  }, [anchorRef, popoverRef]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    updatePosition();
    const frame = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(frame);
  }, [updatePosition, task.scheduled_date, task.scheduled_time]);

  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [updatePosition]);

  if (!mounted) return null;

  const anchorRect = anchorRef.current?.getBoundingClientRect();
  const top = position?.top ?? anchorRect?.bottom ?? 0;
  const left =
    position?.left ??
    (anchorRect ? anchorRect.right - SCHEDULE_POPOVER_ESTIMATED_WIDTH_PX : 0);

  return createPortal(
    <div
      ref={popoverRef}
      data-schedule-popover
      data-no-task-drag
      className="fixed z-[100] w-max"
      style={{ top, left }}
    >
      <div
        ref={panelRef}
        className="flex items-start overflow-hidden rounded-xl border border-border/60 bg-card shadow-lg ring-1 ring-border/30"
      >
        <div className={cn("shrink-0", CALENDAR_PANEL_WIDTH_CLASS)}>
          <CalendarPanel
            value={task.scheduled_date}
            showQuickActions
            onChange={selectDate}
            onClear={() => onUpdate({ scheduled_date: null })}
            className="w-full"
          />
        </div>

        <div
          className={cn(
            "shrink-0 border-l border-border/50",
            TIME_PICKER_PANEL_WIDTH_CLASS
          )}
        >
          <TimePickerPanel
            value={timeParts}
            hasValue={Boolean(task.scheduled_time)}
            onChange={(parts) => {
              setTimeParts(parts);
              onUpdate({
                scheduled_time: timePickerPartsToScheduledTime(parts),
              });
            }}
            onClear={() => onUpdate({ scheduled_time: null })}
            className="w-full"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}

export function formatTaskScheduleDateLabel(dateKey: string): string {
  return formatScheduleDateLabel(dateKey);
}
