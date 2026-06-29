"use client";

import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
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
import { TaskGroupPill } from "@/components/tasks/task-group-pill";
import { Switch } from "@/components/ui/switch";
import {
  formatDurationMinutes,
} from "@/lib/task-duration-options";
import { formatTimeShort, getTodayDateString, getTomorrowDateString, toTimeInputValue } from "@/lib/date-utils";
import {
  normalizePlanningState,
  PLANNING_STATE_CONFIG,
  PLANNING_STATES,
} from "@/lib/task-planning";
import { getGroupDisplayTitle, isLaterGroup, isTodayGroup } from "@/lib/task-groups";
import { getTaskGroupAppearance } from "@/lib/task-group-appearance";
import { TaskPriorityFlagIcon } from "@/components/tasks/task-priority-flag-icon";
import {
  normalizeTaskPriority,
  TASK_PRIORITY_CONFIG,
  type TaskPriority,
} from "@/lib/task-priority";
import { formatTaskScheduleCompact } from "@/lib/tasks";
import { useTaskRowPointerGesture } from "@/lib/task-row-pointer-gesture";
import { cn } from "@/lib/utils";
import type { PlanningState, Task, TaskGroupWithTasks } from "@/types/task";

const TASK_DRAG_THRESHOLD_PX = 6;

function isTaskDragInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest("[data-no-task-drag]"));
}

type TaskRowProps = {
  task: Task;
  groups: TaskGroupWithTasks[];
  todayViewDate: string;
  isSelected?: boolean;
  dragEnabled?: boolean;
  reorderEnabled?: boolean;
  reorderDisabledTooltip?: string;
  onPointerDragStart: (coords: { clientX: number; clientY: number }) => void;
  onPointerDragEnd: () => void;
  onToggleComplete: () => void;
  onOpenDetail: () => void;
  onDuplicate: () => void;
  onMoveToGroup: (groupId: string) => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<Task>) => void;
  onSetPlanningState?: (planningState: PlanningState) => void;
  onRequestCreateGroup?: () => void;
};

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
  currentGroupId: string | null
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

function NotificationBellOffIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-3.5 shrink-0", className)}
      aria-hidden="true"
    >
      <path
        d="M10.268 21a2 2 0 0 0 3.464 0"
        strokeWidth="2"
      />
      <path
        d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"
        strokeWidth="2"
      />
      <path d="M4 4l16 16" strokeWidth="2.5" />
    </svg>
  );
}

function formatNotifyDateLabel(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12));
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
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
  const [position, setPosition] = useState<{ top: number; left: number } | null>(
    null
  );

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
      Math.min(left, window.innerWidth - popoverWidth - padding)
    );

    let top = rect.top;
    if (top + popoverHeight > window.innerHeight - padding) {
      top = rect.bottom - popoverHeight;
    }
    top = Math.max(
      padding,
      Math.min(top, window.innerHeight - popoverHeight - padding)
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
      className="fixed z-[100] min-w-[8.5rem] rounded-lg border border-border/60 bg-popover p-1 shadow-lg"
      style={{ top, left }}
    >
      <button
        type="button"
        onClick={() => onUpdate({ priority: "high" })}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted",
          priority === "high" && "bg-red-500/10 font-medium text-red-700"
        )}
      >
        <PriorityFlagIcon priority="high" /> {TASK_PRIORITY_CONFIG.high.label}
      </button>
      <button
        type="button"
        onClick={() => onUpdate({ priority: "medium" })}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted",
          priority === "medium" && "bg-amber-500/10 font-medium text-amber-700"
        )}
      >
        <PriorityFlagIcon priority="medium" /> {TASK_PRIORITY_CONFIG.medium.label}
      </button>
      <button
        type="button"
        onClick={() => onUpdate({ priority: "low" })}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted",
          priority === "low" && "bg-muted font-medium text-foreground"
        )}
      >
        <PriorityFlagIcon priority="low" /> {TASK_PRIORITY_CONFIG.low.label}
      </button>
    </div>,
    document.body
  );
}

