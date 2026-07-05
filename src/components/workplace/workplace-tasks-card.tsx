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
import { CheckSquare, ChevronDown } from "lucide-react";
import { WorkplaceCompactHabitRow } from "@/components/workplace/workplace-compact-habit-row";
import { WorkplaceCompactTaskRow } from "@/components/workplace/workplace-compact-task-row";
import { WorkplaceModuleCard } from "@/components/workplace/workplace-module-card";
import {
  buildNextQueue,
  nextQueueItemKey,
  type NextQueueItem,
} from "@/lib/next-queue";
import {
  partitionWorkplaceTasks,
  resolveWorkplaceTaskTab,
  type WorkplaceTaskTab,
} from "@/lib/workplace-tasks";
import {
  scrollToTodayTarget,
  scrollToTodayTargetDeferred,
  TODAY_TASKS_SECTION_ID,
  todayHabitAnchorId,
  todayTaskAnchorId,
} from "@/lib/today-in-place";
import { taskBelongsInLaterView, taskBelongsInTodayView } from "@/lib/task-groups";
import { cn } from "@/lib/utils";
import type { Habit, HabitStats } from "@/types/habit";
import type { Task, TaskGroupWithTasks } from "@/types/task";

const QUEUE_CAP = 5;

const DISCLOSURES: {
  id: Exclude<WorkplaceTaskTab, "queue">;
  label: string;
}[] = [
  { id: "unscheduled", label: "Later" },
  { id: "missed", label: "Missed" },
  { id: "completed", label: "Done" },
];

export type WorkplaceTasksCardHandle = {
  ensureTaskVisible: (taskId: string) => boolean;
  ensureHabitVisible?: (habitId: string) => boolean;
};

type WorkplaceTasksCardProps = {
  tasks: Task[];
  groups: TaskGroupWithTasks[];
  todayViewDate: string;
  onOpenDetail: (taskId: string) => void;
  onToggleComplete: (task: Task) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onTaskContextMenu: (task: Task, anchorRect: DOMRect) => void;
  unifiedQueue?: boolean;
  habits?: Habit[];
  habitStatsMap?: Map<string, HabitStats>;
  onToggleHabitComplete?: (habit: Habit) => void;
  onStartHabitFocus?: (habit: Habit) => void;
};

