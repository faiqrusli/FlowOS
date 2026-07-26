/**
 * Left-nav responsive stages — ratios of full shell width (1600px).
 *
 * 1. Comfortable (≥ 70%): expanded rail preferred; user preference wins; KPI on.
 * 2. Collapsed (< 70%, ≥ 50%): auto-collapse icon rail (still left); user may expand; KPI on.
 * 3. Top (< 50%): hamburger top nav; KPI hides with this stage.
 */

/** 100% shell / workplace full-layout width. */
export const SHELL_LAYOUT_FULL_PX = 1600;

/** First density step — left nav stays on the left, collapses to icons. */
export const SHELL_NAV_COLLAPSE_AT_RATIO = 0.7;

/** Second density step — left nav → top bar; KPI hides. */
export const SHELL_NAV_TOP_AT_RATIO = 0.5;

export const SHELL_NAV_AUTO_COLLAPSE_BELOW_PX = Math.round(
  SHELL_LAYOUT_FULL_PX * SHELL_NAV_COLLAPSE_AT_RATIO,
); // 1120

export const SHELL_NAV_TOP_BELOW_PX = Math.round(
  SHELL_LAYOUT_FULL_PX * SHELL_NAV_TOP_AT_RATIO,
); // 800

export type ShellNavStage = "comfortable" | "collapsed" | "top";

export function resolveShellNavStage(viewportWidth: number): ShellNavStage {
  if (viewportWidth < SHELL_NAV_TOP_BELOW_PX) return "top";
  if (viewportWidth < SHELL_NAV_AUTO_COLLAPSE_BELOW_PX) return "collapsed";
  return "comfortable";
}
