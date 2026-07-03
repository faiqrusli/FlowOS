"use client";

import { memo, useCallback, type DragEvent, type MouseEvent } from "react";
import { Check } from "lucide-react";
import { TaskDurationPicker } from "@/components/tasks/task-duration-picker";
import { TaskGroupPill } from "@/components/tasks/task-group-pill";
import { TaskPriorityFlagIcon } from "@/components/tasks/task-priority-flag-icon";
import { formatTaskFocusSchedule } from "@/lib/task-focus-display";
import {
  getTaskGroupAppearance,
  getTaskGroupTimelinePillClass,
} from "@/lib/task-group-appearance";
import { getWorkplaceGroupAccentClass } from "@/lib/workplace-group-accent";
import { normalizeTaskPriority } from "@/lib/task-priority";
import { setActiveTaskDragId, setBoardTaskDragData } from "@/lib/timeline-drag";
import { setDragImageFromElement } from "@/lib/list-drag-utils";
import { cn } from "@/lib/utils";
import type { Task, TaskGroupWithTasks } from "@/types/task";

type WorkplaceCompactTaskRowProps = {
  task: Task;
  groups: TaskGroupWithTasks[];
  onOpenDetail: () => void;
  onToggleComplete: () => void;
  onUpdateDuration?: (minutes: number | null) => void;
  onContextMenu?: (event: MouseEvent<HTMLDivElement>) => void;
};

function resolveTaskGroup(task: Task, groups: TaskGroupWithTasks[]) {
  if (!task.group_id) return null;
  return groups.find((group) => group.id === task.group_id) ?? null;
}

export const WorkplaceCompactTaskRow = memo(function WorkplaceCompactTaskRow({
  task,
  groups,
  onOpenDetail,
  onToggleComplete,
  onUpdateDuration,
  onContextMenu,
}: WorkplaceCompactTaskRowProps) {
  const group = resolveTaskGroup(task, groups);
  const appearance = group ? getTaskGroupAppearance(group) : null;
  const priority = normalizeTaskPriority(task.priority);
  const accentClass = appearance
    ? getWorkplaceGroupAccentClass(appearance.colorKey)
    : null;
  const scheduleLabel = formatTaskFocusSchedule(task);

  const handleDragStart = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      setBoardTaskDragData(event, task.id);
      event.dataTransfer.effectAllowed = "move";
      setDragImageFromElement(event, event.currentTarget, 12, 12);
    },
    [task.id]
  );

  const handleDragEnd = useCallback(() => {
    setActiveTaskDragId(null);
  }, []);

  return (
    <div
      draggable={!task.completed}
      onDragStart={task.completed ? undefined : handleDragStart}
      onDragEnd={handleDragEnd}
      onContextMenu={onContextMenu}
      className={cn(
        "flex items-center gap-1.5 rounded-md border border-border/45 bg-muted/25 px-1.5 py-1 transition-[background-color,border-color] duration-150 hover:border-border/70 hover:bg-muted/45",
        !task.completed && "cursor-grab active:cursor-grabbing",
        task.completed && "cursor-default opacity-70 hover:bg-muted/25",
        accentClass && "border-l-2",
        accentClass
      )}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onToggleComplete();
        }}
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
          task.completed
            ? "border-foreground bg-foreground text-background"
            : "border-muted-foreground/35 hover:border-foreground/55"
        )}
        aria-label={`Mark "${task.title}" complete`}
      >
        {task.completed ? (
          <Check className="size-2.5" strokeWidth={3} />
        ) : null}
      </button>

      <TaskPriorityFlagIcon priority={priority} className="size-3.5 shrink-0" />

      <button
        type="button"
        onClick={onOpenDetail}
        className={cn(
          "min-w-0 flex-1 truncate text-left text-[14px] font-medium leading-none text-foreground hover:underline",
          task.completed && "line-through opacity-60"
        )}
      >
        {task.title}
      </button>

      {onUpdateDuration && !task.scheduled_time ? (
        <div className="flex shrink-0 items-center gap-1">
          {group && appearance ? (
            <TaskGroupPill
              icon={appearance.icon}
              name={group.title}
              appearance={{
                pillClassName: getTaskGroupTimelinePillClass(appearance.colorKey),
              }}
              className="max-w-[5rem] shrink-0 px-1.5 py-0 text-[11px]"
            />
          ) : null}
          <TaskDurationPicker
            variant="timeline"
            compact
            durationMinutes={task.duration_minutes}
            onChange={onUpdateDuration}
          />
        </div>
      ) : (
        <div className="flex shrink-0 items-center gap-1">
          {group && appearance ? (
            <TaskGroupPill
              icon={appearance.icon}
              name={group.title}
              appearance={{
                pillClassName: getTaskGroupTimelinePillClass(appearance.colorKey),
              }}
              className="max-w-[5rem] shrink-0 px-1.5 py-0 text-[11px]"
            />
          ) : null}
          <span className="shrink-0 text-[13px] tabular-nums text-muted-foreground/80">
            {scheduleLabel}
          </span>
        </div>
      )}
    </div>
  );
});
