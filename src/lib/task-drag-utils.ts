import type { Task, TaskGroupWithTasks } from "@/types/task";
import type { DropBeforeId } from "@/lib/list-drag-utils";
import {
  applyManualActiveInsertToGroup,
  getDisplayedActiveTasks,
  getDisplayedCompletedTasks,
  isManualActiveDropGroup,
} from "@/lib/task-drop-target";
import { logMoveTaskInBoardStep } from "@/lib/task-drag-pipeline-debug";
import {
  getSortContextForGroup,
  getTaskGroupSortMode,
  isManualTaskSortMode,
  sortActiveAndCompletedForContext,
} from "@/lib/task-sort";
import { LATER_PLANNING_TASK_UPDATES } from "@/lib/task-planning";
import {
  isLaterGroup,
  isPinnedTaskGroup,
  isTodayGroup,
  orderPinnedTaskGroups,
  taskBelongsInLaterView,
} from "@/lib/task-groups";
import { getTodayDateString } from "@/lib/date-utils";

export type TaskDragZone = "active" | "completed";

export type TaskDragTarget = {
  groupId: string;
  beforeTaskId: DropBeforeId;
  zone: TaskDragZone;
  /** When false, only a column highlight is shown (sorted active destinations). */
  showInsertionLine?: boolean;
};

export type MoveTaskInBoardOptions = {
  todayGroupId?: string | null;
  laterGroupId?: string | null;
  inboxGroupId?: string | null;
  todayViewDate?: string;
  /** When set, org-group moves are blocked only if the drag started from Today/Later. */
  sourceGroupId?: string | null;
};

export function partitionGroupTasks(tasks: Task[]) {
  const active = tasks.filter((task) => !task.completed);
  const completed = tasks.filter((task) => task.completed);
  return { active, completed };
}

export function combineGroupTasks(active: Task[], completed: Task[]): Task[] {
  return [
    ...active.map((task, index) => ({ ...task, completed: false, sort_order: index })),
    ...completed.map((task, index) => ({
      ...task,
      completed: true,
      sort_order: active.length + index,
    })),
  ];
}

export function taskDragTargetsEqual(
  a: TaskDragTarget | null,
  b: TaskDragTarget | null
): boolean {
  return (
    a?.groupId === b?.groupId &&
    a?.beforeTaskId === b?.beforeTaskId &&
    a?.zone === b?.zone &&
    a?.showInsertionLine === b?.showInsertionLine
  );
}

function findTaskOnBoard(board: TaskGroupWithTasks[], taskId: string): Task | null {
  for (const group of board) {
    const match = group.tasks.find((task) => task.id === taskId);
    if (match) return { ...match };
  }
  return null;
}

function insertTaskWithManualOrder(
  group: TaskGroupWithTasks,
  movingTask: Task,
  target: TaskDragTarget,
  todayViewDate: string
): TaskGroupWithTasks {
  const { completed } = partitionGroupTasks(group.tasks);

  if (target.zone === "completed") {
    const list = [...getDisplayedCompletedTasks(group, group.tasks, todayViewDate)];
    const insertIndex =
      target.beforeTaskId === null
        ? list.length
        : list.findIndex((task) => task.id === target.beforeTaskId);
    if (insertIndex === -1) return group;
    list.splice(insertIndex, 0, { ...movingTask, completed: true });
    const { active } = partitionGroupTasks(group.tasks);
    return { ...group, tasks: [...active, ...list] };
  }

  const { group: nextGroup } = applyManualActiveInsertToGroup(
    group,
    { ...movingTask, completed: false, group_id: group.id },
    target.beforeTaskId,
    todayViewDate
  );
  return nextGroup;
}

