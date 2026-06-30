"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TaskDetailPanel, DETAIL_PANEL_COLLAPSED_WIDTH_PX, DETAIL_PANEL_WIDTH_PX } from "@/components/tasks/task-detail-panel";
import { WORKSPACE_GUTTER_CLASS } from "@/lib/workspace-layout";
import { cn } from "@/lib/utils";
import { TimelineDrawer, TimelineDrawerToggle } from "@/components/tasks/timeline-drawer";
import { TasksBoardView } from "@/components/tasks/tasks-board-view";
import { TaskDndContext } from "@/lib/dnd";
import { ErrorBanner } from "@/components/shared/error-banner";
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
import { setQuickScheduleOpen } from "@/lib/timeline-drag";
import type { PlanningState, Task, TaskGroupWithTasks } from "@/types/task";
import { normalizePlanningState } from "@/lib/task-planning";

function normalizeScheduleUpdates(updates: Partial<Task>): Partial<Task> {
  const normalized = { ...updates };

  if (normalized.scheduled_date && !("planning_state" in normalized)) {
    normalized.planning_state = "none";
  }

  return normalized;
}

export function TasksPageContent() {
  const [groups, setGroups] = useState<TaskGroupWithTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [todayViewDate, setTodayViewDate] = useState(getTodayDateString);
  const updateTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  const selectedTask = useMemo(() => {
    if (!selectedTaskId) return null;
    let fallback: Task | null = null;
    for (const group of groups) {
      const match = group.tasks.find((task) => task.id === selectedTaskId);
      if (!match) continue;
      if (isLaterGroup(group) || isTodayGroup(group)) return match;
      fallback = match;
    }
    return fallback;
  }, [groups, selectedTaskId]);

  const loadBoard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const board = await fetchTaskBoard();
      setGroups(board);
    } catch (err) {
      setError(
        err instanceof TaskGroupsError || err instanceof TasksError
          ? err.message
          : "Failed to load tasks."
      );
      setGroups([]);
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
    setGroups((prev) =>
      replaceTaskOnBoard(
        prev,
        taskId,
        (task) => ({ ...task, ...normalizedUpdates }),
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
          const updated = await updateTask(taskId, normalizedUpdates);
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

  async function handleCreateTask(
    groupId: string,
    title: string,
    options?: {
      scheduledDate?: string | null;
      planningState?: "none" | "later";
    }
  ) {
    setError(null);
    const orgGroup = groups.find(
      (item) =>
        item.id === groupId && !isTodayGroup(item) && !isLaterGroup(item)
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
            todayViewDate
          ).filter((task) => !task.completed)
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
        err instanceof TasksError ? err.message : "Failed to create task."
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
        todayViewDate
      )
    );

    try {
      const updated = await updateTask(taskId, normalizedUpdates);
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
          completed_at: !item.completed ? new Date().toISOString() : null,
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

  async function handleDuplicateTask(task: Task) {
    if (!task.group_id) return;
    setError(null);

    const orgGroup = groups.find((item) => item.id === task.group_id);
    const activeInGroup = sortByManualOrder(
      (orgGroup?.tasks ?? []).filter((item) => !item.completed)
    );
    const sortOrder = manualOrderForNewTaskAtEnd(activeInGroup);

    try {
      const duplicated = await duplicateTask(task, task.group_id, sortOrder);
      setGroups((prev) => addTaskToBoard(prev, duplicated, todayViewDate));
    } catch (err) {
      setError(
        err instanceof TasksError ? err.message : "Failed to duplicate task."
      );
    }
  }

  async function handleMoveTask(taskId: string, targetGroupId: string) {
    setError(null);

    let nextBoard = groups;
    setGroups((prev) => {
      const todayGroup = prev.find(isTodayGroup);
      const laterGroup = prev.find(isLaterGroup);
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
          : "Failed to move task."
      );
      void loadBoard();
    }
  }

  async function handleCreateGroupAndMoveTask(
    input: { title: string; icon: string; color: string },
    taskId: string
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
            todayViewDate,
          }
        );
        return nextBoard;
      });

      await persistTaskBoardLayout(nextBoard, { todayViewDate });
      return created.id;
    } catch (err) {
      setError(
        err instanceof TaskGroupsError
          ? err.message
          : "Failed to create group."
      );
      throw err;
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
        orderPinnedTaskGroups([...prev, { ...created, tasks: [] }])
      );
      return created.id;
    } catch (err) {
      setError(
        err instanceof TaskGroupsError
          ? err.message
          : "Failed to create group."
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
            item
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
          : "Failed to delete group."
      );
    }
  }

  async function handleRenameGroup(groupId: string, title: string) {
    setError(null);
    try {
      await updateTaskGroup(groupId, { title });
      setGroups((prev) =>
        prev.map((group) =>
          group.id === groupId ? { ...group, title } : group
        )
      );
    } catch (err) {
      setError(
        err instanceof TaskGroupsError
          ? err.message
          : "Failed to rename group."
      );
    }
  }

  async function handleUpdateGroupIcon(groupId: string, icon: string) {
    setError(null);
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId ? { ...group, icon } : group
      )
    );

    try {
      await updateTaskGroup(groupId, { icon });
    } catch (err) {
      setError(
        err instanceof TaskGroupsError
          ? err.message
          : "Failed to update group icon."
      );
      void loadBoard();
    }
  }

  async function handleUpdateGroupColor(groupId: string, color: string) {
    setError(null);
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId ? { ...group, color } : group
      )
    );

    try {
      await updateTaskGroup(groupId, { color });
    } catch (err) {
      setError(
        err instanceof TaskGroupsError
          ? err.message
          : "Failed to update group color."
      );
      void loadBoard();
    }
  }

  async function handleUpdateGroupSortMode(groupId: string, sortMode: TaskSortMode) {
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
          todayViewDate
        );
        const { active, completed } = sortActiveAndCompleted(
          visibleTasks,
          updatedGroup
        );
        return { ...updatedGroup, tasks: [...active, ...completed] };
      })
    );

    if (isLaterGroup(targetGroup)) return;

    try {
      await updateTaskGroup(groupId, { sort_mode: sortMode });
    } catch (err) {
      setError(
        err instanceof TaskGroupsError
          ? err.message
          : "Failed to update sort mode."
      );
      void loadBoard();
    }
  }

  async function handlePersistManualOrder(
    updates: { id: string; sort_order: number }[]
  ) {
    await batchUpdateManualOrders(updates);
  }

  async function handlePersistLayout(
    next: TaskGroupWithTasks[],
    options?: {
      previousBoard?: TaskGroupWithTasks[];
      taskDateAssignments?: { taskId: string; scheduledDate: string }[];
    }
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

    let nextBoard = groups;
    setGroups((prev) => {
      nextBoard = replaceTaskOnBoard(
        prev,
        taskId,
        (task) => ({
          ...task,
          planning_state: "later",
          scheduled_time: null,
        }),
        todayViewDate
      );
      return nextBoard;
    });

    try {
      const updated = await updateTask(taskId, {
        planning_state: "later",
        scheduled_time: null,
      });
      setGroups((prev) => syncTaskOnBoard(prev, updated, todayViewDate));
    } catch (err) {
      setError(
        err instanceof TasksError
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

  async function handleScheduleTask(
    taskId: string,
    updates: {
      scheduled_date: string;
      scheduled_time: string | null;
    }
  ) {
    setError(null);
    const withPlanning = { ...updates, planning_state: "none" as const };
    setGroups((prev) =>
      replaceTaskOnBoard(
        prev,
        taskId,
        (task) => ({ ...task, ...withPlanning }),
        todayViewDate
      )
    );

    try {
      const updated = await updateTask(taskId, withPlanning);
      setGroups((prev) => syncTaskOnBoard(prev, updated, todayViewDate));
    } catch (err) {
      setError(
        err instanceof TasksError ? err.message : "Failed to schedule task."
      );
      void loadBoard();
    }
  }

  function handleSelectTask(taskId: string | null) {
    setSelectedTaskId(taskId);
    if (taskId) setDetailOpen(true);
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Loading tasks…
      </div>
    );
  }


  return (
    <div className="relative flex h-full min-h-0">
      <div
        className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col pb-3 pt-2",
          WORKSPACE_GUTTER_CLASS
        )}
      >
        {error && (
          <div className="mb-3 shrink-0">
            <ErrorBanner message={error} />
          </div>
        )}

        {hint && (
          <div className="mb-3 shrink-0">
            <p
              className="rounded-lg border border-sky-200/80 bg-sky-50/90 px-3 py-2 text-sm text-sky-950"
              role="status"
            >
              {hint}
            </p>
          </div>
        )}

        <TaskDndContext>
          <TasksBoardView
            groups={groups}
            selectedTaskId={selectedTaskId}
            todayViewDate={todayViewDate}
            plannerActive={timelineOpen}
            onToggleQuickPlanner={() => setTimelineOpen((value) => !value)}
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
            onPersistManualOrder={handlePersistManualOrder}
            onShowHint={setHint}
            onSetPlanningState={handleSetPlanningState}
          />
        </TaskDndContext>
      </div>

      <TimelineDrawer
        open={timelineOpen}
        viewDate={todayViewDate}
        onViewDateChange={setTodayViewDate}
        groups={groups}
        selectedTaskId={selectedTaskId}
        onClose={() => setTimelineOpen(false)}
        onSelectTask={(taskId) => setSelectedTaskId(taskId)}
        onOpenDetail={(taskId) => {
          setSelectedTaskId(taskId);
          setDetailOpen(true);
        }}
        onScheduleTask={handleScheduleTask}
        onToggleComplete={handleToggleComplete}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        onDuplicateTask={handleDuplicateTask}
        onSetPlanningState={handleSetPlanningState}
      />

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
          onPlanningStateChange={(planningState) => {
            if (!selectedTask) return;
            void handleSetPlanningState(selectedTask.id, planningState);
          }}
        />
      </div>

      <TimelineDrawerToggle
        open={timelineOpen}
        detailPanelOffsetPx={
          detailOpen ? DETAIL_PANEL_WIDTH_PX : DETAIL_PANEL_COLLAPSED_WIDTH_PX
        }
        onToggle={() => setTimelineOpen((value) => !value)}
      />
    </div>
  );
}
