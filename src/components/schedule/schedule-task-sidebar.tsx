"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarPlus, GripVertical, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { buildScheduleInbox } from "@/lib/schedule-inbox";
import { formatHabitTimeRangeWithDuration } from "@/lib/habit-duration";
import {
  getHabitDurationMinutes,
  getTaskDurationMinutes,
} from "@/lib/schedule-durations";
import { formatDurationLabel } from "@/lib/schedule-layout";
import { getChannelStyle } from "@/lib/schedule-palette";
import { normalizeTaskPriority } from "@/lib/task-priority";
import { cn } from "@/lib/utils";
import type { Habit } from "@/types/habit";
import type { Task } from "@/types/task";
import type { TaskBuckets } from "@/lib/tasks";

type SidebarFilter = "all" | "tasks" | "habits";

type ScheduleTaskSidebarProps = {
  tasks: Task[];
  habits: Habit[];
  buckets: TaskBuckets;
  onAutoscheduleTask?: (taskId: string) => void;
  onAutoscheduleHabit?: (habitId: string) => void;
  onAutoscheduleAll?: () => void;
};

function SidebarSection({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  if (!children || (Array.isArray(children) && children.length === 0)) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="px-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
        {title}
        {count !== undefined && (
          <span className="ml-1.5 font-normal normal-case tracking-normal">
            {count}
          </span>
        )}
      </h3>
      <ul className="space-y-1.5">{children}</ul>
    </div>
  );
}

function DraggableTaskRow({
  task,
  onAutoschedule,
}: {
  task: Task;
  onAutoschedule?: (taskId: string) => void;
}) {
  const priority = normalizeTaskPriority(task.priority);
  const channel = getChannelStyle("task", priority);
  const duration = getTaskDurationMinutes(task.id, task.priority);

  return (
    <li
      draggable={!task.completed}
      onDragStart={(event) => {
        event.dataTransfer.setData("text/task-id", task.id);
        event.dataTransfer.setData("text/drag-duration", String(duration));
        event.dataTransfer.effectAllowed = "move";
      }}
      className={cn(
        "group relative overflow-hidden rounded-lg border-0 bg-surface-base transition-colors duration-150",
        channel.border,
        !task.completed &&
          "cursor-grab hover:bg-surface-hover active:cursor-grabbing",
        task.completed && "opacity-55",
      )}
    >
      <div
        className={cn("absolute top-0 bottom-0 left-0 w-1", channel.accent)}
      />
      <div className="flex items-center gap-2 px-2.5 py-2.5 pl-3.5">
        <GripVertical className="size-3.5 shrink-0 text-muted-foreground/30" />
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate text-sm font-medium text-foreground",
              task.completed && "line-through",
            )}
          >
            {task.title}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {formatDurationLabel(duration)}
          </p>
        </div>
        {onAutoschedule && !task.completed && (
          <button
            type="button"
            onClick={() => onAutoschedule(task.id)}
            className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-foreground/5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-foreground/10 hover:text-foreground"
            title="Autoschedule (find next slot)"
            aria-label={`Autoschedule ${task.title}`}
          >
            <CalendarPlus className="size-3.5" />
          </button>
        )}
      </div>
    </li>
  );
}

function DraggableHabitRow({
  habit,
  onAutoschedule,
}: {
  habit: Habit;
  onAutoschedule?: (habitId: string) => void;
}) {
  const channel = getChannelStyle("habit");
  const duration = getHabitDurationMinutes(habit.id);
  const timeRange = formatHabitTimeRangeWithDuration(
    habit.scheduled_time,
    duration,
  );

  return (
    <li
      draggable={!habit.completed}
      onDragStart={(event) => {
        event.dataTransfer.setData("text/habit-id", habit.id);
        event.dataTransfer.setData("text/drag-duration", String(duration));
        event.dataTransfer.effectAllowed = "move";
      }}
      className={cn(
        "group relative overflow-hidden rounded-lg border-0 bg-surface-base transition-colors duration-150",
        channel.border,
        !habit.completed &&
          "cursor-grab hover:bg-surface-hover active:cursor-grabbing",
        habit.completed && "opacity-55",
      )}
    >
      <div
        className={cn("absolute top-0 bottom-0 left-0 w-1", channel.accent)}
      />
      <div className="flex items-center gap-2 px-2.5 py-2.5 pl-3.5">
        <GripVertical className="size-3.5 shrink-0 text-muted-foreground/30" />
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate text-sm font-medium text-foreground",
              habit.completed && "line-through opacity-70",
            )}
          >
            {habit.name}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {timeRange
              ? `Habit · ${timeRange}`
              : `Habit · ${formatDurationLabel(duration)}`}
          </p>
        </div>
        {onAutoschedule && !habit.completed && (
          <button
            type="button"
            onClick={() => onAutoschedule(habit.id)}
            className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-foreground/5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-foreground/10 hover:text-foreground"
            title="Autoschedule"
            aria-label={`Autoschedule ${habit.name}`}
          >
            <CalendarPlus className="size-3.5" />
          </button>
        )}
      </div>
    </li>
  );
}

