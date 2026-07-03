"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatHabitTimeRangeWithDuration } from "@/lib/habit-duration";
import { getHabitDurationMinutes } from "@/lib/schedule-durations";
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
    getHabitDurationMinutes(habit.id)
  );

  return (
    <li className="flex items-start gap-2 text-sm">
      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        className={cn(
          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
          habit.completed
            ? "border-warning bg-warning text-background"
            : "border-muted-foreground/45 bg-transparent hover:border-warning/70",
          disabled && "opacity-50"
        )}
        aria-label={`Mark today's "${habit.name}" occurrence as ${habit.completed ? "incomplete" : "complete"}`}
      >
        {habit.completed && <Check className="size-2.5" strokeWidth={3} />}
      </button>
      <div className="min-w-0 flex-1 leading-tight">
        <p
          className={cn(
            "truncate font-medium text-foreground",
            habit.completed && "text-muted-foreground"
          )}
        >
          {habit.name}
        </p>
        {time && (
          <p className="truncate text-xs text-muted-foreground">
            {time}
            {habit.completed ? " · Done" : " · Due"}
          </p>
        )}
      </div>
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
    <Card>
      <CardHeader className="space-y-0.5 pb-3">
        <CardTitle className="text-base">
          Today&apos;s habits {completed}/{habits.length}
        </CardTitle>
        <p className="text-xs font-normal text-muted-foreground">
          Check off each habit you&apos;ve completed today — not the routine
          forever.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No habits scheduled for today.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 sm:gap-x-6">
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

        {showManageButton && (
          <Button
            className="w-full rounded-full"
            nativeButton={false}
            render={<Link href="/habits" />}
          >
            Manage habits
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
