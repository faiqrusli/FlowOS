import { isLaterGroup } from "@/lib/task-groups";
import { getTaskGroupSortMode, type TaskSortMode } from "@/lib/task-sort";
import { normalizePlanningState, type PlanningState } from "@/lib/task-planning";
import type { Task, TaskGroup } from "@/types/task";

export type GroupDndMetadata = {
  planningState: PlanningState;
  sortMode: TaskSortMode;
};

export function getGroupDndMetadata(group: TaskGroup): GroupDndMetadata {
  const sortMode = getTaskGroupSortMode(group);
  if (isLaterGroup(group)) {
    return { planningState: "later", sortMode };
  }
  return { planningState: "none", sortMode };
}

export function getTaskDndMetadata(
  task: Task,
  group: TaskGroup,
  zone: "active" | "completed"
) {
  const groupMeta = getGroupDndMetadata(group);
  return {
    type: "task" as const,
    taskId: task.id,
    groupId: group.id,
    zone,
    planningState: normalizePlanningState(task.planning_state),
    sortMode: groupMeta.sortMode,
  };
}
