"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { CheckSquare } from "lucide-react";
import { WorkplaceCompactTaskRow } from "@/components/workplace/workplace-compact-task-row";
import { WorkplaceModuleCard } from "@/components/workplace/workplace-module-card";
import {
  partitionWorkplaceTasks,
  resolveWorkplaceTaskTab,
  type WorkplaceTaskTab,
} from "@/lib/workplace-tasks";
import {
  scrollToTodayTarget,
  scrollToTodayTargetDeferred,
  TODAY_TASKS_SECTION_ID,
  todayTaskAnchorId,
} from "@/lib/today-in-place";
import { taskBelongsInLaterView, taskBelongsInTodayView } from "@/lib/task-groups";
import { cn } from "@/lib/utils";
import type { Task, TaskGroupWithTasks } from "@/types/task";

const TABS: { id: WorkplaceTaskTab; label: string }[] = [
  { id: "queue", label: "Queue" },
  { id: "unscheduled", label: "Unschedule" },
  { id: "missed", label: "Missed" },
  { id: "completed", label: "Completed" },
];

export type WorkplaceTasksCardHandle = {
  ensureTaskVisible: (taskId: string) => boolean;
};

type WorkplaceTasksCardProps = {
  tasks: Task[];
  groups: TaskGroupWithTasks[];
  todayViewDate: string;
  onOpenDetail: (taskId: string) => void;
  onToggleComplete: (task: Task) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onTaskContextMenu: (task: Task, anchorRect: DOMRect) => void;
};

export const WorkplaceTasksCard = forwardRef<
  WorkplaceTasksCardHandle,
  WorkplaceTasksCardProps
>(function WorkplaceTasksCard(
  {
    tasks,
    groups,
    todayViewDate,
    onOpenDetail,
    onToggleComplete,
    onUpdateTask,
    onTaskContextMenu,
  },
  ref
) {
  const [tab, setTab] = useState<WorkplaceTaskTab>("queue");
  const pendingScrollIdRef = useRef<string | null>(null);
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

  useImperativeHandle(
    ref,
    () => ({
      ensureTaskVisible(taskId: string) {
        const task = tasks.find((item) => item.id === taskId);
        if (!task) return false;

        const targetTab = resolveWorkplaceTaskTab(task, tasks, todayViewDate);
        const anchorId = todayTaskAnchorId(taskId);

        if (!targetTab) {
          scrollToTodayTarget(TODAY_TASKS_SECTION_ID);
          return false;
        }

        if (tab === targetTab) {
          return scrollToTodayTarget(anchorId);
        }

        pendingScrollIdRef.current = anchorId;
        setTab(targetTab);
        return true;
      },
    }),
    [tab, tasks, todayViewDate]
  );

  useEffect(() => {
    const anchorId = pendingScrollIdRef.current;
    if (!anchorId) return;

    pendingScrollIdRef.current = null;
    scrollToTodayTargetDeferred(anchorId);
  }, [tab]);

  const handleContextMenu = (task: Task) => (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    onTaskContextMenu(task, event.currentTarget.getBoundingClientRect());
  };

  return (
    <WorkplaceModuleCard
      moduleId="tasks"
      anchorId={TODAY_TASKS_SECTION_ID}
      title="Today's Tasks"
      titleIcon={CheckSquare}
      titleMeta={titleMeta}
      className="min-h-0 overflow-hidden"
      bodyClassName="flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <div className="flex h-full min-h-0 flex-col">
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
});
