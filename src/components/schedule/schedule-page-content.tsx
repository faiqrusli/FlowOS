"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  TaskDetailPanel,
  DETAIL_PANEL_COLLAPSED_WIDTH_PX,
  DETAIL_PANEL_WIDTH_PX,
} from "@/components/tasks/task-detail-panel";
import { TimelinePlanner } from "@/components/tasks/timeline-planner";
import { ErrorBanner } from "@/components/shared/error-banner";
import { WORKSPACE_GUTTER_CLASS } from "@/lib/workspace-layout";
import { cn } from "@/lib/utils";
import { getTodayDateString } from "@/lib/date-utils";
import {
  deleteHabit,
  fetchHabitsWithCompletions,
  HabitsError,
  toggleHabitComplete,
  updateHabit,
} from "@/lib/habits";
import {
  addTaskToBoard,
  fetchTaskBoard,
  isLaterGroup,
  isTodayGroup,
  persistTaskBoardLayout,
  rebuildTodayColumn,
  removeTaskFromBoard,
  replaceTaskOnBoard,
  syncTaskOnBoard,
  TaskGroupsError,
} from "@/lib/task-groups";
import { moveTaskInBoard } from "@/lib/task-drag-utils";
import { normalizePlanningState } from "@/lib/task-planning";
import {
  deleteTask,
  duplicateTask,
  TasksError,
  toggleTaskComplete,
  updateTask,
} from "@/lib/tasks";
import type { Habit } from "@/types/habit";
import type { PlanningState, Task, TaskGroupWithTasks } from "@/types/task";

