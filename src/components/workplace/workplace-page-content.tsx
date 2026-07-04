"use client";

import { useCallback, useEffect, useMemo, useRef, useState, forwardRef, type RefObject } from "react";
import { TimelinePlanner, type TimelinePlannerProps } from "@/components/tasks/timeline-planner";
import { ErrorBanner } from "@/components/shared/error-banner";
import { WorkplaceDailyNoteCard } from "@/components/workplace/workplace-daily-note-card";
import { WorkplaceFocusCard } from "@/components/workplace/workplace-focus-card";
import { WorkplaceHabitsCard, type WorkplaceHabitsCardHandle } from "@/components/workplace/workplace-habits-card";
import { WorkplaceNotificationHost } from "@/components/workplace/workplace-notification-host";
import { WorkplaceQuickAddCard } from "@/components/workplace/workplace-quick-add-card";
import { WorkplaceTodayTaskMenu } from "@/components/workplace/workplace-today-task-menu";
import { WorkplaceTasksCard, type WorkplaceTasksCardHandle } from "@/components/workplace/workplace-tasks-card";
import {
  TaskBoardActionsProvider,
  type TaskBoardActions,
} from "@/components/tasks/task-board-actions-context";
import { TaskBoardGroupsProvider } from "@/components/tasks/task-board-groups-context";
import {
  useGlobalRightSidebar,
} from "@/contexts/global-right-sidebar-context";
import { WorkplaceFocusTaskProvider, useWorkplaceFocusTask } from "@/contexts/workplace-focus-task-context";
import { useRegisterTaskDetailSource } from "@/hooks/use-register-task-detail-source";
import { getTodayDateString, getTomorrowDateString } from "@/lib/date-utils";
import {
  manualOrderForNewTaskAtEnd,
  sortByManualOrder,
} from "@/lib/manual-order";
import {
  addTaskToBoard,
  isInboxGroup,
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
import { setQuickScheduleOpen } from "@/lib/timeline-drag";
import { collectAllBoardTasks } from "@/lib/timeline-layout";
import {
  deleteTask,
  duplicateTask,
  TasksError,
  updateTask,
} from "@/lib/tasks";
import { toggleHabitComplete, HabitsError } from "@/lib/habits";
import {
  setHabitDailyScheduleOverride,
  useHabitDailyScheduleStore,
  withHabitScheduleForDate,
} from "@/lib/habit-daily-schedule-store";
import {
  WORKPLACE_DASHBOARD_GRID_CLASS,
  WORKPLACE_TIMELINE_RIGHT_GAP_PX,
  WORKPLACE_TIMELINE_WIDTH_PX,
} from "@/lib/workplace-layout";
import { fetchWorkplaceData, WorkplaceError } from "@/lib/workplace-data";
import { registerContextMenuCloser } from "@/lib/task-detail-menu-coordinator";
import type { Habit } from "@/types/habit";
import type { PlanningState, Task, TaskGroupWithTasks } from "@/types/task";

type WorkplacePageContentProps = {
  tasksTabRef?: RefObject<WorkplaceTasksCardHandle | null>;
  habitsTabRef?: RefObject<WorkplaceHabitsCardHandle | null>;
};

export function WorkplacePageContent({
  tasksTabRef,
  habitsTabRef,
}: WorkplacePageContentProps = {}) {
  const {
    selectedTaskId,
    selectTask,
    requestQuickCapture,
    registerWorkplaceTaskHandler,
  } = useGlobalRightSidebar();
  const timelineWidthPx = WORKPLACE_TIMELINE_WIDTH_PX;
  const [groups, setGroups] = useState<TaskGroupWithTasks[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayViewDate] = useState(getTodayDateString);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [taskContextMenu, setTaskContextMenu] = useState<{
    task: Task;
    anchorRect: DOMRect;
  } | null>(null);
  const taskContextMenuRef = useRef<HTMLDivElement>(null);
  const updateTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  const allTasks = useMemo(() => collectAllBoardTasks(groups), [groups]);
  const habitScheduleRevision = useHabitDailyScheduleStore();
  const todayDisplayHabits = useMemo(
    () => withHabitScheduleForDate(habits, todayViewDate),
    [habits, todayViewDate, habitScheduleRevision]
  );

  const getTask = useCallback(
    (taskId: string) => allTasks.find((task) => task.id === taskId) ?? null,
    [allTasks]
  );

  const loadWorkplace = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWorkplaceData();
      setGroups(data.groups);
      setHabits(data.habits);
    } catch (err) {
      setError(
        err instanceof WorkplaceError ? err.message : "Failed to load workplace."
      );
      setGroups([]);
      setHabits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWorkplace();
  }, [loadWorkplace]);

  useEffect(() => {
    registerWorkplaceTaskHandler((task) => {
      setGroups((prev) => addTaskToBoard(prev, task, todayViewDate));
    });
    return () => registerWorkplaceTaskHandler(null);
  }, [registerWorkplaceTaskHandler, todayViewDate]);

  useEffect(() => {
    setQuickScheduleOpen(true);
    return () => setQuickScheduleOpen(false);
  }, []);

  useEffect(() => {
    return registerContextMenuCloser(() => setTaskContextMenu(null));
  }, []);

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
          void loadWorkplace();
        }
      }, 350)
    );
  }

  const handleScheduleTask = useCallback(
    async (
      taskId: string,
      updates: { scheduled_date: string; scheduled_time: string | null }
    ) => {
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
        void loadWorkplace();
      }
    },
    [loadWorkplace, todayViewDate]
  );

  const handleUpdateTask = useCallback(
    async (taskId: string, updates: Partial<Task>) => {
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
        void loadWorkplace();
      }
    },
    [loadWorkplace, todayViewDate]
  );

  const handleMoveTask = useCallback(
    async (taskId: string, targetGroupId: string) => {
      setError(null);
      const todayGroup = groups.find(isTodayGroup);
      const laterGroup = groups.find(isLaterGroup);
      const inboxGroup = groups.find(isInboxGroup);
      const next = moveTaskInBoard(
        groups,
        taskId,
        { groupId: targetGroupId, beforeTaskId: null, zone: "active" },
        {
          todayGroupId: todayGroup?.id,
          laterGroupId: laterGroup?.id,
          inboxGroupId: inboxGroup?.id,
          todayViewDate,
        }
      );
      setGroups(next);
      try {
        await persistTaskBoardLayout(next, { todayViewDate });
      } catch (err) {
        setError(
          err instanceof TaskGroupsError ? err.message : "Failed to move task."
        );
        void loadWorkplace();
      }
    },
    [groups, loadWorkplace, todayViewDate]
  );

  const handleMoveToLater = useCallback(
    async (taskId: string) => {
      const laterGroup = groups.find(isLaterGroup);
      if (!laterGroup) return;
      await handleMoveTask(taskId, laterGroup.id);
    },
    [groups, handleMoveTask]
  );

  const handleSetPlanningState = useCallback(
    async (taskId: string, planningState: PlanningState) => {
      const task = allTasks.find((item) => item.id === taskId);
      if (!task) return;
      const current = normalizePlanningState(task.planning_state);
      if (current === planningState) return;
      if (planningState === "later") {
        await handleMoveToLater(taskId);
        return;
      }
      await handleUpdateTask(taskId, { planning_state: "none" });
    },
    [allTasks, handleMoveToLater, handleUpdateTask]
  );

  const handleMoveToTomorrow = useCallback(
    async (task: Task) => {
      await handleScheduleTask(task.id, {
        scheduled_date: getTomorrowDateString(),
        scheduled_time: task.scheduled_time,
      });
    },
    [handleScheduleTask]
  );

  const handleContinueLater = useCallback(
    async (task: Task) => {
      await handleScheduleTask(task.id, {
        scheduled_date: todayViewDate,
        scheduled_time: null,
      });
    },
    [handleScheduleTask, todayViewDate]
  );

  const handleContinueTomorrow = useCallback(
    async (task: Task) => {
      await handleMoveToTomorrow(task);
    },
    [handleMoveToTomorrow]
  );

  const handlePlanLaterForTask = useCallback(
    async (task: Task) => {
      await handleSetPlanningState(task.id, "later");
    },
    [handleSetPlanningState]
  );

  const handleToggleComplete = useCallback(
    async (task: Task, markComplete?: boolean) => {
      const nextCompleted = markComplete ?? !task.completed;
      if (task.completed === nextCompleted) return;

      setError(null);
      setGroups((prev) =>
        replaceTaskOnBoard(
          prev,
          task.id,
          (item) => ({ ...item, completed: nextCompleted }),
          todayViewDate
        )
      );
      try {
        const updated = await updateTask(task.id, {
          completed: nextCompleted,
          completed_at: nextCompleted ? new Date().toISOString() : null,
        });
        setGroups((prev) => syncTaskOnBoard(prev, updated, todayViewDate));
      } catch (err) {
        setError(
          err instanceof TasksError ? err.message : "Failed to update task."
        );
        void loadWorkplace();
      }
    },
    [loadWorkplace, todayViewDate]
  );

  const handleDuplicateTask = useCallback(
    async (task: Task) => {
      if (!task.group_id) return;
      setError(null);
      const orgGroup = groups.find((group) => group.id === task.group_id);
      const activeInGroup = sortByManualOrder(
        (orgGroup?.tasks ?? []).filter((item) => !item.completed)
      );
      const sortOrder = manualOrderForNewTaskAtEnd(activeInGroup);

      try {
        const duplicated = await duplicateTask(
          task,
          task.group_id,
          sortOrder
        );
        setGroups((prev) => addTaskToBoard(prev, duplicated, todayViewDate));
      } catch (err) {
        setError(
          err instanceof TasksError ? err.message : "Failed to duplicate task."
        );
      }
    },
    [groups, todayViewDate]
  );

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      setError(null);
      setGroups((prev) => removeTaskFromBoard(prev, taskId));
      if (selectedTaskId === taskId) {
        selectTask(null);
      }
      try {
        await deleteTask(taskId);
      } catch (err) {
        setError(
          err instanceof TasksError ? err.message : "Failed to delete task."
        );
        void loadWorkplace();
      }
    },
    [loadWorkplace, selectedTaskId, selectTask]
  );

  const handleToggleHabitComplete = useCallback(async (habit: Habit) => {
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
      void loadWorkplace();
    }
  }, [loadWorkplace]);

  const handleScheduleHabit = useCallback(
    async (
      habitId: string,
      updates: { scheduled_time: string | null },
      scheduleDate: string
    ) => {
      setError(null);
      setHabitDailyScheduleOverride(habitId, scheduleDate, updates.scheduled_time);
    },
    []
  );

  const boardActions = useMemo<TaskBoardActions>(
    () => ({
      onToggleComplete: (task) => void handleToggleComplete(task),
      onOpenDetail: (taskId) => selectTask(taskId),
      onDuplicateTask: (task) => void handleDuplicateTask(task),
      onMoveTask: (taskId, groupId) => void handleMoveTask(taskId, groupId),
      onDeleteTask: (taskId) => void handleDeleteTask(taskId),
      onUpdateTask: (taskId, updates) => void handleUpdateTask(taskId, updates),
      onSetPlanningState: (taskId, state) =>
        void handleSetPlanningState(taskId, state),
      onRequestCreateGroup: () => {},
      onTaskPointerDragStart: () => {},
      onTaskPointerDragEnd: () => {},
    }),
    [
      handleDeleteTask,
      handleDuplicateTask,
      handleMoveTask,
      handleSetPlanningState,
      handleToggleComplete,
      handleUpdateTask,
      selectTask,
    ]
  );

  useRegisterTaskDetailSource(
    {
      groups,
      todayViewDate,
      getTask,
      onUpdate: handleUpdateTask,
      onMoveToGroup: handleMoveTask,
      onPlanningStateChange: handleSetPlanningState,
      onToggleComplete: (task) => void handleToggleComplete(task),
    },
    [groups, todayViewDate, getTask]
  );

  if (loading) {
    return (
      <div
        className="flex h-full min-h-0 gap-2 pl-6 lg:pl-10"
        style={{ paddingRight: WORKPLACE_TIMELINE_RIGHT_GAP_PX }}
      >
        <div className={`${WORKPLACE_DASHBOARD_GRID_CLASS} py-1`}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="min-h-[4rem] animate-pulse rounded-xl bg-muted/20"
            />
          ))}
        </div>
        <div
          className="shrink-0 animate-pulse rounded-l-xl border-l border-border/30 bg-muted/15"
          style={{ width: timelineWidthPx }}
        />
      </div>
    );
  }

  return (
    <TaskBoardActionsProvider actions={boardActions}>
      <TaskBoardGroupsProvider groups={groups}>
        <WorkplaceFocusTaskProvider
          tasks={allTasks}
          habits={todayDisplayHabits}
          viewDate={todayViewDate}
        >
          <div
            className="relative flex h-full min-h-0 gap-2 pl-6 lg:pl-10"
            style={{
              paddingRight:
                timelineWidthPx + WORKPLACE_TIMELINE_RIGHT_GAP_PX,
            }}
          >
            {error ? (
              <div className="absolute left-6 right-0 top-2 z-10 lg:left-10">
                <ErrorBanner message={error} />
              </div>
            ) : null}

            <div className={`${WORKPLACE_DASHBOARD_GRID_CLASS} min-h-0 py-1`}>
              <div className="row-span-2 flex h-full min-h-0 flex-col overflow-hidden">
                <WorkplaceTasksCard
                  ref={tasksTabRef}
                  tasks={allTasks}
                  groups={groups}
                  todayViewDate={todayViewDate}
                  onOpenDetail={(taskId) => selectTask(taskId)}
                  onToggleComplete={(task) => void handleToggleComplete(task)}
                  onUpdateTask={(taskId, updates) =>
                    void handleUpdateTask(taskId, updates)
                  }
                  onTaskContextMenu={(task, anchorRect) =>
                    setTaskContextMenu({ task, anchorRect })
                  }
                />
              </div>
              <WorkplaceQuickAddCard onOpenTaskDetails={requestQuickCapture} />
              <div className="flex min-h-0 min-w-0 flex-col">
                <WorkplaceFocusCard
                  groups={groups}
                  onToggleComplete={(task, markComplete) =>
                    void handleToggleComplete(task, markComplete)
                  }
                  onToggleHabitComplete={(habit) =>
                    void handleToggleHabitComplete(habit)
                  }
                  onOpenDetail={(taskId) => selectTask(taskId)}
                  onContinueLater={(task) => void handleContinueLater(task)}
                  onContinueTomorrow={(task) => void handleContinueTomorrow(task)}
                  onPlanLater={(task) => void handlePlanLaterForTask(task)}
                />
              </div>
              <WorkplaceHabitsCardWithFocus
                ref={habitsTabRef}
                habits={todayDisplayHabits}
                todayViewDate={todayViewDate}
                onToggleComplete={(habit) => void handleToggleHabitComplete(habit)}
              />
              <WorkplaceDailyNoteCard />
            </div>

            <div
              className="absolute right-0 top-0 flex h-full min-h-0 shrink-0 self-stretch"
              style={{ width: timelineWidthPx }}
            >
              <WorkplaceTimelinePlanner
                viewDate={todayViewDate}
                groups={groups}
                habits={habits}
                selectedTaskId={selectedTaskId}
                selectedHabitId={selectedHabitId}
                onSelectTask={(taskId) => {
                  selectTask(taskId, { openDetails: false });
                  if (taskId) setSelectedHabitId(null);
                }}
                onSelectHabit={(habitId) => {
                  setSelectedHabitId(habitId);
                  if (habitId) selectTask(null, { openDetails: false });
                }}
                onOpenDetail={(taskId) => selectTask(taskId)}
                onScheduleTask={handleScheduleTask}
                onScheduleHabit={handleScheduleHabit}
                onToggleComplete={handleToggleComplete}
                onToggleHabitComplete={handleToggleHabitComplete}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onDuplicateTask={handleDuplicateTask}
                onSetPlanningState={handleSetPlanningState}
              />
            </div>

            <WorkplaceNotificationHost />

            {taskContextMenu ? (
              <WorkplaceTodayTaskContextMenu
                menuRef={taskContextMenuRef}
                task={taskContextMenu.task}
                anchorRect={taskContextMenu.anchorRect}
                onClose={() => setTaskContextMenu(null)}
                onOpenDetail={() => {
                  selectTask(taskContextMenu.task.id);
                  setTaskContextMenu(null);
                }}
                onMoveToTomorrow={() => {
                  void handleMoveToTomorrow(taskContextMenu.task);
                  setTaskContextMenu(null);
                }}
                onPlanLater={() => {
                  void handlePlanLaterForTask(taskContextMenu.task);
                  setTaskContextMenu(null);
                }}
                onToggleComplete={() => {
                  void handleToggleComplete(taskContextMenu.task);
                  setTaskContextMenu(null);
                }}
                onDelete={() => {
                  void handleDeleteTask(taskContextMenu.task.id);
                  setTaskContextMenu(null);
                }}
              />
            ) : null}
          </div>
        </WorkplaceFocusTaskProvider>
      </TaskBoardGroupsProvider>
    </TaskBoardActionsProvider>
  );
}

