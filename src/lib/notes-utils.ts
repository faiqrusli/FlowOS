import type { Note } from "@/types/notes";

export const MINDSET_GROWTH_AREA_NAME = "Mindset";

export function resolveNewNoteTitle(
  existingTitles: string[],
  areaName: string,
  baseTitle = "Untitled"
): string {
  if (areaName !== MINDSET_GROWTH_AREA_NAME) {
    return baseTitle;
  }

  const titles = new Set(existingTitles.map((title) => title.trim()));
  if (!titles.has(baseTitle)) return baseTitle;

  let index = 1;
  while (titles.has(`${baseTitle} ${index}`)) {
    index += 1;
  }

  return `${baseTitle} ${index}`;
}

export const CARD_COLOR_CLASSES: Record<
  string,
  { dot: string; bg: string; border: string }
> = {
  rose: {
    dot: "bg-rose-500",
    bg: "bg-surface-raised",
    border: "border-border-subtle",
  },
  amber: {
    dot: "bg-amber-400",
    bg: "bg-surface-raised",
    border: "border-border-subtle",
  },
  emerald: {
    dot: "bg-emerald-500",
    bg: "bg-surface-raised",
    border: "border-border-subtle",
  },
  sky: {
    dot: "bg-sky-500",
    bg: "bg-surface-raised",
    border: "border-border-subtle",
  },
  violet: {
    dot: "bg-violet-500",
    bg: "bg-surface-raised",
    border: "border-border-subtle",
  },
  slate: {
    dot: "bg-slate-400",
    bg: "bg-surface-raised",
    border: "border-border-subtle",
  },
};

export function getCardColorClasses(color: string) {
  return CARD_COLOR_CLASSES[color] ?? CARD_COLOR_CLASSES.slate;
}

export function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function formatNoteListTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const dayDiff = Math.floor(
    (startOfToday.getTime() - startOfDate.getTime()) / 86_400_000
  );

  if (dayDiff === 0) {
    return `${Math.floor(diffMins / 60)}h`;
  }

  if (dayDiff === 1) return "Yesterday";

  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function sortNotesForList(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
    return b.updated_at.localeCompare(a.updated_at);
  });
}

export function insertNewNoteInList(notes: Note[], created: Note): Note[] {
  const pinned = notes.filter((note) => note.is_pinned);
  const unpinned = notes.filter((note) => !note.is_pinned);
  return sortNotesForList([...pinned, created, ...unpinned]);
}

export function getLatestTimestamp(timestamps: string[]): string | null {
  if (timestamps.length === 0) return null;
  return timestamps.reduce((latest, current) =>
    current > latest ? current : latest
  );
}

export function insertMarkdown(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  before: string,
  after = "",
  placeholder = "text"
): { next: string; cursor: number } {
  const selected = value.slice(selectionStart, selectionEnd) || placeholder;
  const next =
    value.slice(0, selectionStart) +
    before +
    selected +
    after +
    value.slice(selectionEnd);
  const cursor = selectionStart + before.length + selected.length + after.length;
  return { next, cursor };
}

export function wrapLines(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  prefix: string
): { next: string; cursor: number } {
  const selected = value.slice(selectionStart, selectionEnd);
  const lines = (selected || "item").split("\n");
  const wrapped = lines.map((line) => `${prefix}${line}`).join("\n");
  const next =
    value.slice(0, selectionStart) + wrapped + value.slice(selectionEnd);
  return { next, cursor: selectionStart + wrapped.length };
}
