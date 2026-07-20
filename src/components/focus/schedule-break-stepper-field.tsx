"use client";

import { useEffect, useRef } from "react";
import { ScheduleBreakDurationPicker } from "@/components/focus/schedule-break-duration-picker";
import { HoldRepeatStepButton } from "@/components/ui/stepper";
import {
  BREAK_AT_STEP_MINUTES,
  BREAK_LENGTH_STEP_MINUTES,
  MIN_BREAK_LENGTH_MINUTES,
  MAX_BREAK_LENGTH_MINUTES,
  clampBreakLengthMinutes,
} from "@/lib/focus-scheduled-break";

type BreakAtProps = {
  kind: "break-at";
  value: number;
  onChange: (minutes: number) => void;
  min: number;
  currentFocusMinutes: number;
};

type BreakLengthProps = {
  kind: "break-length";
  value: number | null;
  onChange: (minutes: number | null) => void;
  currentFocusMinutes?: number;
};

type ScheduleBreakStepperFieldProps = BreakAtProps | BreakLengthProps;

const STEP_BUTTON_CLASS = "min-w-9 px-1.5 text-xs font-medium tabular-nums";

function BreakAtStepperField({
  value,
  onChange,
  min,
  currentFocusMinutes,
}: Omit<BreakAtProps, "kind">) {
  const valueRef = useRef(value);
  const minRef = useRef(min);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);
  useEffect(() => {
    minRef.current = min;
  }, [min]);

  return (
    <div className="inline-flex items-center gap-3">
      <HoldRepeatStepButton
        ariaLabel={`Decrease break at by ${BREAK_AT_STEP_MINUTES} minutes`}
        disabled={value <= min}
        className={STEP_BUTTON_CLASS}
        onStep={() => {
          const next = Math.max(
            minRef.current,
            valueRef.current - BREAK_AT_STEP_MINUTES,
          );
          valueRef.current = next;
          onChange(next);
        }}
      >
        {`-${BREAK_AT_STEP_MINUTES}`}
      </HoldRepeatStepButton>
      <ScheduleBreakDurationPicker
        kind="break-at"
        variant="stepper"
        value={value}
        currentFocusMinutes={currentFocusMinutes}
        onChange={(minutes) => {
          if (minutes != null) onChange(minutes);
        }}
      />
      <HoldRepeatStepButton
        ariaLabel={`Increase break at by ${BREAK_AT_STEP_MINUTES} minutes`}
        className={STEP_BUTTON_CLASS}
        onStep={() => {
          const next = valueRef.current + BREAK_AT_STEP_MINUTES;
          valueRef.current = next;
          onChange(next);
        }}
      >
        {`+${BREAK_AT_STEP_MINUTES}`}
      </HoldRepeatStepButton>
    </div>
  );
}

function BreakLengthStepperField({
  value,
  onChange,
}: Omit<BreakLengthProps, "kind" | "currentFocusMinutes">) {
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  return (
    <div className="inline-flex items-center gap-3">
      <HoldRepeatStepButton
        ariaLabel={`Decrease break length by ${BREAK_LENGTH_STEP_MINUTES} minutes`}
        disabled={value == null || value <= MIN_BREAK_LENGTH_MINUTES}
        className={STEP_BUTTON_CLASS}
        onStep={() => {
          const current = valueRef.current;
          if (current == null) return;
          const next = clampBreakLengthMinutes(
            current - BREAK_LENGTH_STEP_MINUTES,
          );
          valueRef.current = next;
          onChange(next);
        }}
      >
        {`-${BREAK_LENGTH_STEP_MINUTES}`}
      </HoldRepeatStepButton>
      <ScheduleBreakDurationPicker
        kind="break-length"
        variant="stepper"
        value={value}
        onChange={onChange}
      />
      <HoldRepeatStepButton
        ariaLabel={`Increase break length by ${BREAK_LENGTH_STEP_MINUTES} minutes`}
        className={STEP_BUTTON_CLASS}
        disabled={value != null && value >= MAX_BREAK_LENGTH_MINUTES}
        onStep={() => {
          const current = valueRef.current;
          const next = clampBreakLengthMinutes(
            current == null
              ? MIN_BREAK_LENGTH_MINUTES
              : current + BREAK_LENGTH_STEP_MINUTES,
          );
          valueRef.current = next;
          onChange(next);
        }}
      >
        {`+${BREAK_LENGTH_STEP_MINUTES}`}
      </HoldRepeatStepButton>
    </div>
  );
}

export function ScheduleBreakStepperField(props: ScheduleBreakStepperFieldProps) {
  if (props.kind === "break-at") {
    return (
      <BreakAtStepperField
        value={props.value}
        onChange={props.onChange}
        min={props.min}
        currentFocusMinutes={props.currentFocusMinutes}
      />
    );
  }

  return (
    <BreakLengthStepperField value={props.value} onChange={props.onChange} />
  );
}
