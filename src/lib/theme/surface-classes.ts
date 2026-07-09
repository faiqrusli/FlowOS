/**
 * Reusable surface & interaction class strings aligned with FlowOS design tokens.
 * Canonical chrome: background → surface → card → surface-hover (temporary).
 * Today Focus: optional subtle lift via surface-focus — see DESIGN_SYSTEM.md.
 * Prefer `.flow-*` classes from globals.css directly when possible.
 */

/** Level 2 — interactive content (cards, modals, widgets) */
export const surfaceCardClass = "flow-surface-card";

/** Today Focus — barely lighter permanent fill than card */
export const surfaceFocusClass = "flow-surface-focus";

/** Level 2 — active/raised card (same token, stronger shadow) */
export const surfaceRaisedClass = "flow-surface-raised";

/** Level 2+ — dropdowns, menus, popovers (card + elevation shadow) */
export const surfaceElevatedClass = "flow-surface-elevated";

/** Level 2 — modals & dialogs */
export const surfaceModalClass = "flow-surface-modal";

/** Level 0 — workspace canvas */
export const surfaceBackgroundClass = "bg-background";

/** Level 1 — application chrome (sidebars, drawers) */
export const surfaceChromeClass = "bg-sidebar text-sidebar-foreground";

/**
 * Workspace Drawer content card — primary interaction on `--card` over chrome.
 * Drawer shell stays `surfaceChromeClass`; expand/resize must not change elevation.
 */
export const drawerCardClass =
  "flow-surface-card flex min-w-0 flex-col rounded-xl border border-border/50 p-4 shadow-none";

/** Stack of drawer cards — 24px gap (use gap-8 / 32px where airier). */
export const drawerCardStackClass = "flex flex-col gap-6 p-3";

/** Level 3 — temporary hover / selected feedback */
export const surfaceHoverClass = "bg-surface-hover";

/** Inset sections on the workspace canvas */
export const surfaceInsetClass =
  "rounded-xl border border-divider bg-muted/35 dark:bg-muted/30";

/** Writing fields slightly lighter than surrounding card */
export const drawerWritingFieldClass = "bg-muted/35";

/** Timeline column — aliases to background */
export const surfaceTimelineClass = "bg-background text-foreground";

/** Subtle hover for list rows & chips */
export const interactiveHoverClass =
  "transition-colors duration-150 hover:bg-surface-hover";

/** Selected list / nav item */
export const selectedItemClass = "flow-selected text-foreground";

/** Empty state / drop zone framing */
export const emptyStateClass = "flow-empty";

/** Focus ring utility for custom controls */
export const focusRingClass =
  "outline-none focus-visible:ring-3 focus-visible:ring-ring/45 focus-visible:border-primary/60";
