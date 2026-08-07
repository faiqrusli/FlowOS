import type { GrowthAreaWithCounts, Note } from "@/types/notes";

export type SidebarNotesCache = {
  userId: string;
  areas: GrowthAreaWithCounts[];
  notes: Note[];
  fetchedAt: number;
};

let memoryCache: SidebarNotesCache | null = null;

const STORAGE_KEY = "flowos.sidebar-notes.cache";

function readStorageCache(): SidebarNotesCache | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SidebarNotesCache;
    if (!parsed?.userId || !parsed?.notes || !parsed?.areas) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStorageCache(cache: SidebarNotesCache): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore quota errors.
  }
}

export function getSidebarNotesCache(userId: string | null): SidebarNotesCache | null {
  if (!userId) return null;
  const cache = memoryCache ?? readStorageCache();
  if (!cache || cache.userId !== userId) return null;
  memoryCache = cache;
  return cache;
}

export function setSidebarNotesCache(
  userId: string,
  areas: GrowthAreaWithCounts[],
  notes: Note[]
): SidebarNotesCache {
  const cache: SidebarNotesCache = {
    userId,
    areas,
    notes,
    fetchedAt: Date.now(),
  };
  memoryCache = cache;
  writeStorageCache(cache);
  return cache;
}

export function patchSidebarNotesCache(
  userId: string,
  updater: (notes: Note[]) => Note[]
): SidebarNotesCache | null {
  const current = getSidebarNotesCache(userId);
  if (!current) return null;
  return setSidebarNotesCache(userId, current.areas, updater(current.notes));
}

export function upsertSidebarNoteInCache(userId: string, note: Note): void {
  patchSidebarNotesCache(userId, (notes) => {
    const index = notes.findIndex((item) => item.id === note.id);
    if (index === -1) return [note, ...notes];
    const next = [...notes];
    next[index] = note;
    return next;
  });
}

export function removeSidebarNoteFromCache(userId: string, noteId: string): void {
  patchSidebarNotesCache(userId, (notes) => notes.filter((note) => note.id !== noteId));
}

export function clearSidebarNotesCache(): void {
  memoryCache = null;
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors during auth transitions.
  }
}
