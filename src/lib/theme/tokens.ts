/**
 * FlowOS theme token reference — values live in globals.css (:root / .dark).
 * Use Tailwind utilities (bg-surface-canvas, bg-card) or surface-classes.ts helpers.
 *
 * v3 semantic roles are canonical. Legacy names remain as compatibility aliases
 * until later migration phases retire consumers.
 */
export const themeTokens = {
  /** Canonical v3 semantic surface stack — see DESIGN_SYSTEM.md §3 */
  surface: {
    canvas: "--surface-canvas",
    nav: "--surface-nav",
    base: "--surface-base",
    raised: "--surface-raised",
    overlay: "--surface-overlay",
    hover: "--surface-hover",
  },
  border: {
    subtle: "--border-subtle",
    strong: "--border-strong",
  },
  text: {
    primary: "--text-primary",
    secondary: "--text-secondary",
    muted: "--text-muted",
    disabled: "--text-disabled",
  },
  primary: {
    default: "--primary",
    subtle: "--primary-subtle",
    soft: "--primary-soft",
    medium: "--primary-medium",
  },
  /**
   * Compatibility aliases — map to v3 roles in globals.css.
   * Prefer semantic names in new code; do not remove until Phase 11 audit.
   */
  surfaceLegacy: {
    background: "--background", // → canvas
    surface: "--surface", // → nav
    card: "--card", // → base
    app: "--surface-app",
    sidebar: "--surface-sidebar",
    page: "--surface-page",
    elevated: "--surface-elevated", // → raised
    timeline: "--timeline-surface",
    dialog: "--surface-dialog", // → overlay
  },
  semantic: {
    selected: "--selected",
    selectedBorder: "--selected-border",
    success: "--success",
    successMuted: "--success-muted",
    warning: "--warning",
    warningMuted: "--warning-muted",
    destructiveMuted: "--destructive-muted",
    ring: "--ring",
  },
} as const;
