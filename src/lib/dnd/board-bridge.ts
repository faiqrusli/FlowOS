import type {
  DragCancelEvent,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import type { Task, TaskGroupWithTasks } from "@/types/task";

export type TaskBoardOverlayContext = {
  groups: TaskGroupWithTasks[];
  todayViewDate: string;
  selectedTaskId: string | null;
};

export type TaskBoardDndBridge = {
  onDragStart: (event: DragStartEvent) => void;
  onDragMove: (event: DragMoveEvent) => void;
  onDragOver: (event: DragOverEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onDragCancel: (event: DragCancelEvent) => void;
  findTask: (taskId: string) => Task | null;
  getOverlayContext: () => TaskBoardOverlayContext;
};

let bridge: TaskBoardDndBridge | null = null;

export function setTaskBoardDndBridge(next: TaskBoardDndBridge | null) {
  bridge = next;
}

export function getTaskBoardDndBridge(): TaskBoardDndBridge | null {
  return bridge;
}
