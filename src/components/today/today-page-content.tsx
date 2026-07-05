"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type KpiCellKey,
} from "@/components/dashboard/dashboard-kpi-strip";
import { ErrorBanner } from "@/components/shared/error-banner";
import { TodayNowSlot } from "@/components/today/today-now-slot";
import { TodayStatusRail } from "@/components/today/today-status-rail";
import type { WorkplaceHabitsCardHandle } from "@/components/workplace/workplace-habits-card";
import type { WorkplaceTasksCardHandle } from "@/components/workplace/workplace-tasks-card";
import { WorkplacePageContent } from "@/components/workplace/workplace-page-content";
import { useFocusSessionContext } from "@/contexts/focus-session-context";
import { useGlobalRightSidebar } from "@/contexts/global-right-sidebar-context";
import { useWorkplaceDensity } from "@/hooks/use-workplace-density";
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
import {
  clearDismissedKey,
  dismissKey,
  readDismissedKey,
  writeDismissedKey,
} from "@/lib/next-action-dismiss";
import { isTodayUnifiedQueueEnabled } from "@/lib/today-unified-queue";
import {
  shouldShowTodayKpiStrip,
  shouldShowTodayNextAction,
} from "@/lib/workplace-density";
import type { DashboardData } from "@/types/dashboard";
import type { Habit } from "@/types/habit";
import type { Task } from "@/types/task";

export function TodayPageContent() {
  const { dashboardActive, prepareFocusTarget, quick } = useFocusSessionContext();
  const { openReflection, requestQuickCapture } = useGlobalRightSidebar();
  const { density, setDensity } = useWorkplaceDensity();
  const tasksTabRef = useRef<WorkplaceTasksCardHandle>(null);
  const habitsTabRef = useRef<WorkplaceHabitsCardHandle>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completingNext, setCompletingNext] = useState(false);
  const [dismissTick, setDismissTick] = useState(0);
  const prevDismissKeyRef = useRef<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const dashboard = await fetchDashboardData();
      setData(dashboard);
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

  const nextActionDismissKey = dismissKey(nextAction);

  useEffect(() => {
    const prev = prevDismissKeyRef.current;
    if (prev !== null && prev !== nextActionDismissKey) {
      clearDismissedKey();
      setDismissTick((tick) => tick + 1);
    }
    prevDismissKeyRef.current = nextActionDismissKey;
  }, [nextActionDismissKey]);

  const handleDismissNextAction = useCallback(() => {
    writeDismissedKey(nextActionDismissKey);
    setDismissTick((tick) => tick + 1);
  }, [nextActionDismissKey]);

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
      if (
        isTodayUnifiedQueueEnabled() &&
        tasksTabRef.current?.ensureHabitVisible?.(habitId)
      ) {
        return;
      }

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

  const showKpiStrip = shouldShowTodayKpiStrip(density);
  const isNextActionDismissed = useMemo(() => {
    void dismissTick;
    return readDismissedKey() === nextActionDismissKey;
  }, [dismissTick, nextActionDismissKey]);

  const showNowSlot =
    density !== "focus" &&
    !isNextActionDismissed &&
    (dashboardActive.isActive ||
      shouldShowTodayNextAction(density, nextAction, {
        hasActiveFocus: false,
      }));

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 space-y-2">
        <TodayStatusRail
          loading={loading}
          onTrack={onTrack}
          density={density}
          onDensityChange={setDensity}
          stats={
            data
              ? {
                  progress: data.progress,
                  reflection: data.reflection,
                  showKpiStats: showKpiStrip,
                  onCellAction: handleKpiCellAction,
                }
              : undefined
          }
        />

        <TodayNowSlot
          loading={loading}
          visible={showNowSlot}
          nextAction={nextAction}
          hasActiveFocus={dashboardActive.isActive}
          focusSessionLabel={dashboardActive.label}
          focusIsPaused={dashboardActive.isPaused}
          onAction={handleNextAction}
          onDismiss={handleDismissNextAction}
          onQuickComplete={
            nextAction.entityId &&
            (nextAction.type === "task" || nextAction.type === "habit") &&
            !nextActionTargetCompleted
              ? handleQuickCompleteNext
              : undefined
          }
          completing={completingNext}
        />

        {error ? (
          <div className="px-6 lg:pl-10">
            <ErrorBanner message={error} />
          </div>
        ) : null}
      </div>

      <div className="min-h-0 flex-1">
        <WorkplacePageContent
          density={density}
          tasksTabRef={tasksTabRef}
          habitsTabRef={habitsTabRef}
        />
      </div>
    </div>
  );
}
