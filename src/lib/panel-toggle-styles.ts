import { cn } from "@/lib/utils";

/** Shared Quick Schedule / global access panel toggle chrome. */
export const PANEL_TOGGLE_ICON_CLASS = "text-accent-text";

export function panelToggleButtonClass(
  ...extra: (string | false | null | undefined)[]
) {
  return cn(
    "group/panel-toggle relative flex cursor-pointer items-center justify-center border text-accent-text transition-colors hover:border-border-subtle/60 hover:bg-surface-hover",
    ...extra,
  );
}

function panelToggleIconSize(size: "sm" | "md") {
  return size === "sm" ? "size-3.5" : "size-4";
}

export function panelTogglePrimaryIconClass(size: "sm" | "md" = "md") {
  return cn(
    panelToggleIconSize(size),
    PANEL_TOGGLE_ICON_CLASS,
    "transition-opacity duration-150 group-hover/panel-toggle:opacity-0",
  );
}

export function panelToggleHoverIconClass(size: "sm" | "md" = "md") {
  return cn(
    panelToggleIconSize(size),
    PANEL_TOGGLE_ICON_CLASS,
    "absolute opacity-0 transition-opacity duration-150 group-hover/panel-toggle:opacity-100",
  );
}

/**
 * Shared left/right rail icon cell — true 43px band.
 * Nudge children 1px down so the odd centering pixel sits on top
 * (padding would shrink the content box under border-box).
 */
export const SHELL_RAIL_ICON_ROW_PX = 43;

export const shellRailIconRowClass =
  "flex h-[43px] w-full shrink-0 items-center justify-center [&>*]:translate-y-px";

/** Shared top/brand/utility header row — same 43px band + top-biased center. */
export const shellHeaderBandClass =
  "flex h-[43px] shrink-0 items-center [&>*]:translate-y-px";

/** Neutral global sidebar rail — temporary hover/active on chrome. */
export function globalRailButtonClass(active = false) {
  return cn(
    // size-8 (32px) — tighter pad around icons than size-9
    "relative inline-flex size-8 cursor-pointer items-center justify-center rounded-lg transition-[background-color,color] duration-[180ms] ease-out",
    active
      ? "bg-primary-soft text-primary"
      : "text-muted-foreground hover:bg-surface-ghost-hover hover:text-foreground",
  );
}

function globalRailIconSize(size: "sm" | "md") {
  return size === "sm" ? "size-4.5" : "size-4.5";
}

export function globalRailPrimaryIconClass(size: "sm" | "md" = "md") {
  return cn(
    globalRailIconSize(size),
    "text-current transition-opacity duration-150 group-hover/panel-toggle:opacity-0",
  );
}

export function globalRailHoverIconClass(size: "sm" | "md" = "md") {
  return cn(
    globalRailIconSize(size),
    "absolute inset-0 m-auto text-current opacity-0 transition-opacity duration-150 group-hover/panel-toggle:opacity-100",
  );
}

/** Edge tab for Quick Schedule — neutral, sits against global sidebar. */
export function globalRailTabClass() {
  return cn(
    "group/panel-toggle relative z-30 flex size-8 cursor-pointer items-center justify-center rounded-l-lg border border-r-0 border-sidebar-border bg-sidebar text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
  );
}

/** Rounded square — global access panel header. */
export function panelToggleSquareClass(size: "sm" | "md" = "md") {
  return panelToggleButtonClass(
    "shrink-0 border-transparent",
    size === "sm" ? "size-7 rounded-lg" : "size-8 rounded-lg",
  );
}

/** D-tab on the drawer edge — Quick Schedule open/close. */
export function panelToggleTabClass() {
  return panelToggleButtonClass(
    "z-30 size-8 rounded-l-lg border-r-0 border-sidebar-border bg-sidebar hover:border-sidebar-border hover:bg-sidebar-accent",
  );
}