function insertTaskIntoGroup(
  group: TaskGroupWithTasks,
  movingTask: Task,
  target: TaskDragTarget,
  options?: { manualReorder?: boolean; todayViewDate?: string }
): TaskGroupWithTasks {
  const todayViewDate = options?.todayViewDate ?? getTodayDateString();

  if (options?.manualReorder) {
    return insertTaskWithManualOrder(group, movingTask, target, todayViewDate);
  }

  const { active, completed } = partitionGroupTasks(group.tasks);
  const pool =
    target.zone === "completed"
      ? getDisplayedCompletedTasks(group, group.tasks, todayViewDate)
      : getDisplayedActiveTasks(group, group.tasks, todayViewDate);
  const list = [...pool];

  const insertIndex =
    target.beforeTaskId === null
      ? list.length
      : list.findIndex((task) => task.id === target.beforeTaskId);

  if (insertIndex === -1) return group;

  list.splice(insertIndex, 0, movingTask);

  const nextActive = target.zone === "completed" ? active : list;
  const nextCompleted = target.zone === "completed" ? list : completed;

  const merged = [
    ...nextActive.map((task) => ({ ...task, completed: false })),
    ...nextCompleted.map((task) => ({ ...task, completed: true })),
  ];
  const sorted = sortActiveAndCompletedForContext(
    merged,
    getSortContextForGroup(group)
  );

  return {
    ...group,
    tasks: [...sorted.active, ...sorted.completed],
  };
}

function isManualActiveInsertTarget(
  board: TaskGroupWithTasks[],
  target: TaskDragTarget
): boolean {
  if (target.zone !== "active") return false;
  const targetGroup = board.find((group) => group.id === target.groupId);
  if (!targetGroup) return false;
  return isManualActiveDropGroup(targetGroup);
}

function resolveInsertOptions(
  board: TaskGroupWithTasks[],
  target: TaskDragTarget,
  todayViewDate?: string
): { manualReorder?: boolean; todayViewDate?: string } {
  if (isManualActiveInsertTarget(board, target)) {
    return { manualReorder: true, todayViewDate };
  }
  return { todayViewDate };
}

/** Same column, active list — a reorder attempt (not a cross-group move). */
export function isSameGroupActiveReorderAttempt(
  sourceGroupId: string | null | undefined,
  target: TaskDragTarget
): boolean {
  return (
    sourceGroupId === target.groupId &&
    target.zone === "active"
  );
}

export function isCrossGroupMove(
  sourceGroupId: string | null | undefined,
  targetGroupId: string
): boolean {
  return Boolean(sourceGroupId && sourceGroupId !== targetGroupId);
}

/** Whether an active-zone drop is allowed (cross-group moves always; same-group only in Manual). */
export function canAcceptActiveDropTarget(
  board: TaskGroupWithTasks[],
  sourceGroupId: string | null | undefined,
  target: TaskDragTarget
): boolean {
  if (!isSameGroupActiveReorderAttempt(sourceGroupId, target)) {
    return true;
  }
  const sourceGroup = board.find((group) => group.id === sourceGroupId);
  if (!sourceGroup || isTodayGroup(sourceGroup)) return false;
  return isManualTaskSortMode(getTaskGroupSortMode(sourceGroup));
}

export function isOrganizationGroupTarget(
  board: TaskGroupWithTasks[],
  groupId: string
): boolean {
  const group = board.find((item) => item.id === groupId);
  if (!group) return false;
  return !isTodayGroup(group) && !isLaterGroup(group);
}

function isPlanningColumnSource(
  board: TaskGroupWithTasks[],
  sourceGroupId: string | null | undefined
): boolean {
  if (!sourceGroupId) return false;
  const sourceGroup = board.find((group) => group.id === sourceGroupId);
  return Boolean(
    sourceGroup && (isTodayGroup(sourceGroup) || isLaterGroup(sourceGroup))
  );
}

