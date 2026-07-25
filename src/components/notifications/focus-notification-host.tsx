"use client";

import { useEffect, useState } from "react";
import { useFocusSessionContext } from "@/contexts/focus-session-context";
import { cn } from "@/lib/utils";

type ToastItem = {
  id: string;
  message: string;
};

const TOAST_MS = 6000;

/** Focus session notices (phase changes, failed saves) — app-wide. */
export function FocusNotificationHost() {
  const { notification, clearNotification } = useFocusSessionContext();
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    if (!notification) return;
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message: notification }]);
    clearNotification();
    const timer = window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [notification, clearNotification]);

  if (toasts.length === 0) return null;

  return (
    <>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flow-surface-elevated pointer-events-auto rounded-xl px-4 py-3 text-sm",
            "animate-in slide-in-from-top-2 fade-in duration-200"
          )}
        >
          {toast.message}
        </div>
      ))}
    </>
  );
}
