"use client";

import { useSyncExternalStore } from "react";

let selectedTaskId: string | null = null;
const listeners = new Set<() => void>();

function notifySelection() {
  for (const listener of listeners) {
    listener();
  }
}

export function setBoardSelectedTaskId(taskId: string | null): void {
  if (selectedTaskId === taskId) return;
  selectedTaskId = taskId;
  notifySelection();
}

export function subscribeBoardSelectedTaskId(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useIsTaskSelected(taskId: string): boolean {
  return useSyncExternalStore(
    subscribeBoardSelectedTaskId,
    () => selectedTaskId === taskId,
    () => false
  );
}
