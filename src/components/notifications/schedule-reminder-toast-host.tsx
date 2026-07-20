"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlarmClock, Bell, Droplets, X } from "lucide-react";
import {
  SCHEDULE_REMINDER_TOAST_MS,
  useScheduleReminderToasts,
  type ScheduleReminderToast,
} from "@/contexts/schedule-reminder-context";
import { cn } from "@/lib/utils";

const EXIT_MS = 200;

function ToastIcon({ toast }: { toast: ScheduleReminderToast }) {
  const className = "size-3.5";
  const strokeWidth = 1.75;
  if (toast.entity === "habit") {
    return <Droplets className={className} strokeWidth={strokeWidth} />;
  }
  if (toast.kind === "reminder") {
    return <Bell className={className} strokeWidth={strokeWidth} />;
  }
  return <AlarmClock className={className} strokeWidth={strokeWidth} />;
}

function ToastCard({
  toast,
  exiting,
  onDismiss,
}: {
  toast: ScheduleReminderToast;
  exiting: boolean;
  onDismiss: () => void;
}) {
  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto relative flex w-full items-stretch overflow-hidden rounded-lg border border-border-float bg-surface-float shadow-[var(--shadow-overlay)]",
        "before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-primary",
        "transition-[opacity,transform] duration-200 ease-out",
        exiting
          ? "-translate-y-2 opacity-0"
          : "animate-in fade-in slide-in-from-top-2 duration-200",
      )}
    >
      <div className="flex min-h-[64px] min-w-0 flex-1 items-start gap-2.5 py-2.5 pr-3 pl-3.5">
        <span
          className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"
          aria-hidden
        >
          <ToastIcon toast={toast} />
        </span>
        <div className="min-w-0 flex-1 pt-px">
          <p className="truncate text-[13px] font-medium leading-snug text-foreground">
            {toast.title}
          </p>
          <p className="mt-0.5 truncate text-[12px] leading-snug text-muted-foreground">
            {toast.subtitle.charAt(0) + toast.subtitle.slice(1).toLowerCase()}
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="flow-icon-quiet -mr-0.5 -mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
          aria-label="Dismiss notification"
        >
          <X className="size-3.5" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}

/** In-app schedule reminder toasts — compact, auto-dismiss, × to close. */
export function ScheduleReminderToastHost() {
  const { toasts, dismissToast } = useScheduleReminderToasts();
  const [exitingIds, setExitingIds] = useState<Set<string>>(() => new Set());
  const autoTimersRef = useRef<Map<string, number>>(new Map());
  const exitTimersRef = useRef<Map<string, number>>(new Map());

  const requestDismiss = useCallback(
    (id: string) => {
      setExitingIds((prev) => {
        if (prev.has(id)) return prev;
        return new Set(prev).add(id);
      });

      const autoTimer = autoTimersRef.current.get(id);
      if (autoTimer != null) {
        window.clearTimeout(autoTimer);
        autoTimersRef.current.delete(id);
      }
      if (exitTimersRef.current.has(id)) return;

      const exitTimer = window.setTimeout(() => {
        exitTimersRef.current.delete(id);
        dismissToast(id);
        setExitingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, EXIT_MS);
      exitTimersRef.current.set(id, exitTimer);
    },
    [dismissToast],
  );

  useEffect(() => {
    for (const toast of toasts) {
      if (autoTimersRef.current.has(toast.id)) continue;
      const id = toast.id;
      const timer = window.setTimeout(() => {
        autoTimersRef.current.delete(id);
        requestDismiss(id);
      }, SCHEDULE_REMINDER_TOAST_MS);
      autoTimersRef.current.set(id, timer);
    }

    for (const [id, timer] of autoTimersRef.current) {
      if (toasts.some((toast) => toast.id === id)) continue;
      window.clearTimeout(timer);
      autoTimersRef.current.delete(id);
    }
  }, [toasts, requestDismiss]);

  useEffect(() => {
    return () => {
      for (const timer of autoTimersRef.current.values()) {
        window.clearTimeout(timer);
      }
      for (const timer of exitTimersRef.current.values()) {
        window.clearTimeout(timer);
      }
      autoTimersRef.current.clear();
      exitTimersRef.current.clear();
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed top-5 right-5 z-[200] flex w-[min(22.5rem,calc(100vw-2.5rem))] flex-col gap-2 transition-[gap] duration-200"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <ToastCard
          key={toast.id}
          toast={toast}
          exiting={exitingIds.has(toast.id)}
          onDismiss={() => requestDismiss(toast.id)}
        />
      ))}
    </div>
  );
}
