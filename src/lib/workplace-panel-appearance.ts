import { surfaceCardClass } from "@/lib/theme/surface-classes";

/** Shared workplace dashboard panel surface (focus, tasks, habits, notes). */
export const workplacePanelSectionClassName = [
  surfaceCardClass,
  "flow-card-interactive",
  "transition-[background-color,border-color,box-shadow] duration-200",
  "hover:bg-surface-hover",
].join(" ");

/** Timeline left edge — whisper divider on the workspace canvas. */
export const workplaceTimelineEdgeClassName = "border-l border-divider";
