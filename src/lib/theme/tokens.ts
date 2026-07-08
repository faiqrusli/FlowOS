/**
 * FlowOS theme token reference — values live in globals.css (:root / .dark).
 * Use Tailwind utilities (bg-card, text-muted-foreground) or surface-classes.ts helpers.
 */
export const themeTokens = {
  /** Canonical four-level surface stack — see DESIGN_SYSTEM.md */
  surface: {
    background: "--background",
    surface: "--surface",
    card: "--card",
    surfaceHover: "--surface-hover",
  },
  /** Legacy aliases — map to canonical tokens in globals.css; prefer canonical in new code */
  surfaceLegacy: {
    app: "--surface-app",
    sidebar: "--surface-sidebar",
    page: "--surface-page",
    card: "--surface-card",
    elevated: "--surface-elevated",
    timeline: "--timeline-surface",
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
