import { snapCenterToCursor } from "@dnd-kit/modifiers";
import type { Modifier } from "@dnd-kit/core";

/** Keep the dragged task row centered under the pointer. */
export const taskDragOverlayModifiers: Modifier[] = [snapCenterToCursor];
