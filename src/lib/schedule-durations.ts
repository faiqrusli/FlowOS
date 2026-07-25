import { normalizeTaskPriority, type TaskPriority } from "@/lib/task-priority";
import { clampHabitDuration } from "@/lib/habit-duration";
import { readStorageJson, writeStorageJson } from "@/lib/safe-storage";

const STORAGE_KEY = "flowos.schedule.durations";

const DEFAULT_BY_PRIORITY: Record<TaskPriority, number> = {
  high: 60,
  medium: 45,
  low: 30,
};

const HABIT_DEFAULT = 15;
const DURATION_CHANGED_EVENT = "flowos:duration-changed";

function loadMap(): Record<string, number> {
  return readStorageJson<Record<string, number>>(STORAGE_KEY, {});
}

function saveMap(map: Record<string, number>) {
  writeStorageJson(STORAGE_KEY, map);
}

export function durationKey(type: "task" | "habit", entityId: string): string {
  return `${type}:${entityId}`;
}

export function getTaskDurationMinutes(
  taskId: string,
  priority?: TaskPriority | null
): number {
  const map = loadMap();
  const stored = map[durationKey("task", taskId)];
  if (stored) return stored;
  return DEFAULT_BY_PRIORITY[normalizeTaskPriority(priority ?? undefined)];
}

export function getHabitDurationMinutes(habitId: string): number {
  const map = loadMap();
  return map[durationKey("habit", habitId)] ?? HABIT_DEFAULT;
}

export function setItemDurationMinutes(
  type: "task" | "habit",
  entityId: string,
  minutes: number
): void {
  const map = loadMap();
  map[durationKey(type, entityId)] =
    type === "habit"
      ? clampHabitDuration(minutes)
      : Math.max(15, Math.min(240, minutes));
  saveMap(map);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(DURATION_CHANGED_EVENT, {
        detail: { type, entityId, minutes: map[durationKey(type, entityId)] },
      })
    );
  }
}

export function onDurationChanged(listener: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  const handler = () => listener();
  window.addEventListener(DURATION_CHANGED_EVENT, handler);
  return () => window.removeEventListener(DURATION_CHANGED_EVENT, handler);
}
