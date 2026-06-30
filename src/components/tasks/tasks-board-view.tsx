"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  CalendarClock,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock,
  GripVertical,
  MoreHorizontal,
  Palette,
  Pencil,
  Plus,
  Smile,
  Trash2,
} from "lucide-react";
import { TaskGroupPill } from "@/components/tasks/task-group-pill";
import { TaskGroupColorChooser } from "@/components/tasks/task-group-color-chooser";
import {
  TaskGroupDialog,
  type TaskGroupCreateInput,
} from "@/components/tasks/task-group-dialog";
import { GrowthAreaIconChooser } from "@/components/notes/growth-area-icon-chooser";
import { Button } from "@/components/ui/button";
import { type } from "@/lib/typography";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getTodayDateString,
  getTomorrowDateString,
  getYesterdayDateString,
  shiftDateKey,
} from "@/lib/date-utils";
import {
  initialDropBeforeId,
  resolveDropBeforeId,
  setDragImageFromElement,
  type DropBeforeId,
} from "@/lib/list-drag-utils";
import {
  consumeTimelineDropConsumed,
  getActiveTaskDragId,
  isPointerOverTimelineScheduler,
  isQuickScheduleOpen,
  setActiveTaskDragId,
  setQuickScheduleOpen,
} from "@/lib/timeline-drag";
import {
  filterTasksForGroup,
  formatTodayColumnTitle,
  getGroupDisplayTitle,
  canReorderTasksInGroup,
  isInboxGroup,
  isLaterGroup,
  isPinnedTaskGroup,
  isTodayGroup,
  sortActiveAndCompleted,
  taskBelongsInLaterView,
} from "@/lib/task-groups";
import {
  getTaskGroupSortMode,
  isSortableTaskColumn,
  REORDER_DISABLED_TOOLTIP,
  type TaskSortMode,
} from "@/lib/task-sort";
import { TaskSortMenu } from "@/components/tasks/task-sort-menu";
import {
  TaskBoardActionsProvider,
  type TaskBoardActions,
} from "@/components/tasks/task-board-actions-context";
import {
  TaskColumnActiveList,
  TaskColumnCompletedList,
  ActiveEmptyDropPlaceholder,
  TaskGroupActiveBody,
  TaskCompletedBody,
} from "@/components/tasks/task-column-active-list";
import {
  getDisplayedActiveTasks,
  isManualActiveDropGroup,
  resolveTaskDropTargetForPointer,
} from "@/lib/task-drop-target";
import {
  beginCrossGroupManualTrace,
  clearCrossGroupManualTrace,
  logAfterMoveTaskInBoard,
  logAfterReactRender,
  logBeforeMoveTaskInBoard,
  maybeLogPreviewStage,
} from "@/lib/task-drag-pipeline-debug";
import {
  applyLiveBoardReorderIfChanged,
  buildInitialTaskDropTarget,
  isTaskDragData,
  refineManualDropTargetFromPointer,
  resolveTaskDropTargetFromDndEvent,
  setTaskBoardDndBridge,
  TaskBoardDragPreviewProvider,
  useTaskBoardDragPreview,
} from "@/lib/dnd";
import {
  blockDragTextSelection,
  unblockDragTextSelection,
} from "@/lib/dnd/drag-select-block";
import { pointerFromActivatorEvent, pointerFromDragDelta } from "@/lib/dnd/drag-utils";
import {
  clearDragPreview,
  shouldPublishDropTargetPreview,
} from "@/lib/dnd/preview-store";
import type { DragOverEvent } from "@dnd-kit/core";
import { applyManualActiveReorder } from "@/lib/manual-reorder";
import type { ManualOrderUpdate } from "@/lib/manual-order";
import { getTaskGroupAppearance, TASK_GROUP_COLUMN_SURFACE_CLASS } from "@/lib/task-group-appearance";
import {
  canAcceptActiveDropTarget,
  isSameGroupActiveReorderAttempt,
  moveGroupInBoard,
  moveTaskInBoard,
  partitionGroupTasks,
  taskDragTargetsEqual,
  type TaskDragTarget,
} from "@/lib/task-drag-utils";
import { cn } from "@/lib/utils";
import type { PlanningState, Task, TaskGroupWithTasks } from "@/types/task";

const BOARD_EDGE_SCROLL_ZONE = 72;
const BOARD_EDGE_SCROLL_SPEED = 8;
const GROUP_COLUMN_WIDTH_CLASS = "w-[300px]";
const GROUP_CHANGE_BLOCKED_HINT =
  "Groups can only be changed in Inbox and Task details.";
const LATER_GROUP_CHANGE_BLOCKED_HINT =
  "🚫 Groups can't be changed from Later.";
const TODAY_GROUP_CHANGE_BLOCKED_HINT =
  "🚫 Groups can't be changed from Today.";
const SYSTEM_VIEW_REORDER_BLOCKED_HINT =
  "🚫 System views can't be reordered.";

type SystemViewInfoKey = "today" | "later" | "inbox";

const SYSTEM_VIEW_INFO: Record<
  SystemViewInfoKey,
  { title: string; paragraphs: string[] }
> = {
  today: {
    title: "📅 Today",
    paragraphs: [
      "View and plan tasks for the selected day. Change the date to plan any day.",
      "Unscheduled shows tasks assigned to the selected day without a scheduled time. Drag them onto the timeline to schedule them.",
    ],
  },
  later: {
    title: "Later",
    paragraphs: [
      "Later stores tasks you've intentionally chosen to schedule another time.",
      "Moving a task to Later removes its scheduled date and time. Drag it to Today or the timeline whenever you're ready.",
    ],
  },
  inbox: {
    title: "📥 Inbox",
    paragraphs: [
      "Inbox is your quick capture space. Add tasks here before organizing them into groups or scheduling them.",
    ],
  },
};

type TasksBoardViewProps = {
  groups: TaskGroupWithTasks[];
  selectedTaskId: string | null;
  todayViewDate: string;
  plannerActive?: boolean;
  onToggleQuickPlanner?: () => void;
  onTodayViewDateChange: (date: string) => void;
  onGroupsChange: (groups: TaskGroupWithTasks[]) => void;
  onSelectTask: (taskId: string | null) => void;
  onCreateTask: (
    groupId: string,
    title: string,
    options?: { scheduledDate?: string | null; planningState?: "none" | "later" }
  ) => Promise<void>;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onToggleComplete: (task: Task) => Promise<void>;
  onDuplicateTask: (task: Task) => Promise<void>;
  onMoveTask: (taskId: string, groupId: string) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onCreateGroup: (input: TaskGroupCreateInput) => Promise<string>;
  onCreateGroupAndMoveTask: (
    input: TaskGroupCreateInput,
    taskId: string
  ) => Promise<string>;
  onRenameGroup: (groupId: string, title: string) => Promise<void>;
  onUpdateGroupIcon: (groupId: string, icon: string) => Promise<void>;
  onUpdateGroupColor: (groupId: string, color: string) => Promise<void>;
  onUpdateGroupSortMode: (groupId: string, sortMode: TaskSortMode) => Promise<void>;
  onDeleteGroup: (groupId: string) => Promise<void>;
  onPersistLayout: (
    groups: TaskGroupWithTasks[],
    options?: {
      todayViewDate?: string;
      previousBoard?: TaskGroupWithTasks[];
      taskDateAssignments?: { taskId: string; scheduledDate: string }[];
    }
  ) => Promise<void>;
  onPersistManualOrder: (updates: ManualOrderUpdate[]) => Promise<void>;
  onShowHint?: (message: string) => void;
  onSetPlanningState?: (taskId: string, planningState: PlanningState) => Promise<void>;
};

type DragKind = "task" | "group" | null;

function movableGroupIds(groupList: TaskGroupWithTasks[]) {
  return groupList.filter((group) => !isPinnedTaskGroup(group)).map((group) => group.id);
}

function boardGroupIds(groupList: TaskGroupWithTasks[]) {
  return groupList.map((group) => group.id);
}

function findBoardGroupColumnAtPoint(
  board: HTMLElement,
  clientX: number,
  clientY: number,
  stickyColumnId?: string | null
): HTMLElement | null {
  const columns = Array.from(
    board.querySelectorAll<HTMLElement>("[data-task-group]")
  );
  if (columns.length === 0) return null;

  for (const column of columns) {
    const rect = column.getBoundingClientRect();
    if (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    ) {
      return column;
    }
  }

  if (stickyColumnId) {
    const stickyColumn = board.querySelector<HTMLElement>(
      `[data-task-group="${stickyColumnId}"]`
    );
    if (stickyColumn) {
      const rect = stickyColumn.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        return stickyColumn;
      }
    }
  }

  const boardRect = board.getBoundingClientRect();
  if (clientY >= boardRect.top && clientY <= boardRect.bottom) {
    let minDistance = Infinity;
    let nearest: HTMLElement | null = null;
    for (const column of columns) {
      const rect = column.getBoundingClientRect();
      const distance =
        clientX < rect.left
          ? rect.left - clientX
          : clientX > rect.right
            ? clientX - rect.right
            : 0;
      if (distance < minDistance) {
        minDistance = distance;
        nearest = column;
      }
    }
    return nearest;
  }

  return null;
}

function resolveGroupReorderBlockState(
  groups: TaskGroupWithTasks[],
  board: HTMLElement,
  clientX: number,
  clientY: number,
  beforeId: DropBeforeId
): { blocked: boolean; pinnedTargetId: string | null } {
  const column = findBoardGroupColumnAtPoint(board, clientX, clientY);
  const hoveredGroupId = column?.getAttribute("data-task-group") ?? null;
  const hoveredGroup = hoveredGroupId
    ? groups.find((group) => group.id === hoveredGroupId)
    : null;

  if (hoveredGroup && isPinnedTaskGroup(hoveredGroup)) {
    return { blocked: true, pinnedTargetId: hoveredGroupId };
  }

  if (beforeId) {
    const beforeGroup = groups.find((group) => group.id === beforeId);
    if (beforeGroup && isPinnedTaskGroup(beforeGroup)) {
      return { blocked: true, pinnedTargetId: beforeId };
    }
  }

  return { blocked: false, pinnedTargetId: null };
}

export function TasksBoardView(props: TasksBoardViewProps) {
  return (
    <TaskBoardDragPreviewProvider>
      <TasksBoardViewContent {...props} />
    </TaskBoardDragPreviewProvider>
  );
}

