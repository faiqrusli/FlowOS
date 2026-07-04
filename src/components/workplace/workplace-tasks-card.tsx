"use client";

import { useMemo, useState, type MouseEvent } from "react";
import { WorkplaceCompactTaskRow } from "@/components/workplace/workplace-compact-task-row";
import { WorkplaceModuleCard } from "@/components/workplace/workplace-module-card";
import {
  partitionWorkplaceTasks,
  type WorkplaceTaskTab,
} from "@/lib/workplace-tasks";
import { TODAY_TASKS_SECTION_ID } from "@/lib/today-in-place";
import { taskBelongsInLaterView, taskBelongsInTodayView } from "@/lib/task-groups";
import { cn } from "@/lib/utils";
import type { Task, TaskGroupWithTasks } from "@/types/task";

const TABS: { id: WorkplaceTaskTab; label: string }[] = [
  { id: "queue", label: "Queue" },
  { id: "unscheduled", label: "Unschedule" },
  { id: "missed", label: "Missed" },
  { id: "completed", label: "Completed" },
];

type WorkplaceTasksCardProps = {
  tasks: Task[];
  groups: TaskGroupWithTasks[];
  todayViewDate: string;
  onOpenDetail: (taskId: string) => void;
  onToggleComplete: (task: Task) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onTaskContextMenu: (task: Task, anchorRect: DOMRect) => void;
};

export function WorkplaceTasksCard({
  tasks,
  groups,
  todayViewDate,
  onOpenDetail,
  onToggleComplete,
  onUpdateTask,
  onTaskContextMenu,
}: WorkplaceTasksCardProps) {
  const [tab, setTab] = useState<WorkplaceTaskTab>("queue");
  const sections = useMemo(
    () => partitionWorkplaceTasks(tasks, todayViewDate),
    [tasks, todayViewDate]
  );

  const counts: Record<WorkplaceTaskTab, number> = {
    queue: sections.queue.length,
    unscheduled: sections.unscheduled.length,
    missed: sections.missed.length,
    completed: sections.completed.length,
  };

  const list = sections[tab];

  const todayTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          taskBelongsInTodayView(task, todayViewDate) &&
          !taskBelongsInLaterView(task)
      ),
    [tasks, todayViewDate]
  );
  const completedToday = todayTasks.filter((task) => task.completed).length;
  const titleMeta = `${completedToday}/${todayTasks.length}`;

  const handleContextMenu = (task: Task) => (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    onTaskContextMenu(task, event.currentTarget.getBoundingClientRect());
  };

  return (
    <WorkplaceModuleCard
      moduleId="tasks"
      anchorId={TODAY_TASKS_SECTION_ID}
      title="Today's Tasks" titleMeta={titleMeta} className="min-h-0">
      <div className="flex min-h-0 flex-col">
        <div className="flex shrink-0 flex-wrap gap-1 border-b border-divider px-2 py-1.5">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "rounded-md px-2 py-0.5 text-[13px] font-medium transition-[background-color,color,box-shadow] duration-150",
                tab === item.id
                  ? "bg-selected text-foreground shadow-[inset_0_0_0_1px_var(--selected-border)]"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              {item.label} ({counts[item.id]})
            </button>
          ))}
        </div>
        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-1.5">
          {list.length === 0 ? (
            <p className="flow-empty mx-1 my-1.5 px-2 py-4 text-center text-[13px] text-muted-foreground/70">
              No tasks here
            </p>
          ) : (
            list.map((task) => (
              <WorkplaceCompactTaskRow
                key={task.id}
                task={task}
                groups={groups}
                onOpenDetail={() => onOpenDetail(task.id)}
                onToggleComplete={() => onToggleComplete(task)}
                onUpdateDuration={(minutes) =>
                  onUpdateTask(task.id, { duration_minutes: minutes })
                }
                onContextMenu={handleContextMenu(task)}
              />
            ))
          )}
        </div>
      </div>
    </WorkplaceModuleCard>
  );
}
