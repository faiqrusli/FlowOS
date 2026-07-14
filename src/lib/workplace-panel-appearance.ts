import { surfaceCardClass, surfaceFocusClass } from "@/lib/theme/surface-classes";

/**
 * Today hierarchy surface map (spec §4 → existing v3 tokens):
 * Level 0 canvas → --background (--surface-canvas)
 * Level 1 chrome → --surface (--surface-nav)
 * Level 2 content → --card (--surface-base) — Current Focus, queue/timeline items
 * Level 3 elevated → --surface-elevated (--surface-raised) — overlays only
 * Hover → --surface-hover (temporary interaction, never permanent fill)
 */

/** Shared workplace dashboard panel surface (tasks, habits, supporting cards). */
export const workplacePanelSectionClassName = [
  surfaceCardClass,
  "flow-card-interactive",
  "transition-[background-color,border-color,box-shadow] duration-200",
  "hover:bg-surface-hover",
  "hover:border-border-strong/60",
].join(" ");

/** Focus execution zone — cardless on Canvas (timer hierarchy via typography). */
export const workplaceFocusCanvasClassName =
  "border-transparent bg-transparent shadow-none";

/** @deprecated Prefer workplaceFocusCanvasClassName for Today Focus shell */
export const workplaceFocusSectionClassName = [
  surfaceFocusClass,
  "transition-[background-color,border-color] duration-200",
].join(" ");

/** Timeline left edge — whisper divider on the workspace canvas. */
export const workplaceTimelineEdgeClassName = "border-l border-divider";
