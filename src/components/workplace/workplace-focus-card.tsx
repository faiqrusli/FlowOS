"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CalendarClock, Coffee, Pause, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { FocusBreakNotification } from "@/components/focus/focus-break-notification";
import { FocusCurrentTaskCard } from "@/components/focus/focus-current-task-card";
import { FocusNextBreakStrip } from "@/components/focus/focus-next-break-strip";
import { NextUpDrawer } from "@/components/focus/next-up-drawer";
import { NextUpPreview } from "@/components/focus/next-up-preview";
import { ScheduleBreakModal } from "@/components/focus/schedule-break-modal";
import { WorkplaceFocusInlineReflection } from "@/components/workplace/workplace-focus-inline-reflection";
import { WorkplaceFocusSessionComplete } from "@/components/workplace/workplace-focus-session-complete";
import { WorkplaceFocusReflectionModal } from "@/components/workplace/workplace-focus-reflection-modal";
import { FocusSwitchToast } from "@/components/workplace/focus-switch-toast";
import { useWorkplaceFocusTask } from "@/contexts/workplace-focus-task-context";
import { useFocusSessionContext } from "@/contexts/focus-session-context";
import {
  getDateKeyInTimezone,
  getTodayDateString,
  formatNowTimeInAppTimezone,
} from "@/lib/date-utils";
import { getTaskFocusedSeconds } from "@/lib/focus-active-session";
import {
  mergeActiveSessionIntoTodayFocus,
  selectContinueTasks,
  type TodayFocusedTaskRow,
} from "@/lib/focus-continue";
import { fetchTodayFocusedTaskHistory } from "@/lib/focus-task-totals";
import {
  formatDurationCompact,
  getSessionFocusSeconds,
} from "@/lib/focus-utils";
import {
  NEXT_UP_UPDATED_EVENT,
  type NextUpUpdateDetail,
} from "@/lib/next-up-events";
import {
  appendTaskToNextUp,
  fetchNextUpTasks,
  getDisplayNextUpTasks,
  insertTaskToNextUp,
  persistNextUpOrder,
  pruneNextUpTasks,
  removeTaskFromNextUp,
} from "@/lib/task-next-up";
import { getHabitDurationMinutes } from "@/lib/schedule-durations";
import { workplaceFocusCanvasClassName } from "@/lib/workplace-panel-appearance";
import { shouldPromptFocusReflection } from "@/lib/focus-reflection";
import { fetchFocusSessions } from "@/lib/focus-storage";
import { TODAY_FOCUS_ANCHOR_ID } from "@/lib/today-in-place";
import { getActiveTimelineDrag } from "@/lib/timeline-drag";
import {
  isNextUpReorderDrag,
  isScheduleKindDrag,
  parseScheduleDrop,
} from "@/lib/next-up-drag";
import {
  WORKPLACE_FOCUS_MIN_PX,
  WORKPLACE_NEXT_UP_PANEL_PX,
  WORKPLACE_NEXT_UP_RAIL_PX,
  resolveWorkplaceQueueLayoutMode,
  type WorkplaceQueueLayoutMode,
} from "@/lib/workplace-layout";
import {
  fetchHabitQueueRefs,
  insertHabitQueueRef,
  pruneHabitQueueRefs,
  removeHabitQueueRef,
  clearHabitQueueRefs,
  reorderHabitQueueRefs,
} from "@/lib/queue-ref-storage";
import { buildNextUpListEntries } from "@/components/focus/next-up-queue-list";
import {
  fetchUnifiedQueueOrder,
  habitQueueKey,
  insertUnifiedQueueKey,
  mergeUnifiedQueueOrder,
  parseUnifiedQueueKey,
  persistUnifiedQueueOrder,
  removeUnifiedQueueKey,
  reorderUnifiedQueueKeys,
  taskQueueKey,
  type UnifiedQueueKey,
} from "@/lib/next-up-unified-order";
import { cn } from "@/lib/utils";
import type { FocusSession } from "@/types/focus";
import type { QueueItem } from "@/types/queue-item";
import type { Habit } from "@/types/habit";
import type { Task, TaskGroupWithTasks } from "@/types/task";

type FocusTab = "focus" | "pomodoro";

type SessionQueueHead =
  | {
      kind: "task";
      id: string;
      title: string;
      durationMinutes: number | null;
    }
  | {
      kind: "habit";
      id: string;
      title: string;
      durationMinutes: number | null;
    };

/** Hide Next Up preview/drawer on Workplace until product decides to ship it. */
const NEXT_UP_WORKPLACE_UI_ENABLED = true;

type WorkplaceFocusCardProps = {
  groups: TaskGroupWithTasks[];
  onToggleComplete: (task: Task, markComplete?: boolean) => void;
  onOpenDetail: (taskId: string) => void;
  onOpenHabit?: (habitId: string) => void;
  onContinueLater: (task: Task) => void;
  onContinueTomorrow: (task: Task) => void;
  onPlanLater: (task: Task) => void;
  onUpdateDescription?: (taskId: string, description: string | null) => void;
};

function clearTimerControlFocus(container: HTMLElement) {
  const active = document.activeElement;
  if (active instanceof HTMLElement && container.contains(active)) {
    active.blur();
  }
}

function TimerHoverControls({
  children,
  alwaysVisible = false,
}: {
  children: React.ReactNode;
  alwaysVisible?: boolean;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-150",
        alwaysVisible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0 group-hover/timer:pointer-events-auto group-hover/timer:opacity-100 group-focus-within/timer:pointer-events-auto group-focus-within/timer:opacity-100",
      )}
    >
      <div className="flex flex-wrap items-center justify-center gap-1.5 px-1">
        {children}
      </div>
    </div>
  );
}

function WorkplaceFocusClock({
  clock,
  statusLabel,
  statusTone = "focus",
  idle = false,
}: {
  clock: string;
  statusLabel?: string;
  statusTone?: "focus" | "break" | "muted";
  idle?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative z-[1] flex flex-col items-center justify-center text-center transition-[opacity,filter] duration-150",
        // Hover-only: focus-within would keep the clock blurred after a click.
        !idle &&
          "group-hover/timer:pointer-events-none group-hover/timer:opacity-35 group-hover/timer:blur-[5px]",
      )}
    >
      <p
        className={cn(
          // Fixed size — layout tightness scrolls horizontally; timer never scales down.
          "font-mono text-[4.75rem] font-semibold leading-[0.95] tracking-[-0.03em] tabular-nums",
          idle ? "text-foreground/30" : "text-foreground",
        )}
      >
        {clock}
      </p>
      {statusLabel ? (
        <p
          className={cn(
            "mt-[0.35em] text-[13px] font-semibold uppercase tracking-[0.14em]",
            statusTone === "break" && "text-warning",
            statusTone === "muted" && "text-muted-foreground",
            statusTone === "focus" && "text-primary",
          )}
        >
          {statusLabel}
        </p>
      ) : null}
    </div>
  );
}

const timerStopButtonClassName =
  "h-7 border-transparent bg-transparent px-3 text-destructive/75 shadow-none hover:border-destructive/25 hover:bg-destructive/10 hover:text-destructive";

