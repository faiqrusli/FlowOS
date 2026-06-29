"use client";

import { useRef, useState } from "react";
import { Clock } from "lucide-react";
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

type TaskDurationPickerProps = {
  durationMinutes: number | null;
  onChange: (minutes: number | null) => void;
  compact?: boolean;
  variant?: "inline" | "task-row" | "timeline";
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

  const displayLabel =
    !isTaskRow &&
    !isTimeline &&
    durationMinutes &&
    durationMinutes > 0
      ? formatDurationMinutes(durationMinutes)
      : null;
  const timelineLabel =
    durationMinutes && durationMinutes > 0
      ? formatDurationMinutes(durationMinutes)
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
          "flex shrink-0 items-center justify-center outline-none",
          isTaskRow
            ? cn(
                "size-6 rounded-md text-sky-600 hover:bg-sky-500/10",
                open && "bg-sky-500/10"
              )
            : isTimeline
              ? cn(
                  "gap-1 rounded-md bg-transparent px-1 py-0.5 text-[11px] text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                  open && "bg-muted/30"
                )
              : cn(
                  "rounded text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  compact
                    ? "h-4 min-w-[1.25rem] px-0.5 text-[9px]"
                    : "h-5 min-w-[1.5rem] px-0.5 text-[10px]"
                ),
          className
        )}
        aria-label={
          durationMinutes && durationMinutes > 0
            ? `Duration ${formatDurationMinutes(durationMinutes)}`
            : "Set task duration"
        }
      >
        {isTimeline ? (
          <>
            <Clock
              className={cn(
                "size-3.5 shrink-0",
                timelineLabel
                  ? "text-sky-600"
                  : "text-muted-foreground/40"
              )}
              strokeWidth={1.75}
            />
            {timelineLabel ? (
              <span className="tabular-nums">{timelineLabel}</span>
            ) : null}
          </>
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
        side={isTaskRow || isTimeline ? "bottom" : "left"}
        align={isTaskRow || isTimeline ? "center" : "start"}
        className="max-h-64 w-36 overflow-y-auto rounded-xl border-border/50 p-0 shadow-md"
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
              className="text-xs"
            >
              {option.label}
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
