import { readStorageJson, writeStorageJson } from "@/lib/safe-storage";

const STORAGE_KEY = "flowos.schedule.notifications";

function loadMap(): Record<string, boolean> {
  return readStorageJson<Record<string, boolean>>(STORAGE_KEY, {});
}

function saveMap(map: Record<string, boolean>) {
  writeStorageJson(STORAGE_KEY, map);
}

export function scheduleNotificationKey(
  type: "task" | "habit",
  entityId: string
): string {
  return `${type}:${entityId}`;
}

export function getScheduleNotificationEnabled(key: string): boolean {
  const map = loadMap();
  return map[key] ?? true;
}

export function setScheduleNotificationEnabled(
  key: string,
  enabled: boolean
): void {
  const map = loadMap();
  map[key] = enabled;
  saveMap(map);
}
