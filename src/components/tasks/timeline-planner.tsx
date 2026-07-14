"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
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
  Eye,
  EyeOff,
  GripVertical,
  ListPlus,
  PanelRightClose,
  Play,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react";
import { CalendarPanel, CALENDAR_PANEL_WIDTH_CLASS } from "@/components/ui/calendar-panel";
import { BackToTodayLink } from "@/components/shared/back-to-today-link";
import { QuickScheduleResizeHandle } from "@/components/tasks/quick-schedule-resize-handle";
import { WorkplaceTimelineTaskMenu } from "@/components/workplace/workplace-timeline-task-menu";
import {
  getEffectiveHabitScheduledTime,
  useHabitDailyScheduleStore,
} from "@/lib/habit-daily-schedule-store";
import {
  readModuleVisibility,
  writeModuleVisibility,
  type WorkplaceModuleVisibility,
} from "@/lib/workplace-module-visibility";
import { workplaceTimelineEdgeClassName } from "@/lib/workplace-panel-appearance";
import { TaskDurationPicker } from "@/components/tasks/task-duration-picker";
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
import { setDragImageFromElement } from "@/lib/list-drag-utils";
import {
  panelToggleHoverIconClass,
  panelTogglePrimaryIconClass,
  panelToggleSquareClass,
} from "@/lib/panel-toggle-styles";
import {
  clampQuickScheduleTaskListWidth,
  getQuickScheduleTaskListEffectiveMax,
  getQuickScheduleTaskListWidth,
  QUICK_SCHEDULE_TASK_LIST_WIDTH_DEFAULT,
  QUICK_SCHEDULE_TASK_LIST_WIDTH_MIN,
  setQuickScheduleTaskListWidth,
} from "@/lib/quick-schedule-task-list-width";
import { formatTodayColumnTitle, isInboxGroup, isTodayGroup, taskBelongsInLaterView } from "@/lib/task-groups";
import { getTaskGroupAppearance, TASK_GROUP_ACCENT_BORDER_CLASS } from "@/lib/task-group-appearance";
import { normalizeTaskPriority } from "@/lib/task-priority";
import { appendTaskToNextUp, isEligibleForNextUp } from "@/lib/task-next-up";
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
  findOverlapBannerEntryIds,
  buildTimelineOverlapStacks,
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
  WORKPLACE_TIMELINE_ZOOM_OPTIONS,
  DEFAULT_TIMELINE_ZOOM,
  topPxToMinutes,
  type TimelineBlock,
  type TimelineEntryKind,
  type TimelineZoom,
} from "@/lib/timeline-layout";
import { formatDurationLabel } from "@/lib/schedule-layout";
import { SCHEDULE_BLOCK_CURRENT_CLASS } from "@/lib/schedule-palette";
import { formatHabitTimeRangeWithDuration } from "@/lib/habit-duration";
import {
  timelineHabitBlockClassNames,
} from "@/lib/timeline-habit-appearance";
import { TimelineHabitLabel } from "@/components/tasks/timeline-habit-label";
import { QUICK_SCHEDULE_HELP } from "@/lib/schedule-help";
import {
  timelineGridGutterClass,
  TIMELINE_TIME_COLUMN_CLASS,
} from "@/lib/workspace-layout";
import {
  getActiveTaskDragId,
  markTimelineDropConsumed,
  setActiveTaskDragId,
  setActiveTimelineDrag,
  TIMELINE_DRAG_ID_MIME,
  TIMELINE_DRAG_KIND_MIME,
  TIMELINE_SCHEDULER_ATTR,
  QUICK_SCHEDULE_INBOX_ATTR,
  QUICK_SCHEDULE_INBOX_TAB_ATTR,
  QUICK_SCHEDULE_TIMELINE_BODY_ATTR,
  isPointerOverQuickScheduleInbox,
  isPointerOverQuickScheduleTimelineBody,
  resolveQuickScheduleInboxDropZoneAtPoint,
  resolveQuickScheduleInboxDropZoneFromTarget,
  type QuickScheduleInboxDropZone,
} from "@/lib/timeline-drag";
import {
  closeTaskDetailMenus,
  isEventTargetInside,
  registerTimelineContextMenuCloser,
} from "@/lib/task-detail-menu-coordinator";
import { cn } from "@/lib/utils";
import type { Habit } from "@/types/habit";
import {
  normalizePlanningState,
  PLANNING_STATE_CONFIG,
  PLANNING_STATES,
  PLAN_SECTION_LABEL,
} from "@/lib/task-planning";
import type { PlanningState, Task, TaskGroupWithTasks } from "@/types/task";

export type TimelinePlannerVariant = "drawer" | "fullscreen" | "workplace";

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
  onStartFocusTask?: (taskId: string) => void;
  onStartFocusHabit?: (habitId: string) => void;
  habits?: Habit[];
  selectedHabitId?: string | null;
  onSelectHabit?: (habitId: string | null) => void;
  onScheduleHabit?: (
    habitId: string,
    updates: { scheduled_time: string | null },
    scheduleDate: string
  ) => Promise<void>;
  onToggleHabitComplete?: (habit: Habit) => Promise<void>;
};

type DragSource = "pool" | "unscheduled" | "timeline";
type DragItem = { kind: TimelineEntryKind; id: string };

const TIMELINE_EDGE_SCROLL_ZONE = 56;
const TIMELINE_EDGE_SCROLL_SPEED = 14;
const TIMELINE_TASK_ELEVATION = "shadow-none";
const TIMELINE_TASK_SELECTED = SCHEDULE_BLOCK_CURRENT_CLASS;
const TIMELINE_DROP_PREVIEW =
  "rounded-lg border border-dashed border-primary/50 bg-primary-medium";
const QUICK_SCHEDULE_INBOX_DROP_HIGHLIGHT =
  "ring-2 ring-primary/30 bg-primary-subtle";
const QUICK_SCHEDULE_INBOX_TAB_DROP_HIGHLIGHT =
  "bg-primary-soft text-foreground ring-1 ring-primary/35";
const TIMELINE_EVENT_SURFACE =
  "border-border-subtle/60 bg-surface-raised hover:bg-surface-hover";
/** Overlap cue only — never replace group accent or selection fill. */
const TIMELINE_EVENT_OVERLAP = "ring-1 ring-inset ring-warning/40";
/** Flat pool rows — hover only; no permanent card fill. */
const TIMELINE_POOL_ROW_SURFACE =
  "border-transparent bg-transparent hover:bg-surface-hover";
const TIMELINE_DURATION_CHIP_ACTIVE =
  "bg-primary-soft text-foreground shadow-none";
const TIMELINE_DURATION_CHIP_IDLE =
  "bg-transparent text-muted-foreground hover:bg-surface-hover hover:text-foreground";
