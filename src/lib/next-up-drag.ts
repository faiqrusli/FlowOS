import {
  TIMELINE_DRAG_ID_MIME,
  TIMELINE_DRAG_KIND_MIME,
} from "@/lib/timeline-drag";
import type { NextUpItemSource } from "@/types/next-up";

export const NEXT_UP_REORDER_ID_MIME = "application/x-flowos-next-up-reorder-id";
export const TIMELINE_DRAG_SOURCE_MIME = "application/x-flowos-drag-source";

export type ScheduleDropPayload = {
  kind: "task" | "habit";
  id: string;
  source: NextUpItemSource;
};

export function isScheduleKindDrag(
  event: Pick<DragEvent, "dataTransfer">
): boolean {
  return Boolean(
    event.dataTransfer?.types.includes(TIMELINE_DRAG_KIND_MIME)
  );
}

export function isNextUpReorderDrag(
  event: Pick<DragEvent, "dataTransfer">
): boolean {
  return Boolean(
    event.dataTransfer?.types.includes(NEXT_UP_REORDER_ID_MIME)
  );
}

export function setNextUpReorderDrag(
  event: { dataTransfer: DataTransfer },
  itemId: string
): void {
  event.dataTransfer.setData(NEXT_UP_REORDER_ID_MIME, itemId);
  event.dataTransfer.effectAllowed = "move";
}

export function parseNextUpReorderDrop(
  event: Pick<DragEvent, "dataTransfer">
): string | null {
  const id = event.dataTransfer?.getData(NEXT_UP_REORDER_ID_MIME);
  return id || null;
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
  if (!isScheduleKindDrag(event) || isNextUpReorderDrag(event)) return;
  event.dataTransfer.dropEffect = "move";
}
