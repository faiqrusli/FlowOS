import type { ReactNode } from "react";

/** Shared top-right column for app-wide toasts (reminders, focus notices). */
export function NotificationStack({ children }: { children: ReactNode }) {
  return (
    <div
      className="pointer-events-none fixed top-5 right-5 z-[200] flex w-[min(22.5rem,calc(100vw-2.5rem))] flex-col gap-2 transition-[gap] duration-200"
      aria-live="polite"
    >
      {children}
    </div>
  );
}
