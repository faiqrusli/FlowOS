"use client";

import { DaySelector } from "@/components/habits/day-selector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScheduleTimePickerField } from "@/components/ui/schedule-picker-field";
import { cn } from "@/lib/utils";

export type HabitFormValues = {
  name: string;
  scheduledTime: string;
  durationMinutes: number;
  daysOfWeek: string[];
  trackWithFocus: boolean;
};

type HabitFormFieldsProps = {
  values: HabitFormValues;
  onChange: (values: HabitFormValues) => void;
  disabled?: boolean;
};

export function HabitFormFields({
  values,
  onChange,
  disabled,
}: HabitFormFieldsProps) {
  function update<K extends keyof HabitFormValues>(
    key: K,
    value: HabitFormValues[K]
  ) {
    onChange({ ...values, [key]: value });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="habit-name">Habit name</Label>
        <Input
          id="habit-name"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="e.g. Drink water"
          disabled={disabled}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="habit-time">Scheduled time</Label>
        {/* Gate interaction locally: the picker field has no disabled prop */}
        <div inert={disabled || undefined} className={cn(disabled && "opacity-60")}>
          <ScheduleTimePickerField
            id="habit-time"
            value={values.scheduledTime || null}
            onChange={(time) =>
              // Keep the legacy "HH:mm" save format the native input produced
              update("scheduledTime", time ? time.slice(0, 5) : "")
            }
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="habit-duration">Duration (minutes)</Label>
        <Input
          id="habit-duration"
          type="number"
          min={15}
          max={240}
          step={15}
          value={values.durationMinutes}
          onChange={(e) =>
            update(
              "durationMinutes",
              Math.max(15, Math.min(240, Number.parseInt(e.target.value, 10) || 15))
            )
          }
          disabled={disabled}
        />
      </div>
      <div className="space-y-2">
        <Label>Recurring days</Label>
        <DaySelector
          value={values.daysOfWeek}
          onChange={(days) => update("daysOfWeek", days)}
          disabled={disabled}
        />
      </div>
      <label
        className={cn(
          "flex cursor-pointer items-start gap-3 rounded-lg border border-border-subtle px-3 py-2.5",
          disabled && "cursor-not-allowed opacity-60"
        )}
      >
        <input
          type="checkbox"
          checked={values.trackWithFocus}
          onChange={(event) => update("trackWithFocus", event.target.checked)}
          disabled={disabled}
          className="mt-0.5 size-4 rounded border-input"
        />
        <span className="space-y-0.5">
          <span className="block text-sm font-medium text-foreground">
            Track with Focus
          </span>
          <span className="block text-xs text-muted-foreground">
            Allow this habit to be started as a Focus Session and included in
            focus analytics.
          </span>
        </span>
      </label>
    </div>
  );
}