function TaskList({
  list,
  groups,
  onOpenDetail,
  onToggleComplete,
  onUpdateTask,
  onTaskContextMenu,
}: {
  list: Task[];
  groups: TaskGroupWithTasks[];
  onOpenDetail: (taskId: string) => void;
  onToggleComplete: (task: Task) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onTaskContextMenu: (task: Task, anchorRect: DOMRect) => void;
}) {
  const handleContextMenu = (task: Task) => (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    onTaskContextMenu(task, event.currentTarget.getBoundingClientRect());
  };

  if (list.length === 0) {
    return (
      <p className="flow-empty mx-1 my-1.5 px-2 py-4 text-center text-[13px] text-muted-foreground/70">
        No tasks here
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {list.map((task) => (
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
      ))}
    </div>
  );
}

function NextQueueList({
  items,
  groups,
  habitStatsMap,
  onOpenDetail,
  onToggleComplete,
  onUpdateTask,
  onTaskContextMenu,
  onToggleHabitComplete,
  onStartHabitFocus,
}: {
  items: NextQueueItem[];
  groups: TaskGroupWithTasks[];
  habitStatsMap?: Map<string, HabitStats>;
  onOpenDetail: (taskId: string) => void;
  onToggleComplete: (task: Task) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onTaskContextMenu: (task: Task, anchorRect: DOMRect) => void;
  onToggleHabitComplete?: (habit: Habit) => void;
  onStartHabitFocus?: (habit: Habit) => void;
}) {
  const handleContextMenu = (task: Task) => (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    onTaskContextMenu(task, event.currentTarget.getBoundingClientRect());
  };

  if (items.length === 0) {
    return (
      <p className="flow-empty mx-1 my-1.5 px-2 py-4 text-center text-[13px] text-muted-foreground/70">
        All clear
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {items.map((item) =>
        item.kind === "task" ? (
          <WorkplaceCompactTaskRow
            key={nextQueueItemKey(item)}
            task={item.task}
            groups={groups}
            onOpenDetail={() => onOpenDetail(item.task.id)}
            onToggleComplete={() => onToggleComplete(item.task)}
            onUpdateDuration={(minutes) =>
              onUpdateTask(item.task.id, { duration_minutes: minutes })
            }
            onContextMenu={handleContextMenu(item.task)}
          />
        ) : (
          <WorkplaceCompactHabitRow
            key={nextQueueItemKey(item)}
            habit={item.habit}
            streak={habitStatsMap?.get(item.habit.id)?.streak}
            onToggleComplete={() => onToggleHabitComplete?.(item.habit)}
            onStartFocus={
              onStartHabitFocus
                ? () => onStartHabitFocus(item.habit)
                : undefined
            }
          />
        )
      )}
    </div>
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
    onOpenDetail,
    onToggleComplete,
    onUpdateTask,
    onTaskContextMenu,
    unifiedQueue = false,
    habits = [],
    habitStatsMap,
    onToggleHabitComplete,
    onStartHabitFocus,
  },
  ref
) {
  const [queueExpanded, setQueueExpanded] = useState(false);
  const [expandedDisclosures, setExpandedDisclosures] = useState<
    Set<Exclude<WorkplaceTaskTab, "queue">>
  >(() => new Set());
  const pendingScrollIdRef = useRef<string | null>(null);

  const sections = useMemo(
    () => partitionWorkplaceTasks(tasks, todayViewDate),
    [tasks, todayViewDate]
  );

  const nextQueue = useMemo(() => {
    if (!unifiedQueue) return null;
    return buildNextQueue(tasks, habits, todayViewDate);
  }, [habits, tasks, todayViewDate, unifiedQueue]);

  const queueSourceLength = unifiedQueue
    ? (nextQueue?.length ?? 0)
    : sections.queue.length;

  const hiddenQueueCount = Math.max(0, queueSourceLength - QUEUE_CAP);
  const visibleQueueItems = unifiedQueue
    ? queueExpanded || hiddenQueueCount === 0
      ? (nextQueue ?? [])
      : (nextQueue ?? []).slice(0, QUEUE_CAP)
    : null;
  const visibleTaskQueue =
    !unifiedQueue && (queueExpanded || hiddenQueueCount === 0)
      ? sections.queue
      : sections.queue.slice(0, QUEUE_CAP);

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
  const titleMeta = unifiedQueue
    ? `${completedToday + habits.filter((habit) => habit.completed).length}/${
        todayTasks.length + habits.length
      }`
    : `${completedToday}/${todayTasks.length}`;

  const toggleDisclosure = (id: Exclude<WorkplaceTaskTab, "queue">) => {
    setExpandedDisclosures((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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

        if (targetTab === "queue") {
          const queueIndex = unifiedQueue
            ? (nextQueue ?? []).findIndex(
                (item) => item.kind === "task" && item.task.id === taskId
              )
            : sections.queue.findIndex((item) => item.id === taskId);
          if (queueIndex >= QUEUE_CAP) {
            setQueueExpanded(true);
          }
          pendingScrollIdRef.current = anchorId;
          return true;
        }

        setExpandedDisclosures((prev) => new Set(prev).add(targetTab));
        pendingScrollIdRef.current = anchorId;
        return true;
      },
      ensureHabitVisible: unifiedQueue
        ? (habitId: string) => {
            const index = (nextQueue ?? []).findIndex(
              (item) => item.kind === "habit" && item.habit.id === habitId
            );
            if (index === -1) {
              scrollToTodayTarget(TODAY_TASKS_SECTION_ID);
              return false;
            }
            if (index >= QUEUE_CAP) {
              setQueueExpanded(true);
            }
            pendingScrollIdRef.current = todayHabitAnchorId(habitId);
            return true;
          }
        : undefined,
    }),
    [nextQueue, sections.queue, tasks, todayViewDate, unifiedQueue]
  );

  useEffect(() => {
    const anchorId = pendingScrollIdRef.current;
    if (!anchorId) return;

    pendingScrollIdRef.current = null;
    scrollToTodayTargetDeferred(anchorId);
  }, [queueExpanded, expandedDisclosures, visibleQueueItems?.length, visibleTaskQueue.length]);

  return (
    <WorkplaceModuleCard
      moduleId="tasks"
      anchorId={TODAY_TASKS_SECTION_ID}
      title={unifiedQueue ? "Next" : "Today's Tasks"}
      titleIcon={CheckSquare}
      titleMeta={titleMeta}
      className="min-h-0 overflow-hidden"
      bodyClassName="flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-1.5">
          {unifiedQueue && visibleQueueItems ? (
            <NextQueueList
              items={visibleQueueItems}
              groups={groups}
              habitStatsMap={habitStatsMap}
              onOpenDetail={onOpenDetail}
              onToggleComplete={onToggleComplete}
              onUpdateTask={onUpdateTask}
              onTaskContextMenu={onTaskContextMenu}
              onToggleHabitComplete={onToggleHabitComplete}
              onStartHabitFocus={onStartHabitFocus}
            />
          ) : (
            <TaskList
              list={visibleTaskQueue}
              groups={groups}
              onOpenDetail={onOpenDetail}
              onToggleComplete={onToggleComplete}
              onUpdateTask={onUpdateTask}
              onTaskContextMenu={onTaskContextMenu}
            />
          )}
          {hiddenQueueCount > 0 && !queueExpanded ? (
            <button
              type="button"
              onClick={() => setQueueExpanded(true)}
              className="mx-1 flex w-[calc(100%-0.5rem)] items-center justify-between rounded-md px-2 py-1.5 text-left text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              <span>{hiddenQueueCount} more</span>
              <ChevronDown className="size-3.5 shrink-0" aria-hidden />
            </button>
          ) : null}

          {DISCLOSURES.map((disclosure) => {
            const count = sections[disclosure.id].length;
            if (count === 0) return null;

            const expanded = expandedDisclosures.has(disclosure.id);
            const isMissed = disclosure.id === "missed";

            return (
              <div key={disclosure.id} className="mx-1">
                <button
                  type="button"
                  onClick={() => toggleDisclosure(disclosure.id)}
                  aria-expanded={expanded}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[13px] font-medium transition-colors hover:bg-muted/50",
                    isMissed
                      ? "text-warning hover:text-warning"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span>
                    {disclosure.label}
                    <span className="ml-1 tabular-nums">({count})</span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-3.5 shrink-0 transition-transform duration-150",
                      expanded && "rotate-180"
                    )}
                    aria-hidden
                  />
                </button>
                {expanded ? (
                  <div className="pb-1 pt-0.5">
                    <TaskList
                      list={sections[disclosure.id]}
                      groups={groups}
                      onOpenDetail={onOpenDetail}
                      onToggleComplete={onToggleComplete}
                      onUpdateTask={onUpdateTask}
                      onTaskContextMenu={onTaskContextMenu}
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </WorkplaceModuleCard>
  );
});
