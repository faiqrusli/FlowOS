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
 * Top matches Focus header (`pt-1.5`) so the card lines up with Focus Reflection.
 */
export const WORKPLACE_QUEUE_CARD_INSET_CLASS = `pt-1.5 pb-3 pl-2 ${WORKPLACE_PANEL_TRAILING_INSET_CLASS}`;

/** Gap between the workplace timeline and the global right sidebar (px). */
export const WORKPLACE_TIMELINE_RIGHT_GAP_PX = 2;

/** @deprecated Use WORKPLACE_TIMELINE_WIDTH_PX */
export const WORKPLACE_TIMELINE_WIDTH_EXTRA_PX = 0;

/** Collapsed Next Up queue rail width. */
export const WORKPLACE_NEXT_UP_RAIL_PX = 40;

/**
 * Expanded Next Up queue panel — preferred midpoint for layout math.
 * Band: 380–440px.
 */
export const WORKPLACE_NEXT_UP_PANEL_PX = 400;

/** CSS width for the open Queue panel — room for title + metadata. */
export const WORKPLACE_NEXT_UP_PANEL_WIDTH_CSS = "clamp(380px, 26vw, 440px)";

/**
 * Focus canvas floor (timer / current-task card) — never shrink below this.
 * Queue rail/panel adds on top; tight layouts scroll horizontally instead.
 */
export const WORKPLACE_FOCUS_MIN_PX = 520;

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
 * Tasks/Habits dock bottom offset by vertical room in `[data-focus-workspace]`.
 * Comfortable → slightly reduced → more reduced → most reduced (3 steps lower).
 * When horizontal layout is tight enough that the top status rail hides, the dock
 * drops lower so it doesn’t float mid-canvas in the extra vertical space.
 */
export const WORKPLACE_DOCK_BOTTOM_FULL_PX = 68;
export const WORKPLACE_DOCK_BOTTOM_SLIGHT_PX = 52;
export const WORKPLACE_DOCK_BOTTOM_MORE_PX = 36;
export const WORKPLACE_DOCK_BOTTOM_MOST_PX = 16;

/** Focus-workspace height floors for each dock stage (px). */
export const WORKPLACE_DOCK_STAGE_SLIGHT_BELOW_PX = 700;
export const WORKPLACE_DOCK_STAGE_MORE_BELOW_PX = 560;
export const WORKPLACE_DOCK_STAGE_MOST_BELOW_PX = 440;

/** Launcher height + gap above it — popup sits this far above dock bottom. */
export const WORKPLACE_DOCK_POPUP_ABOVE_LAUNCHER_PX = 44 + 8;

export function resolveWorkplaceDockBottomPx(
  workspaceHeightPx: number,
  layoutWidthPx?: number,
): number {
  let bottom: number;
  if (workspaceHeightPx >= WORKPLACE_DOCK_STAGE_SLIGHT_BELOW_PX) {
    bottom = WORKPLACE_DOCK_BOTTOM_FULL_PX;
  } else if (workspaceHeightPx >= WORKPLACE_DOCK_STAGE_MORE_BELOW_PX) {
    bottom = WORKPLACE_DOCK_BOTTOM_SLIGHT_PX;
  } else if (workspaceHeightPx >= WORKPLACE_DOCK_STAGE_MOST_BELOW_PX) {
    bottom = WORKPLACE_DOCK_BOTTOM_MORE_PX;
  } else {
    bottom = WORKPLACE_DOCK_BOTTOM_MOST_PX;
  }

  // Same breakpoint as status-rail hide — reclaim the freed top chrome by sitting lower.
  if (
    layoutWidthPx != null &&
    layoutWidthPx <= WORKPLACE_STATUS_RAIL_HIDE_BELOW_PX
  ) {
    bottom = Math.min(bottom, WORKPLACE_DOCK_BOTTOM_MORE_PX);
  }

  return bottom;
}

/** Task/Habit browse overlay — narrower; grows vertically with content. */
export const WORKPLACE_MODULE_OVERLAY_MAX_PX = 340;
export const WORKPLACE_MODULE_OVERLAY_MIN_HEIGHT_PX = 360;
export const WORKPLACE_MODULE_OVERLAY_MAX_HEIGHT_CSS = "min(68vh, 560px)";

/** @deprecated Bottom gap retired — Focus workspace runs to the viewport edge. */
export const WORKPLACE_PANEL_BOTTOM_GAP_PX = 0;

/**
 * Below this focus-shell width, open Queue as a mid overlay over Focus
 * (expands left from the rail) instead of pushing Focus inline.
 */
export const WORKPLACE_QUEUE_INLINE_MIN_PX =
  WORKPLACE_FOCUS_MIN_PX + WORKPLACE_NEXT_UP_PANEL_PX;

/** @deprecated Prefer WORKPLACE_QUEUE_INLINE_MIN_PX */
export const WORKPLACE_QUEUE_OVERLAY_MAX_PX = WORKPLACE_QUEUE_INLINE_MIN_PX - 1;

export const WORKPLACE_QUEUE_DRAWER_MAX_PX = 1200;

export type WorkplaceQueueLayoutMode = "inline" | "mid" | "drawer";

/** Inline when Focus shell can fit Focus min + open Queue; otherwise mid overlay. */
export function resolveWorkplaceQueueLayoutMode(
  focusShellWidthPx?: number,
): WorkplaceQueueLayoutMode {
  if (
    focusShellWidthPx != null &&
    focusShellWidthPx < WORKPLACE_QUEUE_INLINE_MIN_PX
  ) {
    return "mid";
  }
  return "inline";
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
