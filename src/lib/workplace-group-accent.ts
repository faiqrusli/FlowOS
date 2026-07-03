import {
  getGroupEdgeClass,
  type TaskGroupColorKey,
} from "@/lib/task-group-appearance";

export function getWorkplaceGroupAccentClass(
  colorKey: TaskGroupColorKey
): string {
  return getGroupEdgeClass(colorKey);
}
