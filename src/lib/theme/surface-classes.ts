/**
 * Reusable surface & interaction class strings aligned with FlowOS theme tokens.
 * These mirror the `.flow-*` component classes in globals.css — prefer the CSS
 * classes directly; use these exports when you need to compose them in TS.
 */

/** Level 3 — standard card / panel */
export const surfaceCardClass = "flow-surface-card";

/** Level 4 — raised card / active panel */
export const surfaceRaisedClass = "flow-surface-raised";

/** Level 5 — dropdowns, menus, popovers */
export const surfaceElevatedClass = "flow-surface-elevated";

/** Level 6 — modals & dialogs */
export const surfaceModalClass = "flow-surface-modal";

/** Level 2 — inset page sections */
export const surfaceInsetClass =
  "rounded-xl border border-divider bg-muted/35 dark:bg-muted/30";

/** Timeline workspace column */
export const surfaceTimelineClass = "bg-timeline text-foreground";

/** Subtle hover for list rows & chips */
export const interactiveHoverClass =
  "transition-colors duration-150 hover:bg-muted/60 dark:hover:bg-accent/60";

/** Selected list / nav item */
export const selectedItemClass = "flow-selected text-foreground";

/** Empty state / drop zone framing */
export const emptyStateClass = "flow-empty";

/** Focus ring utility for custom controls */
export const focusRingClass =
  "outline-none focus-visible:ring-3 focus-visible:ring-ring/45 focus-visible:border-primary/60";
