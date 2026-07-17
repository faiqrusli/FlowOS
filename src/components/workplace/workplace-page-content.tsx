"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
  type ReactNode,
  type RefObject,
} from "react";
import { CheckSquare, Repeat } from "lucide-react";
import {
  TimelinePlanner,
  type TimelinePlannerProps,
} from "@/components/tasks/timeline-planner";
import { ErrorBanner } from "@/components/shared/error-banner";
import { WorkplaceFocusCard } from "@/components/workplace/workplace-focus-card";
import {
  WorkplaceHabitsCard,
  type WorkplaceHabitsCardHandle,
} from "@/components/workplace/workplace-habits-card";
import { WorkplaceNotificationHost } from "@/components/workplace/workplace-notification-host";
import { WorkplaceQuickAddCard } from "@/components/workplace/workplace-quick-add-card";
import { WorkplaceTodayTaskMenu } from "@/components/workplace/workplace-today-task-menu";
import {
  WorkplaceTasksCard,
  type WorkplaceTasksCardHandle,
} from "@/components/workplace/workplace-tasks-card";
import {
  TaskBoardActionsProvider,
  type TaskBoardActions,
} from "@/components/tasks/task-board-actions-context";
import { TaskBoardGroupsProvider } from "@/components/tasks/task-board-groups-context";
import { useGlobalRightSidebar } from "@/contexts/global-right-sidebar-context";
import { useFocusSessionContext } from "@/contexts/focus-session-context";
import {
  WorkplaceFocusTaskProvider,
  useWorkplaceFocusTask,
} from "@/contexts/workplace-focus-task-context";
import { useRegisterTaskDetailSource } from "@/hooks/use-register-task-detail-source";
import { getTodayDateString, getTomorrowDateString } from "@/lib/date-utils";
import {
  manualOrderForNewTaskAtEnd,
  sortByManualOrder,
} from "@/lib/manual-order";
import {
  isNextUpReorderDrag,
  isScheduleKindDrag,
} from "@/lib/next-up-drag";
import {
  getActiveTaskDragId,
  getActiveTimelineDrag,
} from "@/lib/timeline-drag";
import {
  addTaskToBoard,
  isInboxGroup,
  isLaterGroup,
  isTodayGroup,
  persistTaskBoardLayout,
  rebuildTodayColumn,
  removeTaskFromBoard,
  replaceTaskOnBoard,
  syncTaskOnBoard,
  TaskGroupsError,
} from "@/lib/task-groups";
import { moveTaskInBoard } from "@/lib/task-drag-utils";
import { normalizePlanningState } from "@/lib/task-planning";
import { appendTaskToNextUp, removeTaskFromNextUp } from "@/lib/task-next-up";
import { setQuickScheduleOpen } from "@/lib/timeline-drag";
import { collectAllBoardTasks } from "@/lib/timeline-layout";
import { deleteTask, duplicateTask, TasksError, updateTask } from "@/lib/tasks";
import { toggleHabitComplete, HabitsError } from "@/lib/habits";
import {
  setHabitDailyScheduleOverride,
  useHabitDailyScheduleStore,
  withHabitScheduleForDate,
} from "@/lib/habit-daily-schedule-store";
import {
  WORKPLACE_DOCK_BOTTOM_FULL_PX,
  WORKPLACE_DOCK_POPUP_ABOVE_LAUNCHER_PX,
  WORKPLACE_FOCUS_MIN_PX,
  WORKPLACE_MODULE_OVERLAY_MAX_PX,
  WORKPLACE_MODULE_OVERLAY_MIN_HEIGHT_PX,
  WORKPLACE_MODULE_OVERLAY_MAX_HEIGHT_CSS,
  WORKPLACE_NEXT_UP_RAIL_PX,
  WORKPLACE_TIMELINE_CONTENT_GAP_PX,
  WORKPLACE_TIMELINE_WIDTH_PX,
  resolveWorkplaceDockBottomPx,
} from "@/lib/workplace-layout";
import { fetchWorkplaceData, WorkplaceError } from "@/lib/workplace-data";
import { registerContextMenuCloser } from "@/lib/task-detail-menu-coordinator";
import {
  scrollToTodayTargetDeferred,
  TODAY_HABITS_SECTION_ID,
  TODAY_TASKS_SECTION_ID,
} from "@/lib/today-in-place";
import { cn } from "@/lib/utils";
import type { Habit } from "@/types/habit";
import type { PlanningState, Task, TaskGroupWithTasks } from "@/types/task";

type WorkplaceOverlay = "tasks" | "habits" | null;

const WORKPLACE_CANVAS_EDGE_SCROLL_ZONE_PX = 72;
const WORKPLACE_CANVAS_EDGE_SCROLL_SPEED_PX = 10;

type WorkplacePageContentProps = {
  tasksTabRef?: RefObject<WorkplaceTasksCardHandle | null>;
  habitsTabRef?: RefObject<WorkplaceHabitsCardHandle | null>;
  /** Optional top chrome (e.g. Today status rail) — Timeline spans beside it full-height. */
  statusRail?: ReactNode;
};

