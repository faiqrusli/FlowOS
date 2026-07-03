/** Must match `gap-3` on `.tasks-board-scroll`. */
export const BOARD_COLUMN_GAP = "0.75rem";

/** Width of the group reorder drop indicator (`w-0.5`). */
export const GROUP_DROP_LINE_WIDTH = "0.125rem";

/** Center a drop line in the flex gutter between two column slots. */
export function getGroupDropMarkerStyle(balancedInGap: boolean): {
  left: string;
  transform: string;
} {
  if (balancedInGap) {
    return {
      left: `calc(-1 * ${BOARD_COLUMN_GAP} / 2)`,
      transform: "translateX(-50%)",
    };
  }

  return {
    left: "0",
    transform: "translateX(-50%)",
  };
}
