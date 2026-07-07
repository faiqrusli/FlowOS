"use client";

import { Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HOLD_INITIAL_DELAY_MS = 450;
const HOLD_REPEAT_INTERVAL_MS = 110;

type NumberStepperProps = {
  value: number;
  step?: number;
  min?: number;
  max?: number;
  onChange: (next: number) => void;
  formatValue?: (value: number) => string;
  decrementLabel: string;
  incrementLabel: string;
  className?: string;
};

/** ± number control with click-and-hold-to-repeat. Reusable — no domain knowledge. */
export function NumberStepper({
  value,
  step = 1,
  min,
  max,
  onChange,
  formatValue,
  decrementLabel,
  incrementLabel,
  className,
}: NumberStepperProps) {
  const valueRef = useRef(value);
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const applyStep = useCallback(
    (direction: 1 | -1) => {
      const next = valueRef.current + direction * step;
      const clamped = Math.min(
        max ?? Number.POSITIVE_INFINITY,
        Math.max(min ?? Number.NEGATIVE_INFINITY, next)
      );
      if (clamped === valueRef.current) return;
      valueRef.current = clamped;
      onChange(clamped);
    },
    [max, min, onChange, step]
  );

  const startHold = useCallback(
    (direction: 1 | -1) => {
      applyStep(direction);
      clearTimers();
      timeoutRef.current = window.setTimeout(() => {
        intervalRef.current = window.setInterval(() => {
          applyStep(direction);
        }, HOLD_REPEAT_INTERVAL_MS);
      }, HOLD_INITIAL_DELAY_MS);
    },
    [applyStep, clearTimers]
  );

  const display = formatValue ? formatValue(value) : String(value);

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label={decrementLabel}
        disabled={min !== undefined && value <= min}
        onPointerDown={(event) => {
          event.preventDefault();
          startHold(-1);
        }}
        onPointerUp={clearTimers}
        onPointerLeave={clearTimers}
      >
        <Minus />
      </Button>
      <span className="min-w-[6.5rem] text-center text-sm font-semibold tabular-nums text-foreground transition-[color] duration-150">
        {display}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label={incrementLabel}
        disabled={max !== undefined && value >= max}
        onPointerDown={(event) => {
          event.preventDefault();
          startHold(1);
        }}
        onPointerUp={clearTimers}
        onPointerLeave={clearTimers}
      >
        <Plus />
      </Button>
    </div>
  );
}
