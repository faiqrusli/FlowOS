/**
 * Reusable surface & interaction class strings aligned with FlowOS v3 tokens.
 * Canonical: Canvas → Navigation → Base → Raised → Overlay (+ Hover temporary).
 * Prefer `.flow-*` classes from globals.css directly when possible.
 */

/** Canvas — page background / cardless work area */
export const surfaceCanvasClass = "bg-surface-canvas";

/** Navigation — left/right rails and sidebar chrome */
export const surfaceNavClass = "bg-surface-nav text-sidebar-foreground";

/** Base — organisational panels, groups, lists, sections */
export const surfaceBaseClass = "flow-surface-base";

/** Raised — current / attention-worthy functional surfaces */
export const surfaceRaisedClass = "flow-surface-raised";

/** Overlay — temporary UI above the workspace */
export const surfaceOverlayClass = "flow-surface-elevated";

/** @deprecated Prefer surfaceBaseClass — maps to Base */
export const surfaceCardClass = "flow-surface-card";

/** @deprecated Prefer surfaceRaisedClass — Focus lift → Raised */
export const surfaceFocusClass = "flow-surface-focus";

/** @deprecated Prefer surfaceOverlayClass */
export const surfaceElevatedClass = "flow-surface-elevated";

/** Modal / dialog — Overlay + strongest allowed shadow */
export const surfaceModalClass = "flow-surface-modal";

/** @deprecated Prefer surfaceCanvasClass */
export const surfaceBackgroundClass = "bg-surface-canvas";

/** Tasks / Kanban column — Base with subtle border */
export const surfaceBoardClass = "bg-surface-base border-border-subtle";

/**
 * Kanban list well — Base column body.
 */
export const kanbanColumnBodyClass =
  "border-border-subtle/80 bg-surface-base shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]";

/** Kanban column header — barely brighter than the column well. */
export const kanbanColumnHeaderClass =
  "border-b border-border-subtle/70 bg-surface-board-header";

/**
 * Kanban card unit — Raised object cards on Base columns.
 */
export const kanbanCardClass =
  "rounded-lg border border-border-strong/50 bg-surface-raised shadow-sm";

/** Navigation chrome (sidebars, drawers) */
export const surfaceChromeClass = "bg-surface-nav text-sidebar-foreground";

/** Right workspace rail — same Navigation token as left nav. */
export const workspaceRailBackgroundClass = "bg-surface-nav";

/**
 * Workspace Drawer content card — Base over Navigation chrome.
 */
export const drawerCardClass =
  "flow-surface-card flex min-w-0 flex-col rounded-xl border border-border-subtle/80 p-4 shadow-none";

/** Stack of drawer cards — 24px gap (use gap-8 / 32px where airier). */
export const drawerCardStackClass = "flex flex-col gap-6 p-3";

/** Temporary hover / selected feedback */
export const surfaceHoverClass = "bg-surface-hover";

/** Inset sections on the workspace canvas */
export const surfaceInsetClass =
  "rounded-xl border border-divider bg-muted/35 dark:bg-muted/30";

/** Writing fields slightly lighter than surrounding card */
export const drawerWritingFieldClass = "bg-muted/35";

/** Timeline column — Canvas until Phase 6 migrates to Base */
export const surfaceTimelineClass = "bg-surface-canvas text-foreground";

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
