"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarClock,
  Coffee,
  Pause,
  Play,
  Square,
  Timer,
} from "lucide-react";
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
import {
  WorkplaceFocusSessionComplete,
  type SessionCompleteQueueHead,
} from "@/components/workplace/workplace-focus-session-complete";
import { WorkplaceFocusReflectionModal } from "@/components/workplace/workplace-focus-reflection-modal";
import { useWorkplaceFocusTask } from "@/contexts/workplace-focus-task-context";
import { useFocusSessionContext } from "@/contexts/focus-session-context";
import { getDateKeyInTimezone, getTodayDateString, formatNowTimeInAppTimezone } from "@/lib/date-utils";
import { getTaskFocusedSeconds, getTodayFocusDisplaySeconds } from "@/lib/focus-active-session";
import { formatDuration, getSessionFocusSeconds } from "@/lib/focus-utils";
import {
  NEXT_UP_UPDATED_EVENT,
  type NextUpUpdateDetail,
} from "@/lib/next-up-events";
import {
  fetchNextUpTasks,
  getDisplayNextUpTasks,
  getNextUpTask,
  insertTaskToNextUp,
  persistNextUpOrder,
  pruneNextUpTasks,
  removeTaskFromNextUp,
  reorderNextUpTasks,
} from "@/lib/task-next-up";
import { getHabitDurationMinutes } from "@/lib/schedule-durations";
import {
  workplaceFocusCanvasClassName,
} from "@/lib/workplace-panel-appearance";
import { WORKPLACE_QUEUE_OVERLAY_MAX_PX } from "@/lib/workplace-layout";
import { shouldPromptFocusReflection } from "@/lib/focus-reflection";
import { computeTodayStats, fetchFocusSessions } from "@/lib/focus-storage";
import { TODAY_FOCUS_ANCHOR_ID } from "@/lib/today-in-place";
import {
  getActiveTimelineDrag,
} from "@/lib/timeline-drag";
import {
  acceptNextUpScheduleDrag,
  isNextUpReorderDrag,
  isScheduleKindDrag,
  parseScheduleDrop,
} from "@/lib/next-up-drag";
import {
  fetchHabitQueueRefs,
  insertHabitQueueRef,
  pruneHabitQueueRefs,
  removeHabitQueueRef,
  clearHabitQueueRefs,
} from "@/lib/queue-ref-storage";
import { cn } from "@/lib/utils";
import type { FocusSession } from "@/types/focus";
import type { QueueItem } from "@/types/queue-item";
import type { Habit } from "@/types/habit";
import type { Task, TaskGroupWithTasks } from "@/types/task";

type FocusTab = "focus" | "pomodoro";

/** Hide Next Up preview/drawer on Workplace until product decides to ship it. */
const NEXT_UP_WORKPLACE_UI_ENABLED = true;

type WorkplaceFocusCardProps = {
  groups: TaskGroupWithTasks[];
  onToggleComplete: (task: Task, markComplete?: boolean) => void;
  onOpenDetail: (taskId: string) => void;
  onContinueLater: (task: Task) => void;
  onContinueTomorrow: (task: Task) => void;
  onPlanLater: (task: Task) => void;
};

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
        "absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-200",
        alwaysVisible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0 group-hover/timer:pointer-events-auto group-hover/timer:opacity-100 group-focus-within/timer:pointer-events-auto group-focus-within/timer:opacity-100"
      )}
    >
      <div className="flex flex-wrap items-center justify-center gap-2 px-2">
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
        "relative z-[1] flex flex-col items-center justify-center text-center transition-opacity duration-200",
        "group-hover/timer:pointer-events-none group-hover/timer:opacity-0",
        "group-focus-within/timer:pointer-events-none group-focus-within/timer:opacity-0"
      )}
    >
      <p
        className={cn(
          "font-mono text-[clamp(64px,5vw,88px)] font-semibold leading-none tracking-[-0.03em] tabular-nums",
          idle ? "text-foreground/30" : "text-foreground"
        )}
      >
        {clock}
      </p>
      {statusLabel ? (
        <p
          className={cn(
            "mt-2 text-[11px] font-semibold uppercase tracking-[0.22em]",
            statusTone === "break" && "text-warning",
            statusTone === "muted" && "text-muted-foreground",
            statusTone === "focus" && "text-primary"
          )}
        >
          {statusLabel}
        </p>
      ) : null}
    </div>
  );
}