function TaskDetailSubmenuRow({
  label,
  icon: Icon,
  open,
  onOpenChange,
  onActivate,
  submenuClassName,
  children,
  className,
}: {
  label: string;
  icon: LucideIcon;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActivate: () => void;
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
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted"
      >
        <Icon className="size-3.5" />
        {label}
        <span className="ml-auto text-muted-foreground">›</span>
      </button>
      {open && (
        <div className="absolute top-0 left-full z-50 -ml-2 pl-2">
          <div
            data-task-move-submenu
            className={cn(
              "rounded-lg border border-border/60 bg-popover p-1 shadow-lg",
              submenuClassName ?? "min-w-[7rem]"
            )}
            onMouseDown={(event) => event.stopPropagation()}
          >
            {children}
          </div>
        </div>
      )}
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
  onDuplicate,
  onMoveToGroup,
  onRemoveDate,
  onSetPlanningState,
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
  onDuplicate: () => void;
  onMoveToGroup: (groupId: string) => void;
  onRemoveDate?: () => void;
  onSetPlanningState?: (planningState: PlanningState) => void;
  onDelete: () => void;
  onRequestCreateGroup?: () => void;
}) {
  const hasDate = Boolean(task.scheduled_date);
  const planningState = normalizePlanningState(task.planning_state);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(
    null
  );
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
      onMoveSubmenuOpenChange(false);
      onPlanningSubmenuOpenChange(false);
    }, 250);
  }, [cancelSubmenuClose, onMoveSubmenuOpenChange, onPlanningSubmenuOpenChange]);

  useEffect(() => {
    return () => cancelSubmenuClose();
  }, [cancelSubmenuClose]);

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
      Math.min(left, window.innerWidth - popoverWidth - padding)
    );

    let top = rect.top;
    if (top + popoverHeight > window.innerHeight - padding) {
      top = rect.bottom - popoverHeight;
    }
    top = Math.max(
      padding,
      Math.min(top, window.innerHeight - popoverHeight - padding)
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
  const top = position?.top ?? (pointerPosition?.y ?? anchorRect?.top ?? 0);
  const left =
    position?.left ??
    (pointerPosition?.x ?? (anchorRect ? anchorRect.right + 6 : 0));

  return createPortal(
    <div
      ref={popoverRef}
      className="fixed z-[100] min-w-[10.5rem] overflow-visible rounded-lg border border-border/60 bg-popover p-1 text-popover-foreground shadow-lg"
      style={{ top, left }}
      onMouseEnter={cancelSubmenuClose}
      onMouseLeave={scheduleSubmenuClose}
    >
      <button
        type="button"
        onClick={onDuplicate}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted"
      >
        <Copy className="size-3.5" /> Duplicate
      </button>

      <div className="border-t border-border/40 pt-1">
        {hasDate && onRemoveDate ? (
          <button
            type="button"
            onClick={onRemoveDate}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted"
          >
            <CalendarDays className="size-3.5 text-muted-foreground" />
            Remove date
          </button>
        ) : null}

        {onSetPlanningState ? (
          <TaskDetailSubmenuRow
            label="Planning"
            icon={CalendarClock}
            open={planningSubmenuOpen}
            onOpenChange={onPlanningSubmenuOpenChange}
            onActivate={() => onMoveSubmenuOpenChange(false)}
            submenuClassName="min-w-[7.5rem]"
          >
            {PLANNING_STATES.map((state) => (
              <button
                key={state}
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  onSetPlanningState(state);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted",
                  planningState === state && "bg-muted font-medium text-foreground"
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
        onActivate={() => onPlanningSubmenuOpenChange(false)}
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
              onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              onClick={(event) => {
                event.stopPropagation();
                onRequestCreateGroup();
              }}
              className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
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
              onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              onClick={(event) => {
                event.stopPropagation();
                onMoveToGroup(group.id);
              }}
              className="flex w-full items-center rounded-md px-2 py-1.5 text-left hover:bg-muted"
            >
              <TaskGroupPill
                icon={appearance.icon}
                name={getGroupDisplayTitle(group, todayViewDate)}
                appearance={appearance}
                className="max-w-full text-[11px] [&_span:first-child]:text-xs"
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
        onClick={onDelete}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-destructive hover:bg-muted"
      >
        <Trash2 className="size-3.5" /> Delete
      </button>
    </div>,
    document.body
  );
}

function TaskNotificationPopover({
  task,
  notifyConfigured,
  anchorRef,
  popoverRef,
  onUpdate,
  openDatePickerInitially = false,
}: {
  task: Task;
  notifyConfigured: boolean;
  anchorRef: RefObject<HTMLDivElement | null>;
  popoverRef: RefObject<HTMLDivElement | null>;
  onUpdate: (updates: Partial<Task>) => void;
  openDatePickerInitially?: boolean;
}) {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(openDatePickerInitially);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(
    null
  );

  const dateInputValue = task.scheduled_date ?? "";
  const dateLabel = task.scheduled_date
    ? formatNotifyDateLabel(task.scheduled_date)
    : "Set date";
  const timeValue = toTimeInputValue(task.scheduled_time);
  const timeLabel = formatTimeShort(task.scheduled_time) ?? "Set time";

  const selectDate = useCallback(
    (dateKey: string) => {
      onUpdate({ scheduled_date: dateKey });
      setDatePickerOpen(false);
    },
    [onUpdate]
  );

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const popoverWidth = popoverRef.current?.offsetWidth ?? 232;
    const popoverHeight = popoverRef.current?.offsetHeight ?? 72;
    const gap = 4;
    const padding = 8;
    const toggleRowHeight = 32;

    let left = rect.right + gap;
    if (left + popoverWidth > window.innerWidth - padding) {
      left = rect.left - popoverWidth - gap;
    } else {
      // Keep the toggle row flush beside the bell; date/time extend left in the L.
      const toggleWidth =
        popoverRef.current?.querySelector<HTMLElement>("[data-notify-toggle]")
          ?.offsetWidth ?? 96;
      left = rect.right + gap - (popoverWidth - toggleWidth);
    }
    left = Math.max(
      padding,
      Math.min(left, window.innerWidth - popoverWidth - padding)
    );

    // Align the top toggle row with the bell icon center.
    let top = rect.top + rect.height / 2 - toggleRowHeight / 2;
    if (top + popoverHeight > window.innerHeight - padding) {
      top = window.innerHeight - popoverHeight - padding;
    }
    top = Math.max(
      padding,
      Math.min(top, window.innerHeight - popoverHeight - padding)
    );

    setPosition({ top, left });
  }, [anchorRef, popoverRef]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (openDatePickerInitially) {
      setDatePickerOpen(true);
    }
  }, [openDatePickerInitially]);

  useLayoutEffect(() => {
    updatePosition();
    const frame = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(frame);
  }, [
    updatePosition,
    task.notification_enabled,
    task.scheduled_date,
    task.scheduled_time,
    datePickerOpen,
  ]);

  useEffect(() => {
    if (!datePickerOpen) return;

    function handlePointerDown(event: globalThis.MouseEvent) {
      const target = event.target as Node;
      if (datePickerRef.current?.contains(target)) return;
      if (
        target instanceof Element &&
        target.closest("[data-notify-date-trigger]")
      ) {
        return;
      }
      setDatePickerOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [datePickerOpen]);

  useEffect(() => {
    if (!datePickerOpen) return;
    const frame = requestAnimationFrame(() => {
      dateInputRef.current?.showPicker?.();
    });
    return () => cancelAnimationFrame(frame);
  }, [datePickerOpen]);

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
  const left = position?.left ?? (anchorRect ? anchorRect.right + 6 : 0);

  return createPortal(
    <div
      ref={popoverRef}
      className="fixed z-[100] w-max"
      style={{ top, left }}
    >
      <div className="inline-flex flex-col items-end gap-1.5">
        <div
          data-notify-toggle
          className="flex h-8 w-max items-center gap-2.5 rounded-full bg-white px-3 shadow-md ring-1 ring-black/5"
        >
          {task.notification_enabled ? (
            <Bell
              className={cn(
                "size-3.5 shrink-0 text-foreground",
                notifyConfigured && "fill-foreground/10"
              )}
            />
          ) : (
            <NotificationBellOffIcon className="text-muted-foreground" />
          )}
          <Switch
            checked={task.notification_enabled}
            onCheckedChange={(checked) =>
              onUpdate({ notification_enabled: checked })
            }
            aria-label="Toggle notification"
          />
        </div>

        <div className="flex w-max gap-1.5">
          <div className="relative">
            <button
              type="button"
              data-notify-date-trigger
              onClick={() => setDatePickerOpen((value) => !value)}
              className={cn(
                "flex h-8 min-w-[6.75rem] items-center gap-1.5 rounded-full bg-white px-2.5 shadow-md ring-1 ring-black/5 hover:bg-neutral-50",
                !task.scheduled_date && "text-muted-foreground"
              )}
            >
              <CalendarDays className="size-3.5 shrink-0 text-muted-foreground" />
              <span
                className={cn(
                  "truncate text-xs font-medium",
                  task.scheduled_date ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {dateLabel}
              </span>
            </button>

            {datePickerOpen && (
              <div
                ref={datePickerRef}
                className="absolute left-0 top-full z-[110] mt-1.5 w-[15.5rem] overflow-hidden rounded-xl border border-border/60 bg-white p-2 shadow-lg ring-1 ring-black/5"
              >
                <div className="flex items-center justify-center gap-2 border-b border-border/40 pb-2 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => selectDate(getTodayDateString())}
                    className="text-foreground hover:underline"
                  >
                    Today
                  </button>
                  <span className="text-muted-foreground">|</span>
                  <button
                    type="button"
                    onClick={() => selectDate(getTomorrowDateString())}
                    className="text-foreground hover:underline"
                  >
                    Tomorrow
                  </button>
                </div>
                <input
                  ref={dateInputRef}
                  type="date"
                  value={dateInputValue}
                  onChange={(event) => {
                    const nextDate = event.target.value || null;
                    onUpdate({ scheduled_date: nextDate });
                    if (nextDate) {
                      setDatePickerOpen(false);
                    }
                  }}
                  className="mt-2 w-full rounded-md border border-border/50 bg-white px-2 py-1.5 text-xs text-foreground outline-none focus:border-primary/40"
                />
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => timeInputRef.current?.showPicker?.()}
              className="flex h-8 min-w-[6.25rem] items-center gap-1 rounded-full bg-white px-2.5 shadow-md ring-1 ring-black/5 hover:bg-neutral-50"
            >
              <span className="flex-1 truncate text-left text-xs font-medium text-foreground">
                {timeLabel}
              </span>
              <ChevronDown className="size-3 shrink-0 text-muted-foreground" />
              <input
                ref={timeInputRef}
                type="time"
                value={timeValue}
                onChange={(event) =>
                  onUpdate({
                    scheduled_time: event.target.value
                      ? `${event.target.value}:00`
                      : null,
                  })
                }
                className="sr-only"
                tabIndex={-1}
              />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export const TaskRow = memo(function TaskRow({
  task,
  groups,
  todayViewDate,
  isSelected = false,
  dragEnabled = true,
  reorderEnabled = true,
  reorderDisabledTooltip = "Switch to Manual sorting to reorder tasks.",
  onPointerDragStart,
  onPointerDragEnd,
  onToggleComplete,
  onOpenDetail,
  onDuplicate,
  onMoveToGroup,
  onDelete,
  onUpdate,
  onSetPlanningState,
  onRequestCreateGroup,
}: TaskRowProps) {
  const [detailMenuOpen, setDetailMenuOpen] = useState(false);
  const [flagMenuOpen, setFlagMenuOpen] = useState(false);
  const [moveSubmenuOpen, setMoveSubmenuOpen] = useState(false);
  const [planningSubmenuOpen, setPlanningSubmenuOpen] = useState(false);
  const [durationOpen, setDurationOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [openDatePickerOnNotify, setOpenDatePickerOnNotify] = useState(false);
  const detailPopoverRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const contextMenuPointRef = useRef<{ x: number; y: number } | null>(null);
  const flagAnchorRef = useRef<HTMLDivElement>(null);
  const flagPopoverRef = useRef<HTMLDivElement>(null);
  const notifyAnchorRef = useRef<HTMLDivElement>(null);
  const notifyPopoverRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [titleDraft, setTitleDraft] = useState(task.title);
  const priority = normalizeTaskPriority(task.priority);
  const moveTargets = useMemo(
    () => uniqueMoveTargets(groups, task.group_id),
    [groups, task.group_id]
  );

  const notifyConfigured =
    task.notification_enabled &&
    Boolean(task.scheduled_date) &&
    Boolean(task.scheduled_time);

  const scheduleLabel = formatTaskScheduleCompact(task);
  const isCompleted = task.completed;
  const hasDuration = Boolean(task.duration_minutes && task.duration_minutes > 0);
  const durationLabel = hasDuration
    ? formatDurationMinutes(task.duration_minutes!)
    : null;
  const metaPrimary = scheduleLabel ?? durationLabel;
  const showDurationBesideSchedule = Boolean(scheduleLabel && durationLabel);

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

  const rowPointerGesture = useTaskRowPointerGesture({
    dragEnabled,
    gestureEnabled: !isRenaming,
    isInteractiveTarget: isTaskDragInteractiveTarget,
    onOpenDetail,
    onPointerDragStart,
    onPointerDragEnd,
  });

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

  function handleTitleDoubleClick(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setTitleDraft(task.title);
    setIsRenaming(true);
  }

  useEffect(() => {
    if (!notifyOpen) return;

    function handlePointerDown(event: globalThis.MouseEvent) {
      const target = event.target as Node;
      if (notifyAnchorRef.current?.contains(target)) return;
      if (notifyPopoverRef.current?.contains(target)) return;
      setNotifyOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [notifyOpen]);

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
    setDetailMenuOpen(false);
    contextMenuPointRef.current = null;
    setMoveSubmenuOpen(false);
  }, []);

  useEffect(() => {
    if (!detailMenuOpen) return;

    function handlePointerDown(event: globalThis.MouseEvent) {
      const target = event.target as Node;
      if (detailPopoverRef.current?.contains(target)) return;
      if (
        target instanceof Element &&
        target.closest("[data-task-move-submenu]")
      ) {
        return;
      }
      closeDetailMenu();
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [closeDetailMenu, detailMenuOpen]);

  function handleContextMenu(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    setFlagMenuOpen(false);
    setNotifyOpen(false);
    contextMenuPointRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
    setDetailMenuOpen(true);
  }

  return (
    <div
      ref={rowRef}
      data-task-row={task.id}
      onPointerDown={rowPointerGesture.onPointerDown}
      onPointerMove={rowPointerGesture.onPointerMove}
      onPointerUp={rowPointerGesture.onPointerUp}
      onPointerCancel={rowPointerGesture.onPointerCancel}
      onContextMenu={handleContextMenu}
      title={
        dragEnabled && !reorderEnabled ? reorderDisabledTooltip : undefined
      }
      className={cn(
        "group relative mx-0.5 flex min-w-0 select-none items-center gap-0 rounded-md border border-transparent py-1 pl-0.5 pr-0.5 transition-[background-color,box-shadow,transform,border-color] duration-150",
        dragEnabled && "cursor-grab hover:-translate-y-px hover:border-border/40 hover:bg-muted/40 hover:shadow-sm",
        notifyOpen && "z-20",
        detailMenuOpen && "z-20",
        flagMenuOpen && "z-20",
        isSelected &&
          "bg-sky-50/55 shadow-[inset_0_0_0_1px_rgba(14,165,233,0.18)] dark:bg-sky-500/10",
        isCompleted && "opacity-[0.45] transition-opacity hover:opacity-[0.62]"
      )}
    >
      <button
        type="button"
        data-no-task-drag
        onPointerDown={(event) => event.stopPropagation()}
        onClick={onToggleComplete}
        className="flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
        aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
      >
        {isCompleted ? (
          <CheckCircle2 className="size-3.5 fill-emerald-500/12 text-emerald-600" />
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
              "min-w-0 rounded border border-primary/30 bg-background px-1 py-0 font-[520] text-foreground outline-none ring-primary/20 select-text focus:ring-1",
              isCompleted
                ? "text-[13px] leading-[16px]"
                : "text-sm leading-[18px]",
              isCompleted && "line-through"
            )}
            aria-label="Rename task"
          />
        ) : (
          <div
            onDoubleClick={handleTitleDoubleClick}
            className={cn(
              "flex min-w-0 w-full flex-1 flex-col items-start gap-px px-1 text-left",
              dragEnabled && "cursor-grab active:cursor-grabbing"
            )}
            title={task.title}
          >
            <span
              className={cn(
                "min-w-0 w-full truncate font-[520] text-foreground",
                isCompleted
                  ? "text-[13px] leading-[16px]"
                  : "text-sm leading-[18px]",
                isCompleted && "line-through"
              )}
            >
              {task.title || "Untitled"}
            </span>
            {metaPrimary ? (
              <span
                className={cn(
                  "flex w-full min-w-0 items-center justify-between gap-2 font-normal tabular-nums",
                  isCompleted
                    ? "text-[9px] leading-[10px] text-muted-foreground/70"
                    : "text-[10px] leading-[11px] text-muted-foreground/80"
                )}
              >
                <span className="min-w-0 truncate">{metaPrimary}</span>
                {showDurationBesideSchedule ? (
                  <span className="shrink-0 text-muted-foreground/65">
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
            : "opacity-0 group-hover:opacity-100"
        )}
      >
        <TaskDurationPicker
          variant="task-row"
          durationMinutes={task.duration_minutes}
          onChange={(minutes) => onUpdate({ duration_minutes: minutes })}
          onOpenChange={setDurationOpen}
        />
      </div>

      <div ref={flagAnchorRef} data-no-task-drag className="relative shrink-0">
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => setFlagMenuOpen((value) => !value)}
          className="flex size-6 items-center justify-center rounded hover:bg-muted/80"
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

      <div
        ref={notifyAnchorRef}
        data-no-task-drag
        className={cn(
          "relative size-6 shrink-0 transition-opacity",
          notifyConfigured || notifyOpen
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100"
        )}
      >
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => {
            setOpenDatePickerOnNotify(false);
            setNotifyOpen((value) => !value);
          }}
          className={cn(
            "absolute inset-0 flex items-center justify-center rounded hover:bg-muted/80",
            notifyOpen && "bg-muted/80",
            !task.notification_enabled && "text-muted-foreground/70",
            task.notification_enabled && !notifyConfigured && "text-muted-foreground",
            notifyConfigured && "text-foreground"
          )}
          aria-label="Notification settings"
          aria-expanded={notifyOpen}
        >
          {task.notification_enabled ? (
            <Bell
              className={cn("size-3.5", notifyConfigured && "fill-foreground/10")}
            />
          ) : (
            <NotificationBellOffIcon />
          )}
        </button>

        {notifyOpen && (
          <TaskNotificationPopover
            task={task}
            notifyConfigured={notifyConfigured}
            anchorRef={notifyAnchorRef}
            popoverRef={notifyPopoverRef}
            openDatePickerInitially={openDatePickerOnNotify}
            onUpdate={onUpdate}
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
          onDuplicate={() => {
            closeDetailMenu();
            onDuplicate();
          }}
          onRemoveDate={
            task.scheduled_date
              ? () => {
                  closeDetailMenu();
                  onUpdate({
                    scheduled_date: null,
                  });
                }
              : undefined
          }
          onSetPlanningState={
            onSetPlanningState
              ? (planningState) => {
                  closeDetailMenu();
                  onSetPlanningState(planningState);
                }
              : undefined
          }
          onMoveToGroup={(groupId) => {
            closeDetailMenu();
            onMoveToGroup(groupId);
          }}
          onDelete={() => {
            closeDetailMenu();
            onDelete();
          }}
          onRequestCreateGroup={
            onRequestCreateGroup
              ? () => {
                  closeDetailMenu();
                  onRequestCreateGroup();
                }
              : undefined
          }
        />
      )}
    </div>
  );
});
