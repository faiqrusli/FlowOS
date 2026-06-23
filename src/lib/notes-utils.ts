export const CARD_COLOR_CLASSES: Record<
  string,
  { dot: string; bg: string; border: string }
> = {
  rose: {
    dot: "bg-rose-500",
    bg: "bg-rose-50/80 dark:bg-rose-950/30",
    border: "border-rose-200/70 dark:border-rose-800/40",
  },
  amber: {
    dot: "bg-amber-400",
    bg: "bg-amber-50/80 dark:bg-amber-950/30",
    border: "border-amber-200/70 dark:border-amber-800/40",
  },
  emerald: {
    dot: "bg-emerald-500",
    bg: "bg-emerald-50/80 dark:bg-emerald-950/30",
    border: "border-emerald-200/70 dark:border-emerald-800/40",
  },
  sky: {
    dot: "bg-sky-500",
    bg: "bg-sky-50/80 dark:bg-sky-950/30",
    border: "border-sky-200/70 dark:border-sky-800/40",
  },
  violet: {
    dot: "bg-violet-500",
    bg: "bg-violet-50/80 dark:bg-violet-950/30",
    border: "border-violet-200/70 dark:border-violet-800/40",
  },
  slate: {
    dot: "bg-slate-400",
    bg: "bg-slate-50/80 dark:bg-slate-900/30",
    border: "border-slate-200/70 dark:border-slate-700/40",
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

export function formatLastUpdatedLabel(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
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

  if (dayDiff === 0) return "Last updated today";
  if (dayDiff === 1) return "Last updated yesterday";
  return `Last updated ${formatRelativeTime(iso)}`;
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
