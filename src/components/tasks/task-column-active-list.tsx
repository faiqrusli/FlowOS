"use client";

import { memo, useSyncExternalStore, type DragEvent, type ReactNode } from "react";
import { TaskRow } from "@/components/tasks/task-row";
import { useTaskBoardActions } from "@/components/tasks/task-board-actions-context";
import {
  shouldShowActiveDropLine,
  shouldShowCompletedDropLine,
  subscribeTaskDragSession,
  isTaskDragging,
  isSortedColumnDropHighlight,
} from "@/lib/task-drag-session";
import { REORDER_DISABLED_TOOLTIP } from "@/lib/task-sort";
import { cn } from "@/lib/utils";
import type { Task, TaskGroupWithTasks } from "@/types/task";

function TaskDropLine() {
  return (
    <div
      className="mx-0.5 h-0.5 shrink-0 rounded-full bg-primary/70"
      aria-hidden
    />
  );
}

type ActiveDropLineProps = {
  groupId: string;
  beforeTaskId: string | null;
};

const ActiveDropLine = memo(function ActiveDropLine({
  groupId,
  beforeTaskId,
}: ActiveDropLineProps) {
  const visible = useSyncExternalStore(
    subscribeTaskDragSession,
    () => shouldShowActiveDropLine(groupId, beforeTaskId),
    () => false
  );
  if (!visible) return null;
  return <TaskDropLine />;
});

type MemoizedTaskRowProps = {
  task: Task;
  groupId: string;
  groups: TaskGroupWithTasks[];
  todayViewDate: string;
  isSelected: boolean;
  dragEnabled: boolean;
  reorderEnabled: boolean;
};

const MemoizedTaskRow = memo(function MemoizedTaskRow({
  task,
  groupId,
  groups,
  todayViewDate,
  isSelected,
  dragEnabled,
  reorderEnabled,
}: MemoizedTaskRowProps) {
  const actions = useTaskBoardActions();
  const isDragging = useSyncExternalStore(
    subscribeTaskDragSession,
    () => isTaskDragging(task.id),
    () => false
  );

  if (isDragging) {
    return null;
  }

  return (
    <TaskRow
      task={task}
      groups={groups}
      todayViewDate={todayViewDate}
      isSelected={isSelected}
      dragEnabled={dragEnabled}
      reorderEnabled={reorderEnabled}
      reorderDisabledTooltip={REORDER_DISABLED_TOOLTIP}
      onPointerDragStart={(coords) =>
        actions.onTaskPointerDragStart(task.id, groupId, coords)
      }
      onPointerDragEnd={actions.onTaskPointerDragEnd}
      onToggleComplete={() => actions.onToggleComplete(task)}
      onOpenDetail={() => actions.onOpenDetail(task.id)}
      onDuplicate={() => actions.onDuplicateTask(task)}
      onMoveToGroup={(targetGroupId) =>
        actions.onMoveTask(task.id, targetGroupId)
      }
      onDelete={() => actions.onDeleteTask(task.id)}
      onUpdate={(updates) => actions.onUpdateTask(task.id, updates)}
      onSetPlanningState={
        actions.onSetPlanningState
          ? (planningState) =>
              actions.onSetPlanningState?.(task.id, planningState)
          : undefined
      }
      onRequestCreateGroup={() => actions.onRequestCreateGroup(task.id)}
    />
  );
});

export type TaskColumnActiveListProps = {
  groupId: string;
  tasks: Task[];
  groups: TaskGroupWithTasks[];
  todayViewDate: string;
  selectedTaskId: string | null;
  dragEnabled: boolean;
  reorderEnabled: boolean;
  composeTop?: React.ReactNode;
};

export const TaskColumnActiveList = memo(function TaskColumnActiveList({
  groupId,
  tasks,
  groups,
  todayViewDate,
  selectedTaskId,
  dragEnabled,
  reorderEnabled,
  composeTop,
}: TaskColumnActiveListProps) {
  return (
    <>
      {composeTop}
      {tasks.map((task) => (
        <div key={task.id}>
          <ActiveDropLine groupId={groupId} beforeTaskId={task.id} />
          <MemoizedTaskRow
            task={task}
            groupId={groupId}
            groups={groups}
            todayViewDate={todayViewDate}
            isSelected={selectedTaskId === task.id}
            dragEnabled={dragEnabled}
            reorderEnabled={reorderEnabled}
          />
        </div>
      ))}
      <ActiveDropLine groupId={groupId} beforeTaskId={null} />
    </>
  );
});

export function useColumnHasActiveDropTarget(groupId: string): boolean {
  return useSyncExternalStore(
    subscribeTaskDragSession,
    () => isSortedColumnDropHighlight(groupId, "active"),
    () => false
  );
}

export const TaskGroupActiveBody = memo(function TaskGroupActiveBody({
  groupId,
  className,
  children,
  onDragOver,
  onDrop,
}: {
  groupId: string;
  className?: string;
  children: ReactNode;
  onDragOver: (event: DragEvent<HTMLElement>) => void;
  onDrop: (event: DragEvent<HTMLElement>) => void;
}) {
  const sortedHighlight = useSyncExternalStore(
    subscribeTaskDragSession,
    () => isSortedColumnDropHighlight(groupId, "active"),
    () => false
  );

  return (
    <div
      data-task-active-body
      className={cn(
        className,
        sortedHighlight &&
          "rounded-lg border border-primary/40 bg-primary/5 transition-colors"
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {children}
    </div>
  );
});

export function ActiveEmptyDropPlaceholder({
  groupId,
  visible,
  blocked,
}: {
  groupId: string;
  visible: boolean;
  blocked: boolean;
}) {
  const highlighted = useColumnHasActiveDropTarget(groupId);

  if (!visible || blocked) return null;

  return (
    <div
      className={cn(
        "flex flex-1 items-center justify-center rounded-lg border border-dashed border-transparent px-2 py-2 text-[11px] text-muted-foreground transition-colors",
        highlighted && "border-primary/40 bg-primary/5 text-foreground"
      )}
    >
      Drop task here
    </div>
  );
}

const CompletedDropLine = memo(function CompletedDropLine({
  groupId,
  beforeTaskId,
}: ActiveDropLineProps) {
  const visible = useSyncExternalStore(
    subscribeTaskDragSession,
    () => shouldShowCompletedDropLine(groupId, beforeTaskId),
    () => false
  );
  if (!visible) return null;
  return <TaskDropLine />;
});

export const TaskColumnCompletedList = memo(function TaskColumnCompletedList({
  groupId,
  tasks,
  groups,
  todayViewDate,
  selectedTaskId,
  dragEnabled,
  reorderEnabled,
}: Omit<TaskColumnActiveListProps, "composeTop"> & {
  dragEnabled: boolean;
  reorderEnabled: boolean;
}) {
  return (
    <>
      {tasks.map((task) => (
        <div key={task.id}>
          <CompletedDropLine groupId={groupId} beforeTaskId={task.id} />
          <MemoizedTaskRow
            task={task}
            groupId={groupId}
            groups={groups}
            todayViewDate={todayViewDate}
            isSelected={selectedTaskId === task.id}
            dragEnabled={dragEnabled}
            reorderEnabled={reorderEnabled}
          />
        </div>
      ))}
      <CompletedDropLine groupId={groupId} beforeTaskId={null} />
    </>
  );
});
