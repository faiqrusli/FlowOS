import type { DropBeforeId } from "@/lib/list-drag-utils";

type RowMidpoint = { id: string; midpointY: number };

const columnRows = new Map<string, RowMidpoint[]>();
let cacheColumnId: string | null = null;

/** Drop cached midpoints when the pointer enters a different column. */
export function invalidatePointerTargetCache(groupId?: string) {
  if (groupId === undefined || cacheColumnId === groupId) {
    columnRows.delete(cacheColumnId ?? "");
    cacheColumnId = null;
    return;
  }
  columnRows.delete(groupId);
}

export function resolveBeforeTaskIdFromPointerMidpoints(
  groupId: string,
  orderedActiveIds: string[],
  container: HTMLElement,
  clientY: number,
  draggingTaskId: string
): DropBeforeId {
  const visibleIds = draggingTaskId
    ? orderedActiveIds.filter((id) => id !== draggingTaskId)
    : orderedActiveIds;

  if (visibleIds.length === 0) return null;

  const containerRect = container.getBoundingClientRect();
  if (clientY < containerRect.top - 8 || clientY > containerRect.bottom + 8) {
    return null;
  }

  let rows = columnRows.get(groupId);
  if (cacheColumnId !== groupId || !rows) {
    rows = [];
    for (const id of visibleIds) {
      const el = container.querySelector<HTMLElement>(`[data-task-row="${id}"]`);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      rows.push({ id, midpointY: rect.top + rect.height / 2 });
    }
    columnRows.set(groupId, rows);
    cacheColumnId = groupId;
  }

  for (const row of rows) {
    if (clientY < row.midpointY) return row.id;
  }

  return null;
}
