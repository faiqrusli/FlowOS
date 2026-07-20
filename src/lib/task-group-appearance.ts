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
  /** Empty string = color-only identity (no icon badge). */
  icon: string;
  colorKey: TaskGroupColorKey;
  pillClassName: string;
};

/** @deprecated New groups default to no icon (`null` / `""`). */
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
  "border-border-subtle/60 bg-surface-raised text-foreground shadow-xs";

const GROUP_DOT_CLASS: Record<TaskGroupColorKey, string> = {
  sky: "size-2 shrink-0 rounded-full bg-group-sky",
  blue: "size-2 shrink-0 rounded-full bg-group-blue",
  indigo: "size-2 shrink-0 rounded-full bg-group-indigo",
  violet: "size-2 shrink-0 rounded-full bg-group-violet",
  emerald: "size-2 shrink-0 rounded-full bg-group-emerald",
  teal: "size-2 shrink-0 rounded-full bg-group-teal",
  amber: "size-2 shrink-0 rounded-full bg-group-amber",
  orange: "size-2 shrink-0 rounded-full bg-group-orange",
  rose: "size-2 shrink-0 rounded-full bg-group-rose",
  slate: "size-2 shrink-0 rounded-full bg-group-slate",
  inbox: "size-2 shrink-0 rounded-full bg-group-blue",
  later: "size-2 shrink-0 rounded-full bg-group-amber",
};

const GROUP_EDGE_CLASS: Record<TaskGroupColorKey, string> = {
  sky: "border-l-[3px] border-l-group-sky/70",
  blue: "border-l-[3px] border-l-group-blue/70",
  indigo: "border-l-[3px] border-l-group-indigo/70",
  violet: "border-l-[3px] border-l-group-violet/70",
  emerald: "border-l-[3px] border-l-group-emerald/70",
  teal: "border-l-[3px] border-l-group-teal/70",
  amber: "border-l-[3px] border-l-group-amber/70",
  orange: "border-l-[3px] border-l-group-orange/70",
  rose: "border-l-[3px] border-l-group-rose/70",
  slate: "border-l-[3px] border-l-group-slate/70",
  inbox: "border-l-[3px] border-l-group-blue/70",
  later: "border-l-[3px] border-l-group-amber/70",
};

export function getGroupDotClass(colorKey: TaskGroupColorKey): string {
  return GROUP_DOT_CLASS[colorKey] ?? GROUP_DOT_CLASS.blue;
}

export function getGroupEdgeClass(colorKey: TaskGroupColorKey): string {
  return GROUP_EDGE_CLASS[colorKey] ?? GROUP_EDGE_CLASS.blue;
}

/** CSS color for the group left edge — used when breathing the in-focus accent. */
export function getGroupEdgeColorVar(colorKey: TaskGroupColorKey): string {
  switch (colorKey) {
    case "sky":
      return "var(--group-sky)";
    case "indigo":
      return "var(--group-indigo)";
    case "violet":
      return "var(--group-violet)";
    case "emerald":
      return "var(--group-emerald)";
    case "teal":
      return "var(--group-teal)";
    case "amber":
    case "later":
      return "var(--group-amber)";
    case "orange":
      return "var(--group-orange)";
    case "rose":
      return "var(--group-rose)";
    case "slate":
      return "var(--group-slate)";
    case "blue":
    case "inbox":
    default:
      return "var(--group-blue)";
  }
}

export function getGroupLabelClass(): string {
  return "text-sm font-medium text-foreground";
}

export function getTaskGroupTimelinePillClass(
  colorKey: TaskGroupColorKey,
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
  sky: "bg-group-sky",
  blue: "bg-group-blue",
  indigo: "bg-group-indigo",
  violet: "bg-group-violet",
  emerald: "bg-group-emerald",
  teal: "bg-group-teal",
  amber: "bg-group-amber",
  orange: "bg-group-orange",
  rose: "bg-group-rose",
  slate: "bg-group-slate",
  inbox: "bg-group-blue",
  later: "bg-group-amber",
};

