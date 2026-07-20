"use client";

import { useRef, useState } from "react";
import { Bell, BellOff, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TASK_ALERT_BEFORE_OPTIONS,
  applyClearAlert,
  applyPresetAlert,
  applySilentAlert,
  formatAlertBeforeLabel,
  formatAlertBeforeTimeInput,
  isAlertBeforeConfigured,
  parseAlertBeforeTimeInput,
} from "@/lib/task-alert-before-options";
import { requestBrowserNotificationPermissionIfNeeded } from "@/lib/browser-notifications";
import { cn } from "@/lib/utils";
import { compactControlTriggerClass } from "@/lib/theme/surface-classes";

const ALERT_MENU_COLLISION = {
  side: "shift",
  align: "shift",
} as const;

const COMPACT_TRIGGER_CLASS =
  "size-6 justify-center rounded-md hover:bg-surface-hover/80";
const COMPACT_TRIGGER_OPEN_CLASS = "bg-surface-raised";
const COMPACT_MENU_CLASS =
  "max-h-72 min-w-0 w-36 overflow-hidden rounded-xl border-border/50 !p-0 shadow-md";
const DETAIL_MENU_CLASS =
  "max-h-72 min-w-0 overflow-hidden rounded-xl border-border/50 !p-0 shadow-md w-[var(--anchor-width)] max-w-[var(--anchor-width)]";

const ALERT_CUSTOM_INPUT_CLASS =
  "w-full rounded-md bg-surface-raised px-2 py-1 text-center text-sm tabular-nums outline-none transition-colors focus:bg-surface-raised focus:ring-1 focus:ring-primary/40";

type TaskAlertBeforePickerProps = {
  notificationEnabled: boolean;
  leadMinutes: number | null;
  onChange: (updates: {
    notification_enabled: boolean;
    notification_lead_minutes: number | null;
  }) => void;
  variant?: "task-row" | "detail";
  className?: string;
  onOpenChange?: (open: boolean) => void;
};

type AlertBeforeCustomInputProps = {
  notificationEnabled: boolean;
  leadMinutes: number | null;
  onCommit: (minutes: number) => void;
  onCommitDone?: () => void;
  className?: string;
};

export function AlertBeforeCustomInput({
  notificationEnabled,
  leadMinutes,
  onCommit,
  onCommitDone,
  className,
}: AlertBeforeCustomInputProps) {
  const configured = isAlertBeforeConfigured(notificationEnabled, leadMinutes);
  const [customValue, setCustomValue] = useState(() =>
    configured && leadMinutes
      ? formatAlertBeforeTimeInput(leadMinutes)
      : "0:05",
  );
  const customDirtyRef = useRef(false);

  function tryCommitCustomValue() {
    if (!customDirtyRef.current) return;

    const parsed = parseAlertBeforeTimeInput(customValue);
    if (parsed === null) return;
    if (parsed !== leadMinutes) {
      onCommit(parsed);
    }
    customDirtyRef.current = false;
  }

  function commitCustom() {
    tryCommitCustomValue();
    onCommitDone?.();
  }

  return (
    <div
      data-no-task-drag
      onMouseDown={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        (
          event.currentTarget.querySelector("input") as HTMLInputElement | null
        )?.focus();
        (
          event.currentTarget.querySelector("input") as HTMLInputElement | null
        )?.select();
      }}
      className={cn(
        "flex w-full border-b border-border/60 px-2 py-1.5 hover:bg-surface-hover",
        className,
      )}
    >
      <input
        type="text"
        value={customValue}
        onFocus={(event) => {
          event.currentTarget.select();
        }}
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
        onMouseDown={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
        className={ALERT_CUSTOM_INPUT_CLASS}
        placeholder="0:05"
        aria-label="Custom alert before"
      />
    </div>
  );
}

export function TaskAlertBeforePicker({
  notificationEnabled,
  leadMinutes,
  onChange,
  variant = "task-row",
  className,
  onOpenChange,
}: TaskAlertBeforePickerProps) {
  const [open, setOpen] = useState(false);
  const isTaskRow = variant === "task-row";
  const isDetail = variant === "detail";
  const configured = isAlertBeforeConfigured(notificationEnabled, leadMinutes);
  const detailLabel = formatAlertBeforeLabel(notificationEnabled, leadMinutes);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  }

  function applySilent() {
    onChange(applySilentAlert());
    setOpen(false);
  }

  function applyClear() {
    onChange(applyClearAlert());
    void requestBrowserNotificationPermissionIfNeeded();
    setOpen(false);
  }

  function applyPreset(minutes: number) {
    onChange(applyPresetAlert(minutes));
    void requestBrowserNotificationPermissionIfNeeded();
    setOpen(false);
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
        className={cn(
          "flex shrink-0 items-center outline-none",
          isTaskRow
            ? cn(
                COMPACT_TRIGGER_CLASS,
                open && COMPACT_TRIGGER_OPEN_CLASS,
                configured
                  ? "text-primary"
                  : !notificationEnabled
                    ? "text-muted-foreground/55"
                    : "text-muted-foreground/70",
              )
            : cn(
                "w-full justify-between gap-2 px-2",
                compactControlTriggerClass,
                !configured && "text-muted-foreground",
              ),
          className,
        )}
        id={isDetail ? "task-detail-alert-before" : undefined}
        aria-label={
          isDetail
            ? `Alert before: ${detailLabel}`
            : configured
              ? `Alert before ${detailLabel}`
              : "Set alert before"
        }
      >
        {isDetail ? (
          <>
            <span className="truncate tabular-nums">{detailLabel}</span>
            <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
          </>
        ) : !notificationEnabled ? (
          <BellOff className="size-3.5 shrink-0" strokeWidth={1.75} />
        ) : (
          <Bell
            className={cn("size-3.5 shrink-0", configured && "fill-primary/15")}
            strokeWidth={1.75}
          />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="end"
        collisionAvoidance={ALERT_MENU_COLLISION}
        className={cn(isDetail ? DETAIL_MENU_CLASS : COMPACT_MENU_CLASS)}
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <AlertBeforeCustomInput
          key={open ? "open" : "closed"}
          notificationEnabled={notificationEnabled}
          leadMinutes={leadMinutes}
          onCommit={(minutes) => applyPreset(minutes)}
          onCommitDone={() => setOpen(false)}
        />
        <div className="p-1">
          <DropdownMenuItem
            onPointerDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
              applySilent();
            }}
            className={cn(
              "text-xs",
              !notificationEnabled &&
                "bg-surface-raised font-medium text-foreground",
            )}
          >
            Silent
          </DropdownMenuItem>
          {TASK_ALERT_BEFORE_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.minutes}
              onPointerDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                applyPreset(option.minutes);
              }}
              className={cn(
                "text-xs tabular-nums",
                notificationEnabled &&
                  leadMinutes === option.minutes &&
                  "bg-surface-raised font-medium text-foreground",
              )}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onPointerDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
              applyClear();
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
