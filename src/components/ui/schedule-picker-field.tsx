"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import {
  CalendarPanel,
  CALENDAR_PANEL_WIDTH_CLASS,
} from "@/components/ui/calendar-panel";
import {
  TimePickerPanel,
  TIME_PICKER_PANEL_WIDTH_CLASS,
} from "@/components/ui/time-picker-panel";
import { formatRelativeDateLabel, formatTimeShort } from "@/lib/date-utils";
import {
  parseTimePickerParts,
  timePickerPartsToScheduledTime,
} from "@/lib/time-picker-utils";
import { cn } from "@/lib/utils";
import { compactControlTriggerClass } from "@/lib/theme/surface-classes";

const schedulePickerTriggerClassName = cn(
  "w-full cursor-pointer justify-between gap-2 px-2",
  compactControlTriggerClass,
);

type ScheduleDatePickerFieldProps = {
  id?: string;
  value: string | null;
  onChange: (dateKey: string | null) => void;
  placeholder?: string;
  className?: string;
};

type ScheduleTimePickerFieldProps = {
  id?: string;
  value: string | null;
  onChange: (time: string | null) => void;
  placeholder?: string;
  className?: string;
};

function SchedulePickerPopover({
  open,
  onClose,
  triggerRef,
  children,
  align = "start",
  className,
}: {
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  children: ReactNode;
  align?: "start" | "end";
  className?: string;
}) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      onClose();
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [onClose, open, triggerRef]);

  if (!open) return null;

  return (
    <div
      ref={popoverRef}
      className={cn(
        "flow-surface-elevated absolute top-[calc(100%+0.375rem)] z-[120] overflow-hidden rounded-xl",
        align === "end" ? "right-0" : "left-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ScheduleDatePickerField({
  id,
  value,
  onChange,
  placeholder = "Pick date",
  className,
}: ScheduleDatePickerFieldProps) {
  const fallbackId = useId();
  const fieldId = id ?? fallbackId;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const label = value ? formatRelativeDateLabel(value) : placeholder;

  return (
    <div className={cn("relative", className)}>
      <button
        ref={triggerRef}
        id={fieldId}
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          schedulePickerTriggerClassName,
          open && "bg-control-active ring-1 ring-ring/40",
          !value && "text-muted-foreground",
        )}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span className="truncate">{label}</span>
        <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
      </button>

      <SchedulePickerPopover
        open={open}
        onClose={() => setOpen(false)}
        triggerRef={triggerRef}
        className={CALENDAR_PANEL_WIDTH_CLASS}
      >
        <div className="overflow-hidden rounded-xl bg-surface-raised">
          <CalendarPanel
            value={value}
            showQuickActions
            onChange={(dateKey) => {
              onChange(dateKey);
              setOpen(false);
            }}
            onClear={() => {
              onChange(null);
              setOpen(false);
            }}
          />
        </div>
      </SchedulePickerPopover>
    </div>
  );
}

export function ScheduleTimePickerField({
  id,
  value,
  onChange,
  placeholder = "Pick time",
  className,
}: ScheduleTimePickerFieldProps) {
  const fallbackId = useId();
  const fieldId = id ?? fallbackId;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [parts, setParts] = useState(() => parseTimePickerParts(value));
  const label = value ? (formatTimeShort(value) ?? placeholder) : placeholder;

  useEffect(() => {
    if (!open) {
      setParts(parseTimePickerParts(value));
    }
  }, [open, value]);

  function commitParts(nextParts: typeof parts, close = false) {
    setParts(nextParts);
    onChange(timePickerPartsToScheduledTime(nextParts));
    if (close) {
      setOpen(false);
    }
  }

  return (
    <div className={cn("relative", className)}>
      <button
        ref={triggerRef}
        id={fieldId}
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          schedulePickerTriggerClassName,
          open && "bg-control-active ring-1 ring-ring/40",
          !value && "text-muted-foreground",
        )}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span className="truncate tabular-nums">{label}</span>
        <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
      </button>

      <SchedulePickerPopover
        open={open}
        onClose={() => setOpen(false)}
        triggerRef={triggerRef}
        align="end"
        className={TIME_PICKER_PANEL_WIDTH_CLASS}
      >
        <div className="overflow-hidden rounded-xl bg-surface-raised">
          <TimePickerPanel
            value={parts}
            hasValue={Boolean(value)}
            autoFocus
            onChange={(nextParts) => commitParts(nextParts)}
            onDone={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            onClear={() => {
              onChange(null);
              setOpen(false);
            }}
          />
        </div>
      </SchedulePickerPopover>
    </div>
  );
}
