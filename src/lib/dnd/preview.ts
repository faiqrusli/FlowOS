import type { TaskDragTarget } from "@/lib/task-drag-utils";

export function isColumnActiveDropTarget(
  dropTarget: TaskDragTarget | null,
  groupId: string
): boolean {
  return dropTarget?.groupId === groupId && dropTarget.zone === "active";
}
