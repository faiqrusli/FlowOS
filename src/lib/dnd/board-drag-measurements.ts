import type { DropBeforeId } from "@/lib/list-drag-utils";

export type CachedColumnRect = {
  id: string;
  left: number;
  right: number;
  top: number;
  bottom: number;
  element: HTMLElement;
  collapsed: boolean;
};

export type CachedActiveBodyMetrics = {
  top: number;
  bottom: number;
  completedTop: number | null;
  rowMidpoints: ReadonlyArray<{ id: string; midpointY: number }>;
};

let columnRects: CachedColumnRect[] | null = null;
let columnBoard: HTMLElement | null = null;
let columnBoardScrollLeft = 0;

const activeBodyMetrics = new Map<string, CachedActiveBodyMetrics>();
let activeBodyMetricsGroupId: string | null = null;
let activeBodyMetricsScrollLeft = 0;

function isColumnCollapsed(element: HTMLElement): boolean {
  return element.dataset.taskGroupCollapsed === "true";
}

export function invalidateBoardDragMeasurements(): void {
  columnRects = null;
  columnBoard = null;
  columnBoardScrollLeft = 0;
  activeBodyMetrics.clear();
  activeBodyMetricsGroupId = null;
  activeBodyMetricsScrollLeft = 0;
}

export function invalidateActiveBodyRowMidpoints(groupId?: string): void {
  if (groupId) {
    activeBodyMetrics.delete(groupId);
    if (activeBodyMetricsGroupId === groupId) {
      activeBodyMetricsGroupId = null;
    }
    return;
  }
  activeBodyMetrics.clear();
  activeBodyMetricsGroupId = null;
}

function readColumnRects(board: HTMLElement): CachedColumnRect[] {
  return Array.from(board.querySelectorAll<HTMLElement>("[data-task-group]")).map(
    (element) => {
      const rect = element.getBoundingClientRect();
      const id = element.getAttribute("data-task-group");
      if (!id) {
        throw new Error("Task group column is missing data-task-group");
      }
      return {
        id,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        element,
        collapsed: isColumnCollapsed(element),
      };
    }
  );
}

/** One column-rect read per frame — reused for hit testing and sticky fallback. */
export function getBoardColumnRects(board: HTMLElement): CachedColumnRect[] {
  const scrollLeft = board.scrollLeft;
  if (
    columnRects &&
    columnBoard === board &&
    columnBoardScrollLeft === scrollLeft
  ) {
    return columnRects;
  }

  columnRects = readColumnRects(board);
  columnBoard = board;
  columnBoardScrollLeft = scrollLeft;
  return columnRects;
}

export function findBoardColumnAtPoint(
  board: HTMLElement,
  clientX: number,
  clientY: number,
  stickyColumnId?: string | null
): CachedColumnRect | null {
  const columns = getBoardColumnRects(board).filter((column) => !column.collapsed);

  for (const column of columns) {
    if (
      clientX >= column.left &&
      clientX <= column.right &&
      clientY >= column.top &&
      clientY <= column.bottom
    ) {
      return column;
    }
  }

  if (stickyColumnId) {
    const sticky = columns.find((column) => column.id === stickyColumnId);
    if (
      sticky &&
      clientX >= sticky.left &&
      clientX <= sticky.right &&
      clientY >= sticky.top &&
      clientY <= sticky.bottom
    ) {
      return sticky;
    }
  }

  if (columns.length === 0) return null;

  const boardRect = board.getBoundingClientRect();
  if (clientY < boardRect.top || clientY > boardRect.bottom) return null;

  let nearest: CachedColumnRect | null = null;
  let minDistance = Infinity;
  for (const column of columns) {
    const distance =
      clientX < column.left
        ? column.left - clientX
        : clientX > column.right
          ? clientX - column.right
          : 0;
    if (distance < minDistance) {
      minDistance = distance;
      nearest = column;
    }
  }

  return nearest;
}

function readActiveBodyMetrics(
  column: CachedColumnRect,
  orderedActiveIds: readonly string[],
  draggingTaskId: string
): CachedActiveBodyMetrics {
  const activeBody = column.element.querySelector<HTMLElement>(
    "[data-task-active-body]"
  );
  if (!activeBody) {
    return {
      top: column.top,
      bottom: column.bottom,
      completedTop: null,
      rowMidpoints: [],
    };
  }

  const bodyRect = activeBody.getBoundingClientRect();
  const completedBody = column.element.querySelector<HTMLElement>(
    "[data-task-completed-body]"
  );
  const completedTop =
    completedBody && completedBody.offsetHeight > 0
      ? completedBody.getBoundingClientRect().top
      : null;

  const visibleIds = draggingTaskId
    ? orderedActiveIds.filter((id) => id !== draggingTaskId)
    : orderedActiveIds;

  const rowMidpoints: Array<{ id: string; midpointY: number }> = [];
  for (const id of visibleIds) {
    const row = activeBody.querySelector<HTMLElement>(`[data-task-row="${id}"]`);
    if (!row) continue;
    const rect = row.getBoundingClientRect();
    rowMidpoints.push({ id, midpointY: rect.top + rect.height / 2 });
  }

  return {
    top: bodyRect.top,
    bottom: bodyRect.bottom,
    completedTop,
    rowMidpoints,
  };
}

export function getActiveBodyMetrics(
  board: HTMLElement,
  groupId: string,
  orderedActiveIds: readonly string[],
  draggingTaskId: string
): CachedActiveBodyMetrics | null {
  const columns = getBoardColumnRects(board);
  const column = columns.find((item) => item.id === groupId);
  if (!column || column.collapsed) return null;

  const scrollLeft = board.scrollLeft;
  if (
    activeBodyMetricsGroupId === groupId &&
    activeBodyMetricsScrollLeft === scrollLeft
  ) {
    const cached = activeBodyMetrics.get(groupId);
    if (cached) return cached;
  }

  const metrics = readActiveBodyMetrics(column, orderedActiveIds, draggingTaskId);
  activeBodyMetrics.set(groupId, metrics);
  activeBodyMetricsGroupId = groupId;
  activeBodyMetricsScrollLeft = scrollLeft;
  return metrics;
}

export function resolveActiveDropBeforeIdFromMetrics(
  metrics: CachedActiveBodyMetrics,
  clientY: number
): DropBeforeId {
  if (clientY < metrics.top - 8 || clientY > metrics.bottom + 8) {
    return null;
  }
  if (metrics.rowMidpoints.length === 0) return null;

  for (const row of metrics.rowMidpoints) {
    if (clientY < row.midpointY) return row.id;
  }
  return null;
}

export function isPointerInsideColumnRect(
  column: CachedColumnRect,
  clientX: number,
  clientY: number
): boolean {
  return (
    clientX >= column.left &&
    clientX <= column.right &&
    clientY >= column.top &&
    clientY <= column.bottom
  );
}
