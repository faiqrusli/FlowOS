"use client";

import {
  createContext,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import type { PlanningState, Task } from "@/types/task";

export type TaskBoardActions = {
  onToggleComplete: (task: Task) => void;
  onOpenDetail: (taskId: string) => void;
  onDuplicateTask: (task: Task) => void;
  onMoveTask: (taskId: string, groupId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onSetPlanningState?: (taskId: string, planningState: PlanningState) => void;
  onRequestCreateGroup: (taskId: string) => void;
  onTaskPointerDragStart: (
    taskId: string,
    groupId: string,
    coords: { clientX: number; clientY: number }
  ) => void;
  onTaskPointerDragEnd: () => void;
};

const TaskBoardActionsContext = createContext<TaskBoardActions | null>(null);

export function useTaskBoardActions(): TaskBoardActions {
  const ctx = useContext(TaskBoardActionsContext);
  if (!ctx) {
    throw new Error("useTaskBoardActions must be used within TaskBoardActionsProvider");
  }
  return ctx;
}

type TaskBoardActionsProviderProps = {
  children: ReactNode;
  actions: TaskBoardActions;
};

export function TaskBoardActionsProvider({
  children,
  actions,
}: TaskBoardActionsProviderProps) {
  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  const stable = useMemo<TaskBoardActions>(
    () => ({
      onToggleComplete: (task) => actionsRef.current.onToggleComplete(task),
      onOpenDetail: (taskId) => actionsRef.current.onOpenDetail(taskId),
      onDuplicateTask: (task) => actionsRef.current.onDuplicateTask(task),
      onMoveTask: (taskId, groupId) =>
        actionsRef.current.onMoveTask(taskId, groupId),
      onDeleteTask: (taskId) => actionsRef.current.onDeleteTask(taskId),
      onUpdateTask: (taskId, updates) =>
        actionsRef.current.onUpdateTask(taskId, updates),
      onSetPlanningState: actionsRef.current.onSetPlanningState
        ? (taskId, planningState) =>
            actionsRef.current.onSetPlanningState?.(taskId, planningState)
        : undefined,
      onRequestCreateGroup: (taskId) =>
        actionsRef.current.onRequestCreateGroup(taskId),
      onTaskPointerDragStart: (taskId, groupId, coords) =>
        actionsRef.current.onTaskPointerDragStart(taskId, groupId, coords),
      onTaskPointerDragEnd: () => actionsRef.current.onTaskPointerDragEnd(),
    }),
    []
  );

  return (
    <TaskBoardActionsContext.Provider value={stable}>
      {children}
    </TaskBoardActionsContext.Provider>
  );
}
