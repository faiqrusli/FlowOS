"use client";

import { DragOverlay } from "@dnd-kit/core";
import { memo } from "react";
import { TaskDragOverlayCard } from "@/components/tasks/task-drag-overlay-card";
import { getTaskDragOverlaySnapshot } from "@/lib/dnd/overlay-snapshot";
import { taskDragOverlayModifiers } from "@/lib/dnd/modifiers";
import { useTaskDragSessionSelector } from "@/lib/use-task-drag-session-selector";

const OverlayBody = memo(function OverlayBody() {
  const snapshot = getTaskDragOverlaySnapshot();
  if (!snapshot) return null;

  return (
    <div className="pointer-events-none w-[300px] origin-center cursor-grabbing">
      <TaskDragOverlayCard task={snapshot.task} />
    </div>
  );
});

/** Lightweight overlay — frozen snapshot, no board subscriptions beyond drag id. */
export function TaskDragOverlay() {
  const activeTaskId = useTaskDragSessionSelector(
    (snapshot) => snapshot.draggingTaskId,
    (previous, next) => previous === next
  );

  return (
    <DragOverlay dropAnimation={null} modifiers={taskDragOverlayModifiers} zIndex={1000}>
      {activeTaskId ? <OverlayBody /> : null}
    </DragOverlay>
  );
}
