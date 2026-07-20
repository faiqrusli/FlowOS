/**
 * Reusable surface & interaction class strings — Design System v3.
 * Surface 0–10 via semantic aliases (canvas/nav/section/base/…).
 * Prefer `.flow-*` classes from globals.css directly when possible.
 */

/** Canvas — page background / cardless work area (Surface 1) */
export const surfaceCanvasClass = "bg-surface-canvas";

/** Navigation — left rail chrome (Surface 0) */
export const surfaceNavClass = "bg-surface-nav text-sidebar-foreground";

/** Section — major canvases / wells (Surface 3) */
export const surfaceSectionClass = "bg-surface-section";

/** Base — content cards / organisational panels (Surface 4) */
export const surfaceBaseClass = "flow-surface-base";

/** Raised — resting = Surface 4; prefer hover:bg-surface-hover (Surface 6) */
export const surfaceRaisedClass = "flow-surface-raised";

/** Menus / floating chrome — Surface 8 (`flow-surface-elevated`) */
export const surfaceOverlayClass = "flow-surface-elevated";

/** @deprecated Prefer surfaceBaseClass — maps to Base */
export const surfaceCardClass = "flow-surface-card";

/** @deprecated Prefer surfaceRaisedClass — Focus lift → Raised */
export const surfaceFocusClass = "flow-surface-focus";

/** @deprecated Prefer surfaceOverlayClass — menus use Float */
export const surfaceElevatedClass = "flow-surface-elevated";

/** Modal / dialog — Surface 9 + dialog shadow */
export const surfaceModalClass = "flow-surface-modal";

/** @deprecated Prefer surfaceCanvasClass */
export const surfaceBackgroundClass = "bg-surface-canvas";

/** Tasks / Kanban column — bordered well, no fill (cards carry the work surface). */
export const surfaceBoardClass =
  "rounded-xl border border-border-subtle/80 bg-transparent";

/**
 * Kanban list well — no fill; 0.5px / white 3% edge (`--border-hairline`).
 */
export const kanbanColumnBodyClass = "flow-border-hairline bg-transparent";

/** Kanban column header — one step above the Notes canvas (Surface 5). */
export const kanbanColumnHeaderClass =
  "flow-border-hairline-b bg-surface-inset";

/**
 * Kanban card — one step above the list well; hover lifts further.
 */
export const kanbanCardClass =
  "rounded-lg border-0 bg-surface-6 shadow-none transition-[background-color] duration-150 hover:bg-surface-7";

/** Navigation chrome (sidebars, drawers) */
export const surfaceChromeClass = "bg-surface-nav text-sidebar-foreground";

/**
 * Floating overlays — Tasks/Habits dock + compact Next Up Queue.
 * Prefer `.flow-floating-overlay` in CSS; class string kept for discovery.
 */
export const floatingOverlayClass = "flow-floating-overlay";

/** Right workspace rail — Surface 2 context strip. */
export const workspaceRailBackgroundClass = "bg-surface-rail";

/**
 * Quiet chrome hairline — 0.5px / white 3% (`--border-hairline`).
 * Structure / canvas edges (nav rails). Prefer `.flow-border-hairline*` in CSS.
 */
export const borderHairlineClass = "flow-border-hairline";
export const borderHairlineLeftClass = "flow-border-hairline-l";
export const borderHairlineRightClass = "flow-border-hairline-r";
/** 0.5px / white 6% — selected wells & list frames */
export const borderFloatClass = "flow-border-float";

/**
 * Workspace Drawer content card — Surface 4 over chrome (borderless panel).
 */
export const drawerCardClass =
  "flow-surface-card flex min-w-0 flex-col rounded-xl border-0 px-5 py-4 shadow-none";

/** Task detail drawer sections — Surface 4 content wells over rail chrome. */
export const drawerSectionCardClass =
  "flex min-w-0 flex-col rounded-xl border-0 bg-surface-base px-4 py-3.5 text-card-foreground shadow-none";

