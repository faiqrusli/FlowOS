"use client";

import { Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HOLD_INITIAL_DELAY_MS = 450;
const HOLD_REPEAT_INTERVAL_MS = 110;

type HoldRepeatStepButtonProps = {
  ariaLabel: string;
  disabled?: boolean;
  onStep: () => void;
  children: ReactNode;
  className?: string;
};

/** ± step control: click/keyboard for single step, pointer hold for repeat. */
export function HoldRepeatStepButton({
  ariaLabel,
  disabled,
  onStep,
  children,
  className,
}: HoldRepeatStepButtonProps) {
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

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

  const startHold = useCallback(() => {
    onStep();
    clearTimers();
    timeoutRef.current = window.setTimeout(() => {
      intervalRef.current = window.setInterval(onStep, HOLD_REPEAT_INTERVAL_MS);
    }, HOLD_INITIAL_DELAY_MS);
  }, [clearTimers, onStep]);

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      aria-label={ariaLabel}
      disabled={disabled}
      className={className}
      onClick={() => {
        if (disabled) return;
        onStep();
      }}
      onPointerDown={(event) => {
        event.preventDefault();
        if (disabled) return;
        startHold();
      }}
      onPointerUp={clearTimers}
      onPointerLeave={clearTimers}
    >
      {children}
    </Button>
  );
}

/** Value readout with brief primary flash when the displayed value changes. */
export function AnimatedStepperValue({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const [flash, setFlash] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (prevValueRef.current === value) return;
    prevValueRef.current = value;
    setFlash(true);
    const timeout = window.setTimeout(() => setFlash(false), 200);
    return () => window.clearTimeout(timeout);
  }, [value]);

  return (
    <span
      className={cn(
        "tabular-nums transition-colors duration-150",
        flash && "text-primary",
        className
      )}
    >
      {value}
    </span>
  );
}

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

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

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

  const display = formatValue ? formatValue(value) : String(value);

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <HoldRepeatStepButton
        ariaLabel={decrementLabel}
        disabled={min !== undefined && value <= min}
        onStep={() => applyStep(-1)}
      >
        <Minus />
      </HoldRepeatStepButton>
      <AnimatedStepperValue
        value={display}
        className="min-w-[6.5rem] text-center text-sm font-semibold text-foreground"
      />
      <HoldRepeatStepButton
        ariaLabel={incrementLabel}
        disabled={max !== undefined && value >= max}
        onStep={() => applyStep(1)}
      >
        <Plus />
      </HoldRepeatStepButton>
    </div>
  );
}
