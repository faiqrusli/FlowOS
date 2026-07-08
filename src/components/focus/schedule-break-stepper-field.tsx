"use client";

import { ScheduleBreakDurationPicker } from "@/components/focus/schedule-break-duration-picker";
import { HoldRepeatStepButton } from "@/components/ui/stepper";
import {
  BREAK_AT_STEP_MINUTES,
  BREAK_LENGTH_STEP_MINUTES,
  MIN_BREAK_LENGTH_MINUTES,
  MAX_BREAK_LENGTH_MINUTES,
  clampBreakLengthMinutes,
} from "@/lib/focus-scheduled-break";

type ScheduleBreakStepperFieldProps =
  | {
      kind: "break-at";
      value: number;
      onChange: (minutes: number) => void;
      min: number;
      currentFocusMinutes: number;
    }
  | {
      kind: "break-length";
      value: number | null;
      onChange: (minutes: number | null) => void;
      currentFocusMinutes?: number;
    };

const STEP_BUTTON_CLASS = "min-w-9 px-1.5 text-xs font-medium tabular-nums";

export function ScheduleBreakStepperField(props: ScheduleBreakStepperFieldProps) {
  if (props.kind === "break-at") {
    const { value, onChange, min, currentFocusMinutes } = props;

    return (
      <div className="inline-flex items-center gap-3">
        <HoldRepeatStepButton
          ariaLabel="Decrease break at by 5 minutes"
          disabled={value <= min}
          className={STEP_BUTTON_CLASS}
          onStep={() => onChange(Math.max(min, value - BREAK_AT_STEP_MINUTES))}
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
          ariaLabel="Increase break at by 5 minutes"
          className={STEP_BUTTON_CLASS}
          onStep={() => onChange(value + BREAK_AT_STEP_MINUTES)}
        >
          {`+${BREAK_AT_STEP_MINUTES}`}
        </HoldRepeatStepButton>
      </div>
    );
  }

  const { value, onChange } = props;

  return (
    <div className="inline-flex items-center gap-3">
      <HoldRepeatStepButton
        ariaLabel="Decrease break length by 5 minutes"
        disabled={value == null || value <= MIN_BREAK_LENGTH_MINUTES}
        className={STEP_BUTTON_CLASS}
        onStep={() => {
          if (value == null) return;
          onChange(
            clampBreakLengthMinutes(value - BREAK_LENGTH_STEP_MINUTES)
          );
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
        ariaLabel="Increase break length by 5 minutes"
        className={STEP_BUTTON_CLASS}
        disabled={value != null && value >= MAX_BREAK_LENGTH_MINUTES}
        onStep={() => {
          onChange(
            clampBreakLengthMinutes(
              value == null ? MIN_BREAK_LENGTH_MINUTES : value + BREAK_LENGTH_STEP_MINUTES
            )
          );
        }}
      >
        {`+${BREAK_LENGTH_STEP_MINUTES}`}
      </HoldRepeatStepButton>
    </div>
  );
}
