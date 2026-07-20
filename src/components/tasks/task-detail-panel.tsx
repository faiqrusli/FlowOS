"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  CalendarDays,
  CalendarClock,
  Check,
  ClipboardList,
  Clock,
  Flag,
  Folder,
  ListPlus,
  type LucideIcon,
} from "lucide-react";
import {
  GlobalAccessPanel,
  GLOBAL_ACCESS_PANEL_COLLAPSED_WIDTH_PX,
  GLOBAL_ACCESS_PANEL_WIDTH_PX,
} from "@/components/layout/global-access-panel";
import { Input } from "@/components/ui/input";
import {
  ScheduleDatePickerField,
  ScheduleTimePickerField,
} from "@/components/ui/schedule-picker-field";
import { Label } from "@/components/ui/label";
import { TaskAlertBeforePicker } from "@/components/tasks/task-alert-before-picker";
import { TaskDurationPicker } from "@/components/tasks/task-duration-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { TaskPriorityPicker } from "@/components/tasks/task-priority-picker";
import { TaskGroupPicker } from "@/components/tasks/task-group-picker";
import {
  normalizePlanningState,
  PLANNING_INTRO,
  PLANNING_STATE_CONFIG,
  PLANNING_STATES,
  PLAN_SECTION_LABEL,
} from "@/lib/task-planning";
import { appendTaskToNextUp, isEligibleForNextUp } from "@/lib/task-next-up";
import { cn } from "@/lib/utils";
import {
  drawerWritingFieldClass,
  surfaceInsetControlClass,
  compactControlChipActiveClass,
  compactControlChipClass,
  compactControlChipInactiveClass,
} from "@/lib/theme/surface-classes";
import type { PlanningState, Task, TaskGroupWithTasks } from "@/types/task";

const DETAIL_PANEL_WIDTH_PX = GLOBAL_ACCESS_PANEL_WIDTH_PX;
const DETAIL_PANEL_COLLAPSED_WIDTH_PX = GLOBAL_ACCESS_PANEL_COLLAPSED_WIDTH_PX;

export { DETAIL_PANEL_WIDTH_PX, DETAIL_PANEL_COLLAPSED_WIDTH_PX };

/** Keeps typing stable when a stale server sync arrives mid-edit. */
function useTaskWritingField(taskId: string, serverValue: string) {
  const [value, setValue] = useState(serverValue);
  const focusedRef = useRef(false);

  useEffect(() => {
    setValue(serverValue);
    focusedRef.current = false;
  }, [taskId]);

  useEffect(() => {
    if (!focusedRef.current) {
      setValue(serverValue);
    }
  }, [serverValue]);

  return {
    value,
    onFocus: () => {
      focusedRef.current = true;
    },
    onBlur: () => {
      focusedRef.current = false;
    },
    setValue,
  };
}

type TaskDetailPanelProps = {
  task: Task | null;
  groups: TaskGroupWithTasks[];
  todayViewDate: string;
  expanded: boolean;
  onToggleExpanded: () => void;
  onChange: (updates: Partial<Task>) => void;
  onMoveToGroup: (groupId: string) => void;
  onPlanningStateChange?: (planningState: PlanningState) => void;
};

function PropertyLabel({
  icon: Icon,
  htmlFor,
  children,
}: {
  icon: LucideIcon;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <Label
      htmlFor={htmlFor}
      className="flow-type-label gap-1.5 text-[11px]"
    >
      <Icon
        className="size-3.5 shrink-0 text-muted-foreground"
        aria-hidden
      />
      {children}
    </Label>
  );
}

function PlanningInfoMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex shrink-0 items-center justify-center rounded-sm px-0.5 text-[11px] leading-none text-muted-foreground hover:bg-surface-hover/80 hover:text-foreground"
        aria-label={`About ${PLAN_SECTION_LABEL.toLowerCase()}`}
      >
        ⓘ
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        className="w-64 rounded-xl p-3"
      >
        <p className="text-xs leading-snug text-muted-foreground">
          {PLANNING_INTRO}
        </p>
        <ul className="mt-2 space-y-1.5 text-xs leading-snug text-muted-foreground">
          {PLANNING_STATES.map((state) => {
            const config = PLANNING_STATE_CONFIG[state];
            return (
              <li key={state}>
                <span className="font-medium text-foreground">
                  {config.label}:
                </span>{" "}
                {config.description}
              </li>
            );
          })}
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TaskDetailEmptyState() {
  return (
    <div className="flex h-full min-h-[12rem] flex-col items-center justify-center px-5 py-8 text-center">
      <ClipboardList
        className="mb-3 size-8 text-muted-foreground/35"
        aria-hidden
      />
      <p className="text-sm font-medium text-foreground/85">No task selected</p>
      <p className="mt-1.5 max-w-[14rem] text-xs leading-relaxed text-muted-foreground">
        Click a task on the board to view and edit its details here.
      </p>
    </div>
  );
}