export function SchedulePageContent() {
  const [groups, setGroups] = useState<TaskGroupWithTasks[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [todayViewDate, setTodayViewDate] = useState(getTodayDateString);
  const updateTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  const selectedTask = useMemo(() => {
    if (!selectedTaskId) return null;
    for (const group of groups) {
      const match = group.tasks.find((task) => task.id === selectedTaskId);
      if (match) return match;
    }
    return null;
  }, [groups, selectedTaskId]);

  const loadBoard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [board, nextHabits] = await Promise.all([
        fetchTaskBoard(),
        fetchHabitsWithCompletions(),
      ]);
      setGroups(board);
      setHabits(nextHabits);
    } catch (err) {
      setError(
        err instanceof TaskGroupsError ||
          err instanceof TasksError ||
          err instanceof HabitsError
          ? err.message
          : "Failed to load schedule."
      );
      setGroups([]);
      setHabits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBoard();
  }, [loadBoard]);

  useEffect(() => {
    setGroups((prev) => rebuildTodayColumn(prev, todayViewDate));
  }, [todayViewDate]);

  useEffect(() => {
    return () => {
      for (const timer of updateTimers.current.values()) {
        clearTimeout(timer);
      }
    };
  }, []);

  function scheduleTaskPersist(taskId: string, updates: Partial<Task>) {
    setGroups((prev) =>
      replaceTaskOnBoard(
        prev,
        taskId,
        (task) => ({ ...task, ...updates }),
        todayViewDate
      )
    );

    const existing = updateTimers.current.get(taskId);
    if (existing) clearTimeout(existing);

    updateTimers.current.set(
      taskId,
      setTimeout(async () => {
        updateTimers.current.delete(taskId);
        try {
          const updated = await updateTask(taskId, updates);
          setGroups((prev) => syncTaskOnBoard(prev, updated, todayViewDate));
        } catch (err) {
          setError(
            err instanceof TasksError ? err.message : "Failed to save task."
          );
          void loadBoard();
        }
      }, 350)
    );
  }

  async function handleScheduleTask(
    taskId: string,
    updates: {
      scheduled_date: string;
      scheduled_time: string | null;
    }
  ) {
    setError(null);
    setGroups((prev) =>
      replaceTaskOnBoard(
        prev,
        taskId,
        (task) => ({ ...task, ...updates }),
        todayViewDate
      )
    );

    try {
      const updated = await updateTask(taskId, updates);
      setGroups((prev) => syncTaskOnBoard(prev, updated, todayViewDate));
    } catch (err) {
      setError(
        err instanceof TasksError ? err.message : "Failed to schedule task."
      );
      void loadBoard();
    }
  }

  async function handleScheduleHabit(
    habitId: string,
    updates: { scheduled_time: string | null }
  ) {
    setError(null);
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === habitId ? { ...habit, ...updates } : habit
      )
    );

    try {
      const updated = await updateHabit(habitId, updates);
      setHabits((prev) =>
        prev.map((habit) => (habit.id === updated.id ? updated : habit))
      );
    } catch (err) {
      setError(
        err instanceof HabitsError ? err.message : "Failed to schedule habit."
      );
      void loadBoard();
    }
  }

  async function handleUpdateTask(taskId: string, updates: Partial<Task>) {
    if (
      "title" in updates ||
      "description" in updates ||
      updates.scheduled_time !== undefined
    ) {
      scheduleTaskPersist(taskId, updates);
      return;
    }

    setGroups((prev) =>
      replaceTaskOnBoard(
        prev,
        taskId,
        (task) => ({ ...task, ...updates }),
        todayViewDate
      )
    );

    try {
      const updated = await updateTask(taskId, updates);
      setGroups((prev) => syncTaskOnBoard(prev, updated, todayViewDate));
    } catch (err) {
      setError(
        err instanceof TasksError ? err.message : "Failed to update task."
      );
      void loadBoard();
    }
  }

  async function handleMoveTask(taskId: string, targetGroupId: string) {
    setError(null);
    const todayGroup = groups.find(isTodayGroup);
    const laterGroup = groups.find(isLaterGroup);
    const next = moveTaskInBoard(
      groups,
      taskId,
      {
        groupId: targetGroupId,
        beforeTaskId: null,
        zone: "active",
      },
      {
        todayGroupId: todayGroup?.id,
        laterGroupId: laterGroup?.id,
        todayViewDate,
      }
    );

    setGroups(next);

    try {
      await persistTaskBoardLayout(next, { todayViewDate });
    } catch (err) {
      setError(
        err instanceof TaskGroupsError
          ? err.message
          : "Failed to move task."
      );
      void loadBoard();
    }
  }

  async function handleSetPlanningState(
    taskId: string,
    planningState: PlanningState
  ) {
    const task = groups
      .flatMap((group) => group.tasks)
      .find((item) => item.id === taskId);
    if (!task) return;

    const current = normalizePlanningState(task.planning_state);
    if (current === planningState) return;

    if (planningState === "later") {
      await handleMoveToLater(taskId);
      return;
    }

    await handleClearPlanningState(taskId);
  }

  async function handleMoveToLater(taskId: string) {
    setError(null);
    const laterGroup = groups.find(isLaterGroup);
    if (!laterGroup) return;

    let nextBoard = groups;
    setGroups((prev) => {
      const todayGroup = prev.find(isTodayGroup);
      nextBoard = moveTaskInBoard(
        prev,
        taskId,
        {
          groupId: laterGroup.id,
          beforeTaskId: null,
          zone: "active",
        },
        {
          todayGroupId: todayGroup?.id,
          laterGroupId: laterGroup.id,
          todayViewDate,
        }
      );
      return nextBoard;
    });

    try {
      await persistTaskBoardLayout(nextBoard, { todayViewDate });
    } catch (err) {
      setError(
        err instanceof TaskGroupsError
          ? err.message
          : "Failed to move task to Later."
      );
      void loadBoard();
    }
  }

  async function handleClearPlanningState(taskId: string) {
    setError(null);
    setGroups((prev) =>
      replaceTaskOnBoard(
        prev,
        taskId,
        (task) => ({ ...task, planning_state: "none" }),
        todayViewDate
      )
    );

    try {
      const updated = await updateTask(taskId, { planning_state: "none" });
      setGroups((prev) => syncTaskOnBoard(prev, updated, todayViewDate));
    } catch (err) {
      setError(
        err instanceof TasksError ? err.message : "Failed to update task."
      );
      void loadBoard();
    }
  }

  async function handleToggleComplete(task: Task) {
    setError(null);
    setGroups((prev) =>
      replaceTaskOnBoard(
        prev,
        task.id,
        (item) => ({
          ...item,
          completed: !item.completed,
        }),
        todayViewDate
      )
    );

    try {
      const updated = await toggleTaskComplete(task);
      setGroups((prev) => syncTaskOnBoard(prev, updated, todayViewDate));
    } catch (err) {
      setError(
        err instanceof TasksError ? err.message : "Failed to update task."
      );
      void loadBoard();
    }
  }

  async function handleToggleHabitComplete(habit: Habit) {
    setError(null);
    setHabits((prev) =>
      prev.map((item) =>
        item.id === habit.id ? { ...item, completed: !item.completed } : item
      )
    );

    try {
      const updated = await toggleHabitComplete(habit);
      setHabits((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
    } catch (err) {
      setError(
        err instanceof HabitsError ? err.message : "Failed to update habit."
      );
      void loadBoard();
    }
  }

  async function handleDuplicateTask(task: Task) {
    if (!task.group_id) return;
    setError(null);

    const orgGroup = groups.find((item) => item.id === task.group_id);
    const sortOrder = orgGroup?.tasks.length ?? 0;

    try {
      const duplicated = await duplicateTask(task, task.group_id, sortOrder);
      setGroups((prev) => addTaskToBoard(prev, duplicated, todayViewDate));
    } catch (err) {
      setError(
        err instanceof TasksError ? err.message : "Failed to duplicate task."
      );
    }
  }

  async function handleDeleteTask(taskId: string) {
    setError(null);
    setGroups((prev) => removeTaskFromBoard(prev, taskId));
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
      setDetailOpen(false);
    }

    try {
      await deleteTask(taskId);
    } catch (err) {
      setError(
        err instanceof TasksError ? err.message : "Failed to delete task."
      );
      void loadBoard();
    }
  }

  async function handleDeleteHabit(habitId: string) {
    setError(null);
    setHabits((prev) => prev.filter((habit) => habit.id !== habitId));
    if (selectedHabitId === habitId) {
      setSelectedHabitId(null);
    }

    try {
      await deleteHabit(habitId);
    } catch (err) {
      setError(
        err instanceof HabitsError ? err.message : "Failed to delete habit."
      );
      void loadBoard();
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Loading schedule…
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-0">
      <div
        className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col",
          WORKSPACE_GUTTER_CLASS
        )}
      >
        {error && (
          <div className="shrink-0 pt-3">
            <ErrorBanner message={error} />
          </div>
        )}

        <TimelinePlanner
          variant="fullscreen"
          viewDate={todayViewDate}
          onViewDateChange={setTodayViewDate}
          groups={groups}
          habits={habits}
          selectedTaskId={selectedTaskId}
          selectedHabitId={selectedHabitId}
          onSelectTask={(taskId) => {
            setSelectedTaskId(taskId);
            if (taskId) setSelectedHabitId(null);
          }}
          onSelectHabit={(habitId) => {
            setSelectedHabitId(habitId);
            if (habitId) {
              setSelectedTaskId(null);
              setDetailOpen(false);
            }
          }}
          onOpenDetail={(taskId) => {
            setSelectedTaskId(taskId);
            setSelectedHabitId(null);
            setDetailOpen(true);
          }}
          onScheduleTask={handleScheduleTask}
          onScheduleHabit={handleScheduleHabit}
          onToggleComplete={handleToggleComplete}
          onUpdateTask={handleUpdateTask}
          onToggleHabitComplete={handleToggleHabitComplete}
          onDeleteTask={handleDeleteTask}
          onDeleteHabit={handleDeleteHabit}
          onDuplicateTask={handleDuplicateTask}
          onSetPlanningState={handleSetPlanningState}
        />
      </div>

      <div
        className="relative h-full shrink-0"
        style={{
          width: `min(100%, ${detailOpen ? DETAIL_PANEL_WIDTH_PX : DETAIL_PANEL_COLLAPSED_WIDTH_PX}px)`,
        }}
      >
        <TaskDetailPanel
          task={selectedTask}
          groups={groups}
          todayViewDate={todayViewDate}
          expanded={detailOpen}
          onToggleExpanded={() => setDetailOpen((value) => !value)}
          onChange={(updates) => {
            if (!selectedTask) return;
            void handleUpdateTask(selectedTask.id, updates);
          }}
          onMoveToGroup={(groupId) => {
            if (!selectedTask) return;
            void handleMoveTask(selectedTask.id, groupId);
          }}
        />
      </div>
    </div>
  );
}
