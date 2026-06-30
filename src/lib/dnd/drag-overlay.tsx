"use client";

import { DragOverlay, useDndContext } from "@dnd-kit/core";
import { TaskRow } from "@/components/tasks/task-row";
import { getTaskBoardDndBridge } from "@/lib/dnd/board-bridge";
import { isTaskDragData } from "@/lib/dnd/drag-utils";
import { taskDragOverlayModifiers } from "@/lib/dnd/modifiers";
import { cn } from "@/lib/utils";

export function TaskDragOverlay() {
  const { active } = useDndContext();
  const data = active?.data.current;
  const bridge = getTaskBoardDndBridge();

  if (!active || !isTaskDragData(data) || !bridge) {
    return <DragOverlay dropAnimation={null} modifiers={taskDragOverlayModifiers} />;
  }

  const task = bridge.findTask(data.taskId);
  const overlayContext = bridge.getOverlayContext();

  if (!task || !overlayContext) {
    return <DragOverlay dropAnimation={null} modifiers={taskDragOverlayModifiers} />;
  }

  return (
    <DragOverlay
      dropAnimation={null}
      modifiers={taskDragOverlayModifiers}
      zIndex={1000}
    >
      <div
        className={cn(
          "pointer-events-none w-[300px] origin-center cursor-grabbing rounded-md bg-background/55 opacity-55 shadow-lg ring-1 ring-border/30 backdrop-blur-[1px]"
        )}
      >
        <TaskRow
          task={task}
          groupId={data.groupId}
          zone={data.zone}
          groups={overlayContext.groups}
          todayViewDate={overlayContext.todayViewDate}
          isSelected={overlayContext.selectedTaskId === task.id}
          dragEnabled={false}
          overlay
          onToggleComplete={() => {}}
          onOpenDetail={() => {}}
          onDuplicate={() => {}}
          onMoveToGroup={() => {}}
          onDelete={() => {}}
          onUpdate={() => {}}
        />
      </div>
    </DragOverlay>
  );
}
