"use client";

import { useRef, useState } from "react";
import { ChevronDown, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TASK_DURATION_OPTIONS,
  formatDurationMinutes,
  formatDurationTimeInput,
  parseDurationTimeInput,
} from "@/lib/task-duration-options";
import { cn } from "@/lib/utils";

const TASK_DURATION_MENU_COLLISION = {
  side: "shift",
  align: "shift",
} as const;
const TASK_DURATION_COMPACT_TRIGGER_CLASS =
  "size-6 justify-center rounded-md hover:bg-muted/80";
const TASK_DURATION_COMPACT_TRIGGER_OPEN_CLASS = "bg-muted/80";
const TASK_DURATION_COMPACT_MENU_CLASS =
  "max-h-64 min-w-0 w-36 overflow-y-auto rounded-xl border-border/50 p-0 shadow-md";
const TASK_DURATION_DETAIL_MENU_CLASS =
  "max-h-64 min-w-0 overflow-y-auto rounded-xl border-border/50 p-0 shadow-md w-[var(--anchor-width)] max-w-[var(--anchor-width)]";

type TaskDurationPickerProps = {
  durationMinutes: number | null;
  onChange: (minutes: number | null) => void;
  compact?: boolean;
  variant?: "inline" | "task-row" | "timeline" | "detail";
  className?: string;
  onOpenChange?: (open: boolean) => void;
};

export function TaskDurationPicker({
  durationMinutes,
  onChange,
  compact = false,
  variant = "inline",
  className,
  onOpenChange,
}: TaskDurationPickerProps) {
  const [open, setOpen] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const customDirtyRef = useRef(false);
  const isTaskRow = variant === "task-row";
  const isTimeline = variant === "timeline";
  const isDetail = variant === "detail";

  const displayLabel =
    !isTaskRow &&
    !isTimeline &&
    !isDetail &&
    durationMinutes &&
    durationMinutes > 0
      ? formatDurationMinutes(durationMinutes)
      : null;
  const detailLabel =
    durationMinutes && durationMinutes > 0
      ? formatDurationMinutes(durationMinutes)
      : "No duration";
  const hasDuration = Boolean(durationMinutes && durationMinutes > 0);
  const timelineDurationLabel =
    isTimeline && hasDuration
      ? formatDurationMinutes(durationMinutes!)
      : null;

  function tryCommitCustomValue() {
    if (!customDirtyRef.current) return;

    const parsed = parseDurationTimeInput(customValue);
    if (parsed === null) return;
    if (parsed !== durationMinutes) {
      onChange(parsed);
    }
    customDirtyRef.current = false;
  }

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      customDirtyRef.current = false;
      setCustomValue(
        durationMinutes && durationMinutes > 0
          ? formatDurationTimeInput(durationMinutes)
          : "0:30"
      );
    }
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  }

  function commitCustom() {
    tryCommitCustomValue();
    setOpen(false);
  }

  function applyDuration(minutes: number | null) {
    customDirtyRef.current = false;
    onChange(minutes);
    setOpen(false);
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
        className={cn(
          "flex shrink-0 items-center outline-none",
          isTaskRow || isTimeline
            ? cn(
                TASK_DURATION_COMPACT_TRIGGER_CLASS,
                isTimeline && hasDuration && "size-auto h-6 min-w-6 px-1",
                open && TASK_DURATION_COMPACT_TRIGGER_OPEN_CLASS,
                isTaskRow
                  ? hasDuration
                    ? "text-sky-600"
                    : "text-muted-foreground/70"
                  : "text-muted-foreground/70"
              )
            : isDetail
                ? cn(
                    "h-9 w-full justify-between gap-2 rounded-lg border border-border/50 bg-background px-2 text-sm hover:bg-muted/20",
                    open && "ring-1 ring-ring/30",
                    !durationMinutes && "text-muted-foreground"
                  )
                : cn(
                    "justify-center rounded text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    compact
                      ? "h-4 min-w-[1.25rem] px-0.5 text-[9px]"
                      : "h-5 min-w-[1.5rem] px-0.5 text-[10px]"
                  ),
          className
        )}
        id={isDetail ? "task-detail-duration" : undefined}
        aria-label={
          isDetail
            ? `Duration: ${detailLabel}`
            : durationMinutes && durationMinutes > 0
              ? `Duration ${formatDurationMinutes(durationMinutes)}`
              : "Set task duration"
        }
      >
        {isDetail ? (
          <>
            <span className="truncate tabular-nums">{detailLabel}</span>
            <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
          </>
        ) : isTaskRow ? (
          <Clock className="size-3.5 shrink-0" strokeWidth={1.75} />
        ) : isTimeline ? (
          timelineDurationLabel ? (
            <span
              className={cn(
                "shrink-0 font-medium tabular-nums leading-none text-foreground/55",
                compact ? "text-[10px]" : "text-[11px]"
              )}
            >
              {timelineDurationLabel}
            </span>
          ) : (
            <Clock className="size-3.5 shrink-0" strokeWidth={1.75} />
          )
        ) : displayLabel ? (
          <span className="tabular-nums">{displayLabel}</span>
        ) : (
          <Clock
            className={cn(
              isTaskRow ? "size-3.5" : compact ? "size-2.5" : "size-3"
            )}
            strokeWidth={1.75}
          />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={isTaskRow || isTimeline || isDetail ? "bottom" : "left"}
        align={isTaskRow || isTimeline ? "end" : "start"}
        collisionAvoidance={
          isTaskRow || isTimeline || isDetail
            ? TASK_DURATION_MENU_COLLISION
            : undefined
        }
        className={cn(
          isDetail ? TASK_DURATION_DETAIL_MENU_CLASS : TASK_DURATION_COMPACT_MENU_CLASS
        )}
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            (event.currentTarget.querySelector("input") as HTMLInputElement | null)?.focus();
            (event.currentTarget.querySelector("input") as HTMLInputElement | null)?.select();
          }}
          className="flex w-full border-b border-border/60 px-2 py-1.5 hover:bg-muted/40"
        >
          <input
            type="text"
            value={customValue}
            onChange={(event) => {
              customDirtyRef.current = true;
              setCustomValue(event.target.value);
            }}
            onBlur={() => {
              window.setTimeout(() => {
                tryCommitCustomValue();
              }, 0);
            }}
            onKeyDown={(event) => {
              event.stopPropagation();
              if (event.key === "Enter") {
                event.preventDefault();
                commitCustom();
              }
            }}
            onClick={(event) => event.stopPropagation()}
            className="w-full rounded-md bg-muted/35 px-2 py-1 text-center text-sm tabular-nums outline-none transition-colors focus:bg-muted/55 focus:ring-1 focus:ring-sky-400/25"
            placeholder="0:30"
            aria-label="Custom duration"
          />
        </button>
        <div className="p-1">
          {TASK_DURATION_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.minutes}
              onPointerDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                applyDuration(option.minutes);
              }}
              className="text-xs tabular-nums"
            >
              {formatDurationMinutes(option.minutes)}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onPointerDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
              applyDuration(null);
            }}
            className="text-xs text-muted-foreground"
          >
            Clear
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
