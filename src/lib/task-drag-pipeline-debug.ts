/**
 * Cross-group → Manual drag pipeline debug.
 *
 * @see ./task-drag-pipeline-debug.md — how to run, read traces, and what was fixed
 *
 * Console filter: `cross-group-manual`
 * Active only when NODE_ENV !== "production"
 */
import type { DropBeforeId } from "@/lib/list-drag-utils";
import type { ManualOrderUpdate } from "@/lib/manual-order";
import { filterTasksForGroup, sortActiveAndCompleted } from "@/lib/task-groups";
import type { Task, TaskGroupWithTasks } from "@/types/task";
import type { TaskDragTarget } from "@/lib/task-drag-utils";

const ENABLED = process.env.NODE_ENV !== "production";

function displayedActiveIds(
  group: TaskGroupWithTasks,
  tasks: Task[],
  todayViewDate: string
): string[] {
  const visible = filterTasksForGroup(group, tasks, todayViewDate);
  return sortActiveAndCompleted(visible, group).active.map((task) => task.id);
}

function displayedActiveTasks(
  group: TaskGroupWithTasks,
  tasks: Task[],
  todayViewDate: string
): Task[] {
  const visible = filterTasksForGroup(group, tasks, todayViewDate);
  return sortActiveAndCompleted(visible, group).active;
}

export type CrossGroupManualTrace = {
  traceId: string;
  movingTaskId: string;
  sourceGroupId: string | null;
  destinationGroupId: string;
  pointerY: number | null;
  previewBeforeTaskId: DropBeforeId | null;
  frozenBeforeTaskId: DropBeforeId | null;
  /** Expected order from frozen beforeTaskId — contract for entire pipeline. */
  expectedOrder: string[];
  lastLoggedStage: string | null;
  divergenceStage: string | null;
};

let activeTrace: CrossGroupManualTrace | null = null;
let lastPreviewKey: string | null = null;

function traceEnabled(): boolean {
  return ENABLED;
}

function shortId(id: string): string {
  return id.slice(0, 8);
}

export function insertionIndexFromBefore(
  taskIds: string[],
  beforeTaskId: DropBeforeId,
  movingTaskId?: string
): number {
  const without = movingTaskId
    ? taskIds.filter((id) => id !== movingTaskId)
    : taskIds;
  if (beforeTaskId === null) return without.length;
  const index = without.findIndex((id) => id === beforeTaskId);
  return index;
}

export function expectedOrderFromBefore(
  destinationIds: string[],
  movingTaskId: string,
  beforeTaskId: DropBeforeId
): string[] {
  const without = destinationIds.filter((id) => id !== movingTaskId);
  const insertIndex = insertionIndexFromBefore(
    destinationIds,
    beforeTaskId,
    movingTaskId
  );
  if (insertIndex === -1) {
    return [...without, movingTaskId];
  }
  const next = [...without];
  next.splice(insertIndex, 0, movingTaskId);
  return next;
}

function orderLabel(ids: string[]): string {
  return ids.map(shortId).join(" → ");
}

function compareOrders(expected: string[], actual: string[]): boolean {
  if (expected.length !== actual.length) return false;
  return expected.every((id, index) => id === actual[index]);
}

function logStage(
  stage: string,
  payload: Record<string, unknown>,
  actualIds: string[],
  options?: { compareToPreview?: boolean }
): void {
  if (!activeTrace || !traceEnabled()) return;

  const expected = activeTrace.expectedOrder;
  const matchesPreview = compareOrders(expected, actualIds);
  const matchesPrevious =
    activeTrace.lastLoggedStage === null ? true : matchesPreview;

  const header = `[cross-group-manual] ${stage}`;
  console.groupCollapsed(
    `${header} — Matches Preview: ${matchesPreview ? "YES" : "NO"}`
  );
  console.log("Expected:", orderLabel(expected));
  console.log("Actual:", orderLabel(actualIds));
  console.log("Details:", payload);

  if (!matchesPreview && !activeTrace.divergenceStage) {
    activeTrace.divergenceStage = stage;
    console.warn(
      `${header} — DIVERGENCE DETECTED (first mismatch in pipeline)`
    );
    console.warn("Frozen beforeTaskId:", activeTrace.frozenBeforeTaskId);
    console.warn("Preview beforeTaskId:", activeTrace.previewBeforeTaskId);
  }

  if (options?.compareToPreview !== false && !matchesPrevious) {
    console.warn(`Order changed since prior stage (${activeTrace.lastLoggedStage})`);
  }

  console.groupEnd();

  activeTrace.lastLoggedStage = stage;
}

