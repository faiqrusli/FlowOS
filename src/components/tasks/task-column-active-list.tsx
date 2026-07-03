"use client";

import { memo, useSyncExternalStore, type DragEvent, type ReactNode } from "react";
import { TaskRow } from "@/components/tasks/task-row";
import {
  isExternalTaskDragActive,
  isSortedColumnDropHighlight,
  isTaskDragSource,
  shouldShowActiveDropLine,
  subscribeTaskDragSession,
} from "@/lib/task-drag-session";
import {
  isTaskDropRevealing,
  subscribeTaskDropReveal,
} from "@/lib/task-drop-reveal";
import { useTaskDragSessionSelector } from "@/lib/use-task-drag-session-selector";
import { useStableTaskList } from "@/lib/use-stable-task-list";
import { useIsTaskSelected } from "@/lib/task-board-selection";
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

const ActiveDropLine = memo(function ActiveDropLine({
  groupId,
  beforeTaskId,
}: {
  groupId: string;
  beforeTaskId: string | null;
}) {
  const visible = useTaskDragSessionSelector(
    (snapshot) => shouldShowActiveDropLine(groupId, beforeTaskId),
    (previous, next) => previous === next
  );
  if (!visible) return null;
  return <TaskDropLine />;
});

type BoardTaskRowProps = {
  task: Task;
  groupId: string;
  zone: "active" | "completed";
  todayViewDate: string;
  dragEnabled: boolean;
  reorderEnabled: boolean;
};

const BoardTaskRow = memo(function BoardTaskRow({
  task,
  groupId,
  zone,
  todayViewDate,
  dragEnabled,
  reorderEnabled,
}: BoardTaskRowProps) {
  const isSelected = useIsTaskSelected(task.id);
  const isDragSource = useSyncExternalStore(
    subscribeTaskDragSession,
    () => isTaskDragSource(task.id, groupId),
    () => false
  );
  const isDropReveal = useSyncExternalStore(
    subscribeTaskDropReveal,
    () => isTaskDropRevealing(task.id),
    () => false
  );

  return (
    <div
      data-task-board-slot={task.id}
      className={cn(
        isDragSource && "pointer-events-none opacity-0",
        isDropReveal && !isDragSource && "animate-task-drop-reveal"
      )}
    >
      <TaskRow
        task={task}
        groupId={groupId}
        zone={zone}
        todayViewDate={todayViewDate}
        isSelected={isSelected}
        dragEnabled={dragEnabled}
        reorderEnabled={reorderEnabled}
        reorderDisabledTooltip={REORDER_DISABLED_TOOLTIP}
      />
    </div>
  );
}, (previous, next) => {
  return (
    previous.task === next.task &&
    previous.groupId === next.groupId &&
    previous.zone === next.zone &&
    previous.todayViewDate === next.todayViewDate &&
    previous.dragEnabled === next.dragEnabled &&
    previous.reorderEnabled === next.reorderEnabled
  );
});

type ActiveTaskSlotProps = {
  groupId: string;
  task: Task;
  todayViewDate: string;
  dragEnabled: boolean;
  reorderEnabled: boolean;
};

const ActiveTaskSlot = memo(function ActiveTaskSlot({
  groupId,
  task,
  todayViewDate,
  dragEnabled,
  reorderEnabled,
}: ActiveTaskSlotProps) {
  return (
    <>
      <ActiveDropLine groupId={groupId} beforeTaskId={task.id} />
      <BoardTaskRow
        task={task}
        groupId={groupId}
        zone="active"
        todayViewDate={todayViewDate}
        dragEnabled={dragEnabled}
        reorderEnabled={reorderEnabled}
      />
    </>
  );
}, (previous, next) => {
  return (
    previous.groupId === next.groupId &&
    previous.task === next.task &&
    previous.todayViewDate === next.todayViewDate &&
    previous.dragEnabled === next.dragEnabled &&
    previous.reorderEnabled === next.reorderEnabled
  );
});

export type TaskColumnActiveListProps = {
  group: TaskGroupWithTasks;
  tasks: Task[];
  todayViewDate: string;
  dragEnabled: boolean;
  reorderEnabled: boolean;
  composeTop?: React.ReactNode;
};

