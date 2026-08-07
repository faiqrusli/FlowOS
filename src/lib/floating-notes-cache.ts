import type { Note } from "@/types/notes";

export type FloatingNotesCache = {
  userId: string;
  notes: Note[];
};

const STORAGE_KEY = "flowos.floating-notes";

export function getFloatingNotesCache(userId: string | null): Note[] {
  if (!userId || typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FloatingNotesCache;
    return parsed?.userId === userId && Array.isArray(parsed.notes)
      ? parsed.notes
      : [];
  } catch {
    return [];
  }
}

export function setFloatingNotesCache(userId: string, notes: Note[]): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ userId, notes } satisfies FloatingNotesCache),
    );
  } catch {
    // Ignore storage errors; the in-memory state remains usable.
  }
}

export function clearFloatingNotesCache(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors during auth transitions.
  }
}
