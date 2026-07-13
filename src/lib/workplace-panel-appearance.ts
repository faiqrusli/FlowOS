import { surfaceCardClass, surfaceFocusClass } from "@/lib/theme/surface-classes";

/** Shared workplace dashboard panel surface (tasks, habits, supporting cards). */
export const workplacePanelSectionClassName = [
  surfaceCardClass,
  "flow-card-interactive",
  "transition-[background-color,border-color,box-shadow] duration-200",
  "hover:bg-surface-card-hover",
  "hover:border-[color-mix(in_oklch,var(--border),var(--foreground)_8%)]",
].join(" ");

/** Focus card — subtle permanent lift above standard panels (DESIGN_SYSTEM.md). */
export const workplaceFocusSectionClassName = [
  surfaceFocusClass,
  "transition-[background-color,border-color] duration-200",
].join(" ");

/** Timeline left edge — whisper divider on the workspace canvas. */
export const workplaceTimelineEdgeClassName = "border-l border-divider";
