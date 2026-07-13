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
import {
  WORKPLACE_FOCUS_TIMER_RING_SIZE,
  FocusTimerRing,
} from "@/components/focus/focus-timer-ring";
import { ScheduleBreakModal } from "@/components/focus/schedule-break-modal";
import { WorkplaceFocusInlineReflection } from "@/components/workplace/workplace-focus-inline-reflection";
import { WorkplaceFocusReflectionModal } from "@/components/workplace/workplace-focus-reflection-modal";
import { useWorkplaceFocusTask } from "@/contexts/workplace-focus-task-context";
import { useFocusSessionContext } from "@/contexts/focus-session-context";
import { getDateKeyInTimezone, getTodayDateString, formatNowTimeInAppTimezone } from "@/lib/date-utils";
import { getTaskFocusedSeconds } from "@/lib/focus-active-session";
import { formatDuration, getSessionFocusSeconds } from "@/lib/focus-utils";
import {
  NEXT_UP_UPDATED_EVENT,
  type NextUpUpdateDetail,
} from "@/lib/next-up-events";
import {
  fetchNextUpTasks,
  getDisplayNextUpTasks,
  insertTaskToNextUp,
  persistNextUpOrder,
  removeTaskFromNextUp,
  reorderNextUpTasks,
} from "@/lib/task-next-up";
import { workplaceFocusSectionClassName } from "@/lib/workplace-panel-appearance";
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
import { cn } from "@/lib/utils";
import type { FocusSession } from "@/types/focus";
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
  compact = false,
}: {
  children: React.ReactNode;
  alwaysVisible?: boolean;
  compact?: boolean;
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
      <div
        className={cn(
          "flex items-center justify-center",
          compact ? "flex-col gap-2 px-3" : "flex-wrap gap-3"
        )}
      >
        {children}
      </div>
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
  const [nextUpDrawerOpen, setNextUpDrawerOpen] = useState(false);
  const nextUpDrawerScrollTopRef = useRef(0);
  const nextUpDrawerListRef = useRef<HTMLDivElement>(null);
  const [nextUpTasks, setNextUpTasks] = useState<Task[]>([]);
  const [nextUpDropBeforeId, setNextUpDropBeforeId] = useState<string | null>(
    null
  );
  const [pendingFocusTask, setPendingFocusTask] = useState<Task | null>(null);

  const {
    activeTask,
    activeHabit,
    setActiveTaskId,
    isFocusableHabit,
  } = useWorkplaceFocusTask();
  const {
    activeSession,
    quick,
    pomodoro,
    prepareFocusTarget,
    lastSavedSession,
  } =
    useFocusSessionContext();

  const pomodoroDisabled = quick.isActive;
  const quickStartDisabled = pomodoro.isRunning || pomodoro.isPaused;

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
    } catch {
      setNextUpTasks([]);
    }
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats, quick.isIdle, pomodoro.isIdle]);

  useEffect(() => {
    void refreshNextUpTasks();
  }, [groups, refreshNextUpTasks]);

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
    quick.stopSession();
  }, [quick]);

  useEffect(() => {
    if (!lastSavedSession || !pendingInlineReflectionRef.current) return;
    pendingInlineReflectionRef.current = false;
    if (shouldPromptFocusReflection(getSessionFocusSeconds(lastSavedSession))) {
      setInlineReflectionSession(lastSavedSession);
    }
  }, [lastSavedSession]);

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

      if (payload.kind === "habit") {
        setHabitDropNotice("Next Up only supports tasks.");
        return;
      }

      setHabitDropNotice(null);

      if (payload.kind === "task" && NEXT_UP_WORKPLACE_UI_ENABLED) {
        void insertTaskToNextUp(payload.id, beforeTaskId)
          .then(refreshNextUpTasks)
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
    [
      refreshNextUpTasks,
      setActiveTaskId,
    ]
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
    setNextUpDrawerOpen(false);
  }, []);

  const openNextUpDrawer = useCallback(() => {
    setNextUpDrawerOpen(true);
  }, []);

  const toggleNextUpDrawer = useCallback(() => {
    if (nextUpDrawerOpen) {
      closeNextUpDrawer();
      return;
    }
    openNextUpDrawer();
  }, [closeNextUpDrawer, nextUpDrawerOpen, openNextUpDrawer]);

  const activateFocusTask = useCallback(
    (task: Task) => {
      setActiveTaskId(task.id, "manual");
      setNextUpTasks((current) => current.filter((item) => item.id !== task.id));
      setNextUpDrawerOpen(false);
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

  const showNextUpDrawer = NEXT_UP_WORKPLACE_UI_ENABLED && nextUpDrawerOpen;

  return (
    <>
      <section
        id={TODAY_FOCUS_ANCHOR_ID}
        className={cn(
          "relative flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border transition-[border-color,background-color,box-shadow] duration-150",
          dropActive && habitDropBlocked
            ? "border-warning/45 bg-warning-muted/40"
            : dropActive
              ? "border-border-focus bg-surface-focus-hover"
              : workplaceFocusSectionClassName
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
              <div className="inline-flex rounded-lg border border-border-subtle bg-surface-base p-0.5">
              {(["focus", "pomodoro"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTab(item)}
                  className={cn(
                    "rounded-md px-2.5 py-0.5 text-[14px] font-medium capitalize transition-[background-color,color,box-shadow] duration-150",
                    tab === item
                      ? "bg-surface-raised text-foreground shadow-xs"
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

          <div className="flex flex-wrap items-end justify-between gap-2 text-[13px]">
            <div className="flex flex-wrap gap-4">
              <div>
                <p className="text-muted-foreground">Today&apos;s focus</p>
                <p className="mt-0.5 font-semibold tabular-nums text-foreground">
                  {statsLoading ? "—" : formatDuration(todayFocusSeconds)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Today&apos;s break</p>
                <p className="mt-0.5 font-semibold tabular-nums text-foreground">
                  {statsLoading ? "—" : formatDuration(todayBreakSeconds)}
                </p>
              </div>
            </div>
            <p className="text-[15px] font-semibold tabular-nums text-muted-foreground">
              {clockLabel}
            </p>
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col px-3 pb-2.5">
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
                className="rounded-md border border-border-focus/65 bg-card/95 px-3 py-3 text-center text-[13px] font-medium text-foreground"
                onDragOver={handleDragOver}
                onDrop={handleStartFocusDrop}
              >
                Start focus
              </div>
            </div>
          ) : null}
          {pendingFocusTask ? (
            <div className="absolute inset-x-3.5 bottom-2 z-30 flex flex-wrap items-center justify-between gap-2 rounded-md border border-border-focus/65 bg-card px-3 py-2 text-[13px]">
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
                  inlineReflectionSession ? (
                    <WorkplaceFocusInlineReflection
                      session={inlineReflectionSession}
                      onDismiss={() => setInlineReflectionSession(null)}
                    />
                  ) : (
                  <div className="flex w-full flex-col items-center gap-3">
                    <FocusTimerRing
                      clock="00:00"
                      focusSeconds={0}
                      isActive={false}
                      statusLabel=""
                      size={WORKPLACE_FOCUS_TIMER_RING_SIZE}
                    >
                      <Button
                        type="button"
                        disabled={quickStartDisabled}
                        onClick={handleStartFocus}
                        className="h-8 rounded-full px-6 text-sm"
                      >
                        <Play className="size-4" data-icon="inline-start" />
                        Start Focus
                      </Button>
                    </FocusTimerRing>
                  </div>
                  )
                ) : (
                  <>
                    <div className="flex w-full flex-col items-center text-center">
                      <p className="mb-1 text-[12px] font-medium text-muted-foreground">
                        Session {sessionNumber}
                      </p>
                      <div className="relative">
                        <div
                          className="group/timer relative mx-auto"
                          style={{
                            width: WORKPLACE_FOCUS_TIMER_RING_SIZE,
                            height: WORKPLACE_FOCUS_TIMER_RING_SIZE,
                          }}
                        >
                          <FocusTimerRing
                            clock={quick.clock}
                            focusSeconds={quick.currentFocusSeconds}
                            isActive={!quick.isIdle}
                            size={WORKPLACE_FOCUS_TIMER_RING_SIZE}
                            statusLabel={
                              quick.isOnBreak
                                ? "On Break"
                                : quick.isPaused
                                  ? "Paused"
                                  : "Focusing"
                            }
                            statusTone={
                              quick.isOnBreak
                                ? "break"
                                : quick.isPaused
                                  ? "muted"
                                  : "focus"
                            }
                          />
                          <TimerHoverControls compact>
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
                      </div>
                      {(quick.currentFocusSeconds > 0 ||
                        quick.currentBreakSeconds > 0) && (
                        <p className="mt-1.5 text-[12px] text-muted-foreground">
                          Focus {formatDuration(quick.currentFocusSeconds)} · Break{" "}
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
                onChooseFromQueue={openNextUpDrawer}
              />

              {NEXT_UP_WORKPLACE_UI_ENABLED && !showNextUpDrawer ? (
                <NextUpPreview
                  tasks={displayedNextUpTasks}
                  groups={groups}
                  onHeaderClick={toggleNextUpDrawer}
                  onViewAll={openNextUpDrawer}
                  dropActive={dropActive && !habitDropBlocked}
                  dropBeforeTaskId={nextUpDropBeforeId}
                  onExternalDragOver={setNextUpDropBeforeId}
                  onExternalDrop={handleScheduleDrop}
                />
              ) : null}
              </div>

              {showNextUpDrawer ? (
                <NextUpDrawer
                  tasks={displayedNextUpTasks}
                  groups={groups}
                  currentTask={currentFocusTask}
                  onClose={closeNextUpDrawer}
                  onStartFocus={requestStartFocus}
                  onOpenDetail={(task) => onOpenDetail(task.id)}
                  onRemove={handleRemoveQueueTask}
                  onReorder={handleReorderQueue}
                  onToggleComplete={handleCompleteQueueTask}
                  listRef={nextUpDrawerListRef}
                  onListScroll={() => {
                    if (nextUpDrawerListRef.current) {
                      nextUpDrawerScrollTopRef.current =
                        nextUpDrawerListRef.current.scrollTop;
                    }
                  }}
                  dropZoneActive={dropActive && !habitDropBlocked}
                  onDropZoneDrop={handleScheduleDrop}
                  externalDropBeforeId={nextUpDropBeforeId}
                  onExternalDragOver={setNextUpDropBeforeId}
                  onExternalDrop={handleScheduleDrop}
                />
              ) : null}
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
