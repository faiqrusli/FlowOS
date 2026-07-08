import { FOCUS_TIMER_COLORS } from "@/lib/focus-timer-appearance";

/** Shared workplace dashboard panel surface (focus, tasks, habits, notes, timeline). */
export const WORKPLACE_PANEL_COLORS = {
  /** ~2.5% darker than prior page canvas — contrast comes from cards, not borders. */
  page: "#11141f",
  /** Card / panel surface — unchanged. */
  surface: FOCUS_TIMER_COLORS.surface,
  /** ~2.5% lighter than surface — card hover lift. */
  surfaceHover: "#1c2239",
} as const;

const panelBorderClass =
  "border-[color-mix(in_srgb,#2a3050_14%,transparent)] hover:border-[color-mix(in_srgb,#ffffff_5%,transparent)]";

export const workplacePanelSectionClassName = [
  "rounded-2xl border bg-[#1a2035] shadow-xs",
  panelBorderClass,
  "transition-[background-color,border-color,box-shadow] duration-200",
  "hover:bg-[#1c2239] hover:shadow-sm",
].join(" ");

/** Timeline left edge — soft divider, same family as card borders. */
export const workplaceTimelineEdgeClassName =
  "border-l border-[color-mix(in_srgb,#2a3050_14%,transparent)]";
