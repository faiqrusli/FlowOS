import type { ClientRect, DragOverEvent, Over, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove, hasSortableData } from "@dnd-kit/sortable";
import type { DropBeforeId } from "@/lib/list-drag-utils";
import { isTaskDragData } from "@/lib/dnd/drag-utils";

const INSERT_HYSTERESIS_PX = 6;

function asIdList(items: UniqueIdentifier[]): string[] {
  return items.map(String);
}

type OverRectWithCurrent = {
  current?: {
    translated?: ClientRect | null;
    initial?: ClientRect | null;
  } | null;
};

function getOverRect(over: Over): ClientRect | null {
  const rect = over.rect as ClientRect | OverRectWithCurrent;
  if (!rect) return null;
  if ("current" in rect) {
    return rect.current?.translated ?? rect.current?.initial ?? null;
  }
  return rect as ClientRect;
}

function pointerYFromEvent(event: DragOverEvent): number | null {
  const activator = event.activatorEvent;
  if (!activator || !("clientY" in activator)) return null;
  return (activator as MouseEvent).clientY + event.delta.y;
}

function insertAfterOverItem(event: DragOverEvent, over: Over): boolean {
  const overRect = getOverRect(over);
  const pointerY = pointerYFromEvent(event);
  if (!overRect || pointerY === null) return false;
  const midpoint = overRect.top + overRect.height / 2;
  if (pointerY > midpoint + INSERT_HYSTERESIS_PX) return true;
  if (pointerY < midpoint - INSERT_HYSTERESIS_PX) return false;
  return pointerY > midpoint;
}

function beforeTaskIdFromInsertIndex(
  itemsWithoutDrag: string[],
  insertAt: number
): DropBeforeId {
  if (insertAt >= itemsWithoutDrag.length) return null;
  return itemsWithoutDrag[insertAt] ?? null;
}

/**
 * Derive beforeTaskId from dnd-kit sortable indices — aligned with sortable transforms.
 */
export function resolveManualBeforeTaskIdFromSortable(
  event: DragOverEvent,
  draggingTaskId: string
): DropBeforeId | null {
  const { active, over } = event;
  if (!over || !hasSortableData(over)) return null;

  const overItems = asIdList(over.data.current.sortable.items);
  const overId = String(over.id);
  const overIndex = overItems.indexOf(overId);
  if (overIndex === -1) return null;

  if (hasSortableData(active)) {
    const activeItems = asIdList(active.data.current.sortable.items);
    const activeIndex = activeItems.indexOf(draggingTaskId);
    const sameContainer =
      active.data.current.sortable.containerId ===
      over.data.current.sortable.containerId;

    if (sameContainer && activeIndex !== -1) {
      const reordered = arrayMove([...activeItems], activeIndex, overIndex);
      const newIndex = reordered.indexOf(draggingTaskId);
      if (newIndex === -1) return null;
      return newIndex < reordered.length - 1 ? reordered[newIndex + 1]! : null;
    }
  }

  const without = overItems.filter((id) => id !== draggingTaskId);
  let insertAt = without.indexOf(overId);
  if (insertAt === -1) insertAt = without.length;
  else if (insertAfterOverItem(event, over)) insertAt += 1;

  return beforeTaskIdFromInsertIndex(without, insertAt);
}

export function isSortableTaskOver(event: DragOverEvent): boolean {
  const { over } = event;
  if (!over || !hasSortableData(over)) return false;
  return isTaskDragData(over.data.current);
}
