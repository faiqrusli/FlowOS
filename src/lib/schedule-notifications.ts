const STORAGE_KEY = "flowos.schedule.notifications";

function loadMap(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

function saveMap(map: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
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
