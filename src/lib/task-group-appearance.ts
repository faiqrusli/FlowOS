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

const PILL_CLASS_BY_COLOR: Record<TaskGroupColorKey, string> = {
  sky: "bg-sky-600/92 text-white shadow-sm",
  blue: "bg-blue-600/92 text-white shadow-sm",
  indigo: "bg-indigo-600/92 text-white shadow-sm",
  violet: "bg-violet-600/92 text-white shadow-sm",
  emerald: "bg-emerald-700/92 text-white shadow-sm",
  teal: "bg-teal-600/92 text-white shadow-sm",
  amber: "bg-amber-600/92 text-white shadow-sm",
  orange: "bg-orange-600/92 text-white shadow-sm",
  rose: "bg-rose-600/92 text-white shadow-sm",
  slate: "bg-slate-600/92 text-white shadow-sm",
  inbox: "bg-[#C4B5E8] text-[#443A5C] shadow-sm border border-[#B0A0DC]/50",
  later: "bg-[#E5D5BC] text-[#5A4632] shadow-sm border border-[#D4C4A8]/60",
};

const TIMELINE_PILL_CLASS_BY_COLOR: Record<TaskGroupColorKey, string> = {
  sky: "border border-sky-500/20 bg-sky-500/10 text-sky-900",
  blue: "border border-blue-500/20 bg-blue-500/10 text-blue-900",
  indigo: "border border-indigo-500/20 bg-indigo-500/10 text-indigo-900",
  violet: "border border-violet-500/20 bg-violet-500/10 text-violet-900",
  emerald: "border border-emerald-500/20 bg-emerald-500/10 text-emerald-900",
  teal: "border border-teal-500/20 bg-teal-500/10 text-teal-900",
  amber: "border border-amber-500/20 bg-amber-500/10 text-amber-900",
  orange: "border border-orange-500/20 bg-orange-500/10 text-orange-900",
  rose: "border border-rose-500/20 bg-rose-500/10 text-rose-900",
  slate: "border border-slate-500/20 bg-slate-500/10 text-slate-800",
  inbox: "border border-[#E4DDF0]/40 bg-[#FAF8FF] text-[#443A5C]",
  later: "border border-[#E8D8BC]/45 bg-[#FFF8ED] text-[#5C4830]",
};

export function getTaskGroupTimelinePillClass(
  colorKey: TaskGroupColorKey
): string {
  return TIMELINE_PILL_CLASS_BY_COLOR[colorKey] ?? TIMELINE_PILL_CLASS_BY_COLOR.blue;
}

export const TASK_GROUP_ACCENT_BORDER_CLASS: Record<TaskGroupColorKey, string> = {
  sky: "border-l-sky-400",
  blue: "border-l-blue-400",
  indigo: "border-l-indigo-400",
  violet: "border-l-violet-400",
  emerald: "border-l-emerald-500",
  teal: "border-l-teal-400",
  amber: "border-l-amber-400",
  orange: "border-l-orange-400",
  rose: "border-l-rose-400",
  slate: "border-l-slate-400",
  inbox: "border-l-[#9B8AD4]",
  later: "border-l-[#C9B896]",
};

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
  sky: "bg-sky-600",
  blue: "bg-blue-600",
  indigo: "bg-indigo-600",
  violet: "bg-violet-600",
  emerald: "bg-emerald-700",
  teal: "bg-teal-600",
  amber: "bg-amber-600",
  orange: "bg-orange-600",
  rose: "bg-rose-600",
  slate: "bg-slate-600",
  inbox: "bg-[#9B8AD4]",
  later: "bg-[#C9B896]",
};

export const TASK_GROUP_COLUMN_SURFACE_CLASS: Record<TaskGroupColorKey, string> = {
  sky: "border-sky-500/[0.12] bg-gradient-to-b from-sky-500/[0.04] to-muted/15",
  blue: "border-blue-500/[0.12] bg-gradient-to-b from-blue-500/[0.04] to-muted/15",
  indigo: "border-indigo-500/[0.12] bg-gradient-to-b from-indigo-500/[0.04] to-muted/15",
  violet: "border-violet-500/[0.12] bg-gradient-to-b from-violet-500/[0.04] to-muted/15",
  emerald: "border-emerald-500/[0.12] bg-gradient-to-b from-emerald-500/[0.04] to-muted/15",
  teal: "border-teal-500/[0.12] bg-gradient-to-b from-teal-500/[0.04] to-muted/15",
  amber: "border-amber-500/[0.12] bg-gradient-to-b from-amber-500/[0.04] to-muted/15",
  orange: "border-orange-500/[0.12] bg-gradient-to-b from-orange-500/[0.04] to-muted/15",
  rose: "border-rose-500/[0.12] bg-gradient-to-b from-rose-500/[0.04] to-muted/15",
  slate: "border-slate-500/[0.12] bg-gradient-to-b from-slate-500/[0.04] to-muted/15",
  inbox: "border-violet-400/[0.12] bg-gradient-to-b from-violet-400/[0.04] to-muted/15",
  later: "border-amber-400/[0.12] bg-gradient-to-b from-amber-400/[0.04] to-muted/15",
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
    pillClassName: PILL_CLASS_BY_COLOR[colorKey] ?? PILL_CLASS_BY_COLOR.blue,
  };
}
