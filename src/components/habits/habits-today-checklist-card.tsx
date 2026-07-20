"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatHabitTimeRangeWithDuration } from "@/lib/habit-duration";
import { getHabitDurationMinutes } from "@/lib/schedule-durations";
import { type as typography } from "@/lib/typography";
import { cn } from "@/lib/utils";
import type { Habit } from "@/types/habit";

type HabitsTodayChecklistCardProps = {
  habits: Habit[];
  pendingId: string | null;
  onToggle: (habit: Habit) => void;
  showManageButton?: boolean;
};

function sortTodayHabits(habits: Habit[]): Habit[] {
  return [...habits].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    const aTime = a.scheduled_time ?? "99:99";
    const bTime = b.scheduled_time ?? "99:99";
    return aTime.localeCompare(bTime);
  });
}

function HabitOccurrenceRow({
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
    getHabitDurationMinutes(habit.id),
  );

  return (
    <li>
      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        className={cn(
          "flex w-full items-start gap-3 rounded-lg bg-surface-inset px-3.5 py-3 text-left transition-colors duration-150",
          "hover:bg-surface-hover",
          disabled && "opacity-50",
        )}
        aria-label={`Mark today's "${habit.name}" occurrence as ${habit.completed ? "incomplete" : "complete"}`}
      >
        <span
          className={cn(
            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
            habit.completed
              ? "border-warning bg-warning text-background"
              : "border-muted-foreground/45 bg-transparent",
          )}
          aria-hidden
        >
          {habit.completed && <Check className="size-2.5" strokeWidth={3} />}
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span
            className={cn(
              typography.contentPrimary,
              "block truncate",
              habit.completed && "text-muted-foreground",
            )}
          >
            {habit.name}
          </span>
          {time ? (
            <span className="mt-1 block truncate text-xs text-foreground-secondary">
              {time}
              {habit.completed ? " · Done" : " · Due"}
            </span>
          ) : (
            <span className="mt-1 block truncate text-xs text-foreground-secondary">
              {habit.completed ? "Done" : "Due"}
            </span>
          )}
        </span>
      </button>
    </li>
  );
}

export function HabitsTodayChecklistCard({
  habits,
  pendingId,
  onToggle,
  showManageButton = false,
}: HabitsTodayChecklistCardProps) {
  const sorted = sortTodayHabits(habits);
  const completed = habits.filter((h) => h.completed).length;

  return (
    <section className="rounded-xl bg-surface-base px-4 py-5 sm:px-5">
      <header>
        <h2 className={typography.sectionTitle}>
          Today&apos;s habits{" "}
          <span className="font-medium tabular-nums text-foreground-secondary">
            {completed}/{habits.length}
          </span>
        </h2>
      </header>

      <div className="mt-4">
        {sorted.length === 0 ? (
          <p className={cn(typography.bodyMuted, "py-2")}>
            No habits scheduled for today.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-x-3 sm:gap-y-2">
            {sorted.map((habit) => (
              <HabitOccurrenceRow
                key={habit.id}
                habit={habit}
                disabled={pendingId === habit.id}
                onToggle={() => onToggle(habit)}
              />
            ))}
          </ul>
        )}
      </div>

      {showManageButton && (
        <Button
          className="mt-4 w-full rounded-full"
          nativeButton={false}
          render={<Link href="/habits" />}
        >
          Manage habits
        </Button>
      )}
    </section>
  );
}
