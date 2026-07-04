"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Coffee,
  Pause,
  Play,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { TaskGroupPill } from "@/components/tasks/task-group-pill";
import { TaskPriorityFlagIcon } from "@/components/tasks/task-priority-flag-icon";
import { WorkplaceFocusReflectionModal } from "@/components/workplace/workplace-focus-reflection-modal";
import { WorkplaceFocusTaskMenu } from "@/components/workplace/workplace-focus-task-menu";
import { useWorkplaceFocusTask } from "@/contexts/workplace-focus-task-context";
import { useFocusSessionContext } from "@/contexts/focus-session-context";
import { getDateKeyInTimezone, getTodayDateString, formatNowTimeInAppTimezone } from "@/lib/date-utils";
import { formatDuration } from "@/lib/focus-utils";
import { computeTodayStats, fetchFocusSessions } from "@/lib/focus-storage";
import {
  formatTaskFocusSchedule,
  getTaskFocusTimingTone,
} from "@/lib/task-focus-display";
import { normalizeTaskPriority } from "@/lib/task-priority";
import { formatHabitTimeRangeWithDuration } from "@/lib/habit-duration";
import { getHabitDurationMinutes } from "@/lib/schedule-durations";
import { getTaskGroupAppearance } from "@/lib/task-group-appearance";
import { TODAY_FOCUS_ANCHOR_ID } from "@/lib/today-in-place";
import { TimelineHabitLabel } from "@/components/tasks/timeline-habit-label";
import {
  getActiveTimelineDrag,
  TIMELINE_DRAG_ID_MIME,
  TIMELINE_DRAG_KIND_MIME,
} from "@/lib/timeline-drag";
import { cn } from "@/lib/utils";
import type { Habit } from "@/types/habit";
import type { Task, TaskGroupWithTasks } from "@/types/task";

type FocusTab = "focus" | "pomodoro";

type WorkplaceFocusCardProps = {
  groups: TaskGroupWithTasks[];
  onToggleComplete: (task: Task, markComplete?: boolean) => void;
  onToggleHabitComplete: (habit: Habit) => void;
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
        "absolute inset-0 flex items-center justify-center transition-opacity duration-200",
        alwaysVisible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0 group-hover/timer:pointer-events-auto group-hover/timer:opacity-100"
      )}
    >
      <div className="flex flex-wrap items-center justify-center gap-3">{children}</div>
    </div>
  );
}

