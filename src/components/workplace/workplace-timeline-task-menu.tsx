"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import {
  CalendarClock,
  CalendarDays,
  Check,
  ClipboardList,
  Clock,
  Play,
  Trash2,
} from "lucide-react";
import { TaskGroupPill } from "@/components/tasks/task-group-pill";
import { Button } from "@/components/ui/button";
import {
  formatTimeShort,
  parseTimeToMinutes,
} from "@/lib/date-utils";
import { getTaskGroupAppearance } from "@/lib/task-group-appearance";
import {
  getTaskDurationMinutes,
  minutesToTimeString,
} from "@/lib/timeline-layout";
import type { Task, TaskGroupWithTasks } from "@/types/task";

const MENU_ARROW_PX = 10;
const MENU_GAP_PX = 8;
const MENU_ESTIMATED_WIDTH_PX = 272;

type WorkplaceTimelineTaskMenuProps = {
  menuRef: RefObject<HTMLDivElement | null>;
  task: Task;
  groups: TaskGroupWithTasks[];
  anchorRect: DOMRect;
  onClose: () => void;
  onOpenDetail: () => void;
  onClearTime?: () => void;
  onStartFocus: () => void;
  onMoveToTomorrow: () => void;
  onPlanLater: () => void;
  onToggleComplete: () => void;
  onDelete: () => void;
};

function resolveTaskGroup(task: Task, groups: TaskGroupWithTasks[]) {
  if (!task.group_id) return null;
  return groups.find((group) => group.id === task.group_id) ?? null;
}

function formatTaskTimeRange(task: Task): string | null {
  if (!task.scheduled_time) return null;
  const start = parseTimeToMinutes(task.scheduled_time);
  const end = start + getTaskDurationMinutes(task);
  const startLabel =
    formatTimeShort(`${minutesToTimeString(start)}:00`) ??
    minutesToTimeString(start);
  const endLabel =
    formatTimeShort(`${minutesToTimeString(end)}:00`) ??
    minutesToTimeString(end);
  return `${startLabel} – ${endLabel}`;
}

function useWorkplaceAnchoredMenuPosition(
  anchorRect: DOMRect,
  menuRef: RefObject<HTMLDivElement | null>
) {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    arrowTop: 16,
  });

  const updatePosition = useCallback(() => {
    const menu = menuRef.current;
    const menuWidth = menu?.offsetWidth ?? MENU_ESTIMATED_WIDTH_PX;
    const menuHeight = menu?.offsetHeight ?? 180;
    const padding = 8;

    let left = anchorRect.left - menuWidth - MENU_ARROW_PX - MENU_GAP_PX;
    let top = anchorRect.top;

    left = Math.max(padding, left);
    top = Math.max(
      padding,
      Math.min(top, window.innerHeight - menuHeight - padding)
    );

    const taskCenterY = anchorRect.top + anchorRect.height / 2;
    const arrowTop = Math.min(
      Math.max(12, taskCenterY - top),
      menuHeight - 20
    );

    setPosition({ left, top, arrowTop });
  }, [anchorRect, menuRef]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    updatePosition();
    const frame = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(frame);
  }, [updatePosition]);

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

export function WorkplaceTimelineTaskMenu({
  menuRef,
  task,
  groups,
  anchorRect,
  onClose,
  onOpenDetail,
  onClearTime,
  onStartFocus,
  onMoveToTomorrow,
  onPlanLater,
  onToggleComplete,
  onDelete,
}: WorkplaceTimelineTaskMenuProps) {
  const { mounted, position } = useWorkplaceAnchoredMenuPosition(
    anchorRect,
    menuRef
  );
  const group = resolveTaskGroup(task, groups);
  const groupAppearance = group ? getTaskGroupAppearance(group) : null;
  const timeRange = formatTaskTimeRange(task);
  const completed = task.completed;

  if (!mounted) return null;

  return createPortal(
    <>
      <button
        type="button"
        className="fixed inset-0 z-[99] cursor-default bg-transparent"
        aria-label="Close menu"
        onClick={onClose}
      />
      <div
        ref={menuRef}
        data-timeline-context-menu
        className="flow-surface-elevated fixed z-[100] w-[17rem] overflow-visible rounded-xl"
        style={{ left: position.left, top: position.top }}
        onClick={(event) => event.stopPropagation()}
      >
        <span
          className="pointer-events-none absolute -right-[9px] size-0 border-y-[9px] border-l-[9px] border-y-transparent border-l-popover drop-shadow-sm"
          style={{ top: position.arrowTop }}
          aria-hidden
        />
        <span
          className="pointer-events-none absolute -right-[10px] size-0 border-y-[10px] border-l-[10px] border-y-transparent border-l-border/50"
          style={{ top: position.arrowTop - 1 }}
          aria-hidden
        />

        <div className="flex items-start justify-between gap-2 border-b border-border/30 px-3 py-2.5">
          <p className="min-w-0 flex-1 text-sm font-semibold leading-snug text-foreground">
            {task.title}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
            onClick={onDelete}
            aria-label="Delete task"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>

        <div className="space-y-2 px-3 py-2.5 text-[13px] text-muted-foreground">
          {timeRange ? (
            <div className="flex items-center gap-2">
              <Clock className="size-3.5 shrink-0" />
              <span>{timeRange}</span>
            </div>
          ) : null}
          {group && groupAppearance ? (
            <div className="flex items-center gap-2">
              <CalendarDays className="size-3.5 shrink-0" />
              <TaskGroupPill
                icon={groupAppearance.icon}
                name={group.title}
                appearance={groupAppearance}
                className="max-w-full"
              />
            </div>
          ) : null}
        </div>

        <div className="border-t border-border/30 p-1">
          {!completed && onClearTime ? (
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-muted"
              onClick={onClearTime}
            >
              <Clock className="size-3.5 shrink-0 text-muted-foreground" />
              Unschedule
            </button>
          ) : null}
          {!completed ? (
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-muted"
              onClick={onStartFocus}
            >
              <Play className="size-3.5 shrink-0" />
              Start focus
            </button>
          ) : null}
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-muted"
            onClick={onOpenDetail}
          >
            <ClipboardList className="size-3.5 shrink-0 text-muted-foreground" />
            Open details
          </button>
          {!completed ? (
            <>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-muted"
                onClick={onMoveToTomorrow}
              >
                <CalendarDays className="size-3.5 shrink-0 text-muted-foreground" />
                Move to tomorrow
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-muted"
                onClick={onPlanLater}
              >
                <CalendarClock className="size-3.5 shrink-0 text-muted-foreground" />
                Plan later
              </button>
            </>
          ) : null}
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-muted"
            onClick={onToggleComplete}
          >
            <Check className="size-3.5 shrink-0 text-muted-foreground" />
            {completed ? "Mark incomplete" : "Mark complete"}
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