export function WorkplaceFocusCard({
  groups,
  onToggleComplete,
  onOpenDetail,
  onContinueLater,
  onContinueTomorrow,
  onPlanLater,
}: WorkplaceFocusCardProps) {
  const [tab, setTab] = useState<FocusTab>("focus");
  const [reflectionOpen, setReflectionOpen] = useState(false);
  const [scheduleBreakOpen, setScheduleBreakOpen] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [todayFocusSeconds, setTodayFocusSeconds] = useState(0);
  const [todayBreakSeconds, setTodayBreakSeconds] = useState(0);
  const [todaySessionCount, setTodaySessionCount] = useState(0);
  const [dropActive, setDropActive] = useState(false);
  const [habitDropBlocked, setHabitDropBlocked] = useState(false);
  const [habitDropNotice, setHabitDropNotice] = useState<string | null>(null);
  const dragDepthRef = useRef(0);
  const habitDropBlockedRef = useRef(false);
  const [clockLabel, setClockLabel] = useState(formatNowTimeInAppTimezone());
  const [inlineReflectionSession, setInlineReflectionSession] =
    useState<FocusSession | null>(null);
  const pendingInlineReflectionRef = useRef(false);
  const pendingSessionEndRef = useRef(false);
  const [sessionCompleteSession, setSessionCompleteSession] =
    useState<FocusSession | null>(null);
  const [nextUpDrawerOpen, setNextUpDrawerOpen] = useState(false);
  /** Tracks whether the queue was opened by the user or by an eligible drag. */
  const queueOpenModeRef = useRef<"closed" | "manual" | "drag">("closed");
  const dragAutoCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const nextUpDrawerScrollTopRef = useRef(0);
  const nextUpDrawerListRef = useRef<HTMLDivElement>(null);
  const [nextUpTasks, setNextUpTasks] = useState<Task[]>([]);
  const [habitQueueRefs, setHabitQueueRefs] = useState<QueueItem[]>([]);
  const [nextUpFetchError, setNextUpFetchError] = useState<string | null>(null);
  const [queueOverlayMode, setQueueOverlayMode] = useState(false);
  const [nextUpDropBeforeId, setNextUpDropBeforeId] = useState<string | null>(
    null
  );
  const [pendingFocusTask, setPendingFocusTask] = useState<Task | null>(null);

  const {
    activeTask,
    activeHabit,
    habits,
    setActiveTaskId,
    setActiveHabitId,
    isFocusableHabit,
  } = useWorkplaceFocusTask();
  const {
    activeSession,
    quick,
    pomodoro,
    prepareFocusTarget,
    lastSavedSession,
    tick,
  } =
    useFocusSessionContext();

  const pomodoroDisabled = quick.isActive;
  const quickStartDisabled = pomodoro.isRunning || pomodoro.isPaused;

  const displayTodayFocusSeconds = useMemo(() => {
    void tick;
    return getTodayFocusDisplaySeconds(todayFocusSeconds, activeSession);
  }, [activeSession, tick, todayFocusSeconds]);

  const sessionNumber = useMemo(() => {
    const active = tab === "focus" ? quick.isActive : pomodoro.isRunning || pomodoro.isPaused;
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
          .find((task) => task.id === activeSession.target_id && !task.completed) ??
        null
      );
    }
    if (activeSession?.target_type === "habit") return null;
    return activeTask;
  }, [activeSession, activeTask, groups, quick.isIdle]);

  const displayedNextUpTasks = useMemo(
    () => getDisplayNextUpTasks(nextUpTasks, currentFocusTask?.id ?? null),
    [currentFocusTask?.id, nextUpTasks]
  );

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const sessions = await fetchFocusSessions();
      const stats = computeTodayStats(sessions);
      const todayKey = getTodayDateString();
      setTodayFocusSeconds(stats.totalFocusSeconds);
      setTodayBreakSeconds(stats.totalBreakSeconds);
      setTodaySessionCount(
        sessions.filter(
          (session) => getDateKeyInTimezone(session.started_at) === todayKey
        ).length
      );
    } finally {
      setStatsLoading(false);
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

  useEffect(() => {
    const media = window.matchMedia(
      `(max-width: ${WORKPLACE_QUEUE_OVERLAY_MAX_PX}px)`
    );
    const sync = () => setQueueOverlayMode(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats, quick.isIdle, pomodoro.isIdle]);

  useEffect(() => {
    void refreshNextUpTasks();
  }, [groups, refreshNextUpTasks]);

  useEffect(() => {
    const liveTasks = groups.flatMap((group) => group.tasks);
    setNextUpTasks((current) => {
      const { kept, removedIds } = pruneNextUpTasks(current, liveTasks);
      if (removedIds.length === 0) return current;
      void Promise.all(removedIds.map((id) => removeTaskFromNextUp(id))).catch(
        () => {
          void refreshNextUpTasks();
        }
      );
      return kept;
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
        onHabitQueueUpdated
      );
  }, []);

  useEffect(() => {
    const onNextUpUpdated = (event: Event) => {
      const detail = (event as CustomEvent<NextUpUpdateDetail>).detail;
      if (detail?.kind === "added") {
        setNextUpTasks((current) => {
          if (current.some((task) => task.id === detail.task.id)) return current;
          return [...current, detail.task].sort(
            (a, b) => (a.queue_order ?? 0) - (b.queue_order ?? 0)
          );
        });
        return;
      }
      void refreshNextUpTasks();
    };

    window.addEventListener(NEXT_UP_UPDATED_EVENT, onNextUpUpdated);
    return () => window.removeEventListener(NEXT_UP_UPDATED_EVENT, onNextUpUpdated);
  }, [refreshNextUpTasks]);

  useEffect(() => {
    const tick = () => setClockLabel(formatNowTimeInAppTimezone());
    tick();
    const timer = window.setInterval(tick, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const handleQuickStop = useCallback(() => {
    pendingInlineReflectionRef.current = shouldPromptFocusReflection(
      quick.currentFocusSeconds
    );
    pendingSessionEndRef.current = true;
    quick.stopSession();
  }, [quick]);

  useEffect(() => {
    if (!lastSavedSession || !pendingInlineReflectionRef.current) return;
    pendingInlineReflectionRef.current = false;
    if (shouldPromptFocusReflection(getSessionFocusSeconds(lastSavedSession))) {
      setInlineReflectionSession(lastSavedSession);
    }
  }, [lastSavedSession]);

  const resolveQueueHead = useCallback((): SessionCompleteQueueHead | null => {
    const nextTask = getNextUpTask(nextUpTasks, null);
    if (nextTask) {
      return {
        kind: "task",
        id: nextTask.id,
        title: nextTask.title,
        durationMinutes: nextTask.duration_minutes,
      };
    }
    for (const ref of habitQueueRefs) {
      if (!isFocusableHabit(ref.sourceId)) continue;
      const habit = habits.find((item) => item.id === ref.sourceId);
      if (!habit || habit.completed) continue;
      return {
        kind: "habit",
        id: habit.id,
        title: habit.name,
        durationMinutes: getHabitDurationMinutes(habit.id) || null,
      };
    }
    return null;
  }, [habitQueueRefs, habits, isFocusableHabit, nextUpTasks]);

  useEffect(() => {
    if (!lastSavedSession || !pendingSessionEndRef.current) return;
    pendingSessionEndRef.current = false;
    if (resolveQueueHead()) {
      setSessionCompleteSession(lastSavedSession);
    }
  }, [lastSavedSession, resolveQueueHead]);

  const handleScheduleDrop = useCallback(
    (event: React.DragEvent, beforeTaskId: string | null = null) => {
      event.preventDefault();
      event.stopPropagation();

      setDropActive(false);
      setNextUpDropBeforeId(null);
      setHabitDropBlocked(false);
      habitDropBlockedRef.current = false;
      dragDepthRef.current = 0;

      if (isNextUpReorderDrag(event)) return;

      const payload = parseScheduleDrop(event);
      if (!payload) return;

      const finishDragAutoClose = () => {
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
      };

      if (payload.kind === "habit") {
        if (!isFocusableHabit(payload.id)) {
          setHabitDropNotice(
            "Enable Track with Focus on this habit to add it to Next Up."
          );
          return;
        }
        setHabitDropNotice(null);
        setHabitQueueRefs(insertHabitQueueRef(payload.id));
        finishDragAutoClose();
        return;
      }

      setHabitDropNotice(null);

      if (payload.kind === "task" && NEXT_UP_WORKPLACE_UI_ENABLED) {
        void insertTaskToNextUp(payload.id, beforeTaskId)
          .then(() => {
            void refreshNextUpTasks();
            finishDragAutoClose();
          })
          .catch((error: unknown) => {
            setHabitDropNotice(
              error instanceof Error
                ? error.message
                : "Couldn't add this task to Next Up."
            );
          });
        return;
      }

      setActiveTaskId(payload.id, "manual");
    },
    [isFocusableHabit, refreshNextUpTasks, setActiveTaskId]
  );

  const handleDrop = handleScheduleDrop;

  const handleDragEnter = useCallback(
    (event: React.DragEvent) => {
      if (isNextUpReorderDrag(event)) return;
      if (!isScheduleKindDrag(event)) {
        return;
      }

      dragDepthRef.current += 1;
      setDropActive(true);

      const drag = getActiveTimelineDrag();
      if (drag?.kind === "habit") {
        const blocked = !isFocusableHabit(drag.id);
        if (blocked !== habitDropBlockedRef.current) {
          habitDropBlockedRef.current = blocked;
          setHabitDropBlocked(blocked);
        }
      } else if (habitDropBlockedRef.current) {
        habitDropBlockedRef.current = false;
        setHabitDropBlocked(false);
      }
    },
    [isFocusableHabit]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    if (isNextUpReorderDrag(event)) return;
    if (!isScheduleKindDrag(event)) {
      return;
    }

    event.preventDefault();
    acceptNextUpScheduleDrag(event);
  }, []);

  const handleDragLeave = useCallback(() => {
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current > 0) return;

    setDropActive(false);
    setNextUpDropBeforeId(null);
    habitDropBlockedRef.current = false;
    setHabitDropBlocked(false);
  }, []);

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
      if (queueOpenModeRef.current !== "closed") return;
      openNextUpDrawer("drag");
    };
    window.addEventListener("dragstart", onDragStart);
    return () => window.removeEventListener("dragstart", onDragStart);
  }, [openNextUpDrawer]);

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
      setNextUpTasks((current) => current.filter((item) => item.id !== task.id));
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
      } else {
        quick.setFocusTarget(target);
      }
    },
    [prepareFocusTarget, quick, refreshNextUpTasks, setActiveTaskId]
  );

  const activateFocusHabit = useCallback(
    (habit: Habit) => {
      setActiveHabitId(habit.id, "manual");
      setHabitQueueRefs(removeHabitQueueRef(habit.id));
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
    [prepareFocusTarget, quick, setActiveHabitId]
  );

  const handleStartNext = useCallback(() => {
    const head = resolveQueueHead();
    setSessionCompleteSession(null);
    if (!head) return;
    if (head.kind === "task") {
      const task = nextUpTasks.find((item) => item.id === head.id);
      if (task) activateFocusTask(task);
      return;
    }
    const habit = habits.find((item) => item.id === head.id);
    if (habit) activateFocusHabit(habit);
  }, [
    activateFocusHabit,
    activateFocusTask,
    habits,
    nextUpTasks,
    resolveQueueHead,
  ]);

  const handleChooseAnother = useCallback(() => {
    setSessionCompleteSession(null);
  }, []);

  const completedSessionTitle = useMemo(() => {
    if (!sessionCompleteSession) return "Focus session";
    if (
      sessionCompleteSession.target_type === "task" &&
      sessionCompleteSession.target_id
    ) {
      const task = groups
        .flatMap((group) => group.tasks)
        .find((item) => item.id === sessionCompleteSession.target_id);
      return task?.title ?? "Task";
    }
    if (
      sessionCompleteSession.target_type === "habit" &&
      sessionCompleteSession.target_id
    ) {
      const habit = habits.find(
        (item) => item.id === sessionCompleteSession.target_id
      );
      return habit?.name ?? "Habit";
    }
    return "Focus session";
  }, [groups, habits, sessionCompleteSession]);

  const sessionCompleteQueueHead = useMemo(
    () => (sessionCompleteSession ? resolveQueueHead() : null),
    [resolveQueueHead, sessionCompleteSession]
  );

  const requestStartFocus = useCallback(
    (task: Task) => {
      if (
        quick.phase === "focus" &&
        currentFocusTask &&
        currentFocusTask.id !== task.id
      ) {
        setPendingFocusTask(task);
        return;
      }
      activateFocusTask(task);
    },
    [activateFocusTask, currentFocusTask, quick.phase]
  );

  const handleStartFocusDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setDropActive(false);
      setNextUpDropBeforeId(null);

      const payload = parseScheduleDrop(event);
      if (!payload) return;
      if (payload.kind !== "task") {
        setHabitDropNotice("Next Up and Focus start only support tasks.");
        return;
      }

      const task = groups
        .flatMap((group) => group.tasks)
        .find((item) => item.id === payload.id);
      if (task) requestStartFocus(task);
    },
    [groups, requestStartFocus]
  );

  const handleReorderQueue = useCallback(
    (fromIndex: number, toIndex: number) => {
      const reordered = reorderNextUpTasks(nextUpTasks, fromIndex, toIndex);
      if (reordered === nextUpTasks) return;
      setNextUpTasks(reordered);
      void persistNextUpOrder(reordered).catch(() => {
        void refreshNextUpTasks();
      });
    },
    [nextUpTasks, refreshNextUpTasks]
  );

  const handleRemoveQueueTask = useCallback(
    (taskId: string) => {
      setNextUpTasks((current) => current.filter((task) => task.id !== taskId));
      void removeTaskFromNextUp(taskId).catch(() => {
        void refreshNextUpTasks();
      });
    },
    [refreshNextUpTasks]
  );

  const handleClearNextUpQueue = useCallback(() => {
    const ids = displayedNextUpTasks.map((task) => task.id);
    setNextUpTasks([]);
    clearHabitQueueRefs();
    setHabitQueueRefs([]);
    if (ids.length === 0) return;
    void Promise.all(ids.map((id) => removeTaskFromNextUp(id))).catch(() => {
      void refreshNextUpTasks();
    });
  }, [displayedNextUpTasks, refreshNextUpTasks]);

  const handleCompleteQueueTask = useCallback(
    (task: Task) => {
      onToggleComplete(task, true);
      setNextUpTasks((current) => current.filter((item) => item.id !== task.id));
    },
    [onToggleComplete]
  );

  const handleCompleteCurrentTask = useCallback(
    (task: Task) => {
      setActiveTaskId(null, "manual");
      quick.setFocusTarget(null);
      onToggleComplete(task, true);
      setNextUpTasks((current) => current.filter((item) => item.id !== task.id));
    },
    [onToggleComplete, quick, setActiveTaskId]
  );

  const handleSkipCurrentFocus = useCallback(() => {
    setActiveTaskId(null, "manual");
    quick.setFocusTarget(null);
  }, [quick, setActiveTaskId]);

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

  return (
    <>
      <div className="flex h-full min-h-0 min-w-0 flex-1">
      <section
        id={TODAY_FOCUS_ANCHOR_ID}
        className={cn(
          "relative flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden transition-[border-color,background-color,box-shadow] duration-150",
          dropActive && habitDropBlocked
            ? "rounded-xl border border-warning/45 bg-warning-muted/40"
            : dropActive
              ? "rounded-xl border border-border-strong bg-surface-hover"
              : workplaceFocusCanvasClassName
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="shrink-0 space-y-1.5 px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5">
              <Timer
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
              <div className="inline-flex rounded-lg border border-border-subtle/60 bg-transparent p-0.5">
              {(["focus", "pomodoro"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTab(item)}
                  className={cn(
                    "rounded-md px-2.5 py-0.5 text-[14px] font-medium capitalize transition-[background-color,color,box-shadow] duration-150",
                    tab === item
                      ? "bg-surface-base/80 text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item}
                </button>
              ))}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 rounded-md px-2.5 text-[13px]"
                onClick={() => setReflectionOpen(true)}
              >
                Focus Reflection
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-2 text-[12px]">
            <div className="flex flex-wrap gap-4">
              <div>
                <p className="text-muted-foreground">Today&apos;s focus</p>
                <p className="mt-0.5 font-medium tabular-nums text-muted-foreground">
                  {statsLoading ? "—" : formatDuration(displayTodayFocusSeconds)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Today&apos;s break</p>
                <p className="mt-0.5 font-medium tabular-nums text-muted-foreground">
                  {statsLoading ? "—" : formatDuration(todayBreakSeconds)}
                </p>
              </div>
            </div>
            <p className="text-[13px] font-medium tabular-nums text-muted-foreground/80">
              {clockLabel}
            </p>
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col px-3 pb-14">
          {dropActive && habitDropBlocked ? (
            <div className="pointer-events-none absolute inset-x-3.5 top-2 z-10 rounded-md border border-dashed border-warning/50 bg-warning-muted/90 px-3 py-2 text-center text-[13px] leading-snug text-warning shadow-sm">
              Enable <span className="font-medium">Track with Focus</span> on this
              habit to drop it here.
            </div>
          ) : null}
          {habitDropNotice ? (
            <div className="mb-2 shrink-0 rounded-md border border-warning/40 bg-warning-muted/80 px-3 py-2 text-[13px] leading-snug text-warning">
              {habitDropNotice}
            </div>
          ) : null}
          {dropActive && !habitDropBlocked ? (
            <div className="absolute inset-x-3.5 top-2 z-20 grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-2">
              <div
                className="rounded-md border border-primary/65 bg-primary/15 px-3 py-3 text-center text-[13px] font-medium text-foreground"
                onDragOver={handleDragOver}
                onDrop={handleScheduleDrop}
              >
                Add to Next Up
                <span className="ml-1 font-normal text-muted-foreground">
                  Drop to insert
                </span>
              </div>
              <div
                className="rounded-md border border-border-strong bg-surface-raised px-3 py-3 text-center text-[13px] font-medium text-foreground"
                onDragOver={handleDragOver}
                onDrop={handleStartFocusDrop}
              >
                Start focus
              </div>
            </div>
          ) : null}
          {pendingFocusTask ? (
            <div className="absolute inset-x-3.5 bottom-2 z-30 flex flex-wrap items-center justify-between gap-2 rounded-md border border-border-strong bg-surface-raised px-3 py-2 text-[13px]">
              <span className="min-w-0 truncate">
                Switch focus to <strong>{pendingFocusTask.title}</strong>?
              </span>
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
          {tab === "focus" ? (
            <div className="relative min-h-0 flex-1">
              <div className="flex h-full min-h-0 min-w-0 flex-col overflow-y-auto">
              <div className="relative flex shrink-0 flex-col items-center justify-center py-1 text-center">
                {quick.isIdle ? (
                  <div className="flex w-full flex-col items-center gap-3 py-2">
                    {inlineReflectionSession ? (
                      <WorkplaceFocusInlineReflection
                        session={inlineReflectionSession}
                        onDismiss={() => setInlineReflectionSession(null)}
                      />
                    ) : null}
                    {sessionCompleteSession && sessionCompleteQueueHead ? (
                      <WorkplaceFocusSessionComplete
                        session={sessionCompleteSession}
                        completedTitle={completedSessionTitle}
                        queueHead={sessionCompleteQueueHead}
                        onStartNext={handleStartNext}
                        onChooseAnother={handleChooseAnother}
                      />
                    ) : null}
                    {!inlineReflectionSession &&
                    !(sessionCompleteSession && sessionCompleteQueueHead) ? (
                      <>
                        <WorkplaceFocusClock clock="00:00" idle />
                        <Button
                          type="button"
                          disabled={quickStartDisabled}
                          onClick={handleStartFocus}
                          className="h-8 rounded-full px-6 text-sm"
                        >
                          <Play className="size-4" data-icon="inline-start" />
                          Start Focus
                        </Button>
                      </>
                    ) : null}
                  </div>
                ) : (
                  <>
                    <div className="flex w-full flex-col items-center text-center">
                      <div className="group/timer relative mx-auto flex min-h-[5.5rem] w-full max-w-lg items-center justify-center py-1">
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
                                  onClick={quick.pause}
                                  className="h-8 px-3.5"
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
                                  className="h-8 px-3.5"
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
                                className="h-8 gap-1.5 px-3.5"
                              >
                                <CalendarClock className="size-3.5" />
                                Schedule Break
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={handleQuickStop}
                                className="h-8 px-3.5"
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
                                className="h-8 rounded-full px-4"
                              >
                                Resume Focus
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={handleQuickStop}
                                className="h-8 px-3.5"
                              >
                                Stop
                              </Button>
                            </>
                          ) : null}
                        </TimerHoverControls>
                      </div>
                      {(quick.currentFocusSeconds > 0 ||
                        quick.currentBreakSeconds > 0) && (
                        <p className="mt-1.5 text-[11px] text-muted-foreground/80">
                          Focused {formatDuration(quick.currentFocusSeconds)} · Break{" "}
                          {formatDuration(quick.currentBreakSeconds)}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>

              {!quick.isIdle && quick.breakPrompt ? (
                <div className="mt-2 flex shrink-0 justify-center px-1">
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

              {quick.hasScheduledBreak && !quick.isIdle && !quick.breakPrompt ? (
                <div className="mt-2 flex shrink-0 justify-center px-1">
                  <FocusNextBreakStrip
                    breakAtMinutes={quick.breakAtMinutes}
                    breakLengthMinutes={quick.breakLengthMinutes}
                    remainingToBreakSeconds={quick.remainingToBreakSeconds}
                    readOnly={quick.isOnBreak}
                    onEdit={() => setScheduleBreakOpen(true)}
                    onCancel={quick.cancelScheduledBreak}
                  />
                </div>
              ) : null}

              <FocusCurrentTaskCard
                key={quick.isIdle ? "idle" : currentFocusTask?.id ?? "no-task"}
                task={currentFocusTask}
                groups={groups}
                statusLabel={quick.statusLabel}
                focusedSeconds={
                  currentFocusTask && activeSession
                    ? getTaskFocusedSeconds(activeSession, currentFocusTask.id)
                    : 0
                }
                onOpenTask={(task) => onOpenDetail(task.id)}
                onCompleteTask={handleCompleteCurrentTask}
                onSkipFocus={handleSkipCurrentFocus}
                onChooseFromQueue={() => openNextUpDrawer("manual")}
              />

              {NEXT_UP_WORKPLACE_UI_ENABLED ? (
                <NextUpPreview
                  tasks={displayedNextUpTasks}
                  groups={groups}
                  demoted={quick.isActive || pomodoro.isRunning || pomodoro.isPaused}
                  onHeaderClick={toggleNextUpDrawer}
                  onViewAll={() => openNextUpDrawer("manual")}
                  dropActive={dropActive && !habitDropBlocked}
                  dropBeforeTaskId={nextUpDropBeforeId}
                  onExternalDragOver={setNextUpDropBeforeId}
                  onExternalDrop={handleScheduleDrop}
                />
              ) : null}
              </div>
            </div>
          ) : (
            <div className="group/timer relative flex flex-1 flex-col items-center justify-center gap-3 py-4">
              {pomodoro.isIdle ? (
                <>
                  <p className="text-[13px] font-medium text-muted-foreground">
                    Session {sessionNumber}
                  </p>
                  <p className="font-mono text-5xl font-semibold tabular-nums tracking-tight text-foreground/30">
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
                              Number.parseInt(event.target.value, 10) || 25
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
                              Number.parseInt(event.target.value, 10) || 5
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
                      Start {pomodoro.focusMinutes}m / {pomodoro.breakMinutes}m
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[13px] font-medium text-muted-foreground">
                    Session {sessionNumber}
                  </p>
                  <p className="font-mono text-6xl font-semibold tabular-nums tracking-tight text-foreground">
                    {pomodoro.clock}
                  </p>
                  <p className="text-[13px] text-muted-foreground">
                    Focus {pomodoro.focusMinutes}m · Break {pomodoro.breakMinutes}m
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
                      onClick={pomodoro.stop}
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
          tasks={displayedNextUpTasks}
          groups={groups}
          habits={habits}
          habitRefs={habitQueueRefs}
          currentTask={currentFocusTask}
          open={nextUpDrawerOpen}
          overlayMode={queueOverlayMode && nextUpDrawerOpen}
          fetchError={nextUpFetchError}
          onOpen={() => openNextUpDrawer("manual")}
          onClose={closeNextUpDrawer}
          onStartFocus={requestStartFocus}
          onOpenDetail={(task) => onOpenDetail(task.id)}
          onRemove={handleRemoveQueueTask}
          onRemoveHabit={(habitId) => {
            setHabitQueueRefs(removeHabitQueueRef(habitId));
          }}
          onReorder={handleReorderQueue}
          onToggleComplete={handleCompleteQueueTask}
          onClearAll={handleClearNextUpQueue}
          listRef={nextUpDrawerListRef}
          onListScroll={() => {
            if (nextUpDrawerListRef.current) {
              nextUpDrawerScrollTopRef.current =
                nextUpDrawerListRef.current.scrollTop;
            }
          }}
          dropZoneActive={dropActive && !habitDropBlocked}
          dropInsertPosition={
            nextUpDropBeforeId
              ? displayedNextUpTasks.findIndex((t) => t.id === nextUpDropBeforeId) +
                1
              : displayedNextUpTasks.length + habitQueueRefs.length + 1
          }
          onDropZoneDrop={(event) => handleScheduleDrop(event, null)}
          externalDropBeforeId={nextUpDropBeforeId}
          onExternalDragOver={setNextUpDropBeforeId}
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
    </>
  );
}
