/**
 * Reusable surface & interaction class strings aligned with FlowOS design tokens.
 * Canonical model: background → surface → card → surface-hover (temporary).
 * Prefer `.flow-*` classes from globals.css directly when possible.
 */

/** Level 2 — interactive content (cards, modals, widgets) */
export const surfaceCardClass = "flow-surface-card";

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

/** Level 3 — temporary hover / selected feedback */
export const surfaceHoverClass = "bg-surface-hover";

/** Inset sections on the workspace canvas */
export const surfaceInsetClass =
  "rounded-xl border border-divider bg-muted/35 dark:bg-muted/30";

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