function upsertTaskInOrgGroup(
  board: TaskGroupWithTasks[],
  task: Task
): TaskGroupWithTasks[] {
  return board.map((group) => {
    if (group.id !== task.group_id) {
      return group;
    }

    const hasTask = group.tasks.some((item) => item.id === task.id);
    const nextTasks = hasTask
      ? group.tasks.map((item) => (item.id === task.id ? task : item))
      : [...group.tasks, task];
    const { active, completed } = sortActiveAndCompletedForContext(
      nextTasks,
      getSortContextForGroup(group)
    );

    return { ...group, tasks: [...active, ...completed] };
  });
}

function stripTaskFromPlanningColumns(
  board: TaskGroupWithTasks[],
  taskId: string
): TaskGroupWithTasks[] {
  return board.map((group) => {
    if (!isLaterGroup(group) && !isTodayGroup(group)) {
      return group;
    }

    return {
      ...group,
      tasks: group.tasks.filter((task) => task.id !== taskId),
    };
  });
}

function removeTaskFromOtherOrgGroups(
  board: TaskGroupWithTasks[],
  taskId: string,
  keepGroupId: string | null | undefined
): TaskGroupWithTasks[] {
  return board.map((group) => {
    if (isTodayGroup(group) || isLaterGroup(group) || group.id === keepGroupId) {
      return group;
    }

    return {
      ...group,
      tasks: group.tasks.filter((task) => task.id !== taskId),
    };
  });
}

function insertTaskIntoPlanningColumn(
  board: TaskGroupWithTasks[],
  task: Task,
  target: TaskDragTarget,
  insertOptions: { manualReorder?: boolean; todayViewDate?: string }
): TaskGroupWithTasks[] {
  return board.map((group) => {
    if (group.id !== target.groupId) return group;
    return insertTaskIntoGroup(group, task, target, insertOptions);
  });
}

function moveTaskToPlanningColumn(
  board: TaskGroupWithTasks[],
  taskId: string,
  updatedTask: Task,
  target: TaskDragTarget,
  insertOptions: { manualReorder?: boolean; todayViewDate?: string }
): TaskGroupWithTasks[] {
  let next = stripTaskFromPlanningColumns(board, taskId);
  next = upsertTaskInOrgGroup(next, updatedTask);
  next = removeTaskFromOtherOrgGroups(next, taskId, updatedTask.group_id);
  return insertTaskIntoPlanningColumn(next, updatedTask, target, insertOptions);
}

