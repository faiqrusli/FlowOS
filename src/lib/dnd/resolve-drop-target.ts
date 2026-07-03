import type { DragOverEvent } from "@dnd-kit/core";
import type { DropBeforeId } from "@/lib/list-drag-utils";
import { initialDropBeforeId } from "@/lib/list-drag-utils";
import {
  isColumnActiveDropData,
  isColumnActiveEndDropData,
  isColumnCompletedDropData,
  isTaskDragData,
} from "@/lib/dnd/drag-utils";
import {
  resolveManualBeforeTaskIdFromSortable,
  isSortableTaskOver,
} from "@/lib/dnd/sortable-drop-target";
import { isTodayGroup } from "@/lib/task-groups";
import {
  buildCompletedTaskDropTarget,
  getDisplayedActiveTasks,
  isManualActiveDropGroup,
} from "@/lib/task-drop-target";
import { resolveBeforeTaskIdFromPointerMidpoints } from "@/lib/dnd/pointer-target-cache";
import { isManualTaskSortMode, type TaskSortMode } from "@/lib/task-sort";
import type { TaskDragTarget } from "@/lib/task-drag-utils";
import type { TaskGroupWithTasks } from "@/types/task";

function buildManualActiveTarget(
  group: TaskGroupWithTasks,
  beforeTaskId: DropBeforeId
): TaskDragTarget {
  return {
    groupId: group.id,
    beforeTaskId,
    zone: "active",
    showInsertionLine: true,
  };
}

function buildSortedActiveTarget(groupId: string): TaskDragTarget {
  return {
    groupId,
    beforeTaskId: null,
    zone: "active",
    showInsertionLine: false,
  };
}

function isManualDropGroup(
  group: TaskGroupWithTasks,
  sortMode?: TaskSortMode
): boolean {
  if (sortMode !== undefined) {
    return isManualTaskSortMode(sortMode) && !isTodayGroup(group);
  }
  return isManualActiveDropGroup(group);
}

function buildActiveTargetForGroup(
  group: TaskGroupWithTasks,
  beforeTaskId: DropBeforeId,
  sortMode?: TaskSortMode
): TaskDragTarget {
  if (isManualDropGroup(group, sortMode)) {
    return buildManualActiveTarget(group, beforeTaskId);
  }
  return buildSortedActiveTarget(group.id);
}

export function buildInitialTaskDropTarget(
  taskId: string,
  groupId: string,
  groups: TaskGroupWithTasks[],
  todayViewDate: string
): TaskDragTarget | null {
  const sourceGroup = groups.find((group) => group.id === groupId);
  const movingTask = sourceGroup?.tasks.find((task) => task.id === taskId);
  if (!sourceGroup || !movingTask) return null;

  if (movingTask.completed) {
    return buildCompletedTaskDropTarget(sourceGroup.id);
  }

  if (isManualActiveDropGroup(sourceGroup)) {
    const activeIds = getDisplayedActiveTasks(
      sourceGroup,
      sourceGroup.tasks.filter((task) => task.id !== taskId),
      todayViewDate
    ).map((task) => task.id);

    return buildManualActiveTarget(
      sourceGroup,
      initialDropBeforeId(activeIds, taskId)
    );
  }

  return buildSortedActiveTarget(sourceGroup.id);
}

/** Align manual insert-line preview with pointer Y over rendered task rows. */
export function refineManualDropTargetFromPointer(
  target: TaskDragTarget,
  groups: TaskGroupWithTasks[],
  todayViewDate: string,
  clientY: number,
  draggingTaskId: string
): TaskDragTarget {
  if (!target.showInsertionLine || target.zone !== "active") return target;

  const group = groups.find((item) => item.id === target.groupId);
  if (!group) return target;

  const activeBody = document.querySelector<HTMLElement>(
    `[data-task-group="${target.groupId}"] [data-task-active-body]`
  );
  if (!activeBody) return target;

  const activeIds = getDisplayedActiveTasks(
    group,
    group.tasks,
    todayViewDate
  ).map((task) => task.id);

  const beforeTaskId = resolveBeforeTaskIdFromPointerMidpoints(
    target.groupId,
    activeIds,
    activeBody,
    clientY,
    draggingTaskId
  );

  return { ...target, beforeTaskId };
}

export function resolveTaskDropTargetFromDndEvent(
  event: DragOverEvent,
  groups: TaskGroupWithTasks[],
  todayViewDate: string,
  draggingTaskId: string
): TaskDragTarget | null {
  const { over } = event;
  if (!over) return null;

  const overData = over.data.current;

  if (isColumnCompletedDropData(overData)) {
    return buildCompletedTaskDropTarget(overData.groupId);
  }

  if (isColumnActiveEndDropData(overData)) {
    const group = groups.find((item) => item.id === overData.groupId);
    if (!group) return null;
    return buildActiveTargetForGroup(group, null, overData.sortMode);
  }

  if (isColumnActiveDropData(overData)) {
    const group = groups.find((item) => item.id === overData.groupId);
    if (!group) return null;
    return buildActiveTargetForGroup(group, null, overData.sortMode);
  }

  if (isSortableTaskOver(event) || isTaskDragData(overData)) {
    const taskData = overData as {
      groupId: string;
      zone: "active" | "completed";
      sortMode: TaskSortMode;
    };

    const group = groups.find((item) => item.id === taskData.groupId);
    if (!group) return null;

    if (taskData.zone === "completed") {
      return buildCompletedTaskDropTarget(taskData.groupId);
    }

    if (isManualDropGroup(group, taskData.sortMode)) {
      const beforeTaskId = resolveManualBeforeTaskIdFromSortable(
        event,
        draggingTaskId
      );
      return buildManualActiveTarget(group, beforeTaskId);
    }

    return buildSortedActiveTarget(group.id);
  }

  return null;
}
