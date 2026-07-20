"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { showBrowserNotificationIfGranted } from "@/lib/browser-notifications";
import {
  getTodayDateString,
  getNowMinutesInAppTimezone,
} from "@/lib/date-utils";
import { fetchHabits } from "@/lib/habits";
import {
  isScheduleReminderDelivered,
  markScheduleReminderDelivered,
} from "@/lib/schedule-reminder-delivery";
import {
  buildScheduleReminderEvents,
  selectDueScheduleReminderEvents,
  type ScheduleReminderEntity,
  type ScheduleReminderEvent,
  type ScheduleReminderKind,
} from "@/lib/schedule-reminder-events";
import { fetchTasks } from "@/lib/tasks";
import type { Habit } from "@/types/habit";
import type { Task } from "@/types/task";

export type ScheduleReminderToast = {
  id: string;
  eventId: string;
  /** Item name — primary toast line. */
  title: string;
  /** Notification type — secondary toast line. */
  subtitle: string;
  kind: ScheduleReminderKind;
  entity: ScheduleReminderEntity;
};

type ScheduleReminderContextValue = {
  toasts: ScheduleReminderToast[];
  dismissToast: (id: string) => void;
};

const ScheduleReminderContext =
  createContext<ScheduleReminderContextValue | null>(null);

const POLL_MS = 15_000;
/** Toast auto-dismiss — host applies exit animation before calling dismiss. */
export const SCHEDULE_REMINDER_TOAST_MS = 5_000;

function osBodyForEvent(event: ScheduleReminderEvent): string {
  return event.kind === "reminder" ? "Coming up soon" : "Starts now";
}

export function ScheduleReminderProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ScheduleReminderToast[]>([]);
  const tasksRef = useRef<Task[]>([]);
  const habitsRef = useRef<Habit[]>([]);
  const previousMinutesRef = useRef<number | null>(null);
  const dateKeyRef = useRef(getTodayDateString());

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const deliverEvent = useCallback((event: ScheduleReminderEvent) => {
    if (isScheduleReminderDelivered(event.id)) return;
    if (!markScheduleReminderDelivered(event.id)) return;

    const toastId = crypto.randomUUID();
    // Newest first — stack grows downward from the top-right anchor.
    setToasts((prev) => [
      {
        id: toastId,
        eventId: event.id,
        title: event.body,
        subtitle: event.heading,
        kind: event.kind,
        entity: event.entity,
      },
      ...prev,
    ]);

    // OS chrome title is the product name; body carries the item + timing line.
    showBrowserNotificationIfGranted({
      title: "FlowOS",
      body: `${event.body} — ${osBodyForEvent(event)}`,
      tag: event.id,
      onClickNavigateToToday: true,
    });
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const [tasks, habits] = await Promise.all([fetchTasks(), fetchHabits()]);
      tasksRef.current = tasks;
      habitsRef.current = habits;
    } catch {
      // Keep last good snapshot; next poll retries.
    }
  }, []);

  const runTick = useCallback(() => {
    const dateKey = getTodayDateString();
    if (dateKey !== dateKeyRef.current) {
      dateKeyRef.current = dateKey;
      previousMinutesRef.current = null;
    }

    const nowMinutes = getNowMinutesInAppTimezone();
    const previous = previousMinutesRef.current;

    // First tick after mount/day change — arm the clock without catch-up spam.
    if (previous === null) {
      previousMinutesRef.current = nowMinutes;
      return;
    }

    const events = buildScheduleReminderEvents({
      tasks: tasksRef.current,
      habits: habitsRef.current,
      dateKey,
    });
    const due = selectDueScheduleReminderEvents(events, previous, nowMinutes);
    previousMinutesRef.current = nowMinutes;

    for (const event of due) {
      deliverEvent(event);
    }
  }, [deliverEvent]);

  useEffect(() => {
    const tickWithFreshData = () => {
      void refreshData().then(() => runTick());
    };

    tickWithFreshData();

    const pollId = window.setInterval(tickWithFreshData, POLL_MS);

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        tickWithFreshData();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(pollId);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [refreshData, runTick]);

  const value = useMemo(
    () => ({ toasts, dismissToast }),
    [toasts, dismissToast],
  );

  return (
    <ScheduleReminderContext.Provider value={value}>
      {children}
    </ScheduleReminderContext.Provider>
  );
}

export function useScheduleReminderToasts() {
  const ctx = useContext(ScheduleReminderContext);
  if (!ctx) {
    return {
      toasts: [] as ScheduleReminderToast[],
      dismissToast: (_id: string) => undefined,
    };
  }
  return ctx;
}
