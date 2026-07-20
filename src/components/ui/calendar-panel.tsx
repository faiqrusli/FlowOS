"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CALENDAR_WEEKDAY_LABELS,
  getCalendarMonthGrid,
  getMonthLabel,
  isTodayDateKey,
  resolveCalendarViewMonth,
  shiftMonth,
} from "@/lib/calendar-utils";
import { getTodayDateString, getTomorrowDateString } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

type CalendarPanelProps = {
  value?: string | null;
  onChange: (dateKey: string) => void;
  onClear?: () => void;
  showQuickActions?: boolean;
  className?: string;
};

export const CALENDAR_PANEL_WIDTH_CLASS = "w-[12.25rem]";

const QUICK_ACTION_BUTTON_CLASS =
  "flex flex-1 items-center justify-center rounded-md border border-border-subtle bg-surface-8 px-1.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-surface-hover";

export function CalendarPanel({
  value,
  onChange,
  onClear,
  showQuickActions = false,
  className,
}: CalendarPanelProps) {
  const today = getTodayDateString();
  const tomorrow = getTomorrowDateString();
  const initialView = resolveCalendarViewMonth(value, today);
  const [viewYear, setViewYear] = useState(initialView.year);
  const [viewMonth, setViewMonth] = useState(initialView.month);

  useEffect(() => {
    const nextView = resolveCalendarViewMonth(value, today);
    setViewYear(nextView.year);
    setViewMonth(nextView.month);
  }, [value, today]);

  const monthCells = useMemo(
    () => getCalendarMonthGrid(viewYear, viewMonth, today),
    [viewMonth, viewYear, today],
  );

  function goToMonth(delta: number) {
    const next = shiftMonth(viewYear, viewMonth, delta);
    setViewYear(next.year);
    setViewMonth(next.month);
  }

  return (
    <div className={cn("select-none", CALENDAR_PANEL_WIDTH_CLASS, className)}>
      {showQuickActions ? (
        <div className="grid grid-cols-2 gap-1 border-b border-border/50 p-1.5">
          <button
            type="button"
            onClick={() => onChange(today)}
            className={cn(
              QUICK_ACTION_BUTTON_CLASS,
              value === today &&
                "border-primary/40 bg-primary-soft font-semibold ring-1 ring-primary/30",
            )}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => onChange(tomorrow)}
            className={cn(
              QUICK_ACTION_BUTTON_CLASS,
              value === tomorrow &&
                "border-primary/40 bg-primary-soft font-semibold ring-1 ring-primary/30",
            )}
          >
            Tomorrow
          </button>
        </div>
      ) : null}

      <div className="px-1.5 pb-0.5 pt-1">
        <div className="mb-1 flex items-center justify-between gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="size-6 shrink-0"
            onClick={() => goToMonth(-1)}
            aria-label="Previous month"
          >
            <ChevronLeft className="size-3" />
          </Button>
          <span className="min-w-0 flex-1 truncate text-center text-xs font-semibold text-foreground">
            {getMonthLabel(viewYear, viewMonth)}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="size-6 shrink-0"
            onClick={() => goToMonth(1)}
            aria-label="Next month"
          >
            <ChevronRight className="size-3" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-px">
          {CALENDAR_WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="flex h-4 items-center justify-center text-[9px] font-medium text-muted-foreground"
            >
              {label}
            </div>
          ))}

          {monthCells.map((cell) => {
            const selected = value === cell.dateKey;
            const isToday = isTodayDateKey(cell.dateKey, today);

            return (
              <button
                key={cell.dateKey}
                type="button"
                onClick={() => onChange(cell.dateKey)}
                className={cn(
                  "mx-auto flex size-6 items-center justify-center rounded-md text-[11px] font-medium transition-colors",
                  !cell.inMonth && "text-muted-foreground/45",
                  cell.inMonth &&
                    !selected &&
                    "text-foreground/85 hover:bg-surface-hover hover:text-foreground",
                  selected &&
                    "bg-primary-soft font-semibold text-foreground ring-1 ring-primary/40 hover:bg-primary-soft",
                  !selected && isToday && "ring-1 ring-primary/40 ring-inset",
                )}
                aria-label={cell.dateKey}
                aria-pressed={selected}
              >
                {cell.day}
              </button>
            );
          })}
        </div>
      </div>

      {onClear ? (
        <div className="border-t border-border/50 p-1">
          <button
            type="button"
            onClick={onClear}
            disabled={!value}
            className={cn(
              "w-full rounded-md py-1 text-center text-[11px] font-medium transition-colors",
              value
                ? "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                : "cursor-default text-muted-foreground/40",
            )}
          >
            Remove Date
          </button>
        </div>
      ) : null}
    </div>
  );
}
