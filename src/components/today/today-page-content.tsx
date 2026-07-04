"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DashboardCommandHeader } from "@/components/dashboard/dashboard-command-header";
import {
  DashboardKpiStrip,
  type KpiCellKey,
} from "@/components/dashboard/dashboard-kpi-strip";
import { DashboardNextAction } from "@/components/dashboard/dashboard-next-action";
import { DashboardCommandSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { ErrorBanner } from "@/components/shared/error-banner";
import type { WorkplaceHabitsCardHandle } from "@/components/workplace/workplace-habits-card";
import type { WorkplaceTasksCardHandle } from "@/components/workplace/workplace-tasks-card";
import { WorkplacePageContent } from "@/components/workplace/workplace-page-content";
import { useFocusSessionContext } from "@/contexts/focus-session-context";
import { useGlobalRightSidebar } from "@/contexts/global-right-sidebar-context";
import {
  computeOnTrackStatus,
  getNextActionRecommendation,
  type NextAction,
} from "@/lib/dashboard-command";
import { DashboardError, fetchDashboardData } from "@/lib/dashboard";
import { toggleHabitComplete } from "@/lib/habits";
import { toggleTaskComplete } from "@/lib/tasks";
import {
  scrollToTodayTarget,
  TODAY_FOCUS_ANCHOR_ID,
  TODAY_HABITS_SECTION_ID,
  TODAY_TASKS_SECTION_ID,
  todayHabitAnchorId,
  todayTaskAnchorId,
} from "@/lib/today-in-place";
import { getUserDisplayName } from "@/lib/user-profile";
import { createClient } from "@/lib/supabase/client";
import { type } from "@/lib/typography";
import { cn } from "@/lib/utils";
import type { DashboardData } from "@/types/dashboard";
import type { Habit } from "@/types/habit";
import type { Task } from "@/types/task";

export function TodayPageContent() {
  const { dashboardActive, prepareFocusTarget, quick } = useFocusSessionContext();
  const { openReflection, requestQuickCapture } = useGlobalRightSidebar();
  const tasksTabRef = useRef<WorkplaceTasksCardHandle>(null);
  const habitsTabRef = useRef<WorkplaceHabitsCardHandle>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [displayName, setDisplayName] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        err instanceof DashboardError ? err.message : "Failed to load today."
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
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
        href: "#",
        actionLabel: "Add task",
        type: "empty" as const,
        inPlaceAction: "open-capture" as const,
      };
    }

    return getNextActionRecommendation(
      data.tasks,
      data.habits,
      data.timeline,
      data.reflection,
      data.progress.focusSeconds,
      { hasActiveFocus: dashboardActive.isActive, forToday: true }
    );
  }, [data, dashboardActive.isActive]);

  const nextActionTargetCompleted = useMemo(() => {
    if (!data || !nextAction.entityId) return false;
    if (nextAction.type === "task") {
      return (
        data.tasks.find((item) => item.id === nextAction.entityId)?.completed ??
        false
      );
    }
    if (nextAction.type === "habit") {
      return (
        data.habits.find((item) => item.id === nextAction.entityId)
          ?.completed ?? false
      );
    }
    return false;
  }, [data, nextAction.entityId, nextAction.type]);

  const scrollToTask = useCallback(
    (taskId: string, fallbackTargetId?: string | null) => {
      if (tasksTabRef.current?.ensureTaskVisible(taskId)) return;

      const targetId = fallbackTargetId ?? todayTaskAnchorId(taskId);
      if (scrollToTodayTarget(targetId)) return;

      scrollToTodayTarget(TODAY_TASKS_SECTION_ID);
    },
    []
  );

  const scrollToHabit = useCallback(
    (habitId: string, fallbackTargetId?: string | null) => {
      if (habitsTabRef.current?.ensureHabitVisible(habitId)) return;

      const targetId = fallbackTargetId ?? todayHabitAnchorId(habitId);
      if (scrollToTodayTarget(targetId)) return;

      scrollToTodayTarget(TODAY_HABITS_SECTION_ID);
    },
    []
  );

  const handleNextAction = useCallback(
    (action: NextAction) => {
      switch (action.inPlaceAction) {
        case "scroll-to-task": {
          if (action.entityId) {
            scrollToTask(
              action.entityId,
              action.scrollTargetId ?? todayTaskAnchorId(action.entityId)
            );
          } else {
            scrollToTodayTarget(TODAY_TASKS_SECTION_ID);
          }
          return;
        }
        case "scroll-to-habit": {
          if (action.entityId) {
            scrollToHabit(
              action.entityId,
              action.scrollTargetId ?? todayHabitAnchorId(action.entityId)
            );
          } else {
            scrollToTodayTarget(TODAY_HABITS_SECTION_ID);
          }
          return;
        }
        case "scroll-to-focus":
        case "continue-focus":
          scrollToTodayTarget(TODAY_FOCUS_ANCHOR_ID);
          return;
        case "start-focus": {
          if (action.entityId && data) {
            const task = data.tasks.find((item) => item.id === action.entityId);
            if (task) {
              prepareFocusTarget({
                type: "task",
                id: task.id,
                label: task.title,
              });
            } else {
              prepareFocusTarget(null);
            }
          } else {
            prepareFocusTarget(null);
          }
          quick.startFocus();
          scrollToTodayTarget(TODAY_FOCUS_ANCHOR_ID);
          return;
        }
        case "open-reflection":
          openReflection();
          return;
        case "open-capture":
          requestQuickCapture();
          return;
        default:
          return;
      }
    },
    [data, openReflection, prepareFocusTarget, quick, requestQuickCapture, scrollToHabit, scrollToTask]
  );

  const handleKpiCellAction = useCallback(
    (cell: KpiCellKey) => {
      switch (cell) {
        case "tasks":
          scrollToTodayTarget(TODAY_TASKS_SECTION_ID);
          return;
        case "habits":
          scrollToTodayTarget(TODAY_HABITS_SECTION_ID);
          return;
        case "focus":
          scrollToTodayTarget(TODAY_FOCUS_ANCHOR_ID);
          return;
        case "reflection":
          openReflection();
          return;
        default:
          return;
      }
    },
    [openReflection]
  );

  async function handleToggleTask(task: Task) {
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
    }
  }

  async function handleToggleHabit(habit: Habit) {
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
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 space-y-3 px-6 pt-1 lg:pl-10">
        <DashboardCommandHeader
          displayName={displayName}
          loading={loading}
          title="Today"
          anonymousGreeting={null}
        />

        {error ? <ErrorBanner message={error} /> : null}

        {loading || !data ? (
          <DashboardCommandSkeleton />
        ) : (
          <>
            <DashboardKpiStrip
              progress={data.progress}
              reflection={data.reflection}
              onTrack={onTrack}
              onCellAction={handleKpiCellAction}
            />

            <div className={cn("flex flex-wrap gap-x-4 gap-y-1", type.meta)}>
              <Link
                href="/schedule"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Open full timeline
              </Link>
              <Link
                href="/notes"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Notes
              </Link>
            </div>

            <DashboardNextAction
              action={nextAction}
              onAction={handleNextAction}
              onQuickComplete={
                nextAction.entityId &&
                (nextAction.type === "task" || nextAction.type === "habit") &&
                !nextActionTargetCompleted
                  ? handleQuickCompleteNext
                  : undefined
              }
              completing={completingNext}
            />
          </>
        )}
      </div>

      <div className="min-h-0 flex-1">
        <WorkplacePageContent
          tasksTabRef={tasksTabRef}
          habitsTabRef={habitsTabRef}
        />
      </div>
    </div>
  );
}
