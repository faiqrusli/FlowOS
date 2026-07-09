"use client";

import type { LucideIcon } from "lucide-react";
import {
  Bell,
  CalendarDays,
  CalendarClock,
  Check,
  ClipboardList,
  Clock,
  Flag,
  Folder,
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
import { cn } from "@/lib/utils";
import {
  drawerCardClass,
  drawerCardStackClass,
  drawerWritingFieldClass,
} from "@/lib/theme/surface-classes";
import type { PlanningState, Task, TaskGroupWithTasks } from "@/types/task";

const DETAIL_PANEL_WIDTH_PX = GLOBAL_ACCESS_PANEL_WIDTH_PX;
const DETAIL_PANEL_COLLAPSED_WIDTH_PX = GLOBAL_ACCESS_PANEL_COLLAPSED_WIDTH_PX;

export { DETAIL_PANEL_WIDTH_PX, DETAIL_PANEL_COLLAPSED_WIDTH_PX };

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
      className="gap-1.5 text-xs font-medium text-muted-foreground"
    >
      <Icon className="size-3.5 shrink-0 text-muted-foreground/80" aria-hidden />
      {children}
    </Label>
  );
}

function PlanningInfoMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex shrink-0 items-center justify-center rounded-sm px-0.5 text-[11px] leading-none text-muted-foreground hover:bg-muted/80 hover:text-foreground"
        aria-label={`About ${PLAN_SECTION_LABEL.toLowerCase()}`}
      >
        ⓘ
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        className="w-64 rounded-xl p-3"
      >
        <p className="text-xs leading-snug text-muted-foreground">{PLANNING_INTRO}</p>
        <ul className="mt-2 space-y-1.5 text-xs leading-snug text-muted-foreground">
          {PLANNING_STATES.map((state) => {
            const config = PLANNING_STATE_CONFIG[state];
            return (
              <li key={state}>
                <span className="font-medium text-foreground">{config.label}:</span>{" "}
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
    <div className="flex h-full min-h-[12rem] flex-col items-center justify-center px-4 py-8 text-center">
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

  return (
    <div className={drawerCardStackClass}>
      <section className={drawerCardClass} aria-label="Task">
        <div className="flex items-center gap-2">
          {onToggleComplete ? (
            <button
              type="button"
              onClick={onToggleComplete}
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                task.completed
                  ? "border-foreground bg-foreground text-background"
                  : "border-muted-foreground/35 hover:border-foreground/55"
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
            value={task.title}
            onChange={(event) => onChange({ title: event.target.value })}
            aria-label="Task title"
            className="min-w-0 flex-1"
          />
        </div>

        <div className="mt-3 space-y-1.5">
          <Label
            htmlFor="task-detail-description"
            className="text-xs text-muted-foreground"
          >
            Description
          </Label>
          <Textarea
            id="task-detail-description"
            value={task.description ?? ""}
            rows={4}
            className={cn(
              "field-sizing-fixed resize-none overflow-y-auto",
              drawerWritingFieldClass
            )}
            onChange={(event) => onChange({ description: event.target.value })}
            placeholder="Add notes..."
          />
        </div>
      </section>

      <section className={drawerCardClass} aria-label="Organization">
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
      </section>

      <section className={drawerCardClass} aria-label="Schedule">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1">
            <PropertyLabel icon={CalendarClock}>{PLAN_SECTION_LABEL}</PropertyLabel>
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
                    "inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-medium transition-colors",
                    active
                      ? "border-foreground/20 bg-surface-hover"
                      : "border-border/50 hover:bg-surface-hover"
                  )}
                  title={config.description}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <div className="space-y-1.5">
            <PropertyLabel icon={CalendarDays} htmlFor="task-detail-date">
              Date
            </PropertyLabel>
            <ScheduleDatePickerField
              id="task-detail-date"
              value={task.scheduled_date ?? null}
              onChange={(dateKey) =>
                onChange({ scheduled_date: dateKey })
              }
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

        <div className="mt-3 grid grid-cols-2 gap-2.5">
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
      </section>
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
