/**
 * Today hierarchy — Design System v3 Workspace map:
 * Surface 1 canvas → Surface 3 Focus/Queue canvases → Surface 4 cards
 * Hover → Surface 6 (temporary, never permanent fill)
 */

/** Shared workplace floating panel surface (tasks, habits overlays). */
export const workplacePanelSectionClassName = [
  "rounded-xl border-0 bg-surface-base text-card-foreground shadow-none",
  "flow-card-interactive",
  "transition-[background-color,box-shadow] duration-200",
  "hover:bg-surface-hover",
].join(" ");

/** Focus execution zone — canvas; Current Task is the only nested emphasis. */
export const workplaceFocusCanvasClassName =
  "mb-3 rounded-[18px] border-0 bg-surface-base pr-0.5 shadow-none";

/** @deprecated Prefer workplaceFocusCanvasClassName for Today Focus shell */
export const workplaceFocusSectionClassName = [
  "rounded-[18px] border-0 bg-surface-base text-card-foreground shadow-none",
  "transition-[background-color] duration-200",
].join(" ");

/** Timeline — matches workspace background (Surface 1). */
export const workplaceTimelineEdgeClassName = [
  "rounded-none",
  "border-0",
  "bg-surface-canvas shadow-none ring-0",
].join(" ");
