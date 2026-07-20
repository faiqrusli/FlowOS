"use client";

import { Check, Crosshair, Flame, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatDaysOfWeek,
  isHabitScheduledToday,
} from "@/lib/habits";
import { formatHabitTimeRangeWithDuration } from "@/lib/habit-duration";
import { getHabitDurationMinutes } from "@/lib/schedule-durations";
import { type as typography } from "@/lib/typography";
import { cn } from "@/lib/utils";
import { DAYS_OF_WEEK, type Habit, type HabitStats } from "@/types/habit";

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
  if (streak === 1) return "1 day streak";
  return `${streak} day streak`;
}

function HabitDayStrip({ days }: { days: string[] | null }) {
  const selected = new Set(days ?? []);

  if (selected.size === 0) {
    return (
      <p className={typography.meta}>{formatDaysOfWeek(days)}</p>
    );
  }

  return (
    <div className="flex flex-wrap gap-x-2.5 gap-y-1" aria-label="Scheduled days">
      {DAYS_OF_WEEK.map((day) => {
        const active = selected.has(day);
        return (
          <span
            key={day}
            className={cn(
              "text-[11px] font-medium tabular-nums",
              active ? "text-foreground" : "text-inactive",
            )}
          >
            {day}
          </span>
        );
      })}
    </div>
  );
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

  return (
    <article
      className={cn(
        "group/habit rounded-xl bg-surface-base px-4 py-4 transition-colors duration-150",
        "hover:bg-surface-hover",
        disabled && "opacity-60",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-center gap-2 pr-1">
            <h3 className={cn(typography.contentPrimary, "min-w-0 truncate")}>
              {habit.name}
            </h3>
            {habit.track_with_focus ? (
              <span
                className="inline-flex shrink-0 items-center text-accent-text"
                title="Track with Focus enabled"
              >
                <Crosshair className="size-3.5" aria-hidden />
                <span className="sr-only">Track with Focus enabled</span>
              </span>
            ) : null}
          </div>

          <div className="space-y-1.5">
            {stats.streak > 0 ? (
              <Badge variant="status-warning" className="gap-1">
                <Flame className="size-3" aria-hidden />
                {formatStreakLabel(stats.streak)}
              </Badge>
            ) : (
              <p className={cn(typography.metaMedium, "flex items-center gap-1")}>
                <Flame className="size-3 text-inactive" aria-hidden />
                {formatStreakLabel(stats.streak)}
              </p>
            )}
            <p className={typography.meta}>
              {stats.completionRate}% completion · last 30 days
            </p>
          </div>

          {time ? (
            <p className="text-sm text-foreground-secondary">{time}</p>
          ) : null}

          <HabitDayStrip days={habit.days_of_week} />
        </div>

        <div className="flex shrink-0 flex-col gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={disabled}
            onClick={() => onEdit(habit)}
            aria-label={`Edit "${habit.name}"`}
            className="text-muted-foreground hover:text-foreground"
          >
            <Pencil className="size-3.5" />
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
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>

      {showTodayStatus && scheduledToday ? (
        <div className="mt-4 space-y-2 border-t border-divider pt-3">
          <p className={typography.sectionLabel}>Today&apos;s status</p>
          {habit.completed ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-success">
                <Check className="size-4" strokeWidth={2.5} />
                Completed today
              </div>
              <p className={typography.meta}>
                This habit stays active — it&apos;s due again tomorrow.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                onClick={() => onToggleComplete(habit)}
              >
                Undo today
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-foreground-secondary">
                Mark today&apos;s occurrence when you&apos;re done.
              </p>
              <Button
                type="button"
                size="sm"
                disabled={disabled}
                onClick={() => onToggleComplete(habit)}
              >
                Mark complete
              </Button>
            </div>
          )}
        </div>
      ) : showTodayStatus ? (
        <p className={cn(typography.meta, "mt-4")}>
          Not scheduled today. Manage the routine above — no checkbox needed.
        </p>
      ) : null}
    </article>
  );
}
