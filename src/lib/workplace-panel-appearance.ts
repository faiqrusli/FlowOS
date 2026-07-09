import { surfaceCardClass, surfaceFocusClass } from "@/lib/theme/surface-classes";

/** Shared workplace dashboard panel surface (tasks, habits, supporting cards). */
export const workplacePanelSectionClassName = [
  surfaceCardClass,
  "flow-card-interactive",
  "transition-[background-color,border-color,box-shadow] duration-200",
  "hover:bg-surface-hover",
  "hover:border-[color-mix(in_oklch,var(--border),var(--foreground)_12%)]",
].join(" ");

/** Focus card — subtle permanent lift above standard panels (DESIGN_SYSTEM.md). */
export const workplaceFocusSectionClassName = [
  surfaceFocusClass,
  "flow-card-interactive",
  "transition-[background-color,border-color,box-shadow] duration-200",
].join(" ");

/** Timeline left edge — whisper divider on the workspace canvas. */
export const workplaceTimelineEdgeClassName = "border-l border-divider";
