"use client";

import { useMemo } from "react";
import { HabitCard } from "@/components/habits/habit-card";
import { HabitsTodayChecklistCard } from "@/components/habits/habits-today-checklist-card";
import { EntityGridSkeleton } from "@/components/shared/entity-grid-skeleton";
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
import { type as typography } from "@/lib/typography";
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
      <div className="rounded-xl bg-surface-section px-5 py-12 text-center">
        <p className={typography.bodyMuted}>
          No habits yet. Click Add Habit to build your routine.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <HabitsTodayChecklistCard
        habits={dueTodayDisplay}
        pendingId={pendingId}
        onToggle={onToggleComplete}
      />

      <section className="space-y-4">
        <h2 className={typography.sectionTitle}>All habits</h2>
        <ul className="grid gap-3 sm:grid-cols-2 sm:gap-3">
          {habits.map((habit) => (
            <li key={habit.id} className="min-w-0">
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