export const TaskColumnActiveList = memo(function TaskColumnActiveList({
  group,
  tasks,
  todayViewDate,
  dragEnabled,
  reorderEnabled,
  composeTop,
}: TaskColumnActiveListProps) {
  const stableTasks = useStableTaskList(tasks);
  const groupId = group.id;

  return (
    <>
      {composeTop}
      {stableTasks.map((task) => (
        <ActiveTaskSlot
          key={task.id}
          groupId={groupId}
          task={task}
          todayViewDate={todayViewDate}
          dragEnabled={dragEnabled}
          reorderEnabled={reorderEnabled}
        />
      ))}
      <ActiveDropLine groupId={groupId} beforeTaskId={null} />
      <div className="min-h-1 shrink-0" aria-hidden />
    </>
  );
});

const SortedColumnDropHighlight = memo(function SortedColumnDropHighlight({
  groupId,
}: {
  groupId: string;
}) {
  const visible = useTaskDragSessionSelector(
    (snapshot) => isSortedColumnDropHighlight(groupId, "active"),
    (previous, next) => previous === next
  );
  if (!visible) return null;
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 rounded-lg border border-primary/40 bg-primary/5 transition-colors"
      aria-hidden
    />
  );
});

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
  return (
    <div
      data-task-active-body
      className={cn(className, "relative")}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <SortedColumnDropHighlight groupId={group.id} />
      <div className="relative z-[1] flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
});

export const ColumnEmptyDragStretch = memo(function ColumnEmptyDragStretch({
  isEmpty,
}: {
  isEmpty: boolean;
}) {
  const dragActive = useTaskDragSessionSelector(
    () => isExternalTaskDragActive(),
    (previous, next) => previous === next
  );
  if (!isEmpty || !dragActive) return null;
  return <div className="min-h-[2.5rem] flex-1" aria-hidden />;
});

export const LaterEmptyColumnHint = memo(function LaterEmptyColumnHint({
  isEmpty,
  isComposing,
}: {
  isEmpty: boolean;
  isComposing: boolean;
}) {
  const dragActive = useTaskDragSessionSelector(
    () => isExternalTaskDragActive(),
    (previous, next) => previous === next
  );
  if (!isEmpty || isComposing || dragActive) return null;

  return (
    <div className="px-2 py-6 text-center">
      <p className="text-[11px] font-medium text-foreground/85">No tasks in Later.</p>
      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
        Move tasks here when you want to plan them another time.
      </p>
    </div>
  );
});

export const ActiveEmptyDropPlaceholder = memo(function ActiveEmptyDropPlaceholder({
  groupId,
  blocked,
}: {
  groupId: string;
  blocked: boolean;
}) {
  const dragActive = useTaskDragSessionSelector(
    () => isExternalTaskDragActive(),
    (previous, next) => previous === next
  );
  const highlighted = useTaskDragSessionSelector(
    (snapshot) => isSortedColumnDropHighlight(groupId, "active"),
    (previous, next) => previous === next
  );

  if (!dragActive || blocked) return null;

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
});

export const TaskColumnCompletedList = memo(function TaskColumnCompletedList({
  group,
  tasks,
  todayViewDate,
  dragEnabled,
  reorderEnabled,
}: {
  group: TaskGroupWithTasks;
  tasks: Task[];
  todayViewDate: string;
  dragEnabled: boolean;
  reorderEnabled: boolean;
}) {
  const stableTasks = useStableTaskList(tasks);
  const groupId = group.id;

  return (
    <>
      {stableTasks.map((task) => (
        <BoardTaskRow
          key={task.id}
          task={task}
          groupId={groupId}
          zone="completed"
          todayViewDate={todayViewDate}
          dragEnabled={dragEnabled}
          reorderEnabled={reorderEnabled}
        />
      ))}
    </>
  );
});

export const TaskCompletedBody = memo(function TaskCompletedBody({
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
  return (
    <div
      data-task-completed-body
      className={className}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {children}
    </div>
  );
});
