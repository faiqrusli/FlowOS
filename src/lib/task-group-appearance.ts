import { isInboxGroup, isLaterGroup, isTodayGroup } from "@/lib/task-groups";
import type { TaskGroup } from "@/types/task";

export type TaskGroupColorKey =
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "emerald"
  | "teal"
  | "amber"
  | "orange"
  | "rose"
  | "slate"
  | "inbox"
  | "later";

export type TaskGroupAppearance = {
  icon: string;
  colorKey: TaskGroupColorKey;
  pillClassName: string;
};

export const DEFAULT_NEW_GROUP_ICON = "📁";

export const TASK_GROUP_COLOR_KEYS: TaskGroupColorKey[] = [
  "sky",
  "blue",
  "indigo",
  "violet",
  "emerald",
  "teal",
  "amber",
  "orange",
  "rose",
  "slate",
];

/** Neutral chip chrome until Task 3 migrates consumers to dot + label. */
const NEUTRAL_PILL_CLASS =
  "border-border/50 bg-muted/30 text-foreground shadow-xs";

const GROUP_DOT_CLASS: Record<TaskGroupColorKey, string> = {
  sky: "size-2 shrink-0 rounded-full bg-chart-1",
  blue: "size-2 shrink-0 rounded-full bg-chart-1",
  indigo: "size-2 shrink-0 rounded-full bg-chart-1",
  violet: "size-2 shrink-0 rounded-full bg-chart-1",
  emerald: "size-2 shrink-0 rounded-full bg-chart-2",
  teal: "size-2 shrink-0 rounded-full bg-chart-2",
  amber: "size-2 shrink-0 rounded-full bg-chart-3",
  orange: "size-2 shrink-0 rounded-full bg-chart-3",
  rose: "size-2 shrink-0 rounded-full bg-chart-4",
  slate: "size-2 shrink-0 rounded-full bg-chart-5",
  inbox: "size-2 shrink-0 rounded-full bg-chart-1",
  later: "size-2 shrink-0 rounded-full bg-chart-3",
};

const GROUP_EDGE_CLASS: Record<TaskGroupColorKey, string> = {
  sky: "border-l-[3px] border-l-chart-1/35",
  blue: "border-l-[3px] border-l-chart-1/35",
  indigo: "border-l-[3px] border-l-chart-1/35",
  violet: "border-l-[3px] border-l-chart-1/35",
  emerald: "border-l-[3px] border-l-chart-2/35",
  teal: "border-l-[3px] border-l-chart-2/35",
  amber: "border-l-[3px] border-l-chart-3/35",
  orange: "border-l-[3px] border-l-chart-3/35",
  rose: "border-l-[3px] border-l-chart-4/35",
  slate: "border-l-[3px] border-l-chart-5/35",
  inbox: "border-l-[3px] border-l-chart-1/35",
  later: "border-l-[3px] border-l-chart-3/35",
};

export function getGroupDotClass(colorKey: TaskGroupColorKey): string {
  return GROUP_DOT_CLASS[colorKey] ?? GROUP_DOT_CLASS.blue;
}

export function getGroupEdgeClass(colorKey: TaskGroupColorKey): string {
  return GROUP_EDGE_CLASS[colorKey] ?? GROUP_EDGE_CLASS.blue;
}

export function getGroupLabelClass(): string {
  return "text-sm font-medium text-foreground";
}

export function getTaskGroupTimelinePillClass(
  colorKey: TaskGroupColorKey
): string {
  void colorKey;
  return NEUTRAL_PILL_CLASS;
}

export const TASK_GROUP_ACCENT_BORDER_CLASS: Record<TaskGroupColorKey, string> =
  GROUP_EDGE_CLASS;

export const TASK_GROUP_COLOR_LABELS: Record<TaskGroupColorKey, string> = {
  sky: "Sky",
  blue: "Blue",
  indigo: "Indigo",
  violet: "Violet",
  emerald: "Emerald",
  teal: "Teal",
  amber: "Amber",
  orange: "Orange",
  rose: "Rose",
  slate: "Slate",
  inbox: "Inbox",
  later: "Later",
};

export const TASK_GROUP_SWATCH_CLASS: Record<TaskGroupColorKey, string> = {
  sky: "bg-chart-1",
  blue: "bg-chart-1",
  indigo: "bg-chart-1",
  violet: "bg-chart-1",
  emerald: "bg-chart-2",
  teal: "bg-chart-2",
  amber: "bg-chart-3",
  orange: "bg-chart-3",
  rose: "bg-chart-4",
  slate: "bg-chart-5",
  inbox: "bg-chart-1",
  later: "bg-chart-3",
};

/**
 * Tasks board column body — Layer 1.5 workspace: slightly above `--background`,
 * below `--card` / Focus hero. Shared for all group colors (accent stays on dots/edges).
 */
export const TASK_GROUP_COLUMN_BODY_CLASS =
  "border-border-board bg-surface-board shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]";

/** Column header strip — barely brighter than column body for scanability. */
export const TASK_GROUP_COLUMN_HEADER_CLASS =
  "border-b border-border-board/80 bg-surface-board-header";

