/**
 * FlowOS theme token reference — values live in globals.css (:root / .dark).
 * Use Tailwind utilities (bg-surface-canvas, bg-card) or surface-classes.ts helpers.
 *
 * Neutral Dark semantic roles are canonical (DESIGN_SYSTEM_NEUTRAL_DARK.md).
 * Legacy names remain as compatibility aliases until consumers retire.
 */
export const themeTokens = {
  /** Canonical Neutral Dark surface stack */
  surface: {
    canvas: "--surface-canvas",
    nav: "--surface-nav",
    drawer: "--surface-drawer",
    base: "--surface-base",
    inset: "--surface-inset",
    insetHover: "--surface-inset-hover",
    raised: "--surface-raised",
    overlay: "--surface-overlay",
    hover: "--surface-hover",
    rowHover: "--surface-row-hover",
  },
  control: {
    default: "--control-default",
    hover: "--control-hover",
    active: "--control-active",
  },
  border: {
    subtle: "--border-subtle",
    strong: "--border-strong",
  },
  text: {
    primary: "--text-primary",
    secondary: "--text-secondary",
    muted: "--text-muted",
    tertiary: "--text-tertiary",
    disabled: "--text-disabled",
  },
  primary: {
    default: "--primary",
    subtle: "--primary-subtle",
    soft: "--primary-soft",
    medium: "--primary-medium",
  },
  /**
   * Compatibility aliases — map to Neutral Dark roles in globals.css.
   * Prefer semantic names in new code.
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
