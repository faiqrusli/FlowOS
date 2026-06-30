import type { FlowOsDragData } from "@/lib/dnd/drag-types";

/** Placeholder helpers for future dnd-kit drag data parsing. */

export function isTaskDragData(
  data: unknown
): data is Extract<FlowOsDragData, { type: "task" }> {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    (data as FlowOsDragData).type === "task"
  );
}

export function isGroupDragData(
  data: unknown
): data is Extract<FlowOsDragData, { type: "group" }> {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    (data as FlowOsDragData).type === "group"
  );
}

export function isTimelineDragData(
  data: unknown
): data is Extract<FlowOsDragData, { type: "timeline" }> {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    (data as FlowOsDragData).type === "timeline"
  );
}

export function isColumnActiveDropData(
  data: unknown
): data is Extract<FlowOsDragData, { type: "column-active" }> {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    (data as FlowOsDragData).type === "column-active"
  );
}

export function isColumnActiveEndDropData(
  data: unknown
): data is Extract<FlowOsDragData, { type: "column-active-end" }> {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    (data as FlowOsDragData).type === "column-active-end"
  );
}

export function isColumnCompletedDropData(
  data: unknown
): data is Extract<FlowOsDragData, { type: "column-completed" }> {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    (data as FlowOsDragData).type === "column-completed"
  );
}

export function pointerFromActivatorEvent(event: {
  activatorEvent: Event | null;
}): { x: number; y: number } | null {
  const activator = event.activatorEvent;
  if (!activator || !("clientX" in activator) || !("clientY" in activator)) {
    return null;
  }
  const pointer = activator as MouseEvent;
  return {
    x: pointer.clientX,
    y: pointer.clientY,
  };
}

export function pointerFromDragDelta(event: {
  activatorEvent: Event | null;
  delta: { x: number; y: number };
}): { x: number; y: number } | null {
  const activator = event.activatorEvent;
  if (!activator || !("clientX" in activator) || !("clientY" in activator)) {
    return null;
  }
  const pointer = activator as MouseEvent;
  return {
    x: pointer.clientX + event.delta.x,
    y: pointer.clientY + event.delta.y,
  };
}