/** Stack of drawer cards — breathing room from panel edges. */
export const drawerCardStackClass = "flex flex-col gap-4 px-4 py-3";

/** Temporary hover / selected feedback (Surface 6) */
export const surfaceHoverClass = "bg-surface-hover";

/** Inset sections on the workspace canvas — Surface 4 well */
export const surfaceInsetClass = "rounded-xl border-0 bg-surface-base";

/**
 * Borderless list/queue row — Level 3 object on the workspace.
 * Background + hover only; no decorative stroke.
 */
export const workspaceRowClass =
  "rounded-md border-0 bg-surface-canvas/25 px-2 py-1 transition-[background-color,box-shadow] duration-150 hover:bg-surface-hover";

/**
 * Recessed editable control inside a base card (Surface 5 → 6 on hover).
 * Border uses control opacity. Focus uses Soft Indigo ring.
 */
export const surfaceInsetControlClass =
  "border-border-subtle bg-surface-inset hover:bg-surface-inset-hover focus-visible:bg-surface-inset-hover focus-visible:ring-1 focus-visible:ring-ring/40 dark:bg-surface-inset dark:hover:bg-surface-inset-hover dark:focus-visible:bg-surface-inset-hover";

/** Writing fields — editor depth (Surface 5 → 6 on hover/focus). */
export const drawerWritingFieldClass =
  "border-border-subtle bg-surface-editor hover:bg-surface-inset-hover focus-visible:bg-surface-inset-hover focus-visible:ring-1 focus-visible:ring-ring/40 dark:bg-surface-editor dark:hover:bg-surface-inset-hover dark:focus-visible:bg-surface-inset-hover";

/**
 * Compact selector/button control (Date, Time, Duration, Alert, Priority, …).
 * Surface 5 fill + subtle edge; hover lights to Surface 6.
 */
export const compactControlTriggerClass =
  "inline-flex h-8 items-center rounded-lg border border-border-subtle bg-control-default text-xs text-foreground outline-none transition-colors duration-150 hover:bg-control-hover focus-visible:bg-control-hover focus-visible:ring-1 focus-visible:ring-ring/40 aria-expanded:bg-control-active aria-expanded:ring-1 aria-expanded:ring-primary/30 data-popup-open:bg-control-active data-popup-open:ring-1 data-popup-open:ring-primary/30 disabled:bg-control-default disabled:text-muted-foreground disabled:opacity-55";

/** Open / pressed override when open state is class-driven (not aria-expanded). */
export const compactControlTriggerOpenClass =
  "bg-control-active ring-1 ring-primary/30";

/** Segmented plan/state chips — same height as compact selectors. */
export const compactControlChipClass =
  "inline-flex h-8 items-center rounded-lg border px-2.5 text-xs font-medium transition-colors duration-150";

export const compactControlChipActiveClass =
  "border-primary/35 bg-primary-soft text-foreground ring-1 ring-primary/25";

export const compactControlChipInactiveClass =
  "border-transparent bg-surface-inset text-muted-foreground hover:bg-control-hover hover:text-foreground";

/** Quiet task/list row hover — soft white wash over parent surface */
export const taskRowInteractiveClass = "flow-row-interactive";

/** Dragging ghost / raised row */
export const taskRowDraggingClass = "flow-row-dragging";

/** Timeline column — matches workspace (Surface 1) */
export const surfaceTimelineClass = "bg-surface-canvas text-foreground";

/** Subtle hover for list rows & chips — ghost chrome wash */
export const interactiveHoverClass =
  "transition-colors duration-150 ease-out hover:bg-surface-ghost-hover";

/** Selected list / nav item */
export const selectedItemClass = "flow-selected text-foreground";

/** Empty state / drop zone framing */
export const emptyStateClass = "flow-empty";

/** Focus ring utility for custom controls */
export const focusRingClass =
  "outline-none focus-visible:ring-3 focus-visible:ring-ring/45 focus-visible:border-primary/60";
