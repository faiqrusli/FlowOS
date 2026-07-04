import { getTodayDateString } from "@/lib/date-utils";
import {
  fetchTaskBoard,
  filterTasksForGroup,
  isInboxGroup,
} from "@/lib/task-groups";
import {
  manualOrderForNewTaskAtEnd,
  manualOrderForNewTaskAtTop,
  sortByManualOrder,
} from "@/lib/manual-order";
import type { TaskPriority } from "@/lib/task-priority";
import {
  DEFAULT_TASK_SORT_MODE,
  getTaskGroupSortMode,
  isManualTaskSortMode,
} from "@/lib/task-sort";
import { createTask, TasksError } from "@/lib/tasks";
import type { PlanningState, Task } from "@/types/task";

export type QuickCaptureTaskInput = {
  title: string;
  description?: string | null;
  priority?: TaskPriority;
  scheduledDate?: string | null;
  planningState?: PlanningState;
  groupId?: string;
};

export async function createQuickCaptureTask(
  input: QuickCaptureTaskInput
): Promise<Task> {
  const trimmed = input.title.trim();
  if (!trimmed) {
    throw new TasksError("Title is required.");
  }

  const boardGroups = await fetchTaskBoard();
  const fallbackInbox = boardGroups.find(isInboxGroup);
  const targetGroupId = input.groupId || fallbackInbox?.id;
  if (!targetGroupId) {
    throw new TasksError("No group available.");
  }

  const targetGroup =
    boardGroups.find((item) => item.id === targetGroupId) ?? fallbackInbox;
  if (!targetGroup) {
    throw new TasksError("Target group not found.");
  }

  const todayViewDate = getTodayDateString();
  const sortMode = getTaskGroupSortMode(targetGroup) ?? DEFAULT_TASK_SORT_MODE;
  const columnActiveTasks = sortByManualOrder(
    filterTasksForGroup(targetGroup, targetGroup.tasks, todayViewDate).filter(
      (task) => !task.completed
    )
  );
  const manualTopInsert = isManualTaskSortMode(sortMode);

  return createTask({
    title: trimmed,
    description: input.description ?? null,
    group_id: targetGroup.id,
    sort_order: manualTopInsert
      ? manualOrderForNewTaskAtTop(columnActiveTasks)
      : manualOrderForNewTaskAtEnd(columnActiveTasks),
    priority: input.priority ?? "low",
    scheduled_date: input.scheduledDate ?? getTodayDateString(),
    planning_state: input.planningState ?? "none",
  });
}