const WorkplaceHabitsCardWithFocus = forwardRef<
  WorkplaceHabitsCardHandle,
  {
    habits: Habit[];
    todayViewDate: string;
    onToggleComplete: (habit: Habit) => void;
  }
>(function WorkplaceHabitsCardWithFocus(
  { habits, todayViewDate, onToggleComplete },
  habitsTabRef
) {
  const { setActiveHabitId } = useWorkplaceFocusTask();

  return (
    <WorkplaceHabitsCard
      ref={habitsTabRef}
      habits={habits}
      todayViewDate={todayViewDate}
      onToggleComplete={onToggleComplete}
      onStartFocus={(habit) => setActiveHabitId(habit.id, "manual")}
    />
  );
});

function WorkplaceTimelinePlanner(
  props: Omit<
    TimelinePlannerProps,
    "variant" | "onViewDateChange" | "onStartFocusTask" | "onStartFocusHabit"
  >
) {
  const { setActiveTaskId, setActiveHabitId } = useWorkplaceFocusTask();

  return (
    <TimelinePlanner
      variant="workplace"
      onViewDateChange={() => undefined}
      onStartFocusTask={(taskId) => setActiveTaskId(taskId, "manual")}
      onStartFocusHabit={(habitId) => setActiveHabitId(habitId, "manual")}
      {...props}
    />
  );
}

function WorkplaceTodayTaskContextMenu({
  menuRef,
  task,
  anchorRect,
  onClose,
  onOpenDetail,
  onMoveToTomorrow,
  onPlanLater,
  onToggleComplete,
  onDelete,
}: {
  menuRef: RefObject<HTMLDivElement | null>;
  task: Task;
  anchorRect: DOMRect;
  onClose: () => void;
  onOpenDetail: () => void;
  onMoveToTomorrow: () => void;
  onPlanLater: () => void;
  onToggleComplete: () => void;
  onDelete: () => void;
}) {
  const { setActiveTaskId } = useWorkplaceFocusTask();

  return (
    <WorkplaceTodayTaskMenu
      menuRef={menuRef}
      taskTitle={task.title}
      completed={task.completed}
      anchorRect={anchorRect}
      onClose={onClose}
      onStartFocus={() => {
        setActiveTaskId(task.id, "manual");
        onClose();
      }}
      onOpenDetail={onOpenDetail}
      onMoveToTomorrow={onMoveToTomorrow}
      onPlanLater={onPlanLater}
      onToggleComplete={onToggleComplete}
      onDelete={onDelete}
    />
  );
}
