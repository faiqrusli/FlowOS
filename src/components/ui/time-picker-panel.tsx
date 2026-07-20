"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TIME_PICKER_HOURS,
  TIME_PICKER_MINUTES,
  TIME_PICKER_PERIODS,
  clampHour12,
  clampMinute,
  formatTimePickerDisplayLabel,
  parseSequentialTimeDigits,
  shiftHour12,
  shiftMinute,
  toggleTimePickerPeriod,
  type TimePickerParts,
} from "@/lib/time-picker-utils";
import { cn } from "@/lib/utils";

export const TIME_PICKER_PANEL_WIDTH_CLASS = "w-[12.25rem]";

type TimeSegment = "hour" | "minute" | "period";

type TimePickerPanelProps = {
  value: TimePickerParts;
  onChange: (value: TimePickerParts) => void;
  onClear?: () => void;
  onDone?: () => void;
  onCancel?: () => void;
  hasValue?: boolean;
  autoFocus?: boolean;
  className?: string;
};

const SEGMENT_ACTIVE_CLASS =
  "rounded-md bg-primary-soft text-foreground ring-1 ring-primary/40";

function TimePickerColumn<T extends string | number>({
  items,
  value,
  onSelect,
  format,
  ariaLabel,
}: {
  items: readonly T[];
  value: T;
  onSelect: (item: T) => void;
  format: (item: T) => string;
  ariaLabel: string;
}) {
  const selectedRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    selectedRef.current?.scrollIntoView({ block: "center" });
  }, [value]);

  return (
    <div className="relative min-w-0 flex-1">
      {/* Behind the numbers — opaque overlay was hiding the selected value */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-7 -translate-y-1/2 rounded-md border border-primary/35 bg-primary-soft"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-5 bg-gradient-to-b from-surface-float to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-5 bg-gradient-to-t from-surface-float to-transparent"
      />
      <div
        aria-label={ariaLabel}
        className="time-picker-column relative z-[1] h-[7.5rem] overflow-y-auto overscroll-contain py-6"
      >
        {items.map((item) => {
          const selected = item === value;
          return (
            <button
              key={String(item)}
              ref={selected ? selectedRef : undefined}
              type="button"
              onClick={() => onSelect(item)}
              className={cn(
                "mx-auto flex h-7 w-full max-w-[2.85rem] items-center justify-center rounded-md text-xs font-medium tabular-nums transition-colors",
                selected
                  ? "text-foreground"
                  : "text-muted-foreground hover:bg-surface-hover hover:text-foreground",
              )}
              aria-pressed={selected}
            >
              {format(item)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TimePickerEditableHeader({
  value,
  onChange,
  activeSegment,
  onActiveSegmentChange,
  onDone,
  onCancel,
  autoFocus,
}: {
  value: TimePickerParts;
  onChange: (value: TimePickerParts) => void;
  activeSegment: TimeSegment;
  onActiveSegmentChange: (segment: TimeSegment) => void;
  onDone?: () => void;
  onCancel?: () => void;
  autoFocus?: boolean;
}) {
  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);
  const periodTriggerRef = useRef<HTMLButtonElement>(null);
  const replaceOnNextDigitRef = useRef(true);
  const [hourDraft, setHourDraft] = useState(String(value.hour12));
  const [minuteDraft, setMinuteDraft] = useState(
    String(value.minute).padStart(2, "0"),
  );
  const [sequentialDigits, setSequentialDigits] = useState("");
  const [periodMenuOpen, setPeriodMenuOpen] = useState(false);

  useEffect(() => {
    setHourDraft(String(value.hour12));
    setMinuteDraft(String(value.minute).padStart(2, "0"));
  }, [value.hour12, value.minute]);

  useEffect(() => {
    if (!autoFocus) return;
    const frame = requestAnimationFrame(() => {
      hourRef.current?.focus();
      hourRef.current?.select();
      replaceOnNextDigitRef.current = true;
      onActiveSegmentChange("hour");
      setSequentialDigits("");
    });
    return () => cancelAnimationFrame(frame);
  }, [autoFocus, onActiveSegmentChange]);

  function focusMinute() {
    onActiveSegmentChange("minute");
    replaceOnNextDigitRef.current = true;
    requestAnimationFrame(() => {
      minuteRef.current?.focus();
      minuteRef.current?.select();
    });
  }

  function focusPeriod() {
    onActiveSegmentChange("period");
    setSequentialDigits("");
    replaceOnNextDigitRef.current = true;
    requestAnimationFrame(() => {
      periodTriggerRef.current?.focus();
    });
  }

  function applyPeriod(period: "AM" | "PM") {
    onChange({ ...value, period });
    setSequentialDigits("");
    onDone?.();
  }

  function commitHourFromDraft(raw: string, advance = false) {
    const digits = raw.replace(/\D/g, "").slice(0, 2);
    if (!digits) {
      setHourDraft(String(value.hour12));
      return;
    }
    if (digits.length === 1 && digits === "0") {
      return;
    }
    const hour = clampHour12(Number(digits));
    onChange({ ...value, hour12: hour });
    setHourDraft(String(hour));
    if (advance) focusMinute();
  }

  function commitMinuteFromDraft(raw: string, advanceToPeriod = false) {
    const digits = raw.replace(/\D/g, "").slice(0, 2);
    if (!digits) {
      setMinuteDraft(String(value.minute).padStart(2, "0"));
      return;
    }
    const minute = clampMinute(Number(digits.padEnd(2, "0")));
    onChange({ ...value, minute });
    setMinuteDraft(String(minute).padStart(2, "0"));
    if (advanceToPeriod) focusPeriod();
  }

  function handleSequentialDigit(digit: string) {
    const nextDigits = `${sequentialDigits}${digit}`.slice(0, 4);
    setSequentialDigits(nextDigits);
    const parsed = parseSequentialTimeDigits(nextDigits, value);
    if (!parsed) return;
    onChange(parsed);
    setHourDraft(String(parsed.hour12));
    setMinuteDraft(String(parsed.minute).padStart(2, "0"));
    if (nextDigits.length >= 2) {
      onActiveSegmentChange("minute");
    }
    if (nextDigits.length === 3 || nextDigits.length === 4) {
      setSequentialDigits("");
      focusPeriod();
    }
  }

  function handleHeaderKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (/^[aApP]$/.test(event.key)) {
      event.preventDefault();
      applyPeriod(event.key.toLowerCase() === "a" ? "AM" : "PM");
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (activeSegment === "hour") {
        commitHourFromDraft(hourDraft, true);
      } else if (activeSegment === "minute") {
        commitMinuteFromDraft(minuteDraft, true);
      } else {
        setSequentialDigits("");
        onDone?.();
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setHourDraft(String(value.hour12));
      setMinuteDraft(String(value.minute).padStart(2, "0"));
      setSequentialDigits("");
      onCancel?.();
      return;
    }

    if (/^\d$/.test(event.key)) {
      event.preventDefault();
      if (
        activeSegment === "hour" &&
        document.activeElement === hourRef.current
      ) {
        const next = replaceOnNextDigitRef.current
          ? event.key
          : `${hourDraft}${event.key}`;
        replaceOnNextDigitRef.current = false;
        setHourDraft(next.slice(0, 2));
        commitHourFromDraft(next, next.length >= 2 || Number(next) > 1);
        return;
      }
      if (
        activeSegment === "minute" &&
        document.activeElement === minuteRef.current
      ) {
        const next = replaceOnNextDigitRef.current
          ? event.key
          : `${minuteDraft}${event.key}`;
        replaceOnNextDigitRef.current = false;
        setMinuteDraft(next.slice(0, 2));
        if (next.length >= 2) {
          commitMinuteFromDraft(next, true);
          setSequentialDigits("");
        }
        return;
      }
      handleSequentialDigit(event.key);
      return;
    }

    if (activeSegment === "period") {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        onChange({
          ...value,
          period: toggleTimePickerPeriod(value.period),
        });
      }
    }
  }

  const periodLabel = value.period === "AM" ? "a.m." : "p.m.";

  return (
    <div
      className="border-b border-border/50 px-2 py-2"
      onKeyDown={handleHeaderKeyDown}
    >
      <div
        className="flex items-center justify-center gap-0.5 rounded-lg bg-surface-8 px-2 py-1.5 ring-1 ring-border-subtle"
        aria-label={`Time ${formatTimePickerDisplayLabel(value)}`}
      >
        <input
          ref={hourRef}
          type="text"
          inputMode="numeric"
          value={hourDraft}
          onChange={(event) =>
            setHourDraft(event.target.value.replace(/\D/g, "").slice(0, 2))
          }
          onFocus={(event) => {
            onActiveSegmentChange("hour");
            setSequentialDigits("");
            replaceOnNextDigitRef.current = true;
            event.currentTarget.select();
          }}
          onDoubleClick={(event) => event.currentTarget.select()}
          onBlur={() => commitHourFromDraft(hourDraft)}
          onKeyDown={(event) => {
            if (event.key === "ArrowUp") {
              event.preventDefault();
              const hour = shiftHour12(value.hour12, 1);
              onChange({ ...value, hour12: hour });
              setHourDraft(String(hour));
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              const hour = shiftHour12(value.hour12, -1);
              onChange({ ...value, hour12: hour });
              setHourDraft(String(hour));
            }
            if (event.key === "Tab" && !event.shiftKey) {
              event.preventDefault();
              commitHourFromDraft(hourDraft, true);
            }
          }}
          className={cn(
            "w-6 bg-transparent text-center text-sm font-semibold tabular-nums text-foreground outline-none",
            activeSegment === "hour" && SEGMENT_ACTIVE_CLASS,
          )}
          aria-label="Hour"
        />
        <span className="text-sm font-semibold text-muted-foreground">:</span>
        <input
          ref={minuteRef}
          type="text"
          inputMode="numeric"
          value={minuteDraft}
          onChange={(event) =>
            setMinuteDraft(event.target.value.replace(/\D/g, "").slice(0, 2))
          }
          onFocus={(event) => {
            onActiveSegmentChange("minute");
            setSequentialDigits("");
            replaceOnNextDigitRef.current = true;
            event.currentTarget.select();
          }}
          onDoubleClick={(event) => event.currentTarget.select()}
          onBlur={() => commitMinuteFromDraft(minuteDraft)}
          onKeyDown={(event) => {
            if (event.key === "ArrowUp") {
              event.preventDefault();
              const minute = shiftMinute(value.minute, 1);
              onChange({ ...value, minute });
              setMinuteDraft(String(minute).padStart(2, "0"));
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              const minute = shiftMinute(value.minute, -1);
              onChange({ ...value, minute });
              setMinuteDraft(String(minute).padStart(2, "0"));
            }
          }}
          className={cn(
            "w-7 bg-transparent text-center text-sm font-semibold tabular-nums text-foreground outline-none",
            activeSegment === "minute" && SEGMENT_ACTIVE_CLASS,
          )}
          aria-label="Minute"
        />
        <DropdownMenu open={periodMenuOpen} onOpenChange={setPeriodMenuOpen}>
          <DropdownMenuTrigger
            ref={periodTriggerRef}
            type="button"
            onFocus={() => onActiveSegmentChange("period")}
            onKeyDown={(event) => {
              if (/^[aApP]$/.test(event.key)) {
                event.preventDefault();
                event.stopPropagation();
                applyPeriod(event.key.toLowerCase() === "a" ? "AM" : "PM");
                return;
              }
              if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                event.preventDefault();
                onChange({
                  ...value,
                  period: toggleTimePickerPeriod(value.period),
                });
              }
              if (event.key === "Enter") {
                event.preventDefault();
                onDone?.();
              }
            }}
            className={cn(
              "ml-1 inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-sm font-semibold text-foreground outline-none hover:bg-surface-hover",
              activeSegment === "period" && SEGMENT_ACTIVE_CLASS,
            )}
            aria-label="AM or PM"
          >
            {periodLabel}
            <ChevronDown className="size-3 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-0 w-24 p-1">
            {TIME_PICKER_PERIODS.map((period) => (
              <DropdownMenuItem
                key={period}
                onClick={() => {
                  applyPeriod(period);
                  setPeriodMenuOpen(false);
                }}
                className={cn(
                  "text-xs",
                  value.period === period && "bg-surface-hover font-medium",
                )}
              >
                {period === "AM" ? "a.m." : "p.m."}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function TimePickerPanel({
  value,
  onChange,
  onClear,
  onDone,
  onCancel,
  hasValue = true,
  autoFocus = false,
  className,
}: TimePickerPanelProps) {
  const [activeSegment, setActiveSegment] = useState<TimeSegment>("hour");

  function changePeriod(period: "AM" | "PM") {
    onChange({ ...value, period });
    onDone?.();
  }

  return (
    <div
      className={cn("select-none", TIME_PICKER_PANEL_WIDTH_CLASS, className)}
    >
      <TimePickerEditableHeader
        value={value}
        onChange={onChange}
        activeSegment={activeSegment}
        onActiveSegmentChange={setActiveSegment}
        onDone={onDone}
        onCancel={onCancel}
        autoFocus={autoFocus}
      />

      <div className="flex gap-0.5 px-1.5 py-1.5">
        <TimePickerColumn
          ariaLabel="Hour"
          items={TIME_PICKER_HOURS}
          value={value.hour12}
          onSelect={(hour12) => onChange({ ...value, hour12 })}
          format={(hour) => String(hour)}
        />
        <TimePickerColumn
          ariaLabel="Minute"
          items={TIME_PICKER_MINUTES}
          value={value.minute}
          onSelect={(minute) => onChange({ ...value, minute })}
          format={(minute) => String(minute).padStart(2, "0")}
        />
        <TimePickerColumn
          ariaLabel="AM or PM"
          items={TIME_PICKER_PERIODS}
          value={value.period}
          onSelect={changePeriod}
          format={(period) => (period === "AM" ? "a.m." : "p.m.")}
        />
      </div>

      {onClear ? (
        <div className="border-t border-border/50 p-1">
          <button
            type="button"
            onClick={onClear}
            disabled={!hasValue}
            className={cn(
              "w-full rounded-md py-1 text-center text-[11px] font-medium transition-colors",
              hasValue
                ? "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                : "cursor-default text-muted-foreground/40",
            )}
          >
            Remove Time
          </button>
        </div>
      ) : null}
    </div>
  );
}