const TIMELINE_POOL_TAB_ACTIVE =
  "bg-primary-soft text-foreground shadow-none";
const TIMELINE_POOL_TAB_IDLE =
  "text-muted-foreground hover:bg-surface-hover hover:text-foreground";

function QuickScheduleInfoMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex shrink-0 items-center justify-center rounded-sm px-0.5 text-[11px] leading-none text-muted-foreground hover:bg-surface-hover hover:text-foreground"
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
  onStartFocusTask,
  onStartFocusHabit,
  habits = [],
  selectedHabitId = null,
  onSelectHabit,
  onScheduleHabit,
  onToggleHabitComplete,
}: TimelinePlannerProps) {
  const isFullscreen = variant === "fullscreen";
  const isDrawer = variant === "drawer";
  const isWorkplace = variant === "workplace";
  const habitScheduleRevision = useHabitDailyScheduleStore();
  const [timelineVisibility, setTimelineVisibility] =
    useState<WorkplaceModuleVisibility>("always");
  const [timelineHovered, setTimelineHovered] = useState(false);
  const useCompactChrome = isDrawer || isWorkplace;
  const useDrawerTimeline = isDrawer || isWorkplace;
  const showTaskPool = isFullscreen;
  const showHabitTimeline =
    habits.length > 0 && Boolean(onScheduleHabit);
  const showHabitPool = showHabitTimeline && (isFullscreen || isDrawer);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timelineBodyRef = useRef<HTMLDivElement>(null);
  const dropPreviewMinutesRef = useRef<number | null>(null);
  const draggingItemRef = useRef<DragItem | null>(null);
  const pointerYRef = useRef(0);
  const timelineAutoScrollRafRef = useRef<number | null>(null);
  const scheduledSlotsRef = useRef<ReturnType<typeof buildScheduledSlots>>([]);
  const zoomRef = useRef<TimelineZoom>(DEFAULT_TIMELINE_ZOOM);
  const taskByIdRef = useRef<Map<string, Task>>(new Map());
  const unscheduledSectionRef = useRef<HTMLElement>(null);
  const focusHandledRef = useRef<string | null>(null);
  const [zoom, setZoom] = useState<TimelineZoom>(DEFAULT_TIMELINE_ZOOM);
  const [nowTick, setNowTick] = useState(0);
  const [poolCollapsed, setPoolCollapsed] = useState<Set<string>>(new Set());
  const [habitsPoolCollapsed, setHabitsPoolCollapsed] = useState(false);
  const [dayPickerOpen, setDayPickerOpen] = useState(false);
  const [draggingItem, setDraggingItem] = useState<DragItem | null>(null);
  const [dropPreviewMinutes, setDropPreviewMinutes] = useState<number | null>(
    null
  );
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<
    | { kind: "task"; task: Task; x: number; y: number; anchorRect?: DOMRect }
    | { kind: "habit"; habit: Habit; x: number; y: number; anchorRect?: DOMRect }
    | null
  >(null);
  const openTimelineContextMenu = useCallback(
    (
      menu:
        | { kind: "task"; task: Task; x: number; y: number; anchorRect?: DOMRect }
        | { kind: "habit"; habit: Habit; x: number; y: number; anchorRect?: DOMRect }
    ) => {
      closeTaskDetailMenus();
      setContextMenu(menu);
    },
    []
  );
  const [inboxTab, setInboxTab] = useState<InboxTab>("unscheduled");
  const [inboxDropTarget, setInboxDropTarget] =
    useState<QuickScheduleInboxDropZone | null>(null);
  const inboxTabRef = useRef<InboxTab>("unscheduled");
  const inboxDropTargetRef = useRef<QuickScheduleInboxDropZone | null>(null);
  const viewDateRef = useRef(viewDate);
  const onScheduleTaskRef = useRef(onScheduleTask);
  const onSetPlanningStateRef = useRef(onSetPlanningState);
  const onScheduleHabitRef = useRef(onScheduleHabit);
  const [taskListWidth, setTaskListWidth] = useState(
    QUICK_SCHEDULE_TASK_LIST_WIDTH_DEFAULT
  );
  useEffect(() => {
    inboxTabRef.current = inboxTab;
  }, [inboxTab]);

  useEffect(() => {
    inboxDropTargetRef.current = inboxDropTarget;
  }, [inboxDropTarget]);

  useEffect(() => {
    viewDateRef.current = viewDate;
  }, [viewDate]);

  useEffect(() => {
    onScheduleTaskRef.current = onScheduleTask;
    onSetPlanningStateRef.current = onSetPlanningState;
    onScheduleHabitRef.current = onScheduleHabit;
  }, [onScheduleTask, onSetPlanningState, onScheduleHabit]);

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
  const hourGridBorderClass = useDrawerTimeline
    ? "border-border/70"
    : "border-border/45";

  const dayTasks = useMemo(
    () => collectTasksForViewDate(groups, viewDate),
    [groups, viewDate]
  );

  const dayHabits = useMemo(() => {
    if (!showHabitTimeline) return [];
    return filterHabitsForViewDate(habits, viewDate).map((habit) => ({
      ...habit,
      scheduled_time: getEffectiveHabitScheduledTime(
        habit.id,
        habit.scheduled_time,
        viewDate
      ),
    }));
  }, [showHabitTimeline, habits, viewDate, habitScheduleRevision]);

  useEffect(() => {
    if (!isWorkplace) return;
    setTimelineVisibility(readModuleVisibility("timeline"));
  }, [isWorkplace]);

  const timelineRevealActive =
    !isWorkplace || timelineVisibility === "always" || timelineHovered;

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

  const overlapBannerIds = useMemo(
    () => findOverlapBannerEntryIds(timelineBlocks),
    [timelineBlocks]
  );

  const overlapStacks = useMemo(
    () => buildTimelineOverlapStacks(timelineBlocks),
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
    return registerTimelineContextMenuCloser(() => setContextMenu(null));
  }, []);

  useEffect(() => {
    if (!contextMenu) return;

    function isContextMenuTarget(target: EventTarget | null): boolean {
      return isEventTargetInside(target, [
        "[data-timeline-context-menu]",
        "[data-timeline-context-submenu]",
      ]);
    }

    function close(event: globalThis.MouseEvent) {
      if (isContextMenuTarget(event.target)) return;
      setContextMenu(null);
    }

    function closeOnScroll() {
      setContextMenu(null);
    }

    document.addEventListener("click", close);
    window.addEventListener("scroll", closeOnScroll, true);
    return () => {
      document.removeEventListener("click", close);
      window.removeEventListener("scroll", closeOnScroll, true);
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
      rawMinutes - duration / 2,
      scheduledSlotsRef.current,
      dragItem?.id ?? null,
      duration
    );
  }

  function updateTimelineDropPreview(clientY: number, event?: DragEvent) {
    if (!isTimelineDragActive(event)) return;

    const dragItem = readActiveDragItem(event);
    const minutes = resolveDropMinutesAt(clientY, dragItem);
    if (dropPreviewMinutesRef.current === minutes) return;
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
      const reactDragEvent = event as unknown as DragEvent;
      if (!isTimelineDragActive(reactDragEvent)) {
        stopTimelineAutoScroll();
        setInboxDropTarget(null);
        return;
      }

      pointerYRef.current = event.clientY;

      if (isPointerOverQuickScheduleTimelineBody(event.clientX, event.clientY)) {
        setInboxDropTarget(null);
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

        if (event.clientY >= rect.top && event.clientY <= rect.bottom) {
          event.preventDefault();
          if (event.dataTransfer) {
            event.dataTransfer.dropEffect = "move";
          }
          updateTimelineDropPreview(event.clientY, reactDragEvent);
        }
        return;
      }

      stopTimelineAutoScroll();
      setDropPreviewMinutes(null);
      dropPreviewMinutesRef.current = null;

      const fallback =
        inboxTabRef.current === "later" ? "later" : "unscheduled";
      const inboxZone = resolveQuickScheduleInboxDropZoneFromTarget(
        event.target,
        fallback
      );

      if (inboxZone && isPointerOverQuickScheduleInbox(event.clientX, event.clientY)) {
        event.preventDefault();
        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = "move";
        }
        setInboxDropTarget(inboxZone);
        setInboxTab(inboxZone);
      } else {
        setInboxDropTarget(null);
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
    setActiveTimelineDrag({ kind, id });
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
    setActiveTimelineDrag(null);
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
      await onScheduleHabitRef.current?.(dragItem.id, { scheduled_time: time }, viewDateRef.current);
      return;
    }
    await onScheduleTaskRef.current(dragItem.id, {
      scheduled_date: viewDateRef.current,
      scheduled_time: time,
    });
  }

  async function applyInboxDrop(
    dragItem: DragItem,
    zone: QuickScheduleInboxDropZone
  ) {
    if (dragItem.kind === "habit") {
      await onScheduleHabitRef.current?.(dragItem.id, { scheduled_time: null }, viewDateRef.current);
      setInboxTab("unscheduled");
      return;
    }

    if (zone === "later" && onSetPlanningStateRef.current) {
      await onSetPlanningStateRef.current(dragItem.id, "later");
      return;
    }

    await onScheduleTaskRef.current(dragItem.id, {
      scheduled_date: viewDateRef.current,
      scheduled_time: null,
    });

    const task = taskByIdRef.current.get(dragItem.id);
    if (task && taskBelongsInLaterView(task) && onSetPlanningStateRef.current) {
      await onSetPlanningStateRef.current(dragItem.id, "none");
    }
  }

  const clearInboxDropHighlight = useCallback(() => {
    setInboxDropTarget(null);
  }, []);

  const syncInboxDropHighlight = useCallback(
    (
      clientX: number,
      clientY: number,
      target?: EventTarget | null
    ): QuickScheduleInboxDropZone | null => {
      const fallback =
        inboxTabRef.current === "later" ? "later" : "unscheduled";
      const zone =
        target !== undefined
          ? resolveQuickScheduleInboxDropZoneFromTarget(target, fallback)
          : resolveQuickScheduleInboxDropZoneAtPoint(clientX, clientY, fallback);

      if (!zone) {
        setInboxDropTarget(null);
        return null;
      }

      setInboxDropTarget(zone);
      setInboxTab(zone);
      return zone;
    },
    []
  );

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
    clearInboxDropHighlight();
    await scheduleAtMinutes(dragItem, minutes);
    endDrag();
  }

  async function handleInboxDrop(
    event: DragEvent,
    zone?: QuickScheduleInboxDropZone
  ) {
    event.preventDefault();
    const dragItem = readDragItem(event);
    if (!dragItem) return;

    const dropZone =
      zone ??
      inboxDropTargetRef.current ??
      (inboxTabRef.current === "later" ? "later" : "unscheduled");

    await applyInboxDrop(dragItem, dropZone);
    markTimelineDropConsumed();
    clearInboxDropHighlight();
    endDrag();
  }

  async function handleUnscheduleDrop(event: DragEvent) {
    await handleInboxDrop(event);
  }

  function handleTaskPoolDragOver(event: DragEvent) {
    if (!isTimelineDragActive(event)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "none";
  }

  function handleInboxDragOver(event: DragEvent) {
    if (!isTimelineDragActive(event)) return;
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
    stopTimelineAutoScroll();
    setDropPreviewMinutes(null);
    dropPreviewMinutesRef.current = null;
    syncInboxDropHighlight(event.clientX, event.clientY, event.target);
  }

  function handleInboxDragLeave(event: DragEvent) {
    const related = event.relatedTarget;
    if (
      related instanceof Node &&
      unscheduledSectionRef.current?.contains(related)
    ) {
      return;
    }
    clearInboxDropHighlight();
  }

  useEffect(() => {
    const syncBoardPointerDrag = (clientX: number, clientY: number) => {
      const activeTaskId = getActiveTaskDragId();
      if (!activeTaskId || draggingItemRef.current) return;

      pointerYRef.current = clientY;

      if (isPointerOverQuickScheduleTimelineBody(clientX, clientY)) {
        clearInboxDropHighlight();
        updateTimelineDropPreview(clientY);
        startTimelineAutoScroll();
        return;
      }

      stopTimelineAutoScroll();
      setDropPreviewMinutes(null);
      dropPreviewMinutesRef.current = null;

      const fallback =
        inboxTabRef.current === "later" ? "later" : "unscheduled";
      const inboxZone = resolveQuickScheduleInboxDropZoneAtPoint(
        clientX,
        clientY,
        fallback
      );

      if (inboxZone) {
        setInboxDropTarget(inboxZone);
        setInboxTab(inboxZone);
        return;
      }

      clearInboxDropHighlight();
    };

    const commitBoardPointerDrop = async (clientX: number, clientY: number) => {
      const activeTaskId = getActiveTaskDragId();
      if (!activeTaskId || draggingItemRef.current) return false;

      const dragItem = { kind: "task" as const, id: activeTaskId };

      if (isPointerOverQuickScheduleTimelineBody(clientX, clientY)) {
        const minutes =
          dropPreviewMinutesRef.current ??
          resolveDropMinutesAt(clientY, dragItem);
        if (minutes === null) return false;

        markTimelineDropConsumed();
        clearInboxDropHighlight();
        await scheduleAtMinutes(dragItem, minutes);
        return true;
      }

      const fallback =
        inboxTabRef.current === "later" ? "later" : "unscheduled";
      const inboxZone =
        inboxDropTargetRef.current ??
        resolveQuickScheduleInboxDropZoneAtPoint(clientX, clientY, fallback);

      if (!inboxZone) return false;

      markTimelineDropConsumed();
      await applyInboxDrop(dragItem, inboxZone);
      clearInboxDropHighlight();
      return true;
    };

    const onPointerMove = (event: globalThis.PointerEvent) => {
      syncBoardPointerDrag(event.clientX, event.clientY);
    };

    const onPointerEnd = (event: globalThis.PointerEvent) => {
      void commitBoardPointerDrop(event.clientX, event.clientY);
    };

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerEnd, true);
    document.addEventListener("pointercancel", onPointerEnd, true);

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerEnd, true);
      document.removeEventListener("pointercancel", onPointerEnd, true);
    };
  }, [clearInboxDropHighlight]);

  function handleTimelineDragOver(event: DragEvent) {
    if (!isTimelineDragActive(event)) return;
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
    pointerYRef.current = event.clientY;
    clearInboxDropHighlight();
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

  const zoomOptions = isFullscreen
    ? TIMELINE_ZOOM_OPTIONS
    : WORKPLACE_TIMELINE_ZOOM_OPTIONS;

  const zoomControl = (
    <div
      className={cn(
        "flex shrink-0 rounded-md border border-border-subtle bg-surface-base p-0.5",
        useDrawerTimeline
          ? "h-7 items-center rounded-full"
          : null
      )}
    >
      {zoomOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setZoom(option.value)}
          className={cn(
            "rounded font-medium transition-colors",
            useDrawerTimeline
              ? "px-2 py-0.5 text-xs"
              : isWorkplace
                ? "rounded-md px-2 py-0.5 text-[12px]"
                : "rounded-md px-2 py-0.5 text-[11px]",
            zoom === option.value
              ? TIMELINE_DURATION_CHIP_ACTIVE
              : TIMELINE_DURATION_CHIP_IDLE
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
            "inline-flex items-center rounded-md font-medium outline-none hover:bg-surface-hover/60",
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
        <DropdownMenuContent side="bottom" align="center" className={cn(CALENDAR_PANEL_WIDTH_CLASS, "p-0")}>
          {drawerQuickDates.map((item) => (
            <DropdownMenuItem
              key={item.key}
              onClick={() => {
                onViewDateChange(item.key);
                setDayPickerOpen(false);
              }}
              className={cn(
                "mx-2 mt-1 text-xs first:mt-0",
                viewDate === item.key && "bg-muted font-medium"
              )}
            >
              {item.label}
            </DropdownMenuItem>
          ))}
          <div className="mt-1 border-t border-border/50">
            <CalendarPanel
              value={viewDate}
              onChange={(dateKey) => {
                onViewDateChange(dateKey);
                setDayPickerOpen(false);
              }}
            />
          </div>
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
        "shrink-0 rounded-md border-border-subtle bg-surface-base font-normal text-muted-foreground/85 shadow-none hover:border-primary/35 hover:bg-surface-hover hover:text-foreground",
        useDrawerTimeline
          ? "h-5 px-1.5 text-[10px]"
          : isWorkplace
            ? "h-6 px-2 text-[13px]"
            : "h-6 px-2 text-[12px]"
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
        "relative min-h-0 flex-1",
        isWorkplace
          ? "workplace-timeline-scroll overflow-y-auto bg-surface-base pr-0 pt-8 transition-opacity duration-200"
          : "overflow-y-auto bg-surface-base",
        isWorkplace &&
          (timelineRevealActive
            ? "opacity-100"
            : "opacity-0 pointer-events-none"),
        !useDrawerTimeline && !isWorkplace && !isFullscreen && "border-t border-border/40"
      )}
      onDragOver={handleTimelineDragOver}
      onDrop={(event) => void handleTimelineDrop(event)}
      onDragLeave={handleTimelineDragLeave}
    >
      <div
        ref={timelineBodyRef}
        {...{ [QUICK_SCHEDULE_TIMELINE_BODY_ATTR]: "" }}
        className="relative"
        style={{ height: timelineHeightPx }}
      >
        <div
          className={cn(
            "absolute inset-0 flex",
            timelineGridGutterClass(useDrawerTimeline, {
              flushRight: isWorkplace,
            })
          )}
        >
          <div
            className={cn(
              "relative shrink-0 border-r",
              TIMELINE_TIME_COLUMN_CLASS,
              useDrawerTimeline
                ? "border-border/30 bg-muted/10"
                : "border-border/20"
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
                    className="absolute right-0 left-0 top-0 z-10 h-0.5 bg-ring/85"
                    aria-hidden
                  />
                ) : null}
                <div className={cn("h-full", TIMELINE_DROP_PREVIEW)} />
              </div>
            )}

            {nowLineTopPx !== null && (
              <div
                className={cn(
                  "pointer-events-none absolute z-30 flex items-center gap-1.5",
                  isWorkplace ? "left-1 right-0" : "inset-x-1.5"
                )}
                style={{ top: nowLineTopPx }}
              >
                <span className="size-[5px] shrink-0 rounded-full bg-primary shadow-[0_0_0_2.5px_color-mix(in_oklab,var(--primary)_22%,transparent)]" />
                <div className="h-px min-w-0 flex-1 bg-gradient-to-r from-primary/75 to-transparent" />
                <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium tabular-nums text-primary-foreground shadow-sm">
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
                rightInsetPx={isWorkplace ? 0 : 4}
                selected={
                  block.kind === "task"
                    ? selectedTaskId === block.id
                    : selectedHabitId === block.id
                }
                overlapping={overlappingIds.has(block.id)}
                showOverlapLabel={overlapBannerIds.has(block.id)}
                overlapStack={overlapStacks.get(block.id)}
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
                  const anchorRect = (
                    event.currentTarget as HTMLElement
                  ).getBoundingClientRect();
                  if (block.kind === "task" && block.task) {
                    openTimelineContextMenu({
                      kind: "task",
                      task: block.task,
                      x: event.clientX,
                      y: event.clientY,
                      anchorRect: isWorkplace ? anchorRect : undefined,
                    });
                  } else if (block.kind === "habit" && block.habit) {
                    openTimelineContextMenu({
                      kind: "habit",
                      habit: block.habit,
                      x: event.clientX,
                      y: event.clientY,
                      anchorRect: isWorkplace ? anchorRect : undefined,
                    });
                  }
                }}
                onDragStart={(event) =>
                  beginDrag(block.kind, block.id, event, "timeline")
                }
                onDragEnd={endDrag}
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
        "flex h-full min-h-0 flex-col",
        isFullscreen
          ? "w-full bg-surface-canvas"
          : isWorkplace
            ? cn(
                "group/timeline relative h-full w-full overflow-hidden bg-surface-canvas",
                workplaceTimelineEdgeClassName
              )
            : "h-full w-full border-l border-border-strong bg-surface-overlay animate-in slide-in-from-right-4 duration-200"
      )}
      onMouseEnter={isWorkplace ? () => setTimelineHovered(true) : undefined}
      onMouseLeave={isWorkplace ? () => setTimelineHovered(false) : undefined}
    >
      {!isWorkplace ? (
      <header
        className={cn(
          "relative shrink-0 border-b",
          isFullscreen
            ? "flex items-center gap-2 border-divider px-4 py-3"
            : cn("border-border-subtle px-2 py-1.5", isDrawer && "bg-surface-overlay")
        )}
      >
        {isDrawer ? (
          <div className="relative flex w-full items-center gap-1">
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
                  <Clock className={panelTogglePrimaryIconClass("sm")} />
                )}
              <h2 className="shrink-0 text-sm font-semibold leading-none tracking-tight text-foreground">
                Quick Schedule
              </h2>
              <QuickScheduleInfoMenu />
            </div>
            <div className="pointer-events-none absolute inset-x-0 flex justify-center">
              <div className="pointer-events-auto">{dayNavControl}</div>
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-1">
              {nowButton}
              {zoomControl}
            </div>
          </div>
        ) : (
          <div className="relative flex w-full items-center gap-2 px-1">
            <BackToTodayLink />
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Clock className={panelTogglePrimaryIconClass()} />
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold">Schedule</h2>
                <p className="truncate text-[11px] text-muted-foreground">
                  Drag tasks & habits to plan your day
                </p>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 flex justify-center">
              <div className="pointer-events-auto">{dayNavControl}</div>
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-1">
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
          </div>
        )}
      </header>
      ) : (
        <header
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 z-20 shrink-0 bg-gradient-to-b from-timeline via-timeline/95 to-transparent px-2 pt-1.5 pb-3 transition-opacity duration-200",
            timelineRevealActive
              ? "pointer-events-auto opacity-100"
              : "opacity-0"
          )}
        >
          <div className="flex w-full items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setTimelineVisibility((current) => {
                  const next = current === "always" ? "hover" : "always";
                  writeModuleVisibility("timeline", next);
                  return next;
                });
              }}
              className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground/55 transition-colors hover:bg-surface-hover/50 hover:text-muted-foreground"
              aria-label={
                timelineVisibility === "hover"
                  ? "Show on hover — click for always visible"
                  : "Always visible — click for show on hover"
              }
              title={
                timelineVisibility === "hover" ? "Show on hover" : "Always visible"
              }
            >
              {timelineVisibility === "hover" ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
            {nowButton}
            <div className="ml-auto flex shrink-0 items-center gap-1.5">
              {zoomControl}
            </div>
          </div>
        </header>
      )}

      <div className="flex min-h-0 flex-1">
        {isWorkplace ? (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">{timelinePanel}</div>
        ) : (
          <>
        <div
          className={cn(
            "flex min-h-0 flex-col",
            isDrawer
              ? cn(
                  "shrink-0 overflow-hidden border-r border-border-subtle/50 bg-surface-overlay"
                )
              : isFullscreen
                ? cn(
                    "min-w-0 flex-[2.5] border-r border-border-subtle bg-surface-base"
                  )
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
          {isFullscreen ? (
            <div className="shrink-0 border-b border-border-subtle px-3 py-2">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Plan pool
              </p>
              <p className="text-[10px] text-muted-foreground">
                Unscheduled &amp; Later
              </p>
            </div>
          ) : null}
          <section
            ref={unscheduledSectionRef}
            {...{ [QUICK_SCHEDULE_INBOX_ATTR]: "" }}
            className={cn(
              "relative transition-[box-shadow,background-color] duration-150",
              isDrawer ? "px-1.5" : isFullscreen ? "flex min-h-0 flex-1 flex-col px-1 py-2" : "px-0",
              isDrawer
                ? "flex min-h-0 flex-1 flex-col overflow-hidden py-1.5"
                : isFullscreen
                  ? "min-h-0 overflow-hidden"
                  : "shrink-0 border-b border-border/30 py-2",
              inboxDropTarget && QUICK_SCHEDULE_INBOX_DROP_HIGHLIGHT
            )}
            onDragOver={handleInboxDragOver}
            onDragLeave={handleInboxDragLeave}
            onDrop={(event) => void handleUnscheduleDrop(event)}
          >
            <div
              className={cn(
                "inline-flex max-w-full items-center gap-0.5 rounded-md border border-border-subtle bg-surface-base p-0.5",
                "mb-1"
              )}
            >
                <button
                  type="button"
                  {...{ [QUICK_SCHEDULE_INBOX_TAB_ATTR]: "unscheduled" }}
                  onClick={() => setInboxTab("unscheduled")}
                  className={cn(
                    "shrink-0 rounded px-1.5 py-0.5 font-medium whitespace-nowrap transition-colors",
                    compactTaskListTabs ? "text-[9px]" : "text-[10px]",
                    inboxTab === "unscheduled"
                      ? TIMELINE_POOL_TAB_ACTIVE
                      : TIMELINE_POOL_TAB_IDLE,
                    inboxDropTarget === "unscheduled" &&
                      QUICK_SCHEDULE_INBOX_TAB_DROP_HIGHLIGHT
                  )}
                >
                  {compactTaskListTabs
                    ? `Unsched. (${unscheduledTasks.length})`
                    : `Unscheduled (${unscheduledTasks.length})`}
                </button>
                <button
                  type="button"
                  {...{ [QUICK_SCHEDULE_INBOX_TAB_ATTR]: "later" }}
                  onClick={() => setInboxTab("later")}
                  className={cn(
                    "shrink-0 rounded px-1.5 py-0.5 font-medium whitespace-nowrap transition-colors",
                    compactTaskListTabs ? "text-[9px]" : "text-[10px]",
                    inboxTab === "later"
                      ? TIMELINE_POOL_TAB_ACTIVE
                      : TIMELINE_POOL_TAB_IDLE,
                    inboxDropTarget === "later" &&
                      QUICK_SCHEDULE_INBOX_TAB_DROP_HIGHLIGHT
                  )}
                >
                  Later ({laterTasks.length})
                </button>
            </div>
            <div
              className={cn(
                "relative flex gap-1.5",
                isDrawer || isFullscreen
                  ? "min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto"
                  : "min-h-[3rem] flex-wrap"
              )}
            >
              {timelineSchedulingDragActive && inboxDropTarget ? (
                <div
                  className={cn(
                    "pointer-events-none absolute inset-1 z-10 flex items-center justify-center rounded-lg border border-dashed border-primary/25 bg-primary/[0.03] px-2 py-2 text-[11px] text-foreground/80",
                    isDrawer ? "inset-0.5" : "inset-1"
                  )}
                >
                  {inboxDropTarget === "later"
                    ? "Drop to Later"
                    : "Drop to Unscheduled"}
                </div>
              ) : null}
              {inboxTab === "unscheduled" &&
              inboxTasks.length === 0 &&
              (!showHabitPool || unscheduledHabits.length === 0) ? (
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
                    Drag tasks here from the timeline or task pool.
                  </p>
                </div>
              ) : (
                <>
                  {inboxTasks.map((task) => (
                    <TimelinePoolChip
                      key={`task-${task.id}`}
                      task={task}
                      groups={groups}
                      fullWidth={isDrawer || isFullscreen}
                      compact={isDrawer || isFullscreen}
                      selected={selectedTaskId === task.id}
                      onSelect={() => {
                        onSelectTask(task.id);
                        onSelectHabit?.(null);
                      }}
                      onOpenDetail={() => onOpenDetail(task.id)}
                      onToggleComplete={() => void onToggleComplete(task)}
                      onContextMenu={(event) => {
                        event.preventDefault();
                        openTimelineContextMenu({
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
                    showHabitPool &&
                    unscheduledHabits.map((habit) => (
                    <TimelineHabitChip
                      key={`habit-${habit.id}`}
                      habit={habit}
                      viewDate={viewDate}
                      compact={isDrawer || isFullscreen}
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
                        openTimelineContextMenu({
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
        </div>
        {isFullscreen ? (
          <div className="flex min-h-0 min-w-0 flex-[5] flex-col">
            {timelinePanel}
          </div>
        ) : null}
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
          <aside
            className="flex min-w-0 flex-[3] flex-col border-l border-border-subtle bg-surface-base"
            onDragOver={handleTaskPoolDragOver}
          >
            <div className="shrink-0 border-b border-border-subtle px-3 py-2">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Task pool
              </p>
              <p className="text-[10px] text-muted-foreground">
                Drag onto the timeline
              </p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
              {showHabitPool && (
                <div className="mb-3">
                  <button
                    type="button"
                    onClick={() => setHabitsPoolCollapsed((value) => !value)}
                    className="flex w-full items-center gap-1 rounded-md px-1 py-1 text-left text-xs font-semibold text-foreground hover:bg-surface-hover"
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
                          .filter(
                            (habit) => !isHabitDoneOnDate(habit, viewDate)
                          )
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
                                openTimelineContextMenu({
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
                      className="flex w-full min-w-0 items-center gap-1 rounded-md px-1.5 py-1 text-left text-xs font-semibold text-foreground hover:bg-surface-hover"
                    >
                      {collapsed ? (
                        <ChevronRight className="size-3.5 shrink-0" />
                      ) : (
                        <ChevronDown className="size-3.5 shrink-0" />
                      )}
                      <span className="min-w-0 flex-1 truncate" title={group.title}>
                        {group.title}
                      </span>
                      <span className="ml-1 shrink-0 text-[10px] font-normal text-muted-foreground">
                        {poolTasks.length}
                      </span>
                    </button>

                    {!collapsed && (
                      <div className="mt-0.5 space-y-0.5 px-0.5 pl-1">
                        {poolTasks.length === 0 ? (
                          <p className="px-1.5 py-1 text-[10px] text-muted-foreground">
                            No tasks
                          </p>
                        ) : (
                          poolTasks.map((task) => (
                            <TimelinePoolChip
                              key={task.id}
                              task={task}
                              groups={groups}
                              fullWidth
                              selected={selectedTaskId === task.id}
                              onSelect={() => {
                                onSelectTask(task.id);
                                onSelectHabit?.(null);
                              }}
                              onOpenDetail={() => onOpenDetail(task.id)}
                              onToggleComplete={() => void onToggleComplete(task)}
                              onContextMenu={(event) => {
                                event.preventDefault();
                                openTimelineContextMenu({
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

          </>
        )}
      </div>

      {contextMenu?.kind === "task" && isWorkplace && contextMenu.anchorRect ? (
        <WorkplaceTimelineTaskMenu
          menuRef={contextMenuRef}
          task={contextMenu.task}
          groups={groups}
          anchorRect={contextMenu.anchorRect}
          onClose={() => setContextMenu(null)}
          onOpenDetail={() => {
            onOpenDetail(contextMenu.task.id);
            setContextMenu(null);
          }}
          onAddToNextUp={() => {
            void appendTaskToNextUp(contextMenu.task.id);
            setContextMenu(null);
          }}
          onClearTime={
            !contextMenu.task.completed && contextMenu.task.scheduled_time
              ? () => {
                  void onScheduleTask(contextMenu.task.id, {
                    scheduled_date: viewDate,
                    scheduled_time: null,
                  });
                  setContextMenu(null);
                }
              : undefined
          }
          onStartFocus={() => {
            onStartFocusTask?.(contextMenu.task.id);
            setContextMenu(null);
          }}
          onToggleComplete={() => {
            void onToggleComplete(contextMenu.task);
            setContextMenu(null);
          }}
          onDelete={() => {
            void onDeleteTask(contextMenu.task.id);
            setContextMenu(null);
          }}
        />
      ) : null}

      {contextMenu?.kind === "task" && (!isWorkplace || !contextMenu.anchorRect) ? (
        <TimelineContextMenu
          menuRef={contextMenuRef}
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
          onAddToToday={
            contextMenu.task.scheduled_date !== getTodayDateString()
              ? () => {
                  void onUpdateTask(contextMenu.task.id, {
                    scheduled_date: getTodayDateString(),
                    planning_state: "none",
                  });
                  setContextMenu(null);
                }
              : undefined
          }
          onAddToNextUp={
            isEligibleForNextUp(contextMenu.task)
              ? () => {
                  void appendTaskToNextUp(contextMenu.task.id);
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
      ) : null}

      {contextMenu?.kind === "habit" && (
        <TimelineHabitContextMenu
          menuRef={contextMenuRef}
          habit={contextMenu.habit}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onStartFocus={
            contextMenu.habit.track_with_focus &&
            !contextMenu.habit.completed &&
            onStartFocusHabit
              ? () => {
                  onStartFocusHabit(contextMenu.habit.id);
                  setContextMenu(null);
                }
              : undefined
          }
          onClearTime={
            contextMenu.habit.scheduled_time
              ? () => {
                  void onScheduleHabit?.(
                    contextMenu.habit.id,
                    { scheduled_time: null },
                    viewDate
                  );
                  setContextMenu(null);
                }
              : undefined
          }
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
          subdued ? "bg-ring/50" : "bg-ring/80"
        )}
        aria-hidden
      />
      <div className="relative -top-2 pr-2 text-right">
        <span
          className={cn(
            "inline-block rounded-sm bg-background px-0.5 text-[10px] font-medium tabular-nums shadow-sm ring-1",
            subdued
              ? "text-accent-text/75 ring-ring/25"
              : "text-accent-text ring-ring/45"
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
  hideGroupPill?: boolean;
  onToggleComplete: () => void;
  onUpdateDuration: (minutes: number | null) => void;
};

function TimelineTaskRowContent({
  task,
  group,
  compact,
  emphasizeTitle,
  hideGroupPill = false,
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
        {!hideGroupPill && group && appearance ? (
          <TaskGroupPill
            icon={appearance.icon}
            name={group.title}
            appearance={appearance}
            className={cn(
              "max-w-[6rem] shrink-0 font-medium",
              compact ? "text-[10px]" : "text-[11px]"
            )}
          />
        ) : null}

        <TaskDurationPicker
          variant="timeline"
          compact={compact}
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
        "group flex cursor-grab items-center border transition-[border-color,box-shadow,background-color,opacity,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] active:cursor-grabbing",
        TIMELINE_TASK_ELEVATION,
        TIMELINE_POOL_ROW_SURFACE,
        fullWidth
          ? "min-h-[28px] w-full rounded-lg px-2.5 py-1.5"
          : "min-h-[30px] rounded-lg px-2.5 py-1.5",
        compact ? "text-xs" : "text-[13px]",
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
  rightInsetPx?: number;
  selected?: boolean;
  overlapping?: boolean;
  showOverlapLabel?: boolean;
  overlapStack?: { index: number; size: number };
  isDragging?: boolean;
  onSelect: () => void;
  onOpenDetail: () => void;
  onToggleComplete: () => void;
  onUpdateDuration?: (minutes: number | null) => void;
  onContextMenu: (event: MouseEvent) => void;
  onDragStart: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
};

function TimelineScheduledBlock({
  block,
  groups,
  viewDate,
  rightInsetPx = 4,
  selected,
  overlapping,
  showOverlapLabel = false,
  overlapStack,
  isDragging,
  onSelect,
  onOpenDetail,
  onToggleComplete,
  onUpdateDuration,
  onContextMenu,
  onDragStart,
  onDragEnd,
}: TimelineScheduledBlockProps) {
  const isHabit = block.kind === "habit";
  const title = isHabit ? block.habit!.name : block.task!.title;
  const completed = isHabit
    ? isHabitDoneOnDate(block.habit!, viewDate)
    : block.task!.completed;
  const durationLabel = isHabit
    ? formatHabitTimeRangeWithDuration(
        block.habit?.scheduled_time ?? null,
        getHabitDurationMinutes(block.id)
      )
    : null;
  const { topPx, heightPx } = block;
  const compact = heightPx < 48;
  /** Same task chrome on Schedule, Quick Schedule, and Today. */
  const useCleanLayout = !isHabit;
  const group = block.task ? resolveTimelineTaskGroup(block.task, groups) : null;
  const groupAppearance = group ? getTaskGroupAppearance(group) : null;
  const groupAccentClass =
    useCleanLayout && groupAppearance
      ? TASK_GROUP_ACCENT_BORDER_CLASS[groupAppearance.colorKey]
      : null;
  const cascadeOffsetPx = overlapStack ? overlapStack.index * 10 : 0;
  const cascadeWidthInsetPx = overlapStack
    ? Math.max(0, overlapStack.size - 1) * 10
    : 0;

  return (
    <div
      data-timeline-entry={block.id}
      data-timeline-kind={block.kind}
      draggable={!completed}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onContextMenu={onContextMenu}
      onClick={onSelect}
      onDoubleClick={(event) => {
        if (!isHabit) {
          event.preventDefault();
          onOpenDetail();
        }
      }}
      className={cn(
        "group absolute z-10 flex flex-col overflow-hidden rounded-lg border transition-[border-color,box-shadow,background-color,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]",
        completed
          ? "cursor-default"
          : "cursor-grab active:cursor-grabbing",
        TIMELINE_TASK_ELEVATION,
        TIMELINE_EVENT_SURFACE,
        groupAccentClass,
        !isDragging && "hover:z-30",
        useCleanLayout
          ? compact
            ? "justify-center px-2.5 py-1.5"
            : "justify-start px-2.5 pt-1.5 pb-1"
          : compact
            ? "justify-center gap-0.5 px-1.5 py-0.5"
            : "gap-0.5 px-2 py-1",
        isHabit && timelineHabitBlockClassNames(),
        overlapping && TIMELINE_EVENT_OVERLAP,
        selected && TIMELINE_TASK_SELECTED,
        isDragging && "opacity-40",
        completed &&
          "opacity-[0.45] transition-opacity hover:opacity-[0.62]"
      )}
      style={{
        top: topPx,
        height: heightPx,
        left: cascadeOffsetPx,
        right:
          rightInsetPx + Math.max(0, cascadeWidthInsetPx - cascadeOffsetPx),
        zIndex: isDragging
          ? 40
          : overlapStack
            ? 12 + overlapStack.index
            : undefined,
      }}
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
            hideGroupPill={compact}
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
                  ? "border-warning bg-warning text-background"
                  : "border-foreground bg-foreground text-background"
                : isHabit
                  ? "border-warning/50"
                  : "border-muted-foreground/40"
            )}
            aria-label={`Mark "${title}" complete`}
          >
            {completed && <Check className="size-2" strokeWidth={3} />}
          </button>

          {isHabit ? (
            <TimelineHabitLabel
              compact={compact}
              trackWithFocus={Boolean(block.habit?.track_with_focus)}
            />
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
              variant="timeline"
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

          {!completed ? (
            <GripVertical className="size-3 shrink-0 text-muted-foreground/40 opacity-0 group-hover:opacity-100" />
          ) : null}
        </div>
      )}

      {showOverlapLabel ? (
        <span className="pointer-events-none mt-auto w-fit rounded px-1 py-px text-[9px] font-medium text-warning/90">
          Overlap
        </span>
      ) : null}
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
  const durationLabel = formatHabitTimeRangeWithDuration(
    habit.scheduled_time,
    getHabitDurationMinutes(habit.id)
  );

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
        "group flex w-full items-center gap-1.5 border transition-[border-color,box-shadow,background-color] duration-150",
        completed
          ? "cursor-default"
          : "cursor-grab active:cursor-grabbing",
        TIMELINE_POOL_ROW_SURFACE,
        compact
          ? "min-h-[28px] rounded-lg px-2.5 py-1.5 text-[11px]"
          : "min-h-[30px] rounded-lg px-2.5 py-1.5 text-xs",
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
            ? "border-warning bg-warning text-background"
            : "border-warning/50 hover:border-warning/70"
        )}
        aria-label={`Mark "${habit.name}" complete`}
      >
        {completed && <Check className="size-2.5" strokeWidth={3} />}
      </button>

      <TimelineHabitLabel compact={compact} trackWithFocus={habit.track_with_focus} />

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

      {!completed ? (
        <GripVertical className="size-3 shrink-0 text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100" />
      ) : null}
    </div>
  );
}

function useClampedFixedMenuPosition(
  x: number,
  y: number,
  menuRef: RefObject<HTMLDivElement | null>,
  repositionKey = 0
) {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ left: x, top: y });

  const updatePosition = useCallback(() => {
    const menu = menuRef.current;
    const width = menu?.offsetWidth ?? 168;
    const height = menu?.offsetHeight ?? 220;
    const padding = 8;
    let left = x;
    let top = y;
    if (left + width > window.innerWidth - padding) {
      left = window.innerWidth - width - padding;
    }
    if (top + height > window.innerHeight - padding) {
      top = window.innerHeight - height - padding;
    }
    setPosition({
      left: Math.max(padding, left),
      top: Math.max(padding, top),
    });
  }, [menuRef, x, y]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    updatePosition();
    const frame = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(frame);
  }, [updatePosition, repositionKey]);

  useEffect(() => {
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [updatePosition]);

  return { mounted, position };
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
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-surface-hover"
        onClick={(event) => {
          event.stopPropagation();
          onOpenChange(true);
        }}
      >
        <Icon className="size-3.5 shrink-0" />
        {label}
        <span className="ml-auto text-muted-foreground">›</span>
      </button>
      {open ? (
        <div className="absolute top-0 left-full z-50 -ml-2 pl-2">
          <div
            data-timeline-context-submenu
            className={cn(
              "flow-surface-elevated p-1",
              submenuClassName ?? "min-w-[7rem]"
            )}
            onClick={(event) => event.stopPropagation()}
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
  menuRef,
  habit,
  x,
  y,
  onClose,
  onStartFocus,
  onClearTime,
}: {
  menuRef: RefObject<HTMLDivElement | null>;
  habit: Habit;
  x: number;
  y: number;
  onClose: () => void;
  onStartFocus?: () => void;
  onClearTime?: () => void;
}) {
  const { mounted, position } = useClampedFixedMenuPosition(x, y, menuRef);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={menuRef}
      data-timeline-context-menu
      className="flow-surface-elevated fixed z-[100] min-w-[10rem] p-1"
      style={{ left: position.left, top: position.top }}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <div className="border-b border-border/40 px-2 py-1.5">
        <p className="truncate text-xs font-medium text-foreground">{habit.name}</p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          {formatHabitTimeRangeWithDuration(
            habit.scheduled_time,
            getHabitDurationMinutes(habit.id)
          ) ?? "No time set"}
        </p>
      </div>
      {onStartFocus ? (
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-surface-hover"
          onClick={onStartFocus}
        >
          <Play className="size-3.5 shrink-0" />
          Start now
        </button>
      ) : null}
      {onClearTime ? (
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-surface-hover"
          onClick={onClearTime}
        >
          <Clock className="size-3.5 shrink-0 text-muted-foreground" />
          Unschedule
        </button>
      ) : null}
      <button
        type="button"
        className="sr-only"
        onClick={onClose}
        aria-label="Close menu"
      />
    </div>,
    document.body
  );
}

function TimelineContextMenu({
  menuRef,
  task,
  x,
  y,
  onClose,
  onOpenDetail,
  onClearTime,
  onAddToToday,
  onAddToNextUp,
  onSetPlanningState,
  onDuplicate,
  onDelete,
}: {
  menuRef: RefObject<HTMLDivElement | null>;
  task: Task;
  x: number;
  y: number;
  onClose: () => void;
  onOpenDetail: () => void;
  onClearTime?: () => void;
  onAddToToday?: () => void;
  onAddToNextUp?: () => void;
  onSetPlanningState?: (planningState: PlanningState) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const planningState = normalizePlanningState(task.planning_state);
  const [planningSubmenuOpen, setPlanningSubmenuOpen] = useState(false);
  const { mounted, position } = useClampedFixedMenuPosition(
    x,
    y,
    menuRef,
    planningSubmenuOpen ? 1 : 0
  );

  if (!mounted) return null;

  return createPortal(
    <div
      ref={menuRef}
      data-timeline-context-menu
      className="flow-surface-elevated fixed z-[100] min-w-[10.5rem] overflow-visible p-1"
      style={{ left: position.left, top: position.top }}
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-surface-hover"
        onClick={(event) => {
          event.stopPropagation();
          onOpenDetail();
        }}
      >
        <ClipboardList className="size-3.5 shrink-0" />
        Open details
      </button>
      {onClearTime ? (
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-surface-hover"
          onClick={(event) => {
            event.stopPropagation();
            onClearTime();
          }}
        >
          <Clock className="size-3.5 shrink-0 text-muted-foreground" />
          Unschedule
        </button>
      ) : null}
      {onAddToToday ? (
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-surface-hover"
          onClick={(event) => {
            event.stopPropagation();
            onAddToToday();
          }}
        >
          <CalendarDays className="size-3.5 shrink-0 text-muted-foreground" />
          Add to Today
        </button>
      ) : null}
      {onAddToNextUp ? (
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-surface-hover"
          onClick={(event) => {
            event.stopPropagation();
            onAddToNextUp();
          }}
        >
          <ListPlus className="size-3.5 shrink-0 text-muted-foreground" />
          Add to Queue
        </button>
      ) : null}
      {onSetPlanningState ? (
        <div className="border-t border-border/40 pt-1">
          <TimelineContextSubmenuRow
            label={PLAN_SECTION_LABEL}
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
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-surface-hover",
                  planningState === state && "bg-muted font-medium text-foreground"
                )}
                onClick={(event) => {
                  event.stopPropagation();
                  onSetPlanningState(state);
                }}
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
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-surface-hover"
        onClick={(event) => {
          event.stopPropagation();
          onDuplicate();
        }}
      >
        <Copy className="size-3.5 shrink-0" />
        Duplicate
      </button>
      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-destructive hover:bg-surface-hover"
        onClick={(event) => {
          event.stopPropagation();
          onDelete();
        }}
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
    </div>,
    document.body
  );
}

