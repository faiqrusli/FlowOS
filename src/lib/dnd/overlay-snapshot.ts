import type { Task, TaskGroupWithTasks } from "@/types/task";

export type TaskDragOverlaySnapshot = {
  taskId: string;
  groupId: string;
  zone: "active" | "completed";
  task: Task;
  groups: TaskGroupWithTasks[];
  todayViewDate: string;
  selectedTaskId: string | null;
};

let snapshot: TaskDragOverlaySnapshot | null = null;

export function setTaskDragOverlaySnapshot(next: TaskDragOverlaySnapshot | null) {
  snapshot = next;
}

export function getTaskDragOverlaySnapshot(): TaskDragOverlaySnapshot | null {
  return snapshot;
}