function TasksBoardViewContent({
  groups,
  selectedTaskId,
  todayViewDate,
  plannerActive = false,
  onToggleQuickPlanner,
  onTodayViewDateChange,
  onGroupsChange,
  onSelectTask,
  onCreateTask,
  onUpdateTask,
  onToggleComplete,
  onDuplicateTask,
  onMoveTask,
  onDeleteTask,
  onCreateGroup,
  onCreateGroupAndMoveTask,
  onRenameGroup,
  onUpdateGroupIcon,
  onUpdateGroupColor,
  onUpdateGroupSortMode,
  onDeleteGroup,
  onPersistLayout,
  onPersistManualOrder,
  onShowHint,
  onSetPlanningState,
}: TasksBoardViewProps) {
  const {
    activeTaskId,
    setActiveTaskId: setPreviewActiveTaskId,
    setDropTarget: setPreviewDropTarget,
  } = useTaskBoardDragPreview();
  const boardRef = useRef<HTMLDivElement>(null);
  const groupsRef = useRef(groups);
  const dragKindRef = useRef<DragKind>(null);
  const dragIdRef = useRef<string | null>(null);
  const activeTaskIdRef = useRef<string | null>(null);
  const pointerXRef = useRef(0);
  const pointerYRef = useRef(0);
  const autoScrollRafRef = useRef<number | null>(null);
  const todayViewDateRef = useRef(todayViewDate);
  const todayGroupIdRef = useRef<string | null>(null);
  const laterGroupIdRef = useRef<string | null>(null);
  const plannerActiveRef = useRef(plannerActive);

  const [dragKind, setDragKind] = useState<DragKind>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [externalTaskDragId, setExternalTaskDragId] = useState<string | null>(null);
  const selectedTaskIdRef = useRef(selectedTaskId);
  const [dropBeforeGroupId, setDropBeforeGroupId] = useState<DropBeforeId>(null);
  const taskDropTargetRef = useRef<TaskDragTarget | null>(null);
  const commitDropTargetRef = useRef<TaskDragTarget | null>(null);
  const columnStickyDropRef = useRef<{
    columnId: string;
    target: TaskDragTarget;
  } | null>(null);
  const dropBeforeGroupIdRef = useRef<DropBeforeId>(null);
  const dragEndedRef = useRef(false);
  const groupChangeBlockedNotifiedRef = useRef(false);
  const dragSourceGroupIdRef = useRef<string | null>(null);
  const dragOriginalSourceGroupIdRef = useRef<string | null>(null);
  const dragSnapshotRef = useRef<TaskGroupWithTasks[] | null>(null);
  const lastLiveTargetRef = useRef<TaskDragTarget | null>(null);
  const liveDragAppliedRef = useRef(false);
  const dragPreviewRafRef = useRef<number | null>(null);
  const pendingDragEventRef = useRef<DragOverEvent | null>(null);
  const taskReorderBlockedUiRef = useRef(false);

  const [iconChooserGroupId, setIconChooserGroupId] = useState<string | null>(
    null
  );
  const [colorChooserGroupId, setColorChooserGroupId] = useState<string | null>(
    null
  );
  const [newGroupDialogOpen, setNewGroupDialogOpen] = useState(false);
  const [newGroupMoveTaskId, setNewGroupMoveTaskId] = useState<string | null>(
    null
  );
  const newGroupMoveTaskIdRef = useRef<string | null>(null);
  const [todayTitleOpen, setTodayTitleOpen] = useState(false);
  const [planningQueueDragTooltip, setPlanningQueueDragTooltip] = useState<{
    x: number;
    y: number;
    message: string;
  } | null>(null);
  const [groupReorderBlocked, setGroupReorderBlocked] = useState(false);
  const [groupReorderBlockedTargetId, setGroupReorderBlockedTargetId] = useState<
    string | null
  >(null);
  const [groupReorderDragTooltip, setGroupReorderDragTooltip] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [taskReorderBlockedDragTooltip, setTaskReorderBlockedDragTooltip] =
    useState<{ x: number; y: number } | null>(null);
  const groupReorderBlockedRef = useRef(false);
  const taskReorderBlockedRef = useRef(false);
  const [systemViewInfoOpen, setSystemViewInfoOpen] =
    useState<SystemViewInfoKey | null>(null);

  const todayQuickDates = useMemo(
    () => [
      { key: getYesterdayDateString(), label: "Yesterday" },
      { key: getTodayDateString(), label: "Today" },
      { key: getTomorrowDateString(), label: "Tomorrow" },
    ],
    []
  );

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [completedExpanded, setCompletedExpanded] = useState<Set<string>>(
    new Set()
  );
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [groupTitleDraft, setGroupTitleDraft] = useState("");

  const [composingGroupId, setComposingGroupId] = useState<string | null>(null);
  const [composePlacement, setComposePlacement] = useState<"top" | "bottom">(
    "bottom"
  );
  const [composeText, setComposeText] = useState("");
  const composeRef = useRef<HTMLTextAreaElement>(null);
  const composeContainerRef = useRef<HTMLDivElement>(null);
  const composingGroupIdRef = useRef<string | null>(null);
  const composePlacementRef = useRef<"top" | "bottom">("bottom");
  const composeTextRef = useRef("");
  const onGroupsChangeRef = useRef(onGroupsChange);

  const todayGroup = groups.find((group) => isTodayGroup(group));
  const laterGroup = groups.find((group) => isLaterGroup(group));
  const inboxGroup = groups.find((group) => isInboxGroup(group));

  useEffect(() => {
    composingGroupIdRef.current = composingGroupId;
  }, [composingGroupId]);

  useEffect(() => {
    composePlacementRef.current = composePlacement;
  }, [composePlacement]);

  useEffect(() => {
    composeTextRef.current = composeText;
  }, [composeText]);

  useEffect(() => {
    selectedTaskIdRef.current = selectedTaskId;
  }, [selectedTaskId]);

  useEffect(() => {
    groupsRef.current = groups;
    todayGroupIdRef.current = todayGroup?.id ?? null;
    laterGroupIdRef.current = laterGroup?.id ?? null;
  }, [groups, todayGroup?.id, laterGroup?.id]);

  useEffect(() => {
    onGroupsChangeRef.current = onGroupsChange;
  }, [onGroupsChange]);

  useEffect(() => {
    todayViewDateRef.current = todayViewDate;
  }, [todayViewDate]);

  useEffect(() => {
    plannerActiveRef.current = plannerActive;
    setQuickScheduleOpen(plannerActive);
    if (plannerActive) {
      stopBoardAutoScroll();
      setTaskDropIfChanged(null);
    }
  }, [plannerActive]);

  useEffect(() => {
    if (composingGroupId && composeRef.current) {
      composeRef.current.focus();
    }
  }, [composingGroupId, composePlacement]);

  useEffect(() => {
    if (!composingGroupId) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (composeContainerRef.current?.contains(target)) return;
      const groupId = composingGroupIdRef.current;
      if (!groupId) return;
      void finishCompose(groupId, composeTextRef.current);
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [composingGroupId]);

  useEffect(() => {
    return () => {
      stopBoardAutoScroll();
      unblockDragTextSelection();
    };
  }, []);

  function stopBoardAutoScroll() {
    if (autoScrollRafRef.current !== null) {
      cancelAnimationFrame(autoScrollRafRef.current);
      autoScrollRafRef.current = null;
    }
  }

  function setActiveBoardTaskId(taskId: string | null) {
    activeTaskIdRef.current = taskId;
    setPreviewActiveTaskId(taskId);
  }

  function updatePointerCoordsFromDnd(event: {
    activatorEvent: Event | null;
    delta?: { x: number; y: number };
  }) {
    const coords =
      event.delta !== undefined
        ? pointerFromDragDelta({
            activatorEvent: event.activatorEvent,
            delta: event.delta,
          })
        : pointerFromActivatorEvent(event);
    if (!coords) return;
    pointerXRef.current = coords.x;
    pointerYRef.current = coords.y;
  }

  function getActiveTaskDragIdForDrop() {
    return activeTaskIdRef.current ?? getActiveTaskDragId();
  }

  function findTaskInBoard(taskId: string): Task | null {
    for (const group of groupsRef.current) {
      const task = group.tasks.find((item) => item.id === taskId);
      if (task) return task;
    }
    return null;
  }

  function isDragFromLaterColumn(): boolean {
    const sourceId = dragOriginalSourceGroupIdRef.current;
    if (!sourceId) return false;
    const sourceGroup = groupsRef.current.find((group) => group.id === sourceId);
    return sourceGroup ? isLaterGroup(sourceGroup) : false;
  }

  function isDragFromTodayColumn(): boolean {
    const sourceId = dragOriginalSourceGroupIdRef.current;
    if (!sourceId) return false;
    const sourceGroup = groupsRef.current.find((group) => group.id === sourceId);
    return sourceGroup ? isTodayGroup(sourceGroup) : false;
  }

  function isLaterOriginatedTaskDrag(): boolean {
    if (isDragFromLaterColumn()) return true;
    const taskId = getActiveTaskDragIdForDrop();
    if (!taskId) return false;
    const task = findTaskInBoard(taskId);
    return task ? taskBelongsInLaterView(task) : false;
  }

  function isTodayOriginatedTaskDrag(): boolean {
    return isDragFromTodayColumn();
  }

  function isAllowedPlanningQueueTarget(groupId: string): boolean {
    return (
      (todayGroupIdRef.current !== null &&
        groupId === todayGroupIdRef.current) ||
      (laterGroupIdRef.current !== null && groupId === laterGroupIdRef.current)
    );
  }

  function isBlockedPlanningQueueDrop(
    clientX: number,
    clientY: number,
    groupId?: string
  ): boolean {
    if (!isLaterOriginatedTaskDrag() && !isTodayOriginatedTaskDrag()) {
      return false;
    }
    if (isPointerOverTimeline(clientX, clientY)) return false;

    const targetGroupId =
      groupId ?? targetGroupIdAtPoint(clientX, clientY) ?? null;
    if (!targetGroupId) return false;

    return !isAllowedPlanningQueueTarget(targetGroupId);
  }

  function planningQueueDragBlockedMessage(): string {
    if (isLaterOriginatedTaskDrag()) {
      return LATER_GROUP_CHANGE_BLOCKED_HINT;
    }
    return TODAY_GROUP_CHANGE_BLOCKED_HINT;
  }

  function showPlanningQueueDragTooltip(clientX: number, clientY: number) {
    setPlanningQueueDragTooltip({
      x: clientX,
      y: clientY,
      message: planningQueueDragBlockedMessage(),
    });
  }

  function updatePlanningQueueDragFeedback(
    clientX: number,
    clientY: number,
    groupId?: string
  ): boolean {
    if (isBlockedPlanningQueueDrop(clientX, clientY, groupId)) {
      showPlanningQueueDragTooltip(clientX, clientY);
      return true;
    }

    setPlanningQueueDragTooltip(null);
    return false;
  }

  function isTaskActiveReorderBlocked(target: TaskDragTarget): boolean {
    return (
      target.zone === "active" &&
      isSameGroupActiveReorderAttempt(dragSourceGroupIdRef.current, target) &&
      !canAcceptActiveDropTarget(
        groupsRef.current,
        dragSourceGroupIdRef.current,
        target
      )
    );
  }

  function isPlanningQueueDropBlockedForGroup(groupId: string): boolean {
    if (!isLaterOriginatedTaskDrag() && !isTodayOriginatedTaskDrag()) {
      return false;
    }
    return !isAllowedPlanningQueueTarget(groupId);
  }

  function setTaskReorderBlockedState(
    blocked: boolean,
    clientX?: number,
    clientY?: number
  ) {
    if (!blocked && !taskReorderBlockedRef.current && !taskReorderBlockedUiRef.current) {
      return;
    }

    taskReorderBlockedRef.current = blocked;

    if (blocked && clientX !== undefined && clientY !== undefined) {
      taskReorderBlockedUiRef.current = true;
      setTaskReorderBlockedDragTooltip({ x: clientX, y: clientY });
      return;
    }

    if (taskReorderBlockedUiRef.current) {
      taskReorderBlockedUiRef.current = false;
      setTaskReorderBlockedDragTooltip(null);
    }
  }

  function publishDropTargetPreview(
    prev: TaskDragTarget | null,
    target: TaskDragTarget | null
  ) {
    if (
      !shouldPublishDropTargetPreview(
        prev,
        target,
        dragOriginalSourceGroupIdRef.current
      )
    ) {
      return;
    }
    setPreviewDropTarget(target);
  }

  function commitDropTargetRefs(target: TaskDragTarget | null) {
    if (target) {
      columnStickyDropRef.current = { columnId: target.groupId, target };
    } else {
      columnStickyDropRef.current = null;
    }
    taskDropTargetRef.current = target;
  }

  function isSameColumnActiveDrag(target: TaskDragTarget): boolean {
    const sourceGroupId = dragOriginalSourceGroupIdRef.current;
    return (
      sourceGroupId !== null &&
      sourceGroupId === target.groupId &&
      target.zone === "active"
    );
  }

  function resolveDropTargetForDrag(
    event: DragOverEvent,
    taskId: string
  ): TaskDragTarget | null {
    const target = resolveTaskDropTargetFromDndEvent(
      event,
      groupsRef.current,
      todayViewDateRef.current,
      taskId
    );
    if (!target) return null;
    if (isSameColumnActiveDrag(target)) return target;
    if (!target.showInsertionLine || target.zone !== "active") return target;

    return refineManualDropTargetFromPointer(
      target,
      groupsRef.current,
      todayViewDateRef.current,
      pointerYRef.current,
      taskId
    );
  }

  function cancelDragPreviewRaf() {
    if (dragPreviewRafRef.current !== null) {
      cancelAnimationFrame(dragPreviewRafRef.current);
      dragPreviewRafRef.current = null;
    }
    pendingDragEventRef.current = null;
  }

  function flushBoardTaskDropPreview(event: DragOverEvent) {
    const data = event.active.data.current;
    if (!isTaskDragData(data)) return;

    updatePointerCoordsFromDnd(event);

    if (isPointerOverTimeline(pointerXRef.current, pointerYRef.current)) {
      setTaskDropIfChanged(null);
      setPlanningQueueDragTooltip(null);
      stopBoardAutoScroll();
      return;
    }

    const refinedTarget = resolveDropTargetForDrag(event, data.taskId);

    if (!refinedTarget) {
      setTaskReorderBlockedState(false);
      if (
        !updatePlanningQueueDragFeedback(
          pointerXRef.current,
          pointerYRef.current
        )
      ) {
        setPlanningQueueDragTooltip(null);
      }
      applyTaskDropTarget(null);
      return;
    }

    if (
      updatePlanningQueueDragFeedback(
        pointerXRef.current,
        pointerYRef.current,
        refinedTarget.groupId
      ) ||
      isBlockedPlanningQueueDrop(
        pointerXRef.current,
        pointerYRef.current,
        refinedTarget.groupId
      )
    ) {
      const prevTarget = taskDropTargetRef.current;
      commitDropTargetRefs(null);
      publishDropTargetPreview(prevTarget, null);
      return;
    }

    if (refinedTarget.zone === "completed") {
      setCompletedExpanded((prev) => {
        if (prev.has(refinedTarget.groupId)) return prev;
        const next = new Set(prev);
        next.add(refinedTarget.groupId);
        return next;
      });
    }

    if (isTaskActiveReorderBlocked(refinedTarget)) {
      setTaskReorderBlockedState(true, pointerXRef.current, pointerYRef.current);
      applyTaskDropTarget(null);
      return;
    }

    setTaskReorderBlockedState(false);
    setPlanningQueueDragTooltip(null);

    const destinationGroup = groupsRef.current.find(
      (group) => group.id === refinedTarget.groupId
    );
    if (
      destinationGroup &&
      isManualActiveDropGroup(destinationGroup) &&
      dragSourceGroupIdRef.current &&
      dragSourceGroupIdRef.current !== refinedTarget.groupId &&
      refinedTarget.zone === "active"
    ) {
      maybeLogPreviewStage({
        movingTaskId: data.taskId,
        sourceGroupId: dragSourceGroupIdRef.current,
        destinationGroup,
        todayViewDate: todayViewDateRef.current,
        pointerY: pointerYRef.current,
        target: refinedTarget,
      });
    }

    applyStickyColumnTarget(refinedTarget.groupId, refinedTarget);

    const liveResult = applyLiveBoardReorderIfChanged(
      groupsRef.current,
      refinedTarget,
      data.taskId,
      dragSourceGroupIdRef.current,
      lastLiveTargetRef.current,
      {
        todayGroupId: todayGroupIdRef.current,
        laterGroupId: laterGroupIdRef.current,
        todayViewDate: todayViewDateRef.current,
        sourceGroupId: dragSourceGroupIdRef.current,
      }
    );

    if (liveResult) {
      liveDragAppliedRef.current = true;
      lastLiveTargetRef.current = refinedTarget;
      dragSourceGroupIdRef.current = liveResult.sourceGroupId;
      groupsRef.current = liveResult.board;
      onGroupsChangeRef.current(liveResult.board);
    }

    startBoardAutoScroll();
  }

  function scheduleBoardTaskDropPreview(event: DragOverEvent) {
    pendingDragEventRef.current = event;
    if (dragPreviewRafRef.current !== null) return;
    dragPreviewRafRef.current = requestAnimationFrame(() => {
      dragPreviewRafRef.current = null;
      const pending = pendingDragEventRef.current;
      pendingDragEventRef.current = null;
      if (pending) flushBoardTaskDropPreview(pending);
    });
  }

  function updateBoardTaskDropPreviewFromDnd(event: DragOverEvent) {
    updatePointerCoordsFromDnd(event);
    scheduleBoardTaskDropPreview(event);
  }

  function isPlanningColumnTarget(groupId: string): boolean {
    return isAllowedPlanningQueueTarget(groupId);
  }

  function isCrossGroupMoveAttempt(taskId: string, targetGroupId: string) {
    const targetGroup = groupsRef.current.find((group) => group.id === targetGroupId);
    if (!targetGroup || isTodayGroup(targetGroup)) return false;

    const task = findTaskInBoard(taskId);
    if (!task?.group_id) return true;
    return task.group_id !== targetGroupId;
  }

  function targetGroupIdAtPoint(clientX: number, clientY: number): string | null {
    const board = boardRef.current;
    if (!board) return null;
    return (
      findBoardGroupColumnAtPoint(board, clientX, clientY)?.getAttribute(
        "data-task-group"
      ) ?? null
    );
  }

  function notifyGroupChangeBlockedIfNeeded(
    taskId: string | null,
    clientX: number,
    clientY: number
  ) {
    if (!taskId || !isTimelineOriginatedTaskDrag()) return;

    const targetGroupId = targetGroupIdAtPoint(clientX, clientY);
    if (!targetGroupId || !isCrossGroupMoveAttempt(taskId, targetGroupId)) {
      return;
    }

    if (groupChangeBlockedNotifiedRef.current) return;
    groupChangeBlockedNotifiedRef.current = true;
    onShowHint?.(GROUP_CHANGE_BLOCKED_HINT);
  }

  function isPointerInsideBoard(clientX: number, clientY: number): boolean {
    const board = boardRef.current;
    if (!board) return false;
    const rect = board.getBoundingClientRect();
    return (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );
  }

  function freezeCommitDropTarget(): TaskDragTarget | null {
    const frozen =
      commitDropTargetRef.current ??
      taskDropTargetRef.current ??
      columnStickyDropRef.current?.target ??
      null;
    commitDropTargetRef.current = frozen;
    return frozen;
  }

  function setTaskDropIfChanged(target: TaskDragTarget | null) {
    if (taskDragTargetsEqual(taskDropTargetRef.current, target)) return;
    const prev = taskDropTargetRef.current;
    commitDropTargetRefs(target);
    publishDropTargetPreview(prev, target);
  }

  function applyTaskDropTarget(target: TaskDragTarget | null) {
    setTaskDropIfChanged(target);
  }

  function applyStickyColumnTarget(columnId: string, target: TaskDragTarget) {
    if (taskDragTargetsEqual(taskDropTargetRef.current, target)) return;
    const prev = taskDropTargetRef.current;
    columnStickyDropRef.current = { columnId, target };
    taskDropTargetRef.current = target;
    publishDropTargetPreview(prev, target);
  }

  function syncTimelineTaskDropTargetFromPointer(
    clientX: number,
    clientY: number
  ) {
    const taskId = getActiveTaskDragIdForDrop();
    const board = boardRef.current;
    if (!taskId || !board) return;

    const stickyColumnId = columnStickyDropRef.current?.columnId ?? null;
    const targetColumn = findBoardGroupColumnAtPoint(
      board,
      clientX,
      clientY,
      stickyColumnId
    );

    if (!targetColumn) {
      if (
        isPointerInsideBoard(clientX, clientY) &&
        columnStickyDropRef.current
      ) {
        setTaskReorderBlockedState(false);
        applyStickyColumnTarget(
          columnStickyDropRef.current.columnId,
          columnStickyDropRef.current.target
        );
        return;
      }

      columnStickyDropRef.current = null;
      setTaskReorderBlockedState(false);
      applyTaskDropTarget(null);
      return;
    }

    const groupId = targetColumn.getAttribute("data-task-group");
    if (!groupId) return;

    if (
      updatePlanningQueueDragFeedback(clientX, clientY, groupId) ||
      isBlockedPlanningQueueDrop(clientX, clientY, groupId)
    ) {
      columnStickyDropRef.current = null;
      applyTaskDropTarget(null);
      return;
    }

    const group = groupsRef.current.find((item) => item.id === groupId);
    if (!group) return;

    const resolved = resolveTaskDropTargetForPointer(
      targetColumn,
      group,
      todayViewDateRef.current,
      clientX,
      clientY,
      taskId
    );

    if (resolved.kind === "none") {
      if (
        columnStickyDropRef.current?.columnId === groupId &&
        columnStickyDropRef.current.target
      ) {
        setTaskReorderBlockedState(false);
        applyStickyColumnTarget(groupId, columnStickyDropRef.current.target);
        return;
      }
      return;
    }

    const target = resolved.target;

    if (target.zone === "completed") {
      setCompletedExpanded((prev) => {
        if (prev.has(groupId)) return prev;
        const next = new Set(prev);
        next.add(groupId);
        return next;
      });
    }

    if (isTaskActiveReorderBlocked(target)) {
      setTaskReorderBlockedState(true, clientX, clientY);
      applyTaskDropTarget(null);
      return;
    }

    setTaskReorderBlockedState(false);
    if (
      isManualActiveDropGroup(group) &&
      dragSourceGroupIdRef.current &&
      dragSourceGroupIdRef.current !== groupId &&
      target.zone === "active"
    ) {
      maybeLogPreviewStage({
        movingTaskId: taskId,
        sourceGroupId: dragSourceGroupIdRef.current,
        destinationGroup: group,
        todayViewDate: todayViewDateRef.current,
        pointerY: clientY,
        target,
      });
    }
    applyStickyColumnTarget(groupId, target);
  }

  function isQuickScheduleOpenForDrag() {
    return plannerActiveRef.current || isQuickScheduleOpen();
  }

  function isBoardOriginatedTaskDrag() {
    return Boolean(activeTaskIdRef.current);
  }

  /** Drag started from Quick Schedule / timeline, not the board task row. */
  function isTimelineOriginatedTaskDrag() {
    if (!isQuickScheduleOpenForDrag()) return false;
    if (isBoardOriginatedTaskDrag()) return false;
    return Boolean(getActiveTaskDragId());
  }

  function isPointerOverTimeline(clientX: number, clientY: number) {
    return (
      isQuickScheduleOpenForDrag() &&
      isPointerOverTimelineScheduler(clientX, clientY)
    );
  }

  function tickBoardAutoScroll() {
    const boardEl = boardRef.current;
    if (!boardEl || (!activeTaskIdRef.current && !dragKindRef.current && !getActiveTaskDragId())) {
      stopBoardAutoScroll();
      return;
    }

    if (isTimelineOriginatedTaskDrag()) {
      stopBoardAutoScroll();
      return;
    }

    if (isBoardOriginatedTaskDrag() && isQuickScheduleOpenForDrag()) {
      stopBoardAutoScroll();
      return;
    }

    if (
      isBoardOriginatedTaskDrag() &&
      isPointerOverTimeline(pointerXRef.current, pointerYRef.current)
    ) {
      stopBoardAutoScroll();
      return;
    }

    const rect = boardEl.getBoundingClientRect();
    const x = pointerXRef.current;
    let delta = 0;

    if (x < rect.left + BOARD_EDGE_SCROLL_ZONE) {
      const depth =
        (rect.left + BOARD_EDGE_SCROLL_ZONE - x) / BOARD_EDGE_SCROLL_ZONE;
      delta = -BOARD_EDGE_SCROLL_SPEED * Math.min(1, depth);
    } else if (x > rect.right - BOARD_EDGE_SCROLL_ZONE) {
      const depth =
        (x - (rect.right - BOARD_EDGE_SCROLL_ZONE)) / BOARD_EDGE_SCROLL_ZONE;
      delta = BOARD_EDGE_SCROLL_SPEED * Math.min(1, depth);
    }

    if (delta !== 0) {
      boardEl.scrollLeft += delta;
    }

    autoScrollRafRef.current = requestAnimationFrame(tickBoardAutoScroll);
  }

  function startBoardAutoScroll() {
    if (isBoardOriginatedTaskDrag() && isQuickScheduleOpenForDrag()) {
      return;
    }
    if (autoScrollRafRef.current !== null) return;
    autoScrollRafRef.current = requestAnimationFrame(tickBoardAutoScroll);
  }

  useEffect(() => {
    const onDocumentDragOver = (event: globalThis.DragEvent) => {
      const externalTaskId = getActiveTaskDragId();
      const isTimelineTaskDrag = Boolean(externalTaskId) && !activeTaskIdRef.current;
      const isGroupDrag = dragKindRef.current === "group";

      if (!isTimelineTaskDrag && !isGroupDrag) return;

      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
      }
      pointerXRef.current = event.clientX;
      pointerYRef.current = event.clientY;

      if (isGroupDrag && dragIdRef.current && boardRef.current) {
        updateGroupDragFeedback(event.clientX, event.clientY);
        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = groupReorderBlockedRef.current
            ? "none"
            : "move";
        }
        startBoardAutoScroll();
        return;
      }

      if (isTimelineTaskDrag) {
        if (isPointerOverTimeline(event.clientX, event.clientY)) {
          stopBoardAutoScroll();
          return;
        }

        const taskId = getActiveTaskDragIdForDrop();
        const targetGroupId =
          targetGroupIdAtPoint(event.clientX, event.clientY) ?? "";

        if (targetGroupId && isPlanningColumnTarget(targetGroupId)) {
          syncTimelineTaskDropTargetFromPointer(event.clientX, event.clientY);
          setExternalTaskDragId((current) =>
            externalTaskId === current ? current : externalTaskId
          );
          if (event.dataTransfer) {
            event.dataTransfer.dropEffect = "move";
          }
          stopBoardAutoScroll();
          return;
        }

        notifyGroupChangeBlockedIfNeeded(
          taskId,
          event.clientX,
          event.clientY
        );
        if (
          taskId &&
          isCrossGroupMoveAttempt(taskId, targetGroupId) &&
          event.dataTransfer
        ) {
          event.dataTransfer.dropEffect = "none";
        }
        stopBoardAutoScroll();
        return;
      }

      startBoardAutoScroll();
    };

    document.addEventListener("dragover", onDocumentDragOver);
    return () => document.removeEventListener("dragover", onDocumentDragOver);
  }, []);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const onWheel = (event: WheelEvent) => {
      const isTaskDrag =
        Boolean(activeTaskIdRef.current) || Boolean(getActiveTaskDragId());
      if (!isTaskDrag || !isQuickScheduleOpenForDrag()) return;
      event.preventDefault();
    };

    board.addEventListener("wheel", onWheel, { passive: false });
    return () => board.removeEventListener("wheel", onWheel);
  }, []);

  function updateGroupDragFeedback(clientX: number, clientY: number) {
    if (!dragIdRef.current || !boardRef.current) return;

    const beforeId = resolveDropBeforeId(
      boardGroupIds(groupsRef.current),
      boardRef.current,
      "data-task-group-column",
      clientX,
      "x",
      dragIdRef.current
    );
    const { blocked, pinnedTargetId } = resolveGroupReorderBlockState(
      groupsRef.current,
      boardRef.current,
      clientX,
      clientY,
      beforeId
    );

    groupReorderBlockedRef.current = blocked;
    setGroupReorderBlocked(blocked);
    setGroupReorderBlockedTargetId(blocked ? pinnedTargetId : null);

    if (blocked) {
      setGroupReorderDragTooltip({ x: clientX, y: clientY });
      return;
    }

    setGroupReorderDragTooltip(null);
    setGroupDropIfChanged(beforeId);
  }

  function resetDrag() {
    dragKindRef.current = null;
    dragIdRef.current = null;
    setDragKind(null);
    setDragId(null);
    setActiveBoardTaskId(null);
    setExternalTaskDragId(null);
    setDropBeforeGroupId(null);
    dropBeforeGroupIdRef.current = null;
    taskDropTargetRef.current = null;
    commitDropTargetRef.current = null;
    columnStickyDropRef.current = null;
    clearDragPreview();
    clearCrossGroupManualTrace();
    groupChangeBlockedNotifiedRef.current = false;
    dragSourceGroupIdRef.current = null;
    dragOriginalSourceGroupIdRef.current = null;
    setPlanningQueueDragTooltip(null);
    setTaskReorderBlockedState(false);
    groupReorderBlockedRef.current = false;
    setGroupReorderBlocked(false);
    setGroupReorderBlockedTargetId(null);
    setGroupReorderDragTooltip(null);
    setActiveTaskDragId(null);
    unblockDragTextSelection();
    stopBoardAutoScroll();
    cancelDragPreviewRaf();
    dragSnapshotRef.current = null;
    lastLiveTargetRef.current = null;
    liveDragAppliedRef.current = false;
  }

  useEffect(() => {
    setTaskBoardDndBridge({
      onDragStart(event) {
        const data = event.active.data.current;
        if (!isTaskDragData(data)) return;
        window.getSelection()?.removeAllRanges();
        dragEndedRef.current = false;
        dragSnapshotRef.current = groupsRef.current;
        lastLiveTargetRef.current = null;
        liveDragAppliedRef.current = false;

        setActiveBoardTaskId(data.taskId);
        dragOriginalSourceGroupIdRef.current = data.groupId;
        dragSourceGroupIdRef.current = data.groupId;
        setActiveTaskDragId(data.taskId);

        updatePointerCoordsFromDnd(event);

        const initialTarget = buildInitialTaskDropTarget(
          data.taskId,
          data.groupId,
          groupsRef.current,
          todayViewDateRef.current
        );

        const refinedInitialTarget = initialTarget
          ? refineManualDropTargetFromPointer(
              initialTarget,
              groupsRef.current,
              todayViewDateRef.current,
              pointerYRef.current,
              data.taskId
            )
          : null;

        taskDropTargetRef.current = refinedInitialTarget;
        columnStickyDropRef.current = refinedInitialTarget
          ? { columnId: data.groupId, target: refinedInitialTarget }
          : null;
        commitDropTargetRef.current = null;
        setPreviewDropTarget(refinedInitialTarget);

        startBoardAutoScroll();
        blockDragTextSelection();
      },
      onDragMove(event) {
        updatePointerCoordsFromDnd(event);
        startBoardAutoScroll();
      },
      onDragOver(event) {
        updateBoardTaskDropPreviewFromDnd(event);
      },
      onDragEnd() {
        void handleTaskDragEnd();
      },
      onDragCancel() {
        if (dragEndedRef.current) return;
        dragEndedRef.current = true;
        if (liveDragAppliedRef.current && dragSnapshotRef.current) {
          onGroupsChangeRef.current(dragSnapshotRef.current);
        }
        resetDrag();
      },
      findTask: findTaskInBoard,
      getOverlayContext: () => ({
        groups: groupsRef.current,
        todayViewDate: todayViewDateRef.current,
        selectedTaskId: selectedTaskIdRef.current,
      }),
    });

    return () => setTaskBoardDndBridge(null);
  }, []);

  async function commitTaskDropIfNeeded() {
    const activeDragId = getActiveTaskDragIdForDrop();
    const previewTarget = taskDropTargetRef.current;
    const target = commitDropTargetRef.current ?? freezeCommitDropTarget();

    if (!activeDragId || !target) return false;

    if (
      isTimelineOriginatedTaskDrag() &&
      !isPlanningColumnTarget(target.groupId)
    ) {
      return false;
    }

    if (isPlanningQueueDropBlockedForGroup(target.groupId)) {
      return false;
    }

    const sourceGroupId = dragOriginalSourceGroupIdRef.current;

    if (
      target.zone === "active" &&
      isSameGroupActiveReorderAttempt(sourceGroupId, target) &&
      !canAcceptActiveDropTarget(groupsRef.current, sourceGroupId, target)
    ) {
      return false;
    }

    const sourceGroup = sourceGroupId
      ? groupsRef.current.find((group) => group.id === sourceGroupId)
      : null;
    const isSameGroupManualActiveReorder =
      sourceGroupId === target.groupId &&
      target.zone === "active" &&
      sourceGroup &&
      canReorderTasksInGroup(sourceGroup);

    if (liveDragAppliedRef.current && dragSnapshotRef.current) {
      const previousBoard = dragSnapshotRef.current;
      const currentBoard = groupsRef.current;

      if (isSameGroupManualActiveReorder) {
        const { updates } = applyManualActiveReorder(
          previousBoard,
          target.groupId,
          activeDragId,
          target.beforeTaskId,
          todayViewDateRef.current
        );

        if (updates.length > 0) {
          void onPersistManualOrder(updates).catch(() => {
            onGroupsChangeRef.current(previousBoard);
          });
        }
        return true;
      }

      void onPersistLayout(currentBoard, {
        todayViewDate: todayViewDateRef.current,
        previousBoard,
      }).catch(() => {
        onGroupsChangeRef.current(previousBoard);
      });
      return true;
    }

    if (isSameGroupManualActiveReorder) {
      const previousBoard = groupsRef.current;
      const { board, updates } = applyManualActiveReorder(
        previousBoard,
        target.groupId,
        activeDragId,
        target.beforeTaskId,
        todayViewDateRef.current
      );

      if (updates.length === 0) return false;

      onGroupsChange(board);

      void onPersistManualOrder(updates).catch(() => {
        onGroupsChange(previousBoard);
      });

      return true;
    }

    const previousBoard = groupsRef.current;

    const destinationGroup = previousBoard.find(
      (group) => group.id === target.groupId
    );
    const isCrossGroupManualInsert =
      target.zone === "active" &&
      sourceGroupId !== target.groupId &&
      destinationGroup &&
      isManualActiveDropGroup(destinationGroup);

    if (isCrossGroupManualInsert && previewTarget) {
      const destinationDisplayedIds = getDisplayedActiveTasks(
        destinationGroup,
        destinationGroup.tasks,
        todayViewDateRef.current
      ).map((task) => task.id);

      beginCrossGroupManualTrace({
        movingTaskId: activeDragId,
        sourceGroupId,
        destinationGroupId: target.groupId,
        pointerY: pointerYRef.current,
        previewTarget,
        frozenTarget: target,
        destinationDisplayedIds,
      });

      logBeforeMoveTaskInBoard({
        board: previousBoard,
        destinationGroupId: target.groupId,
        movingTaskId: activeDragId,
        beforeTaskId: target.beforeTaskId,
        todayViewDate: todayViewDateRef.current,
        sourceGroupId,
      });
    }

    const next = moveTaskInBoard(previousBoard, activeDragId, target, {
      todayGroupId: todayGroupIdRef.current,
      laterGroupId: laterGroupIdRef.current,
      todayViewDate: todayViewDateRef.current,
      sourceGroupId,
    });
    onGroupsChange(next);

    if (isCrossGroupManualInsert) {
      logAfterMoveTaskInBoard({
        board: next,
        destinationGroupId: target.groupId,
        movingTaskId: activeDragId,
        beforeTaskId: target.beforeTaskId,
        todayViewDate: todayViewDateRef.current,
      });
      logAfterReactRender({
        board: next,
        destinationGroupId: target.groupId,
        movingTaskId: activeDragId,
        todayViewDate: todayViewDateRef.current,
      });
    }

    void onPersistLayout(next, {
      todayViewDate: todayViewDateRef.current,
      previousBoard,
    }).catch(() => {
      onGroupsChange(previousBoard);
    });

    return true;
  }

  function setGroupDropIfChanged(beforeId: DropBeforeId) {
    if (dropBeforeGroupIdRef.current === beforeId) return;
    dropBeforeGroupIdRef.current = beforeId;
    setDropBeforeGroupId(beforeId);
  }

  function beginDrag(kind: DragKind, id: string) {
    dragEndedRef.current = false;
    groupChangeBlockedNotifiedRef.current = false;
    groupReorderBlockedRef.current = false;
    setGroupReorderBlocked(false);
    setGroupReorderBlockedTargetId(null);
    setGroupReorderDragTooltip(null);
    dragKindRef.current = kind;
    dragIdRef.current = id;
    setDragKind(kind);
    setDragId(id);
    setExternalTaskDragId(null);
  }

  async function handleTaskDragEnd() {
    if (dragEndedRef.current) return;

    cancelDragPreviewRaf();

    const activeDragId = activeTaskIdRef.current;
    const currentTarget = taskDropTargetRef.current;
    if (activeDragId && currentTarget) {
      const refined =
        currentTarget.showInsertionLine &&
        currentTarget.zone === "active" &&
        !isSameColumnActiveDrag(currentTarget)
          ? refineManualDropTargetFromPointer(
              currentTarget,
              groupsRef.current,
              todayViewDateRef.current,
              pointerYRef.current,
              activeDragId
            )
          : currentTarget;
      taskDropTargetRef.current = refined;
      columnStickyDropRef.current = {
        columnId: refined.groupId,
        target: refined,
      };
      setPreviewDropTarget(refined);
    }

    freezeCommitDropTarget();
    dragEndedRef.current = true;

    if (consumeTimelineDropConsumed()) {
      resetDrag();
      return;
    }

    if (isTimelineOriginatedTaskDrag()) {
      const committed = await commitTaskDropIfNeeded();
      if (!committed) {
        notifyGroupChangeBlockedIfNeeded(
          getActiveTaskDragIdForDrop(),
          pointerXRef.current,
          pointerYRef.current
        );
      }
      resetDrag();
      return;
    }

    if (activeTaskIdRef.current) {
      void commitTaskDropIfNeeded();
    }

    resetDrag();
  }

  async function handleExternalTaskDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    freezeCommitDropTarget();
    dragEndedRef.current = true;

    if (consumeTimelineDropConsumed()) {
      resetDrag();
      return;
    }

    if (isTimelineOriginatedTaskDrag()) {
      const committed = await commitTaskDropIfNeeded();
      if (!committed) {
        notifyGroupChangeBlockedIfNeeded(
          getActiveTaskDragIdForDrop(),
          event.clientX,
          event.clientY
        );
      }
      resetDrag();
      return;
    }

    if (activeTaskIdRef.current || getActiveTaskDragId()) {
      await commitTaskDropIfNeeded();
    }

    resetDrag();
  }

  function handleGroupDragStart(groupId: string, event: DragEvent<HTMLButtonElement>) {
    const group = groupsRef.current.find((item) => item.id === groupId);
    if (group && isPinnedTaskGroup(group)) return;

    event.stopPropagation();
    setActiveTaskDragId(null);
    beginDrag("group", groupId);

    const column = event.currentTarget.closest(
      "[data-task-group-column]"
    ) as HTMLElement | null;
    if (column) setDragImageFromElement(event, column, 24, 24);

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", groupId);

    setGroupDropIfChanged(
      initialDropBeforeId(movableGroupIds(groupsRef.current), groupId)
    );
  }

  async function handleGroupDragEnd() {
    if (dragEndedRef.current) return;
    dragEndedRef.current = true;

    const activeDragId = dragIdRef.current;
    const beforeId = dropBeforeGroupIdRef.current;

    if (dragKindRef.current === "group" && activeDragId) {
      if (!groupReorderBlockedRef.current) {
        const next = moveGroupInBoard(groupsRef.current, activeDragId, beforeId);
        onGroupsChange(next);
        try {
          await onPersistLayout(next);
        } catch {
          onGroupsChange(groupsRef.current);
        }
      }
    }

    resetDrag();
  }

  function handleBoardDragOver(event: DragEvent<HTMLDivElement>) {
    pointerXRef.current = event.clientX;

    if (dragKindRef.current === "group" && dragIdRef.current && boardRef.current) {
      event.preventDefault();
      updateGroupDragFeedback(event.clientX, event.clientY);
      event.dataTransfer.dropEffect = groupReorderBlockedRef.current
        ? "none"
        : "move";
    }
  }

  function isTimelineTaskDrag(): boolean {
    return isTimelineOriginatedTaskDrag();
  }

  function handleActiveBodyDragOver(event: DragEvent<HTMLElement>, groupId: string) {
    if (!isTimelineTaskDrag()) return;
    if (isTimelineOriginatedTaskDrag() && !isPlanningColumnTarget(groupId)) {
      return;
    }

    const targetEl = event.target as HTMLElement;
    if (targetEl.closest("[data-task-completed-body]")) return;

    if (isBlockedPlanningQueueDrop(event.clientX, event.clientY, groupId)) {
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = "none";
      columnStickyDropRef.current = null;
      applyTaskDropTarget(null);
      showPlanningQueueDragTooltip(event.clientX, event.clientY);
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    syncTimelineTaskDropTargetFromPointer(event.clientX, event.clientY);
    event.dataTransfer.dropEffect = "move";
  }

  function handleGroupDropZoneDragOver(
    event: DragEvent<HTMLElement>,
    groupId: string
  ) {
    if (!isTimelineTaskDrag()) return;
    handleActiveBodyDragOver(event, groupId);
  }

  function handleGroupDropZoneDrop(event: DragEvent<HTMLElement>) {
    if (!isTimelineTaskDrag() && !getActiveTaskDragId()) return;
    event.preventDefault();
    void handleExternalTaskDrop(event);
  }

  function handleCompletedBodyDragOver(
    event: DragEvent<HTMLElement>,
    groupId: string
  ) {
    if (!isTimelineTaskDrag()) return;
    if (isTimelineOriginatedTaskDrag() && !isPlanningColumnTarget(groupId)) {
      return;
    }

    if (isBlockedPlanningQueueDrop(event.clientX, event.clientY, groupId)) {
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = "none";
      columnStickyDropRef.current = null;
      applyTaskDropTarget(null);
      showPlanningQueueDragTooltip(event.clientX, event.clientY);
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";

    setCompletedExpanded((prev) => {
      if (prev.has(groupId)) return prev;
      const next = new Set(prev);
      next.add(groupId);
      return next;
    });

    syncTimelineTaskDropTargetFromPointer(event.clientX, event.clientY);
  }

  function toggleCollapsed(groupId: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  }

  function toggleCompletedSection(groupId: string) {
    setCompletedExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  }

  function startRenameGroup(group: TaskGroupWithTasks) {
    if (isPinnedTaskGroup(group)) return;
    setEditingGroupId(group.id);
    setGroupTitleDraft(group.title);
  }

  async function saveGroupTitle(groupId: string) {
    const title = groupTitleDraft.trim();
    setEditingGroupId(null);
    if (!title) return;
    await onRenameGroup(groupId, title);
  }

  function openCompose(groupId: string, placement: "top" | "bottom") {
    const currentGroupId = composingGroupIdRef.current;
    const currentText = composeTextRef.current.trim();

    if (
      currentGroupId === groupId &&
      composePlacementRef.current === placement
    ) {
      composeRef.current?.focus();
      return;
    }

    if (currentGroupId) {
      if (!currentText) {
        setComposeText("");
        setComposingGroupId(groupId);
        setComposePlacement(placement);
        return;
      }

      void finishCompose(currentGroupId, composeTextRef.current).then(() => {
        setComposingGroupId(groupId);
        setComposePlacement(placement);
        setComposeText("");
      });
      return;
    }

    setComposingGroupId(groupId);
    setComposePlacement(placement);
    setComposeText("");
  }

  async function finishCompose(groupId: string, text: string) {
    const title = text.trim();
    if (title) {
      const creatingInToday = todayGroup && groupId === todayGroup.id;
      const creatingInLater = laterGroup && groupId === laterGroup.id;
      const orgGroupId =
        creatingInToday || creatingInLater
          ? (inboxGroup?.id ?? groupId)
          : groupId;
      const options = creatingInLater
        ? { planningState: "later" as const }
        : creatingInToday
          ? { scheduledDate: todayViewDate }
          : undefined;
      await onCreateTask(orgGroupId, title, options);
    }
    setComposeText("");
    setComposingGroupId(null);
  }

  async function submitCompose(groupId: string) {
    const placement = composePlacementRef.current;
    await finishCompose(groupId, composeText);
    setComposingGroupId(groupId);
    setComposePlacement(placement);
  }

  const isDraggingTask = Boolean(activeTaskId) || externalTaskDragId !== null;
  const activeDragTaskId = activeTaskId ?? externalTaskDragId;
  const isDraggingGroup = dragKind === "group";

  function handleSortModeChange(groupId: string, sortMode: TaskSortMode) {
    void onUpdateGroupSortMode(groupId, sortMode);
  }

  function renderGroupColumn(group: TaskGroupWithTasks) {
    const isToday = isTodayGroup(group);
    const isLater = isLaterGroup(group);
    const isPinned = isPinnedTaskGroup(group);
    const canCollapse = !isToday;
    const visibleTasks = filterTasksForGroup(group, group.tasks, todayViewDate);
    const sortMode = getTaskGroupSortMode(group);
    const showSortMenu = isSortableTaskColumn(group);
    const canReorder = canReorderTasksInGroup(group);
    const { active, completed } = sortActiveAndCompleted(visibleTasks, group);
    const isComposing = composingGroupId === group.id;
    const isComposingTop = isComposing && composePlacement === "top";
    const isComposingBottom = isComposing && composePlacement === "bottom";
    const isSourceGroup = isDraggingGroup && dragId === group.id;
    const isGroupReorderBlockTarget =
      isDraggingGroup &&
      groupReorderBlockedTargetId === group.id &&
      isPinned;
    const showGroupMarker =
      isDraggingGroup &&
      !groupReorderBlocked &&
      dropBeforeGroupId === group.id &&
      !isSourceGroup;
    const isCompletedOpen = completedExpanded.has(group.id);
    const isCollapsed = canCollapse && collapsed.has(group.id);
    const displayTitle = getGroupDisplayTitle(group, todayViewDate);
    const groupAppearance = getTaskGroupAppearance(group);

    const showGroupOptionsMenu = !isToday && !isLater && !isInboxGroup(group);

    const groupHeaderActions = (
      <div className="flex shrink-0 items-center gap-0.5">
        {showSortMenu ? (
          <TaskSortMenu
            sortMode={sortMode}
            onSortModeChange={(mode) => handleSortModeChange(group.id, mode)}
          />
        ) : null}
        <GroupHeaderAddButton onClick={() => openCompose(group.id, "top")} />
        {showGroupOptionsMenu ? (
          <GroupHeaderOptionsMenu
            displayTitle={displayTitle}
            onRename={() => startRenameGroup(group)}
            onChangeIcon={() => setIconChooserGroupId(group.id)}
            onChangeColor={() => setColorChooserGroupId(group.id)}
            onDelete={() => void onDeleteGroup(group.id)}
          />
        ) : null}
      </div>
    );

    const groupTitleCluster = editingGroupId === group.id ? (
      <input
        value={groupTitleDraft}
        onChange={(event) => setGroupTitleDraft(event.target.value)}
        onBlur={() => void saveGroupTitle(group.id)}
        onKeyDown={(event) => {
          if (event.key === "Enter") void saveGroupTitle(group.id);
          if (event.key === "Escape") setEditingGroupId(null);
        }}
        className="min-w-0 flex-1 rounded-md border border-border/50 bg-background px-2 py-1 text-sm font-semibold outline-none"
        autoFocus
      />
    ) : isLater ? (
      <div className="flex min-w-0 items-center gap-1">
        <LaterViewIcon />
        <span className="min-w-0 truncate text-sm font-semibold text-foreground">
          {displayTitle}
        </span>
        <SystemViewInfoMenu
          view="later"
          open={systemViewInfoOpen === "later"}
          onOpenChange={(open) =>
            setSystemViewInfoOpen(open ? "later" : null)
          }
        />
      </div>
    ) : isInboxGroup(group) ? (
      <div className="flex min-w-0 items-center gap-1">
        <TaskGroupPill
          icon={groupAppearance.icon}
          name={displayTitle}
          appearance={groupAppearance}
          variant="plain"
          className="min-w-0 font-semibold"
        />
        <SystemViewInfoMenu
          view="inbox"
          open={systemViewInfoOpen === "inbox"}
          onOpenChange={(open) =>
            setSystemViewInfoOpen(open ? "inbox" : null)
          }
        />
      </div>
    ) : (
      <button
        type="button"
        onDoubleClick={() => startRenameGroup(group)}
        className="min-w-0 truncate text-left"
      >
        <TaskGroupPill
          icon={groupAppearance.icon}
          name={displayTitle}
          appearance={groupAppearance}
          variant="plain"
          className="font-semibold"
        />
      </button>
    );

    const composeInput = (
      <div
        ref={(node) => {
          if (isComposing) {
            composeContainerRef.current = node;
          }
        }}
      >
        <TaskComposeInput
          ref={composeRef}
          value={composeText}
          onChange={setComposeText}
          onCancel={() => {
            setComposingGroupId(null);
            setComposeText("");
          }}
          onSubmit={() => void submitCompose(group.id)}
        />
      </div>
    );

    if (isCollapsed) {
      return (
        <div
          key={group.id}
          data-task-group-column={group.id}
          data-task-group={group.id}
          className="flex shrink-0 items-stretch"
        >
          {showGroupMarker && <GroupDropMarker />}
          <div
            className={cn(
              "flex w-11 shrink-0 flex-col items-center rounded-xl border py-2 shadow-sm transition-[box-shadow,background-color,border-color] duration-150",
              TASK_GROUP_COLUMN_SURFACE_CLASS[groupAppearance.colorKey],
              isSourceGroup && "opacity-40",
              isGroupReorderBlockTarget &&
                "border-destructive/35 bg-destructive/[0.06] ring-2 ring-destructive/30"
            )}
          >
            <button
              type="button"
              draggable={!isPinned}
              onDragStart={(event) => handleGroupDragStart(group.id, event)}
              onDragEnd={() => void handleGroupDragEnd()}
              onMouseDown={(event) => event.stopPropagation()}
              className={cn(
                "mb-1 flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/80",
                isPinned
                  ? "cursor-default opacity-40"
                  : "cursor-grab active:cursor-grabbing"
              )}
              aria-label={`Move ${displayTitle}`}
              aria-disabled={isPinned}
            >
              <GripVertical className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => toggleCollapsed(group.id)}
              className="mb-2 flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/80"
              aria-label={`Expand ${displayTitle}`}
            >
              <ChevronRight className="size-3.5" />
            </button>
            {isLater ? (
              <LaterViewIcon className="mb-2" />
            ) : (
              <span className="mb-2 text-base leading-none" aria-hidden>
                {groupAppearance.icon}
              </span>
            )}
            <span className="max-h-48 text-xs font-semibold text-foreground/80 [writing-mode:vertical-rl] rotate-180">
              {displayTitle}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div
        key={group.id}
        data-task-group-column={group.id}
        data-task-group={group.id}
        className={cn("flex shrink-0 items-stretch", GROUP_COLUMN_WIDTH_CLASS)}
      >
        {showGroupMarker && <GroupDropMarker />}
        <div
          className={cn(
            "flex h-full max-h-full w-full shrink-0 flex-col rounded-xl border shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] transition-[box-shadow,background-color,border-color] duration-150",
            TASK_GROUP_COLUMN_SURFACE_CLASS[groupAppearance.colorKey],
            isToday &&
              plannerActive &&
              "ring-2 ring-sky-400/25 shadow-md shadow-sky-500/10",
            isSourceGroup && "opacity-40",
            isGroupReorderBlockTarget &&
              "border-destructive/35 bg-destructive/[0.06] ring-2 ring-destructive/30"
          )}
        >
          <div className="group/column-header flex h-11 shrink-0 items-center gap-0 border-b border-border/25 px-1.5 transition-colors duration-150 hover:bg-muted/25">
            {isToday ? (
              <>
                <SystemViewInfoMenu
                  view="today"
                  open={systemViewInfoOpen === "today"}
                  onOpenChange={(open) =>
                    setSystemViewInfoOpen(open ? "today" : null)
                  }
                />
                <div className="flex min-w-0 flex-1 items-center justify-center gap-0.5">
                  <button
                    type="button"
                    onClick={() =>
                      onTodayViewDateChange(shiftDateKey(todayViewDate, -1))
                    }
                    className="flex size-7 shrink-0 items-center justify-center rounded-md text-foreground hover:bg-muted/80"
                    aria-label="Previous day"
                  >
                    <ChevronRight className="size-4 rotate-180" />
                  </button>
                  <DropdownMenu
                    open={todayTitleOpen}
                    onOpenChange={setTodayTitleOpen}
                  >
                    <DropdownMenuTrigger
                      className="inline-flex h-7 min-w-[5.5rem] items-center justify-center gap-1 rounded-md px-2 text-sm font-semibold outline-none hover:bg-muted/60"
                      aria-label={`Selected day: ${displayTitle}`}
                    >
                      {displayTitle}
                      <ChevronDown className="size-3.5 text-muted-foreground" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side="bottom"
                      align="center"
                      className="w-40 p-1"
                    >
                      {todayQuickDates.map((item) => (
                        <DropdownMenuItem
                          key={item.key}
                          onClick={() => {
                            onTodayViewDateChange(item.key);
                            setTodayTitleOpen(false);
                          }}
                          className={cn(
                            "text-xs",
                            todayViewDate === item.key && "bg-muted font-medium"
                          )}
                        >
                          {item.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <button
                    type="button"
                    onClick={() =>
                      onTodayViewDateChange(shiftDateKey(todayViewDate, 1))
                    }
                    className="flex size-7 shrink-0 items-center justify-center rounded-md text-foreground hover:bg-muted/80"
                    aria-label="Next day"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
                <label className="relative flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-sky-600 hover:bg-sky-500/10">
                  <input
                    type="date"
                    value={todayViewDate}
                    onClick={(event) => {
                      try {
                        event.currentTarget.showPicker?.();
                      } catch {
                        // Browser may reject if already open.
                      }
                    }}
                    onChange={(event) =>
                      onTodayViewDateChange(event.target.value)
                    }
                    className="absolute inset-0 cursor-pointer opacity-0"
                    aria-label="Pick date"
                  />
                  <CalendarDays className="pointer-events-none size-3.5" />
                </label>
                {groupHeaderActions}
              </>
            ) : (
              <>
                <GroupHeaderDragHandle
                  disabled={isPinned}
                  label={displayTitle}
                  onDragStart={(event) => handleGroupDragStart(group.id, event)}
                  onDragEnd={() => void handleGroupDragEnd()}
                />

                <div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-hidden">
                  {canCollapse ? (
                    <button
                      type="button"
                      onClick={() => toggleCollapsed(group.id)}
                      className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/80"
                      aria-label={`Collapse ${displayTitle}`}
                    >
                      <ChevronDown className="size-3.5" />
                    </button>
                  ) : null}
                  <div className="min-w-0 flex-1 overflow-hidden">
                    {groupTitleCluster}
                  </div>
                </div>

                {groupHeaderActions}
              </>
            )}
          </div>

          <div
            className="flex min-h-0 flex-1 flex-col overflow-y-auto px-1.5 py-1"
            onDragOver={(event) => handleGroupDropZoneDragOver(event, group.id)}
            onDrop={handleGroupDropZoneDrop}
          >
            <TaskGroupActiveBody
              group={group}
              className={cn(
                "flex flex-col divide-y divide-border/20 transition-[opacity,transform] duration-300 ease-out",
                active.length === 0 && isDraggingTask && "min-h-[2.5rem] flex-1"
              )}
              onDragOver={
                isTimelineTaskDrag()
                  ? (event) => handleActiveBodyDragOver(event, group.id)
                  : undefined
              }
              onDrop={
                isTimelineTaskDrag() ? handleGroupDropZoneDrop : undefined
              }
            >
              {isLater && active.length === 0 && !isComposing && !isDraggingTask ? (
                <div className="px-2 py-6 text-center">
                  <p className="text-[11px] font-medium text-foreground/85">
                    No tasks in Later.
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    Move tasks here when you want to plan them another time.
                  </p>
                </div>
              ) : null}
              {active.length === 0 && (
                <ActiveEmptyDropPlaceholder
                  groupId={group.id}
                  visible={isDraggingTask}
                  blocked={isPlanningQueueDropBlockedForGroup(group.id)}
                />
              )}
              {isComposingTop ? composeInput : null}
              <TaskColumnActiveList
                group={group}
                tasks={active}
                groups={groups}
                todayViewDate={todayViewDate}
                selectedTaskId={selectedTaskId}
                dragEnabled
                reorderEnabled={canReorder}
              />
            </TaskGroupActiveBody>

            <div>
              {isComposingBottom ? (
                composeInput
              ) : (
                <button
                  type="button"
                  onClick={() => openCompose(group.id, "bottom")}
                  className="mt-0.5 flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-transparent py-1.5 text-[11px] font-medium text-muted-foreground/75 transition-colors hover:border-border/45 hover:bg-muted/35 hover:text-foreground"
                >
                  <Plus className="size-3" />
                  Add a task
                </button>
              )}
            </div>

            {completed.length > 0 && (
              <div className="mt-2 border-t border-border/20 pt-1">
                <button
                  type="button"
                  onClick={() => toggleCompletedSection(group.id)}
                  onDragOver={
                    isTimelineTaskDrag()
                      ? (event) => {
                          event.preventDefault();
                          setCompletedExpanded((prev) => {
                            if (prev.has(group.id)) return prev;
                            const next = new Set(prev);
                            next.add(group.id);
                            return next;
                          });
                          syncTimelineTaskDropTargetFromPointer(
                            event.clientX,
                            event.clientY
                          );
                          event.dataTransfer.dropEffect = "move";
                        }
                      : undefined
                  }
                  className="flex w-full items-center gap-1 rounded-md px-1 py-1.5 text-xs font-medium text-muted-foreground/85 transition-colors hover:bg-muted/40 hover:text-foreground"
                >
                  {isCompletedOpen ? (
                    <ChevronDown className="size-3.5 shrink-0" />
                  ) : (
                    <ChevronRight className="size-3.5 shrink-0" />
                  )}
                  Completed ({completed.length})
                </button>

                {isCompletedOpen && (
                  <TaskCompletedBody
                    group={group}
                    className="mt-1 flex flex-col divide-y divide-border/20"
                    onDragOver={(event) =>
                      handleCompletedBodyDragOver(event, group.id)
                    }
                    onDrop={handleGroupDropZoneDrop}
                  >
                    <TaskColumnCompletedList
                      group={group}
                      tasks={completed}
                      groups={groups}
                      todayViewDate={todayViewDate}
                      selectedTaskId={selectedTaskId}
                      dragEnabled
                      reorderEnabled={canReorder}
                    />
                  </TaskCompletedBody>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const iconChooserGroup = groups.find((group) => group.id === iconChooserGroupId);
  const colorChooserGroup = groups.find(
    (group) => group.id === colorChooserGroupId
  );

  function openNewGroupDialog(moveTaskId?: string) {
    const nextMoveTaskId = moveTaskId ?? null;
    newGroupMoveTaskIdRef.current = nextMoveTaskId;
    setNewGroupMoveTaskId(nextMoveTaskId);
    setNewGroupDialogOpen(true);
  }

  async function handleSaveNewGroup(input: TaskGroupCreateInput) {
    const moveTaskId = newGroupMoveTaskIdRef.current ?? newGroupMoveTaskId;
    if (moveTaskId) {
      await onCreateGroupAndMoveTask(input, moveTaskId);
    } else {
      await onCreateGroup(input);
    }
    newGroupMoveTaskIdRef.current = null;
    setNewGroupMoveTaskId(null);
  }

  const boardActions: TaskBoardActions = {
    onToggleComplete: (task) => {
      void onToggleComplete(task);
    },
    onOpenDetail: onSelectTask,
    onDuplicateTask: (task) => {
      void onDuplicateTask(task);
    },
    onMoveTask: (taskId, targetGroupId) => {
      void onMoveTask(taskId, targetGroupId);
    },
    onDeleteTask: (taskId) => {
      void onDeleteTask(taskId);
    },
    onUpdateTask: (taskId, updates) => {
      void onUpdateTask(taskId, updates);
    },
    onSetPlanningState: onSetPlanningState
      ? (taskId, planningState) => {
          void onSetPlanningState(taskId, planningState);
        }
      : undefined,
    onRequestCreateGroup: (taskId) => openNewGroupDialog(taskId),
  };

  return (
    <TaskBoardActionsProvider actions={boardActions}>
    <>
      <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="grid w-full shrink-0 grid-cols-3 items-center gap-4">
        <h1 className={cn(type.pageTitle, "min-w-0")}>Tasks</h1>
        <div className="flex justify-center">
          {onToggleQuickPlanner ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "h-8 shrink-0 gap-1.5 rounded-full px-3.5 text-sm font-medium",
                "border-border/45 bg-background text-foreground/85",
                "shadow-[0_1px_2px_0_rgba(15,23,42,0.05)]",
                "transition-[background-color,border-color,box-shadow,transform,color] duration-150",
                "hover:border-sky-400/35 hover:bg-sky-50/70 hover:text-foreground hover:shadow-[0_1px_3px_0_rgba(14,165,233,0.08)]",
                "active:scale-[0.98] active:bg-sky-50 active:shadow-[0_1px_1px_0_rgba(15,23,42,0.04)]",
                plannerActive &&
                  "border-sky-400/45 bg-sky-50/90 text-sky-950 shadow-[0_0_0_1px_rgba(14,165,233,0.14),0_1px_2px_0_rgba(14,165,233,0.1)] hover:bg-sky-100/80 hover:border-sky-400/55"
              )}
              onClick={onToggleQuickPlanner}
              aria-pressed={plannerActive}
            >
              <Clock
                className={cn(
                  "size-3.5 transition-colors duration-150",
                  plannerActive ? "text-sky-600" : "text-sky-600/90"
                )}
              />
              Quick Schedule
            </Button>
          ) : null}
        </div>
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn(
              "h-8 shrink-0 gap-1.5 rounded-full px-3.5 text-sm font-medium",
              "border-border/45 bg-background text-foreground/85",
              "shadow-[0_1px_2px_0_rgba(15,23,42,0.05)]",
              "transition-[background-color,border-color,box-shadow,transform,color] duration-150",
              "hover:border-border/70 hover:bg-muted/40 hover:text-foreground hover:shadow-[0_1px_3px_0_rgba(15,23,42,0.07)]",
              "active:scale-[0.98] active:bg-muted/55 active:shadow-[0_1px_1px_0_rgba(15,23,42,0.04)]"
            )}
            onClick={() => openNewGroupDialog()}
          >
            <Plus className="size-3.5 text-muted-foreground transition-colors duration-150 group-hover/button:text-foreground" />
            New Group
          </Button>
        </div>
      </div>

      <div
        ref={boardRef}
        onDragOver={handleBoardDragOver}
        onDrop={(event) => {
          if (dragKindRef.current === "group") {
            event.preventDefault();
            void handleGroupDragEnd();
            return;
          }
          void handleExternalTaskDrop(event);
        }}
        className={cn(
          "tasks-board-scroll flex min-h-0 flex-1 gap-3 overflow-x-auto overscroll-x-contain pb-1",
          isDraggingGroup && groupReorderBlocked && "cursor-not-allowed"
        )}
      >
        {groups.map((group) => renderGroupColumn(group))}
        {isDraggingGroup && !groupReorderBlocked && dropBeforeGroupId === null && (
          <GroupDropMarker />
        )}
      </div>
      </div>

      <DragBlockedTooltip
        position={planningQueueDragTooltip}
        message={planningQueueDragTooltip?.message ?? ""}
      />
      <DragBlockedTooltip
        position={groupReorderDragTooltip}
        message={SYSTEM_VIEW_REORDER_BLOCKED_HINT}
      />
      <DragBlockedTooltip
        position={taskReorderBlockedDragTooltip}
        message={REORDER_DISABLED_TOOLTIP}
      />

      <GrowthAreaIconChooser
        open={iconChooserGroupId !== null}
        onOpenChange={(open) => {
          if (!open) setIconChooserGroupId(null);
        }}
        value={
          iconChooserGroup
            ? getTaskGroupAppearance(iconChooserGroup).icon
            : "📝"
        }
        onSelect={(emoji) => {
          if (iconChooserGroupId) {
            void onUpdateGroupIcon(iconChooserGroupId, emoji);
          }
        }}
      />

      <TaskGroupColorChooser
        open={colorChooserGroupId !== null}
        onOpenChange={(open) => {
          if (!open) setColorChooserGroupId(null);
        }}
        value={
          colorChooserGroup
            ? getTaskGroupAppearance(colorChooserGroup).colorKey
            : "blue"
        }
        onSelect={(colorKey) => {
          if (colorChooserGroupId) {
            void onUpdateGroupColor(colorChooserGroupId, colorKey);
          }
        }}
      />

      <TaskGroupDialog
        open={newGroupDialogOpen}
        onOpenChange={(open) => {
          setNewGroupDialogOpen(open);
          if (!open) {
            newGroupMoveTaskIdRef.current = null;
            setNewGroupMoveTaskId(null);
          }
        }}
        existingGroups={groups}
        onSave={handleSaveNewGroup}
      />
    </>
    </TaskBoardActionsProvider>
  );
}

function LaterViewIcon({ className }: { className?: string }) {
  return (
    <CalendarClock
      className={cn("size-4 shrink-0 text-[#8A7358]", className)}
      aria-hidden
    />
  );
}

function SystemViewInfoPanel({ view }: { view: SystemViewInfoKey }) {
  const info = SYSTEM_VIEW_INFO[view];

  return (
    <>
      <p className="text-sm font-semibold text-foreground">{info.title}</p>
      {info.paragraphs.map((paragraph, index) => (
        <p
          key={paragraph}
          className={cn(
            "text-xs leading-snug text-muted-foreground",
            index === 0 ? "mt-1.5" : "mt-2"
          )}
        >
          {paragraph}
        </p>
      ))}
    </>
  );
}

function SystemViewInfoMenu({
  view,
  open,
  onOpenChange,
  triggerClassName,
}: {
  view: SystemViewInfoKey;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerClassName?: string;
}) {
  const info = SYSTEM_VIEW_INFO[view];

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-sm px-0.5 text-[11px] leading-none text-muted-foreground hover:bg-muted/80 hover:text-foreground",
          triggerClassName
        )}
        aria-label={`About ${info.title}`}
      >
        ⓘ
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        className="w-64 rounded-xl p-3"
      >
        <SystemViewInfoPanel view={view} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DragBlockedTooltip({
  position,
  message,
}: {
  position: { x: number; y: number } | null;
  message: string;
}) {
  if (!position || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="pointer-events-none fixed z-[200] max-w-[15rem] rounded-md border border-border/60 bg-popover px-2.5 py-1.5 text-[11px] leading-snug text-popover-foreground shadow-md"
      style={{ left: position.x + 14, top: position.y + 14 }}
      role="status"
    >
      {message}
    </div>,
    document.body
  );
}

function GroupDropMarker() {
  return (
    <div
      className="mx-0.5 w-0.5 shrink-0 self-stretch rounded-full bg-primary/35"
      aria-hidden
    />
  );
}

function GroupHeaderDragHandle({
  disabled,
  label,
  onDragStart,
  onDragEnd,
}: {
  disabled?: boolean;
  label: string;
  onDragStart: (event: DragEvent<HTMLButtonElement>) => void;
  onDragEnd: () => void;
}) {
  return (
    <div className="flex size-7 shrink-0 items-center justify-center" aria-hidden={disabled}>
      {disabled ? null : (
        <button
          type="button"
          draggable
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onMouseDown={(event) => event.stopPropagation()}
          className="flex size-7 cursor-grab items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity duration-150 hover:bg-muted/80 hover:text-foreground active:cursor-grabbing group-hover/column-header:opacity-100 focus-visible:opacity-100"
          aria-label={`Move ${label}`}
        >
          <GripVertical className="size-3.5" />
        </button>
      )}
    </div>
  );
}

function GroupHeaderOptionsMenu({
  displayTitle,
  onRename,
  onChangeIcon,
  onChangeColor,
  onDelete,
}: {
  displayTitle: string;
  onRename: () => void;
  onChangeIcon: () => void;
  onChangeColor: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex size-7 shrink-0 items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground opacity-0 outline-none transition-opacity duration-150 hover:bg-muted/80 hover:text-foreground focus-visible:opacity-100 data-[state=open]:bg-muted/70 data-[state=open]:opacity-100 data-[state=open]:text-foreground group-hover/column-header:opacity-100"
          aria-label={`${displayTitle} options`}
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="rounded-xl">
          <DropdownMenuItem onClick={onRename}>
            <Pencil className="size-3.5" /> Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onChangeIcon}>
            <Smile className="size-3.5" /> Change icon
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onChangeColor}>
            <Palette className="size-3.5" /> Change color
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive" onClick={onDelete}>
            <Trash2 className="size-3.5" />
            Delete group
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function GroupHeaderAddButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-muted/80 hover:text-foreground"
      aria-label="Add a task"
    >
      <Plus className="size-3.5" />
    </button>
  );
}

const TaskComposeInput = forwardRef<
  HTMLTextAreaElement,
  {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
  }
>(function TaskComposeInput({ value, onChange, onSubmit, onCancel }, ref) {
  const innerRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement);

  const resize = useCallback(() => {
    const el = innerRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    resize();
    innerRef.current?.focus();
  }, [resize]);

  useEffect(() => {
    resize();
  }, [value, resize]);

  return (
    <textarea
      ref={innerRef}
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
        requestAnimationFrame(resize);
      }}
      placeholder="Task title..."
      rows={1}
      className="mt-0.5 w-full resize-none overflow-hidden rounded-md border-b border-primary/25 bg-transparent px-1.5 py-1.5 text-[13px] outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/45 focus:bg-muted/15"
      style={{ minHeight: "1.75rem" }}
      onKeyDown={(event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          onSubmit();
        }
        if (event.key === "Escape") onCancel();
      }}
    />
  );
});