export function moveTaskInBoard(
  board: TaskGroupWithTasks[],
  taskId: string,
  target: TaskDragTarget,
  options?: MoveTaskInBoardOptions & { backlogGroupId?: string | null }
): TaskGroupWithTasks[] {
  const movingTask = findTaskOnBoard(board, taskId);
  if (!movingTask) return board;

  const todayGroupId = options?.todayGroupId ?? null;
  const laterGroupId =
    options?.laterGroupId ?? options?.backlogGroupId ?? null;
  const todayViewDate = options?.todayViewDate;

  const isTodayTarget = Boolean(
    todayGroupId && target.groupId === todayGroupId && todayViewDate
  );
  const isLaterTarget = Boolean(
    laterGroupId && target.groupId === laterGroupId
  );

  if (
    isPlanningColumnSource(board, options?.sourceGroupId) &&
    !isTodayTarget &&
    !isLaterTarget
  ) {
    return board;
  }

  if (
    isSameGroupActiveReorderAttempt(options?.sourceGroupId, target) &&
    !canAcceptActiveDropTarget(board, options?.sourceGroupId, target)
  ) {
    return board;
  }

  const insertOptions = resolveInsertOptions(board, target, todayViewDate);

  if (isLaterTarget) {
    const laterTask: Task = {
      ...movingTask,
      ...LATER_PLANNING_TASK_UPDATES,
      completed: target.zone === "completed",
    };

    return moveTaskToPlanningColumn(
      board,
      taskId,
      laterTask,
      target,
      insertOptions
    );
  }

  if (isTodayTarget) {
    const scheduledTask: Task = {
      ...movingTask,
      planning_state: "none",
      scheduled_date: todayViewDate!,
      completed: target.zone === "completed",
    };

    return moveTaskToPlanningColumn(
      board,
      taskId,
      scheduledTask,
      target,
      insertOptions
    );
  }

  const nextTask: Task = {
    ...movingTask,
    group_id: target.groupId,
    planning_state: "none",
    completed: target.zone === "completed",
  };

  const stripped = board.map((group) => ({
    ...group,
    tasks: group.tasks.filter((task) => task.id !== taskId),
  }));

  const traceStep =
    insertOptions.manualReorder && todayViewDate
      ? (step: string, currentBoard: TaskGroupWithTasks[], extra?: Record<string, unknown>) =>
          logMoveTaskInBoardStep({
            step,
            board: currentBoard,
            destinationGroupId: target.groupId,
            movingTaskId: taskId,
            todayViewDate,
            extra,
          })
      : null;

  traceStep?.("after strip task from all groups", stripped, {
    insertOptions,
    nextTaskSortOrder: nextTask.sort_order,
  });

  const withOrgMove = stripped.map((group) => {
    if (group.id !== target.groupId) return group;
    return insertTaskIntoGroup(group, nextTask, target, insertOptions);
  });

  const destinationAfterInsert = withOrgMove.find(
    (group) => group.id === target.groupId
  );
  traceStep?.("after insertTaskIntoGroup (destination)", withOrgMove, {
    destinationBeforeInsertIds:
      stripped
        .find((group) => group.id === target.groupId)
        ?.tasks.map((task) => task.id.slice(0, 8)) ?? [],
    destinationRawAfterInsert:
      destinationAfterInsert?.tasks.map((task) => task.id.slice(0, 8)) ?? [],
    insertedMovingSortOrder:
      destinationAfterInsert?.tasks.find((task) => task.id === taskId)
        ?.sort_order ?? null,
    nextTaskSortOrderFromSource: nextTask.sort_order,
  });

  traceStep?.("after withOrgMove map", withOrgMove);

  if (!withOrgMove.some((group) => isTodayGroup(group))) {
    return withOrgMove;
  }

  const afterTodaySync = withOrgMove.map((group) => {
    if (!isTodayGroup(group)) {
      return group;
    }

    const stillInToday =
      nextTask.scheduled_date && nextTask.scheduled_date === todayViewDate;

    if (!stillInToday || taskBelongsInLaterView(nextTask)) {
      return {
        ...group,
        tasks: group.tasks.filter((task) => task.id !== taskId),
      };
    }

    const hasTask = group.tasks.some((task) => task.id === taskId);
    if (hasTask) {
      return {
        ...group,
        tasks: group.tasks.map((task) => (task.id === taskId ? nextTask : task)),
      };
    }

    return insertTaskIntoGroup(group, nextTask, target, insertOptions);
  });

  traceStep?.("after today-column sync", afterTodaySync);
  return afterTodaySync;
}

export function moveGroupInBoard(
  groups: TaskGroupWithTasks[],
  groupId: string,
  beforeGroupId: DropBeforeId
): TaskGroupWithTasks[] {
  const movingGroup = groups.find((group) => group.id === groupId);
  if (movingGroup && isPinnedTaskGroup(movingGroup)) return groups;

  const list = [...groups];
  const sourceIndex = list.findIndex((group) => group.id === groupId);
  if (sourceIndex === -1) return groups;

  const [group] = list.splice(sourceIndex, 1);

  if (beforeGroupId === null) {
    list.push(group);
  } else {
    const insertIndex = list.findIndex((item) => item.id === beforeGroupId);
    if (insertIndex === -1) return groups;
    const beforeGroup = list[insertIndex];
    if (beforeGroup && isPinnedTaskGroup(beforeGroup)) return groups;
    list.splice(insertIndex, 0, group);
  }

  return orderPinnedTaskGroups(
    list.map((item, index) => ({ ...item, sort_order: index }))
  );
}
