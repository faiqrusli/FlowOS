import { cn } from "@/lib/utils";

/** Shared Quick Schedule / global access panel toggle chrome. */
export const PANEL_TOGGLE_ICON_CLASS = "text-accent-text";

export function panelToggleButtonClass(
  ...extra: (string | false | null | undefined)[]
) {
  return cn(
    "group/panel-toggle relative flex items-center justify-center border text-accent-text transition-colors hover:border-border/40 hover:bg-muted/60",
    ...extra
  );
}

function panelToggleIconSize(size: "sm" | "md") {
  return size === "sm" ? "size-3.5" : "size-4";
}

export function panelTogglePrimaryIconClass(size: "sm" | "md" = "md") {
  return cn(
    panelToggleIconSize(size),
    PANEL_TOGGLE_ICON_CLASS,
    "transition-opacity duration-150 group-hover/panel-toggle:opacity-0"
  );
}

export function panelToggleHoverIconClass(size: "sm" | "md" = "md") {
  return cn(
    panelToggleIconSize(size),
    PANEL_TOGGLE_ICON_CLASS,
    "absolute opacity-0 transition-opacity duration-150 group-hover/panel-toggle:opacity-100"
  );
}

/** Neutral global sidebar rail — temporary hover/active on chrome. */
export function globalRailButtonClass(active = false) {
  return cn(
    "inline-flex size-10 items-center justify-center rounded-lg transition-colors",
    active
      ? "bg-surface-hover text-foreground"
      : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
  );
}

function globalRailIconSize(size: "sm" | "md") {
  return size === "sm" ? "size-4" : "size-4.5";
}

export function globalRailPrimaryIconClass(size: "sm" | "md" = "md") {
  return cn(
    globalRailIconSize(size),
    "text-current transition-opacity duration-150 group-hover/panel-toggle:opacity-0"
  );
}

export function globalRailHoverIconClass(size: "sm" | "md" = "md") {
  return cn(
    globalRailIconSize(size),
    "absolute text-current opacity-0 transition-opacity duration-150 group-hover/panel-toggle:opacity-100"
  );
}

/** Edge tab for Quick Schedule — neutral, sits against global sidebar. */
export function globalRailTabClass() {
  return cn(
    "group/panel-toggle relative z-30 flex size-8 items-center justify-center rounded-l-lg border border-r-0 border-sidebar-border bg-sidebar text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
  );
}

/** Rounded square — global access panel header. */
export function panelToggleSquareClass(size: "sm" | "md" = "md") {
  return panelToggleButtonClass(
    "shrink-0 border-transparent",
    size === "sm" ? "size-7 rounded-lg" : "size-8 rounded-lg"
  );
}

/** D-tab on the drawer edge — Quick Schedule open/close. */
export function panelToggleTabClass() {
  return panelToggleButtonClass(
    "z-30 size-8 rounded-l-lg border-r-0 border-sidebar-border bg-sidebar hover:border-sidebar-border hover:bg-sidebar-accent"
  );
}
