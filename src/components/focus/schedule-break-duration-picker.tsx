"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatedStepperValue } from "@/components/ui/stepper";
import {
  BREAK_AT_VISIBLE_ROWS,
  BREAK_LENGTH_PRESET_MINUTES,
  formatBreakAtMinutes,
  formatBreakLengthMinutes,
  MAX_BREAK_LENGTH_MINUTES,
  clampBreakLengthMinutes,
  getBreakAtMenuOptions,
  getMinBreakAtMinutes,
  type BreakAtMenuOption,
} from "@/lib/focus-scheduled-break";
import {
  formatDurationTimeInput,
  parseDurationTimeInput,
} from "@/lib/task-duration-options";
import { cn } from "@/lib/utils";

const MENU_COLLISION = { side: "shift", align: "shift" } as const;
const STEP_MENU_CLASS =
  "max-h-64 min-w-0 w-36 overflow-y-auto rounded-xl border-border/50 p-0 shadow-md";

type ScheduleBreakDurationPickerProps = {
  kind: "break-at" | "break-length";
  value: number | null;
  onChange: (minutes: number | null) => void;
  currentFocusMinutes?: number;
  variant?: "detail" | "stepper";
  className?: string;
};

function breakAtOptionLabel(option: BreakAtMenuOption): string {
  if (option.kind === "extend") return option.label;
  return formatBreakAtMinutes(option.minutes);
}

export function ScheduleBreakDurationPicker({
  kind,
  value,
  onChange,
  currentFocusMinutes = 0,
  variant = "detail",
  className,
}: ScheduleBreakDurationPickerProps) {
  const [open, setOpen] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const customDirtyRef = useRef(false);
  const isBreakAt = kind === "break-at";
  const isStepper = variant === "stepper";

  const minBreakAt = useMemo(
    () => getMinBreakAtMinutes(currentFocusMinutes),
    [currentFocusMinutes],
  );

  const breakAtOptions = useMemo(
    () => (isBreakAt ? getBreakAtMenuOptions(currentFocusMinutes) : []),
    [currentFocusMinutes, isBreakAt],
  );

  const detailLabel = isBreakAt
    ? value != null
      ? formatBreakAtMinutes(value)
      : "Select time"
    : formatBreakLengthMinutes(value);

  function tryCommitCustomValue() {
    if (!customDirtyRef.current) return;

    const parsed = parseDurationTimeInput(customValue);
    if (parsed === null) return;

    if (isBreakAt) {
      if (parsed < minBreakAt) return;
      if (parsed !== value) onChange(parsed);
    } else if (parsed !== value) {
      onChange(clampBreakLengthMinutes(parsed));
    }
    customDirtyRef.current = false;
  }

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      customDirtyRef.current = false;
      if (isBreakAt) {
        setCustomValue(
          value != null
            ? formatDurationTimeInput(value)
            : formatDurationTimeInput(minBreakAt),
        );
      } else {
        setCustomValue(value != null ? formatDurationTimeInput(value) : "0:10");
      }
    }
    setOpen(nextOpen);
  }

  function commitCustom() {
    tryCommitCustomValue();
    setOpen(false);
  }

  function applyMinutes(minutes: number | null) {
    customDirtyRef.current = false;
    onChange(
      minutes == null || isBreakAt ? minutes : clampBreakLengthMinutes(minutes),
    );
    setOpen(false);
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger
        className={cn(
          "flex shrink-0 items-center outline-none",
          isStepper
            ? cn(
                "h-9 w-[6.5rem] justify-between rounded-lg border border-primary/35 bg-primary/10 px-2.5 text-sm font-semibold text-foreground",
                open && "ring-1 ring-primary/40",
              )
            : cn(
                "h-9 w-full items-center justify-between gap-2 rounded-lg border border-border/50 bg-background px-2 text-sm hover:bg-surface-hover/20",
                open && "ring-1 ring-ring/30",
                (value == null && !isBreakAt) || (value == null && isBreakAt)
                  ? "text-muted-foreground"
                  : "text-foreground",
              ),
          className,
        )}
        aria-label={
          isBreakAt
            ? `Break at: ${detailLabel}`
            : `Break length: ${detailLabel}`
        }
      >
        {isStepper ? (
          <AnimatedStepperValue
            value={detailLabel}
            className="truncate text-sm font-semibold"
          />
        ) : (
          <span className="truncate tabular-nums">{detailLabel}</span>
        )}
        {isStepper ? (
          <ChevronDown className="size-3 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        collisionAvoidance={MENU_COLLISION}
        className={cn(
          isStepper
            ? STEP_MENU_CLASS
            : "min-w-0 overflow-hidden rounded-xl border-border/50 p-0 shadow-md w-[var(--anchor-width)] max-w-[var(--anchor-width)]",
        )}
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            (
              event.currentTarget.querySelector(
                "input",
              ) as HTMLInputElement | null
            )?.focus();
            (
              event.currentTarget.querySelector(
                "input",
              ) as HTMLInputElement | null
            )?.select();
          }}
          className="flex w-full border-b border-border/60 px-2 py-1.5 hover:bg-surface-hover"
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
            className="w-full rounded-md bg-surface-raised px-2 py-1 text-center text-sm tabular-nums outline-none transition-colors focus:bg-surface-raised focus:ring-1 focus:ring-ring/30"
            placeholder={isBreakAt ? "1:00" : "0:10"}
            aria-label={isBreakAt ? "Custom break at" : "Custom break length"}
          />
        </button>
        <div
          className={cn(
            "overflow-y-auto p-1",
            isStepper && `max-h-[calc(${BREAK_AT_VISIBLE_ROWS}*2rem)]`,
          )}
        >
          {isBreakAt
            ? breakAtOptions.map((option) => (
                <DropdownMenuItem
                  key={`${option.kind}-${option.minutes}`}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    applyMinutes(option.minutes);
                  }}
                  className="text-xs tabular-nums"
                >
                  {breakAtOptionLabel(option)}
                </DropdownMenuItem>
              ))
            : BREAK_LENGTH_PRESET_MINUTES.map((minutes) => (
                <DropdownMenuItem
                  key={minutes}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    applyMinutes(minutes);
                  }}
                  className="text-xs tabular-nums"
                >
                  {formatBreakLengthMinutes(minutes)}
                </DropdownMenuItem>
              ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
