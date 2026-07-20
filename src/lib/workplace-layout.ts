/** Workplace Timeline preferred width (360–420px band).
 * Also the default / floor width of `[data-timeline-shell]` — never crush below this;
 * the Today row scrolls horizontally instead.
 */
export const WORKPLACE_TIMELINE_WIDTH_PX = 360;

/** @deprecated Prefer WORKPLACE_TIMELINE_WIDTH_PX — timeline no longer shrinks below preferred. */
export const WORKPLACE_TIMELINE_MIN_PX = WORKPLACE_TIMELINE_WIDTH_PX;

/** Gap between the main canvas (quick capture / focus) and the timeline column. */
export const WORKPLACE_TIMELINE_CONTENT_GAP_PX = 2;

/**
 * Right inset shared by Next Up Queue card and Quick Capture so both keep
 * a slim breathing room before the Timeline.
 */
export const WORKPLACE_PANEL_TRAILING_INSET_CLASS = "pr-0.5";

/** Vertical + leading inset around the Next Up Queue card shell.
 * Top/bottom 0 — Focus + Next Up share one outer box edge.
 */
export const WORKPLACE_QUEUE_CARD_INSET_CLASS = `pt-0 pb-0 pl-2 ${WORKPLACE_PANEL_TRAILING_INSET_CLASS}`;

/** Gap between the workplace timeline and the global right sidebar (px). */
/** Gap between timeline and right utility rail — flush on Today. */
export const WORKPLACE_TIMELINE_RIGHT_GAP_PX = 0;

/** @deprecated Use WORKPLACE_TIMELINE_WIDTH_PX */
export const WORKPLACE_TIMELINE_WIDTH_EXTRA_PX = 0;

/**
 * @deprecated Queue no longer uses a permanent rail — Next Up preview is the launcher.
 * Kept so residual references compile during migration.
 */
export const WORKPLACE_NEXT_UP_RAIL_PX = 0;

/**
 * @deprecated Inline side panel removed — Queue is overlay-only from Next Up.
 * Kept for residual layout math references.
 */
export const WORKPLACE_NEXT_UP_PANEL_PX = 400;

/** @deprecated Inline Queue panel width — overlay uses WORKPLACE_NEXT_UP_OVERLAY_WIDTH_CSS. */
export const WORKPLACE_NEXT_UP_PANEL_WIDTH_CSS = "clamp(380px, 26vw, 440px)";

/** Compact overlay Queue — floats over Focus from the Next Up launcher. */
export const WORKPLACE_NEXT_UP_OVERLAY_WIDTH_CSS = "clamp(356px, 24vw, 412px)";

/** Top inset under Focus canvas when Queue stretches full height. */
export const WORKPLACE_NEXT_UP_OVERLAY_TOP_INSET_PX = 8;

/**
 * Focus canvas floor (timer / current-task card) — never shrink below this.
 * Queue overlay does not reserve horizontal space.
 */
export const WORKPLACE_FOCUS_MIN_PX = 500;

/**
 * Comfortable full Today workplace width (content column, not the window).
 * Status rail hides when the workplace is at or below 60% of this.
 */
export const WORKPLACE_LAYOUT_FULL_PX = 1600;

/** Status rail stays visible while workplace width is above this fraction of full. */
export const WORKPLACE_STATUS_RAIL_MIN_RATIO = 0.6;

export const WORKPLACE_STATUS_RAIL_HIDE_BELOW_PX = Math.round(
  WORKPLACE_LAYOUT_FULL_PX * WORKPLACE_STATUS_RAIL_MIN_RATIO,
);

/**
 * Tasks/Habits dock — pinned Focus workspace footer (no floating bottom stages).
 */

/** Launcher chrome height (keep in sync with `.workplace-dock-launcher` shell). */
export const WORKPLACE_DOCK_LAUNCHER_HEIGHT_PX = 40;
/** Gap between launcher top and overlay bottom. */
export const WORKPLACE_DOCK_POPUP_GAP_PX = 8;
/** Dock footer vertical padding (`py-3`) — keep in sync with Focus dock footer. */
export const WORKPLACE_DOCK_FOOTER_PAD_Y_PX = 12;
/** Popup `bottom` relative to Focus section bottom (= footer pad + launcher + gap). */
export const WORKPLACE_DOCK_OVERLAY_BOTTOM_PX =
  WORKPLACE_DOCK_FOOTER_PAD_Y_PX +
  WORKPLACE_DOCK_LAUNCHER_HEIGHT_PX +
  WORKPLACE_DOCK_POPUP_GAP_PX;
/** @deprecated Prefer WORKPLACE_DOCK_OVERLAY_BOTTOM_PX */
export const WORKPLACE_DOCK_POPUP_ABOVE_LAUNCHER_PX =
  WORKPLACE_DOCK_LAUNCHER_HEIGHT_PX + WORKPLACE_DOCK_POPUP_GAP_PX;

/** Task/Habit browse overlay — card size over the dock launcher. */
export const WORKPLACE_MODULE_OVERLAY_MAX_PX = 372;
export const WORKPLACE_MODULE_OVERLAY_MIN_HEIGHT_PX = 300;
export const WORKPLACE_MODULE_OVERLAY_MAX_HEIGHT_CSS = "min(58vh, 480px)";

/**
 * Bottom breathing room under Focus + Next Up so the pair floats above the
 * viewport edge (matches Focus column `pt-3` / 12px).
 */
export const WORKPLACE_PANEL_BOTTOM_GAP_PX = 12;

/**
 * @deprecated Queue is always a mid overlay; inline mode retired with the rail.
 */
export const WORKPLACE_QUEUE_INLINE_MIN_PX =
  WORKPLACE_FOCUS_MIN_PX + WORKPLACE_NEXT_UP_PANEL_PX;

/** @deprecated Prefer WORKPLACE_QUEUE_INLINE_MIN_PX */
export const WORKPLACE_QUEUE_OVERLAY_MAX_PX = WORKPLACE_QUEUE_INLINE_MIN_PX - 1;

export const WORKPLACE_QUEUE_DRAWER_MAX_PX = 1200;

export type WorkplaceQueueLayoutMode = "inline" | "mid" | "drawer";

/** Queue always opens as a mid overlay over Focus (no rail / inline panel). */
export function resolveWorkplaceQueueLayoutMode(): WorkplaceQueueLayoutMode {
  return "mid";
}

/**
 * @deprecated Today uses a focus-first flex column + Next Up side panel.
 * Kept for any residual references.
 */
export const WORKPLACE_DASHBOARD_GRID_CLASS =
  "grid min-h-0 min-w-0 flex-1 grid-cols-[minmax(0,0.32fr)_minmax(0,0.68fr)] grid-rows-[auto_minmax(0,1fr)_minmax(0,0.56fr)] gap-2";

/** @deprecated Replaced by WORKPLACE_DASHBOARD_GRID_CLASS */
export const WORKPLACE_LEFT_COLUMN_CLASS = "w-[min(300px,26vw)]";

/** @deprecated Replaced by grid cell sizing */
export const WORKPLACE_FOCUS_COLUMN_CLASS = "min-h-0 flex flex-col";
