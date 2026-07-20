"use client";

import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import {
  CalendarClock,
  ArrowRightLeft,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Circle,
  Copy,
  Plus,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { TaskDurationPicker } from "@/components/tasks/task-duration-picker";
import { AlertBeforeCustomInput } from "@/components/tasks/task-alert-before-picker";
import { TaskGroupPill } from "@/components/tasks/task-group-pill";
import { TaskSchedulePopover } from "@/components/tasks/task-schedule-popover";
import { formatDurationMinutes } from "@/lib/task-duration-options";
import {
  TASK_ALERT_BEFORE_OPTIONS,
  applyPresetAlert,
  formatAlertBeforeLabel,
} from "@/lib/task-alert-before-options";
import { requestBrowserNotificationPermissionIfNeeded } from "@/lib/browser-notifications";
import { useOptionalActionToast } from "@/contexts/action-toast-context";
import { getTodayDateString } from "@/lib/date-utils";
import {
  normalizePlanningState,
  PLANNING_STATE_CONFIG,
  PLANNING_STATES,
  PLAN_SECTION_LABEL,
} from "@/lib/task-planning";
import {
  getGroupDisplayTitle,
  isLaterGroup,
  isTodayGroup,
} from "@/lib/task-groups";
import { getTaskGroupAppearance } from "@/lib/task-group-appearance";
import { TaskPriorityFlagIcon } from "@/components/tasks/task-priority-flag-icon";
import {
  normalizeTaskPriority,
  TASK_PRIORITY_CONFIG,
  type TaskPriority,
} from "@/lib/task-priority";
import {
  formatTaskScheduleCompact,
  getTaskScheduleDateColorClass,
  getTaskScheduleDateTone,
} from "@/lib/tasks";
import { useTaskRowPointerGesture } from "@/lib/task-row-pointer-gesture";
import {
  bindTaskDetailMenuActions,
  type TaskDetailMenuActionHandlers,
} from "@/lib/task-detail-menu-actions";
import {
  isActiveTaskDetailMenuAnchor,
  resolveEventTargetElement,
  setActiveTaskDetailMenuAnchor,
  subscribeTaskDetailMenu,
  type TaskDetailMenuAnchor,
} from "@/lib/task-detail-menu-coordinator";
import { cn } from "@/lib/utils";
import { type as typographyType } from "@/lib/typography";
import type { PlanningState, Task, TaskGroupWithTasks } from "@/types/task";
import { useOptionalTaskBoardActions } from "@/components/tasks/task-board-actions-context";
import { useOptionalTaskBoardGroups } from "@/components/tasks/task-board-groups-context";

function isTaskDragInteractiveTarget(target: EventTarget | null): boolean {
  const element = resolveEventTargetElement(target);
  return Boolean(element?.closest("[data-no-task-drag]"));
}

function isTaskTitleTarget(target: EventTarget | null): boolean {
  const element = resolveEventTargetElement(target);
  return Boolean(element?.closest("[data-task-title]"));
}

type TaskRowProps = {
  task: Task;
  groupId: string;
  zone?: "active" | "completed";
  groups?: TaskGroupWithTasks[];
  todayViewDate: string;
  isSelected?: boolean;
  dragEnabled?: boolean;
  reorderEnabled?: boolean;
  reorderDisabledTooltip?: string;
  onToggleComplete?: () => void;
  onOpenDetail?: () => void;
  onDuplicate?: () => void;
  onMoveToGroup?: (groupId: string) => void;
  onDelete?: () => void;
  onUpdate?: (updates: Partial<Task>) => void;
  onSetPlanningState?: (planningState: PlanningState) => void;
  onRequestCreateGroup?: () => void;
};

function areTaskRowDisplayFieldsEqual(previous: Task, next: Task): boolean {
  return (
    previous.id === next.id &&
    previous.title === next.title &&
    previous.completed === next.completed &&
    previous.priority === next.priority &&
    previous.duration_minutes === next.duration_minutes &&
    previous.scheduled_date === next.scheduled_date &&
    previous.scheduled_time === next.scheduled_time &&
    previous.planning_state === next.planning_state &&
    previous.notification_enabled === next.notification_enabled &&
    previous.notification_lead_minutes === next.notification_lead_minutes &&
    previous.group_id === next.group_id &&
    previous.sort_order === next.sort_order
  );
}

function areTaskRowPropsEqual(
  previous: TaskRowProps,
  next: TaskRowProps,
): boolean {
  if (previous.groupId !== next.groupId) return false;
  if (previous.zone !== next.zone) return false;
  if (previous.todayViewDate !== next.todayViewDate) return false;
  if (previous.isSelected !== next.isSelected) return false;
  if (previous.dragEnabled !== next.dragEnabled) return false;
  if (previous.reorderEnabled !== next.reorderEnabled) return false;
  if (!areTaskRowDisplayFieldsEqual(previous.task, next.task)) return false;
  return (
    previous.onToggleComplete === next.onToggleComplete &&
    previous.onOpenDetail === next.onOpenDetail &&
    previous.onDuplicate === next.onDuplicate &&
    previous.onMoveToGroup === next.onMoveToGroup &&
    previous.onDelete === next.onDelete &&
    previous.onUpdate === next.onUpdate &&
    previous.onSetPlanningState === next.onSetPlanningState &&
    previous.onRequestCreateGroup === next.onRequestCreateGroup &&
    previous.groups === next.groups
  );
}

function PriorityFlagIcon({
  priority,
  className,
}: {
  priority: TaskPriority;
  className?: string;
}) {
  return <TaskPriorityFlagIcon priority={priority} className={className} />;
}

function uniqueMoveTargets(
  groups: TaskGroupWithTasks[],
  currentGroupId: string | null,
) {
  const seen = new Set<string>();
  return groups.filter((group) => {
    if (
      isTodayGroup(group) ||
      isLaterGroup(group) ||
      group.id === currentGroupId ||
      seen.has(group.id)
    ) {
      return false;
    }
    seen.add(group.id);
    return true;
  });
}

function TaskPriorityMenuPopover({
  priority,
  anchorRef,
  popoverRef,
  onUpdate,
}: {
  priority: TaskPriority;
  anchorRef: RefObject<HTMLDivElement | null>;
  popoverRef: RefObject<HTMLDivElement | null>;
  onUpdate: (updates: Partial<Task>) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const popoverWidth = popoverRef.current?.offsetWidth ?? 136;
    const popoverHeight = popoverRef.current?.offsetHeight ?? 108;
    const gap = 4;
    const padding = 8;

    let left = rect.right + gap;
    if (left + popoverWidth > window.innerWidth - padding) {
      left = rect.left - popoverWidth - gap;
    }
    left = Math.max(
      padding,
      Math.min(left, window.innerWidth - popoverWidth - padding),
    );

    let top = rect.top;
    if (top + popoverHeight > window.innerHeight - padding) {
      top = rect.bottom - popoverHeight;
    }
    top = Math.max(
      padding,
      Math.min(top, window.innerHeight - popoverHeight - padding),
    );

    setPosition({ top, left });
  }, [anchorRef, popoverRef]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    updatePosition();
    const frame = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(frame);
  }, [updatePosition, priority]);

  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [updatePosition]);

  if (!mounted) return null;

  const anchorRect = anchorRef.current?.getBoundingClientRect();
  const top = position?.top ?? anchorRect?.top ?? 0;
  const left = position?.left ?? (anchorRect ? anchorRect.right + 4 : 0);

  return createPortal(
    <div
      ref={popoverRef}
      className="flow-surface-elevated fixed z-[100] min-w-[8.5rem] p-1"
      style={{ top, left }}
    >
      <button
        type="button"
        onClick={() => onUpdate({ priority: "high" })}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors duration-100 hover:bg-surface-hover/70",
          priority === "high" &&
            "bg-red-500/10 font-medium text-red-700 dark:bg-red-500/15 dark:text-red-300",
        )}
      >
        <PriorityFlagIcon priority="high" /> {TASK_PRIORITY_CONFIG.high.label}
      </button>
      <button
        type="button"
        onClick={() => onUpdate({ priority: "medium" })}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors duration-100 hover:bg-surface-hover/70",
          priority === "medium" &&
            "bg-amber-500/10 font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
        )}
      >
        <PriorityFlagIcon priority="medium" />{" "}
        {TASK_PRIORITY_CONFIG.medium.label}
      </button>
      <button
        type="button"
        onClick={() => onUpdate({ priority: "low" })}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors duration-100 hover:bg-surface-hover/70",
          priority === "low" && "bg-selected font-medium text-foreground",
        )}
      >
        <PriorityFlagIcon priority="low" /> {TASK_PRIORITY_CONFIG.low.label}
      </button>
    </div>,
    document.body,
  );
}

