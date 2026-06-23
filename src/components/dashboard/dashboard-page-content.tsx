"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DashboardCommandHeader } from "@/components/dashboard/dashboard-command-header";
import { DashboardFocusCard } from "@/components/dashboard/dashboard-focus-card";
import { DashboardHabitsCard } from "@/components/dashboard/dashboard-habits-card";
import { DashboardKpiStrip } from "@/components/dashboard/dashboard-kpi-strip";
import { DashboardNextAction } from "@/components/dashboard/dashboard-next-action";
import { DashboardReflectionCard } from "@/components/dashboard/dashboard-reflection-card";
import { DashboardSchedulePreview } from "@/components/dashboard/dashboard-schedule-preview";
import { DashboardCommandSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { DashboardTasksCard } from "@/components/dashboard/dashboard-tasks-card";
import { ErrorBanner } from "@/components/shared/error-banner";
import { useFocusSessionContext } from "@/contexts/focus-session-context";
import {
  computeOnTrackStatus,
  getNextActionRecommendation,
} from "@/lib/dashboard-command";
import { DashboardError, fetchDashboardData } from "@/lib/dashboard";
import { toggleHabitComplete } from "@/lib/habits";
import { toggleTaskComplete } from "@/lib/tasks";
import { getUserDisplayName } from "@/lib/user-profile";
import { createClient } from "@/lib/supabase/client";
import type { DashboardData } from "@/types/dashboard";
import type { Habit } from "@/types/habit";
import type { Task } from "@/types/task";

export function DashboardPageContent() {
  const { dashboardActive } = useFocusSessionContext();
  const [data, setData] = useState<DashboardData | null>(null);
  const [displayName, setDisplayName] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [completingNext, setCompletingNext] = useState(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [dashboard, userResult] = await Promise.all([
        fetchDashboardData(),
        createClient().auth.getUser(),
      ]);

      setData(dashboard);
      setDisplayName(getUserDisplayName(userResult.data.user));
    } catch (err) {
      setError(
        err instanceof DashboardError ? err.message : "Failed to load dashboard."
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const onTrack = useMemo(
    () =>
      data
        ? computeOnTrackStatus(data.progress, data.reflection)
        : { label: "Fresh start", description: "", percent: 0 },
    [data]
  );

  const nextAction = useMemo(() => {
    if (!data) {
      return {
        title: "",
        description: "",
        href: "/tasks",
        actionLabel: "Add task",
        type: "empty" as const,
      };
    }

    return getNextActionRecommendation(
      data.tasks,
      data.habits,
      data.timeline,
      data.reflection,
      data.progress.focusSeconds,
      { hasActiveFocus: dashboardActive.isActive }
    );
  }, [data, dashboardActive.isActive]);

  async function handleToggleTask(task: Task) {
    setPendingId(task.id);
    setError(null);

    try {
      const updated = await toggleTaskComplete(task);
      setData((prev) => {
        if (!prev) return prev;
        const tasks = prev.tasks.map((t) => (t.id === updated.id ? updated : t));
        return {
          ...prev,
          tasks,
          progress: {
            ...prev.progress,
            tasksCompleted: tasks.filter((t) => t.completed).length,
            tasksTotal: tasks.length,
          },
          timeline: prev.timeline.map((item) =>
            item.id === `task-${updated.id}`
              ? { ...item, completed: updated.completed }
              : item
          ),
        };
      });
    } catch {
      setError("Failed to update task.");
    } finally {
      setPendingId(null);
    }
  }

  async function handleToggleHabit(habit: Habit) {
    setPendingId(habit.id);
    setError(null);

    try {
      const updated = await toggleHabitComplete(habit);
      setData((prev) => {
        if (!prev) return prev;
        const habits = prev.habits.map((h) =>
          h.id === updated.id ? updated : h
        );
        return {
          ...prev,
          habits,
          progress: {
            ...prev.progress,
            habitsCompleted: habits.filter((h) => h.completed).length,
            habitsTotal: habits.length,
          },
          timeline: prev.timeline.map((item) =>
            item.id === `habit-${updated.id}`
              ? { ...item, completed: updated.completed }
              : item
          ),
        };
      });
    } catch {
      setError("Failed to update habit.");
    } finally {
      setPendingId(null);
    }
  }

  async function handleQuickCompleteNext() {
    if (!data || !nextAction.entityId) return;

    setCompletingNext(true);
    setError(null);

    try {
      if (nextAction.type === "task") {
        const task = data.tasks.find((item) => item.id === nextAction.entityId);
        if (task) await handleToggleTask(task);
      } else if (nextAction.type === "habit") {
        const habit = data.habits.find(
          (item) => item.id === nextAction.entityId
        );
        if (habit) await handleToggleHabit(habit);
      }
    } finally {
      setCompletingNext(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <DashboardCommandHeader displayName={displayName} loading={loading} />

      {error && <ErrorBanner message={error} />}

      {loading || !data ? (
        <DashboardCommandSkeleton />
      ) : (
        <>
          <DashboardKpiStrip
            progress={data.progress}
            reflection={data.reflection}
            onTrack={onTrack}
          />

          <DashboardNextAction
            action={nextAction}
            onQuickComplete={
              nextAction.entityId &&
              (nextAction.type === "task" || nextAction.type === "habit")
                ? handleQuickCompleteNext
                : undefined
            }
            completing={completingNext}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <DashboardTasksCard
              tasks={data.tasks}
              pendingId={pendingId}
              onToggle={handleToggleTask}
            />
            <DashboardHabitsCard
              habits={data.habits}
              pendingId={pendingId}
              onToggle={handleToggleHabit}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <DashboardFocusCard stats={data.focus} />
            <DashboardReflectionCard reflection={data.reflection} />
            <DashboardSchedulePreview items={data.timeline} />
          </div>
        </>
      )}
    </div>
  );
}
