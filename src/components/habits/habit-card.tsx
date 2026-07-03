"use client";

import { Check, Crosshair, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatDaysOfWeek,
  isHabitScheduledToday,
} from "@/lib/habits";
import { formatHabitTimeRangeWithDuration } from "@/lib/habit-duration";
import { getHabitDurationMinutes } from "@/lib/schedule-durations";
import { cn } from "@/lib/utils";
import type { Habit, HabitStats } from "@/types/habit";

type HabitCardProps = {
  habit: Habit;
  stats: HabitStats;
  disabled?: boolean;
  showTodayStatus?: boolean;
  onToggleComplete: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
};

function formatStreakLabel(streak: number): string {
  if (streak === 1) return "🔥 1 day streak";
  return `🔥 ${streak} day streak`;
}

export function HabitCard({
  habit,
  stats,
  disabled,
  showTodayStatus = true,
  onToggleComplete,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const scheduledToday = isHabitScheduledToday(habit);
  const duration = getHabitDurationMinutes(habit.id);
  const time = formatHabitTimeRangeWithDuration(habit.scheduled_time, duration);
  const daysLabel = formatDaysOfWeek(habit.days_of_week);

  return (
    <Card
      className={cn(
        scheduledToday &&
          habit.completed &&
          "border-green-200 bg-green-50/40 ring-green-200/60 dark:border-green-400/30 dark:bg-green-500/10 dark:ring-green-400/25"
      )}
    >
      <CardContent className="space-y-4 py-4">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-foreground">{habit.name}</p>
              {habit.track_with_focus ? (
                <span
                  className="inline-flex items-center gap-1 rounded-md bg-violet-100/90 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"
                  title="Track with Focus enabled"
                >
                  <Crosshair className="size-3" />
                  Focus
                </span>
              ) : (
                <span className="rounded-md bg-muted/55 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  No focus tracking
                </span>
              )}
            </div>

            <div className="space-y-0.5">
              <p
                className={cn(
                  "text-sm font-medium",
                  stats.streak > 0 ? "text-orange-600" : "text-muted-foreground"
                )}
              >
                {formatStreakLabel(stats.streak)}
              </p>
              <p className="text-xs text-muted-foreground">
                {stats.completionRate}% completion · last 30 days
              </p>
            </div>

            {time && (
              <p className="text-sm text-muted-foreground">{time}</p>
            )}

            <div className="flex flex-wrap gap-1">
              {(habit.days_of_week ?? []).length > 0 ? (
                habit.days_of_week!.map((day) => (
                  <span
                    key={day}
                    className="rounded-md bg-muted/55 px-2 py-0.5 text-[10px] font-medium text-foreground/85"
                  >
                    {day}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">{daysLabel}</span>
              )}
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={disabled}
              onClick={() => onEdit(habit)}
              aria-label={`Edit "${habit.name}"`}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={disabled}
              className="text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(habit.id)}
              aria-label={`Delete "${habit.name}"`}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>

        {showTodayStatus && scheduledToday ? (
          <div className="rounded-lg border border-border/50/80 bg-card px-3 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Today&apos;s status
            </p>
            {habit.completed ? (
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                  <Check className="size-4" strokeWidth={2.5} />
                  Completed today
                </div>
                <p className="text-xs text-muted-foreground">
                  This habit stays active — it&apos;s due again tomorrow.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled}
                  onClick={() => onToggleComplete(habit)}
                  className="mt-1"
                >
                  Undo today
                </Button>
              </div>
            ) : (
              <div className="mt-2 space-y-2">
                <p className="text-sm text-foreground/85">
                  Mark today&apos;s occurrence when you&apos;re done.
                </p>
                <Button
                  type="button"
                  size="sm"
                  disabled={disabled}
                  onClick={() => onToggleComplete(habit)}
                  className="rounded-full"
                >
                  Mark complete
                </Button>
              </div>
            )}
          </div>
        ) : showTodayStatus ? (
          <p className="rounded-lg border border-dashed border-border/50 bg-card/60 px-3 py-2 text-xs text-muted-foreground">
            Not scheduled today. Manage the routine above — no checkbox needed.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