function TaskDetailSubmenuRow({
  label,
  icon: Icon,
  open,
  onOpenChange,
  onActivate,
  submenuToggleAction,
  submenuClassName,
  children,
  className,
}: {
  label: string;
  icon: LucideIcon;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActivate: () => void;
  submenuToggleAction: string;
  submenuClassName?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => {
        onActivate();
        onOpenChange(true);
      }}
    >
      <button
        type="button"
        data-task-menu-action={submenuToggleAction}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors duration-100 hover:bg-surface-hover/70"
      >
        <Icon className="size-3.5" />
        {label}
        <span className="ml-auto text-muted-foreground">›</span>
      </button>
      {open ? (
        <div className="absolute top-0 left-full z-50 -ml-2 pl-2">
          <div
            data-task-detail-submenu
            className={cn(
              "flow-surface-elevated overflow-hidden p-0",
              submenuClassName ?? "min-w-[7rem]",
            )}
          >
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function TaskDetailMenuPopover({
  task,
  todayViewDate,
  moveTargets,
  anchorRef,
  popoverRef,
  pointerPosition,
  moveSubmenuOpen,
  onMoveSubmenuOpenChange,
  planningSubmenuOpen,
  onPlanningSubmenuOpenChange,
  alertSubmenuOpen,
  onAlertSubmenuOpenChange,
  onDuplicate,
  onMoveToGroup,
  onAddToToday,
  onSetPlanningState,
  onSetAlertBefore,
  onCloseMenu,
  onDelete,
  onRequestCreateGroup,
}: {
  task: Task;
  todayViewDate: string;
  moveTargets: TaskGroupWithTasks[];
  anchorRef: RefObject<HTMLDivElement | null>;
  popoverRef: RefObject<HTMLDivElement | null>;
  pointerPosition: { x: number; y: number } | null;
  moveSubmenuOpen: boolean;
  onMoveSubmenuOpenChange: (open: boolean) => void;
  planningSubmenuOpen: boolean;
  onPlanningSubmenuOpenChange: (open: boolean) => void;
  alertSubmenuOpen: boolean;
  onAlertSubmenuOpenChange: (open: boolean) => void;
  onDuplicate: () => void;
  onMoveToGroup: (groupId: string) => void;
  onAddToToday?: () => void;
  onSetPlanningState?: (planningState: PlanningState) => void;
  onSetAlertBefore: (updates: {
    notification_enabled: boolean;
    notification_lead_minutes: number | null;
  }) => void;
  onCloseMenu: () => void;
  onDelete: () => void;
  onRequestCreateGroup?: () => void;
}) {
  const planningState = normalizePlanningState(task.planning_state);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const menuActionsRef = useRef<TaskDetailMenuActionHandlers>({
    onDuplicate,
    onDelete,
    onMoveToGroup,
    onAddToToday,
    onSetPlanningState,
    onSetAlertBefore,
    onRequestCreateGroup,
    onOpenPlanningSubmenu: () => {
      onMoveSubmenuOpenChange(false);
      onAlertSubmenuOpenChange(false);
      onPlanningSubmenuOpenChange(true);
    },
    onOpenMoveSubmenu: () => {
      onPlanningSubmenuOpenChange(false);
      onAlertSubmenuOpenChange(false);
      onMoveSubmenuOpenChange(true);
    },
    onOpenAlertSubmenu: () => {
      onPlanningSubmenuOpenChange(false);
      onMoveSubmenuOpenChange(false);
      onAlertSubmenuOpenChange(true);
    },
  });

  menuActionsRef.current = {
    onDuplicate,
    onDelete,
    onMoveToGroup,
    onAddToToday,
    onSetPlanningState,
    onSetAlertBefore,
    onRequestCreateGroup,
    onOpenPlanningSubmenu: () => {
      onMoveSubmenuOpenChange(false);
      onAlertSubmenuOpenChange(false);
      onPlanningSubmenuOpenChange(true);
    },
    onOpenMoveSubmenu: () => {
      onPlanningSubmenuOpenChange(false);
      onAlertSubmenuOpenChange(false);
      onMoveSubmenuOpenChange(true);
    },
    onOpenAlertSubmenu: () => {
      onPlanningSubmenuOpenChange(false);
      onMoveSubmenuOpenChange(false);
      onAlertSubmenuOpenChange(true);
    },
  };

  const menuCleanupRef = useRef<(() => void) | null>(null);

  const bindMenuActionsRef = useCallback(
    (node: HTMLDivElement | null) => {
      menuCleanupRef.current?.();
      menuCleanupRef.current = null;
      popoverRef.current = node;
      if (!node) return;
      menuCleanupRef.current = bindTaskDetailMenuActions(
        node,
        () => menuActionsRef.current,
      );
    },
    [popoverRef],
  );

  useEffect(
    () => () => {
      menuCleanupRef.current?.();
      menuCleanupRef.current = null;
    },
    [],
  );

  const updatePosition = useCallback(() => {
    const popoverWidth = popoverRef.current?.offsetWidth ?? 168;
    const popoverHeight = popoverRef.current?.offsetHeight ?? 220;
    const gap = 6;
    const padding = 8;

    if (pointerPosition) {
      let left = pointerPosition.x;
      let top = pointerPosition.y;
      if (left + popoverWidth > window.innerWidth - padding) {
        left = window.innerWidth - popoverWidth - padding;
      }
      if (top + popoverHeight > window.innerHeight - padding) {
        top = window.innerHeight - popoverHeight - padding;
      }
      setPosition({
        top: Math.max(padding, top),
        left: Math.max(padding, left),
      });
      return;
    }

    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    let left = rect.right + gap;
    if (left + popoverWidth > window.innerWidth - padding) {
      left = rect.left - popoverWidth - gap;
    }
    left = Math.max(
      padding,
      Math.min(left, window.innerWidth - popoverWidth - padding),
    );

    let top = rect.top;
    if (top + popoverHeight > window.innerHeight - padding) {
      top = rect.bottom - popoverHeight;
    }
    top = Math.max(
      padding,
      Math.min(top, window.innerHeight - popoverHeight - padding),
    );

    setPosition({ top, left });
  }, [anchorRef, pointerPosition, popoverRef]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    updatePosition();
    const frame = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(frame);
  }, [
    updatePosition,
    moveSubmenuOpen,
    planningSubmenuOpen,
    alertSubmenuOpen,
    moveTargets.length,
  ]);

  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [updatePosition]);

  if (!mounted) return null;

  const anchorRect = anchorRef.current?.getBoundingClientRect();
  const top = position?.top ?? pointerPosition?.y ?? anchorRect?.top ?? 0;
  const left =
    position?.left ??
    pointerPosition?.x ??
    (anchorRect ? anchorRect.right + 6 : 0);

  return createPortal(
    <div
      ref={bindMenuActionsRef}
      data-task-detail-menu
      className="flow-surface-elevated fixed z-[100] min-w-[10.5rem] overflow-visible p-1"
      style={{ top, left }}
    >
      <button
        type="button"
        data-task-menu-action="duplicate"
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors duration-100 hover:bg-surface-hover/70"
      >
        <Copy className="size-3.5" /> Duplicate
      </button>

      <TaskDetailSubmenuRow
        label="Alert before"
        icon={Bell}
        open={alertSubmenuOpen}
        onOpenChange={onAlertSubmenuOpenChange}
        onActivate={() => {
          onMoveSubmenuOpenChange(false);
          onPlanningSubmenuOpenChange(false);
        }}
        submenuToggleAction="submenu-alert"
        submenuClassName="min-w-[7rem]"
      >
        <AlertBeforeCustomInput
          key={alertSubmenuOpen ? "open" : "closed"}
          notificationEnabled={task.notification_enabled}
          leadMinutes={task.notification_lead_minutes}
          onCommit={(minutes) => onSetAlertBefore(applyPresetAlert(minutes))}
          onCommitDone={onCloseMenu}
        />
        <button
          type="button"
          data-task-menu-action="alert:silent"
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors duration-100 hover:bg-surface-hover/70",
            !task.notification_enabled &&
              "bg-selected font-medium text-foreground",
          )}
        >
          Silent
        </button>
        {TASK_ALERT_BEFORE_OPTIONS.map((option) => (
          <button
            key={option.minutes}
            type="button"
            data-task-menu-action={`alert:${option.minutes}`}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs tabular-nums hover:bg-surface-hover",
              task.notification_enabled &&
                task.notification_lead_minutes === option.minutes &&
                "bg-selected font-medium text-foreground",
            )}
          >
            {option.label}
          </button>
        ))}
        <div className="my-1 border-t border-border/40" />
        <button
          type="button"
          data-task-menu-action="alert:clear"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-muted-foreground hover:bg-surface-hover"
        >
          Clear
        </button>
      </TaskDetailSubmenuRow>

      <div className="border-t border-border/40 pt-1">
        {onAddToToday ? (
          <button
            type="button"
            data-task-menu-action="add-to-today"
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors duration-100 hover:bg-surface-hover/70"
          >
            <CalendarDays className="size-3.5 text-muted-foreground" />
            Add to Today
          </button>
        ) : null}

        {onSetPlanningState ? (
          <TaskDetailSubmenuRow
            label={PLAN_SECTION_LABEL}
            icon={CalendarClock}
            open={planningSubmenuOpen}
            onOpenChange={onPlanningSubmenuOpenChange}
            onActivate={() => {
              onMoveSubmenuOpenChange(false);
              onAlertSubmenuOpenChange(false);
            }}
            submenuToggleAction="submenu-planning"
            submenuClassName="min-w-[7.5rem]"
          >
            {PLANNING_STATES.map((state) => (
              <button
                key={state}
                type="button"
                data-task-menu-action={`planning:${state}`}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors duration-100 hover:bg-surface-hover/70",
                  planningState === state &&
                    "bg-selected font-medium text-foreground",
                )}
              >
                {state === "later" ? (
                  <CalendarClock className="size-3.5 shrink-0 text-muted-foreground" />
                ) : (
                  <Circle className="size-3.5 shrink-0 text-muted-foreground" />
                )}
                {PLANNING_STATE_CONFIG[state].label}
              </button>
            ))}
          </TaskDetailSubmenuRow>
        ) : null}
      </div>

      <TaskDetailSubmenuRow
        label="Move to"
        icon={ArrowRightLeft}
        open={moveSubmenuOpen}
        onOpenChange={onMoveSubmenuOpenChange}
        onActivate={() => {
          onPlanningSubmenuOpenChange(false);
          onAlertSubmenuOpenChange(false);
        }}
        submenuToggleAction="submenu-move"
        submenuClassName="min-w-[9rem]"
        className="border-t border-border/40 pt-1"
      >
        <div className="mb-1 flex items-center gap-1 border-b border-border/40 px-1 pb-1">
          <span className="flex-1 px-1 text-[10px] font-medium text-muted-foreground">
            Groups
          </span>
          {onRequestCreateGroup ? (
            <button
              type="button"
              data-task-menu-action="create-group"
              className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
              aria-label="New group"
            >
              <Plus className="size-3.5" />
            </button>
          ) : null}
        </div>
        {moveTargets.map((group) => {
          const appearance = getTaskGroupAppearance(group);
          return (
            <button
              key={group.id}
              type="button"
              data-task-menu-action={`move:${group.id}`}
              className="flex w-full items-center rounded-md px-2 py-1.5 text-left transition-colors duration-100 hover:bg-surface-hover/70"
            >
              <TaskGroupPill
                icon={appearance.icon}
                name={getGroupDisplayTitle(group, todayViewDate)}
                appearance={appearance}
                className="max-w-full text-[11px]"
              />
            </button>
          );
        })}
        {moveTargets.length === 0 ? (
          <p className="px-2 py-1.5 text-xs text-muted-foreground">
            No other groups
          </p>
        ) : null}
      </TaskDetailSubmenuRow>

      <button
        type="button"
        data-task-menu-action="delete"
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-destructive hover:bg-surface-hover"
      >
        <Trash2 className="size-3.5" /> Delete
      </button>
    </div>,
    document.body,
  );
}

