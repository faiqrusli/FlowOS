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
import { useFocusSessionContext } from "@/contexts/focus-session-context";
import {
  getTimelineTaskFocusClock,
  isTimelineTaskInFocus,
} from "@/lib/timeline-task-focus";
import {
  partitionWorkplaceTasks,
  resolveWorkplaceTaskTab,
  workplaceTaskTodoCount,
  type WorkplaceTaskTab,
} from "@/lib/workplace-tasks";
import {
  scrollToTodayTarget,
  scrollToTodayTargetDeferred,
  TODAY_TASKS_SECTION_ID,
  todayTaskAnchorId,
} from "@/lib/today-in-place";
import {
  taskBelongsInLaterView,
  taskBelongsInTodayView,
} from "@/lib/task-groups";
import { cn } from "@/lib/utils";
import type { Task, TaskGroupWithTasks } from "@/types/task";

const TABS: { id: WorkplaceTaskTab; label: string }[] = [
  { id: "todo", label: "To Do" },
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
  /** Quiet empty chrome while Focus owns the page. */
  demoted?: boolean;
  overlay?: boolean;
  onClose?: () => void;
  onOpenDetail: (taskId: string) => void;
  onToggleComplete: (task: Task) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onTaskContextMenu: (task: Task, anchorRect: DOMRect) => void;
};

