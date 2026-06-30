"use client";

import { memo, useMemo, Fragment, type DragEvent, type ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskBoardInsertLine } from "@/components/tasks/task-board-insert-line";
import { TaskRow } from "@/components/tasks/task-row";
import { useTaskBoardActions } from "@/components/tasks/task-board-actions-context";
import {
  columnActiveDroppableId,
  columnActiveEndDroppableId,
  columnCompletedDroppableId,
} from "@/lib/dnd/droppable-ids";
import { getGroupDndMetadata } from "@/lib/dnd/group-metadata";
import { isColumnActiveDropTarget } from "@/lib/dnd/preview";
import { useColumnDragPreviewDropTarget, useDragPreviewActiveTaskId } from "@/lib/dnd/preview-store";
import { REORDER_DISABLED_TOOLTIP } from "@/lib/task-sort";
import { cn } from "@/lib/utils";
import type { Task, TaskGroupWithTasks } from "@/types/task";

type MemoizedTaskRowProps = {
  task: Task;
  group: TaskGroupWithTasks;
  zone: "active" | "completed";
  groups: TaskGroupWithTasks[];
  todayViewDate: string;
  isSelected: boolean;
  dragEnabled: boolean;
  reorderEnabled: boolean;
};

const MemoizedTaskRow = memo(function MemoizedTaskRow({
  task,
  group,
  zone,
  groups,
  todayViewDate,
  isSelected,
  dragEnabled,
  reorderEnabled,
}: MemoizedTaskRowProps) {
  const actions = useTaskBoardActions();

  return (
    <TaskRow
      task={task}
      groupId={group.id}
      zone={zone}
      groups={groups}
      todayViewDate={todayViewDate}
      isSelected={isSelected}
      dragEnabled={dragEnabled}
      reorderEnabled={reorderEnabled}
      reorderDisabledTooltip={REORDER_DISABLED_TOOLTIP}
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
  group: TaskGroupWithTasks;
  tasks: Task[];
  groups: TaskGroupWithTasks[];
  todayViewDate: string;
  selectedTaskId: string | null;
  dragEnabled: boolean;
  reorderEnabled: boolean;
  composeTop?: React.ReactNode;
};

export const TaskColumnActiveList = memo(function TaskColumnActiveList({
  group,
  tasks,
  groups,
  todayViewDate,
  selectedTaskId,
  dragEnabled,
  reorderEnabled,
  composeTop,
}: TaskColumnActiveListProps) {
  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);
  const activeTaskId = useDragPreviewActiveTaskId();
  const dropTarget = useColumnDragPreviewDropTarget(group.id);

  const showInsertLine = Boolean(
    activeTaskId &&
      dropTarget?.showInsertionLine &&
      dropTarget.zone === "active" &&
      !tasks.some((task) => task.id === activeTaskId)
  );

  return (
    <SortableContext
      id={`${group.id}:active`}
      items={taskIds}
      strategy={verticalListSortingStrategy}
    >
      {composeTop}
      {showInsertLine && tasks.length === 0 ? (
        <TaskBoardInsertLine className="my-1" />
      ) : null}
      {tasks.map((task) => (
        <Fragment key={task.id}>
          {showInsertLine && dropTarget?.beforeTaskId === task.id ? (
            <TaskBoardInsertLine />
          ) : null}
          <MemoizedTaskRow
            task={task}
            group={group}
            zone="active"
            groups={groups}
            todayViewDate={todayViewDate}
            isSelected={selectedTaskId === task.id}
            dragEnabled={dragEnabled}
            reorderEnabled={reorderEnabled}
          />
        </Fragment>
      ))}
      {showInsertLine &&
      tasks.length > 0 &&
      dropTarget?.beforeTaskId === null ? (
        <TaskBoardInsertLine />
      ) : null}
      <ColumnActiveEndDropZone group={group} />
    </SortableContext>
  );
});

const ColumnActiveEndDropZone = memo(function ColumnActiveEndDropZone({
  group,
}: {
  group: TaskGroupWithTasks;
}) {
  const droppableMeta = useMemo(() => getGroupDndMetadata(group), [group]);
  const { setNodeRef } = useDroppable({
    id: columnActiveEndDroppableId(group.id),
    data: { type: "column-active-end", groupId: group.id, ...droppableMeta },
  });

  return (
    <div ref={setNodeRef} className="min-h-1 shrink-0" aria-hidden />
  );
});

export function useColumnHasActiveDropTarget(groupId: string): boolean {
  const dropTarget = useColumnDragPreviewDropTarget(groupId);
  return isColumnActiveDropTarget(dropTarget, groupId);
}

export const TaskGroupActiveBody = memo(function TaskGroupActiveBody({
  group,
  className,
  children,
  onDragOver,
  onDrop,
}: {
  group: TaskGroupWithTasks;
  className?: string;
  children: ReactNode;
  onDragOver?: (event: DragEvent<HTMLElement>) => void;
  onDrop?: (event: DragEvent<HTMLElement>) => void;
}) {
  const droppableMeta = useMemo(() => getGroupDndMetadata(group), [group]);
  const { setNodeRef } = useDroppable({
    id: columnActiveDroppableId(group.id),
    data: { type: "column-active", groupId: group.id, ...droppableMeta },
  });

  return (
    <div
      ref={setNodeRef}
      data-task-active-body
      className={className}
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
        highlighted && "border-primary/25 bg-primary/[0.03] text-foreground/80"
      )}
    >
      Drop task here
    </div>
  );
}

export const TaskColumnCompletedList = memo(function TaskColumnCompletedList({
  group,
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
  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  return (
    <SortableContext
      id={`${group.id}:completed`}
      items={taskIds}
      strategy={verticalListSortingStrategy}
    >
      {tasks.map((task) => (
        <MemoizedTaskRow
          key={task.id}
          task={task}
          group={group}
          zone="completed"
          groups={groups}
          todayViewDate={todayViewDate}
          isSelected={selectedTaskId === task.id}
          dragEnabled={dragEnabled}
          reorderEnabled={reorderEnabled}
        />
      ))}
    </SortableContext>
  );
});

export const TaskCompletedBody = memo(function TaskCompletedBody({
  group,
  className,
  children,
  onDragOver,
  onDrop,
}: {
  group: TaskGroupWithTasks;
  className?: string;
  children: ReactNode;
  onDragOver?: (event: DragEvent<HTMLElement>) => void;
  onDrop?: (event: DragEvent<HTMLElement>) => void;
}) {
  const droppableMeta = useMemo(() => getGroupDndMetadata(group), [group]);
  const { setNodeRef } = useDroppable({
    id: columnCompletedDroppableId(group.id),
    data: { type: "column-completed", groupId: group.id, ...droppableMeta },
  });

  return (
    <div
      ref={setNodeRef}
      data-task-completed-body
      className={className}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {children}
    </div>
  );
});
