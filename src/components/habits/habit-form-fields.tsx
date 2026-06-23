"use client";

import { DaySelector } from "@/components/habits/day-selector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type HabitFormValues = {
  name: string;
  scheduledTime: string;
  daysOfWeek: string[];
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
        <Input
          id="habit-time"
          type="time"
          value={values.scheduledTime}
          onChange={(e) => update("scheduledTime", e.target.value)}
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
    </div>
  );
}
