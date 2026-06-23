"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ScheduleCapacityBar } from "@/components/schedule/schedule-capacity-bar";
import { ScheduleHeader } from "@/components/schedule/schedule-header";
import { ScheduleSkeleton } from "@/components/schedule/schedule-skeleton";
import { ScheduleTaskSidebar } from "@/components/schedule/schedule-task-sidebar";
import { ScheduleTimeGrid } from "@/components/schedule/schedule-time-grid";
import { ErrorBanner } from "@/components/shared/error-banner";
import { getTodayDateString } from "@/lib/date-utils";
import { toggleHabitComplete, updateHabit } from "@/lib/habits";
import {
  findNextAvailableSlot,
  planAutoscheduleSlots,
} from "@/lib/schedule-autoschedule";
import { computeScheduleCapacity } from "@/lib/schedule-capacity";
import {
  getHabitDurationMinutes,
  getTaskDurationMinutes,
  setItemDurationMinutes,
} from "@/lib/schedule-durations";
import { buildScheduleInbox } from "@/lib/schedule-inbox";
import {
  buildScheduleItems,
  fetchScheduleData,
  ScheduleError,
} from "@/lib/schedule";
import { minutesToTimeString } from "@/lib/schedule-layout";
import {
  getScheduleNotificationEnabled,
  scheduleNotificationKey,
  setScheduleNotificationEnabled,
} from "@/lib/schedule-notifications";
import { toggleTaskComplete, updateTask } from "@/lib/tasks";
import type { TaskBuckets } from "@/lib/tasks";
import type { Habit } from "@/types/habit";
import type { ScheduleItem } from "@/types/schedule";
import type { Task } from "@/types/task";

