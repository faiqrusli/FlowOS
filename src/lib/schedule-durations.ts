import { normalizeTaskPriority, type TaskPriority } from "@/lib/task-priority";

const STORAGE_KEY = "flowos.schedule.durations";

const DEFAULT_BY_PRIORITY: Record<TaskPriority, number> = {
  high: 60,
  medium: 45,
  low: 30,
};

const HABIT_DEFAULT = 15;

function loadMap(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

function saveMap(map: Record<string, number>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
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
  map[durationKey(type, entityId)] = Math.max(15, Math.min(240, minutes));
  saveMap(map);
}
