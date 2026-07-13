import { surfaceCardClass, surfaceFocusClass } from "@/lib/theme/surface-classes";

/** Shared workplace dashboard panel surface (tasks, habits, supporting cards). */
export const workplacePanelSectionClassName = [
  surfaceCardClass,
  "flow-card-interactive",
  "transition-[background-color,border-color,box-shadow] duration-200",
  "hover:bg-surface-hover",
  "hover:border-border-strong/60",
].join(" ");

/** Focus card — Raised attention surface (DESIGN_SYSTEM.md). */
export const workplaceFocusSectionClassName = [
  surfaceFocusClass,
  "transition-[background-color,border-color] duration-200",
].join(" ");

/** Timeline left edge — whisper divider on the workspace canvas. */
export const workplaceTimelineEdgeClassName = "border-l border-divider";