export function SchedulePageContent() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [buckets, setBuckets] = useState<TaskBuckets | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [autoscheduling, setAutoscheduling] = useState(false);
  const [showProjections, setShowProjections] = useState(true);
  const [notificationRevision, setNotificationRevision] = useState(0);
  const [durationRevision, setDurationRevision] = useState(0);

  const loadSchedule = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchScheduleData();
      setItems(data.items);
      setTasks(data.tasks);
      setHabits(data.habits);
      setBuckets(data.buckets);
    } catch (err) {
      setError(
        err instanceof ScheduleError ? err.message : "Failed to load schedule."
      );
      setItems([]);
      setTasks([]);
      setHabits([]);
      setBuckets(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  const capacity = useMemo(
    () => computeScheduleCapacity(items),
    [items, durationRevision]
  );

  const unscheduledItems = useMemo((): ScheduleItem[] => {
    if (!buckets) return [];
    const inbox = buildScheduleInbox(tasks, habits, buckets);
    return [
      ...inbox.unscheduledTasks.map((task) => ({
        id: `proj-task-${task.id}`,
        entityId: task.id,
        title: task.title,
        type: "task" as const,
        time: null,
        timeSort: Number.MAX_SAFE_INTEGER,
        durationMinutes: getTaskDurationMinutes(task.id, task.priority),
        priority: task.priority,
        completed: task.completed,
        href: "/tasks",
      })),
      ...inbox.unscheduledHabits.map((habit) => ({
        id: `proj-habit-${habit.id}`,
        entityId: habit.id,
        title: habit.name,
        type: "habit" as const,
        time: null,
        timeSort: Number.MAX_SAFE_INTEGER,
        durationMinutes: getHabitDurationMinutes(habit.id),
        completed: habit.completed,
        href: "/habits",
      })),
    ];
  }, [tasks, habits, buckets, durationRevision]);

  function refreshItems(nextTasks: Task[], nextHabits: Habit[]) {
    setItems(buildScheduleItems(nextTasks, nextHabits));
    setDurationRevision((value) => value + 1);
  }

  function bumpNotifications() {
    setNotificationRevision((value) => value + 1);
  }

  function handleToggleNotificationFromItem(item: ScheduleItem) {
    if (item.type === "focus") return;
    const key = scheduleNotificationKey(item.type, item.entityId);
    const next = !getScheduleNotificationEnabled(key);
    setScheduleNotificationEnabled(key, next);
    bumpNotifications();
  }

  async function handleToggle(item: ScheduleItem) {
    if (item.type === "focus") return;

    setPendingId(item.entityId);
    setError(null);

    try {
      if (item.type === "task") {
        const task = tasks.find((t) => t.id === item.entityId);
        if (!task) return;

        const updated = await toggleTaskComplete(task);
        const nextTasks = tasks.map((t) =>
          t.id === updated.id ? updated : t
        );
        setTasks(nextTasks);
        refreshItems(nextTasks, habits);
      } else {
        const habit = habits.find((h) => h.id === item.entityId);
        if (!habit) return;

        const updated = await toggleHabitComplete(habit);
        const nextHabits = habits.map((h) =>
          h.id === updated.id ? updated : h
        );
        setHabits(nextHabits);
        refreshItems(tasks, nextHabits);
      }
    } catch {
      setError(`Failed to update ${item.type}.`);
    } finally {
      setPendingId(null);
    }
  }

  function mergeScheduledTask(updated: Task) {
    const exists = tasks.some((task) => task.id === updated.id);
    const nextTasks = exists
      ? tasks.map((task) => (task.id === updated.id ? updated : task))
      : [...tasks, updated];

    setTasks(nextTasks);

    if (buckets) {
      const today = [
        ...buckets.today.filter((task) => task.id !== updated.id),
        updated,
      ];
      setBuckets({
        ...buckets,
        today,
        todayIncomplete: today.filter((task) => !task.completed),
        todayCompleted: today.filter((task) => task.completed),
        upcoming: buckets.upcoming.filter((task) => task.id !== updated.id),
        missed: buckets.missed.filter((task) => task.id !== updated.id),
      });
    }

    refreshItems(nextTasks, habits);
  }

  async function handleScheduleTask(taskId: string, minutes: number) {
    setPendingId(taskId);
    setError(null);

    try {
      const updated = await updateTask(taskId, {
        scheduled_date: getTodayDateString(),
        scheduled_time: minutesToTimeString(minutes),
      });
      mergeScheduledTask(updated);
    } catch {
      setError("Failed to schedule task.");
    } finally {
      setPendingId(null);
    }
  }

  async function handleScheduleHabit(habitId: string, minutes: number) {
    setPendingId(habitId);
    setError(null);

    try {
      const updated = await updateHabit(habitId, {
        scheduled_time: minutesToTimeString(minutes),
      });
      const nextHabits = habits.map((habit) =>
        habit.id === updated.id ? updated : habit
      );
      setHabits(nextHabits);
      refreshItems(tasks, nextHabits);
    } catch {
      setError("Failed to schedule habit.");
    } finally {
      setPendingId(null);
    }
  }

  async function handleRescheduleItem(
    type: "task" | "habit",
    entityId: string,
    minutes: number
  ) {
    setPendingId(entityId);
    setError(null);

    try {
      const time = minutesToTimeString(minutes);

      if (type === "task") {
        const updated = await updateTask(entityId, { scheduled_time: time });
        mergeScheduledTask(updated);
      } else {
        const updated = await updateHabit(entityId, { scheduled_time: time });
        const nextHabits = habits.map((habit) =>
          habit.id === updated.id ? updated : habit
        );
        setHabits(nextHabits);
        refreshItems(tasks, nextHabits);
      }
    } catch {
      setError("Failed to reschedule item.");
    } finally {
      setPendingId(null);
    }
  }

  function handleResizeItem(
    type: "task" | "habit",
    entityId: string,
    durationMinutes: number
  ) {
    setItemDurationMinutes(type, entityId, durationMinutes);
    refreshItems(tasks, habits);
  }

  async function handleAutoscheduleTask(taskId: string) {
    const task = tasks.find((entry) => entry.id === taskId)
      ?? buckets?.upcoming.find((entry) => entry.id === taskId)
      ?? buckets?.missed.find((entry) => entry.id === taskId);

    if (!task) return;

    const duration = getTaskDurationMinutes(taskId, task.priority);
    const slot = findNextAvailableSlot(items, duration);
    if (slot === null) {
      setError("No open slot left on today's calendar.");
      return;
    }

    await handleScheduleTask(taskId, slot);
  }

  async function handleAutoscheduleHabit(habitId: string) {
    const habit = habits.find((entry) => entry.id === habitId);
    if (!habit) return;

    const duration = getHabitDurationMinutes(habitId);
    const slot = findNextAvailableSlot(items, duration);
    if (slot === null) {
      setError("No open slot left on today's calendar.");
      return;
    }

    await handleScheduleHabit(habitId, slot);
  }

  async function handleAutoscheduleAll() {
    if (!buckets) return;

    setAutoscheduling(true);
    setError(null);

    try {
      const inbox = buildScheduleInbox(tasks, habits, buckets);
      const candidates = [
        ...inbox.unscheduledTasks.map((task) => ({
          type: "task" as const,
          entityId: task.id,
          durationMinutes: getTaskDurationMinutes(task.id, task.priority),
        })),
        ...inbox.unscheduledHabits.map((habit) => ({
          type: "habit" as const,
          entityId: habit.id,
          durationMinutes: getHabitDurationMinutes(habit.id),
        })),
        ...inbox.backlogTasks.slice(0, 5).map((task) => ({
          type: "task" as const,
          entityId: task.id,
          durationMinutes: getTaskDurationMinutes(task.id, task.priority),
        })),
      ];

      const plan = planAutoscheduleSlots(items, candidates);

      for (const entry of plan) {
        if (entry.type === "task") {
          await handleScheduleTask(entry.entityId, entry.minutes);
        } else {
          await handleScheduleHabit(entry.entityId, entry.minutes);
        }
      }
    } catch {
      setError("Failed to autoschedule your day.");
    } finally {
      setAutoscheduling(false);
    }
  }

  return (
    <div className="space-y-5">
      <ScheduleHeader
        onAutoscheduleAll={handleAutoscheduleAll}
        autoscheduling={autoscheduling}
      />

      {error && <ErrorBanner message={error} />}

      {loading || !buckets ? (
        <ScheduleSkeleton />
      ) : (
        <>
          <ScheduleCapacityBar
            capacity={capacity}
            showProjections={showProjections}
            onToggleProjections={() => setShowProjections((value) => !value)}
          />

          <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
            <ScheduleTimeGrid
              items={items}
              unscheduledItems={unscheduledItems}
              pendingId={pendingId}
              interactive
              showProjections={showProjections}
              notificationRevision={notificationRevision}
              durationRevision={durationRevision}
              onToggle={handleToggle}
              onToggleNotification={handleToggleNotificationFromItem}
              onScheduleTask={handleScheduleTask}
              onScheduleHabit={handleScheduleHabit}
              onRescheduleItem={handleRescheduleItem}
              onResizeItem={handleResizeItem}
            />
            <ScheduleTaskSidebar
              tasks={tasks}
              habits={habits}
              buckets={buckets}
              onAutoscheduleTask={handleAutoscheduleTask}
              onAutoscheduleHabit={handleAutoscheduleHabit}
              onAutoscheduleAll={handleAutoscheduleAll}
            />
          </div>
        </>
      )}
    </div>
  );
}
