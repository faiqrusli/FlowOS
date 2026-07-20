const STORAGE_KEY = "flowos.schedule-reminders.delivered";

function loadDelivered(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function saveDelivered(ids: Set<string>) {
  if (typeof window === "undefined") return;
  // Keep the set bounded — drop entries older than ~14 days of keys if huge.
  const list = [...ids];
  const trimmed = list.length > 500 ? list.slice(list.length - 500) : list;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
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