function TaskList({
  list,
  groups,
  demoted = false,
  emptyLabel = "No tasks here",
  selectedTaskId,
  focusTaskId = null,
  focusClock = null,
  onSelect,
  onOpenDetail,
  onToggleComplete,
  onUpdateTask,
  onTaskContextMenu,
}: {
  list: Task[];
  groups: TaskGroupWithTasks[];
  demoted?: boolean;
  emptyLabel?: string;
  selectedTaskId?: string | null;
  focusTaskId?: string | null;
  focusClock?: string | null;
  onSelect?: (taskId: string) => void;
  onOpenDetail: (taskId: string) => void;
  onToggleComplete: (task: Task) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onTaskContextMenu: (task: Task, anchorRect: DOMRect) => void;
}) {
  const handleContextMenu =
    (task: Task) => (event: MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      onSelect?.(task.id);
      onTaskContextMenu(task, event.currentTarget.getBoundingClientRect());
    };

  if (list.length === 0) {
    if (demoted) {
      return (
        <p className="mx-1 my-0.5 px-2 py-1.5 text-center text-[12px] text-muted-foreground/45">
          {emptyLabel}
        </p>
      );
    }
    return (
      <p className="flow-empty mx-1 my-1.5 px-2 py-4 text-center text-[13px] text-muted-foreground/70">
        {emptyLabel}
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {list.map((task) => {
        const inFocus = focusTaskId === task.id;
        return (
          <WorkplaceCompactTaskRow
            key={task.id}
            task={task}
            groups={groups}
            selected={selectedTaskId === task.id}
            inFocus={inFocus}
            focusClock={inFocus ? focusClock : null}
            onSelect={onSelect ? () => onSelect(task.id) : undefined}
            onOpenDetail={() => onOpenDetail(task.id)}
            onToggleComplete={() => onToggleComplete(task)}
            onUpdateDuration={(minutes) =>
              onUpdateTask(task.id, { duration_minutes: minutes })
            }
            onContextMenu={handleContextMenu(task)}
            onOpenMenu={
              onSelect
                ? (anchorRect) => {
                    onSelect(task.id);
                    onTaskContextMenu(task, anchorRect);
                  }
                : undefined
            }
          />
        );
      })}
    </div>
  );
}

function TodoGroupLabel({ children }: { children: string }) {
  return (
    <p className="px-2 pb-0.5 pt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
      {children}
    </p>
  );
}

export const WorkplaceTasksCard = forwardRef<
  WorkplaceTasksCardHandle,
  WorkplaceTasksCardProps
>(function WorkplaceTasksCard(
  {
    tasks,
    groups,
    todayViewDate,
    demoted = false,
    overlay = false,
    onClose,
    onOpenDetail,
    onToggleComplete,
    onUpdateTask,
    onTaskContextMenu,
  },
  ref,
) {
  const [tab, setTab] = useState<WorkplaceTaskTab>("todo");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const pendingScrollIdRef = useRef<string | null>(null);
  const { activeSession, tick } = useFocusSessionContext();
  void tick;

  const sections = useMemo(
    () => partitionWorkplaceTasks(tasks, todayViewDate),
    [tasks, todayViewDate],
  );

  const focusingTaskId = useMemo(() => {
    if (!activeSession?.target_id) return null;
    if (!isTimelineTaskInFocus(activeSession, activeSession.target_id)) {
      return null;
    }
    const task = tasks.find(
      (item) => item.id === activeSession.target_id && !item.completed,
    );
    return task?.id ?? null;
  }, [activeSession, tasks]);

  const focusClock =
    focusingTaskId && activeSession
      ? getTimelineTaskFocusClock(activeSession, focusingTaskId)
      : null;

  const focusingTask = useMemo(() => {
    if (!focusingTaskId) return null;
    return tasks.find((task) => task.id === focusingTaskId) ?? null;
  }, [focusingTaskId, tasks]);

  /** Focused task sits above Scheduled; removed from Scheduled / Anytime / Missed lists. */
  const scheduledWithoutFocus = useMemo(() => {
    if (!focusingTaskId) return sections.todo.scheduled;
    return sections.todo.scheduled.filter((task) => task.id !== focusingTaskId);
  }, [focusingTaskId, sections.todo.scheduled]);

  const anytimeWithoutFocus = useMemo(() => {
    if (!focusingTaskId) return sections.todo.anytime;
    return sections.todo.anytime.filter((task) => task.id !== focusingTaskId);
  }, [focusingTaskId, sections.todo.anytime]);

  const counts: Record<WorkplaceTaskTab, number> = {
    todo: workplaceTaskTodoCount(sections),
    missed: sections.missed.length,
    completed: sections.completed.length,
  };

  const todayTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          taskBelongsInTodayView(task, todayViewDate) &&
          !taskBelongsInLaterView(task),
      ),
    [tasks, todayViewDate],
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
    [tab, tasks, todayViewDate],
  );

  useEffect(() => {
    const anchorId = pendingScrollIdRef.current;
    if (!anchorId) return;

    pendingScrollIdRef.current = null;
    scrollToTodayTargetDeferred(anchorId);
  }, [tab]);

  const listProps = {
    groups,
    demoted,
    selectedTaskId: overlay ? selectedTaskId : null,
    focusTaskId: focusingTaskId,
    focusClock,
    onSelect: overlay ? setSelectedTaskId : undefined,
    onOpenDetail,
    onToggleComplete,
    onUpdateTask,
    onTaskContextMenu,
  };

  const todoEmpty =
    !focusingTask &&
    scheduledWithoutFocus.length === 0 &&
    anytimeWithoutFocus.length === 0;

  return (
    <WorkplaceModuleCard
      moduleId="tasks"
      anchorId={TODAY_TASKS_SECTION_ID}
      title="Tasks"
      titleIcon={CheckSquare}
      titleMeta={titleMeta}
      overlay={overlay}
      onClose={onClose}
      className="min-h-0 overflow-hidden"
      bodyClassName="flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 flex-wrap gap-1 border-b border-divider px-2 py-1.5">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "rounded-md px-2 py-0.5 text-[13px] font-medium transition-[background-color,color,box-shadow] duration-150",
                tab === item.id
                  ? "flow-selected text-foreground"
                  : "text-muted-foreground hover:bg-surface-hover hover:text-foreground",
              )}
            >
              {item.label} ({counts[item.id]})
            </button>
          ))}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-1.5 scrollbar-subtle">
          {tab === "todo" ? (
            todoEmpty ? (
              <TaskList list={[]} emptyLabel="No tasks to do" {...listProps} />
            ) : (
              <div className="space-y-1">
                {focusingTask ? (
                  <div className="mb-2.5">
                    <TaskList list={[focusingTask]} {...listProps} />
                  </div>
                ) : null}
                {scheduledWithoutFocus.length > 0 ? (
                  <div>
                    <TodoGroupLabel>Scheduled</TodoGroupLabel>
                    <TaskList list={scheduledWithoutFocus} {...listProps} />
                  </div>
                ) : null}
                {anytimeWithoutFocus.length > 0 ? (
                  <div>
                    <TodoGroupLabel>Anytime</TodoGroupLabel>
                    <TaskList list={anytimeWithoutFocus} {...listProps} />
                  </div>
                ) : null}
              </div>
            )
          ) : (
            <TaskList
              list={
                focusingTaskId
                  ? sections[tab].filter((task) => task.id !== focusingTaskId)
                  : sections[tab]
              }
              emptyLabel={
                tab === "missed" ? "No missed tasks" : "No completed tasks"
              }
              {...listProps}
            />
          )}
        </div>
      </div>
    </WorkplaceModuleCard>
  );
});
