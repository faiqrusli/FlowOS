import type { TaskPriority } from "@/lib/task-priority";
import type { ScheduleItemType } from "@/types/schedule";

export type ChannelStyle = {
  accent: string;
  bg: string;
  border: string;
  text: string;
  hover: string;
  projection: string;
};

const NEUTRAL_BLOCK_BG = "timeline-event-surface";
const NEUTRAL_BLOCK_BORDER = "border-transparent";
const NEUTRAL_BLOCK_TEXT = "text-foreground";
/** Hover fill lives on `.timeline-event-surface:hover` — keep empty to avoid transition flashes. */
const NEUTRAL_BLOCK_HOVER = "";
const NEUTRAL_PROJECTION =
  "border border-dashed border-border-subtle/70 bg-surface-raised";

/**
 * Selected / current block fill — Surface 7 + primary wash so it reads
 * apart from hover. Shared by Schedule, Quick Schedule, and Today timeline.
 * Do not set border-0 here — it would wipe the group left accent edge.
 */
export const SCHEDULE_BLOCK_CURRENT_CLASS =
  "timeline-event-surface timeline-event-selected";

export const PRIORITY_CHANNEL: Record<TaskPriority, ChannelStyle> = {
  high: {
    accent: "bg-destructive",
    bg: NEUTRAL_BLOCK_BG,
    border: `${NEUTRAL_BLOCK_BORDER} border-l-2 border-l-destructive/35`,
    text: NEUTRAL_BLOCK_TEXT,
    hover: NEUTRAL_BLOCK_HOVER,
    projection: NEUTRAL_PROJECTION,
  },
  medium: {
    accent: "bg-warning",
    bg: NEUTRAL_BLOCK_BG,
    border: NEUTRAL_BLOCK_BORDER,
    text: NEUTRAL_BLOCK_TEXT,
    hover: NEUTRAL_BLOCK_HOVER,
    projection: NEUTRAL_PROJECTION,
  },
  low: {
    accent: "bg-muted-foreground/40",
    bg: NEUTRAL_BLOCK_BG,
    border: NEUTRAL_BLOCK_BORDER,
    text: NEUTRAL_BLOCK_TEXT,
    hover: NEUTRAL_BLOCK_HOVER,
    projection: NEUTRAL_PROJECTION,
  },
};

export const TYPE_CHANNEL: Record<
  Exclude<ScheduleItemType, "task">,
  ChannelStyle
> = {
  habit: {
    accent: "bg-warning/70",
    bg: NEUTRAL_BLOCK_BG,
    border: `${NEUTRAL_BLOCK_BORDER} border-l-2 border-l-warning/30`,
    text: NEUTRAL_BLOCK_TEXT,
    hover: NEUTRAL_BLOCK_HOVER,
    projection: NEUTRAL_PROJECTION,
  },
  focus: {
    accent: "bg-primary",
    bg: NEUTRAL_BLOCK_BG,
    border: `${NEUTRAL_BLOCK_BORDER} border-l-2 border-l-primary/30`,
    text: NEUTRAL_BLOCK_TEXT,
    hover: NEUTRAL_BLOCK_HOVER,
    projection: NEUTRAL_PROJECTION,
  },
};

export function getChannelStyle(
  type: ScheduleItemType,
  priority?: TaskPriority | null,
): ChannelStyle {
  if (type === "task") {
    return PRIORITY_CHANNEL[priority ?? "medium"];
  }
  return TYPE_CHANNEL[type];
}