const FILTER_TABS: { id: SidebarFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "tasks", label: "Tasks" },
  { id: "habits", label: "Habits" },
];

export function ScheduleTaskSidebar({
  tasks,
  habits,
  buckets,
  onAutoscheduleTask,
  onAutoscheduleHabit,
  onAutoscheduleAll,
}: ScheduleTaskSidebarProps) {
  const [filter, setFilter] = useState<SidebarFilter>("all");
  const [search, setSearch] = useState("");

  const inbox = useMemo(
    () => buildScheduleInbox(tasks, habits, buckets),
    [tasks, habits, buckets],
  );

  const matchesSearch = (title: string) =>
    title.toLowerCase().includes(search.trim().toLowerCase());

  const filteredUnscheduled = inbox.unscheduledTasks.filter((task) =>
    matchesSearch(task.title),
  );
  const filteredLater = inbox.laterTasks.filter((task) =>
    matchesSearch(task.title),
  );
  const filteredHabits = inbox.unscheduledHabits.filter((habit) =>
    matchesSearch(habit.name),
  );

  const showTasks = filter === "all" || filter === "tasks";
  const showHabits = filter === "all" || filter === "habits";
  const totalInbox =
    filteredUnscheduled.length + filteredLater.length + filteredHabits.length;

  return (
    <aside className="flex w-full shrink-0 flex-col overflow-hidden rounded-xl border-0 bg-surface-section xl:sticky xl:top-6 xl:max-h-[calc(100vh-8rem)] xl:basis-[24%] xl:max-w-[300px]">
      <div className="space-y-3 border-b border-border-subtle bg-surface-section px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Later</h2>
            <p className="text-[11px] text-muted-foreground">
              Drag onto calendar to timebox
            </p>
          </div>
          {onAutoscheduleAll && totalInbox > 0 && (
            <button
              type="button"
              onClick={onAutoscheduleAll}
              className="inline-flex items-center gap-1 rounded-lg border border-border-subtle bg-secondary px-2.5 py-1.5 text-[11px] font-medium text-secondary-foreground transition-colors hover:border-border-strong hover:bg-surface-hover"
            >
              <Sparkles className="size-3" />
              Auto
            </button>
          )}
        </div>

        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search tasks..."
          className="h-8 border-border-subtle bg-surface-base text-sm shadow-none"
        />

        <div className="flex gap-1 rounded-md border border-border-subtle bg-surface-base p-0.5">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                filter === tab.id
                  ? "bg-primary-soft text-foreground"
                  : "text-muted-foreground hover:bg-surface-hover hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3">
        {totalInbox === 0 && (
          <div className="rounded-xl border border-dashed border-border/60 px-3 py-6 text-center">
            <p className="text-sm text-muted-foreground">
              Nothing waiting in Later.
            </p>
            <Link
              href="/tasks"
              className="mt-2 inline-block text-sm font-medium text-foreground underline-offset-2 hover:underline"
            >
              Add a task
            </Link>
          </div>
        )}

        {showTasks && filteredUnscheduled.length > 0 && (
          <SidebarSection title="Today" count={filteredUnscheduled.length}>
            {filteredUnscheduled.map((task) => (
              <DraggableTaskRow
                key={task.id}
                task={task}
                onAutoschedule={onAutoscheduleTask}
              />
            ))}
          </SidebarSection>
        )}

        {showTasks && filteredLater.length > 0 && (
          <SidebarSection title="Later" count={filteredLater.length}>
            {filteredLater.map((task) => (
              <DraggableTaskRow
                key={task.id}
                task={task}
                onAutoschedule={onAutoscheduleTask}
              />
            ))}
          </SidebarSection>
        )}

        {showHabits && filteredHabits.length > 0 && (
          <SidebarSection title="Habits" count={filteredHabits.length}>
            {filteredHabits.map((habit) => (
              <DraggableHabitRow
                key={habit.id}
                habit={habit}
                onAutoschedule={onAutoscheduleHabit}
              />
            ))}
          </SidebarSection>
        )}
      </div>
    </aside>
  );
}
