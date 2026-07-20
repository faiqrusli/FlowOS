/**
 * FlowOS theme token reference — values live in globals.css (.dark).
 * Use Tailwind utilities (bg-surface-canvas, bg-surface-4) or surface-classes.ts helpers.
 *
 * Canonical: DESIGN_SYSTEM_V3.md (Surface 0–10). Semantic names alias to numbered paints.
 */
export const themeTokens = {
  /** Design System v3 Surface 0–10 */
  surfaceLadder: {
    0: "--surface-0",
    1: "--surface-1",
    2: "--surface-2",
    3: "--surface-3",
    4: "--surface-4",
    5: "--surface-5",
    6: "--surface-6",
    7: "--surface-7",
    8: "--surface-8",
    9: "--surface-9",
    10: "--surface-10",
  },
  /** Semantic aliases → Surface 0–10 in globals.css */
  surface: {
    canvas: "--surface-canvas", // → 1
    nav: "--surface-nav", // → 0
    rail: "--surface-rail", // → 2
    section: "--surface-section", // → 3
    drawer: "--surface-drawer", // → 2
    base: "--surface-base", // → 4
    inset: "--surface-inset", // → 5
    insetHover: "--surface-inset-hover", // → 6
    editor: "--surface-editor", // → 5
    raised: "--surface-raised", // → 4 (resting)
    float: "--surface-float", // → 8
    overlay: "--surface-overlay", // → 5
    hover: "--surface-hover", // → 6
    active: "--surface-active", // → 7
    selected: "--surface-selected", // → 7
    rowHover: "--surface-row-hover",
    ghostHover: "--surface-ghost-hover",
  },
  control: {
    default: "--control-default",
    hover: "--control-hover",
    active: "--control-active",
  },
  border: {
    subtle: "--border-subtle",
    control: "--border-control",
    elevated: "--border-elevated",
    strong: "--border-strong",
    hairline: "--border-hairline",
    float: "--border-float",
    divider: "--divider",
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
   * Compatibility aliases — map to Surface ladder in globals.css.
   * Prefer semantic / numbered names in new code.
   */
  surfaceLegacy: {
    background: "--background", // → 1
    surface: "--surface", // → 0
    card: "--card", // → 4
    app: "--surface-app",
    sidebar: "--surface-sidebar",
    page: "--surface-page",
    elevated: "--surface-elevated", // → 8
    timeline: "--timeline-surface", // → 1 (matches workspace)
    dialog: "--surface-dialog", // → 9
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