export function WorkplacePageContent({
  tasksTabRef,
  habitsTabRef,
  statusRail,
}: WorkplacePageContentProps = {}) {
  const {
    selectedTaskId,
    selectTask,
    requestQuickCapture,
    registerWorkplaceTaskHandler,
  } = useGlobalRightSidebar();
  const { dashboardActive } = useFocusSessionContext();
  const isFocusing = dashboardActive.isActive;
  const timelineWidthPx = WORKPLACE_TIMELINE_WIDTH_PX;
  const [groups, setGroups] = useState<TaskGroupWithTasks[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayViewDate] = useState(getTodayDateString);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [overlay, setOverlay] = useState<WorkplaceOverlay>(null);
  const [dockPopupEntryKey, setDockPopupEntryKey] = useState(0);
  /** While dragging a task/habit, let events pass through the dismiss layer to Next Up. */
  const [scheduleDragActive, setScheduleDragActive] = useState(false);
  const [taskContextMenu, setTaskContextMenu] = useState<{
    task: Task;
    anchorRect: DOMRect;
  } | null>(null);
  const taskContextMenuRef = useRef<HTMLDivElement>(null);
  const tasksCardRef = useRef<WorkplaceTasksCardHandle>(null);
  const habitsCardRef = useRef<WorkplaceHabitsCardHandle>(null);
  const updateTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );
  const pendingTaskUpdates = useRef<Map<string, Partial<Task>>>(new Map());

  /** Open or switch dock panel. Scale animation only when opening from closed. */
  const showDockPanel = useCallback((panel: "tasks" | "habits") => {
    setOverlay((current) => {
      if (current === null) {
        setDockPopupEntryKey((key) => key + 1);
      }
      return panel;
    });
  }, []);

  const openDockPanel = useCallback((panel: "tasks" | "habits") => {
    setOverlay((current) => {
      if (current === panel) return null;
      if (current === null) {
        setDockPopupEntryKey((key) => key + 1);
      }
      return panel;
    });
  }, []);

  const openTasksOverlay = useCallback(() => {
    openDockPanel("tasks");
  }, [openDockPanel]);

  const openHabitsOverlay = useCallback(() => {
    openDockPanel("habits");
  }, [openDockPanel]);

  const allTasks = useMemo(() => collectAllBoardTasks(groups), [groups]);
  const habitScheduleRevision = useHabitDailyScheduleStore();
  const todayDisplayHabits = useMemo(
    () => withHabitScheduleForDate(habits, todayViewDate),
    [habits, todayViewDate, habitScheduleRevision],
  );

  const getTask = useCallback(
    (taskId: string) => allTasks.find((task) => task.id === taskId) ?? null,
    [allTasks],
  );

  const loadWorkplace = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWorkplaceData();
      setGroups(data.groups);
      setHabits(data.habits);
    } catch (err) {
      setError(
        err instanceof WorkplaceError
          ? err.message
          : "Failed to load workplace.",
      );
      setGroups([]);
      setHabits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWorkplace();
  }, [loadWorkplace]);

  useEffect(() => {
    registerWorkplaceTaskHandler((task) => {
      setGroups((prev) => addTaskToBoard(prev, task, todayViewDate));
    });
    return () => registerWorkplaceTaskHandler(null);
  }, [registerWorkplaceTaskHandler, todayViewDate]);

  useEffect(() => {
    setQuickScheduleOpen(true);
    return () => setQuickScheduleOpen(false);
  }, []);

  useEffect(() => {
    return registerContextMenuCloser(() => setTaskContextMenu(null));
  }, []);

  useEffect(() => {
    if (!tasksTabRef) return;
    tasksTabRef.current = {
      ensureTaskVisible(taskId: string) {
        showDockPanel("tasks");
        requestAnimationFrame(() => {
          if (taskId) {
            void tasksCardRef.current?.ensureTaskVisible(taskId);
          } else {
            scrollToTodayTargetDeferred(TODAY_TASKS_SECTION_ID);
          }
        });
        return true;
      },
    };
    return () => {
      tasksTabRef.current = null;
    };
  }, [showDockPanel, tasksTabRef]);

  useEffect(() => {
    if (!habitsTabRef) return;
    habitsTabRef.current = {
      ensureHabitVisible(habitId: string) {
        showDockPanel("habits");
        requestAnimationFrame(() => {
          if (habitId) {
            void habitsCardRef.current?.ensureHabitVisible(habitId);
          } else {
            scrollToTodayTargetDeferred(TODAY_HABITS_SECTION_ID);
          }
        });
        return true;
      },
    };
    return () => {
      habitsTabRef.current = null;
    };
  }, [habitsTabRef, showDockPanel]);

  useEffect(() => {
    if (!overlay) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOverlay(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [overlay]);

  const canvasScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number | null = null;
    let pointerX = 0;
    let dragActive = false;

    const stop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const isCanvasDrag = (event?: DragEvent) => {
      if (getActiveTimelineDrag() || getActiveTaskDragId()) return true;
      if (!event) return false;
      return isScheduleKindDrag(event) || isNextUpReorderDrag(event);
    };

    const tick = () => {
      const el = canvasScrollRef.current;
      if (!el || !dragActive) {
        stop();
        return;
      }

      // Next Up open/close can change scrollWidth mid-drag — keep polling.
      if (el.scrollWidth > el.clientWidth + 1) {
        const rect = el.getBoundingClientRect();
        const zone = WORKPLACE_CANVAS_EDGE_SCROLL_ZONE_PX;
        const speed = WORKPLACE_CANVAS_EDGE_SCROLL_SPEED_PX;
        let delta = 0;

        if (pointerX < rect.left + zone) {
          delta =
            -speed * Math.min(1, (rect.left + zone - pointerX) / zone);
        } else if (pointerX > rect.right - zone) {
          delta =
            speed * Math.min(1, (pointerX - (rect.right - zone)) / zone);
        } else if (pointerX < zone) {
          // Viewport extreme — still pan when overlays cover canvas edges.
          delta = -speed;
        } else if (pointerX > window.innerWidth - zone) {
          delta = speed;
        }

        if (delta !== 0) {
          el.scrollLeft += delta;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(tick);
    };

    const activateCanvasDrag = (clientX: number) => {
      setScheduleDragActive(true);
      document.documentElement.dataset.workplaceDragLive = "true";
      dragActive = true;
      pointerX = clientX;
      start();
    };

    const onDragStart = (event: DragEvent) => {
      // Task rows set MIME / active-drag state in their own dragstart. Capture
      // listeners run first, so defer until after the target handler.
      const clientX = event.clientX;
      window.setTimeout(() => {
        if (
          !getActiveTimelineDrag() &&
          !getActiveTaskDragId() &&
          !isScheduleKindDrag(event) &&
          !isNextUpReorderDrag(event)
        ) {
          return;
        }
        activateCanvasDrag(clientX);
      }, 0);
    };

    const onDragOver = (event: DragEvent) => {
      if (!isCanvasDrag(event)) return;
      // Required so dragover keeps firing while over non-drop targets.
      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
      }
      activateCanvasDrag(event.clientX);
    };

    const onDragEnd = () => {
      // Clear drag chrome; Tasks/Habits overlay unhides via scheduleDragActive.
      setScheduleDragActive(false);
      delete document.documentElement.dataset.workplaceDragLive;
      dragActive = false;
      stop();
    };

    document.addEventListener("dragstart", onDragStart, true);
    document.addEventListener("dragover", onDragOver, true);
    document.addEventListener("dragend", onDragEnd, true);
    document.addEventListener("drop", onDragEnd, true);
    return () => {
      stop();
      document.removeEventListener("dragstart", onDragStart, true);
      document.removeEventListener("dragover", onDragOver, true);
      document.removeEventListener("dragend", onDragEnd, true);
      document.removeEventListener("drop", onDragEnd, true);
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    const canvas = canvasScrollRef.current;
    if (!canvas) return;

    let middlePanning = false;
    let lastClientX = 0;

    const onWheel = (event: WheelEvent) => {
      if (canvas.scrollWidth <= canvas.clientWidth + 1) return;
      const dx =
        event.deltaX !== 0 ? event.deltaX : event.shiftKey ? event.deltaY : 0;
      if (dx === 0) return;
      event.preventDefault();
      canvas.scrollLeft += dx;
    };

    const canPan = () => canvas.scrollWidth > canvas.clientWidth + 1;

    const onMouseDown = (event: MouseEvent) => {
      if (event.button !== 1) return;
      if (!canPan()) return;
      if (!(event.target instanceof Node) || !canvas.contains(event.target)) {
        return;
      }
      // Stop browser autoscroll / middle-click paste behaviors.
      event.preventDefault();
      middlePanning = true;
      lastClientX = event.clientX;
      document.documentElement.dataset.workplaceMiddlePan = "true";
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!middlePanning) return;
      event.preventDefault();
      const dx = event.clientX - lastClientX;
      lastClientX = event.clientX;
      // Grab metaphor: drag right reveals content on the left.
      canvas.scrollLeft -= dx;
    };

    const endMiddlePan = () => {
      if (!middlePanning) return;
      middlePanning = false;
      delete document.documentElement.dataset.workplaceMiddlePan;
    };

    const onAuxClick = (event: MouseEvent) => {
      if (event.button !== 1) return;
      if (!(event.target instanceof Node) || !canvas.contains(event.target)) {
        return;
      }
      event.preventDefault();
    };

    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("auxclick", onAuxClick);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", endMiddlePan);
    window.addEventListener("blur", endMiddlePan);

    return () => {
      endMiddlePan();
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("auxclick", onAuxClick);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", endMiddlePan);
      window.removeEventListener("blur", endMiddlePan);
    };
  }, [loading]);

  const launcherDockRef = useRef<HTMLDivElement>(null);
  const launcherShellRef = useRef<HTMLDivElement>(null);
  const focusWorkspaceRef = useRef<HTMLDivElement>(null);
  const taskLauncherRef = useRef<HTMLButtonElement>(null);
  const habitLauncherRef = useRef<HTMLButtonElement>(null);
  const [dockBottomPx, setDockBottomPx] = useState(
    WORKPLACE_DOCK_BOTTOM_FULL_PX,
  );
  const [dockActivePill, setDockActivePill] = useState<{
    left: number;
    width: number;
  } | null>(null);

  useEffect(() => {
    if (loading) return;
    const workspace = focusWorkspaceRef.current;
    if (!workspace) return;

    const layout =
      workspace.closest<HTMLElement>("[data-workplace-layout]") ??
      workspace;

    const sync = () => {
      setDockBottomPx(
        resolveWorkplaceDockBottomPx(
          workspace.clientHeight,
          layout.clientWidth,
        ),
      );
    };

    const observer = new ResizeObserver(sync);
    observer.observe(workspace);
    if (layout !== workspace) observer.observe(layout);
    sync();
    return () => observer.disconnect();
  }, [loading]);

  useLayoutEffect(() => {
    if (!overlay) {
      setDockActivePill(null);
      return;
    }
    const shell = launcherShellRef.current;
    const activeBtn =
      overlay === "tasks" ? taskLauncherRef.current : habitLauncherRef.current;
    if (!shell || !activeBtn) return;

    const syncPill = () => {
      setDockActivePill({
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
      });
    };

    syncPill();
    const observer = new ResizeObserver(syncPill);
    observer.observe(shell);
    observer.observe(activeBtn);
    return () => observer.disconnect();
  }, [overlay]);

  useEffect(() => {
    setGroups((prev) => rebuildTodayColumn(prev, todayViewDate));
  }, [todayViewDate]);

  useEffect(() => {
    return () => {
      for (const timer of updateTimers.current.values()) {
        clearTimeout(timer);
      }
    };
  }, []);

  function scheduleTaskPersist(taskId: string, updates: Partial<Task>) {
    const merged = {
      ...(pendingTaskUpdates.current.get(taskId) ?? {}),
      ...updates,
    };
    pendingTaskUpdates.current.set(taskId, merged);

    setGroups((prev) =>
      replaceTaskOnBoard(
        prev,
        taskId,
        (task) => ({ ...task, ...merged }),
        todayViewDate,
      ),
    );

    const existing = updateTimers.current.get(taskId);
    if (existing) clearTimeout(existing);

    updateTimers.current.set(
      taskId,
      setTimeout(async () => {
        updateTimers.current.delete(taskId);
        const payload = pendingTaskUpdates.current.get(taskId);
        if (!payload) return;

        try {
          const updated = await updateTask(taskId, payload);
          const stillPending = pendingTaskUpdates.current.get(taskId);
          // Drop fields that this request successfully covered when unchanged.
          if (stillPending) {
            const remaining: Partial<Task> = { ...stillPending };
            for (const key of Object.keys(payload) as (keyof Task)[]) {
              if (remaining[key] === payload[key]) {
                delete remaining[key];
              }
            }
            if (Object.keys(remaining).length === 0) {
              pendingTaskUpdates.current.delete(taskId);
            } else {
              pendingTaskUpdates.current.set(taskId, remaining);
            }
          }

          setGroups((prev) => {
            let next = syncTaskOnBoard(prev, updated, todayViewDate);
            const overlay = pendingTaskUpdates.current.get(taskId);
            if (overlay && Object.keys(overlay).length > 0) {
              next = replaceTaskOnBoard(
                next,
                taskId,
                (task) => ({ ...task, ...overlay }),
                todayViewDate,
              );
            }
            return next;
          });
        } catch (err) {
          pendingTaskUpdates.current.delete(taskId);
          setError(
            err instanceof TasksError ? err.message : "Failed to save task.",
          );
          void loadWorkplace();
        }
      }, 350),
    );
  }

  const handleScheduleTask = useCallback(
    async (
      taskId: string,
      updates: {
        scheduled_date: string;
        scheduled_time: string | null;
        duration_minutes?: number | null;
      },
    ) => {
      setError(null);
      setGroups((prev) =>
        replaceTaskOnBoard(
          prev,
          taskId,
          (task) => ({ ...task, ...updates }),
          todayViewDate,
        ),
      );
      try {
        const updated = await updateTask(taskId, updates);
        setGroups((prev) => syncTaskOnBoard(prev, updated, todayViewDate));
      } catch (err) {
        setError(
          err instanceof TasksError ? err.message : "Failed to schedule task.",
        );
        void loadWorkplace();
      }
    },
    [loadWorkplace, todayViewDate],
  );

  const handleUpdateTask = useCallback(
    async (taskId: string, updates: Partial<Task>) => {
      if (
        "title" in updates ||
        "description" in updates ||
        updates.scheduled_time !== undefined
      ) {
        scheduleTaskPersist(taskId, updates);
        return;
      }

      setGroups((prev) =>
        replaceTaskOnBoard(
          prev,
          taskId,
          (task) => ({ ...task, ...updates }),
          todayViewDate,
        ),
      );

      try {
        const updated = await updateTask(taskId, updates);
        setGroups((prev) => syncTaskOnBoard(prev, updated, todayViewDate));
      } catch (err) {
        setError(
          err instanceof TasksError ? err.message : "Failed to update task.",
        );
        void loadWorkplace();
      }
    },
    [loadWorkplace, todayViewDate],
  );

  const handleMoveTask = useCallback(
    async (taskId: string, targetGroupId: string) => {
      setError(null);
      const todayGroup = groups.find(isTodayGroup);
      const laterGroup = groups.find(isLaterGroup);
      const inboxGroup = groups.find(isInboxGroup);
      const next = moveTaskInBoard(
        groups,
        taskId,
        { groupId: targetGroupId, beforeTaskId: null, zone: "active" },
        {
          todayGroupId: todayGroup?.id,
          laterGroupId: laterGroup?.id,
          inboxGroupId: inboxGroup?.id,
          todayViewDate,
        },
      );
      setGroups(next);
      try {
        await persistTaskBoardLayout(next, { todayViewDate });
      } catch (err) {
        setError(
          err instanceof TaskGroupsError ? err.message : "Failed to move task.",
        );
        void loadWorkplace();
      }
    },
    [groups, loadWorkplace, todayViewDate],
  );

  const handleMoveToLater = useCallback(
    async (taskId: string) => {
      const laterGroup = groups.find(isLaterGroup);
      if (!laterGroup) return;
      await handleMoveTask(taskId, laterGroup.id);
    },
    [groups, handleMoveTask],
  );

  const handleSetPlanningState = useCallback(
    async (taskId: string, planningState: PlanningState) => {
      const task = allTasks.find((item) => item.id === taskId);
      if (!task) return;
      const current = normalizePlanningState(task.planning_state);
      if (current === planningState) return;
      if (planningState === "later") {
        await handleMoveToLater(taskId);
        return;
      }
      await handleUpdateTask(taskId, { planning_state: "none" });
    },
    [allTasks, handleMoveToLater, handleUpdateTask],
  );

  const handleMoveToTomorrow = useCallback(
    async (task: Task) => {
      await handleScheduleTask(task.id, {
        scheduled_date: getTomorrowDateString(),
        scheduled_time: task.scheduled_time,
      });
    },
    [handleScheduleTask],
  );

  const handleContinueLater = useCallback(
    async (task: Task) => {
      await handleScheduleTask(task.id, {
        scheduled_date: todayViewDate,
        scheduled_time: null,
      });
    },
    [handleScheduleTask, todayViewDate],
  );

  const handleContinueTomorrow = useCallback(
    async (task: Task) => {
      await handleMoveToTomorrow(task);
    },
    [handleMoveToTomorrow],
  );

  const handlePlanLaterForTask = useCallback(
    async (task: Task) => {
      await handleSetPlanningState(task.id, "later");
    },
    [handleSetPlanningState],
  );

  const handleToggleComplete = useCallback(
    async (task: Task, markComplete?: boolean) => {
      const nextCompleted = markComplete ?? !task.completed;
      if (task.completed === nextCompleted) return;

      setError(null);
      setGroups((prev) =>
        replaceTaskOnBoard(
          prev,
          task.id,
          (item) => ({ ...item, completed: nextCompleted }),
          todayViewDate,
        ),
      );
      try {
        const updated = await updateTask(task.id, {
          completed: nextCompleted,
          completed_at: nextCompleted ? new Date().toISOString() : null,
        });
        setGroups((prev) => syncTaskOnBoard(prev, updated, todayViewDate));
      } catch (err) {
        setError(
          err instanceof TasksError ? err.message : "Failed to update task.",
        );
        void loadWorkplace();
      }
    },
    [loadWorkplace, todayViewDate],
  );

  const handleDuplicateTask = useCallback(
    async (task: Task) => {
      if (!task.group_id) return;
      setError(null);
      const orgGroup = groups.find((group) => group.id === task.group_id);
      const activeInGroup = sortByManualOrder(
        (orgGroup?.tasks ?? []).filter((item) => !item.completed),
      );
      const sortOrder = manualOrderForNewTaskAtEnd(activeInGroup);

      try {
        const duplicated = await duplicateTask(task, task.group_id, sortOrder);
        setGroups((prev) => addTaskToBoard(prev, duplicated, todayViewDate));
      } catch (err) {
        setError(
          err instanceof TasksError ? err.message : "Failed to duplicate task.",
        );
      }
    },
    [groups, todayViewDate],
  );

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      setError(null);
      setGroups((prev) => removeTaskFromBoard(prev, taskId));
      if (selectedTaskId === taskId) {
        selectTask(null);
      }
      try {
        await deleteTask(taskId);
      } catch (err) {
        setError(
          err instanceof TasksError ? err.message : "Failed to delete task.",
        );
        void loadWorkplace();
      }
    },
    [loadWorkplace, selectedTaskId, selectTask],
  );

  const handleToggleHabitComplete = useCallback(
    async (habit: Habit) => {
      setError(null);
      setHabits((prev) =>
        prev.map((item) =>
          item.id === habit.id ? { ...item, completed: !item.completed } : item,
        ),
      );
      try {
        const updated = await toggleHabitComplete(habit);
        setHabits((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item)),
        );
      } catch (err) {
        setError(
          err instanceof HabitsError ? err.message : "Failed to update habit.",
        );
        void loadWorkplace();
      }
    },
    [loadWorkplace],
  );

  const handleScheduleHabit = useCallback(
    async (
      habitId: string,
      updates: { scheduled_time: string | null },
      scheduleDate: string,
    ) => {
      setError(null);
      setHabitDailyScheduleOverride(
        habitId,
        scheduleDate,
        updates.scheduled_time,
      );
    },
    [],
  );

  const boardActions = useMemo<TaskBoardActions>(
    () => ({
      onToggleComplete: (task) => void handleToggleComplete(task),
      onOpenDetail: (taskId) => selectTask(taskId),
      onDuplicateTask: (task) => void handleDuplicateTask(task),
      onMoveTask: (taskId, groupId) => void handleMoveTask(taskId, groupId),
      onDeleteTask: (taskId) => void handleDeleteTask(taskId),
      onUpdateTask: (taskId, updates) => void handleUpdateTask(taskId, updates),
      onSetPlanningState: (taskId, state) =>
        void handleSetPlanningState(taskId, state),
      onRequestCreateGroup: () => {},
      onTaskPointerDragStart: () => {},
      onTaskPointerDragEnd: () => {},
    }),
    [
      handleDeleteTask,
      handleDuplicateTask,
      handleMoveTask,
      handleSetPlanningState,
      handleToggleComplete,
      handleUpdateTask,
      selectTask,
    ],
  );

  useRegisterTaskDetailSource(
    {
      groups,
      todayViewDate,
      getTask,
      onUpdate: handleUpdateTask,
      onMoveToGroup: handleMoveTask,
      onPlanningStateChange: handleSetPlanningState,
      onToggleComplete: (task) => void handleToggleComplete(task),
    },
    [groups, todayViewDate, getTask],
  );

  const canvasMinWidthPx =
    WORKPLACE_FOCUS_MIN_PX +
    WORKPLACE_NEXT_UP_RAIL_PX +
    timelineWidthPx +
    WORKPLACE_TIMELINE_CONTENT_GAP_PX;

  if (loading) {
    return (
      <div
        data-workplace-layout
        className="relative flex h-full min-h-0 flex-1 flex-col"
      >
        {statusRail}
        <div
          ref={canvasScrollRef}
          data-workplace-canvas-scroll
          className="workplace-canvas-scroll min-h-0 flex-1 overflow-x-auto overflow-y-hidden"
        >
          <div
            className="flex h-full min-h-0 w-[max(100%,max-content)]"
            style={{ minWidth: canvasMinWidthPx }}
          >
            <div
              className="flex min-h-0 flex-1 flex-col gap-2 pl-5 pt-3"
              style={{
                minWidth: `max(${WORKPLACE_FOCUS_MIN_PX + WORKPLACE_NEXT_UP_RAIL_PX}px, max-content)`,
              }}
            >
              <div className="h-10 w-full shrink-0 animate-pulse rounded-xl bg-surface-base/40" />
              <div className="min-h-0 w-full flex-1 animate-pulse rounded-xl bg-surface-base/40" />
            </div>
            <div
              data-timeline-shell
              className="h-full shrink-0 animate-pulse rounded-none border-0 bg-surface-canvas"
              style={{
                width: timelineWidthPx,
                minWidth: timelineWidthPx,
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <TaskBoardActionsProvider actions={boardActions}>
      <TaskBoardGroupsProvider groups={groups}>
        <WorkplaceFocusTaskProvider
          tasks={allTasks}
          habits={todayDisplayHabits}
          viewDate={todayViewDate}
        >
          <div
            data-workplace-layout
            className="relative flex h-full min-h-0 flex-1 flex-col"
          >
            {statusRail}

            {/* Focus + Timeline row; horizontal bar appears below when cramped. */}
            <div
          ref={canvasScrollRef}
          data-workplace-canvas-scroll
          className="workplace-canvas-scroll min-h-0 flex-1 overflow-x-auto overflow-y-hidden"
        >
              <div
                className="flex h-full min-h-0 w-[max(100%,max-content)]"
                style={{ minWidth: canvasMinWidthPx }}
              >
                <div
                  className="relative flex min-h-0 flex-1 flex-col gap-2 pl-5 pt-3"
                  style={{
                    minWidth: `max(${WORKPLACE_FOCUS_MIN_PX + WORKPLACE_NEXT_UP_RAIL_PX}px, max-content)`,
                  }}
                >
                  {error ? (
                    <div className="absolute left-5 top-2 z-10 max-w-md">
                      <ErrorBanner message={error} />
                    </div>
                  ) : null}

                  <WorkplaceQuickAddCard
                    onOpenTaskDetails={requestQuickCapture}
                  />
                  <div
                    ref={focusWorkspaceRef}
                    data-focus-workspace
                    className="@container relative min-h-0 w-full min-w-0 flex-1"
                  >
                    <WorkplaceFocusCard
                      groups={groups}
                      onToggleComplete={(task, markComplete) =>
                        void handleToggleComplete(task, markComplete)
                      }
                      onOpenDetail={(taskId) => selectTask(taskId)}
                      onContinueLater={(task) => void handleContinueLater(task)}
                      onContinueTomorrow={(task) =>
                        void handleContinueTomorrow(task)
                      }
                      onPlanLater={(task) => void handlePlanLaterForTask(task)}
                      onUpdateDescription={(taskId, description) =>
                        void handleUpdateTask(taskId, { description })
                      }
                      onOpenHabit={(habitId) => {
                        showDockPanel("habits");
                        setSelectedHabitId(habitId);
                        window.setTimeout(() => {
                          void habitsCardRef.current?.ensureHabitVisible(
                            habitId,
                          );
                        }, 0);
                      }}
                    />

                    {overlay ? (
                      <button
                        type="button"
                        aria-label="Dismiss overlay"
                        className={cn(
                          "absolute inset-0 z-30 cursor-default bg-transparent",
                          scheduleDragActive && "pointer-events-none opacity-0",
                        )}
                        onClick={() => setOverlay(null)}
                      />
                    ) : null}

                    {overlay ? (
                      <div
                        key={dockPopupEntryKey}
                        className={cn(
                          "workplace-dock-popup absolute left-5 z-40 flex flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface-overlay shadow-[0_12px_40px_rgba(0,0,0,0.35)]",
                          // Keep mounted while dragging so HTML5 drag isn't cancelled;
                          // hide so Next Up is reachable on small layouts.
                          scheduleDragActive && "pointer-events-none invisible",
                        )}
                        style={{
                          bottom:
                            dockBottomPx + WORKPLACE_DOCK_POPUP_ABOVE_LAUNCHER_PX,
                          width: `min(${WORKPLACE_MODULE_OVERLAY_MAX_PX}px, calc(100% - 1.25rem))`,
                          height: `max(${WORKPLACE_MODULE_OVERLAY_MIN_HEIGHT_PX}px, ${WORKPLACE_MODULE_OVERLAY_MAX_HEIGHT_CSS})`,
                        }}
                        aria-hidden={scheduleDragActive || undefined}
                        role="dialog"
                        aria-label={
                          overlay === "tasks"
                            ? "Today's Tasks"
                            : "Today's Habits"
                        }
                      >
                        {overlay === "tasks" ? (
                          <WorkplaceTasksCard
                            ref={tasksCardRef}
                            tasks={allTasks}
                            groups={groups}
                            todayViewDate={todayViewDate}
                            demoted={isFocusing}
                            overlay
                            onClose={() => setOverlay(null)}
                            onOpenDetail={(taskId) => selectTask(taskId)}
                            onToggleComplete={(task) =>
                              void handleToggleComplete(task)
                            }
                            onUpdateTask={(taskId, updates) =>
                              void handleUpdateTask(taskId, updates)
                            }
                            onTaskContextMenu={(task, anchorRect) =>
                              setTaskContextMenu({ task, anchorRect })
                            }
                          />
                        ) : (
                          <WorkplaceHabitsCardWithFocus
                            ref={habitsCardRef}
                            habits={todayDisplayHabits}
                            todayViewDate={todayViewDate}
                            overlay
                            onClose={() => setOverlay(null)}
                            onToggleComplete={(habit) =>
                              void handleToggleHabitComplete(habit)
                            }
                          />
                        )}
                      </div>
                    ) : null}

                    <div
                      ref={launcherDockRef}
                      className="absolute left-5 z-[60] transition-[bottom] duration-200 ease-out"
                      style={{ bottom: dockBottomPx }}
                    >
                      <div
                        ref={launcherShellRef}
                        className={cn(
                          "workplace-dock-launcher relative inline-flex h-11 items-center gap-0.5 rounded-xl p-0.5",
                          overlay && "workplace-dock-launcher-open",
                        )}
                      >
                        {dockActivePill ? (
                          <span
                            className="workplace-dock-active-pill"
                            style={{
                              left: dockActivePill.left,
                              width: dockActivePill.width,
                            }}
                            aria-hidden
                          />
                        ) : null}
                        <button
                          ref={taskLauncherRef}
                          type="button"
                          onClick={openTasksOverlay}
                          aria-pressed={overlay === "tasks"}
                          className={cn(
                            "relative z-[1] inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition-[color,background-color,opacity] duration-200",
                            overlay === "tasks"
                              ? "text-foreground"
                              : overlay
                                ? "text-foreground/65 hover:bg-foreground/[0.05] hover:text-foreground"
                                : "text-foreground hover:bg-foreground/[0.05]",
                          )}
                        >
                          <CheckSquare
                            className={cn(
                              "size-3.5 shrink-0 transition-colors duration-200",
                              overlay === "tasks"
                                ? "text-foreground"
                                : overlay
                                  ? "text-primary/55"
                                  : "text-primary",
                            )}
                            aria-hidden
                          />
                          Tasks
                        </button>
                        <button
                          ref={habitLauncherRef}
                          type="button"
                          onClick={openHabitsOverlay}
                          aria-pressed={overlay === "habits"}
                          className={cn(
                            "relative z-[1] inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition-[color,background-color,opacity] duration-200",
                            overlay === "habits"
                              ? "text-foreground"
                              : overlay
                                ? "text-foreground/65 hover:bg-foreground/[0.05] hover:text-foreground"
                                : "text-foreground hover:bg-foreground/[0.05]",
                          )}
                        >
                          <Repeat
                            className={cn(
                              "size-3.5 shrink-0 transition-colors duration-200",
                              overlay === "habits"
                                ? "text-foreground"
                                : overlay
                                  ? "text-primary/55"
                                  : "text-primary",
                            )}
                            aria-hidden
                          />
                          Habits
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  data-timeline-shell
                  className="flex h-full min-h-0 shrink-0 overflow-hidden rounded-none border-0 bg-surface-canvas shadow-none"
                  style={{
                    width: timelineWidthPx,
                    minWidth: timelineWidthPx,
                  }}
                >
                  <WorkplaceTimelinePlanner
                    viewDate={todayViewDate}
                    groups={groups}
                    habits={habits}
                    selectedTaskId={selectedTaskId}
                    selectedHabitId={selectedHabitId}
                    onSelectTask={(taskId) => {
                      selectTask(taskId, { openDetails: false });
                      if (taskId) setSelectedHabitId(null);
                    }}
                    onSelectHabit={(habitId) => {
                      setSelectedHabitId(habitId);
                      if (habitId) selectTask(null, { openDetails: false });
                    }}
                    onOpenDetail={(taskId) => selectTask(taskId)}
                    onScheduleTask={handleScheduleTask}
                    onScheduleHabit={handleScheduleHabit}
                    onToggleComplete={handleToggleComplete}
                    onToggleHabitComplete={handleToggleHabitComplete}
                    onUpdateTask={handleUpdateTask}
                    onDeleteTask={handleDeleteTask}
                    onDuplicateTask={handleDuplicateTask}
                    onSetPlanningState={handleSetPlanningState}
                  />
                </div>
              </div>
            </div>

              <WorkplaceNotificationHost />

              {taskContextMenu ? (
                <WorkplaceTodayTaskContextMenu
                  menuRef={taskContextMenuRef}
                  task={taskContextMenu.task}
                  anchorRect={taskContextMenu.anchorRect}
                  onClose={() => setTaskContextMenu(null)}
                  onOpenDetail={() => {
                    selectTask(taskContextMenu.task.id);
                    setTaskContextMenu(null);
                  }}
                  onAddToNextUp={() => {
                    void appendTaskToNextUp(taskContextMenu.task.id);
                    setTaskContextMenu(null);
                  }}
                  onMoveToTomorrow={() => {
                    void handleMoveToTomorrow(taskContextMenu.task);
                    setTaskContextMenu(null);
                  }}
                  onPlanLater={() => {
                    void handlePlanLaterForTask(taskContextMenu.task);
                    setTaskContextMenu(null);
                  }}
                  onToggleComplete={() => {
                    void handleToggleComplete(taskContextMenu.task);
                    setTaskContextMenu(null);
                  }}
                  onDelete={() => {
                    void handleDeleteTask(taskContextMenu.task.id);
                    setTaskContextMenu(null);
                  }}
                />
              ) : null}
            </div>
        </WorkplaceFocusTaskProvider>
      </TaskBoardGroupsProvider>
    </TaskBoardActionsProvider>
  );
}

const WorkplaceHabitsCardWithFocus = forwardRef<
  WorkplaceHabitsCardHandle,
  {
    habits: Habit[];
    todayViewDate: string;
    onToggleComplete: (habit: Habit) => void;
    overlay?: boolean;
    onClose?: () => void;
  }
>(function WorkplaceHabitsCardWithFocus(
  { habits, todayViewDate, onToggleComplete, overlay, onClose },
  habitsTabRef,
) {
  const { setActiveHabitId } = useWorkplaceFocusTask();

  return (
    <WorkplaceHabitsCard
      ref={habitsTabRef}
      habits={habits}
      todayViewDate={todayViewDate}
      overlay={overlay}
      onClose={onClose}
      onToggleComplete={onToggleComplete}
      onStartFocus={(habit) => setActiveHabitId(habit.id, "manual")}
    />
  );
});

function WorkplaceTimelinePlanner(
  props: Omit<
    TimelinePlannerProps,
    "variant" | "onViewDateChange" | "onStartFocusTask" | "onStartFocusHabit"
  >,
) {
  const { setActiveTaskId, setActiveHabitId } = useWorkplaceFocusTask();

  return (
    <TimelinePlanner
      variant="workplace"
      onViewDateChange={() => undefined}
      onStartFocusTask={(taskId) => setActiveTaskId(taskId, "manual")}
      onStartFocusHabit={(habitId) => setActiveHabitId(habitId, "manual")}
      {...props}
    />
  );
}

function WorkplaceTodayTaskContextMenu({
  menuRef,
  task,
  anchorRect,
  onClose,
  onOpenDetail,
  onAddToNextUp,
  onMoveToTomorrow,
  onPlanLater,
  onToggleComplete,
  onDelete,
}: {
  menuRef: RefObject<HTMLDivElement | null>;
  task: Task;
  anchorRect: DOMRect;
  onClose: () => void;
  onOpenDetail: () => void;
  onAddToNextUp: () => void;
  onMoveToTomorrow: () => void;
  onPlanLater: () => void;
  onToggleComplete: () => void;
  onDelete: () => void;
}) {
  const { setActiveTaskId } = useWorkplaceFocusTask();
  const { prepareFocusTarget, quick } = useFocusSessionContext();

  return (
    <WorkplaceTodayTaskMenu
      menuRef={menuRef}
      taskTitle={task.title}
      completed={task.completed}
      anchorRect={anchorRect}
      onClose={onClose}
      onStartFocus={() => {
        setActiveTaskId(task.id, "manual");
        const target = {
          type: "task" as const,
          id: task.id,
          label: task.title,
        };
        void removeTaskFromNextUp(task.id);
        if (quick.isIdle) {
          prepareFocusTarget(target);
          quick.startFocus();
        } else {
          quick.setFocusTarget(target);
        }
        onClose();
      }}
      onOpenDetail={onOpenDetail}
      onAddToNextUp={onAddToNextUp}
      onMoveToTomorrow={onMoveToTomorrow}
      onPlanLater={onPlanLater}
      onToggleComplete={onToggleComplete}
      onDelete={onDelete}
    />
  );
}
