"use client";

import { useCallback, useEffect, useState } from "react";
import { HabitDialog } from "@/components/habits/habit-dialog";
import { HabitList } from "@/components/habits/habit-list";
import { ErrorBanner } from "@/components/shared/error-banner";
import { PageHeader } from "@/components/shared/page-header";
import { useActionToast } from "@/contexts/action-toast-context";
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
  const { showActionToast } = useActionToast();
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

  async function handleSave(input: HabitInsert, habitId?: string): Promise<Habit> {
    if (habitId) {
      const updated = await updateHabit(habitId, input);
      setHabits((prev) =>
        prev.map((h) => (h.id === updated.id ? updated : h))
      );
      return updated;
    }

    const created = await createHabit(input);
    setHabits((prev) => [created, ...prev]);
    showActionToast({
      message: "Habit created",
      tone: "success",
      icon: "habit",
    });
    return created;
  }

  async function handleToggleComplete(
    habit: Habit,
    options?: { silent?: boolean },
  ) {
    setPendingId(habit.id);
    setError(null);

    try {
      const updated = await toggleHabitComplete(habit);
      setHabits((prev) =>
        prev.map((h) => (h.id === updated.id ? updated : h))
      );
      setCompletionsVersion((version) => version + 1);
      if (!options?.silent) {
        showActionToast({
          message: updated.completed
            ? "Habit marked complete"
            : "Habit unmarked",
          tone: updated.completed ? "success" : "neutral",
          icon: "habit",
          actionLabel: "Undo",
          onAction: () => {
            void handleToggleComplete(updated, { silent: true });
          },
        });
      }
    } catch (err) {
      setError(
        err instanceof HabitsError ? err.message : "Failed to update habit."
      );
    } finally {
      setPendingId(null);
    }
  }

  async function handleDelete(id: string) {
    const snapshot = habits.find((habit) => habit.id === id);
    if (!snapshot) return;

    setPendingId(id);
    setError(null);
    setHabits((prev) => prev.filter((h) => h.id !== id));

    let committed = false;
    const commitDelete = () => {
      if (committed) return;
      committed = true;
      void deleteHabit(id)
        .then(() => {
          setCompletionsVersion((version) => version + 1);
        })
        .catch((err) => {
          setHabits((prev) => [snapshot, ...prev]);
          setError(
            err instanceof HabitsError ? err.message : "Failed to delete habit.",
          );
        })
        .finally(() => {
          setPendingId(null);
        });
    };

    setPendingId(null);
    showActionToast({
      message: "Habit deleted",
      icon: "trash",
      actionLabel: "Undo",
      onAction: () => {
        committed = true;
        setHabits((prev) => [snapshot, ...prev]);
      },
      onExpire: commitDelete,
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Habits"
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
