"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  TimelineDrawer,
  TimelineDrawerToggle,
} from "@/components/tasks/timeline-drawer";
import { TasksBoardView } from "@/components/tasks/tasks-board-view";
import { ErrorBanner } from "@/components/shared/error-banner";
import {
  useGlobalRightSidebar,
  useGlobalRightSidebarOffsetPx,
} from "@/contexts/global-right-sidebar-context";
import { useRegisterTaskDetailSource } from "@/hooks/use-register-task-detail-source";
import { getTodayDateString } from "@/lib/date-utils";
import {
  addTaskToBoard,
  createTaskGroup,
  deleteTaskGroup,
  fetchTaskBoard,
  filterTasksForGroup,
  isLaterGroup,
  isInboxGroup,
  isTodayGroup,
  orderPinnedTaskGroups,
  persistTaskBoardLayout,
  persistTaskBoardDiff,
  persistTaskGroupOrderDiff,
  rebuildTodayColumn,
  removeTaskFromBoard,
  replaceTaskOnBoard,
  sortActiveAndCompleted,
  syncTaskOnBoard,
  TaskGroupsError,
  updateTaskGroup,
} from "@/lib/task-groups";
import {
  DEFAULT_TASK_SORT_MODE,
  getTaskGroupSortMode,
  isManualTaskSortMode,
  setLaterColumnSortMode,
  type TaskSortMode,
} from "@/lib/task-sort";
import {
  manualOrderForNewTaskAtEnd,
  manualOrderForNewTaskAtTop,
  sortByManualOrder,
} from "@/lib/manual-order";
import {
  batchUpdateManualOrders,
  createTask,
  deleteTask,
  duplicateTask,
  TasksError,
  toggleTaskComplete,
  updateTask,
} from "@/lib/tasks";
import { moveTaskInBoard } from "@/lib/task-drag-utils";
import {
  animateGroupColumnLayoutPush,
  captureGroupColumnLayout,
} from "@/lib/group-drop-layout-animation";
import { setQuickScheduleOpen } from "@/lib/timeline-drag";
import type { PlanningState, Task, TaskGroupWithTasks } from "@/types/task";
import {
  getLaterPlanningTaskUpdates,
  normalizePlanningState,
} from "@/lib/task-planning";
import {
  fetchHabitsWithCompletions,
  HabitsError,
  toggleHabitComplete,
} from "@/lib/habits";
import { setHabitDailyScheduleOverride } from "@/lib/habit-daily-schedule-store";
import type { Habit } from "@/types/habit";

function normalizeScheduleUpdates(updates: Partial<Task>): Partial<Task> {
  const normalized = { ...updates };

  if (normalized.scheduled_date && !("planning_state" in normalized)) {
    normalized.planning_state = "none";
  }

  return normalized;
}

