"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ScheduleBlock } from "@/components/schedule/schedule-block";
import { ScheduleHabitStrip } from "@/components/schedule/schedule-habit-strip";
import { ScheduleProjectionBlock } from "@/components/schedule/schedule-projection-block";
import { useFocusSessionContext } from "@/contexts/focus-session-context";
import {
  formatNowTimeInAppTimezone,
  getNowMinutesInAppTimezone,
} from "@/lib/date-utils";
import { getShutdownTopPercent } from "@/lib/schedule-capacity";
import {
  buildHourLabels,
  buildScheduleBlockLayouts,
  getBlockHeightPx,
  getNowLineTopPx,
  HOUR_HEIGHT_PX,
  minutesToTopPx,
  SNAP_MINUTES,
  TIMELINE_HEIGHT_PX,
  topPxToMinutes,
} from "@/lib/schedule-layout";
import {
  getScheduleNotificationEnabled,
  scheduleNotificationKey,
} from "@/lib/schedule-notifications";
import { buildProjectionLayouts } from "@/lib/schedule-projections";
import {
  findCurrentItemIndex,
  mergeFocusIntoScheduleItems,
} from "@/lib/schedule-utils";
import { cn } from "@/lib/utils";
import type { ScheduleItem } from "@/types/schedule";

type ScheduleTimeGridProps = {
  items: ScheduleItem[];
  unscheduledItems?: ScheduleItem[];
  pendingId?: string | null;
  interactive?: boolean;
  showProjections?: boolean;
  notificationRevision?: number;
  durationRevision?: number;
  onToggle?: (item: ScheduleItem) => void;
  onToggleNotification?: (item: ScheduleItem) => void;
  onScheduleTask?: (taskId: string, minutes: number) => void;
  onScheduleHabit?: (habitId: string, minutes: number) => void;
  onRescheduleItem?: (
    type: "task" | "habit",
    entityId: string,
    minutes: number
  ) => void;
  onResizeItem?: (
    type: "task" | "habit",
    entityId: string,
    durationMinutes: number
  ) => void;
};

type DropPreview = {
  topPx: number;
  heightPx: number;
};

function isScheduleDrop(event: React.DragEvent): boolean {
  const types = event.dataTransfer.types;
  return (
    types.includes("text/task-id") ||
    types.includes("text/habit-id") ||
    types.includes("text/schedule-reschedule")
  );
}

function getDragDuration(event: React.DragEvent): number {
  const raw = event.dataTransfer.getData("text/drag-duration");
  if (raw) {
    const parsed = Number(raw);
    if (!Number.isNaN(parsed) && parsed > 0) return parsed;
  }
  return 45;
}

