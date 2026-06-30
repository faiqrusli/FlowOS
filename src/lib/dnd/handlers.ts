import type {
  DragCancelEvent,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { getTaskBoardDndBridge } from "@/lib/dnd/board-bridge";
import { isTaskDragData } from "@/lib/dnd/drag-utils";

export function handleTaskDndDragStart(event: DragStartEvent) {
  if (!isTaskDragData(event.active.data.current)) return;
  getTaskBoardDndBridge()?.onDragStart(event);
}

export function handleTaskDndDragMove(event: DragMoveEvent) {
  if (!isTaskDragData(event.active.data.current)) return;
  getTaskBoardDndBridge()?.onDragMove(event);
}

export function handleTaskDndDragOver(event: DragOverEvent) {
  if (!isTaskDragData(event.active.data.current)) return;
  getTaskBoardDndBridge()?.onDragOver(event);
}

export function handleTaskDndDragEnd(event: DragEndEvent) {
  if (!isTaskDragData(event.active.data.current)) return;
  getTaskBoardDndBridge()?.onDragEnd(event);
}

export function handleTaskDndDragCancel(event: DragCancelEvent) {
  if (!isTaskDragData(event.active.data.current)) return;
  getTaskBoardDndBridge()?.onDragCancel(event);
}