export function WorkplaceFocusCard({
  groups,
  onToggleComplete,
  onOpenDetail,
  onOpenHabit,
  onContinueLater,
  onContinueTomorrow,
  onPlanLater,
  onUpdateDescription,
}: WorkplaceFocusCardProps) {
  const [tab, setTab] = useState<FocusTab>("focus");
  const [reflectionOpen, setReflectionOpen] = useState(false);
  const [scheduleBreakOpen, setScheduleBreakOpen] = useState(false);
  const [todaySessionCount, setTodaySessionCount] = useState(0);
  const [dropActive, setDropActive] = useState(false);
  const [habitDropBlocked, setHabitDropBlocked] = useState(false);
  const [habitDropNotice, setHabitDropNotice] = useState<string | null>(null);
  const habitDropBlockedRef = useRef(false);
  const [clockLabel, setClockLabel] = useState(formatNowTimeInAppTimezone());
  const [timerHeroInView, setTimerHeroInView] = useState(true);
  const focusScrollRef = useRef<HTMLDivElement>(null);
  const timerHeroRef = useRef<HTMLDivElement>(null);
  const [timerHeroEl, setTimerHeroEl] = useState<HTMLDivElement | null>(null);
  const timerHeroCallbackRef = useCallback((node: HTMLDivElement | null) => {
    timerHeroRef.current = node;
    setTimerHeroEl(node);
  }, []);
  const [inlineReflectionSession, setInlineReflectionSession] =
    useState<FocusSession | null>(null);
  const pendingInlineReflectionRef = useRef(false);
  const pendingSessionEndRef = useRef(false);
  const pendingFocusBannerRef = useRef<HTMLDivElement>(null);
  const [sessionCompleteSession, setSessionCompleteSession] =
    useState<FocusSession | null>(null);
  const [nextUpDrawerOpen, setNextUpDrawerOpen] = useState(false);
  const focusShellRef = useRef<HTMLDivElement>(null);
  const [queueLayoutMode, setQueueLayoutMode] =
    useState<WorkplaceQueueLayoutMode>("inline");
  /** Tracks whether the queue was opened by the user or by an eligible drag. */
  const queueOpenModeRef = useRef<"closed" | "manual" | "drag">("closed");
  const dragAutoCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const nextUpDrawerScrollTopRef = useRef(0);
  const nextUpDrawerListRef = useRef<HTMLDivElement>(null);
  const [nextUpTasks, setNextUpTasks] = useState<Task[]>([]);
  const [todayFocusHistory, setTodayFocusHistory] = useState<
    TodayFocusedTaskRow[]
  >([]);
  const [habitQueueRefs, setHabitQueueRefs] = useState<QueueItem[]>([]);
  const [unifiedQueueOrder, setUnifiedQueueOrder] = useState<UnifiedQueueKey[]>(
    [],
  );
  const [nextUpFetchError, setNextUpFetchError] = useState<string | null>(null);
  const [nextUpDropBeforeKey, setNextUpDropBeforeKey] =
    useState<UnifiedQueueKey | null>(null);
  const [pendingFocusTask, setPendingFocusTask] = useState<Task | null>(null);
  const [focusSwitchNotice, setFocusSwitchNotice] = useState<{
    previousTask: Task;
    newTask: Task;
  } | null>(null);

  const {
    activeTask,
    activeHabit,
    habits,
    setActiveTaskId,
    setActiveHabitId,
    setActiveFocusTarget,
    isFocusableHabit,
  } = useWorkplaceFocusTask();
  const {
    activeSession,
    quick,
    pomodoro,
    prepareFocusTarget,
    lastSavedSession,
  } = useFocusSessionContext();

  const pomodoroDisabled = quick.isActive;
  const quickStartDisabled = pomodoro.isRunning || pomodoro.isPaused;

  const sessionNumber = useMemo(() => {
    const active =
      tab === "focus"
        ? quick.isActive
        : pomodoro.isRunning || pomodoro.isPaused;
    return Math.max(1, todaySessionCount + (active ? 1 : 0));
  }, [
    pomodoro.isPaused,
    pomodoro.isRunning,
    quick.isActive,
    tab,
    todaySessionCount,
  ]);

  const currentFocusTask = useMemo(() => {
    if (quick.isIdle) return null;
    if (activeSession?.target_type === "task" && activeSession.target_id) {
      return (
        groups
          .flatMap((group) => group.tasks)
          .find(
            (task) => task.id === activeSession.target_id && !task.completed,
          ) ?? null
      );
    }
    if (activeSession?.target_type === "habit") return null;
    return activeTask;
  }, [activeSession, activeTask, groups, quick.isIdle]);

  const displayedNextUpTasks = useMemo(
    () => getDisplayNextUpTasks(nextUpTasks, currentFocusTask?.id ?? null),
    [currentFocusTask?.id, nextUpTasks],
  );

  const nextUpEntries = useMemo(
    () =>
      buildNextUpListEntries(
        unifiedQueueOrder,
        displayedNextUpTasks,
        habitQueueRefs,
        habits,
      ),
    [displayedNextUpTasks, habitQueueRefs, habits, unifiedQueueOrder],
  );

  const continueFocusHistory = useMemo(
    () => mergeActiveSessionIntoTodayFocus(todayFocusHistory, activeSession),
    [activeSession, todayFocusHistory],
  );

  const continueTasks = useMemo(() => {
    const allTasks = groups.flatMap((group) => group.tasks);
    return selectContinueTasks({
      tasks: allTasks,
      focusedToday: continueFocusHistory,
      nowTaskId: currentFocusTask?.id ?? null,
      nextUpTaskIds: nextUpTasks.map((task) => task.id),
    });
  }, [
    continueFocusHistory,
    currentFocusTask?.id,
    groups,
    nextUpTasks,
  ]);

  const continueFocusSecondsByTaskId = useMemo(() => {
    const map: Record<string, number> = {};
    for (const row of continueFocusHistory) {
      map[row.taskId] = row.focusedSeconds;
    }
    return map;
  }, [continueFocusHistory]);

  useEffect(() => {
    const taskIds = displayedNextUpTasks.map((task) => task.id);
    const habitIds = habitQueueRefs.map((ref) => ref.sourceId);
    setUnifiedQueueOrder((prev) => {
      const base = prev.length > 0 ? prev : fetchUnifiedQueueOrder();
      const merged = mergeUnifiedQueueOrder(base, taskIds, habitIds);
      persistUnifiedQueueOrder(merged);
      return merged;
    });
  }, [displayedNextUpTasks, habitQueueRefs]);

  const loadStats = useCallback(async () => {
    try {
      const sessions = await fetchFocusSessions();
      const todayKey = getTodayDateString();
      setTodaySessionCount(
        sessions.filter(
          (session) => getDateKeyInTimezone(session.started_at) === todayKey,
        ).length,
      );
    } catch {
      /* keep last known session count */
    }
  }, []);

  const refreshNextUpTasks = useCallback(async () => {
    try {
      setNextUpTasks(await fetchNextUpTasks());
      setNextUpFetchError(null);
    } catch {
      setNextUpTasks([]);
      setNextUpFetchError("Couldn't load Next Up. Retry by refreshing.");
    }
  }, []);

  const refreshTodayFocusHistory = useCallback(async () => {
    try {
      setTodayFocusHistory(await fetchTodayFocusedTaskHistory());
    } catch {
      /* keep last known continue history */
    }
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats, quick.isIdle, pomodoro.isIdle]);

  useEffect(() => {
    void refreshTodayFocusHistory();
  }, [lastSavedSession, quick.isIdle, refreshTodayFocusHistory]);

  useEffect(() => {
    void refreshNextUpTasks();
  }, [groups, refreshNextUpTasks]);

  useEffect(() => {
    const liveTasks = groups.flatMap((group) => group.tasks);
    const liveById = new Map(liveTasks.map((task) => [task.id, task]));
    setNextUpTasks((current) => {
      const { kept, removedIds } = pruneNextUpTasks(current, liveTasks);
      if (removedIds.length === 0) {
        let changed = false;
        const synced = kept.map((task) => {
          const live = liveById.get(task.id);
          if (!live || live === task) return task;
          changed = true;
          return live;
        });
        return changed ? synced : current;
      }
      void Promise.all(removedIds.map((id) => removeTaskFromNextUp(id))).catch(
        () => {
          void refreshNextUpTasks();
        },
      );
      return kept.map((task) => liveById.get(task.id) ?? task);
    });
  }, [groups, refreshNextUpTasks]);

  useEffect(() => {
    setHabitQueueRefs(pruneHabitQueueRefs(habits));
  }, [habits]);

  useEffect(() => {
    const onHabitQueueUpdated = () => {
      setHabitQueueRefs(fetchHabitQueueRefs());
    };
    window.addEventListener("flowos:habit-queue-updated", onHabitQueueUpdated);
    return () =>
      window.removeEventListener(
        "flowos:habit-queue-updated",
        onHabitQueueUpdated,
      );
  }, []);

  useEffect(() => {
    const onNextUpUpdated = (event: Event) => {
      const detail = (event as CustomEvent<NextUpUpdateDetail>).detail;
      if (detail?.kind === "added") {
        setNextUpTasks((current) => {
          if (current.some((task) => task.id === detail.task.id))
            return current;
          return [...current, detail.task].sort(
            (a, b) => (a.queue_order ?? 0) - (b.queue_order ?? 0),
          );
        });
        return;
      }
      void refreshNextUpTasks();
    };

    window.addEventListener(NEXT_UP_UPDATED_EVENT, onNextUpUpdated);
    return () =>
      window.removeEventListener(NEXT_UP_UPDATED_EVENT, onNextUpUpdated);
  }, [refreshNextUpTasks]);

  useEffect(() => {
    const tick = () => setClockLabel(formatNowTimeInAppTimezone());
    tick();
    const timer = window.setInterval(tick, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (tab !== "focus" || quick.isIdle) {
      setTimerHeroInView(true);
      return;
    }

    const root = focusScrollRef.current;
    const target = timerHeroEl ?? timerHeroRef.current;
    if (!root || !target) return;

    const update = () => {
      const rootRect = root.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const visibleTop = Math.max(targetRect.top, rootRect.top);
      const visibleBottom = Math.min(targetRect.bottom, rootRect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const ratio = visibleHeight / Math.max(1, targetRect.height);
      // Compact only while less than half the clock remains in the scrollport.
      setTimerHeroInView(ratio >= 0.5);
    };

    update();
    root.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      root.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [
    quick.isIdle,
    tab,
    timerHeroEl,
    quick.isFocusing,
    quick.isOnBreak,
    quick.isPaused,
  ]);

  const compactSessionStatus = quick.isOnBreak
    ? "On Break"
    : quick.isPaused
      ? "Paused"
      : "In Focus";
  const showCompactSession =
    tab === "focus" && !quick.isIdle && !timerHeroInView;

  const handleQuickStop = useCallback(() => {
    pendingInlineReflectionRef.current = shouldPromptFocusReflection(
      quick.currentFocusSeconds,
    );
    pendingSessionEndRef.current = true;
    // Clear current focus — stop must not complete or modify the task.
    setActiveFocusTarget(null, "manual");
    quick.stopSession();
  }, [quick, setActiveFocusTarget]);

  const handlePomodoroStop = useCallback(() => {
    pendingInlineReflectionRef.current = true;
    pendingSessionEndRef.current = true;
    setActiveFocusTarget(null, "manual");
    pomodoro.stop();
  }, [pomodoro, setActiveFocusTarget]);

  useEffect(() => {
    if (!lastSavedSession || !pendingInlineReflectionRef.current) return;
    pendingInlineReflectionRef.current = false;
    if (shouldPromptFocusReflection(getSessionFocusSeconds(lastSavedSession))) {
      setInlineReflectionSession(lastSavedSession);
    }
  }, [lastSavedSession]);

  const resolveQueueHead = useCallback((): SessionQueueHead | null => {
    for (const entry of nextUpEntries) {
      if (entry.kind === "task") {
        return {
          kind: "task",
          id: entry.task.id,
          title: entry.task.title,
          durationMinutes: entry.task.duration_minutes,
        };
      }
      if (!isFocusableHabit(entry.habit.id) || entry.habit.completed) continue;
      return {
        kind: "habit",
        id: entry.habit.id,
        title: entry.habit.name,
        durationMinutes: getHabitDurationMinutes(entry.habit.id) || null,
      };
    }
    return null;
  }, [isFocusableHabit, nextUpEntries]);

  useEffect(() => {
    if (!lastSavedSession || !pendingSessionEndRef.current) return;
    pendingSessionEndRef.current = false;
    setSessionCompleteSession(lastSavedSession);
  }, [lastSavedSession]);

  const finishDragAutoClose = useCallback(() => {
    if (queueOpenModeRef.current !== "drag") return;
    if (dragAutoCloseTimerRef.current) {
      clearTimeout(dragAutoCloseTimerRef.current);
    }
    dragAutoCloseTimerRef.current = setTimeout(() => {
      if (queueOpenModeRef.current === "drag") {
        queueOpenModeRef.current = "closed";
        setNextUpDrawerOpen(false);
      }
    }, 750);
  }, []);

  const handleScheduleDrop = useCallback(
    (event: React.DragEvent, beforeKey: UnifiedQueueKey | null = null) => {
      event.preventDefault();
      event.stopPropagation();

      setDropActive(false);
      setNextUpDropBeforeKey(null);
      setHabitDropBlocked(false);
      habitDropBlockedRef.current = false;

      if (isNextUpReorderDrag(event)) return;

      const payload = parseScheduleDrop(event);
      if (!payload) return;

      const beforeTaskId = (() => {
        if (!beforeKey) return null;
        const parsed = parseUnifiedQueueKey(beforeKey);
        if (parsed?.sourceType === "task") return parsed.sourceId;
        const start = nextUpEntries.findIndex(
          (entry) => entry.key === beforeKey,
        );
        if (start < 0) return null;
        for (let i = start; i < nextUpEntries.length; i += 1) {
          const entry = nextUpEntries[i];
          if (entry.kind === "task") return entry.task.id;
        }
        return null;
      })();

      if (payload.kind === "habit") {
        if (!isFocusableHabit(payload.id)) {
          setHabitDropNotice(
            "Turn on Track with Focus to use this habit in Focus.",
          );
          return;
        }
        setHabitDropNotice(null);
        setHabitQueueRefs(insertHabitQueueRef(payload.id));
        setUnifiedQueueOrder((prev) => {
          const next = insertUnifiedQueueKey(
            prev,
            habitQueueKey(payload.id),
            beforeKey,
          );
          persistUnifiedQueueOrder(next);
          return next;
        });
        finishDragAutoClose();
        return;
      }

      setHabitDropNotice(null);

      if (payload.kind === "task" && NEXT_UP_WORKPLACE_UI_ENABLED) {
        void insertTaskToNextUp(payload.id, beforeTaskId)
          .then(() => {
            void refreshNextUpTasks();
            setUnifiedQueueOrder((prev) => {
              const next = insertUnifiedQueueKey(
                prev,
                taskQueueKey(payload.id),
                beforeKey,
              );
              persistUnifiedQueueOrder(next);
              return next;
            });
            finishDragAutoClose();
          })
          .catch((error: unknown) => {
            setHabitDropNotice(
              error instanceof Error
                ? error.message
                : "Couldn't add this task to Next Up.",
            );
          });
        return;
      }

      setActiveTaskId(payload.id, "manual");
    },
    [
      finishDragAutoClose,
      isFocusableHabit,
      nextUpEntries,
      refreshNextUpTasks,
      setActiveTaskId,
    ],
  );

  const handleStartFocus = useCallback(() => {
    if (activeTask) {
      prepareFocusTarget({
        type: "task",
        id: activeTask.id,
        label: activeTask.title,
      });
    } else if (activeHabit) {
      prepareFocusTarget({
        type: "habit",
        id: activeHabit.id,
        label: activeHabit.name,
      });
    } else {
      prepareFocusTarget(null);
    }
    quick.startFocus();
  }, [activeHabit, activeTask, prepareFocusTarget, quick]);

  const closeNextUpDrawer = useCallback(() => {
    if (nextUpDrawerListRef.current) {
      nextUpDrawerScrollTopRef.current = nextUpDrawerListRef.current.scrollTop;
    }
    if (dragAutoCloseTimerRef.current) {
      clearTimeout(dragAutoCloseTimerRef.current);
      dragAutoCloseTimerRef.current = null;
    }
    queueOpenModeRef.current = "closed";
    setNextUpDrawerOpen(false);
  }, []);

  const openNextUpDrawer = useCallback((mode: "manual" | "drag" = "manual") => {
    if (dragAutoCloseTimerRef.current) {
      clearTimeout(dragAutoCloseTimerRef.current);
      dragAutoCloseTimerRef.current = null;
    }
    if (mode === "manual" || queueOpenModeRef.current !== "manual") {
      queueOpenModeRef.current = mode;
    }
    setNextUpDrawerOpen(true);
  }, []);

  const toggleNextUpDrawer = useCallback(() => {
    if (nextUpDrawerOpen) {
      closeNextUpDrawer();
      return;
    }
    openNextUpDrawer("manual");
  }, [closeNextUpDrawer, nextUpDrawerOpen, openNextUpDrawer]);

  useEffect(() => {
    const onDragStart = (event: DragEvent) => {
      if (!NEXT_UP_WORKPLACE_UI_ENABLED) return;
      if (!event.dataTransfer) return;
      if (!isScheduleKindDrag(event as unknown as React.DragEvent)) return;
      if (isNextUpReorderDrag(event as unknown as React.DragEvent)) return;
      setDropActive(true);
      const drag = getActiveTimelineDrag();
      if (drag?.kind === "habit") {
        const blocked = !isFocusableHabit(drag.id);
        habitDropBlockedRef.current = blocked;
        setHabitDropBlocked(blocked);
      } else {
        habitDropBlockedRef.current = false;
        setHabitDropBlocked(false);
      }
      if (queueOpenModeRef.current !== "closed") return;
      openNextUpDrawer("drag");
    };
    const onDragEnd = () => {
      setDropActive(false);
      setNextUpDropBeforeKey(null);
      habitDropBlockedRef.current = false;
      setHabitDropBlocked(false);
    };
    window.addEventListener("dragstart", onDragStart);
    window.addEventListener("dragend", onDragEnd);
    return () => {
      window.removeEventListener("dragstart", onDragStart);
      window.removeEventListener("dragend", onDragEnd);
    };
  }, [isFocusableHabit, openNextUpDrawer]);

  useEffect(() => {
    return () => {
      if (dragAutoCloseTimerRef.current) {
        clearTimeout(dragAutoCloseTimerRef.current);
      }
    };
  }, []);

  const activateFocusTask = useCallback(
    (task: Task) => {
      setActiveTaskId(task.id, "manual");
      setNextUpTasks((current) =>
        current.filter((item) => item.id !== task.id),
      );
      setUnifiedQueueOrder((prev) => {
        const next = removeUnifiedQueueKey(prev, taskQueueKey(task.id));
        persistUnifiedQueueOrder(next);
        return next;
      });
      void removeTaskFromNextUp(task.id).catch(() => {
        void refreshNextUpTasks();
      });

      const target = {
        type: "task" as const,
        id: task.id,
        label: task.title,
      };
      if (quick.isIdle) {
        prepareFocusTarget(target);
        quick.startFocus();
        return;
      }

      // Preserve prior task focus totals via setFocusTarget, then ensure
      // the session is actively timing the new task.
      if (quick.isOnBreak) {
        quick.resumeFocus();
      }
      quick.setFocusTarget(target);
      quick.resume();
    },
    [prepareFocusTarget, quick, refreshNextUpTasks, setActiveTaskId],
  );

  const switchFocusFromDrop = useCallback(
    (task: Task) => {
      const previousTask =
        currentFocusTask && currentFocusTask.id !== task.id
          ? currentFocusTask
          : null;

      activateFocusTask(task);

      if (previousTask) {
        setFocusSwitchNotice({ previousTask, newTask: task });
        setPendingFocusTask(null);
      }
    },
    [activateFocusTask, currentFocusTask],
  );

  const dismissFocusSwitchNotice = useCallback(() => {
    setFocusSwitchNotice(null);
  }, []);

  const completePreviousFromSwitch = useCallback(() => {
    if (!focusSwitchNotice) return;
    onToggleComplete(focusSwitchNotice.previousTask, true);
    setFocusSwitchNotice(null);
  }, [focusSwitchNotice, onToggleComplete]);

  const undoFocusSwitch = useCallback(() => {
    if (!focusSwitchNotice) return;
    const { previousTask } = focusSwitchNotice;
    setFocusSwitchNotice(null);
    // Finalize the briefly-started new task segment, restore previous as active.
    activateFocusTask(previousTask);
  }, [activateFocusTask, focusSwitchNotice]);

  const activateFocusHabit = useCallback(
    (habit: Habit) => {
      setActiveHabitId(habit.id, "manual");
      setHabitQueueRefs(removeHabitQueueRef(habit.id));
      setUnifiedQueueOrder((prev) => {
        const next = removeUnifiedQueueKey(prev, habitQueueKey(habit.id));
        persistUnifiedQueueOrder(next);
        return next;
      });
      const target = {
        type: "habit" as const,
        id: habit.id,
        label: habit.name,
      };
      if (quick.isIdle) {
        prepareFocusTarget(target);
        quick.startFocus();
      } else {
        quick.setFocusTarget(target);
      }
    },
    [prepareFocusTarget, quick, setActiveHabitId],
  );

  const handleKeepIncomplete = useCallback(() => {
    setSessionCompleteSession(null);
  }, []);

  const lastFocusedTask = useMemo(() => {
    if (
      !sessionCompleteSession ||
      sessionCompleteSession.target_type !== "task" ||
      !sessionCompleteSession.target_id
    ) {
      return null;
    }
    return (
      groups
        .flatMap((group) => group.tasks)
        .find((item) => item.id === sessionCompleteSession.target_id) ?? null
    );
  }, [groups, sessionCompleteSession]);

  const lastFocusedTitle = useMemo(() => {
    if (!sessionCompleteSession) return null;
    if (lastFocusedTask) return lastFocusedTask.title;
    if (
      sessionCompleteSession.target_type === "habit" &&
      sessionCompleteSession.target_id
    ) {
      const habit = habits.find(
        (item) => item.id === sessionCompleteSession.target_id,
      );
      return habit?.name ?? "Habit";
    }
    return null;
  }, [habits, lastFocusedTask, sessionCompleteSession]);

  const handleMarkCompleteFromSession = useCallback(() => {
    if (!lastFocusedTask || lastFocusedTask.completed) {
      setSessionCompleteSession(null);
      return;
    }
    onToggleComplete(lastFocusedTask, true);
    setSessionCompleteSession(null);
  }, [lastFocusedTask, onToggleComplete]);

  const requestStartFocus = useCallback(
    (task: Task) => {
      if (
        !quick.isIdle &&
        currentFocusTask &&
        currentFocusTask.id !== task.id
      ) {
        setPendingFocusTask(task);
        return;
      }
      activateFocusTask(task);
    },
    [activateFocusTask, currentFocusTask, quick.isIdle],
  );

  const handleStartFocusDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setDropActive(false);
      setNextUpDropBeforeKey(null);
      setHabitDropBlocked(false);
      habitDropBlockedRef.current = false;

      if (isNextUpReorderDrag(event)) return;

      const payload = parseScheduleDrop(event);
      if (!payload) return;

      if (payload.kind === "habit") {
        if (!isFocusableHabit(payload.id)) {
          setHabitDropNotice(
            "Turn on Track with Focus to use this habit in Focus.",
          );
          return;
        }
        const habit = habits.find((item) => item.id === payload.id);
        if (!habit) return;
        setHabitDropNotice(null);
        activateFocusHabit(habit);
        finishDragAutoClose();
        return;
      }

      const task = groups
        .flatMap((group) => group.tasks)
        .find((item) => item.id === payload.id);
      if (!task) return;
      setHabitDropNotice(null);
      // Drag-to-focus: switch immediately (pause prior task history), toast for Complete/Undo.
      switchFocusFromDrop(task);
      finishDragAutoClose();
    },
    [
      activateFocusHabit,
      finishDragAutoClose,
      groups,
      habits,
      isFocusableHabit,
      switchFocusFromDrop,
    ],
  );

  const handleReorderQueue = useCallback(
    (fromIndex: number, toIndex: number) => {
      setUnifiedQueueOrder((prev) => {
        const next = reorderUnifiedQueueKeys(prev, fromIndex, toIndex);
        persistUnifiedQueueOrder(next);

        const taskIds = next
          .map(parseUnifiedQueueKey)
          .filter(
            (item): item is { sourceType: "task"; sourceId: string } =>
              item?.sourceType === "task",
          )
          .map((item) => item.sourceId);
        const taskById = new Map(nextUpTasks.map((task) => [task.id, task]));
        const reorderedTasks = taskIds
          .map((id) => taskById.get(id))
          .filter((task): task is Task => Boolean(task));
        if (reorderedTasks.length > 0) {
          setNextUpTasks(reorderedTasks);
          void persistNextUpOrder(reorderedTasks).catch(() => {
            void refreshNextUpTasks();
          });
        }

        const habitIds = next
          .map(parseUnifiedQueueKey)
          .filter(
            (item): item is { sourceType: "habit"; sourceId: string } =>
              item?.sourceType === "habit",
          )
          .map((item) => item.sourceId);
        setHabitQueueRefs(reorderHabitQueueRefs(habitIds));

        return next;
      });
    },
    [nextUpTasks, refreshNextUpTasks],
  );

  const handleRemoveQueueTask = useCallback(
    (taskId: string) => {
      setNextUpTasks((current) => current.filter((task) => task.id !== taskId));
      setUnifiedQueueOrder((prev) => {
        const next = removeUnifiedQueueKey(prev, taskQueueKey(taskId));
        persistUnifiedQueueOrder(next);
        return next;
      });
      void removeTaskFromNextUp(taskId).catch(() => {
        void refreshNextUpTasks();
      });
    },
    [refreshNextUpTasks],
  );

  const handleRemoveQueueHabit = useCallback((habitId: string) => {
    setHabitQueueRefs(removeHabitQueueRef(habitId));
    setUnifiedQueueOrder((prev) => {
      const next = removeUnifiedQueueKey(prev, habitQueueKey(habitId));
      persistUnifiedQueueOrder(next);
      return next;
    });
  }, []);

  const handleClearNextUpQueue = useCallback(() => {
    const ids = displayedNextUpTasks.map((task) => task.id);
    setNextUpTasks([]);
    clearHabitQueueRefs();
    setHabitQueueRefs([]);
    persistUnifiedQueueOrder([]);
    setUnifiedQueueOrder([]);
    if (ids.length === 0) return;
    void Promise.all(ids.map((id) => removeTaskFromNextUp(id))).catch(() => {
      void refreshNextUpTasks();
    });
  }, [displayedNextUpTasks, refreshNextUpTasks]);

  const handleMoveQueueTaskToEnd = useCallback(
    (task: Task) => {
      const key = taskQueueKey(task.id);
      const fromIndex = nextUpEntries.findIndex((entry) => entry.key === key);
      if (fromIndex < 0 || fromIndex === nextUpEntries.length - 1) return;
      handleReorderQueue(fromIndex, nextUpEntries.length - 1);
    },
    [handleReorderQueue, nextUpEntries],
  );

  const handleMoveQueueTaskToTop = useCallback(
    (task: Task) => {
      const key = taskQueueKey(task.id);
      const fromIndex = nextUpEntries.findIndex((entry) => entry.key === key);
      if (fromIndex <= 0) return;
      handleReorderQueue(fromIndex, 0);
    },
    [handleReorderQueue, nextUpEntries],
  );

  const handleCompleteQueueTask = useCallback(
    (task: Task) => {
      onToggleComplete(task, true);
      setNextUpTasks((current) =>
        current.filter((item) => item.id !== task.id),
      );
    },
    [onToggleComplete],
  );

  const handleCompleteCurrentTask = useCallback(
    (task: Task) => {
      const head = resolveQueueHead();
      onToggleComplete(task, true);
      setNextUpTasks((current) =>
        current.filter((item) => item.id !== task.id),
      );

      if (head?.kind === "task") {
        const nextTask = nextUpTasks.find((item) => item.id === head.id);
        if (nextTask) {
          activateFocusTask(nextTask);
          return;
        }
      }
      if (head?.kind === "habit") {
        const nextHabit = habits.find((item) => item.id === head.id);
        if (nextHabit) {
          activateFocusHabit(nextHabit);
          return;
        }
      }

      setActiveTaskId(null, "manual");
      quick.setFocusTarget(null);
    },
    [
      activateFocusHabit,
      activateFocusTask,
      habits,
      nextUpTasks,
      onToggleComplete,
      quick,
      resolveQueueHead,
      setActiveTaskId,
    ],
  );

  const handleFocusNextItem = useCallback(() => {
    const head = resolveQueueHead();
    if (!head) {
      setActiveTaskId(null, "manual");
      quick.setFocusTarget(null);
      return;
    }
    if (head.kind === "task") {
      const nextTask = nextUpTasks.find((item) => item.id === head.id);
      if (nextTask) {
        activateFocusTask(nextTask);
        return;
      }
    } else {
      const nextHabit = habits.find((item) => item.id === head.id);
      if (nextHabit) {
        activateFocusHabit(nextHabit);
        return;
      }
    }
    setActiveTaskId(null, "manual");
    quick.setFocusTarget(null);
  }, [
    activateFocusHabit,
    activateFocusTask,
    habits,
    nextUpTasks,
    quick,
    resolveQueueHead,
    setActiveTaskId,
  ]);

  const handleMoveCurrentToQueueEnd = useCallback(
    (task: Task) => {
      setActiveTaskId(null, "manual");
      quick.setFocusTarget(null);

      void appendTaskToNextUp(task.id)
        .then(() => refreshNextUpTasks())
        .then(() => {
          setUnifiedQueueOrder((prev) => {
            const without = removeUnifiedQueueKey(prev, taskQueueKey(task.id));
            const next = insertUnifiedQueueKey(
              without,
              taskQueueKey(task.id),
              null,
            );
            persistUnifiedQueueOrder(next);
            return next;
          });
        })
        .catch(() => {
          void refreshNextUpTasks();
        });
    },
    [quick, refreshNextUpTasks, setActiveTaskId],
  );

  const handleAddContinueToQueue = useCallback(
    (task: Task) => {
      void appendTaskToNextUp(task.id)
        .then(() => refreshNextUpTasks())
        .then(() => {
          setUnifiedQueueOrder((prev) => {
            const without = removeUnifiedQueueKey(prev, taskQueueKey(task.id));
            const next = insertUnifiedQueueKey(
              without,
              taskQueueKey(task.id),
              null,
            );
            persistUnifiedQueueOrder(next);
            return next;
          });
        })
        .catch(() => {
          void refreshNextUpTasks();
        });
    },
    [refreshNextUpTasks],
  );

  useEffect(() => {
    const el = focusShellRef.current;
    if (!el) return;

    const sync = () => {
      setQueueLayoutMode(resolveWorkplaceQueueLayoutMode(el.clientWidth));
    };

    const observer = new ResizeObserver(sync);
    observer.observe(el);
    sync();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!nextUpDrawerOpen) return;
    const list = nextUpDrawerListRef.current;
    if (!list) return;
    list.scrollTop = nextUpDrawerScrollTopRef.current;
  }, [nextUpDrawerOpen]);

  useEffect(() => {
    if (!nextUpDrawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeNextUpDrawer();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeNextUpDrawer, nextUpDrawerOpen]);

  const reflectionProminent =
    quick.isIdle && Boolean(inlineReflectionSession || sessionCompleteSession);

  useEffect(() => {
    if (!pendingFocusTask) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setPendingFocusTask(null);
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (pendingFocusBannerRef.current?.contains(target)) return;
      if (
        target instanceof Element &&
        target.closest("[data-pending-focus-anchor]")
      ) {
        return;
      }
      setPendingFocusTask(null);
    };

    window.addEventListener("keydown", onKeyDown);
    // Defer so the Start click that opened the banner doesn't dismiss it.
    const timer = window.setTimeout(() => {
      window.addEventListener("pointerdown", onPointerDown);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [pendingFocusTask]);

  return (
    <>
      {/* Invisible layout shell — timer canvas keeps FOCUS_MIN; mid Queue overlays Focus. */}
      <div
        ref={focusShellRef}
        data-focus-shell
        className="relative flex h-full min-h-0 w-full flex-1"
        style={{
          minWidth:
            WORKPLACE_FOCUS_MIN_PX +
            (nextUpDrawerOpen && queueLayoutMode === "inline"
              ? WORKPLACE_NEXT_UP_PANEL_PX
              : WORKPLACE_NEXT_UP_RAIL_PX),
        }}
      >
        <section
          id={TODAY_FOCUS_ANCHOR_ID}
          className={cn(
            "relative flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden",
            workplaceFocusCanvasClassName,
          )}
          style={{ minWidth: WORKPLACE_FOCUS_MIN_PX }}
        >
          <div className="relative shrink-0 px-3 pt-1.5 pb-1">
            <div className="relative flex items-start justify-between gap-2">
              <div className="inline-flex h-7 items-center rounded-lg border border-border-subtle/70 bg-surface-base/50 p-0.5">
                {(["focus", "pomodoro"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTab(item)}
                    className={cn(
                      "h-6 rounded-md px-2.5 text-[13px] font-medium capitalize transition-[background-color,color,box-shadow] duration-150",
                      tab === item
                        ? "bg-surface-raised text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
              {showCompactSession ? (
                <div
                  className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between"
                  aria-live="polite"
                >
                  <p className="flex h-7 items-center font-mono text-[21px] font-semibold leading-none tracking-tight tabular-nums text-foreground">
                    {quick.clock}
                  </p>
                  <p
                    className={cn(
                      "mt-0.5 text-[11px] font-semibold uppercase tracking-[0.12em]",
                      quick.isOnBreak && "text-warning",
                      quick.isPaused && "text-muted-foreground",
                      !quick.isOnBreak && !quick.isPaused && "text-primary",
                    )}
                  >
                    {compactSessionStatus}
                  </p>
                </div>
              ) : null}
              <div className="flex flex-col items-end gap-0.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setReflectionOpen(true)}
                  className={cn(
                    "shrink-0 rounded-md px-2.5 text-[13px] font-medium shadow-none",
                    reflectionProminent
                      ? "h-7 border-border-subtle bg-surface-raised text-foreground hover:bg-surface-hover"
                      : "h-7 border-border-subtle/70 bg-surface-base/40 text-foreground/90 hover:border-border-subtle hover:bg-surface-hover hover:text-foreground",
                  )}
                >
                  {reflectionProminent
                    ? "Reflect on this session"
                    : "Focus Reflection"}
                </Button>
                <p className="mt-0.5 text-[14px] font-medium tabular-nums text-muted-foreground/80">
                  {clockLabel}
                </p>
              </div>
            </div>
          </div>

          <div className="relative flex min-h-0 flex-1 flex-col px-3 pb-3">
            {habitDropNotice ? (
              <div className="mb-2 shrink-0 rounded-md border border-warning/40 bg-warning-muted/80 px-3 py-2 text-[13px] leading-snug text-warning">
                {habitDropNotice}
              </div>
            ) : null}
            {tab === "focus" ? (
              <div className="relative min-h-0 flex-1">
                <div
                  ref={focusScrollRef}
                  className="scrollbar-none flex h-full min-h-0 min-w-0 flex-col overflow-y-auto overflow-x-clip"
                >
                  {/* Timer hero: one coherent unit — clock → status → meta → break.
                  No negative margins here — they clip against overflow-y-auto. */}
                  <div className="relative flex shrink-0 flex-col items-center pb-1 pt-0 text-center">
                    {quick.isIdle ? (
                      <div
                        ref={timerHeroCallbackRef}
                        className="flex w-full flex-col items-center gap-2 py-1"
                      >
                        {inlineReflectionSession ? (
                          <WorkplaceFocusInlineReflection
                            session={inlineReflectionSession}
                            onDismiss={() => setInlineReflectionSession(null)}
                          />
                        ) : null}
                        {sessionCompleteSession ? (
                          <WorkplaceFocusSessionComplete
                            session={sessionCompleteSession}
                            lastFocusedTitle={lastFocusedTitle}
                            canMarkComplete={Boolean(
                              lastFocusedTask && !lastFocusedTask.completed,
                            )}
                            onMarkComplete={handleMarkCompleteFromSession}
                            onKeepIncomplete={handleKeepIncomplete}
                          />
                        ) : null}
                        {!inlineReflectionSession && !sessionCompleteSession ? (
                          <>
                            <WorkplaceFocusClock clock="00:00" idle />
                            <Button
                              type="button"
                              disabled={quickStartDisabled}
                              onClick={handleStartFocus}
                              className="h-7 rounded-full px-5 text-[13px]"
                            >
                              <Play
                                className="size-3.5"
                                data-icon="inline-start"
                              />
                              Start Focus
                            </Button>
                          </>
                        ) : null}
                      </div>
                    ) : (
                      <div className="flex w-full flex-col items-center text-center">
                        {/* Hover hit-box hugs the clock — room for controls, not full-width. */}
                        <div
                          ref={timerHeroCallbackRef}
                          className="group/timer relative mx-auto flex min-h-[5.75rem] w-[min(100%,38rem)] items-center justify-center px-2 py-1"
                          onPointerLeave={(event) =>
                            clearTimerControlFocus(event.currentTarget)
                          }
                        >
                          <WorkplaceFocusClock
                            clock={quick.clock}
                            statusLabel={
                              quick.isOnBreak
                                ? "On Break"
                                : quick.isPaused
                                  ? "Paused"
                                  : "In Focus"
                            }
                            statusTone={
                              quick.isOnBreak
                                ? "break"
                                : quick.isPaused
                                  ? "muted"
                                  : "focus"
                            }
                          />
                          <TimerHoverControls>
                            {quick.isFocusing ? (
                              <>
                                {quick.isPaused ? (
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={quick.resume}
                                    className="h-7 rounded-full px-3.5"
                                  >
                                    <Play className="size-3.5" />
                                    Resume
                                  </Button>
                                ) : (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={quick.pause}
                                    className="h-7 px-3"
                                  >
                                    <Pause className="size-3.5" />
                                    Pause
                                  </Button>
                                )}
                                {!quick.isPaused ? (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={quick.startBreak}
                                    className="h-7 px-3"
                                  >
                                    <Coffee className="size-3.5" />
                                    Break
                                  </Button>
                                ) : null}
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setScheduleBreakOpen(true)}
                                  className="h-7 gap-1.5 px-3"
                                >
                                  <CalendarClock className="size-3.5" />
                                  Schedule Break
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={handleQuickStop}
                                  className={timerStopButtonClassName}
                                >
                                  <Square className="size-3.5" />
                                  Stop
                                </Button>
                              </>
                            ) : null}
                            {quick.isOnBreak ? (
                              <>
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={quick.resumeFocus}
                                  className="h-7 rounded-full px-3.5"
                                >
                                  Resume Focus
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={handleQuickStop}
                                  className={timerStopButtonClassName}
                                >
                                  <Square className="size-3.5" />
                                  Stop
                                </Button>
                              </>
                            ) : null}
                          </TimerHoverControls>
                        </div>
                        {(quick.currentFocusSeconds > 0 ||
                          quick.currentBreakSeconds > 0) && (
                          <p className="mt-2 text-[13px] font-medium text-muted-foreground">
                            Focused{" "}
                            {formatDurationCompact(quick.currentFocusSeconds)} ·
                            Break{" "}
                            {formatDurationCompact(quick.currentBreakSeconds)}
                          </p>
                        )}
                        {quick.breakPrompt ? (
                          <div className="mt-3 flex justify-center px-1">
                            <FocusBreakNotification
                              kind={quick.breakPrompt}
                              breakAtMinutes={quick.breakAtMinutes}
                              onPrimaryAction={
                                quick.breakPrompt === "ready"
                                  ? quick.startBreak
                                  : quick.resumeFocus
                              }
                              onSnooze={() =>
                                quick.breakPrompt === "ready"
                                  ? quick.snoozeBreakReady()
                                  : quick.snoozeBreakFinished()
                              }
                            />
                          </div>
                        ) : null}
                        {quick.hasScheduledBreak && !quick.breakPrompt ? (
                          <div className="mt-3 flex justify-center px-1">
                            <FocusNextBreakStrip
                              breakAtMinutes={quick.breakAtMinutes}
                              breakLengthMinutes={quick.breakLengthMinutes}
                              remainingToBreakSeconds={
                                quick.remainingToBreakSeconds
                              }
                              readOnly={quick.isOnBreak}
                              onEdit={() => setScheduleBreakOpen(true)}
                              onCancel={quick.cancelScheduledBreak}
                            />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>

                  <div
                    className={cn(
                      "grid transition-[grid-template-rows,opacity,margin] duration-200 ease-out",
                      pendingFocusTask
                        ? "mt-4 grid-rows-[1fr] opacity-100"
                        : "mt-0 grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="min-h-0 overflow-hidden">
                      {pendingFocusTask ? (
                        <div
                          ref={pendingFocusBannerRef}
                          role="alertdialog"
                          aria-labelledby="pending-focus-title"
                          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border-subtle bg-surface-raised px-3 py-2 text-[13px]"
                        >
                          <p
                            id="pending-focus-title"
                            className="min-w-0 flex-1 truncate text-foreground"
                          >
                            Switch focus to &ldquo;{pendingFocusTask.title}
                            &rdquo;?
                          </p>
                          <div className="flex shrink-0 gap-1.5">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-[12px]"
                              onClick={() => setPendingFocusTask(null)}
                            >
                              Keep current
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              className="h-7 px-2 text-[12px]"
                              onClick={() => {
                                activateFocusTask(pendingFocusTask);
                                setPendingFocusTask(null);
                              }}
                            >
                              Switch focus
                            </Button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <FocusCurrentTaskCard
                    key={quick.isIdle ? "idle" : "active"}
                    task={currentFocusTask}
                    groups={groups}
                    hasQueueNext={Boolean(resolveQueueHead())}
                    focusedSeconds={
                      currentFocusTask && activeSession
                        ? getTaskFocusedSeconds(
                            activeSession,
                            currentFocusTask.id,
                          )
                        : 0
                    }
                    onOpenTask={(task) => onOpenDetail(task.id)}
                    onCompleteTask={handleCompleteCurrentTask}
                    onFocusNext={handleFocusNextItem}
                    onMoveToQueueEnd={handleMoveCurrentToQueueEnd}
                    onChooseFromQueue={() => openNextUpDrawer("manual")}
                    onUpdateDescription={onUpdateDescription}
                  />

                  {NEXT_UP_WORKPLACE_UI_ENABLED ? (
                    <NextUpPreview
                      tasks={displayedNextUpTasks}
                      groups={groups}
                      demoted={
                        quick.isActive ||
                        pomodoro.isRunning ||
                        pomodoro.isPaused
                      }
                      pendingTaskId={pendingFocusTask?.id ?? null}
                      onHeaderClick={toggleNextUpDrawer}
                      onViewAll={() => openNextUpDrawer("manual")}
                      queueOpen={nextUpDrawerOpen}
                      onStartFocus={requestStartFocus}
                      onOpenTask={(task) => onOpenDetail(task.id)}
                      onMoveToTop={handleMoveQueueTaskToTop}
                      onMoveToEnd={handleMoveQueueTaskToEnd}
                      onRemove={(task) => handleRemoveQueueTask(task.id)}
                    />
                  ) : null}
                </div>
              </div>
            ) : (
              <div
                className="group/timer relative flex flex-1 flex-col items-center justify-center gap-3 py-4"
                onPointerLeave={(event) =>
                  clearTimerControlFocus(event.currentTarget)
                }
              >
                {pomodoro.isIdle ? (
                  <>
                    <p className="text-[13px] font-medium text-muted-foreground">
                      Session {sessionNumber}
                    </p>
                    <p className="font-mono text-[3rem] font-semibold tabular-nums tracking-tight text-foreground/30">
                      {pomodoro.clock}
                    </p>
                    <div className="grid w-full max-w-xs gap-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label htmlFor="wp-focus-min" className="text-[13px]">
                            Focus (min)
                          </Label>
                          <Input
                            id="wp-focus-min"
                            type="number"
                            min={1}
                            max={180}
                            value={pomodoro.focusMinutes}
                            onChange={(event) =>
                              pomodoro.setFocusMinutes(
                                Number.parseInt(event.target.value, 10) || 25,
                              )
                            }
                            className="h-8"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="wp-break-min" className="text-[13px]">
                            Break (min)
                          </Label>
                          <Input
                            id="wp-break-min"
                            type="number"
                            min={1}
                            max={60}
                            value={pomodoro.breakMinutes}
                            onChange={(event) =>
                              pomodoro.setBreakMinutes(
                                Number.parseInt(event.target.value, 10) || 5,
                              )
                            }
                            className="h-8"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={pomodoroDisabled}
                        onClick={pomodoro.startPomodoro}
                        className="h-8 w-full"
                      >
                        Start {pomodoro.focusMinutes}m / {pomodoro.breakMinutes}
                        m
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-[13px] font-medium text-muted-foreground">
                      Session {sessionNumber}
                    </p>
                    <p className="font-mono text-[3.75rem] font-semibold tabular-nums tracking-tight text-foreground">
                      {pomodoro.clock}
                    </p>
                    <p className="text-[13px] text-muted-foreground">
                      Focus {pomodoro.focusMinutes}m · Break{" "}
                      {pomodoro.breakMinutes}m
                    </p>
                    <Progress
                      value={pomodoro.progress}
                      className="h-1.5 w-full max-w-xs"
                    />
                    <TimerHoverControls>
                      {pomodoro.isPaused ? (
                        <Button
                          type="button"
                          size="sm"
                          onClick={pomodoro.resume}
                          className="h-8 rounded-full px-4"
                        >
                          <Play className="size-3.5" />
                          Resume
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={pomodoro.pause}
                          className="h-8 px-3.5"
                        >
                          <Pause className="size-3.5" />
                          Pause
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handlePomodoroStop}
                        className="h-8 px-3.5"
                      >
                        <Square className="size-3.5" />
                        Stop
                      </Button>
                    </TimerHoverControls>
                  </>
                )}
              </div>
            )}
          </div>
        </section>

        {NEXT_UP_WORKPLACE_UI_ENABLED ? (
          <NextUpDrawer
            entries={nextUpEntries}
            groups={groups}
            currentTask={currentFocusTask}
            open={nextUpDrawerOpen}
            layoutMode={queueLayoutMode}
            fetchError={nextUpFetchError}
            onOpen={() => openNextUpDrawer("manual")}
            onClose={closeNextUpDrawer}
            onStartFocusTask={requestStartFocus}
            onStartFocusHabit={activateFocusHabit}
            onOpenTask={(task) => onOpenDetail(task.id)}
            onOpenHabit={(habit) => {
              if (onOpenHabit) onOpenHabit(habit.id);
              else setActiveHabitId(habit.id, "manual");
            }}
            onRemoveTask={handleRemoveQueueTask}
            onRemoveHabit={handleRemoveQueueHabit}
            onReorder={handleReorderQueue}
            onToggleComplete={handleCompleteQueueTask}
            onClearAll={handleClearNextUpQueue}
            hasQueueNext={Boolean(resolveQueueHead())}
            onCompleteCurrentTask={handleCompleteCurrentTask}
            onFocusNext={handleFocusNextItem}
            onMoveCurrentToQueueEnd={handleMoveCurrentToQueueEnd}
            continueTasks={continueTasks}
            continueFocusSecondsByTaskId={continueFocusSecondsByTaskId}
            onAddContinueToQueue={handleAddContinueToQueue}
            onNowDrop={handleStartFocusDrop}
            listRef={nextUpDrawerListRef}
            onListScroll={() => {
              if (nextUpDrawerListRef.current) {
                nextUpDrawerScrollTopRef.current =
                  nextUpDrawerListRef.current.scrollTop;
              }
            }}
            dropZoneActive={dropActive && !habitDropBlocked}
            dropInsertPosition={
              nextUpDropBeforeKey
                ? nextUpEntries.findIndex(
                    (entry) => entry.key === nextUpDropBeforeKey,
                  ) + 1
                : nextUpEntries.length + 1
            }
            onDropZoneDrop={(event) => handleScheduleDrop(event, null)}
            externalDropBeforeKey={nextUpDropBeforeKey}
            onExternalDragOver={setNextUpDropBeforeKey}
            onExternalDrop={handleScheduleDrop}
          />
        ) : null}
      </div>

      <WorkplaceFocusReflectionModal
        open={reflectionOpen}
        onOpenChange={setReflectionOpen}
      />

      <ScheduleBreakModal
        open={scheduleBreakOpen}
        onOpenChange={setScheduleBreakOpen}
      />

      {focusSwitchNotice ? (
        <div className="pointer-events-none fixed bottom-4 right-4 z-[200]">
          <FocusSwitchToast
            newTaskTitle={focusSwitchNotice.newTask.title}
            previousTaskTitle={focusSwitchNotice.previousTask.title}
            onComplete={completePreviousFromSwitch}
            onUndo={undoFocusSwitch}
            onDismiss={dismissFocusSwitchNotice}
          />
        </div>
      ) : null}
    </>
  );
}
