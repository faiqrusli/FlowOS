import {
  surfaceCardClass,
  surfaceFocusClass,
} from "@/lib/theme/surface-classes";

/**
 * Today hierarchy surface map (spec §4 → existing v3 tokens):
 * Level 0 canvas → --background (--surface-canvas)
 * Level 1 chrome → --surface (--surface-nav)
 * Level 2 content → --card (--surface-base) — queue/timeline items
 * Current Focus → soft raised wash (not a full Level 2 card) — calm workspace region
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

/** Focus execution zone — card surface on canvas. */
export const workplaceFocusCanvasClassName =
  "mb-3 rounded-xl border border-border-subtle bg-surface-base pr-0.5 shadow-none";

/** @deprecated Prefer workplaceFocusCanvasClassName for Today Focus shell */
export const workplaceFocusSectionClassName = [
  surfaceFocusClass,
  "transition-[background-color,border-color] duration-200",
].join(" ");

/** Timeline — canvas surface (#1B1B1B), flush with workspace. */
export const workplaceTimelineEdgeClassName = [
  "rounded-none",
  "border-0",
  "bg-surface-canvas shadow-none ring-0",
].join(" ");