export const TaskRow = memo(function TaskRow({
  task,
  groupId,
  zone,
  groups: groupsProp,
  todayViewDate,
  isSelected = false,
  dragEnabled = true,
  reorderEnabled = true,
  reorderDisabledTooltip = "Switch to Manual sorting to reorder tasks.",
  onToggleComplete: onToggleCompleteProp,
  onOpenDetail: onOpenDetailProp,
  onDuplicate: onDuplicateProp,
  onMoveToGroup: onMoveToGroupProp,
  onDelete: onDeleteProp,
  onUpdate: onUpdateProp,
  onSetPlanningState: onSetPlanningStateProp,
  onRequestCreateGroup: onRequestCreateGroupProp,
}: TaskRowProps) {
  const groupsFromBoard = useOptionalTaskBoardGroups();
  const groups = groupsProp ?? groupsFromBoard ?? [];
  const boardActions = useOptionalTaskBoardActions();
  const actionToast = useOptionalActionToast();

  const onToggleComplete = useCallback(() => {
    if (onToggleCompleteProp) {
      onToggleCompleteProp();
      return;
    }
    boardActions?.onToggleComplete(task);
  }, [boardActions, onToggleCompleteProp, task]);

  const onOpenDetail = useCallback(() => {
    if (onOpenDetailProp) {
      onOpenDetailProp();
      return;
    }
    boardActions?.onOpenDetail(task.id);
  }, [boardActions, onOpenDetailProp, task.id]);

  const onDuplicate = useCallback(() => {
    if (onDuplicateProp) {
      onDuplicateProp();
      return;
    }
    boardActions?.onDuplicateTask(task);
  }, [boardActions, onDuplicateProp, task]);

  const onMoveToGroup = useCallback(
    (targetGroupId: string) => {
      if (onMoveToGroupProp) {
        onMoveToGroupProp(targetGroupId);
        return;
      }
      boardActions?.onMoveTask(task.id, targetGroupId);
    },
    [boardActions, onMoveToGroupProp, task.id],
  );

  const onDelete = useCallback(() => {
    if (onDeleteProp) {
      onDeleteProp();
      return;
    }
    boardActions?.onDeleteTask(task.id);
  }, [boardActions, onDeleteProp, task.id]);

  const onUpdate = useCallback(
    (updates: Partial<Task>) => {
      if (onUpdateProp) {
        onUpdateProp(updates);
        return;
      }
      boardActions?.onUpdateTask(task.id, updates);
    },
    [boardActions, onUpdateProp, task.id],
  );

  const onSetPlanningState = useCallback(
    (planningState: PlanningState) => {
      if (onSetPlanningStateProp) {
        onSetPlanningStateProp(planningState);
        return;
      }
      boardActions?.onSetPlanningState?.(task.id, planningState);
    },
    [boardActions, onSetPlanningStateProp, task.id],
  );

  const onRequestCreateGroup = useCallback(() => {
    if (onRequestCreateGroupProp) {
      onRequestCreateGroupProp();
      return;
    }
    boardActions?.onRequestCreateGroup(task.id);
  }, [boardActions, onRequestCreateGroupProp, task.id]);

  const menuAnchor: TaskDetailMenuAnchor = {
    taskId: task.id,
    groupId,
    zone: zone ?? "active",
  };
  const detailMenuOpen = useSyncExternalStore(
    subscribeTaskDetailMenu,
    () => isActiveTaskDetailMenuAnchor(menuAnchor),
    () => false,
  );
  const [flagMenuOpen, setFlagMenuOpen] = useState(false);
  const [moveSubmenuOpen, setMoveSubmenuOpen] = useState(false);
  const [planningSubmenuOpen, setPlanningSubmenuOpen] = useState(false);
  const [alertSubmenuOpen, setAlertSubmenuOpen] = useState(false);
  const [durationOpen, setDurationOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const detailPopoverRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const contextMenuPointRef = useRef<{ x: number; y: number } | null>(null);
  const flagAnchorRef = useRef<HTMLDivElement>(null);
  const flagPopoverRef = useRef<HTMLDivElement>(null);
  const scheduleAnchorRef = useRef<HTMLDivElement>(null);
  const schedulePopoverRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [titleDraft, setTitleDraft] = useState(task.title);
  const priority = normalizeTaskPriority(task.priority);
  const moveTargets = useMemo(
    () => uniqueMoveTargets(groups, task.group_id),
    [groups, task.group_id],
  );

  const hasSchedule = Boolean(task.scheduled_date);
  const scheduleDateColorClass = getTaskScheduleDateColorClass(
    getTaskScheduleDateTone(task, todayViewDate),
  );

  const scheduleLabel = formatTaskScheduleCompact(task);
  const isCompleted = task.completed;
  const hasDuration = Boolean(
    task.duration_minutes && task.duration_minutes > 0,
  );
  const durationLabel = hasDuration
    ? formatDurationMinutes(task.duration_minutes!)
    : null;
  const showMetaRow = Boolean(scheduleLabel);

  useEffect(() => {
    if (!isRenaming) {
      setTitleDraft(task.title);
    }
  }, [isRenaming, task.title]);

  useEffect(() => {
    if (!isRenaming) return;
    const frame = requestAnimationFrame(() => {
      const input = titleInputRef.current;
      input?.focus();
      input?.select();
    });
    return () => cancelAnimationFrame(frame);
  }, [isRenaming]);

  const onPointerDragStart = useCallback(
    (coords: { clientX: number; clientY: number }) => {
      boardActions?.onTaskPointerDragStart(task.id, groupId, coords);
    },
    [boardActions, groupId, task.id],
  );

  const onPointerDragEnd = useCallback(() => {
    boardActions?.onTaskPointerDragEnd();
  }, [boardActions]);

  const startRename = useCallback(() => {
    setTitleDraft(task.title);
    setIsRenaming(true);
  }, [task.title]);

  const rowPointerGesture = useTaskRowPointerGesture({
    dragEnabled,
    gestureEnabled: !isRenaming,
    isInteractiveTarget: isTaskDragInteractiveTarget,
    isDoubleClickTarget: isTaskTitleTarget,
    onOpenDetail,
    onDoubleClick: startRename,
    onPointerDragStart,
    onPointerDragEnd,
  });

  const { cancelPendingOpenDetail, ...rowPointerHandlers } = rowPointerGesture;

  const commitRename = useCallback(() => {
    setIsRenaming(false);
    const nextTitle = titleDraft.trim() || "Untitled";
    setTitleDraft(nextTitle);
    if (nextTitle !== task.title) {
      onUpdate({ title: nextTitle });
    }
  }, [onUpdate, task.title, titleDraft]);

  const cancelRename = useCallback(() => {
    setIsRenaming(false);
    setTitleDraft(task.title);
  }, [task.title]);

  const handleTitleDoubleClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      cancelPendingOpenDetail();
      startRename();
    },
    [cancelPendingOpenDetail, startRename],
  );

  useEffect(() => {
    if (!scheduleOpen) return;

    function handlePointerDown(event: globalThis.MouseEvent) {
      const target = event.target as Node;
      if (scheduleAnchorRef.current?.contains(target)) return;
      if (schedulePopoverRef.current?.contains(target)) return;
      if (
        target instanceof Element &&
        target.closest("[data-schedule-popover]")
      ) {
        return;
      }
      setScheduleOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [scheduleOpen]);

  useEffect(() => {
    if (!flagMenuOpen) return;

    function handlePointerDown(event: globalThis.MouseEvent) {
      const target = event.target as Node;
      if (flagAnchorRef.current?.contains(target)) return;
      if (flagPopoverRef.current?.contains(target)) return;
      setFlagMenuOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [flagMenuOpen]);

  const closeDetailMenu = useCallback(() => {
    setActiveTaskDetailMenuAnchor(null);
  }, []);

  useEffect(() => {
    if (detailMenuOpen) return;
    contextMenuPointRef.current = null;
    setMoveSubmenuOpen(false);
    setPlanningSubmenuOpen(false);
    setAlertSubmenuOpen(false);
  }, [detailMenuOpen]);

  function handleContextMenu(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    setFlagMenuOpen(false);
    setScheduleOpen(false);
    contextMenuPointRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
    setActiveTaskDetailMenuAnchor(menuAnchor);
  }

  return (
    <div
      ref={rowRef}
      data-task-row={task.id}
      data-task-board-group={groupId}
      {...rowPointerHandlers}
      onContextMenu={handleContextMenu}
      title={
        dragEnabled && !reorderEnabled ? reorderDisabledTooltip : undefined
      }
      className={cn(
        "group relative mx-0.5 flex min-w-0 select-none items-center gap-0 rounded-md border border-transparent py-1 pl-0.5 pr-0.5",
        !isSelected && "flow-row-interactive",
        dragEnabled && "cursor-grab active:cursor-grabbing",
        scheduleOpen && "z-20",
        detailMenuOpen && "z-20",
        flagMenuOpen && "z-20",
        isSelected && "flow-selected",
        isCompleted && "opacity-[0.45] hover:opacity-[0.62]",
      )}
    >
      <button
        type="button"
        data-no-task-drag
        onPointerDown={(event) => event.stopPropagation()}
        onClick={onToggleComplete}
        className="flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-hover/80 hover:text-foreground"
        aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
      >
        {isCompleted ? (
          <CheckCircle2 className="size-3.5 fill-emerald-500/12 text-emerald-600 dark:fill-emerald-400/15 dark:text-emerald-400" />
        ) : (
          <Circle className="size-3.5 transition-colors group-hover:text-foreground/80" />
        )}
      </button>

      <div className="ml-1 flex min-w-0 flex-1 flex-col justify-center">
        {isRenaming ? (
          <input
            ref={titleInputRef}
            data-no-task-drag
            value={titleDraft}
            onChange={(event) => setTitleDraft(event.target.value)}
            onBlur={commitRename}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
            onDoubleClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                commitRename();
              }
              if (event.key === "Escape") {
                event.preventDefault();
                cancelRename();
              }
            }}
            className={cn(
              "min-w-0 rounded border border-primary/30 bg-surface-canvas px-1 py-0 font-[520] text-foreground outline-none ring-primary/20 select-text focus:ring-1",
              isCompleted
                ? typographyType.contentDense
                : "text-sm leading-[18px]",
              isCompleted && "line-through",
            )}
            aria-label="Rename task"
          />
        ) : (
          <div
            data-task-title
            onDoubleClick={handleTitleDoubleClick}
            className={cn(
              "flex min-w-0 w-full flex-1 flex-col items-start gap-px px-1 text-left",
              dragEnabled && "cursor-grab active:cursor-grabbing",
            )}
            title={task.title}
          >
            <span
              data-task-title-text
              className={cn(
                "min-w-0 w-full truncate font-[520] text-foreground",
                isCompleted
                  ? typographyType.contentDense
                  : "text-sm leading-[18px]",
                isCompleted && "line-through",
              )}
            >
              {task.title || "Untitled"}
            </span>
            {showMetaRow ? (
              <span
                className={cn(
                  "flex w-full min-w-0 items-center justify-between gap-2 font-normal tabular-nums",
                  isCompleted
                    ? "text-[9px] leading-[10px] text-muted-foreground/60"
                    : "text-[10px] leading-[11px] text-muted-foreground/65",
                )}
              >
                <span className="min-w-0 truncate">{scheduleLabel ?? ""}</span>
                {durationLabel ? (
                  <span className="shrink-0 text-muted-foreground/55">
                    {durationLabel}
                  </span>
                ) : null}
              </span>
            ) : null}
          </div>
        )}
      </div>

      <div
        data-no-task-drag
        className={cn(
          "relative shrink-0 transition-opacity",
          hasDuration || durationOpen
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100",
        )}
      >
        <TaskDurationPicker
          variant="task-row"
          durationMinutes={task.duration_minutes}
          onChange={(minutes) => onUpdate({ duration_minutes: minutes })}
          onOpenChange={setDurationOpen}
        />
      </div>

      <div
        ref={scheduleAnchorRef}
        data-no-task-drag
        className={cn(
          "relative size-6 shrink-0 transition-opacity",
          hasSchedule || scheduleOpen
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100",
        )}
      >
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => setScheduleOpen((value) => !value)}
          className={cn(
            "absolute inset-0 flex items-center justify-center rounded hover:bg-surface-hover/80",
            scheduleOpen && "bg-surface-raised",
            scheduleDateColorClass,
          )}
          aria-label="Schedule date and time"
          aria-expanded={scheduleOpen}
        >
          <CalendarDays className="size-3.5" strokeWidth={1.75} />
        </button>

        {scheduleOpen && (
          <TaskSchedulePopover
            task={task}
            anchorRef={scheduleAnchorRef}
            popoverRef={schedulePopoverRef}
            onUpdate={onUpdate}
          />
        )}
      </div>

      <div ref={flagAnchorRef} data-no-task-drag className="relative shrink-0">
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => setFlagMenuOpen((value) => !value)}
          className={cn(
            "flex size-6 items-center justify-center rounded hover:bg-surface-hover/80",
            priority === "low" &&
              "opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-visible:opacity-100",
            flagMenuOpen && "opacity-100",
          )}
          aria-label="Set priority"
          aria-expanded={flagMenuOpen}
        >
          <PriorityFlagIcon priority={priority} />
        </button>

        {flagMenuOpen && (
          <TaskPriorityMenuPopover
            priority={priority}
            anchorRef={flagAnchorRef}
            popoverRef={flagPopoverRef}
            onUpdate={(updates) => {
              onUpdate(updates);
              setFlagMenuOpen(false);
            }}
          />
        )}
      </div>

      {detailMenuOpen && (
        <TaskDetailMenuPopover
          task={task}
          todayViewDate={todayViewDate}
          moveTargets={moveTargets}
          anchorRef={rowRef}
          popoverRef={detailPopoverRef}
          pointerPosition={contextMenuPointRef.current}
          moveSubmenuOpen={moveSubmenuOpen}
          onMoveSubmenuOpenChange={setMoveSubmenuOpen}
          planningSubmenuOpen={planningSubmenuOpen}
          onPlanningSubmenuOpenChange={setPlanningSubmenuOpen}
          alertSubmenuOpen={alertSubmenuOpen}
          onAlertSubmenuOpenChange={setAlertSubmenuOpen}
          onSetAlertBefore={(updates) => {
            onUpdate(updates);
            if (updates.notification_enabled) {
              void requestBrowserNotificationPermissionIfNeeded();
            }
            const label = formatAlertBeforeLabel(
              updates.notification_enabled,
              updates.notification_lead_minutes,
            );
            const message = !updates.notification_enabled
              ? "Alert silenced"
              : updates.notification_lead_minutes == null ||
                  updates.notification_lead_minutes <= 0
                ? "Alert cleared"
                : `Alert set · ${label}`;
            actionToast?.showActionToast({
              message,
              tone: "success",
              icon: "check",
            });
            closeDetailMenu();
          }}
          onCloseMenu={closeDetailMenu}
          onDuplicate={() => {
            onDuplicate();
            closeDetailMenu();
          }}
          onAddToToday={
            task.scheduled_date !== getTodayDateString()
              ? () => {
                  void onUpdate({
                    scheduled_date: getTodayDateString(),
                    planning_state: "none",
                  });
                  actionToast?.showActionToast({
                    message: "Added to Today",
                    tone: "success",
                    icon: "calendar",
                  });
                  closeDetailMenu();
                }
              : undefined
          }
          onSetPlanningState={(planningState) => {
            onSetPlanningState(planningState);
            closeDetailMenu();
          }}
          onMoveToGroup={(groupId) => {
            onMoveToGroup(groupId);
            closeDetailMenu();
          }}
          onDelete={() => {
            onDelete();
            closeDetailMenu();
          }}
          onRequestCreateGroup={
            onRequestCreateGroup
              ? () => {
                  onRequestCreateGroup();
                  closeDetailMenu();
                }
              : undefined
          }
        />
      )}
    </div>
  );
}, areTaskRowPropsEqual);
