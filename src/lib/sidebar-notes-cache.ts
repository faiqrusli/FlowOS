import type { GrowthAreaWithCounts, Note } from "@/types/notes";

export type SidebarNotesCache = {
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
    if (!parsed?.notes || !parsed?.areas) return null;
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

export function getSidebarNotesCache(): SidebarNotesCache | null {
  return memoryCache ?? readStorageCache();
}

export function setSidebarNotesCache(
  areas: GrowthAreaWithCounts[],
  notes: Note[]
): SidebarNotesCache {
  const cache: SidebarNotesCache = {
    areas,
    notes,
    fetchedAt: Date.now(),
  };
  memoryCache = cache;
  writeStorageCache(cache);
  return cache;
}

export function patchSidebarNotesCache(
  updater: (notes: Note[]) => Note[]
): SidebarNotesCache | null {
  const current = getSidebarNotesCache();
  if (!current) return null;
  return setSidebarNotesCache(current.areas, updater(current.notes));
}

export function upsertSidebarNoteInCache(note: Note): void {
  patchSidebarNotesCache((notes) => {
    const index = notes.findIndex((item) => item.id === note.id);
    if (index === -1) return [note, ...notes];
    const next = [...notes];
    next[index] = note;
    return next;
  });
}

export function removeSidebarNoteFromCache(noteId: string): void {
  patchSidebarNotesCache((notes) => notes.filter((note) => note.id !== noteId));
}