export function isCrossGroupManualTraceActive(
  movingTaskId?: string,
  destinationGroupId?: string
): boolean {
  if (!activeTrace) return false;
  if (movingTaskId && activeTrace.movingTaskId !== movingTaskId) return false;
  if (destinationGroupId && activeTrace.destinationGroupId !== destinationGroupId) {
    return false;
  }
  return true;
}

export function clearCrossGroupManualTrace(): void {
  activeTrace = null;
  lastPreviewKey = null;
}

export function maybeLogPreviewStage(args: {
  movingTaskId: string;
  sourceGroupId: string | null;
  destinationGroup: TaskGroupWithTasks;
  todayViewDate: string;
  pointerY: number;
  target: TaskDragTarget;
}): void {
  if (!traceEnabled()) return;
  if (args.target.zone !== "active") return;
  if (args.sourceGroupId === args.destinationGroup.id) return;

  const destinationIds = displayedActiveIds(
    args.destinationGroup,
    args.destinationGroup.tasks,
    args.todayViewDate
  );

  const previewKey = `${args.target.groupId}:${args.target.beforeTaskId}:${args.pointerY}`;
  if (previewKey === lastPreviewKey) return;
  lastPreviewKey = previewKey;

  const expected = expectedOrderFromBefore(
    destinationIds,
    args.movingTaskId,
    args.target.beforeTaskId
  );

  console.groupCollapsed("[cross-group-manual] 1. PREVIEW (live)");
  console.log("Source group:", args.sourceGroupId);
  console.log("Destination group:", args.destinationGroup.id);
  console.log("Pointer Y:", args.pointerY);
  console.log("Displayed destination task ids:", destinationIds.map(shortId));
  console.log("Preview beforeTaskId:", args.target.beforeTaskId);
  console.log(
    "Preview insertion index:",
    insertionIndexFromBefore(
      destinationIds,
      args.target.beforeTaskId,
      args.movingTaskId
    )
  );
  console.log("Expected order:", orderLabel(expected));
  console.groupEnd();
}

export function beginCrossGroupManualTrace(args: {
  movingTaskId: string;
  sourceGroupId: string | null;
  destinationGroupId: string;
  pointerY: number;
  previewTarget: TaskDragTarget;
  frozenTarget: TaskDragTarget;
  destinationDisplayedIds: string[];
}): CrossGroupManualTrace | null {
  if (!traceEnabled()) return null;

  const expectedOrder = expectedOrderFromBefore(
    args.destinationDisplayedIds,
    args.movingTaskId,
    args.frozenTarget.beforeTaskId
  );

  activeTrace = {
    traceId: `${Date.now()}-${shortId(args.movingTaskId)}`,
    movingTaskId: args.movingTaskId,
    sourceGroupId: args.sourceGroupId,
    destinationGroupId: args.destinationGroupId,
    pointerY: args.pointerY,
    previewBeforeTaskId: args.previewTarget.beforeTaskId,
    frozenBeforeTaskId: args.frozenTarget.beforeTaskId,
    expectedOrder,
    lastLoggedStage: null,
    divergenceStage: null,
  };

  const previewMatchesFrozen =
    args.previewTarget.groupId === args.frozenTarget.groupId &&
    args.previewTarget.beforeTaskId === args.frozenTarget.beforeTaskId;

  console.group("[cross-group-manual] TRACE START", activeTrace.traceId);
  console.log("1. PREVIEW (at commit)");
  console.log("  Source group:", args.sourceGroupId);
  console.log("  Destination group:", args.destinationGroupId);
  console.log("  Pointer Y:", args.pointerY);
  console.log(
    "  Displayed destination task ids:",
    args.destinationDisplayedIds.map(shortId)
  );
  console.log("  Preview beforeTaskId:", args.previewTarget.beforeTaskId);
  console.log(
    "  Preview insertion index:",
    insertionIndexFromBefore(
      args.destinationDisplayedIds,
      args.previewTarget.beforeTaskId,
      args.movingTaskId
    )
  );
  console.log("2. FROZEN COMMIT");
  console.log("  Frozen beforeTaskId:", args.frozenTarget.beforeTaskId);
  console.log(
    "  Frozen insertion index:",
    insertionIndexFromBefore(
      args.destinationDisplayedIds,
      args.frozenTarget.beforeTaskId,
      args.movingTaskId
    )
  );
  console.log("  Frozen destination group:", args.frozenTarget.groupId);
  console.log(
    "  Preview === Frozen:",
    previewMatchesFrozen ? "YES" : "NO"
  );
  console.log("  Contract expected order:", orderLabel(expectedOrder));
  console.groupEnd();

  return activeTrace;
}

