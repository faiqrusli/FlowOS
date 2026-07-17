import {
  getGroupEdgeClass,
  getGroupEdgeColorVar,
  type TaskGroupColorKey,
} from "@/lib/task-group-appearance";

export function getWorkplaceGroupAccentClass(
  colorKey: TaskGroupColorKey
): string {
  return getGroupEdgeClass(colorKey);
}

export function getWorkplaceGroupAccentColorVar(
  colorKey: TaskGroupColorKey
): string {
  return getGroupEdgeColorVar(colorKey);
}
