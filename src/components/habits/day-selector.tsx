"use client";

import { Badge } from "@/components/ui/badge";
import { DAYS_OF_WEEK } from "@/types/habit";
import { cn } from "@/lib/utils";

type DaySelectorProps = {
  value: string[];
  onChange: (days: string[]) => void;
  disabled?: boolean;
};

export function DaySelector({ value, onChange, disabled }: DaySelectorProps) {
  function toggleDay(day: string) {
    if (disabled) return;

    onChange(
      value.includes(day)
        ? value.filter((d) => d !== day)
        : [...value, day]
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {DAYS_OF_WEEK.map((day) => {
        const selected = value.includes(day);

        return (
          <button
            key={day}
            type="button"
            disabled={disabled}
            onClick={() => toggleDay(day)}
            className={cn(
              "rounded-full transition-colors",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <Badge
              variant={selected ? "default" : "outline"}
              className={cn(
                "px-2.5",
                selected && "bg-neutral-800 text-white hover:bg-neutral-800"
              )}
            >
              {day}
            </Badge>
          </button>
        );
      })}
    </div>
  );
}
