"use client";

import {
  WorkplaceActionToast,
  type WorkplaceActionToastProps,
} from "@/components/workplace/workplace-action-toast";

type TaskCreatedToastProps = {
  onView: () => void;
  onDismiss: () => void;
  durationMs?: number;
};

/** Capture confirmation — success capsule with View → open + select task. */
export function TaskCreatedToast({
  onView,
  onDismiss,
  durationMs,
}: TaskCreatedToastProps) {
  return (
    <WorkplaceActionToast
      message="Task created successfully"
      tone="success"
      icon="check"
      actionLabel="View"
      onAction={onView}
      onDismiss={onDismiss}
      durationMs={durationMs}
    />
  );
}

export type { WorkplaceActionToastProps };
