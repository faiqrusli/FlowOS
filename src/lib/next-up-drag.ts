import {
  TIMELINE_DRAG_ID_MIME,
  TIMELINE_DRAG_KIND_MIME,
  getActiveTimelineDrag,
  setActiveTaskDragId,
  setActiveTimelineDrag,
} from "@/lib/timeline-drag";
import type { NextUpItemSource } from "@/types/next-up";

export const NEXT_UP_REORDER_ID_MIME = "application/x-flowos-next-up-reorder-id";
export const TIMELINE_DRAG_SOURCE_MIME = "application/x-flowos-drag-source";
export const NEXT_UP_TIMELINE_DRAG_SOURCE = "next-up";

export type ScheduleDropPayload = {
  kind: "task" | "habit";
  id: string;
  source: NextUpItemSource;
};

/** DOMStringList (Firefox) uses contains; Chromium exposes includes. */
function dataTransferHasType(
  types: DataTransfer["types"] | undefined,
  type: string
): boolean {
  if (!types) return false;
  const list = types as DataTransfer["types"] & {
    contains?: (value: string) => boolean;
    includes?: (value: string) => boolean;
  };
  if (typeof list.contains === "function") return list.contains(type);
  if (typeof list.includes === "function") return list.includes(type);
  return Array.from(list as ArrayLike<string>).includes(type);
}

export function isScheduleKindDrag(
  event: Pick<DragEvent, "dataTransfer">
): boolean {
  if (dataTransferHasType(event.dataTransfer?.types, TIMELINE_DRAG_KIND_MIME)) {
    return true;
  }
  // Fallback when MIME types are hidden mid-drag but module state is set.
  return getActiveTimelineDrag() != null;
}

export function isNextUpReorderDrag(
  event: Pick<DragEvent, "dataTransfer">
): boolean {
  return dataTransferHasType(
    event.dataTransfer?.types,
    NEXT_UP_REORDER_ID_MIME
  );
}

export function setNextUpReorderDrag(
  event: { dataTransfer: DataTransfer },
  itemId: string
): void {
  event.dataTransfer.setData(NEXT_UP_REORDER_ID_MIME, itemId);
  event.dataTransfer.effectAllowed = "move";
}

/** Reorder within Next Up + schedule onto the timeline (dual MIME). */
export function setNextUpQueueDrag(
  event: { dataTransfer: DataTransfer },
  kind: "task" | "habit",
  id: string,
  reorderKey: string
): void {
  setNextUpReorderDrag(event, reorderKey);
  event.dataTransfer.setData(TIMELINE_DRAG_KIND_MIME, kind);
  event.dataTransfer.setData(TIMELINE_DRAG_ID_MIME, id);
  event.dataTransfer.setData("text/plain", id);
  event.dataTransfer.setData(
    TIMELINE_DRAG_SOURCE_MIME,
    NEXT_UP_TIMELINE_DRAG_SOURCE
  );
  setActiveTimelineDrag({ kind, id });
  if (kind === "task") {
    setActiveTaskDragId(id);
  }
}

export function clearNextUpQueueDrag(): void {
  setActiveTaskDragId(null);
  setActiveTimelineDrag(null);
}

export function parseNextUpReorderDrop(
  event: Pick<DragEvent, "dataTransfer">
): string | null {
  const id = event.dataTransfer?.getData(NEXT_UP_REORDER_ID_MIME);
  return id || null;
}

export function isNextUpTimelineDragSource(
  event: Pick<DragEvent, "dataTransfer">
): boolean {
  return (
    event.dataTransfer?.getData(TIMELINE_DRAG_SOURCE_MIME) ===
    NEXT_UP_TIMELINE_DRAG_SOURCE
  );
}

export function inferNextUpDropSource(
  kind: "task" | "habit",
  dragSource: string | null
): NextUpItemSource {
  if (dragSource) return "timeline";
  return kind === "task" ? "tasks" : "habits";
}

export function parseScheduleDrop(
  event: Pick<DragEvent, "dataTransfer">
): ScheduleDropPayload | null {
  const transfer = event.dataTransfer;
  if (!transfer || !isScheduleKindDrag(event)) return null;

  const kind = transfer.getData(TIMELINE_DRAG_KIND_MIME);
  const id =
    transfer.getData(TIMELINE_DRAG_ID_MIME) || transfer.getData("text/plain");

  if ((kind !== "task" && kind !== "habit") || !id) return null;

  const dragSource = transfer.getData(TIMELINE_DRAG_SOURCE_MIME) || null;
  return {
    kind,
    id,
    source: inferNextUpDropSource(kind, dragSource),
  };
}

export function acceptNextUpScheduleDrag(
  event: Pick<DragEvent, "dataTransfer">
): void {
  if (!event.dataTransfer) return;
  if (isNextUpReorderDrag(event) || !isScheduleKindDrag(event)) return;
  event.dataTransfer.dropEffect = "move";
}
