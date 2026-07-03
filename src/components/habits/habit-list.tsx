"use client";

import { useMemo } from "react";
import { HabitCard } from "@/components/habits/habit-card";
import { HabitsTodayChecklistCard } from "@/components/habits/habits-today-checklist-card";
import { EntityGridSkeleton } from "@/components/shared/entity-grid-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  useHabitDailyScheduleStore,
  withHabitScheduleForDate,
} from "@/lib/habit-daily-schedule-store";
import { getTodayDateString } from "@/lib/date-utils";
import {
  computeHabitStatsMap,
  getCachedHabitCompletions,
  isHabitScheduledToday,
} from "@/lib/habits";
import type { Habit } from "@/types/habit";

type HabitListProps = {
  habits: Habit[];
  loading: boolean;
  pendingId: string | null;
  completionsVersion: number;
  onToggleComplete: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
};

export function HabitList({
  habits,
  loading,
  pendingId,
  completionsVersion,
  onToggleComplete,
  onEdit,
  onDelete,
}: HabitListProps) {
  const habitScheduleRevision = useHabitDailyScheduleStore();
  const todayKey = getTodayDateString();
  const statsMap = useMemo(
    () => computeHabitStatsMap(habits, getCachedHabitCompletions()),
    [habits, completionsVersion]
  );
  const dueToday = useMemo(
    () => habits.filter((habit) => isHabitScheduledToday(habit)),
    [habits]
  );
  const dueTodayDisplay = useMemo(
    () => withHabitScheduleForDate(dueToday, todayKey),
    [dueToday, todayKey, habitScheduleRevision]
  );

  if (loading) {
    return <EntityGridSkeleton />;
  }

  if (habits.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          No habits yet. Click Add Habit to build your routine.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <HabitsTodayChecklistCard
        habits={dueTodayDisplay}
        pendingId={pendingId}
        onToggle={onToggleComplete}
      />

      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-medium text-foreground">All habits</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Edit schedules and manage your routines below.
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {habits.map((habit) => (
            <li key={habit.id}>
              <HabitCard
                habit={habit}
                stats={
                  statsMap[habit.id] ?? { streak: 0, completionRate: 0 }
                }
                disabled={pendingId === habit.id}
                showTodayStatus={false}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