export function logMoveTaskInBoardStep(args: {
  step: string;
  board: TaskGroupWithTasks[];
  destinationGroupId: string;
  movingTaskId: string;
  todayViewDate: string;
  extra?: Record<string, unknown>;
}): void {
  if (!isCrossGroupManualTraceActive(args.movingTaskId, args.destinationGroupId)) {
    return;
  }

  const destGroup = args.board.find((g) => g.id === args.destinationGroupId);
  const sourceGroupId = activeTrace?.sourceGroupId;
  const sourceGroup = sourceGroupId
    ? args.board.find((g) => g.id === sourceGroupId)
    : null;

  const destDisplayed = destGroup
    ? displayedActiveIds(destGroup, destGroup.tasks, args.todayViewDate)
    : [];
  const destRaw = destGroup?.tasks.map((t) => t.id) ?? [];
  const destOrders = destGroup
    ? Object.fromEntries(
        destGroup.tasks.map((t) => [shortId(t.id), t.sort_order])
      )
    : {};
  const sourceIds = sourceGroup
    ? displayedActiveIds(sourceGroup, sourceGroup.tasks, args.todayViewDate)
    : [];

  const moved = destGroup?.tasks.find((t) => t.id === args.movingTaskId);

  logStage(
    `moveTaskInBoard: ${args.step}`,
    {
      sourceDisplayedOrder: sourceIds.map(shortId),
      destinationDisplayedOrder: destDisplayed.map(shortId),
      destinationRawTaskIds: destRaw.map(shortId),
      destinationSortOrders: destOrders,
      movedTaskSortOrder: moved?.sort_order ?? null,
      ...args.extra,
    },
    destDisplayed
  );
}

export function logBeforeMoveTaskInBoard(args: {
  board: TaskGroupWithTasks[];
  destinationGroupId: string;
  movingTaskId: string;
  beforeTaskId: DropBeforeId;
  todayViewDate: string;
  sourceGroupId: string | null;
}): void {
  if (!isCrossGroupManualTraceActive(args.movingTaskId, args.destinationGroupId)) {
    return;
  }

  const destGroup = args.board.find((g) => g.id === args.destinationGroupId);
  const sourceGroup = args.sourceGroupId
    ? args.board.find((g) => g.id === args.sourceGroupId)
    : null;

  const destIds = destGroup
    ? displayedActiveIds(destGroup, destGroup.tasks, args.todayViewDate)
    : [];
  const sourceIds = sourceGroup
    ? displayedActiveIds(sourceGroup, sourceGroup.tasks, args.todayViewDate)
    : [];

  console.groupCollapsed("[cross-group-manual] 3. BEFORE moveTaskInBoard()");
  console.log("Destination displayed order:", destIds.map(shortId));
  console.log("Source displayed order:", sourceIds.map(shortId));
  console.log("beforeTaskId:", args.beforeTaskId);
  console.groupEnd();
}

export function logAfterMoveTaskInBoard(args: {
  board: TaskGroupWithTasks[];
  destinationGroupId: string;
  movingTaskId: string;
  beforeTaskId: DropBeforeId;
  todayViewDate: string;
}): void {
  if (!isCrossGroupManualTraceActive(args.movingTaskId, args.destinationGroupId)) {
    return;
  }

  const destGroup = args.board.find((g) => g.id === args.destinationGroupId);
  if (!destGroup) return;

  const destIds = displayedActiveIds(
    destGroup,
    destGroup.tasks,
    args.todayViewDate
  );

  const moved = destGroup.tasks.find((t) => t.id === args.movingTaskId);

  logStage(
    "4. AFTER moveTaskInBoard()",
    {
      destinationDisplayedOrder: destIds.map(shortId),
      movedTaskId: args.movingTaskId,
      movedTaskManualOrder: moved?.sort_order ?? null,
      beforeTaskId: args.beforeTaskId,
    },
    destIds
  );
}

