"use client";

import { type ReactNode } from "react";
import { DndContext, MeasuringStrategy } from "@dnd-kit/core";
import { taskCollisionDetection } from "@/lib/dnd/collision";
import { TaskDragOverlay } from "@/lib/dnd/drag-overlay";
import {
  handleTaskDndDragCancel,
  handleTaskDndDragEnd,
  handleTaskDndDragMove,
  handleTaskDndDragOver,
  handleTaskDndDragStart,
} from "@/lib/dnd/handlers";
import { useTaskDndSensors } from "@/lib/dnd/sensors";
import { isQuickScheduleOpen } from "@/lib/timeline-drag";

const TASKS_BOARD_SCROLL_CLASS = "tasks-board-scroll";

function canAutoScrollElement(element: Element): boolean {
  if (!isQuickScheduleOpen()) return true;
  return !element.closest(`.${TASKS_BOARD_SCROLL_CLASS}`);
}

export type TaskDndContextProps = {
  children: ReactNode;
};

/** Tasks board DndContext — owns task drag lifecycle, preview, and overlay. */
export function TaskDndContext({ children }: TaskDndContextProps) {
  const sensors = useTaskDndSensors();

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={taskCollisionDetection}
      measuring={{
        droppable: { strategy: MeasuringStrategy.BeforeDragging },
      }}
      autoScroll={{ canScroll: canAutoScrollElement }}
      onDragStart={handleTaskDndDragStart}
      onDragMove={handleTaskDndDragMove}
      onDragOver={handleTaskDndDragOver}
      onDragEnd={handleTaskDndDragEnd}
      onDragCancel={handleTaskDndDragCancel}
    >
      {children}
      <TaskDragOverlay />
    </DndContext>
  );
}
