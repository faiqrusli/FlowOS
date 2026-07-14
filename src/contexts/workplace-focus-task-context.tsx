"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { isHabitScheduledOnDate } from "@/lib/habit-stats";
import { isHabitCompletedOnDate } from "@/lib/habits";
import {
  findNextScheduledTask,
  findTaskAtNow,
} from "@/lib/workplace-focus-task";
import { NEXT_UP_UPDATED_EVENT } from "@/lib/next-up-events";
import { fetchNextUpTasks } from "@/lib/task-next-up";
import type { FocusTargetType } from "@/types/focus";
import type { Habit } from "@/types/habit";
import type { Task } from "@/types/task";

type ActiveTargetSource = "auto" | "manual";

export type FocusTarget = {
  type: FocusTargetType;
  id: string;
};

type WorkplaceFocusTaskContextValue = {
  activeTarget: FocusTarget | null;
  activeTask: Task | null;
  activeHabit: Habit | null;
  habits: Habit[];
  nextTask: Task | null;
  setActiveTaskId: (taskId: string | null, source?: ActiveTargetSource) => void;
  setActiveHabitId: (habitId: string | null, source?: ActiveTargetSource) => void;
  setActiveFocusTarget: (
    target: FocusTarget | null,
    source?: ActiveTargetSource
  ) => void;
  clearManualActive: () => void;
  notifyTaskCompleted: (taskId: string) => void;
  isFocusableHabit: (habitId: string) => boolean;
};

const WorkplaceFocusTaskContext =
  createContext<WorkplaceFocusTaskContextValue | null>(null);

