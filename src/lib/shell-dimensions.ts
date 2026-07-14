/** Frozen application shell geometry — application-shell-navigation-spec. */

/** Shared header band across brand cell, main status bar, utility headers. */
export const SHELL_HEADER_HEIGHT_PX = 68;
/** @deprecated Use SHELL_HEADER_HEIGHT_PX */
export const SHELL_TOPBAR_HEIGHT_PX = SHELL_HEADER_HEIGHT_PX;
/** @deprecated Use SHELL_HEADER_HEIGHT_PX */
export const SHELL_SIDEBAR_EXPANDED_HEADER_PX = SHELL_HEADER_HEIGHT_PX;
/** @deprecated Use SHELL_HEADER_HEIGHT_PX */
export const SHELL_SIDEBAR_HEADER_HEIGHT_PX = SHELL_HEADER_HEIGHT_PX;

export const SHELL_SIDEBAR_COLLAPSED_WIDTH_PX = 88;
export const SHELL_SIDEBAR_EXPANDED_WIDTH_PX = 260;

export const SHELL_UTILITY_RAIL_WIDTH_PX = 64;
export const SHELL_UTILITY_SIDEBAR_EXPANDED_WIDTH_PX = 500;
export const SHELL_UTILITY_SIDEBAR_CONTENT_WIDTH_PX =
  SHELL_UTILITY_SIDEBAR_EXPANDED_WIDTH_PX - SHELL_UTILITY_RAIL_WIDTH_PX;
export const SHELL_UTILITY_HEADER_HEIGHT_PX = SHELL_HEADER_HEIGHT_PX;
export const SHELL_UTILITY_BUTTON_PX = 40;
export const SHELL_UTILITY_RAIL_GAP_PX = 8;
export const SHELL_UTILITY_RAIL_TOP_PX = 14;
export const SHELL_UTILITY_HEADER_ACTION_PX = 32;
export const SHELL_UTILITY_HEADER_ACTION_ICON_PX = 18;
export const SHELL_UTILITY_HEADER_PADDING_PX = 22;
export const SHELL_UTILITY_ACTIVE_RADIUS_PX = 11;

export const SHELL_NAV_ICON_PX = 18;
export const SHELL_NAV_BUTTON_PX = 48;
/** @deprecated Use SHELL_UTILITY_BUTTON_PX */
export const SHELL_UTILITY_HIT_PX = SHELL_UTILITY_BUTTON_PX;
/** @deprecated Use SHELL_UTILITY_BUTTON_PX */
export const SHELL_UTILITY_ACTIVE_PX = SHELL_UTILITY_BUTTON_PX;
export const SHELL_RAIL_BUTTON_GAP_PX = SHELL_UTILITY_RAIL_GAP_PX;
export const SHELL_UTILITY_COLLAPSE_AFTER_GAP_PX = SHELL_UTILITY_RAIL_GAP_PX;
export const SHELL_SECONDARY_CONTROL_PX = 36;
export const SHELL_BRAND_LOGO_PX = 36;
export const SHELL_BRAND_GAP_PX = 12;

/** Left nav vertical rhythm */
export const SHELL_NAV_TOP_PADDING_PX = 14;
export const SHELL_NAV_SECTION_GAP_PX = 14;
export const SHELL_NAV_ROW_PX = 48;
export const SHELL_NAV_ITEM_GAP_PX = 8;
export const SHELL_NAV_RADIUS_PX = 12;
export const SHELL_ACTIVE_INDICATOR_HEIGHT_PX = 30;
export const SHELL_ACTIVE_INDICATOR_PX = 3;

/** @deprecated Prefer SHELL_NAV_TOP_PADDING_PX — brand shares header band */
export const SHELL_SIDEBAR_COLLAPSED_TOP_PX = 0;
/** @deprecated Logo is always SHELL_BRAND_LOGO_PX */
export const SHELL_COLLAPSED_BRAND_LOGO_PX = SHELL_BRAND_LOGO_PX;
/** @deprecated Use SHELL_NAV_TOP_PADDING_PX */
export const SHELL_COLLAPSED_LOGO_TO_TODAY_PX = SHELL_NAV_TOP_PADDING_PX;
/** @deprecated Use SHELL_NAV_ROW_PX */
export const SHELL_COLLAPSED_TODAY_BUTTON_PX = SHELL_NAV_ROW_PX;
/** @deprecated Use SHELL_NAV_SECTION_GAP_PX */
export const SHELL_COLLAPSED_TODAY_TO_WORKSPACE_PX = SHELL_NAV_SECTION_GAP_PX;
/** @deprecated Use SHELL_NAV_ROW_PX */
export const SHELL_COLLAPSED_WORKSPACE_BUTTON_PX = SHELL_NAV_ROW_PX;
/** @deprecated Use SHELL_NAV_ITEM_GAP_PX */
export const SHELL_COLLAPSED_WORKSPACE_GAP_PX = SHELL_NAV_ITEM_GAP_PX;

/** @deprecated Labels are absolute decoration */
export const SHELL_EXPANDED_HOME_LABEL_GAP_PX = 4;
/** @deprecated Use SHELL_NAV_ROW_PX */
export const SHELL_EXPANDED_TODAY_ROW_PX = SHELL_NAV_ROW_PX;
/** @deprecated Use SHELL_NAV_SECTION_GAP_PX */
export const SHELL_EXPANDED_TODAY_TO_WORKSPACE_PX = SHELL_NAV_SECTION_GAP_PX;
/** @deprecated Labels are absolute decoration */
export const SHELL_EXPANDED_WORKSPACE_LABEL_GAP_PX = 4;
/** @deprecated Use SHELL_NAV_ROW_PX */
export const SHELL_EXPANDED_WORKSPACE_ROW_PX = SHELL_NAV_ROW_PX;

export const SHELL_PROFILE_CARD_HEIGHT_PX = 56;
export const SHELL_PROFILE_AVATAR_PX = 40;
export const SHELL_PROFILE_HIT_PX = 44;

/** @deprecated Use SHELL_NAV_BUTTON_PX */
export const SHELL_COLLAPSED_NAV_BUTTON_PX = SHELL_NAV_BUTTON_PX;

/** Icon column — collapsed rail width; keeps icon center aligned on expand/collapse. */
export const SHELL_NAV_ICON_COLUMN_PX = SHELL_SIDEBAR_COLLAPSED_WIDTH_PX;

/** Below this remaining main width, utility panel overlays instead of resizing. */
export const SHELL_MAIN_WORKSPACE_MIN_WIDTH_PX = 720;