function TaskFocusRow({
  label,
  task,
  groups,
  descriptionExpanded,
  onToggleDescription,
  onToggleComplete,
  onOpenDetail,
  onStart,
  showStartOnHover,
  donePending,
  isPrimary,
  onContextMenu,
}: {
  label?: string;
  task: Task;
  groups: TaskGroupWithTasks[];
  descriptionExpanded?: boolean;
  onToggleDescription?: () => void;
  onToggleComplete: () => void;
  onOpenDetail: () => void;
  onStart?: () => void;
  showStartOnHover?: boolean;
  donePending?: boolean;
  isPrimary?: boolean;
  onContextMenu?: (event: React.MouseEvent<HTMLDivElement>) => void;
}) {
  const hasDescription = Boolean(task.description?.trim());
  const priority = normalizeTaskPriority(task.priority);
  const scheduleLabel = formatTaskFocusSchedule(task);
  const timingTone = isPrimary ? getTaskFocusTimingTone(task) : "neutral";
  const group = groups.find((item) => item.id === task.group_id);
  const groupAppearance = group ? getTaskGroupAppearance(group) : null;

  return (
    <div
      onContextMenu={onContextMenu}
      className={cn(
        "rounded-md border border-border/50 transition-colors duration-500",
        isPrimary && timingTone === "before" && "bg-success-muted/60",
        isPrimary && timingTone === "during-or-after" && "bg-red-500/[0.06] dark:bg-red-400/[0.08]",
        !isPrimary && "bg-muted/30",
        donePending && "translate-y-1 scale-[0.985] opacity-0"
      )}
    >
      {label ? (
        <p className="px-2 pt-1.5 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/75">
          {label}
        </p>
      ) : null}
      <div className="flex items-center gap-1.5 px-2 py-1.5">
        {hasDescription && onToggleDescription ? (
          <button
            type="button"
            onClick={onToggleDescription}
            className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/60"
            aria-expanded={descriptionExpanded}
          >
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform",
                !descriptionExpanded && "-rotate-90"
              )}
            />
          </button>
        ) : (
          <span className="size-6 shrink-0" />
        )}
        <TaskPriorityFlagIcon priority={priority} className="size-3.5 shrink-0" />
        <button
          type="button"
          onClick={onOpenDetail}
          className="min-w-0 flex-1 truncate text-left text-[14px] font-medium leading-none text-foreground hover:underline"
        >
          {task.title}
        </button>
        <div className="flex shrink-0 items-center gap-1">
          {group && groupAppearance ? (
            <TaskGroupPill
              icon={groupAppearance.icon}
              name={group.title}
              appearance={groupAppearance}
              className="max-w-[5.5rem] shrink-0 text-[12px]"
            />
          ) : null}
          <span className="shrink-0 text-[13px] tabular-nums text-muted-foreground">
            {scheduleLabel}
          </span>
        </div>
        <div className="flex w-[4.75rem] shrink-0 justify-end">
          {showStartOnHover && onStart ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-6 w-full px-2 text-[13px]"
              onClick={onStart}
            >
              <Play className="size-3" />
              Start
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className={cn(
                "h-6 w-full px-2 text-[13px] transition-colors",
                donePending &&
                  "border-success/55 bg-success-muted text-success hover:bg-success-muted"
              )}
              disabled={donePending}
              onClick={onToggleComplete}
            >
              <Check className="size-3" />
              {donePending ? "Completed" : "Done"}
            </Button>
          )}
        </div>
      </div>
      {hasDescription && descriptionExpanded ? (
        <div className="max-h-24 overflow-y-auto border-t border-divider px-2 py-1.5">
          <p className="text-[12px] leading-relaxed whitespace-pre-wrap text-muted-foreground">
            {task.description}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function HabitFocusRow({
  habit,
  donePending,
  onToggleComplete,
}: {
  habit: Habit;
  donePending?: boolean;
  onToggleComplete: () => void;
}) {
  const scheduleLabel = formatHabitTimeRangeWithDuration(
    habit.scheduled_time,
    getHabitDurationMinutes(habit.id)
  );

  return (
    <div
      className={cn(
        "rounded-md border border-border/50 border-l-[3px] border-l-warning/50 bg-muted/30 transition-all duration-500",
        donePending && "translate-y-1 scale-[0.985] opacity-0"
      )}
    >
      <div className="flex items-center gap-1.5 px-2 py-1.5">
        <span className="size-6 shrink-0" />
        <TimelineHabitLabel compact trackWithFocus={habit.track_with_focus} />
        <p className="min-w-0 flex-1 truncate text-[14px] font-medium leading-none text-foreground">
          {habit.name}
        </p>
        {scheduleLabel ? (
          <span className="shrink-0 text-[13px] tabular-nums text-muted-foreground">
            {scheduleLabel}
          </span>
        ) : null}
        <div className="flex w-[4.75rem] shrink-0 justify-end">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className={cn(
              "h-6 w-full px-2 text-[13px] transition-colors",
              donePending &&
                "border-success/55 bg-success-muted text-success hover:bg-success-muted"
            )}
            disabled={donePending}
            onClick={onToggleComplete}
          >
            <Check className="size-3" />
            {donePending ? "Completed" : "Done"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function WorkplaceFocusCard({
  groups,
  onToggleComplete,
  onToggleHabitComplete,
  onOpenDetail,
  onContinueLater,
  onContinueTomorrow,
  onPlanLater,
}: WorkplaceFocusCardProps) {
  const [tab, setTab] = useState<FocusTab>("focus");
  const [reflectionOpen, setReflectionOpen] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [todayFocusSeconds, setTodayFocusSeconds] = useState(0);
  const [todayBreakSeconds, setTodayBreakSeconds] = useState(0);
  const [todaySessionCount, setTodaySessionCount] = useState(0);
  const [dropActive, setDropActive] = useState(false);
  const [habitDropBlocked, setHabitDropBlocked] = useState(false);
  const [habitDropNotice, setHabitDropNotice] = useState<string | null>(null);
  const dragDepthRef = useRef(0);
  const habitDropBlockedRef = useRef(false);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const [focusTaskMenu, setFocusTaskMenu] = useState<{
    task: Task;
    x: number;
    y: number;
  } | null>(null);
  const [completingHabitId, setCompletingHabitId] = useState<string | null>(null);
  const [promotedNextId, setPromotedNextId] = useState<string | null>(null);
  const [clockLabel, setClockLabel] = useState(formatNowTimeInAppTimezone());

  const {
    activeTask,
    activeHabit,
    nextTask,
    setActiveTaskId,
    setActiveHabitId,
    setActiveFocusTarget,
    notifyTaskCompleted,
    isFocusableHabit,
  } = useWorkplaceFocusTask();
  const { quick, pomodoro, prepareFocusTarget } = useFocusSessionContext();

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

  useEffect(() => {
    void loadStats();
  }, [loadStats, quick.isIdle, pomodoro.isIdle]);

  useEffect(() => {
    const tick = () => setClockLabel(formatNowTimeInAppTimezone());
    tick();
    const timer = window.setInterval(tick, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!activeTask || completingTaskId !== activeTask.id) return;
    const timer = window.setTimeout(() => {
      setCompletingTaskId(null);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [activeTask, completingTaskId]);

  useEffect(() => {
    if (!promotedNextId) return;
    const timer = window.setTimeout(() => setPromotedNextId(null), 700);
    return () => window.clearTimeout(timer);
  }, [promotedNextId]);

  const handleDoneWithAnimation = useCallback(
    (task: Task) => {
      if (completingTaskId === task.id) return;
      const upcomingNextId = nextTask?.id ?? null;
      setCompletingTaskId(task.id);
      window.setTimeout(() => {
        onToggleComplete(task, true);
        notifyTaskCompleted(task.id);
        if (upcomingNextId) setPromotedNextId(upcomingNextId);
      }, 1000);
    },
    [completingTaskId, nextTask?.id, notifyTaskCompleted, onToggleComplete]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setDropActive(false);
      setHabitDropBlocked(false);
      habitDropBlockedRef.current = false;
      dragDepthRef.current = 0;
      const kind = event.dataTransfer.getData(TIMELINE_DRAG_KIND_MIME);
      const id = event.dataTransfer.getData(TIMELINE_DRAG_ID_MIME);
      if (!id) return;

      if (kind === "task") {
        setHabitDropNotice(null);
        setActiveTaskId(id, "manual");
        return;
      }

      if (kind === "habit") {
        if (isFocusableHabit(id)) {
          setHabitDropNotice(null);
          setActiveHabitId(id, "manual");
          return;
        }

        setHabitDropNotice(
          "This habit can't be focused yet. Turn on Track with Focus in habit settings to use it here."
        );
      }
    },
    [isFocusableHabit, setActiveHabitId, setActiveTaskId]
  );

  const handleDragEnter = useCallback(
    (event: React.DragEvent) => {
      if (!event.dataTransfer.types.includes(TIMELINE_DRAG_KIND_MIME)) {
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
    if (!event.dataTransfer.types.includes(TIMELINE_DRAG_KIND_MIME)) {
      return;
    }

    event.preventDefault();
  }, []);

  const handleDragLeave = useCallback(() => {
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current > 0) return;

    setDropActive(false);
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

  const handleFocusTaskContextMenu = useCallback(
    (task: Task) => (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      setFocusTaskMenu({ task, x: event.clientX, y: event.clientY });
    },
    []
  );

  const clearFocusAfterPlanning = useCallback(() => {
    setActiveFocusTarget(null, "auto");
    setFocusTaskMenu(null);
  }, [setActiveFocusTarget]);

  return (
    <>
      <section
        id={TODAY_FOCUS_ANCHOR_ID}
        className={cn(
          "relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border transition-[border-color,background-color,box-shadow] duration-150",
          dropActive && habitDropBlocked
            ? "border-warning/45 bg-warning-muted/40"
            : dropActive
              ? "border-primary/40 bg-surface-elevated shadow-md"
              : "border-border bg-surface-elevated shadow-sm"
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="shrink-0 space-y-2 px-3.5 py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex rounded-lg border border-border/60 bg-muted/40 p-0.5">
              {(["focus", "pomodoro"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTab(item)}
                  className={cn(
                    "rounded-md px-2.5 py-0.5 text-[14px] font-medium capitalize transition-[background-color,color,box-shadow] duration-150",
                    tab === item
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
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

          <div className="flex flex-wrap items-end justify-between gap-4 text-[14px]">
            <div className="flex flex-wrap gap-6">
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
            <p className="text-[17px] font-semibold tabular-nums text-muted-foreground">
              {clockLabel}
            </p>
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col px-3.5 pb-3.5">
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
          {tab === "focus" ? (
            <>
              <div className="group/timer relative flex shrink-0 flex-col items-center justify-center py-2 text-center">
                {quick.isIdle ? (
                  <div className="flex w-full max-w-sm flex-col items-center gap-5">
                    <Button
                      type="button"
                      disabled={quickStartDisabled}
                      onClick={handleStartFocus}
                      className="h-11 rounded-full px-10 text-sm"
                    >
                      <Play className="size-4" data-icon="inline-start" />
                      Start Focus
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="mb-2 text-[14px] font-medium text-muted-foreground">
                      Session {sessionNumber}
                    </p>
                    <p
                      className={cn(
                        "font-mono text-[49px] font-semibold tabular-nums tracking-tight",
                        quick.isOnBreak ? "text-warning" : "text-foreground"
                      )}
                    >
                      {quick.clock}
                    </p>
                    {(quick.currentFocusSeconds > 0 ||
                      quick.currentBreakSeconds > 0) && (
                      <p className="mt-3 text-[13px] text-muted-foreground">
                        Focus {formatDuration(quick.currentFocusSeconds)} · Break{" "}
                        {formatDuration(quick.currentBreakSeconds)}
                      </p>
                    )}
                    <TimerHoverControls alwaysVisible>
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
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={quick.stopSession}
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
                            onClick={quick.stopSession}
                            className="h-8 px-3.5"
                          >
                            Stop
                          </Button>
                        </>
                      ) : null}
                    </TimerHoverControls>
                  </>
                )}
              </div>

              <div className="mt-1 min-h-[4.5rem] space-y-2">
                {activeTask ? (
                  <div
                    key={activeTask.id}
                    className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <TaskFocusRow
                      task={activeTask}
                      groups={groups}
                      isPrimary
                      descriptionExpanded={descriptionExpanded}
                      onToggleDescription={() =>
                        setDescriptionExpanded((value) => !value)
                      }
                      onToggleComplete={() => handleDoneWithAnimation(activeTask)}
                      onOpenDetail={() => onOpenDetail(activeTask.id)}
                      onContextMenu={handleFocusTaskContextMenu(activeTask)}
                      donePending={completingTaskId === activeTask.id}
                    />
                  </div>
                ) : activeHabit ? (
                  <div
                    key={activeHabit.id}
                    className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <HabitFocusRow
                      habit={activeHabit}
                      donePending={completingHabitId === activeHabit.id}
                      onToggleComplete={() => {
                        if (completingHabitId === activeHabit.id) return;
                        setCompletingHabitId(activeHabit.id);
                        window.setTimeout(() => {
                          onToggleHabitComplete(activeHabit);
                          setCompletingHabitId(null);
                          setActiveFocusTarget(null, "auto");
                        }, 1000);
                      }}
                    />
                  </div>
                ) : (
                  <div className="flow-empty px-2.5 py-2.5 text-center text-[12px] text-muted-foreground/85">
                    {dropActive
                      ? "Drop to focus"
                      : "Hover timeline to drag a task or focus habit here"}
                  </div>
                )}

                {nextTask ? (
                  <div
                    key={nextTask.id}
                    className={cn(
                      "group/row transition-all duration-500",
                      promotedNextId === nextTask.id &&
                        "animate-in fade-in slide-in-from-bottom-3 duration-500"
                    )}
                  >
                    <TaskFocusRow
                      label="Next"
                      task={nextTask}
                      groups={groups}
                      onToggleComplete={() => onToggleComplete(nextTask, true)}
                      onOpenDetail={() => onOpenDetail(nextTask.id)}
                      onStart={() => {
                        prepareFocusTarget({
                          type: "task",
                          id: nextTask.id,
                          label: nextTask.title,
                        });
                        setActiveTaskId(nextTask.id, "manual");
                        quick.startFocus();
                      }}
                      onContextMenu={handleFocusTaskContextMenu(nextTask)}
                      showStartOnHover
                    />
                  </div>
                ) : null}
              </div>
            </>
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
                  <TimerHoverControls alwaysVisible>
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

      {focusTaskMenu ? (
        <WorkplaceFocusTaskMenu
          x={focusTaskMenu.x}
          y={focusTaskMenu.y}
          completed={focusTaskMenu.task.completed}
          onClose={() => setFocusTaskMenu(null)}
          onContinueLater={() => {
            onContinueLater(focusTaskMenu.task);
            clearFocusAfterPlanning();
          }}
          onContinueTomorrow={() => {
            onContinueTomorrow(focusTaskMenu.task);
            clearFocusAfterPlanning();
          }}
          onPlanLater={() => {
            onPlanLater(focusTaskMenu.task);
            clearFocusAfterPlanning();
          }}
        />
      ) : null}
    </>
  );
}
