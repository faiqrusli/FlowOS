"use client";

import { useGlobalRightSidebar } from "@/contexts/global-right-sidebar-context";
import {
  TaskDetailEmptyState,
  TaskDetailFields,
} from "@/components/tasks/task-detail-panel";

export function SidebarDetailsPanel() {
  const { selectedTaskId, taskDetailSource } = useGlobalRightSidebar();

  const task =
    selectedTaskId && taskDetailSource
      ? taskDetailSource.getTask(selectedTaskId)
      : null;

  if (!task || !taskDetailSource) {
    return <TaskDetailEmptyState />;
  }

  return (
    <TaskDetailFields
      task={task}
      groups={taskDetailSource.groups}
      todayViewDate={taskDetailSource.todayViewDate}
      onChange={(updates) => taskDetailSource.onUpdate(task.id, updates)}
      onMoveToGroup={(groupId) =>
        taskDetailSource.onMoveToGroup(task.id, groupId)
      }
      onPlanningStateChange={
        taskDetailSource.onPlanningStateChange
          ? (planningState) =>
              taskDetailSource.onPlanningStateChange?.(task.id, planningState)
          : undefined
      }
    />
  );
}
