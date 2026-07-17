"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Crosshair } from "lucide-react";
import { ScheduleSummaryCard } from "@/components/schedule/schedule-summary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFocusSessionContext } from "@/contexts/focus-session-context";
import { getNowMinutesInAppTimezone } from "@/lib/date-utils";
import { getChannelStyle } from "@/lib/schedule-palette";
import { normalizeTaskPriority } from "@/lib/task-priority";
import {
  buildTimelineEntries,
  computeScheduleSummary,
  findCurrentItemIndex,
  formatNowMarkerLabel,
  formatScheduleTimeRange,
  getItemTimelineStatus,
  mergeFocusIntoScheduleItems,
} from "@/lib/schedule-utils";
import { cn } from "@/lib/utils";
import type { ScheduleItem } from "@/types/schedule";

type ScheduleTimelineProps = {
  items: ScheduleItem[];
  pendingId?: string | null;
  onToggle?: (item: ScheduleItem) => void;
  interactive?: boolean;
  showSummary?: boolean;
};

export function ScheduleTimeline({
  items,
  pendingId,
  onToggle,
  interactive = false,
  showSummary = false,
}: ScheduleTimelineProps) {
  const { activeSession, tick } = useFocusSessionContext();
  const [nowMinutes, setNowMinutes] = useState(getNowMinutesInAppTimezone);

  useEffect(() => {
    setNowMinutes(getNowMinutesInAppTimezone());
    const interval = window.setInterval(() => {
      setNowMinutes(getNowMinutesInAppTimezone());
    }, 30_000);

    return () => window.clearInterval(interval);
  }, [tick]);

  const mergedItems = useMemo(
    () => mergeFocusIntoScheduleItems(items, activeSession),
    [items, activeSession],
  );

  const currentIndex = useMemo(
    () => findCurrentItemIndex(mergedItems, nowMinutes),
    [mergedItems, nowMinutes],
  );

  const timelineEntries = useMemo(
    () => buildTimelineEntries(mergedItems, nowMinutes),
    [mergedItems, nowMinutes],
  );

  const summary = useMemo(
    () => computeScheduleSummary(mergedItems, nowMinutes),
    [mergedItems, nowMinutes],
  );

  if (items.length === 0 && !activeSession) {
    return (
      <Card className="border-dashed border-border/50 bg-surface-raised ring-border/40">
        <CardContent className="py-12 text-center">
          <p className="text-sm font-medium text-foreground">
            Nothing scheduled for today
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add tasks or habits with a scheduled time to see them here.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Button variant="outline" size="sm" render={<Link href="/tasks" />}>
              Go to tasks
            </Button>
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/habits" />}
            >
              Go to habits
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {showSummary && <ScheduleSummaryCard summary={summary} />}

      <Card>
        <CardContent className="py-6">
          <ul className="relative space-y-0">
            {timelineEntries.map((entry, entryIndex) => {
              if (entry.kind === "now") {
                return (
                  <li key={`now-${entryIndex}`} className="relative py-3">
                    <NowMarker label={formatNowMarkerLabel()} />
                  </li>
                );
              }

              const status = getItemTimelineStatus(
                entry.item,
                entry.itemIndex,
                currentIndex,
                nowMinutes,
              );

              return (
                <li
                  key={entry.item.id}
                  className="relative flex gap-4 pb-8 last:pb-0"
                >
                  {entryIndex < timelineEntries.length - 1 && (
                    <span
                      className={cn(
                        "absolute left-[27px] top-8 h-[calc(100%-1rem)] w-px",
                        status === "past"
                          ? "bg-muted-foreground/30"
                          : "bg-surface-raised",
                      )}
                      aria-hidden
                    />
                  )}
                  <ScheduleTimelineRow
                    item={entry.item}
                    status={status}
                    interactive={interactive}
                    disabled={pendingId === entry.item.entityId}
                    onToggle={onToggle}
                  />
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function NowMarker({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 pl-[72px]">
      <div className="h-px flex-1 bg-primary/30" />
      <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-primary">
        {label}
      </span>
      <div className="h-px flex-1 bg-primary/30" />
    </div>
  );
}

function ScheduleTimelineRow({
  item,
  status,
  interactive,
  disabled,
  onToggle,
}: {
  item: ScheduleItem;
  status: "past" | "current" | "future";
  interactive: boolean;
  disabled: boolean;
  onToggle?: (item: ScheduleItem) => void;
}) {
  const isHabit = item.type === "habit";
  const isFocus = item.type === "focus";
  const isTask = item.type === "task";
  const timeRange = formatScheduleTimeRange(item);
  const isPast = status === "past";
  const isCurrent = status === "current";
  const channel = getChannelStyle(
    item.type,
    isTask ? normalizeTaskPriority(item.priority) : undefined,
  );

  return (
    <>
      <div className="flex w-14 shrink-0 flex-col items-end pt-0.5">
        <span
          className={cn(
            "text-sm font-semibold tabular-nums",
            isPast && !isCurrent && "text-muted-foreground",
            isCurrent && "text-primary",
            !isPast && !isCurrent && "text-foreground",
          )}
        >
          {item.time ?? "—"}
        </span>
        {item.timeEnd && (
          <span className="text-[10px] tabular-nums text-muted-foreground">
            {item.timeEnd}
          </span>
        )}
      </div>

      <div
        className={cn(
          "relative z-10 mt-1.5 flex size-3 shrink-0 border-2 bg-card",
          isFocus && "rounded-full border-primary/50 bg-primary/10",
          isHabit && "rounded-sm border-warning/60",
          isTask && "rounded-full border-muted-foreground/35",
          isCurrent &&
            !isFocus &&
            "border-primary bg-primary/15 ring-2 ring-primary/20",
          isPast && item.completed && "border-success bg-success",
          isPast &&
            !item.completed &&
            !isFocus &&
            "border-warning/50 bg-warning-muted",
        )}
      />

      <div
        className={cn(
          "min-w-0 flex-1 rounded-lg border px-4 py-3 transition-colors",
          channel.bg,
          channel.border,
          isCurrent &&
            "shadow-sm ring-1 ring-primary/20 border-primary/35 bg-primary/[0.06]",
          isPast && "opacity-80",
          !isCurrent && !isPast && !isFocus && "border-border/40",
        )}
      >
        {isCurrent && (
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
            {isFocus ? "Focus in progress" : "Current task"}
          </p>
        )}

        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p
                className={cn(
                  "font-medium text-foreground",
                  isPast &&
                    item.completed &&
                    "text-muted-foreground line-through",
                  isPast && isHabit && item.completed && "line-through",
                  isPast && !item.completed && !isFocus && "text-foreground/85",
                )}
              >
                {item.title}
              </p>
              {isHabit ? (
                <Badge variant="entity-habit">Habit</Badge>
              ) : isFocus ? (
                <Badge variant="entity-focus" className="p-0">
                  <Crosshair className="size-2.5" />
                  <span className="sr-only">Focus</span>
                </Badge>
              ) : (
                <Badge variant="plain">Task</Badge>
              )}
              {item.completed && !isFocus && (
                <Badge variant="status-success">
                  {isHabit ? "Done today" : "Done"}
                </Badge>
              )}
              {isPast && !item.completed && !isFocus && (
                <Badge variant="status-warning">Past due</Badge>
              )}
            </div>

            {item.subtitle && (
              <p className="mt-1 text-xs text-muted-foreground">
                {item.subtitle}
              </p>
            )}

            {isCurrent && !isFocus && item.time && (
              <p className="mt-1 text-xs text-primary/80">
                Started {item.time}
              </p>
            )}

            {isFocus && timeRange && (
              <p className="mt-1 text-xs text-accent-text/80">{timeRange}</p>
            )}

            {isHabit && !item.subtitle && (
              <p className="mt-1 text-xs text-muted-foreground">
                Today&apos;s scheduled occurrence
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {interactive && onToggle && !isFocus && (
              <button
                type="button"
                disabled={disabled}
                onClick={() => onToggle(item)}
                className={cn(
                  "flex size-7 items-center justify-center border transition-colors",
                  isHabit ? "rounded-md" : "rounded-full",
                  item.completed
                    ? isHabit
                      ? "border-warning bg-warning text-background"
                      : "border-primary bg-primary text-primary-foreground"
                    : isHabit
                      ? "border-warning/40 bg-transparent hover:border-warning/60"
                      : "border-muted-foreground/35 bg-transparent hover:border-muted-foreground/60",
                  disabled && "opacity-50",
                )}
                aria-label={
                  isHabit
                    ? `Mark today's "${item.title}" habit occurrence as ${item.completed ? "incomplete" : "complete"}`
                    : `Mark "${item.title}" as ${item.completed ? "incomplete" : "complete"}`
                }
              >
                {item.completed && (
                  <Check className="size-3.5" strokeWidth={3} />
                )}
              </button>
            )}
            {!interactive && item.completed && !isFocus && (
              <Check className="size-4 text-foreground/90" strokeWidth={2.5} />
            )}
            {isFocus && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                render={<Link href={item.href} />}
              >
                Open
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