/** @deprecated Prefer TASK_GROUP_COLUMN_BODY_CLASS — kept for colorKey map call sites. */
export const TASK_GROUP_COLUMN_SURFACE_CLASS: Record<TaskGroupColorKey, string> = {
  sky: TASK_GROUP_COLUMN_BODY_CLASS,
  blue: TASK_GROUP_COLUMN_BODY_CLASS,
  indigo: TASK_GROUP_COLUMN_BODY_CLASS,
  violet: TASK_GROUP_COLUMN_BODY_CLASS,
  emerald: TASK_GROUP_COLUMN_BODY_CLASS,
  teal: TASK_GROUP_COLUMN_BODY_CLASS,
  amber: TASK_GROUP_COLUMN_BODY_CLASS,
  orange: TASK_GROUP_COLUMN_BODY_CLASS,
  rose: TASK_GROUP_COLUMN_BODY_CLASS,
  slate: TASK_GROUP_COLUMN_BODY_CLASS,
  inbox: TASK_GROUP_COLUMN_BODY_CLASS,
  later: TASK_GROUP_COLUMN_BODY_CLASS,
};

const SYSTEM_TASK_GROUP_COLOR_KEYS: TaskGroupColorKey[] = ["inbox", "later"];

function isTaskGroupColorKey(value: string | null | undefined): value is TaskGroupColorKey {
  return Boolean(
    value &&
      (TASK_GROUP_COLOR_KEYS.includes(value as TaskGroupColorKey) ||
        SYSTEM_TASK_GROUP_COLOR_KEYS.includes(value as TaskGroupColorKey))
  );
}

const BUILTIN_APPEARANCE: Record<
  string,
  Pick<TaskGroupAppearance, "icon" | "colorKey">
> = {
  today: { icon: "📅", colorKey: "sky" },
  later: { icon: "", colorKey: "later" },
  inbox: { icon: "📥", colorKey: "inbox" },
  "study-cpp": { icon: "📚", colorKey: "blue" },
};

const FALLBACK_ICONS = [
  "📚",
  "💻",
  "🎯",
  "📋",
  "💼",
  "🏠",
  "✨",
  "🔥",
  "📝",
  "🚀",
  "💡",
  "🎨",
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function resolveBuiltinAppearance(
  group: Pick<TaskGroup, "slug" | "title">
): Pick<TaskGroupAppearance, "icon" | "colorKey"> | null {
  if (group.slug && BUILTIN_APPEARANCE[group.slug]) {
    return BUILTIN_APPEARANCE[group.slug];
  }
  if (isTodayGroup(group)) return BUILTIN_APPEARANCE.today;
  if (isLaterGroup(group)) return BUILTIN_APPEARANCE.later;
  if (isInboxGroup(group)) return BUILTIN_APPEARANCE.inbox;
  return null;
}

function resolveHashedAppearance(
  group: Pick<TaskGroup, "id" | "title">
): Pick<TaskGroupAppearance, "icon" | "colorKey"> {
  const hash = hashString(group.id || group.title);
  return {
    icon: FALLBACK_ICONS[hash % FALLBACK_ICONS.length],
    colorKey: TASK_GROUP_COLOR_KEYS[hash % TASK_GROUP_COLOR_KEYS.length],
  };
}

export function pickNextGroupColor(
  groups: Array<
    Pick<TaskGroup, "id" | "slug" | "title"> & {
      icon?: string | null;
      color?: string | null;
    }
  >
): TaskGroupColorKey {
  const usageCount = new Map<TaskGroupColorKey, number>();
  for (const colorKey of TASK_GROUP_COLOR_KEYS) {
    usageCount.set(colorKey, 0);
  }

  for (const group of groups) {
    const { colorKey } = getTaskGroupAppearance(group);
    usageCount.set(colorKey, (usageCount.get(colorKey) ?? 0) + 1);
  }

  let minCount = Infinity;
  for (const count of usageCount.values()) {
    if (count < minCount) minCount = count;
  }

  return (
    TASK_GROUP_COLOR_KEYS.find(
      (colorKey) => usageCount.get(colorKey) === minCount
    ) ?? "blue"
  );
}

export function getDefaultAppearanceForNewGroup(
  title: string
): Pick<TaskGroupAppearance, "icon" | "colorKey"> {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const builtin = slug ? BUILTIN_APPEARANCE[slug] : null;
  if (builtin) return builtin;
  return resolveHashedAppearance({ id: title, title });
}

export function getTaskGroupAppearance(
  group: Pick<TaskGroup, "id" | "slug" | "title"> & {
    icon?: string | null;
    color?: string | null;
  }
): TaskGroupAppearance {
  const builtin = resolveBuiltinAppearance(group);
  const hashed = resolveHashedAppearance(group);
  const icon = group.icon?.trim() || builtin?.icon || hashed.icon;
  const isSystemGroup =
    isTodayGroup(group) || isLaterGroup(group) || isInboxGroup(group);
  const colorKey =
    isSystemGroup && builtin
      ? builtin.colorKey
      : isTaskGroupColorKey(group.color)
        ? group.color
        : builtin?.colorKey || hashed.colorKey;

  return {
    icon,
    colorKey,
    pillClassName: NEUTRAL_PILL_CLASS,
  };
}
