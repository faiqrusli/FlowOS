"use client";

import { Check } from "lucide-react";
import {
  DashboardEmptyLine,
  DashboardPanel,
  DashboardSupportingText,
} from "@/components/dashboard/dashboard-card-shell";
import { formatHabitTimeRangeWithDuration } from "@/lib/habit-duration";
import { getHabitDurationMinutes } from "@/lib/schedule-durations";
import { sortHabitsForPreview } from "@/lib/dashboard-command";
import { type } from "@/lib/typography";
import { cn } from "@/lib/utils";
import type { Habit } from "@/types/habit";

const PREVIEW_LIMIT = 2;

type DashboardHabitsCardProps = {
  habits: Habit[];
  pendingId: string | null;
  onToggle: (habit: Habit) => void;
};

function HabitPreviewRow({
  habit,
  disabled,
  onToggle,
}: {
  habit: Habit;
  disabled: boolean;
  onToggle: () => void;
}) {
  const time = formatHabitTimeRangeWithDuration(
    habit.scheduled_time,
    getHabitDurationMinutes(habit.id)
  );

  return (
    <li className="flex items-center gap-2.5 py-1.5">
      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
          habit.completed
            ? "border-orange-600 bg-orange-600 text-white"
            : "border-muted-foreground/45 bg-transparent hover:border-orange-500/70",
          disabled && "opacity-50"
        )}
        aria-label={`Mark "${habit.name}" as ${habit.completed ? "incomplete" : "complete"}`}
      >
        {habit.completed && <Check className="size-2.5" strokeWidth={3} />}
      </button>
      <span className={cn("min-w-0 flex-1 truncate", type.contentPrimary)}>
        {habit.name}
      </span>
      {time && (
        <span className={cn("shrink-0 tabular-nums", type.meta)}>{time}</span>
      )}
    </li>
  );
}

export function DashboardHabitsCard({
  habits,
  pendingId,
  onToggle,
}: DashboardHabitsCardProps) {
  const preview = sortHabitsForPreview(habits, PREVIEW_LIMIT);
  const remaining = habits.filter((habit) => !habit.completed).length;
  const completedCount = habits.length - remaining;

  return (
    <DashboardPanel
      title="Habits"
      href="/habits"
      actionLabel="View"
      count={
        habits.length > 0
          ? { completed: completedCount, total: habits.length }
          : undefined
      }
    >
      {habits.length === 0 ? (
        <DashboardEmptyLine message="No habits today." />
      ) : remaining === 0 ? (
        <DashboardEmptyLine message="All habits complete for today." />
      ) : (
        <>
          <ul className="space-y-0.5">
            {preview.map((habit) => (
              <HabitPreviewRow
                key={habit.id}
                habit={habit}
                disabled={pendingId === habit.id}
                onToggle={() => onToggle(habit)}
              />
            ))}
          </ul>
          {remaining > PREVIEW_LIMIT && (
            <DashboardSupportingText>
              +{remaining - PREVIEW_LIMIT} more
            </DashboardSupportingText>
          )}
        </>
      )}
    </DashboardPanel>
  );
}
