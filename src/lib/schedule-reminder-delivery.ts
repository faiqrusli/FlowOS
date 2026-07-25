import { readStorageJson, writeStorageJson } from "@/lib/safe-storage";

const STORAGE_KEY = "flowos.schedule-reminders.delivered";

function loadDelivered(): Set<string> {
  const parsed = readStorageJson<string[] | null>(STORAGE_KEY, null);
  return new Set(Array.isArray(parsed) ? parsed : []);
}

function saveDelivered(ids: Set<string>) {
  // Keep the set bounded — drop entries older than ~14 days of keys if huge.
  const list = [...ids];
  const trimmed = list.length > 500 ? list.slice(list.length - 500) : list;
  writeStorageJson(STORAGE_KEY, trimmed);
}

export function isScheduleReminderDelivered(eventId: string): boolean {
  return loadDelivered().has(eventId);
}

/** Returns true if this call marked the event (first delivery). */
export function markScheduleReminderDelivered(eventId: string): boolean {
  const set = loadDelivered();
  if (set.has(eventId)) return false;
  set.add(eventId);
  saveDelivered(set);
  return true;
}
