"use client";

import type { LucideIcon } from "lucide-react";
import {
  Bell,
  CalendarDays,
  CalendarClock,
  ClipboardList,
  Clock,
  Flag,
  Folder,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toTimeInputValue } from "@/lib/date-utils";
import { TASK_DURATION_OPTIONS } from "@/lib/task-duration-options";
import { TaskPriorityPicker } from "@/components/tasks/task-priority-picker";
import { TaskGroupPicker } from "@/components/tasks/task-group-picker";
import {
  normalizePlanningState,
  PLANNING_INTRO,
  PLANNING_STATE_CONFIG,
  PLANNING_STATES,
} from "@/lib/task-planning";
import { cn } from "@/lib/utils";
import type { PlanningState, Task, TaskGroupWithTasks } from "@/types/task";

const DETAIL_PANEL_WIDTH_PX = 320;
const DETAIL_PANEL_COLLAPSED_WIDTH_PX = 40;

export { DETAIL_PANEL_WIDTH_PX, DETAIL_PANEL_COLLAPSED_WIDTH_PX };

type TaskDetailPanelProps = {
  task: Task;
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
        aria-label="About planning"
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
  const planningState = normalizePlanningState(task.planning_state);

  return (
    <aside
      className={cn(
        "flex h-full w-full flex-col border-l border-border/40 bg-card shadow-sm",
        expanded && "animate-in slide-in-from-right-4 duration-200"
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center border-b border-border/30",
          expanded ? "gap-1.5 px-3 py-3" : "justify-center px-1.5 py-3"
        )}
      >
        <button
          type="button"
          onClick={onToggleExpanded}
          className="group/detail-watch relative flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          aria-label={expanded ? "Collapse task details" : "Expand task details"}
          aria-expanded={expanded}
        >
          <ClipboardList
            className="size-4 transition-opacity duration-150 group-hover/detail-watch:opacity-0"
            aria-hidden
          />
          {expanded ? (
            <PanelRightClose className="absolute size-4 opacity-0 transition-opacity duration-150 group-hover/detail-watch:opacity-100" />
          ) : (
            <PanelRightOpen className="absolute size-4 opacity-0 transition-opacity duration-150 group-hover/detail-watch:opacity-100" />
          )}
        </button>
        {expanded ? (
          <h2 className="min-w-0 truncate text-sm font-semibold leading-none tracking-tight">
            Task details
          </h2>
        ) : null}
      </div>

      {expanded ? (
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="task-detail-title" className="text-xs text-muted-foreground">
                Title
              </Label>
              <Input
                id="task-detail-title"
                value={task.title}
                onChange={(event) => onChange({ title: event.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="task-detail-description"
                className="text-xs text-muted-foreground"
              >
                Description
              </Label>
              <Textarea
                id="task-detail-description"
                value={task.description ?? ""}
                rows={5}
                className="field-sizing-fixed resize-none overflow-y-auto"
                onChange={(event) => onChange({ description: event.target.value })}
                placeholder="Add notes..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
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
                <PropertyLabel icon={CalendarClock}>Planning</PropertyLabel>
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
                        "inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors",
                        active
                          ? "border-foreground/20 bg-muted"
                          : "border-border/50 hover:bg-muted/50"
                      )}
                      title={config.description}
                    >
                      {config.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <PropertyLabel icon={CalendarDays} htmlFor="task-detail-date">
                  Date
                </PropertyLabel>
                <Input
                  id="task-detail-date"
                  type="date"
                  value={task.scheduled_date ?? ""}
                  onChange={(event) =>
                    onChange({ scheduled_date: event.target.value || null })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <PropertyLabel icon={Clock} htmlFor="task-detail-time">
                  Time
                </PropertyLabel>
                <Input
                  id="task-detail-time"
                  type="time"
                  value={toTimeInputValue(task.scheduled_time)}
                  onChange={(event) =>
                    onChange({
                      scheduled_time: event.target.value
                        ? `${event.target.value}:00`
                        : null,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <PropertyLabel icon={Clock} htmlFor="task-detail-duration">
                  Duration
                </PropertyLabel>
                <select
                  id="task-detail-duration"
                  value={task.duration_minutes ?? ""}
                  onChange={(event) =>
                    onChange({
                      duration_minutes: event.target.value
                        ? Number(event.target.value)
                        : null,
                    })
                  }
                  className="h-9 w-full rounded-lg border border-border/50 bg-background px-3 text-sm outline-none"
                >
                  <option value="">No duration</option>
                  {TASK_DURATION_OPTIONS.map((option) => (
                    <option key={option.minutes} value={option.minutes}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <PropertyLabel icon={Bell} htmlFor="task-detail-notification">
                  Notification
                </PropertyLabel>
                <div className="flex h-9 items-center justify-between rounded-lg border border-border/50 bg-background px-3">
                  <span className="text-sm text-muted-foreground">
                    {task.notification_enabled ? "On" : "Off"}
                  </span>
                  <Switch
                    id="task-detail-notification"
                    checked={task.notification_enabled}
                    onCheckedChange={(checked) =>
                      onChange({ notification_enabled: checked })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
