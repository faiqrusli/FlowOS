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

const NEUTRAL_BLOCK_BG = "bg-card";
const NEUTRAL_BLOCK_BORDER = "border-border/50";
const NEUTRAL_BLOCK_TEXT = "text-foreground";
const NEUTRAL_BLOCK_HOVER = "hover:bg-muted/45";
const NEUTRAL_PROJECTION =
  "border border-dashed border-border/60 bg-muted/20";

export const PRIORITY_CHANNEL: Record<TaskPriority, ChannelStyle> = {
  high: {
    accent: "bg-destructive",
    bg: NEUTRAL_BLOCK_BG,
    border: `${NEUTRAL_BLOCK_BORDER} border-l-[3px] border-l-destructive/50`,
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

export const TYPE_CHANNEL: Record<Exclude<ScheduleItemType, "task">, ChannelStyle> =
  {
    habit: {
      accent: "bg-warning",
      bg: NEUTRAL_BLOCK_BG,
      border: `${NEUTRAL_BLOCK_BORDER} border-l-[3px] border-l-warning/50`,
      text: NEUTRAL_BLOCK_TEXT,
      hover: NEUTRAL_BLOCK_HOVER,
      projection: NEUTRAL_PROJECTION,
    },
    focus: {
      accent: "bg-primary",
      bg: NEUTRAL_BLOCK_BG,
      border: `${NEUTRAL_BLOCK_BORDER} border-l-[3px] border-l-primary/40`,
      text: NEUTRAL_BLOCK_TEXT,
      hover: NEUTRAL_BLOCK_HOVER,
      projection: NEUTRAL_PROJECTION,
    },
  };

export function getChannelStyle(
  type: ScheduleItemType,
  priority?: TaskPriority | null
): ChannelStyle {
  if (type === "task") {
    return PRIORITY_CHANNEL[priority ?? "medium"];
  }
  return TYPE_CHANNEL[type];
}