export function TasksPageContent() {
  const { selectedTaskId, selectTask } = useGlobalRightSidebar();
  const sidebarOffsetPx = useGlobalRightSidebarOffsetPx();
  const [groups, setGroups] = useState<TaskGroupWithTasks[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [todayViewDate, setTodayViewDate] = useState(getTodayDateString);
  const updateTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );
  const pendingTaskUpdates = useRef<Map<string, Partial<Task>>>(new Map());
  const plannerLayoutSnapshotRef = useRef<Map<string, DOMRect> | null>(null);

  function setTimelineOpenWithLayoutAnimation(
    value: boolean | ((previous: boolean) => boolean),
  ) {
    setTimelineOpen((previous) => {
      const next = typeof value === "function" ? value(previous) : value;
      if (next !== previous) {
        plannerLayoutSnapshotRef.current = captureGroupColumnLayout();
      }
      return next;
    });
  }

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
          : "Failed to load tasks.",
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
    setQuickScheduleOpen(timelineOpen);
  }, [timelineOpen]);

  useLayoutEffect(() => {
    const snapshot = plannerLayoutSnapshotRef.current;
    if (!snapshot) return;
    plannerLayoutSnapshotRef.current = null;
    animateGroupColumnLayoutPush(snapshot);
  }, [timelineOpen]);

  useEffect(() => {
    if (!hint) return;
    const timer = window.setTimeout(() => setHint(null), 4500);
    return () => window.clearTimeout(timer);
  }, [hint]);

  useEffect(() => {
    return () => {
      for (const timer of updateTimers.current.values()) {
        clearTimeout(timer);
      }
    };
  }, []);

  function scheduleTaskPersist(taskId: string, updates: Partial<Task>) {
    const normalizedUpdates = normalizeScheduleUpdates(updates);
    const merged = normalizeScheduleUpdates({
      ...(pendingTaskUpdates.current.get(taskId) ?? {}),
      ...normalizedUpdates,
    });
    pendingTaskUpdates.current.set(taskId, merged);

    setGroups((prev) =>
      replaceTaskOnBoard(
        prev,
        taskId,
        (task) => ({ ...task, ...merged }),
        todayViewDate,
      ),
    );

    const existing = updateTimers.current.get(taskId);
    if (existing) clearTimeout(existing);

    updateTimers.current.set(
      taskId,
      setTimeout(async () => {
        updateTimers.current.delete(taskId);
        const payload = pendingTaskUpdates.current.get(taskId);
        if (!payload) return;

        try {
          const updated = await updateTask(taskId, payload);
          const stillPending = pendingTaskUpdates.current.get(taskId);
          if (stillPending) {
            const remaining: Partial<Task> = { ...stillPending };
            for (const key of Object.keys(payload) as (keyof Task)[]) {
              if (remaining[key] === payload[key]) {
                delete remaining[key];
              }
            }
            if (Object.keys(remaining).length === 0) {
              pendingTaskUpdates.current.delete(taskId);
            } else {
              pendingTaskUpdates.current.set(taskId, remaining);
            }
          }

          setGroups((prev) => {
            let next = syncTaskOnBoard(prev, updated, todayViewDate);
            const overlay = pendingTaskUpdates.current.get(taskId);
            if (overlay && Object.keys(overlay).length > 0) {
              next = replaceTaskOnBoard(
                next,
                taskId,
                (task) => ({ ...task, ...overlay }),
                todayViewDate,
              );
            }
            return next;
          });
        } catch (err) {
          pendingTaskUpdates.current.delete(taskId);
          setError(
            err instanceof TasksError ? err.message : "Failed to save task.",
          );
          void loadBoard();
        }
      }, 350),
    );
  }

  async function handleCreateTask(
    groupId: string,
    title: string,
    options?: {
      scheduledDate?: string | null;
      planningState?: "none" | "later";
    },
  ) {
    setError(null);
    const orgGroup = groups.find(
      (item) =>
        item.id === groupId && !isTodayGroup(item) && !isLaterGroup(item),
    );
    const inbox = groups.find(isInboxGroup);
    const composeGroup = groups.find((item) => item.id === groupId);
    const resolvedGroupId = orgGroup?.id ?? inbox?.id ?? groupId;
    const sortContextGroup = composeGroup ?? orgGroup ?? inbox;
    const sortMode = sortContextGroup
      ? getTaskGroupSortMode(sortContextGroup)
      : DEFAULT_TASK_SORT_MODE;
    const columnActiveTasks = sortContextGroup
      ? sortByManualOrder(
          filterTasksForGroup(
            sortContextGroup,
            sortContextGroup.tasks,
            todayViewDate,
          ).filter((task) => !task.completed),
        )
      : [];
    const manualTopInsert = isManualTaskSortMode(sortMode);

    try {
      const created = await createTask({
        title,
        group_id: resolvedGroupId,
        sort_order: manualTopInsert
          ? manualOrderForNewTaskAtTop(columnActiveTasks)
          : manualOrderForNewTaskAtEnd(columnActiveTasks),
        priority: "low",
        scheduled_date: options?.scheduledDate ?? null,
        planning_state: options?.planningState ?? "none",
      });

      setGroups((prev) => addTaskToBoard(prev, created, todayViewDate));
    } catch (err) {
      setError(
        err instanceof TasksError ? err.message : "Failed to create task.",
      );
    }
  }

  async function handleUpdateTask(taskId: string, updates: Partial<Task>) {
    const normalizedUpdates = normalizeScheduleUpdates(updates);

    if (
      "title" in normalizedUpdates ||
      "description" in normalizedUpdates ||
      normalizedUpdates.scheduled_time !== undefined
    ) {
      scheduleTaskPersist(taskId, normalizedUpdates);
      return;
    }

    setGroups((prev) =>
      replaceTaskOnBoard(
        prev,
        taskId,
        (task) => ({ ...task, ...normalizedUpdates }),
        todayViewDate,
      ),
    );

    try {
      const updated = await updateTask(taskId, normalizedUpdates);
      setGroups((prev) => syncTaskOnBoard(prev, updated, todayViewDate));
    } catch (err) {
      setError(
        err instanceof TasksError ? err.message : "Failed to update task.",
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
          completed_at: !item.completed ? new Date().toISOString() : null,
        }),
        todayViewDate,
      ),
    );

    try {
      const updated = await toggleTaskComplete(task);
      setGroups((prev) => syncTaskOnBoard(prev, updated, todayViewDate));
    } catch (err) {
      setError(
        err instanceof TasksError ? err.message : "Failed to update task.",
      );
      void loadBoard();
    }
  }

  async function handleDuplicateTask(task: Task) {
    if (!task.group_id) return;
    setError(null);

    const orgGroup = groups.find((item) => item.id === task.group_id);
    const activeInGroup = sortByManualOrder(
      (orgGroup?.tasks ?? []).filter((item) => !item.completed),
    );
    const sortOrder = manualOrderForNewTaskAtEnd(activeInGroup);

    try {
      const duplicated = await duplicateTask(task, task.group_id, sortOrder);
      setGroups((prev) => addTaskToBoard(prev, duplicated, todayViewDate));
    } catch (err) {
      setError(
        err instanceof TasksError ? err.message : "Failed to duplicate task.",
      );
    }
  }

  async function handleMoveTask(taskId: string, targetGroupId: string) {
    setError(null);

    let nextBoard = groups;
    setGroups((prev) => {
      const todayGroup = prev.find(isTodayGroup);
      const laterGroup = prev.find(isLaterGroup);
      const inboxGroup = prev.find(isInboxGroup);
      nextBoard = moveTaskInBoard(
        prev,
        taskId,
        {
          groupId: targetGroupId,
          beforeTaskId: null,
          zone: "active",
        },
        {
          todayGroupId: todayGroup?.id,
          laterGroupId: laterGroup?.id,
          inboxGroupId: inboxGroup?.id,
          todayViewDate,
        },
      );
      return nextBoard;
    });

    try {
      await persistTaskBoardLayout(nextBoard, { todayViewDate });
    } catch (err) {
      setError(
        err instanceof TaskGroupsError ? err.message : "Failed to move task.",
      );
      void loadBoard();
    }
  }

  async function handleCreateGroupAndMoveTask(
    input: { title: string; icon: string; color: string },
    taskId: string,
  ) {
    setError(null);
    try {
      const created = await createTaskGroup(input.title, {
        icon: input.icon,
        color: input.color,
      });

      let nextBoard = groups;
      setGroups((prev) => {
        const withNewGroup = orderPinnedTaskGroups([
          ...prev,
          { ...created, tasks: [] },
        ]);
        nextBoard = moveTaskInBoard(
          withNewGroup,
          taskId,
          {
            groupId: created.id,
            beforeTaskId: null,
            zone: "active",
          },
          {
            todayGroupId: withNewGroup.find(isTodayGroup)?.id,
            laterGroupId: withNewGroup.find(isLaterGroup)?.id,
            inboxGroupId: withNewGroup.find(isInboxGroup)?.id,
            todayViewDate,
          },
        );
        return nextBoard;
      });

      await persistTaskBoardLayout(nextBoard, { todayViewDate });
      return created.id;
    } catch (err) {
      setError(
        err instanceof TaskGroupsError
          ? err.message
          : "Failed to create group.",
      );
      throw err;
    }
  }

  async function handleDeleteTask(taskId: string) {
    setError(null);
    setGroups((prev) => removeTaskFromBoard(prev, taskId));
    if (selectedTaskId === taskId) {
      selectTask(null);
    }

    try {
      await deleteTask(taskId);
    } catch (err) {
      setError(
        err instanceof TasksError ? err.message : "Failed to delete task.",
      );
      void loadBoard();
    }
  }

  async function handleCreateGroup(input: {
    title: string;
    icon: string;
    color: string;
  }) {
    setError(null);
    try {
      const created = await createTaskGroup(input.title, {
        icon: input.icon,
        color: input.color,
      });
      setGroups((prev) =>
        orderPinnedTaskGroups([...prev, { ...created, tasks: [] }]),
      );
      return created.id;
    } catch (err) {
      setError(
        err instanceof TaskGroupsError
          ? err.message
          : "Failed to create group.",
      );
      throw err;
    }
  }

  async function handleDeleteGroup(groupId: string) {
    const group = groups.find((item) => item.id === groupId);
    if (group?.slug === "inbox" || group?.slug === "today") {
      setError("Default groups cannot be deleted.");
      return;
    }
    if (!window.confirm(`Delete "${group?.title}"? Tasks move to Inbox.`)) {
      return;
    }

    const inboxGroup = groups.find((item) => item.slug === "inbox");
    const previousGroups = groups;
    const movedTasks = (group?.tasks ?? []).map((task) => ({
      ...task,
      group_id: inboxGroup?.id ?? null,
    }));

    setError(null);
    setGroups((prev) => {
      const next = prev
        .filter((item) => item.id !== groupId)
        .map((item) => {
          if (!inboxGroup || item.id !== inboxGroup.id) return item;
          const { active, completed } = sortActiveAndCompleted(
            [...item.tasks, ...movedTasks],
            item,
          );
          return { ...item, tasks: [...active, ...completed] };
        });
      return rebuildTodayColumn(orderPinnedTaskGroups(next), todayViewDate);
    });

    try {
      await deleteTaskGroup(groupId);
    } catch (err) {
      setGroups(previousGroups);
      setError(
        err instanceof TaskGroupsError
          ? err.message
          : "Failed to delete group.",
      );
    }
  }

  async function handleRenameGroup(groupId: string, title: string) {
    setError(null);
    try {
      await updateTaskGroup(groupId, { title });
      setGroups((prev) =>
        prev.map((group) =>
          group.id === groupId ? { ...group, title } : group,
        ),
      );
    } catch (err) {
      setError(
        err instanceof TaskGroupsError
          ? err.message
          : "Failed to rename group.",
      );
    }
  }

  async function handleUpdateGroupIcon(groupId: string, icon: string) {
    setError(null);
    setGroups((prev) =>
      prev.map((group) => (group.id === groupId ? { ...group, icon } : group)),
    );

    try {
      await updateTaskGroup(groupId, { icon });
    } catch (err) {
      setError(
        err instanceof TaskGroupsError
          ? err.message
          : "Failed to update group icon.",
      );
      void loadBoard();
    }
  }

  async function handleUpdateGroupColor(groupId: string, color: string) {
    setError(null);
    setGroups((prev) =>
      prev.map((group) => (group.id === groupId ? { ...group, color } : group)),
    );

    try {
      await updateTaskGroup(groupId, { color });
    } catch (err) {
      setError(
        err instanceof TaskGroupsError
          ? err.message
          : "Failed to update group color.",
      );
      void loadBoard();
    }
  }

  async function handleUpdateGroupSortMode(
    groupId: string,
    sortMode: TaskSortMode,
  ) {
    setError(null);
    const targetGroup = groups.find((group) => group.id === groupId);
    if (!targetGroup) return;

    if (isLaterGroup(targetGroup)) {
      setLaterColumnSortMode(sortMode);
    }

    setGroups((prev) =>
      prev.map((group) => {
        if (group.id !== groupId) return group;
        const updatedGroup = { ...group, sort_mode: sortMode };
        const visibleTasks = filterTasksForGroup(
          updatedGroup,
          updatedGroup.tasks,
          todayViewDate,
        );
        const { active, completed } = sortActiveAndCompleted(
          visibleTasks,
          updatedGroup,
        );
        return { ...updatedGroup, tasks: [...active, ...completed] };
      }),
    );

    if (isLaterGroup(targetGroup)) return;

    try {
      await updateTaskGroup(groupId, { sort_mode: sortMode });
    } catch (err) {
      setError(
        err instanceof TaskGroupsError
          ? err.message
          : "Failed to update sort mode.",
      );
      void loadBoard();
    }
  }

  async function handlePersistManualOrder(
    updates: { id: string; sort_order: number }[],
  ) {
    await batchUpdateManualOrders(updates);
  }

  async function handlePersistGroupOrder(
    previous: TaskGroupWithTasks[],
    next: TaskGroupWithTasks[],
  ) {
    await persistTaskGroupOrderDiff(previous, next);
  }

  async function handlePersistLayout(
    next: TaskGroupWithTasks[],
    options?: {
      previousBoard?: TaskGroupWithTasks[];
      taskDateAssignments?: { taskId: string; scheduledDate: string }[];
    },
  ) {
    if (options?.previousBoard) {
      await persistTaskBoardDiff(options.previousBoard, next, {
        ...options,
        todayViewDate,
      });
      return;
    }
    await persistTaskBoardLayout(next, { ...options, todayViewDate });
  }

  async function handleSetPlanningState(
    taskId: string,
    planningState: PlanningState,
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

    const laterUpdates = getLaterPlanningTaskUpdates();

    let nextBoard = groups;
    setGroups((prev) => {
      nextBoard = replaceTaskOnBoard(
        prev,
        taskId,
        (task) => ({
          ...task,
          ...laterUpdates,
        }),
        todayViewDate,
      );
      return nextBoard;
    });

    try {
      const updated = await updateTask(taskId, laterUpdates);
      setGroups((prev) => syncTaskOnBoard(prev, updated, todayViewDate));
    } catch (err) {
      setError(
        err instanceof TasksError
          ? err.message
          : "Failed to move task to Later.",
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
        todayViewDate,
      ),
    );

    try {
      const updated = await updateTask(taskId, { planning_state: "none" });
      setGroups((prev) => syncTaskOnBoard(prev, updated, todayViewDate));
    } catch (err) {
      setError(
        err instanceof TasksError ? err.message : "Failed to update task.",
      );
      void loadBoard();
    }
  }

  async function handleScheduleTask(
    taskId: string,
    updates: {
      scheduled_date: string;
      scheduled_time: string | null;
      duration_minutes?: number | null;
    },
  ) {
    setError(null);
    const withPlanning = { ...updates, planning_state: "none" as const };
    setGroups((prev) =>
      replaceTaskOnBoard(
        prev,
        taskId,
        (task) => ({ ...task, ...withPlanning }),
        todayViewDate,
      ),
    );

    try {
      const updated = await updateTask(taskId, withPlanning);
      setGroups((prev) => syncTaskOnBoard(prev, updated, todayViewDate));
    } catch (err) {
      setError(
        err instanceof TasksError ? err.message : "Failed to schedule task.",
      );
      void loadBoard();
    }
  }

  function handleSelectTask(taskId: string | null) {
    selectTask(taskId);
  }

  async function handleScheduleHabit(
    habitId: string,
    updates: { scheduled_time: string | null },
    scheduleDate: string,
  ) {
    setError(null);
    setHabitDailyScheduleOverride(
      habitId,
      scheduleDate,
      updates.scheduled_time,
    );
  }

  async function handleToggleHabitComplete(habit: Habit) {
    setError(null);
    setHabits((prev) =>
      prev.map((item) =>
        item.id === habit.id ? { ...item, completed: !item.completed } : item,
      ),
    );

    try {
      const updated = await toggleHabitComplete(habit);
      setHabits((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (err) {
      setError(
        err instanceof HabitsError ? err.message : "Failed to update habit.",
      );
      void loadBoard();
    }
  }

  const getTask = useCallback(
    (taskId: string) => {
      for (const group of groups) {
        const match = group.tasks.find((task) => task.id === taskId);
        if (match) return match;
      }
      return null;
    },
    [groups],
  );

  useRegisterTaskDetailSource(
    {
      groups,
      todayViewDate,
      getTask,
      onUpdate: handleUpdateTask,
      onMoveToGroup: handleMoveTask,
      onPlanningStateChange: handleSetPlanningState,
    },
    [groups, todayViewDate, getTask],
  );

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Loading tasks…
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-0">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col pb-3 pt-2">
        {error && (
          <div className="mb-3 shrink-0">
            <ErrorBanner message={error} />
          </div>
        )}

        {hint && (
          <div className="mb-3 shrink-0">
            <p
              className="rounded-lg border border-selected-border bg-primary-soft px-3 py-2 text-sm text-foreground"
              role="status"
            >
              {hint}
            </p>
          </div>
        )}

        <TasksBoardView
          groups={groups}
          selectedTaskId={selectedTaskId}
          todayViewDate={todayViewDate}
          plannerActive={timelineOpen}
          onToggleQuickPlanner={() =>
            setTimelineOpenWithLayoutAnimation((value) => !value)
          }
          onTodayViewDateChange={setTodayViewDate}
          onGroupsChange={setGroups}
          onSelectTask={handleSelectTask}
          onCreateTask={handleCreateTask}
          onUpdateTask={handleUpdateTask}
          onToggleComplete={handleToggleComplete}
          onDuplicateTask={handleDuplicateTask}
          onMoveTask={handleMoveTask}
          onDeleteTask={handleDeleteTask}
          onCreateGroup={handleCreateGroup}
          onCreateGroupAndMoveTask={handleCreateGroupAndMoveTask}
          onRenameGroup={handleRenameGroup}
          onUpdateGroupIcon={handleUpdateGroupIcon}
          onUpdateGroupColor={handleUpdateGroupColor}
          onUpdateGroupSortMode={handleUpdateGroupSortMode}
          onDeleteGroup={handleDeleteGroup}
          onPersistLayout={handlePersistLayout}
          onPersistGroupOrder={handlePersistGroupOrder}
          onPersistManualOrder={handlePersistManualOrder}
          onShowHint={setHint}
          onSetPlanningState={handleSetPlanningState}
        />
      </div>

      <TimelineDrawer
        open={timelineOpen}
        viewDate={todayViewDate}
        onViewDateChange={setTodayViewDate}
        groups={groups}
        habits={habits}
        selectedTaskId={selectedTaskId}
        selectedHabitId={selectedHabitId}
        onClose={() => setTimelineOpenWithLayoutAnimation(false)}
        onSelectTask={(taskId) => {
          selectTask(taskId);
          if (taskId) setSelectedHabitId(null);
        }}
        onSelectHabit={(habitId) => {
          setSelectedHabitId(habitId);
          if (habitId) selectTask(null);
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

      <TimelineDrawerToggle
        open={timelineOpen}
        detailPanelOffsetPx={sidebarOffsetPx}
        onToggle={() => setTimelineOpenWithLayoutAnimation(true)}
      />
    </div>
  );
}
