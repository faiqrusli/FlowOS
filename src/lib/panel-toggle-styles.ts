import { cn } from "@/lib/utils";
import {
  SHELL_NAV_ICON_PX,
  SHELL_UTILITY_ACTIVE_RADIUS_PX,
  SHELL_UTILITY_BUTTON_PX,
} from "@/lib/shell-dimensions";

/** Shared Quick Schedule / global access panel toggle chrome. */
export const PANEL_TOGGLE_ICON_CLASS = "text-accent-text";

export function panelToggleButtonClass(
  ...extra: (string | false | null | undefined)[]
) {
  return cn(
    "group/panel-toggle relative flex items-center justify-center border text-accent-text transition-colors hover:border-border-subtle/60 hover:bg-surface-hover",
    ...extra
  );
}

function panelToggleIconSize(size: "sm" | "md") {
  return size === "sm" ? "size-[18px]" : "size-4";
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

/** Right utility rail — quiet tool selection, not primary nav. */
export function globalRailButtonClass(active = false) {
  return cn(
    "inline-flex items-center justify-center transition-[color,background-color] duration-150",
    active
      ? "bg-primary-subtle text-primary"
      : "text-muted-foreground hover:bg-surface-hover hover:text-foreground/80"
  );
}

export function globalRailButtonStyle() {
  return {
    width: SHELL_UTILITY_BUTTON_PX,
    height: SHELL_UTILITY_BUTTON_PX,
    borderRadius: SHELL_UTILITY_ACTIVE_RADIUS_PX,
  } as const;
}

/** 18px optical canvas — matches left nav. */
export const GLOBAL_RAIL_ICON_CLASS = "shrink-0 stroke-[1.75]";

export function globalRailIconStyle() {
  return {
    width: SHELL_NAV_ICON_PX,
    height: SHELL_NAV_ICON_PX,
  } as const;
}

/** Collapsed expand / panel collapse — 40×40, no resting fill. */
export function globalRailCollapseButtonClass() {
  return cn(
    "inline-flex items-center justify-center text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
  );
}

export function globalRailCollapseButtonStyle() {
  return {
    width: SHELL_UTILITY_BUTTON_PX,
    height: SHELL_UTILITY_BUTTON_PX,
    borderRadius: SHELL_UTILITY_ACTIVE_RADIUS_PX,
  } as const;
}

export function globalRailPrimaryIconClass(_size: "sm" | "md" = "md") {
  return cn(
    GLOBAL_RAIL_ICON_CLASS,
    "text-current transition-opacity duration-150 group-hover/panel-toggle:opacity-0"
  );
}

export function globalRailHoverIconClass(_size: "sm" | "md" = "md") {
  return cn(
    GLOBAL_RAIL_ICON_CLASS,
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
