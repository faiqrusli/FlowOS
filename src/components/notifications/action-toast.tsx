"use client";

import { useEffect, type ReactNode } from "react";
import {
  AlertTriangle,
  CalendarClock,
  CalendarDays,
  Check,
  ListPlus,
  NotebookPen,
  Play,
  Repeat,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ActionToastTone = "neutral" | "success" | "warning";

export type ActionToastIcon =
  | "check"
  | "trash"
  | "queue"
  | "calendar"
  | "later"
  | "play"
  | "note"
  | "habit"
  | "reflection"
  | "warning";

export type ActionToastProps = {
  message: string;
  tone?: ActionToastTone;
  icon?: ActionToastIcon;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss: () => void;
  durationMs?: number;
};

function ToastIcon({
  icon,
  tone,
}: {
  icon: ActionToastIcon;
  tone: ActionToastTone;
}) {
  if (tone === "warning" || icon === "warning") {
    return (
      <span
        className="flex size-5 shrink-0 items-center justify-center rounded-full bg-warning/20 text-warning"
        aria-hidden
      >
        <AlertTriangle className="size-3" strokeWidth={2.5} />
      </span>
    );
  }

  const Icon =
    icon === "trash"
      ? Trash2
      : icon === "queue"
        ? ListPlus
        : icon === "calendar"
          ? CalendarDays
          : icon === "later"
            ? CalendarClock
            : icon === "play"
              ? Play
              : icon === "note"
                ? NotebookPen
                : icon === "habit"
                  ? Repeat
                  : icon === "reflection"
                    ? NotebookPen
                    : Check;

  if (tone === "success" || icon === "check") {
    return (
      <span
        className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success/25 text-success"
        aria-hidden
      >
        <Check className="size-3" strokeWidth={2.75} />
      </span>
    );
  }

  return (
    <span
      className="flex size-5 shrink-0 items-center justify-center text-foreground/85"
      aria-hidden
    >
      <Icon className="size-3.5" strokeWidth={2} />
    </span>
  );
}

/** Akiflow-style action capsule — message + optional View / Undo. */
export function ActionToast({
  message,
  tone = "neutral",
  icon = "check",
  actionLabel,
  onAction,
  onDismiss,
  durationMs = 5000,
}: ActionToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, durationMs);
    return () => window.clearTimeout(timer);
  }, [durationMs, onDismiss]);

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-center gap-2.5 rounded-full border px-3 py-2 shadow-[var(--shadow-overlay)]",
        "animate-in slide-in-from-bottom-2 fade-in duration-200",
        tone === "success"
          ? "border-success/45 bg-[color-mix(in_srgb,var(--success)_16%,var(--surface-8))]"
          : tone === "warning"
            ? "border-warning/45 bg-[color-mix(in_srgb,var(--warning)_14%,var(--surface-8))]"
            : "border-border/50 bg-surface-8",
      )}
      role="status"
      aria-live="polite"
    >
      <ToastIcon icon={icon} tone={tone} />
      <span className="text-[13px] font-medium text-foreground">{message}</span>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className={cn(
            "ml-1 shrink-0 rounded-md px-1.5 py-0.5 text-[13px] font-semibold transition-colors",
            tone === "success"
              ? "text-success hover:bg-success/15 hover:text-success"
              : tone === "warning"
                ? "text-warning hover:bg-warning/15 hover:text-warning"
                : "text-foreground hover:bg-surface-hover",
          )}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export function ActionToastViewport({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[200] flex justify-center px-4">
      {children}
    </div>
  );
}
