"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { TaskGroupWithTasks } from "@/types/task";

const TaskBoardGroupsContext = createContext<TaskGroupWithTasks[] | null>(null);

export function TaskBoardGroupsProvider({
  groups,
  children,
}: {
  groups: TaskGroupWithTasks[];
  children: ReactNode;
}) {
  return (
    <TaskBoardGroupsContext.Provider value={groups}>
      {children}
    </TaskBoardGroupsContext.Provider>
  );
}

export function useOptionalTaskBoardGroups(): TaskGroupWithTasks[] | null {
  return useContext(TaskBoardGroupsContext);
}

export function useTaskBoardGroups(): TaskGroupWithTasks[] {
  const groups = useContext(TaskBoardGroupsContext);
  if (!groups) {
    throw new Error("useTaskBoardGroups must be used within TaskBoardGroupsProvider");
  }
  return groups;
}
