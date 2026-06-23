"use client";

import { useCallback, useEffect, useState } from "react";
import { HabitDialog } from "@/components/habits/habit-dialog";
import { HabitList } from "@/components/habits/habit-list";
import { ErrorBanner } from "@/components/shared/error-banner";
import { PageHeader } from "@/components/shared/page-header";
import {
  createHabit,
  deleteHabit,
  fetchHabitsWithCompletions,
  HabitsError,
  toggleHabitComplete,
  updateHabit,
} from "@/lib/habits";
import type { Habit, HabitInsert } from "@/types/habit";

export function HabitsPageContent() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [completionsVersion, setCompletionsVersion] = useState(0);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const loadHabits = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchHabitsWithCompletions();
      setHabits(data);
      setCompletionsVersion((version) => version + 1);
    } catch (err) {
      setError(
        err instanceof HabitsError ? err.message : "Failed to load habits."
      );
      setHabits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  async function handleSave(input: HabitInsert, habitId?: string) {
    if (habitId) {
      const updated = await updateHabit(habitId, input);
      setHabits((prev) =>
        prev.map((h) => (h.id === updated.id ? updated : h))
      );
      return;
    }

    const created = await createHabit(input);
    setHabits((prev) => [created, ...prev]);
  }

  async function handleToggleComplete(habit: Habit) {
    setPendingId(habit.id);
    setError(null);

    try {
      const updated = await toggleHabitComplete(habit);
      setHabits((prev) =>
        prev.map((h) => (h.id === updated.id ? updated : h))
      );
      setCompletionsVersion((version) => version + 1);
    } catch (err) {
      setError(
        err instanceof HabitsError ? err.message : "Failed to update habit."
      );
    } finally {
      setPendingId(null);
    }
  }

  async function handleDelete(id: string) {
    setPendingId(id);
    setError(null);

    try {
      await deleteHabit(id);
      setHabits((prev) => prev.filter((h) => h.id !== id));
      setCompletionsVersion((version) => version + 1);
    } catch (err) {
      setError(
        err instanceof HabitsError ? err.message : "Failed to delete habit."
      );
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Habits"
        description="Define recurring routines here. Mark today's occurrence when due — habits stay active day after day."
        action={<HabitDialog mode="create" onSave={handleSave} />}
      />

      {error && <ErrorBanner message={error} />}

      <HabitList
        habits={habits}
        loading={loading}
        pendingId={pendingId}
        completionsVersion={completionsVersion}
        onToggleComplete={handleToggleComplete}
        onEdit={setEditingHabit}
        onDelete={handleDelete}
      />

      {editingHabit && (
        <HabitDialog
          mode="edit"
          habit={editingHabit}
          open={Boolean(editingHabit)}
          onOpenChange={(open) => {
            if (!open) setEditingHabit(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