export function WorkplaceFocusTaskProvider({
  tasks,
  habits,
  viewDate,
  children,
}: {
  tasks: Task[];
  habits: Habit[];
  viewDate: string;
  children: ReactNode;
}) {
  const [activeTarget, setActiveTargetState] = useState<FocusTarget | null>(null);
  const [hasNextUpTasks, setHasNextUpTasks] = useState(false);
  const activeSourceRef = useRef<ActiveTargetSource>("auto");

  const taskById = useMemo(
    () => new Map(tasks.map((task) => [task.id, task])),
    [tasks]
  );

  const habitById = useMemo(
    () => new Map(habits.map((habit) => [habit.id, habit])),
    [habits]
  );

  const isFocusableHabit = useCallback(
    (habitId: string) => {
      const habit = habitById.get(habitId);
      if (!habit?.track_with_focus) return false;
      if (!isHabitScheduledOnDate(habit, viewDate)) return false;
      return !isHabitCompletedOnDate(habit, viewDate);
    },
    [habitById, viewDate]
  );

  const setActiveFocusTarget = useCallback(
    (target: FocusTarget | null, source: ActiveTargetSource = "manual") => {
      if (target?.type === "task") {
        const task = taskById.get(target.id);
        if (!task || task.completed) return;
      }

      if (target?.type === "habit") {
        if (!isFocusableHabit(target.id)) return;
      }

      activeSourceRef.current = source;
      setActiveTargetState(target);
    },
    [isFocusableHabit, taskById]
  );

  const setActiveTaskId = useCallback(
    (taskId: string | null, source: ActiveTargetSource = "manual") => {
      setActiveFocusTarget(
        taskId ? { type: "task", id: taskId } : null,
        source
      );
    },
    [setActiveFocusTarget]
  );

  const setActiveHabitId = useCallback(
    (habitId: string | null, source: ActiveTargetSource = "manual") => {
      setActiveFocusTarget(
        habitId ? { type: "habit", id: habitId } : null,
        source
      );
    },
    [setActiveFocusTarget]
  );

  const clearManualActive = useCallback(() => {
    activeSourceRef.current = "auto";
    const autoTask = findTaskAtNow(tasks, viewDate);
    setActiveTargetState(autoTask ? { type: "task", id: autoTask.id } : null);
  }, [tasks, viewDate]);

  useEffect(() => {
    const refreshQueueState = () => {
      void fetchNextUpTasks()
        .then((queue) => setHasNextUpTasks(queue.length > 0))
        .catch(() => setHasNextUpTasks(false));
    };

    refreshQueueState();
    window.addEventListener(NEXT_UP_UPDATED_EVENT, refreshQueueState);
    return () =>
      window.removeEventListener(NEXT_UP_UPDATED_EVENT, refreshQueueState);
  }, []);

  const notifyTaskCompleted = useCallback(
    (taskId: string) => {
      setActiveTargetState((current) => {
        if (!current || current.type !== "task" || current.id !== taskId) {
          return current;
        }

        const next = findNextScheduledTask(tasks, viewDate, taskId);
        if (next) {
          activeSourceRef.current = "manual";
          return { type: "task", id: next.id };
        }

        activeSourceRef.current = "auto";
        const autoTask = findTaskAtNow(tasks, viewDate);
        return autoTask ? { type: "task", id: autoTask.id } : null;
      });
    },
    [tasks, viewDate]
  );

  useEffect(() => {
    if (activeSourceRef.current !== "auto") return;
    if (hasNextUpTasks) return;

    const sync = () => {
      const autoTask = findTaskAtNow(tasks, viewDate);
      setActiveTargetState((current) => {
        if (current?.type === "habit") return current;
        const next = autoTask ? { type: "task" as const, id: autoTask.id } : null;
        if (current?.type === "task" && current.id === next?.id) return current;
        if (!current && !next) return current;
        if (current?.type === "task" && !next) return null;
        return next;
      });
    };

    sync();
    const timer = window.setInterval(sync, 30_000);
    return () => window.clearInterval(timer);
  }, [hasNextUpTasks, tasks, viewDate]);

  const activeTask =
    activeTarget?.type === "task"
      ? (taskById.get(activeTarget.id) ?? null)
      : null;

  const resolvedActiveTask =
    activeTask && !activeTask.completed ? activeTask : null;

  const activeHabit =
    activeTarget?.type === "habit"
      ? (habitById.get(activeTarget.id) ?? null)
      : null;

  const resolvedActiveHabit =
    activeHabit && isFocusableHabit(activeHabit.id) ? activeHabit : null;

  const resolvedTarget =
    resolvedActiveTask
      ? ({ type: "task" as const, id: resolvedActiveTask.id } satisfies FocusTarget)
      : resolvedActiveHabit
        ? ({ type: "habit" as const, id: resolvedActiveHabit.id } satisfies FocusTarget)
        : null;

  const nextTask = useMemo(
    () =>
      findNextScheduledTask(
        tasks,
        viewDate,
        resolvedActiveTask?.id ?? (activeTarget?.type === "task" ? activeTarget.id : null)
      ),
    [tasks, viewDate, resolvedActiveTask?.id, activeTarget]
  );

  const value = useMemo<WorkplaceFocusTaskContextValue>(
    () => ({
      activeTarget: resolvedTarget,
      activeTask: resolvedActiveTask,
      activeHabit: resolvedActiveHabit,
      habits,
      nextTask,
      setActiveTaskId,
      setActiveHabitId,
      setActiveFocusTarget,
      clearManualActive,
      notifyTaskCompleted,
      isFocusableHabit,
    }),
    [
      resolvedTarget,
      resolvedActiveTask,
      resolvedActiveHabit,
      habits,
      nextTask,
      setActiveTaskId,
      setActiveHabitId,
      setActiveFocusTarget,
      clearManualActive,
      notifyTaskCompleted,
      isFocusableHabit,
    ]
  );

  return (
    <WorkplaceFocusTaskContext.Provider value={value}>
      {children}
    </WorkplaceFocusTaskContext.Provider>
  );
}

export function useWorkplaceFocusTask() {
  const context = useContext(WorkplaceFocusTaskContext);
  if (!context) {
    throw new Error(
      "useWorkplaceFocusTask must be used within WorkplaceFocusTaskProvider"
    );
  }
  return context;
}
