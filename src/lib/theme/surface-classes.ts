/**
 * Reusable surface & interaction class strings aligned with Neutral Dark tokens.
 * Canonical: Environment → Work → Emphasis → Floating (+ Hover temporary).
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
export const kanbanColumnBodyClass = "border-border-subtle/80 bg-surface-base";

/** Kanban column header — Raised emphasis over Base column. */
export const kanbanColumnHeaderClass =
  "border-b border-border-subtle/70 bg-surface-board-header";

/**
 * Kanban card unit — Raised object cards on Base columns.
 */
export const kanbanCardClass =
  "rounded-lg border border-border-strong/50 bg-surface-raised shadow-sm";

/** Navigation chrome (sidebars, drawers) */
export const surfaceChromeClass = "bg-surface-nav text-sidebar-foreground";

/** Right workspace rail — same Navigation chrome as left sidebar. */
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

/** Inset sections on the workspace canvas — Raised well, not opacity greys */
export const surfaceInsetClass =
  "rounded-xl border border-divider bg-surface-raised";

/**
 * Recessed editable control inside a base (#242429) card.
 * Default #1E1E20 → hover/focus #232325 (subtle). Focus also uses indigo ring.
 * Do not use --surface-hover / --control-* here — those are for compact selectors.
 * Apply per context, not globally on every Input/Textarea.
 */
export const surfaceInsetControlClass =
  "border-border-subtle bg-surface-inset hover:bg-surface-inset-hover focus-visible:bg-surface-inset-hover dark:bg-surface-inset dark:hover:bg-surface-inset-hover dark:focus-visible:bg-surface-inset-hover";

/** Writing fields recessed inside drawer/base cards */
export const drawerWritingFieldClass = surfaceInsetControlClass;

/**
 * Compact selector/button control (Date, Time, Duration, Alert, Priority, …).
 * Default #29292D → hover/focus #303034 → open/pressed #343438.
 * Stronger response than inset text fields; apply per context.
 */
export const compactControlTriggerClass =
  "inline-flex h-7 items-center rounded-lg border border-border-subtle bg-control-default text-xs text-foreground outline-none transition-colors duration-150 hover:bg-control-hover focus-visible:bg-control-hover focus-visible:ring-1 focus-visible:ring-ring/40 aria-expanded:bg-control-active data-popup-open:bg-control-active disabled:bg-control-default disabled:text-muted-foreground disabled:opacity-55";

/** Open / pressed override when open state is class-driven (not aria-expanded). */
export const compactControlTriggerOpenClass = "bg-control-active";

/** Segmented plan/state chips — same height as compact selectors. */
export const compactControlChipClass =
  "inline-flex h-7 items-center rounded-lg border px-2 text-xs font-medium transition-colors duration-150";

export const compactControlChipActiveClass =
  "border-border-subtle bg-control-active text-foreground";

export const compactControlChipInactiveClass =
  "border-transparent bg-transparent text-muted-foreground hover:bg-control-hover hover:text-foreground";

/** Quiet task/list row hover — soft white wash over parent surface */
export const taskRowInteractiveClass = "flow-row-interactive";

/** Dragging ghost / raised row */
export const taskRowDraggingClass = "flow-row-dragging";

/** Timeline column — Base organisational grid on Canvas shell */
export const surfaceTimelineClass = "bg-surface-base text-foreground";

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