export function logBeforeComputeManualReorderUpdates(args: {
  inputArray: Task[];
  beforeTaskId: DropBeforeId;
  movingTaskId: string;
}): void {
  if (!isCrossGroupManualTraceActive(args.movingTaskId)) return;

  const inputIds = args.inputArray.map((t) => t.id);
  const expectedIndex = insertionIndexFromBefore(
    inputIds.filter((id) => id !== args.movingTaskId),
    args.beforeTaskId
  );

  console.groupCollapsed("[cross-group-manual] 5. BEFORE computeManualReorderUpdates()");
  console.log("Input array:", inputIds.map(shortId));
  console.log("beforeTaskId:", args.beforeTaskId);
  console.log("Expected insertion index:", expectedIndex);
  console.log(
    "Contract expected order:",
    orderLabel(activeTrace!.expectedOrder)
  );
  console.groupEnd();
}

export function logAfterComputeManualReorderUpdates(args: {
  inputArray: Task[];
  updates: ManualOrderUpdate[];
  movingTaskId: string;
}): void {
  if (!isCrossGroupManualTraceActive(args.movingTaskId)) return;

  const orderById = new Map(
    args.inputArray.map((task) => [task.id, task.sort_order])
  );
  for (const update of args.updates) {
    orderById.set(update.id, update.sort_order);
  }

  const outputIds = [...args.inputArray]
    .sort((a, b) => {
      const ao = orderById.get(a.id) ?? a.sort_order;
      const bo = orderById.get(b.id) ?? b.sort_order;
      if (ao !== bo) return ao - bo;
      return a.created_at.localeCompare(b.created_at);
    })
    .map((t) => t.id);

  const manualOrders = Object.fromEntries(
    [...orderById.entries()].map(([id, sort_order]) => [shortId(id), sort_order])
  );

  logStage(
    "6. AFTER computeManualReorderUpdates()",
    {
      outputOrder: outputIds.map(shortId),
      manualOrderValues: manualOrders,
      updates: args.updates,
    },
    outputIds
  );
}

export function logAfterApplyManualInsert(args: {
  finalDisplayedIds: string[];
  movingTaskId: string;
}): void {
  if (!isCrossGroupManualTraceActive(args.movingTaskId)) return;

  logStage("6b. AFTER applyManualActiveInsertToGroup()", {}, args.finalDisplayedIds);
}

export function logAfterReactRender(args: {
  board: TaskGroupWithTasks[];
  destinationGroupId: string;
  movingTaskId: string;
  todayViewDate: string;
}): void {
  if (!isCrossGroupManualTraceActive(args.movingTaskId, args.destinationGroupId)) {
    return;
  }

  const destGroup = args.board.find((g) => g.id === args.destinationGroupId);
  if (!destGroup) return;

  const displayed = displayedActiveTasks(
    destGroup,
    destGroup.tasks,
    args.todayViewDate
  );

  const renderedIds = displayed.map((t) => t.id);
  const renderedOrders = Object.fromEntries(
    displayed.map((t) => [shortId(t.id), t.sort_order])
  );
  const renderedPosition = renderedIds.indexOf(args.movingTaskId);

  logStage(
    "7. AFTER React render (board state)",
    {
      renderedTaskIds: renderedIds.map(shortId),
      renderedManualOrder: renderedOrders,
      renderedPosition,
    },
    renderedIds
  );

  if (activeTrace) {
    console.group("[cross-group-manual] TRACE SUMMARY", activeTrace.traceId);
    console.log("Expected:", orderLabel(activeTrace.expectedOrder));
    console.log("Final:", orderLabel(renderedIds));
    console.log(
      "Matches Preview:",
      compareOrders(activeTrace.expectedOrder, renderedIds) ? "YES" : "NO"
    );
    if (activeTrace.divergenceStage) {
      console.warn(
        "First divergence at stage:",
        activeTrace.divergenceStage
      );
    } else if (!compareOrders(activeTrace.expectedOrder, renderedIds)) {
      console.warn("Divergence not caught at intermediate stage — check stage 7 only");
    } else {
      console.log("Pipeline consistent through all logged stages.");
    }
    console.groupEnd();
  }

  clearCrossGroupManualTrace();
}
