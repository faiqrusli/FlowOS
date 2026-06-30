"use client";

import { type ReactNode } from "react";
import {
  clearDragPreview,
  setDragPreviewActiveTaskId,
  setDragPreviewDropTarget,
  useDragPreviewActiveTaskId,
  useDragPreviewDropTarget,
} from "@/lib/dnd/preview-store";

export type TaskBoardDragPreviewValue = {
  activeTaskId: string | null;
  dropTarget: ReturnType<typeof useDragPreviewDropTarget>;
  setActiveTaskId: typeof setDragPreviewActiveTaskId;
  setDropTarget: typeof setDragPreviewDropTarget;
  clearPreview: typeof clearDragPreview;
};

/** Drag preview state lives in an external store to avoid board-wide re-renders. */
export function TaskBoardDragPreviewProvider({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}

export function useTaskBoardDragPreview(): TaskBoardDragPreviewValue {
  const activeTaskId = useDragPreviewActiveTaskId();
  const dropTarget = useDragPreviewDropTarget();

  return {
    activeTaskId,
    dropTarget,
    setActiveTaskId: setDragPreviewActiveTaskId,
    setDropTarget: setDragPreviewDropTarget,
    clearPreview: clearDragPreview,
  };
}

export { useColumnDragPreviewDropTarget } from "@/lib/dnd/preview-store";