export function TaskDetailFields({
  task,
  groups,
  todayViewDate,
  onChange,
  onMoveToGroup,
  onPlanningStateChange,
  onToggleComplete,
}: {
  task: Task;
  groups: TaskGroupWithTasks[];
  todayViewDate: string;
  onChange: (updates: Partial<Task>) => void;
  onMoveToGroup: (groupId: string) => void;
  onPlanningStateChange?: (planningState: PlanningState) => void;
  onToggleComplete?: () => void;
}) {
  const planningState = normalizePlanningState(task.planning_state);
  const [addingToNextUp, setAddingToNextUp] = useState(false);
  const [addedTaskId, setAddedTaskId] = useState<string | null>(null);
  const addedToNextUp = task.queue_order !== null || addedTaskId === task.id;
  const canAddToNextUp = isEligibleForNextUp(task) && !addedToNextUp;
  const titleField = useTaskWritingField(task.id, task.title);
  const descriptionField = useTaskWritingField(task.id, task.description ?? "");

  const handleAddToNextUp = async () => {
    if (!canAddToNextUp) return;
    setAddingToNextUp(true);
    try {
      await appendTaskToNextUp(task.id);
      setAddedTaskId(task.id);
    } finally {
      setAddingToNextUp(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 px-5 py-4">
      <div className="flex items-center gap-2">
        {onToggleComplete ? (
          <button
            type="button"
            onClick={onToggleComplete}
            className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
              task.completed
                ? "border-foreground bg-foreground text-background"
                : "border-muted-foreground/40 hover:border-foreground/60 hover:bg-surface-hover",
            )}
            aria-label={
              task.completed
                ? `Mark "${task.title}" incomplete`
                : `Mark "${task.title}" complete`
            }
          >
            {task.completed ? (
              <Check className="size-2.5" strokeWidth={3} />
            ) : null}
          </button>
        ) : null}
        <Input
          id="task-detail-title"
          value={titleField.value}
          onFocus={titleField.onFocus}
          onBlur={titleField.onBlur}
          onChange={(event) => {
            titleField.setValue(event.target.value);
            onChange({ title: event.target.value });
          }}
          aria-label="Task title"
          className={cn(
            "h-9 min-w-0 flex-1 text-[15px] font-semibold tracking-tight",
            surfaceInsetControlClass,
          )}
        />
        {canAddToNextUp || addedToNextUp ? (
          <button
            type="button"
            onClick={() => void handleAddToNextUp()}
            disabled={!canAddToNextUp || addingToNextUp}
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-border-subtle bg-control-default px-2.5 text-xs font-medium text-foreground transition-colors",
              "hover:bg-control-hover focus-visible:bg-control-hover focus-visible:ring-1 focus-visible:ring-ring/40",
              "disabled:cursor-default disabled:opacity-60",
              addedToNextUp && "text-muted-foreground",
            )}
          >
            <ListPlus className="size-3.5" />
            {addedToNextUp ? "In Next Up" : "Add to Queue"}
          </button>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="task-detail-description"
          className="flow-type-label text-[11px]"
        >
          Description
        </Label>
        <Textarea
          id="task-detail-description"
          value={descriptionField.value}
          rows={4}
          className={cn(
            "field-sizing-fixed resize-none overflow-y-auto",
            drawerWritingFieldClass,
          )}
          onFocus={descriptionField.onFocus}
          onBlur={descriptionField.onBlur}
          onChange={(event) => {
            descriptionField.setValue(event.target.value);
            onChange({ description: event.target.value });
          }}
          placeholder="Add notes..."
        />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="min-w-0 space-y-1.5">
          <PropertyLabel icon={Folder}>Group</PropertyLabel>
          <TaskGroupPicker
            groups={groups}
            currentGroupId={task.group_id}
            todayViewDate={todayViewDate}
            onSelect={onMoveToGroup}
          />
        </div>

        <div className="min-w-0 space-y-1.5">
          <PropertyLabel icon={Flag}>Priority</PropertyLabel>
          <TaskPriorityPicker
            priority={task.priority}
            onSelect={(priority) => onChange({ priority })}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-1">
          <PropertyLabel icon={CalendarClock}>
            {PLAN_SECTION_LABEL}
          </PropertyLabel>
          <PlanningInfoMenu />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PLANNING_STATES.map((state) => {
            const config = PLANNING_STATE_CONFIG[state];
            const active = planningState === state;
            return (
              <button
                key={state}
                type="button"
                onClick={() => onPlanningStateChange?.(state)}
                className={cn(
                  compactControlChipClass,
                  active
                    ? compactControlChipActiveClass
                    : compactControlChipInactiveClass,
                )}
                title={config.description}
              >
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="space-y-1.5">
          <PropertyLabel icon={CalendarDays} htmlFor="task-detail-date">
            Date
          </PropertyLabel>
          <ScheduleDatePickerField
            id="task-detail-date"
            value={task.scheduled_date ?? null}
            onChange={(dateKey) => onChange({ scheduled_date: dateKey })}
          />
        </div>
        <div className="space-y-1.5">
          <PropertyLabel icon={Clock} htmlFor="task-detail-time">
            Time
          </PropertyLabel>
          <ScheduleTimePickerField
            id="task-detail-time"
            value={task.scheduled_time}
            onChange={(time) => onChange({ scheduled_time: time })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="space-y-1.5">
          <PropertyLabel icon={Clock} htmlFor="task-detail-duration">
            Duration
          </PropertyLabel>
          <TaskDurationPicker
            variant="detail"
            durationMinutes={task.duration_minutes}
            onChange={(minutes) => onChange({ duration_minutes: minutes })}
            className="w-full"
          />
        </div>

        <div className="space-y-1.5">
          <PropertyLabel icon={Bell} htmlFor="task-detail-alert-before">
            Alert before
          </PropertyLabel>
          <TaskAlertBeforePicker
            variant="detail"
            notificationEnabled={task.notification_enabled}
            leadMinutes={task.notification_lead_minutes}
            onChange={onChange}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

export function TaskDetailPanel({
  task,
  groups,
  todayViewDate,
  expanded,
  onToggleExpanded,
  onChange,
  onMoveToGroup,
  onPlanningStateChange,
}: TaskDetailPanelProps) {
  return (
    <GlobalAccessPanel
      icon={ClipboardList}
      title="Task details"
      expanded={expanded}
      onToggleExpanded={onToggleExpanded}
      emptyState={<TaskDetailEmptyState />}
    >
      {task ? (
        <TaskDetailFields
          task={task}
          groups={groups}
          todayViewDate={todayViewDate}
          onChange={onChange}
          onMoveToGroup={onMoveToGroup}
          onPlanningStateChange={onPlanningStateChange}
        />
      ) : null}
    </GlobalAccessPanel>
  );
}