/**
 * Tasks board column body — no fill; sits on canvas.
 * Quiet chrome hairline (same family as nav rails / Notes columns).
 */
export const TASK_GROUP_COLUMN_BODY_CLASS = "flow-border-hairline";

/** Column header — persistent work surface (surface-base). */
export const TASK_GROUP_COLUMN_HEADER_CLASS =
  "flow-border-hairline-b bg-surface-base";

/** @deprecated Prefer TASK_GROUP_COLUMN_BODY_CLASS — kept for colorKey map call sites. */
export const TASK_GROUP_COLUMN_SURFACE_CLASS: Record<
  TaskGroupColorKey,
  string
> = {
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

function isTaskGroupColorKey(
  value: string | null | undefined,
): value is TaskGroupColorKey {
  return Boolean(
    value &&
    (TASK_GROUP_COLOR_KEYS.includes(value as TaskGroupColorKey) ||
      SYSTEM_TASK_GROUP_COLOR_KEYS.includes(value as TaskGroupColorKey)),
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

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function resolveBuiltinAppearance(
  group: Pick<TaskGroup, "slug" | "title">,
): Pick<TaskGroupAppearance, "icon" | "colorKey"> | null {
  if (group.slug && BUILTIN_APPEARANCE[group.slug]) {
    return BUILTIN_APPEARANCE[group.slug];
  }
  if (isTodayGroup(group)) return BUILTIN_APPEARANCE.today;
  if (isLaterGroup(group)) return BUILTIN_APPEARANCE.later;
  if (isInboxGroup(group)) return BUILTIN_APPEARANCE.inbox;
  return null;
}

/** Stable color when a group has no stored color — never invents an icon. */
function resolveHashedColorKey(
  group: Pick<TaskGroup, "id" | "title">,
): TaskGroupColorKey {
  const hash = hashString(group.id || group.title);
  return TASK_GROUP_COLOR_KEYS[hash % TASK_GROUP_COLOR_KEYS.length];
}

export function hasTaskGroupIcon(icon: string | null | undefined): boolean {
  return Boolean(icon?.trim());
}

/** Random palette color for new groups (color is always required). */
export function pickRandomGroupColor(): TaskGroupColorKey {
  const index = Math.floor(Math.random() * TASK_GROUP_COLOR_KEYS.length);
  return TASK_GROUP_COLOR_KEYS[index] ?? "blue";
}

/** Prefer least-used color — kept for callers that want balance over random. */
export function pickNextGroupColor(
  groups: Array<
    Pick<TaskGroup, "id" | "slug" | "title"> & {
      icon?: string | null;
      color?: string | null;
    }
  >,
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
      (colorKey) => usageCount.get(colorKey) === minCount,
    ) ?? "blue"
  );
}

export function getDefaultAppearanceForNewGroup(
  title: string,
): Pick<TaskGroupAppearance, "icon" | "colorKey"> {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const builtin = slug ? BUILTIN_APPEARANCE[slug] : null;
  if (builtin) return { icon: builtin.icon, colorKey: builtin.colorKey };
  return { icon: "", colorKey: pickRandomGroupColor() };
}

export function getTaskGroupAppearance(
  group: Pick<TaskGroup, "id" | "slug" | "title"> & {
    icon?: string | null;
    color?: string | null;
  },
): TaskGroupAppearance {
  const builtin = resolveBuiltinAppearance(group);
  const isSystemGroup =
    isTodayGroup(group) || isLaterGroup(group) || isInboxGroup(group);
  // Stored icon only — empty means color-only (no invented fallbacks).
  const icon = group.icon?.trim() || "";
  const colorKey =
    isSystemGroup && builtin
      ? builtin.colorKey
      : isTaskGroupColorKey(group.color)
        ? group.color
        : builtin?.colorKey || resolveHashedColorKey(group);

  return {
    icon,
    colorKey,
    pillClassName: NEUTRAL_PILL_CLASS,
  };
}
