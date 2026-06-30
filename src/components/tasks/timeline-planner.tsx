"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  CalendarClock,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Circle,
  ClipboardList,
  Clock,
  Copy,
  GripVertical,
  PanelRightClose,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react";
import { TaskDurationPicker } from "@/components/tasks/task-duration-picker";
import { QuickScheduleResizeHandle } from "@/components/tasks/quick-schedule-resize-handle";
import { TaskGroupPill } from "@/components/tasks/task-group-pill";
import { TaskPriorityFlagIcon } from "@/components/tasks/task-priority-flag-icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  formatNowTimeInAppTimezone,
  formatTimeShort,
  getTodayDateString,
  getTomorrowDateString,
  getYesterdayDateString,
  parseTimeToMinutes,
  shiftDateKey,
} from "@/lib/date-utils";
import {
  panelToggleHoverIconClass,
  panelTogglePrimaryIconClass,
  panelToggleSquareClass,
} from "@/lib/panel-toggle-styles";
import {
  clampQuickScheduleTaskListWidth,
  getQuickScheduleTaskListWidth,
  QUICK_SCHEDULE_TASK_LIST_WIDTH_DEFAULT,
  QUICK_SCHEDULE_TASK_LIST_WIDTH_MIN,
  getQuickScheduleTaskListEffectiveMax,
  setQuickScheduleTaskListWidth,
} from "@/lib/quick-schedule-task-list-width";
import { formatTodayColumnTitle, isInboxGroup, isTodayGroup, taskBelongsInLaterView } from "@/lib/task-groups";
import { getTaskGroupAppearance, TASK_GROUP_ACCENT_BORDER_CLASS } from "@/lib/task-group-appearance";
import { normalizeTaskPriority } from "@/lib/task-priority";
import {
  buildScheduledSlots,
  buildTimelineBlocks,
  buildTimelineHourLabels,
  collectAllBoardTasks,
  collectPoolGroups,
  collectTasksForViewDate,
  DEFAULT_TASK_DURATION,
  filterHabitsForViewDate,
  filterUnscheduledTasksForDay,
  findOverlappingEntryIds,
  getHabitDurationMinutes,
  getHourHeightPx,
  getNowLineTopPx,
  getTaskDurationMinutes,
  getTimelineHeightPx,
  isHabitDoneOnDate,
  MIN_BLOCK_HEIGHT_PX,
  minutesToTimeString,
  minutesToTopPx,
  resolveDropStartMinutes,
  TIMELINE_ZOOM_OPTIONS,
  topPxToMinutes,
  type TimelineBlock,
  type TimelineEntryKind,
  type TimelineZoom,
} from "@/lib/timeline-layout";
import { formatDurationLabel } from "@/lib/schedule-layout";
import { QUICK_SCHEDULE_HELP } from "@/lib/schedule-help";
import {
  timelineGridGutterClass,
  TIMELINE_TIME_COLUMN_CLASS,
} from "@/lib/workspace-layout";
import {
  getActiveTaskDragId,
  markTimelineDropConsumed,
  setActiveTaskDragId,
  TIMELINE_DRAG_ID_MIME,
  TIMELINE_DRAG_KIND_MIME,
  TIMELINE_SCHEDULER_ATTR,
} from "@/lib/timeline-drag";
import { cn } from "@/lib/utils";
import type { Habit } from "@/types/habit";
import {
  normalizePlanningState,
  PLANNING_STATE_CONFIG,
  PLANNING_STATES,
} from "@/lib/task-planning";
import type { PlanningState, Task, TaskGroupWithTasks } from "@/types/task";

export type TimelinePlannerVariant = "drawer" | "fullscreen";

export type TimelinePlannerFocusRequest = {
  taskId: string;
  nonce: number;
};

type InboxTab = "unscheduled" | "later";

export type TimelinePlannerProps = {
  variant?: TimelinePlannerVariant;
  viewDate: string;
  onViewDateChange: (date: string) => void;
  groups: TaskGroupWithTasks[];
  selectedTaskId: string | null;
  focusRequest?: TimelinePlannerFocusRequest | null;
  onClose?: () => void;
  onSelectTask: (taskId: string | null) => void;
  onOpenDetail: (taskId: string) => void;
  onScheduleTask: (
    taskId: string,
    updates: {
      scheduled_date: string;
      scheduled_time: string | null;
    }
  ) => Promise<void>;
  onToggleComplete: (task: Task) => Promise<void>;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onDuplicateTask: (task: Task) => Promise<void>;
  onSetPlanningState?: (
    taskId: string,
    planningState: PlanningState
  ) => Promise<void>;
  habits?: Habit[];
  selectedHabitId?: string | null;
  onSelectHabit?: (habitId: string | null) => void;
  onScheduleHabit?: (
    habitId: string,
    updates: { scheduled_time: string | null }
  ) => Promise<void>;
  onToggleHabitComplete?: (habit: Habit) => Promise<void>;
  onDeleteHabit?: (habitId: string) => Promise<void>;
};

type DragSource = "pool" | "unscheduled" | "timeline";
type DragItem = { kind: TimelineEntryKind; id: string };

const TIMELINE_EDGE_SCROLL_ZONE = 56;
const TIMELINE_EDGE_SCROLL_SPEED = 14;
const TIMELINE_TASK_ELEVATION =
  "shadow-[0_1px_2px_0_rgba(15,23,42,0.06)] dark:shadow-[0_1px_2px_0_rgba(0,0,0,0.2)]";
const TIMELINE_TASK_SELECTED =
  "border-sky-400/38 bg-sky-50/55 dark:bg-sky-500/10";
const TIMELINE_DROP_PREVIEW =
  "rounded-lg border border-dashed border-sky-400/45 bg-sky-500/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35)]";

function QuickScheduleInfoMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex shrink-0 items-center justify-center rounded-sm px-0.5 text-[11px] leading-none text-muted-foreground hover:bg-muted/80 hover:text-foreground"
        aria-label="About Quick Schedule"
      >
        ⓘ
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        className="w-64 rounded-xl p-3"
      >
        <p className="text-sm font-semibold text-foreground">
          {QUICK_SCHEDULE_HELP.title}
        </p>
        {QUICK_SCHEDULE_HELP.paragraphs.map((paragraph, index) => (
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TimelinePlanner({
  variant = "drawer",
  viewDate,
  onViewDateChange,
  groups,
  selectedTaskId,
  focusRequest,
  onClose,
  onSelectTask,
  onOpenDetail,
  onScheduleTask,
  onToggleComplete,
  onUpdateTask,
  onDeleteTask,
  onDuplicateTask,
  onSetPlanningState,
  habits = [],
  selectedHabitId = null,
  onSelectHabit,
  onScheduleHabit,
  onToggleHabitComplete,
  onDeleteHabit,
}: TimelinePlannerProps) {
  const isFullscreen = variant === "fullscreen";
  const isDrawer = variant === "drawer";
  const showTaskPool = isFullscreen;
  const showHabits = showTaskPool && habits.length > 0 && Boolean(onScheduleHabit);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timelineBodyRef = useRef<HTMLDivElement>(null);
  const dropPreviewMinutesRef = useRef<number | null>(null);
  const draggingItemRef = useRef<DragItem | null>(null);
  const pointerYRef = useRef(0);
  const timelineAutoScrollRafRef = useRef<number | null>(null);
  const scheduledSlotsRef = useRef<ReturnType<typeof buildScheduledSlots>>([]);
  const zoomRef = useRef<TimelineZoom>("30");
  const taskByIdRef = useRef<Map<string, Task>>(new Map());
  const unscheduledSectionRef = useRef<HTMLElement>(null);
  const focusHandledRef = useRef<string | null>(null);
  const [zoom, setZoom] = useState<TimelineZoom>("30");
  const [nowTick, setNowTick] = useState(0);
  const [poolCollapsed, setPoolCollapsed] = useState<Set<string>>(new Set());
  const [habitsPoolCollapsed, setHabitsPoolCollapsed] = useState(false);
  const [dayPickerOpen, setDayPickerOpen] = useState(false);
  const [draggingItem, setDraggingItem] = useState<DragItem | null>(null);
  const [dropPreviewMinutes, setDropPreviewMinutes] = useState<number | null>(
    null
  );
  const [contextMenu, setContextMenu] = useState<
    | { kind: "task"; task: Task; x: number; y: number }
    | { kind: "habit"; habit: Habit; x: number; y: number }
    | null
  >(null);
  const [inboxTab, setInboxTab] = useState<InboxTab>("unscheduled");
  const [taskListWidth, setTaskListWidth] = useState(
    QUICK_SCHEDULE_TASK_LIST_WIDTH_DEFAULT
  );
  const taskListMaxWidth = getQuickScheduleTaskListEffectiveMax();
  const compactTaskListTabs = taskListWidth < 240;

  useEffect(() => {
    setTaskListWidth(getQuickScheduleTaskListWidth());
  }, []);

  const taskListWidthRef = useRef(taskListWidth);

  useEffect(() => {
    taskListWidthRef.current = taskListWidth;
  }, [taskListWidth]);

  const handleTaskListResizeDelta = useCallback((deltaX: number) => {
    setTaskListWidth((prev) => clampQuickScheduleTaskListWidth(prev + deltaX));
  }, []);

  const handleTaskListResizeEnd = useCallback(() => {
    setQuickScheduleTaskListWidth(taskListWidthRef.current);
  }, []);

  const isViewingToday = viewDate === getTodayDateString();
  const hourHeightPx = getHourHeightPx(zoom);
  const timelineHeightPx = getTimelineHeightPx(zoom);
  const hourLabels = useMemo(() => buildTimelineHourLabels(), []);
  const hourGridBorderClass = isDrawer ? "border-border/38" : "border-border/22";

  const dayTasks = useMemo(
    () => collectTasksForViewDate(groups, viewDate),
    [groups, viewDate]
  );

  const dayHabits = useMemo(
    () => (showHabits ? filterHabitsForViewDate(habits, viewDate) : []),
    [showHabits, habits, viewDate]
  );

  const allBoardTasks = useMemo(
    () => collectAllBoardTasks(groups),
    [groups]
  );

  const unscheduledDayTasks = useMemo(
    () => filterUnscheduledTasksForDay(allBoardTasks, viewDate),
    [allBoardTasks, viewDate]
  );

  const unscheduledTasks = useMemo(() => {
    if (isDrawer) {
      return unscheduledDayTasks;
    }
    return dayTasks
      .filter(
        (task) =>
          !task.completed &&
          !task.scheduled_time &&
          !taskBelongsInLaterView(task)
      )
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [isDrawer, unscheduledDayTasks, dayTasks]);

  const laterTasks = useMemo(
    () =>
      allBoardTasks
        .filter((task) => !task.completed && taskBelongsInLaterView(task))
        .sort((a, b) => a.sort_order - b.sort_order),
    [allBoardTasks]
  );

  const inboxTasks =
    inboxTab === "later" ? laterTasks : unscheduledTasks;

  const unscheduledHabits = useMemo(
    () =>
      dayHabits
        .filter(
          (habit) => !habit.scheduled_time && !isHabitDoneOnDate(habit, viewDate)
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    [dayHabits, viewDate]
  );

  const scheduledTasks = useMemo(
    () =>
      dayTasks
        .filter(
          (task) => Boolean(task.scheduled_date) && Boolean(task.scheduled_time)
        )
        .sort(
          (a, b) =>
            (a.scheduled_time ?? "").localeCompare(b.scheduled_time ?? "")
        ),
    [dayTasks]
  );

  const scheduledHabits = useMemo(
    () =>
      dayHabits
        .filter((habit) => Boolean(habit.scheduled_time))
        .sort(
          (a, b) =>
            (a.scheduled_time ?? "").localeCompare(b.scheduled_time ?? "")
        ),
    [dayHabits]
  );

  const scheduledSlots = useMemo(
    () => buildScheduledSlots(scheduledTasks, scheduledHabits),
    [scheduledTasks, scheduledHabits]
  );

  const timelineBlocks = useMemo(
    () => buildTimelineBlocks(scheduledTasks, zoom, scheduledHabits),
    [scheduledTasks, scheduledHabits, zoom]
  );

  const overlappingIds = useMemo(
    () => findOverlappingEntryIds(timelineBlocks),
    [timelineBlocks]
  );

  const timelineSchedulingDragActive =
    Boolean(draggingItem) || Boolean(getActiveTaskDragId());

  const poolGroups = useMemo(() => collectPoolGroups(groups), [groups]);

  const taskById = useMemo(() => {
    const map = new Map<string, Task>();
    for (const group of groups) {
      for (const task of group.tasks) {
        map.set(task.id, task);
      }
    }
    return map;
  }, [groups]);

  const dropPreviewLayout = useMemo(() => {
    if (dropPreviewMinutes === null) return null;

    const activeTaskId = getActiveTaskDragId();
    const dragItem =
      draggingItem ??
      (activeTaskId ? ({ kind: "task" as const, id: activeTaskId } satisfies DragItem) : null);
    if (!dragItem) return null;

    let durationMinutes = DEFAULT_TASK_DURATION;
    if (dragItem.kind === "habit") {
      durationMinutes = getHabitDurationMinutes(dragItem.id);
    } else {
      const task = taskById.get(dragItem.id);
      durationMinutes = task ? getTaskDurationMinutes(task) : DEFAULT_TASK_DURATION;
    }

    const topPx = minutesToTopPx(dropPreviewMinutes, zoom);
    const heightPx = Math.max(
      MIN_BLOCK_HEIGHT_PX,
      (durationMinutes / 60) * hourHeightPx
    );

    return {
      topPx,
      heightPx,
      startMinutes: dropPreviewMinutes,
      endMinutes: dropPreviewMinutes + durationMinutes,
    };
  }, [dropPreviewMinutes, draggingItem, taskById, zoom, hourHeightPx]);

  const suppressedHourLabels = useMemo(() => {
    if (!dropPreviewLayout) return new Set<number>();
    const hidden = new Set<number>();
    if (dropPreviewLayout.startMinutes % 60 === 0) {
      hidden.add(Math.floor(dropPreviewLayout.startMinutes / 60));
    }
    if (
      dropPreviewLayout.heightPx >= 28 &&
      dropPreviewLayout.endMinutes % 60 === 0
    ) {
      hidden.add(Math.floor(dropPreviewLayout.endMinutes / 60));
    }
    return hidden;
  }, [dropPreviewLayout]);

  useEffect(() => {
    scheduledSlotsRef.current = scheduledSlots;
    zoomRef.current = zoom;
    taskByIdRef.current = taskById;
  }, [scheduledSlots, zoom, taskById]);

  useEffect(() => {
    draggingItemRef.current = draggingItem;
  }, [draggingItem]);

  const nowLineTopPx = useMemo(() => {
    if (!isViewingToday) return null;
    void nowTick;
    return getNowLineTopPx(zoom);
  }, [isViewingToday, nowTick, zoom]);

  useEffect(() => {
    if (!isViewingToday) return;
    const interval = window.setInterval(() => setNowTick((value) => value + 1), 60_000);
    return () => window.clearInterval(interval);
  }, [isViewingToday]);

  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    window.addEventListener("mousedown", close);
    window.addEventListener("scroll", close, true);
    return () => {
      window.removeEventListener("mousedown", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [contextMenu]);

  const scrollToNow = useCallback(() => {
    const container = scrollRef.current;
    if (!container || nowLineTopPx === null) return;
    container.scrollTo({
      top: Math.max(0, nowLineTopPx - container.clientHeight / 3),
      behavior: "smooth",
    });
  }, [nowLineTopPx]);

  const handleNowClick = useCallback(() => {
    if (!isViewingToday) {
      onViewDateChange(getTodayDateString());
      return;
    }
    scrollToNow();
  }, [isViewingToday, onViewDateChange, scrollToNow]);

  useEffect(() => {
    if (isViewingToday) {
      const frame = requestAnimationFrame(scrollToNow);
      return () => cancelAnimationFrame(frame);
    }
  }, [isViewingToday, scrollToNow]);

  useEffect(() => {
    if (!focusRequest?.taskId || !isDrawer) return;

    const key = `${focusRequest.taskId}:${focusRequest.nonce}`;
    if (focusHandledRef.current === key) return;
    focusHandledRef.current = key;

    onSelectTask(focusRequest.taskId);
    onSelectHabit?.(null);

    const task = taskById.get(focusRequest.taskId);
    const frame = requestAnimationFrame(() => {
      if (
        task?.scheduled_time &&
        task.scheduled_date === viewDate
      ) {
        const minutes = parseTimeToMinutes(task.scheduled_time);
        const container = scrollRef.current;
        if (container) {
          container.scrollTo({
            top: Math.max(
              0,
              minutesToTopPx(minutes, zoom) - container.clientHeight / 3
            ),
            behavior: "smooth",
          });
        }
        return;
      }

      unscheduledSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [
    focusRequest,
    isDrawer,
    onSelectTask,
    onSelectHabit,
    taskById,
    viewDate,
    zoom,
  ]);

  function stopTimelineAutoScroll() {
    if (timelineAutoScrollRafRef.current !== null) {
      cancelAnimationFrame(timelineAutoScrollRafRef.current);
      timelineAutoScrollRafRef.current = null;
    }
  }

  function clientYToTimelineTopPx(clientY: number): number | null {
    const scroll = scrollRef.current;
    if (!scroll) return null;

    const rect = scroll.getBoundingClientRect();
    if (clientY < rect.top || clientY > rect.bottom) return null;

    return clientY - rect.top + scroll.scrollTop;
  }

  function readActiveDragItem(event?: DragEvent): DragItem | null {
    if (draggingItemRef.current) return draggingItemRef.current;

    const activeTaskId = getActiveTaskDragId();
    if (activeTaskId) {
      return { kind: "task", id: activeTaskId };
    }

    if (!event) return null;

    const kind = event.dataTransfer.getData(
      TIMELINE_DRAG_KIND_MIME
    ) as TimelineEntryKind;
    const id =
      event.dataTransfer.getData(TIMELINE_DRAG_ID_MIME) ||
      event.dataTransfer.getData("text/plain");
    if (id && (kind === "task" || kind === "habit")) {
      return { kind, id };
    }
    if (id) return { kind: "task", id };
    return null;
  }

  function resolveDropMinutesAt(
    clientY: number,
    dragItem: DragItem | null
  ): number | null {
    const topPx = clientYToTimelineTopPx(clientY);
    if (topPx === null) return null;

    const rawMinutes = topPxToMinutes(topPx, zoomRef.current);

    let duration = DEFAULT_TASK_DURATION;
    if (dragItem?.kind === "habit") {
      duration = getHabitDurationMinutes(dragItem.id);
    } else if (dragItem?.kind === "task") {
      const task = taskByIdRef.current.get(dragItem.id);
      duration = task ? getTaskDurationMinutes(task) : DEFAULT_TASK_DURATION;
    }

    return resolveDropStartMinutes(
      rawMinutes,
      scheduledSlotsRef.current,
      dragItem?.id ?? null,
      duration
    );
  }

  function updateTimelineDropPreview(clientY: number, event?: DragEvent) {
    if (!isTimelineDragActive(event)) return;

    const dragItem = readActiveDragItem(event);
    const minutes = resolveDropMinutesAt(clientY, dragItem);
    dropPreviewMinutesRef.current = minutes;
    setDropPreviewMinutes(minutes);
  }

  function tickTimelineAutoScroll() {
    const container = scrollRef.current;
    if (!container || !isTimelineDragActive()) {
      stopTimelineAutoScroll();
      return;
    }

    const rect = container.getBoundingClientRect();
    const y = pointerYRef.current;
    let delta = 0;

    if (y < rect.top + TIMELINE_EDGE_SCROLL_ZONE) {
      const depth =
        (rect.top + TIMELINE_EDGE_SCROLL_ZONE - y) / TIMELINE_EDGE_SCROLL_ZONE;
      delta = -TIMELINE_EDGE_SCROLL_SPEED * Math.min(1, depth);
    } else if (y > rect.bottom - TIMELINE_EDGE_SCROLL_ZONE) {
      const depth =
        (y - (rect.bottom - TIMELINE_EDGE_SCROLL_ZONE)) /
        TIMELINE_EDGE_SCROLL_ZONE;
      delta = TIMELINE_EDGE_SCROLL_SPEED * Math.min(1, depth);
    }

    if (delta !== 0) {
      container.scrollTop += delta;
      updateTimelineDropPreview(pointerYRef.current);
    }

    timelineAutoScrollRafRef.current = requestAnimationFrame(tickTimelineAutoScroll);
  }

  function startTimelineAutoScroll() {
    if (timelineAutoScrollRafRef.current !== null) return;
    timelineAutoScrollRafRef.current = requestAnimationFrame(tickTimelineAutoScroll);
  }

  useEffect(() => {
    return () => {
      stopTimelineAutoScroll();
    };
  }, []);

  useEffect(() => {
    const onDocumentDragOver = (event: globalThis.DragEvent) => {
      if (!isTimelineDragActive(event)) {
        stopTimelineAutoScroll();
        return;
      }

      pointerYRef.current = event.clientY;

      const container = scrollRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const nearTimeline =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top - TIMELINE_EDGE_SCROLL_ZONE &&
        event.clientY <= rect.bottom + TIMELINE_EDGE_SCROLL_ZONE;

      if (!nearTimeline) {
        stopTimelineAutoScroll();
        return;
      }

      startTimelineAutoScroll();

      if (
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      ) {
        event.preventDefault();
        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = "move";
        }
        updateTimelineDropPreview(event.clientY, event);
      }
    };

    document.addEventListener("dragover", onDocumentDragOver);
    return () => {
      document.removeEventListener("dragover", onDocumentDragOver);
      stopTimelineAutoScroll();
    };
  }, []);

  function isDraggingItem(kind: TimelineEntryKind, id: string) {
    return draggingItem?.kind === kind && draggingItem.id === id;
  }

  function beginDrag(
    kind: TimelineEntryKind,
    id: string,
    event: DragEvent,
    source: DragSource
  ) {
    const item = { kind, id };
    draggingItemRef.current = item;
    setDraggingItem(item);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(TIMELINE_DRAG_KIND_MIME, kind);
    event.dataTransfer.setData(TIMELINE_DRAG_ID_MIME, id);
    event.dataTransfer.setData("text/plain", id);
    event.dataTransfer.setData("application/x-flowos-drag-source", source);

    const row = event.currentTarget.closest("[data-timeline-entry]") as
      | HTMLElement
      | null;
    if (row) setDragImageFromElement(event, row, 12, 12);

    if (kind === "task") {
      setActiveTaskDragId(id);
    }
  }

  function endDrag() {
    draggingItemRef.current = null;
    setDraggingItem(null);
    setDropPreviewMinutes(null);
    dropPreviewMinutesRef.current = null;
    setActiveTaskDragId(null);
    stopTimelineAutoScroll();
  }

  function readDragItem(event: DragEvent): DragItem | null {
    if (draggingItem) return draggingItem;

    const activeTaskId = getActiveTaskDragId();
    if (activeTaskId) {
      return { kind: "task", id: activeTaskId };
    }

    const kind = event.dataTransfer.getData(
      TIMELINE_DRAG_KIND_MIME
    ) as TimelineEntryKind;
    const id =
      event.dataTransfer.getData(TIMELINE_DRAG_ID_MIME) ||
      event.dataTransfer.getData("text/plain");
    if (id && (kind === "task" || kind === "habit")) {
      return { kind, id };
    }
    if (id) return { kind: "task", id };
    return null;
  }

  function isTimelineDragActive(event?: DragEvent) {
    return Boolean(
      draggingItem ||
        getActiveTaskDragId() ||
        (event &&
          (event.dataTransfer.types.includes(TIMELINE_DRAG_ID_MIME) ||
            event.dataTransfer.types.includes(TIMELINE_DRAG_KIND_MIME) ||
            event.dataTransfer.types.includes("text/plain")))
    );
  }

  function resolveDropMinutes(
    clientY: number,
    dragItem: DragItem | null
  ): number | null {
    return resolveDropMinutesAt(clientY, dragItem);
  }

  async function scheduleAtMinutes(dragItem: DragItem, minutes: number) {
    const time = `${minutesToTimeString(minutes)}:00`;
    if (dragItem.kind === "habit") {
      await onScheduleHabit?.(dragItem.id, { scheduled_time: time });
      return;
    }
    await onScheduleTask(dragItem.id, {
      scheduled_date: viewDate,
      scheduled_time: time,
    });
  }

  async function handleTimelineDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dragItem = readDragItem(event);
    if (!dragItem) return;

    const minutes =
      dropPreviewMinutesRef.current ??
      resolveDropMinutes(event.clientY, dragItem);
    if (minutes === null) return;

    markTimelineDropConsumed();
    await scheduleAtMinutes(dragItem, minutes);
    endDrag();
  }

  async function handleUnscheduleDrop(event: DragEvent) {
    event.preventDefault();
    const dragItem = readDragItem(event);
    if (!dragItem) return;

    if (dragItem.kind === "habit") {
      await onScheduleHabit?.(dragItem.id, { scheduled_time: null });
    } else if (inboxTab === "later" && onSetPlanningState) {
      await onSetPlanningState(dragItem.id, "later");
    } else {
      await onScheduleTask(dragItem.id, {
        scheduled_date: viewDate,
        scheduled_time: null,
      });
    }
    markTimelineDropConsumed();
    endDrag();
  }

  function handleTimelineDragOver(event: DragEvent) {
    if (!isTimelineDragActive(event)) return;
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
    pointerYRef.current = event.clientY;
    startTimelineAutoScroll();
    updateTimelineDropPreview(event.clientY, event);
  }

  function handleTimelineDragLeave(event: DragEvent) {
    const related = event.relatedTarget;
    const container = scrollRef.current;
    if (
      related instanceof Node &&
      (timelineBodyRef.current?.contains(related) ||
        container?.contains(related))
    ) {
      return;
    }
    setDropPreviewMinutes(null);
  }

  function togglePoolGroup(groupId: string) {
    setPoolCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  }

  const Root = isFullscreen ? "div" : "aside";
  const viewDateLabel = formatTodayColumnTitle(viewDate);

  const drawerQuickDates = useMemo(
    () => [
      { key: getYesterdayDateString(), label: "Yesterday" },
      { key: getTodayDateString(), label: "Today" },
      { key: getTomorrowDateString(), label: "Tomorrow" },
    ],
    []
  );

  const zoomControl = (
    <div
      className={cn(
        "flex shrink-0 rounded-md border p-0.5",
        isDrawer
          ? "h-7 items-center rounded-full border-border/50 bg-muted/15 p-0.5"
          : "border-border/50"
      )}
    >
      {TIMELINE_ZOOM_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setZoom(option.value)}
          className={cn(
            "rounded font-medium transition-colors",
            isDrawer
              ? "px-2 py-0.5 text-xs"
              : "rounded-md px-2 py-0.5 text-[10px]",
            zoom === option.value
              ? isDrawer
                ? "bg-background text-foreground shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
                : "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  const dayNavControl = (
    <div className={cn("flex items-center", isDrawer ? "gap-0" : "gap-0.5")}>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={cn(isDrawer ? "size-5" : "size-7")}
        onClick={() => onViewDateChange(shiftDateKey(viewDate, -1))}
        aria-label="Previous day"
      >
        <ChevronRight
          className={cn("rotate-180", isDrawer ? "size-3" : "size-4")}
        />
      </Button>
      <DropdownMenu open={dayPickerOpen} onOpenChange={setDayPickerOpen}>
        <DropdownMenuTrigger
          className={cn(
            "inline-flex items-center rounded-md font-medium outline-none hover:bg-muted/60",
            isDrawer
              ? "h-5 gap-0.5 px-1 text-[11px]"
              : "h-7 gap-1 px-2 text-xs"
          )}
          aria-label={`Selected day: ${viewDateLabel}`}
        >
          {viewDateLabel}
          <ChevronDown
            className={cn(
              "text-muted-foreground",
              isDrawer ? "size-2.5" : "size-3.5"
            )}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="center" className="w-40 p-1">
          {drawerQuickDates.map((item) => (
            <DropdownMenuItem
              key={item.key}
              onClick={() => {
                onViewDateChange(item.key);
                setDayPickerOpen(false);
              }}
              className={cn(
                "text-xs",
                viewDate === item.key && "bg-muted font-medium"
              )}
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={cn(isDrawer ? "size-5" : "size-7")}
        onClick={() => onViewDateChange(shiftDateKey(viewDate, 1))}
        aria-label="Next day"
      >
        <ChevronRight className={cn(isDrawer ? "size-3" : "size-4")} />
      </Button>
    </div>
  );

  const nowButton = (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn(
        "shrink-0 rounded-md border-border/50 bg-background font-normal text-muted-foreground/85 shadow-sm hover:border-sky-400/35 hover:bg-background hover:text-foreground",
        isDrawer ? "h-5 px-1.5 text-[10px]" : "h-6 px-2 text-[11px]"
      )}
      onClick={handleNowClick}
    >
      Now
    </Button>
  );

  const timelinePanel = (
    <div
      ref={scrollRef}
      className={cn(
        "relative min-h-0 flex-1 overflow-y-auto bg-background",
        !isDrawer && "border-t border-border/40"
      )}
      onDragOver={handleTimelineDragOver}
      onDrop={(event) => void handleTimelineDrop(event)}
      onDragLeave={handleTimelineDragLeave}
    >
      <div
        ref={timelineBodyRef}
        className="relative"
        style={{ height: timelineHeightPx }}
      >
        <div
          className={cn(
            "absolute inset-0 flex",
            timelineGridGutterClass(isDrawer)
          )}
        >
          <div
            className={cn(
              "relative shrink-0 border-r",
              TIMELINE_TIME_COLUMN_CLASS,
              isDrawer ? "border-border/30 bg-muted/10" : "border-border/20"
            )}
          >
            {hourLabels.map(({ hour, label }) => (
              <div
                key={hour}
                className={cn(
                  "border-b pr-2 text-right text-[10px] tabular-nums text-muted-foreground/70",
                  hourGridBorderClass
                )}
                style={{ height: hourHeightPx }}
              >
                {!suppressedHourLabels.has(hour) ? (
                  <span className="relative -top-2">{label}</span>
                ) : null}
              </div>
            ))}
            {dropPreviewLayout && isTimelineDragActive() && (
              <>
                <TimelineDropTimeMarker
                  topPx={dropPreviewLayout.topPx}
                  minutes={dropPreviewLayout.startMinutes}
                />
                {dropPreviewLayout.heightPx >= 28 && (
                  <TimelineDropTimeMarker
                    topPx={dropPreviewLayout.topPx + dropPreviewLayout.heightPx}
                    minutes={dropPreviewLayout.endMinutes}
                    subdued
                  />
                )}
              </>
            )}
          </div>

          <div className="relative min-w-0 flex-1">
            {hourLabels.map(({ hour }) => (
              <div
                key={hour}
                className={cn("border-b", hourGridBorderClass)}
                style={{ height: hourHeightPx }}
              />
            ))}

            {dropPreviewLayout && isTimelineDragActive() && (
              <div
                className="pointer-events-none absolute inset-x-1 z-30"
                style={{
                  top: dropPreviewLayout.topPx,
                  height: dropPreviewLayout.heightPx,
                }}
              >
                {dropPreviewLayout.startMinutes % 60 === 0 ? (
                  <div
                    className="absolute right-0 left-0 top-0 z-10 h-0.5 bg-sky-500/85"
                    aria-hidden
                  />
                ) : null}
                <div className={cn("h-full", TIMELINE_DROP_PREVIEW)} />
              </div>
            )}

            {nowLineTopPx !== null && (
              <div
                className="pointer-events-none absolute inset-x-1 z-30 flex items-center gap-2"
                style={{ top: nowLineTopPx }}
              >
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-400/85 to-transparent" />
                <span className="shrink-0 rounded-full bg-red-500/90 px-2 py-0.5 text-[10px] font-medium tabular-nums text-white shadow-sm">
                  {formatNowTimeInAppTimezone()}
                </span>
              </div>
            )}

            {timelineBlocks.map((block) => (
              <TimelineScheduledBlock
                key={`${block.kind}-${block.id}`}
                block={block}
                groups={groups}
                viewDate={viewDate}
                drawerMode={isDrawer}
                selected={
                  block.kind === "task"
                    ? selectedTaskId === block.id
                    : selectedHabitId === block.id
                }
                overlapping={overlappingIds.has(block.id)}
                onSelect={() => {
                  if (block.kind === "task") {
                    onSelectTask(block.id);
                    onSelectHabit?.(null);
                  } else {
                    onSelectHabit?.(block.id);
                    onSelectTask(null);
                  }
                }}
                onOpenDetail={() => {
                  if (block.kind === "task") onOpenDetail(block.id);
                }}
                onToggleComplete={() => {
                  if (block.kind === "task" && block.task) {
                    void onToggleComplete(block.task);
                  } else if (block.kind === "habit" && block.habit) {
                    void onToggleHabitComplete?.(block.habit);
                  }
                }}
                onUpdateDuration={(minutes) => {
                  if (block.kind === "task") {
                    void onUpdateTask(block.id, { duration_minutes: minutes });
                  }
                }}
                onContextMenu={(event) => {
                  event.preventDefault();
                  if (block.kind === "task" && block.task) {
                    setContextMenu({
                      kind: "task",
                      task: block.task,
                      x: event.clientX,
                      y: event.clientY,
                    });
                  } else if (block.kind === "habit" && block.habit) {
                    setContextMenu({
                      kind: "habit",
                      habit: block.habit,
                      x: event.clientX,
                      y: event.clientY,
                    });
                  }
                }}
                onDragStart={(event) =>
                  beginDrag(block.kind, block.id, event, "timeline")
                }
                onDragEnd={endDrag}
                onTimelineDragOver={handleTimelineDragOver}
                onTimelineDrop={(event) => void handleTimelineDrop(event)}
                isDragging={isDraggingItem(block.kind, block.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Root
      {...{ [TIMELINE_SCHEDULER_ATTR]: "" }}
      className={cn(
        "flex h-full min-h-0 flex-col bg-card",
        isFullscreen
          ? "w-full"
          : "h-full w-full border-l border-border/50 bg-[#fafbfc] shadow-sm animate-in slide-in-from-right-4 duration-200 dark:bg-card"
      )}
    >
      <header
        className={cn(
          "relative shrink-0 border-b",
          isFullscreen
            ? "flex items-center gap-2 border-border/30 py-3"
            : "border-border/50 bg-background/70 px-2 py-1.5"
        )}
      >
        {isDrawer ? (
          <div className="flex w-full items-center gap-1">
            <div className="flex min-w-0 shrink-0 items-center gap-1">
              {onClose ? (
                  <button
                    type="button"
                    onClick={onClose}
                    className={panelToggleSquareClass("sm")}
                    aria-label="Collapse Quick Schedule"
                  >
                    <Clock className={panelTogglePrimaryIconClass("sm")} />
                    <PanelRightClose className={panelToggleHoverIconClass("sm")} />
                  </button>
                ) : (
                  <Clock className="size-3.5 shrink-0 text-sky-600" />
                )}
              <h2 className="shrink-0 text-sm font-semibold leading-none tracking-tight text-foreground">
                Quick Schedule
              </h2>
              <QuickScheduleInfoMenu />
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-1">
              {dayNavControl}
              {nowButton}
              {zoomControl}
            </div>
          </div>
        ) : (
          <>
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Clock className="size-4 shrink-0 text-sky-600" />
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold">Schedule</h2>
                <p className="truncate text-[11px] text-muted-foreground">
                  {viewDateLabel}
                  {" · drag tasks & habits to plan your day"}
                </p>
              </div>
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-1">
              {dayNavControl}
              {nowButton}
              {zoomControl}

              {onClose ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={onClose}
                  aria-label="Close schedule"
                >
                  <X className="size-4" />
                </Button>
              ) : null}
            </div>
          </>
        )}
      </header>

      <div className="flex min-h-0 flex-1">
        <div
          className={cn(
            "flex min-h-0 flex-col",
            isDrawer
              ? "shrink-0 overflow-hidden border-r border-border/30 bg-gradient-to-b from-muted/25 to-muted/10"
              : showTaskPool
                ? "min-w-0 flex-[7] border-r border-border/30"
                : "min-w-0 flex-1"
          )}
            style={
            isDrawer
              ? {
                  width: taskListWidth,
                  minWidth: QUICK_SCHEDULE_TASK_LIST_WIDTH_MIN,
                  maxWidth: taskListMaxWidth,
                }
              : undefined
          }
        >
          <section
            ref={unscheduledSectionRef}
            className={cn(
              isDrawer ? "px-1.5" : "px-0",
              isDrawer
                ? "flex min-h-0 flex-1 flex-col overflow-hidden py-1.5"
                : "shrink-0 border-b border-border/30 py-2"
            )}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
            }}
            onDrop={(event) => void handleUnscheduleDrop(event)}
          >
            <div
              className={cn(
                "inline-flex max-w-full items-center gap-0.5 rounded-md bg-muted/35 p-0.5",
                "mb-1"
              )}
            >
                <button
                  type="button"
                  onClick={() => setInboxTab("unscheduled")}
                  className={cn(
                    "shrink-0 rounded px-1.5 py-0.5 font-medium whitespace-nowrap transition-colors",
                    compactTaskListTabs ? "text-[9px]" : "text-[10px]",
                    inboxTab === "unscheduled"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {compactTaskListTabs
                    ? `Unsched. (${unscheduledTasks.length})`
                    : `Unscheduled (${unscheduledTasks.length})`}
                </button>
                <button
                  type="button"
                  onClick={() => setInboxTab("later")}
                  className={cn(
                    "shrink-0 rounded px-1.5 py-0.5 font-medium whitespace-nowrap transition-colors",
                    compactTaskListTabs ? "text-[9px]" : "text-[10px]",
                    inboxTab === "later"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Later ({laterTasks.length})
                </button>
            </div>
            <div
              className={cn(
                "flex gap-1.5",
                isDrawer
                  ? "min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto"
                  : "min-h-[3rem] flex-wrap"
              )}
            >
              {inboxTab === "unscheduled" &&
              inboxTasks.length === 0 &&
              (!showHabits || unscheduledHabits.length === 0) ? (
                <div className="flex w-full flex-col gap-0.5 px-1 py-1.5">
                  {isDrawer ? (
                    <>
                      <p className="text-[11px] font-medium text-foreground/80">
                        All tasks are scheduled.
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Drag a scheduled task here to remove its time.
                      </p>
                    </>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">
                      Drag items here to clear their time
                    </p>
                  )}
                </div>
              ) : inboxTab === "later" && inboxTasks.length === 0 ? (
                <div className="flex w-full flex-col gap-0.5 px-1 py-1.5">
                  <p className="text-[11px] font-medium text-foreground/80">
                    No tasks in Later.
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Move tasks to Later from the board or task menu.
                  </p>
                </div>
              ) : (
                <>
                  {inboxTasks.map((task) => (
                    <TimelinePoolChip
                      key={`task-${task.id}`}
                      task={task}
                      groups={groups}
                      fullWidth={isDrawer}
                      compact={isDrawer}
                      selected={selectedTaskId === task.id}
                      onSelect={() => {
                        onSelectTask(task.id);
                        onSelectHabit?.(null);
                      }}
                      onOpenDetail={() => onOpenDetail(task.id)}
                      onToggleComplete={() => void onToggleComplete(task)}
                      onContextMenu={(event) => {
                        event.preventDefault();
                        setContextMenu({
                          kind: "task",
                          task,
                          x: event.clientX,
                          y: event.clientY,
                        });
                      }}
                      onDragStart={(event) =>
                        beginDrag("task", task.id, event, "unscheduled")
                      }
                      onDragEnd={endDrag}
                      isDragging={isDraggingItem("task", task.id)}
                      onUpdateDuration={(minutes) =>
                        void onUpdateTask(task.id, { duration_minutes: minutes })
                      }
                    />
                  ))}
                  {inboxTab === "unscheduled" &&
                    showHabits &&
                    unscheduledHabits.map((habit) => (
                    <TimelineHabitChip
                      key={`habit-${habit.id}`}
                      habit={habit}
                      viewDate={viewDate}
                      compact={isDrawer}
                      selected={selectedHabitId === habit.id}
                      onSelect={() => {
                        onSelectHabit?.(habit.id);
                        onSelectTask(null);
                      }}
                      onToggleComplete={() =>
                        void onToggleHabitComplete?.(habit)
                      }
                      onContextMenu={(event) => {
                        event.preventDefault();
                        setContextMenu({
                          kind: "habit",
                          habit,
                          x: event.clientX,
                          y: event.clientY,
                        });
                      }}
                      onDragStart={(event) =>
                        beginDrag("habit", habit.id, event, "unscheduled")
                      }
                      onDragEnd={endDrag}
                      isDragging={isDraggingItem("habit", habit.id)}
                    />
                    ))}
                </>
              )}
            </div>
          </section>
          {!isDrawer ? timelinePanel : null}
        </div>
        {isDrawer ? (
          <>
            <QuickScheduleResizeHandle
              onResizeDelta={handleTaskListResizeDelta}
              onResizeEnd={handleTaskListResizeEnd}
            />
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              {timelinePanel}
            </div>
          </>
        ) : null}

        {showTaskPool ? (
        <aside className="flex min-w-0 flex-[3] flex-col">
          <div className="shrink-0 border-b border-border/30 px-3 py-2">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Task pool
            </p>
            <p className="text-[10px] text-muted-foreground">
              Drag onto the timeline
            </p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
            {showHabits && (
              <div className="mb-3">
                <button
                  type="button"
                  onClick={() => setHabitsPoolCollapsed((value) => !value)}
                  className="flex w-full items-center gap-1 rounded-md px-1 py-1 text-left text-xs font-semibold text-foreground hover:bg-muted/50"
                >
                  {habitsPoolCollapsed ? (
                    <ChevronRight className="size-3.5 shrink-0" />
                  ) : (
                    <ChevronDown className="size-3.5 shrink-0" />
                  )}
                  <span className="truncate">Habits</span>
                  <span className="ml-auto text-[10px] font-normal text-muted-foreground">
                    {
                      dayHabits.filter(
                        (habit) => !isHabitDoneOnDate(habit, viewDate)
                      ).length
                    }
                  </span>
                </button>

                {!habitsPoolCollapsed && (
                  <div className="mt-0.5 space-y-0.5 pl-1">
                    {dayHabits.filter(
                      (habit) => !isHabitDoneOnDate(habit, viewDate)
                    ).length === 0 ? (
                      <p className="px-1 py-1 text-[10px] text-muted-foreground">
                        No habits today
                      </p>
                    ) : (
                      dayHabits
                        .filter((habit) => !isHabitDoneOnDate(habit, viewDate))
                        .map((habit) => (
                          <TimelineHabitChip
                            key={habit.id}
                            habit={habit}
                            viewDate={viewDate}
                            compact
                            selected={selectedHabitId === habit.id}
                            onSelect={() => {
                              onSelectHabit?.(habit.id);
                              onSelectTask(null);
                            }}
                            onToggleComplete={() =>
                              void onToggleHabitComplete?.(habit)
                            }
                            onContextMenu={(event) => {
                              event.preventDefault();
                              setContextMenu({
                                kind: "habit",
                                habit,
                                x: event.clientX,
                                y: event.clientY,
                              });
                            }}
                            onDragStart={(event) =>
                              beginDrag("habit", habit.id, event, "pool")
                            }
                            onDragEnd={endDrag}
                            isDragging={isDraggingItem("habit", habit.id)}
                          />
                        ))
                    )}
                  </div>
                )}
              </div>
            )}

            {poolGroups.map((group) => {
              const poolTasks = group.tasks.filter((task) => !task.completed);
              const collapsed = poolCollapsed.has(group.id);

              return (
                <div key={group.id} className="mb-2">
                  <button
                    type="button"
                    onClick={() => togglePoolGroup(group.id)}
                    className="flex w-full items-center gap-1 rounded-md px-1 py-1 text-left text-xs font-semibold text-foreground hover:bg-muted/50"
                  >
                    {collapsed ? (
                      <ChevronRight className="size-3.5 shrink-0" />
                    ) : (
                      <ChevronDown className="size-3.5 shrink-0" />
                    )}
                    <span className="truncate">{group.title}</span>
                    <span className="ml-auto text-[10px] font-normal text-muted-foreground">
                      {poolTasks.length}
                    </span>
                  </button>

                  {!collapsed && (
                    <div className="mt-0.5 space-y-0.5 pl-1">
                      {poolTasks.length === 0 ? (
                        <p className="px-1 py-1 text-[10px] text-muted-foreground">
                          No tasks
                        </p>
                      ) : (
                        poolTasks.map((task) => (
                          <TimelinePoolChip
                            key={task.id}
                            task={task}
                            groups={groups}
                            fullWidth={isDrawer}
                            selected={selectedTaskId === task.id}
                            onSelect={() => {
                              onSelectTask(task.id);
                              onSelectHabit?.(null);
                            }}
                            onOpenDetail={() => onOpenDetail(task.id)}
                            onToggleComplete={() => void onToggleComplete(task)}
                            onContextMenu={(event) => {
                              event.preventDefault();
                              setContextMenu({
                                kind: "task",
                                task,
                                x: event.clientX,
                                y: event.clientY,
                              });
                            }}
                            onDragStart={(event) =>
                              beginDrag("task", task.id, event, "pool")
                            }
                            onDragEnd={endDrag}
                            isDragging={isDraggingItem("task", task.id)}
                            compact
                            onUpdateDuration={(minutes) =>
                              void onUpdateTask(task.id, {
                                duration_minutes: minutes,
                              })
                            }
                          />
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>
        ) : null}
      </div>

      {contextMenu?.kind === "task" && (
        <TimelineContextMenu
          task={contextMenu.task}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onOpenDetail={() => {
            onOpenDetail(contextMenu.task.id);
            setContextMenu(null);
          }}
          onClearTime={
            contextMenu.task.scheduled_time
              ? () => {
                  void onScheduleTask(contextMenu.task.id, {
                    scheduled_date: viewDate,
                    scheduled_time: null,
                  });
                  setContextMenu(null);
                }
              : undefined
          }
          onRemoveDate={
            contextMenu.task.scheduled_date
              ? () => {
                  void onUpdateTask(contextMenu.task.id, {
                    scheduled_date: null,
                  });
                  setContextMenu(null);
                }
              : undefined
          }
          onSetPlanningState={
            onSetPlanningState
              ? (planningState) => {
                  void onSetPlanningState(contextMenu.task.id, planningState);
                  setContextMenu(null);
                }
              : undefined
          }
          onDuplicate={() => {
            void onDuplicateTask(contextMenu.task);
            setContextMenu(null);
          }}
          onDelete={() => {
            void onDeleteTask(contextMenu.task.id);
            setContextMenu(null);
          }}
        />
      )}

      {contextMenu?.kind === "habit" && (
        <TimelineHabitContextMenu
          habit={contextMenu.habit}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onClearTime={
            contextMenu.habit.scheduled_time
              ? () => {
                  void onScheduleHabit?.(contextMenu.habit.id, {
                    scheduled_time: null,
                  });
                  setContextMenu(null);
                }
              : undefined
          }
          onDelete={() => {
            void onDeleteHabit?.(contextMenu.habit.id);
            setContextMenu(null);
          }}
        />
      )}
    </Root>
  );
}

type TimelineChipProps = {
  task: Task;
  groups: TaskGroupWithTasks[];
  fullWidth?: boolean;
  selected?: boolean;
  compact?: boolean;
  isDragging?: boolean;
  onSelect: () => void;
  onOpenDetail: () => void;
  onToggleComplete: () => void;
  onContextMenu: (event: MouseEvent) => void;
  onDragStart: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onUpdateDuration: (minutes: number | null) => void;
};

function formatTimelineMinutesLabel(minutes: number): string {
  return (
    formatTimeShort(`${minutesToTimeString(minutes)}:00`) ??
    minutesToTimeString(minutes)
  );
}

function TimelineDropTimeMarker({
  topPx,
  minutes,
  subdued = false,
}: {
  topPx: number;
  minutes: number;
  subdued?: boolean;
}) {
  return (
    <div
      className="pointer-events-none absolute right-0 left-0 z-40"
      style={{ top: topPx }}
    >
      <div
        className={cn(
          "absolute right-0 left-0 h-px",
          subdued ? "bg-sky-500/55" : "bg-sky-500/85"
        )}
        aria-hidden
      />
      <div className="relative -top-2 pr-2 text-right">
        <span
          className={cn(
            "inline-block rounded-sm bg-background px-0.5 text-[10px] font-medium tabular-nums shadow-sm ring-1",
            subdued
              ? "text-sky-700/75 ring-sky-400/20"
              : "text-sky-600 ring-sky-400/35"
          )}
        >
          {formatTimelineMinutesLabel(minutes)}
        </span>
      </div>
    </div>
  );
}

function resolveTimelineTaskGroup(
  task: Task,
  groups: TaskGroupWithTasks[]
): TaskGroupWithTasks | null {
  const byId = groups.find((group) => group.id === task.group_id);
  if (byId && !isTodayGroup(byId)) {
    return byId;
  }
  const inbox = groups.find((group) => isInboxGroup(group));
  return inbox ?? byId ?? null;
}

type TimelineTaskRowContentProps = {
  task: Task;
  group: TaskGroupWithTasks | null;
  compact?: boolean;
  emphasizeTitle?: boolean;
  onToggleComplete: () => void;
  onUpdateDuration: (minutes: number | null) => void;
};

function TimelineTaskRowContent({
  task,
  group,
  compact,
  emphasizeTitle,
  onToggleComplete,
  onUpdateDuration,
}: TimelineTaskRowContentProps) {
  const priority = normalizeTaskPriority(task.priority);
  const appearance = group ? getTaskGroupAppearance(group) : null;

  return (
    <div className={cn("flex w-full min-w-0 items-center justify-between", compact ? "gap-1.5" : "gap-2.5")}>
      <div className={cn("flex min-w-0 flex-1 items-center overflow-hidden", compact ? "gap-1.5" : "gap-2")}>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleComplete();
          }}
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full border transition-colors",
            compact ? "size-4" : "size-[18px]",
            task.completed
              ? "border-foreground bg-foreground text-background"
              : "border-muted-foreground/40 hover:border-foreground/60"
          )}
          aria-label={`Mark "${task.title}" complete`}
        >
          {task.completed && (
            <Check className={cn(compact ? "size-2" : "size-2.5")} strokeWidth={3} />
          )}
        </button>

        <TaskPriorityFlagIcon
          priority={priority}
          className={cn("shrink-0", compact ? "size-3" : "size-3.5")}
        />

        <span
          className={cn(
            "min-w-0 truncate text-foreground",
            emphasizeTitle ? "font-semibold" : "font-[520]",
            compact ? "text-xs leading-none" : "text-[13px] leading-snug",
            task.completed && "line-through"
          )}
        >
          {task.title}
        </span>
      </div>

      <div className={cn("flex shrink-0 items-center", compact ? "gap-1.5" : "gap-2")}>
        {group && appearance ? (
          <TaskGroupPill
            icon={appearance.icon}
            name={group.title}
            appearance={appearance}
            className={cn(
              "max-w-[6rem] shrink-0 gap-0.5 font-medium",
              compact
                ? "rounded px-1 py-px text-[10px] [&_span:first-child]:text-[11px]"
                : "gap-1 rounded-md px-1.5 py-0.5 text-[11px] [&_span:first-child]:text-xs"
            )}
          />
        ) : null}

        <TaskDurationPicker
          variant="timeline"
          durationMinutes={task.duration_minutes}
          onChange={onUpdateDuration}
        />
      </div>
    </div>
  );
}

function TimelinePoolChip({
  task,
  groups,
  fullWidth,
  selected,
  compact,
  isDragging,
  onSelect,
  onOpenDetail,
  onToggleComplete,
  onContextMenu,
  onDragStart,
  onDragEnd,
  onUpdateDuration,
}: TimelineChipProps) {
  const group = resolveTimelineTaskGroup(task, groups);

  return (
    <div
      data-timeline-entry={task.id}
      data-timeline-kind="task"
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onContextMenu={onContextMenu}
      onClick={onSelect}
      onDoubleClick={(event) => {
        event.preventDefault();
        onOpenDetail();
      }}
      className={cn(
        "group flex cursor-grab items-center border bg-background transition-[border-color,box-shadow,background-color,opacity] active:cursor-grabbing",
        TIMELINE_TASK_ELEVATION,
        fullWidth
          ? "min-h-[26px] w-full rounded-lg px-2 py-1"
          : "min-h-[30px] rounded-lg px-2.5 py-1.5",
        compact ? "text-xs" : "text-[13px]",
        "border-border/55 hover:border-border/75 hover:bg-muted/15",
        selected && TIMELINE_TASK_SELECTED,
        isDragging && "opacity-40",
        task.completed &&
          "opacity-[0.45] transition-opacity hover:opacity-[0.62]"
      )}
    >
      <TimelineTaskRowContent
        task={task}
        group={group}
        compact={compact}
        onToggleComplete={onToggleComplete}
        onUpdateDuration={onUpdateDuration}
      />
    </div>
  );
}

type TimelineScheduledBlockProps = {
  block: TimelineBlock;
  groups: TaskGroupWithTasks[];
  viewDate: string;
  drawerMode?: boolean;
  selected?: boolean;
  overlapping?: boolean;
  isDragging?: boolean;
  onSelect: () => void;
  onOpenDetail: () => void;
  onToggleComplete: () => void;
  onUpdateDuration?: (minutes: number | null) => void;
  onContextMenu: (event: MouseEvent) => void;
  onDragStart: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onTimelineDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onTimelineDrop: (event: DragEvent<HTMLDivElement>) => void;
};

function TimelineScheduledBlock({
  block,
  groups,
  viewDate,
  drawerMode = false,
  selected,
  overlapping,
  isDragging,
  onSelect,
  onOpenDetail,
  onToggleComplete,
  onUpdateDuration,
  onContextMenu,
  onDragStart,
  onDragEnd,
  onTimelineDragOver,
  onTimelineDrop,
}: TimelineScheduledBlockProps) {
  const isHabit = block.kind === "habit";
  const title = isHabit ? block.habit!.name : block.task!.title;
  const completed = isHabit
    ? isHabitDoneOnDate(block.habit!, viewDate)
    : block.task!.completed;
  const durationLabel = isHabit
    ? formatDurationLabel(getHabitDurationMinutes(block.id))
    : null;
  const { topPx, heightPx } = block;
  const compact = heightPx < 48;
  const useCleanLayout = drawerMode && !isHabit;
  const group = block.task ? resolveTimelineTaskGroup(block.task, groups) : null;
  const groupAppearance = group ? getTaskGroupAppearance(group) : null;
  const groupAccentClass =
    useCleanLayout && groupAppearance
      ? TASK_GROUP_ACCENT_BORDER_CLASS[groupAppearance.colorKey]
      : null;

  return (
    <div
      data-timeline-entry={block.id}
      data-timeline-kind={block.kind}
      draggable={!completed}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onTimelineDragOver}
      onDrop={onTimelineDrop}
      onContextMenu={onContextMenu}
      onClick={onSelect}
      onDoubleClick={(event) => {
        if (!isHabit) {
          event.preventDefault();
          onOpenDetail();
        }
      }}
      className={cn(
        "group absolute inset-x-1 z-10 flex cursor-grab overflow-hidden rounded-lg border transition-[border-color,box-shadow,background-color] active:cursor-grabbing",
        TIMELINE_TASK_ELEVATION,
        groupAccentClass && "border-l-[3px]",
        groupAccentClass,
        useCleanLayout
          ? "border-border/55 bg-background/98 backdrop-blur-[1px]"
          : "border-border/55 bg-background/95",
        useCleanLayout
          ? compact
            ? "items-center px-2.5 py-1.5"
            : "items-start px-2.5 pt-1.5 pb-1"
          : compact
            ? "items-center gap-1.5 px-1.5 py-0.5"
            : "flex-col gap-0.5 px-2 py-1",
        isHabit && "border-orange-300/50 bg-orange-50/40",
        selected && TIMELINE_TASK_SELECTED,
        overlapping && "border-amber-400/60 bg-amber-50/35",
        isDragging && "opacity-40",
        completed &&
          "opacity-[0.45] transition-opacity hover:opacity-[0.62]"
      )}
      style={{ top: topPx, height: heightPx }}
    >
      {useCleanLayout ? (
        <div
          className={cn(
            "flex w-full min-w-0",
            compact ? "items-center" : "items-start"
          )}
        >
          <TimelineTaskRowContent
            task={block.task!}
            group={group}
            compact={compact}
            emphasizeTitle
            onToggleComplete={onToggleComplete}
            onUpdateDuration={onUpdateDuration!}
          />
        </div>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggleComplete();
            }}
            className={cn(
              "flex size-3.5 shrink-0 items-center justify-center border",
              isHabit ? "rounded-sm" : "rounded-full",
              completed
                ? isHabit
                  ? "border-orange-600 bg-orange-600 text-white"
                  : "border-foreground bg-foreground text-background"
                : isHabit
                  ? "border-orange-400/60"
                  : "border-muted-foreground/40"
            )}
            aria-label={`Mark "${title}" complete`}
          >
            {completed && <Check className="size-2" strokeWidth={3} />}
          </button>

          {isHabit ? (
            <span className="size-2 shrink-0 rounded-full bg-orange-500" />
          ) : (
            <TaskPriorityFlagIcon
              priority={normalizeTaskPriority(block.task!.priority)}
              className="size-3 shrink-0"
            />
          )}

          <span
            className={cn(
              "min-w-0 flex-1 truncate text-[11px] font-[520] leading-tight",
              completed && "line-through"
            )}
          >
            {title}
          </span>

          {!isHabit && onUpdateDuration && (
            <TaskDurationPicker
              compact={compact}
              durationMinutes={block.task!.duration_minutes}
              onChange={onUpdateDuration}
            />
          )}

          {isHabit && durationLabel && (
            <span className="shrink-0 text-[10px] text-muted-foreground">
              {durationLabel}
            </span>
          )}

          <GripVertical className="size-3 shrink-0 text-muted-foreground/40 opacity-0 group-hover:opacity-100" />
        </div>
      )}

      {overlapping && !compact && (
        <p className="text-[9px] text-amber-700">Overlaps another item</p>
      )}
    </div>
  );
}

type TimelineHabitChipProps = {
  habit: Habit;
  viewDate: string;
  selected?: boolean;
  compact?: boolean;
  isDragging?: boolean;
  onSelect: () => void;
  onToggleComplete: () => void;
  onContextMenu: (event: MouseEvent) => void;
  onDragStart: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
};

function TimelineHabitChip({
  habit,
  viewDate,
  selected,
  compact,
  isDragging,
  onSelect,
  onToggleComplete,
  onContextMenu,
  onDragStart,
  onDragEnd,
}: TimelineHabitChipProps) {
  const completed = isHabitDoneOnDate(habit, viewDate);
  const durationLabel = formatDurationLabel(getHabitDurationMinutes(habit.id));

  return (
    <div
      data-timeline-entry={habit.id}
      data-timeline-kind="habit"
      draggable={!completed}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onContextMenu={onContextMenu}
      onClick={onSelect}
      className={cn(
        "group flex w-full cursor-grab items-center gap-1.5 rounded-lg border border-orange-300/45 bg-orange-50/25 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)] active:cursor-grabbing",
        compact ? "px-2 py-1 text-[11px]" : "px-1.5 py-1 text-xs",
        selected && TIMELINE_TASK_SELECTED,
        isDragging && "opacity-40",
        completed &&
          "opacity-[0.45] transition-opacity hover:opacity-[0.62]"
      )}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onToggleComplete();
        }}
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors",
          completed
            ? "border-orange-600 bg-orange-600 text-white"
            : "border-orange-400/60 hover:border-orange-500"
        )}
        aria-label={`Mark "${habit.name}" complete`}
      >
        {completed && <Check className="size-2.5" strokeWidth={3} />}
      </button>

      <span className="size-2 shrink-0 rounded-full bg-orange-500" />

      <span
        className={cn(
          "min-w-0 flex-1 truncate font-[520] leading-tight",
          completed && "line-through"
        )}
      >
        {habit.name}
      </span>

      {durationLabel && (
        <span className="shrink-0 text-[10px] text-muted-foreground">
          {durationLabel}
        </span>
      )}

      <GripVertical className="size-3 shrink-0 text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}

function TimelineContextSubmenuRow({
  label,
  icon: Icon,
  open,
  onOpenChange,
  submenuClassName,
  children,
  className,
}: {
  label: string;
  icon: LucideIcon;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submenuClassName?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => onOpenChange(true)}
    >
      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted"
      >
        <Icon className="size-3.5 shrink-0" />
        {label}
        <span className="ml-auto text-muted-foreground">›</span>
      </button>
      {open ? (
        <div className="absolute top-0 left-full z-50 -ml-2 pl-2">
          <div
            className={cn(
              "rounded-lg border border-border/60 bg-popover p-1 shadow-lg",
              submenuClassName ?? "min-w-[7rem]"
            )}
            onMouseDown={(event) => event.stopPropagation()}
          >
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PlanningStateMenuIcon({ state }: { state: (typeof PLANNING_STATES)[number] }) {
  if (state === "later") {
    return <CalendarClock className="size-3.5 shrink-0 text-muted-foreground" />;
  }
  return <Circle className="size-3.5 shrink-0 text-muted-foreground" />;
}

function TimelineHabitContextMenu({
  x,
  y,
  onClose,
  onClearTime,
  onDelete,
}: {
  habit: Habit;
  x: number;
  y: number;
  onClose: () => void;
  onClearTime?: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="fixed z-50 min-w-[10rem] rounded-lg border border-border/50 bg-popover p-1 shadow-md"
      style={{ left: x, top: y }}
      onMouseDown={(event) => event.stopPropagation()}
    >
      {onClearTime ? (
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted"
          onClick={onClearTime}
        >
          <Clock className="size-3.5 shrink-0 text-muted-foreground" />
          Unschedule
        </button>
      ) : null}
      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-destructive hover:bg-muted"
        onClick={onDelete}
      >
        <Trash2 className="size-3.5 shrink-0" />
        Delete
      </button>
      <button
        type="button"
        className="sr-only"
        onClick={onClose}
        aria-label="Close menu"
      />
    </div>
  );
}

function TimelineContextMenu({
  task,
  x,
  y,
  onClose,
  onOpenDetail,
  onClearTime,
  onRemoveDate,
  onSetPlanningState,
  onDuplicate,
  onDelete,
}: {
  task: Task;
  x: number;
  y: number;
  onClose: () => void;
  onOpenDetail: () => void;
  onClearTime?: () => void;
  onRemoveDate?: () => void;
  onSetPlanningState?: (planningState: PlanningState) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const planningState = normalizePlanningState(task.planning_state);
  const [planningSubmenuOpen, setPlanningSubmenuOpen] = useState(false);
  const submenuCloseTimeoutRef = useRef<number | null>(null);

  const cancelSubmenuClose = useCallback(() => {
    if (submenuCloseTimeoutRef.current !== null) {
      window.clearTimeout(submenuCloseTimeoutRef.current);
      submenuCloseTimeoutRef.current = null;
    }
  }, []);

  const scheduleSubmenuClose = useCallback(() => {
    cancelSubmenuClose();
    submenuCloseTimeoutRef.current = window.setTimeout(() => {
      setPlanningSubmenuOpen(false);
    }, 250);
  }, [cancelSubmenuClose]);

  useEffect(() => {
    return () => cancelSubmenuClose();
  }, [cancelSubmenuClose]);

  return (
    <div
      className="fixed z-[100] min-w-[10.5rem] overflow-visible rounded-lg border border-border/60 bg-popover p-1 text-popover-foreground shadow-lg"
      style={{ left: x, top: y }}
      onMouseDown={(event) => event.stopPropagation()}
      onMouseEnter={cancelSubmenuClose}
      onMouseLeave={scheduleSubmenuClose}
    >
      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted"
        onClick={onOpenDetail}
      >
        <ClipboardList className="size-3.5 shrink-0" />
        Open details
      </button>
      {onClearTime ? (
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted"
          onClick={onClearTime}
        >
          <Clock className="size-3.5 shrink-0 text-muted-foreground" />
          Unschedule
        </button>
      ) : null}
      {onRemoveDate ? (
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted"
          onClick={onRemoveDate}
        >
          <CalendarDays className="size-3.5 shrink-0 text-muted-foreground" />
          Remove date
        </button>
      ) : null}
      {onSetPlanningState ? (
        <div className="border-t border-border/40 pt-1">
          <TimelineContextSubmenuRow
            label="Planning"
            icon={CalendarClock}
            open={planningSubmenuOpen}
            onOpenChange={setPlanningSubmenuOpen}
            submenuClassName="min-w-[7.5rem]"
          >
            {PLANNING_STATES.map((state) => (
              <button
                key={state}
                type="button"
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted",
                  planningState === state && "bg-muted font-medium text-foreground"
                )}
                onClick={() => onSetPlanningState(state)}
              >
                <PlanningStateMenuIcon state={state} />
                {PLANNING_STATE_CONFIG[state].label}
              </button>
            ))}
          </TimelineContextSubmenuRow>
        </div>
      ) : null}
      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted"
        onClick={onDuplicate}
      >
        <Copy className="size-3.5 shrink-0" />
        Duplicate
      </button>
      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-destructive hover:bg-muted"
        onClick={onDelete}
      >
        <Trash2 className="size-3.5 shrink-0" />
        Delete
      </button>
      <button
        type="button"
        className="sr-only"
        onClick={onClose}
        aria-label="Close menu"
      />
    </div>
  );
}