export function ScheduleTimeGrid({
  items,
  unscheduledItems = [],
  pendingId,
  interactive,
  showProjections = true,
  notificationRevision,
  durationRevision,
  onToggle,
  onToggleNotification,
  onScheduleTask,
  onScheduleHabit,
  onRescheduleItem,
  onResizeItem,
}: ScheduleTimeGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const { activeSession, tick } = useFocusSessionContext();
  const [nowMinutes, setNowMinutes] = useState(getNowMinutesInAppTimezone);
  const [dropPreview, setDropPreview] = useState<DropPreview | null>(null);

  useEffect(() => {
    setNowMinutes(getNowMinutesInAppTimezone());
    const interval = window.setInterval(() => {
      setNowMinutes(getNowMinutesInAppTimezone());
    }, 30_000);
    return () => window.clearInterval(interval);
  }, [tick]);

  const mergedItems = useMemo(
    () => mergeFocusIntoScheduleItems(items, activeSession),
    [items, activeSession]
  );

  const blockLayouts = useMemo(
    () => buildScheduleBlockLayouts(mergedItems),
    [mergedItems, durationRevision]
  );

  const projectionLayouts = useMemo(() => {
    if (!showProjections) return [];
    return buildProjectionLayouts(mergedItems, unscheduledItems);
  }, [mergedItems, unscheduledItems, showProjections, durationRevision]);

  const currentIndex = useMemo(
    () => findCurrentItemIndex(mergedItems, nowMinutes),
    [mergedItems, nowMinutes]
  );

  const hourLabels = useMemo(() => buildHourLabels(), []);
  const nowLineTop = getNowLineTopPx(nowMinutes);
  const shutdownPercent = getShutdownTopPercent();

  void notificationRevision;

  function getDropMinutes(event: React.DragEvent): number | null {
    if (!gridRef.current) return null;
    const rect = gridRef.current.getBoundingClientRect();
    const y = event.clientY - rect.top + gridRef.current.scrollTop;
    return topPxToMinutes(y);
  }

  function handleDragOver(event: React.DragEvent) {
    if (!isScheduleDrop(event)) return;
    event.preventDefault();

    const minutes = getDropMinutes(event);
    if (minutes === null) return;

    const duration = getDragDuration(event);
    const topPx = minutesToTopPx(minutes);
    const heightPx = getBlockHeightPx(
      { type: "task", timeSort: minutes } as ScheduleItem,
      duration
    );

    setDropPreview({ topPx, heightPx });
  }

  function handleDragLeave() {
    setDropPreview(null);
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    setDropPreview(null);

    const minutes = getDropMinutes(event);
    if (minutes === null) return;

    const rescheduleRaw = event.dataTransfer.getData("text/schedule-reschedule");
    if (rescheduleRaw && onRescheduleItem) {
      try {
        const payload = JSON.parse(rescheduleRaw) as {
          type: "task" | "habit";
          entityId: string;
        };
        onRescheduleItem(payload.type, payload.entityId, minutes);
      } catch {
        // ignore malformed payload
      }
      return;
    }

    const taskId = event.dataTransfer.getData("text/task-id");
    if (taskId && onScheduleTask) {
      onScheduleTask(taskId, minutes);
      return;
    }

    const habitId = event.dataTransfer.getData("text/habit-id");
    if (habitId && onScheduleHabit) {
      onScheduleHabit(habitId, minutes);
    }
  }

  function handleBlockDragStart(item: ScheduleItem, event: React.DragEvent) {
    if (item.type === "focus") return;
    event.dataTransfer.setData(
      "text/schedule-reschedule",
      JSON.stringify({
        type: item.type,
        entityId: item.entityId,
      })
    );
    event.dataTransfer.effectAllowed = "move";
  }

  function getNotifyOn(item: ScheduleItem): boolean {
    if (item.type === "focus") return false;
    return getScheduleNotificationEnabled(
      scheduleNotificationKey(item.type, item.entityId)
    );
  }

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden flow-surface-card xl:basis-[76%]">
      <div
        ref={gridRef}
        className="relative max-h-[calc(100vh-12rem)] min-h-[560px] overflow-y-auto"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div
          className="relative grid"
          style={{
            gridTemplateColumns: "4rem 1fr",
            height: TIMELINE_HEIGHT_PX,
          }}
        >
          <div className="relative border-r border-divider bg-surface-base">
            {hourLabels.slice(0, -1).map((label, index) => (
              <div
                key={label}
                className="absolute right-3 -translate-y-1/2 text-right"
                style={{ top: index * HOUR_HEIGHT_PX }}
              >
                <span className="text-[11px] font-medium text-muted-foreground/80 tabular-nums">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="relative bg-gradient-to-b from-background/20 to-transparent">
            {Array.from({ length: hourLabels.length - 1 }).map((_, index) => (
              <div
                key={index}
                className="absolute right-0 left-0 border-t border-border-subtle"
                style={{ top: index * HOUR_HEIGHT_PX }}
              />
            ))}

            {Array.from({ length: (hourLabels.length - 1) * 4 }).map(
              (_, index) => (
                <div
                  key={`quarter-${index}`}
                  className="absolute right-0 left-0 border-t border-dashed border-border/15"
                  style={{ top: index * (HOUR_HEIGHT_PX / 4) }}
                />
              )
            )}

            <div
              className="pointer-events-none absolute right-0 left-0 border-t border-dashed border-warning/50"
              style={{ top: `${shutdownPercent}%` }}
            >
              <span className="absolute -top-2.5 right-3 rounded-full bg-warning-muted px-2 py-0.5 text-[10px] font-medium text-warning">
                Shutdown 6 PM
              </span>
            </div>

            {dropPreview && (
              <div
                className="pointer-events-none absolute right-3 left-3 z-20 rounded-xl border-2 border-dashed border-primary/40 bg-primary/[0.07] shadow-inner"
                style={{
                  top: dropPreview.topPx,
                  height: dropPreview.heightPx,
                }}
              />
            )}

            {projectionLayouts.map((layout) => (
              <ScheduleProjectionBlock key={`proj-${layout.item.id}`} layout={layout} />
            ))}

            {nowLineTop !== null && (
              <div
                className="absolute right-0 left-0 z-30 flex items-center"
                style={{ top: nowLineTop }}
              >
                <div className="size-2.5 rounded-full bg-rose-500 shadow-sm" />
                <div className="h-0.5 flex-1 bg-gradient-to-r from-rose-500/80 to-rose-500/20" />
                <span className="mr-3 shrink-0 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-semibold text-white tabular-nums shadow-sm">
                  {formatNowTimeInAppTimezone()}
                </span>
              </div>
            )}

            {blockLayouts.map((layout) => {
              const itemIndex = mergedItems.findIndex(
                (item) => item.id === layout.item.id
              );
              const sharedProps = {
                layout,
                interactive,
                disabled: pendingId === layout.item.entityId,
                isCurrent: itemIndex === currentIndex,
                notifyOn: getNotifyOn(layout.item),
                onToggle,
                onToggleNotification,
                onDragStart: handleBlockDragStart,
                onResize:
                  onResizeItem && layout.item.type !== "focus"
                    ? (item: ScheduleItem, duration: number) =>
                        onResizeItem(
                          item.type as "task" | "habit",
                          item.entityId,
                          duration
                        )
                    : undefined,
              };

              if (layout.variant === "habit") {
                return (
                  <ScheduleHabitStrip key={layout.item.id} {...sharedProps} />
                );
              }

              return <ScheduleBlock key={layout.item.id} {...sharedProps} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
