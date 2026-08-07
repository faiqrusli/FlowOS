"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import {
  getTaskDragSessionSnapshot,
  subscribeTaskDragSession,
  type TaskDragSessionSnapshot,
} from "@/lib/task-drag-session";

/** Subscribe to a slice of the drag session — re-renders only when the slice changes. */
export function useTaskDragSessionSelector<T>(
  selector: (snapshot: TaskDragSessionSnapshot) => T,
  isEqual: (previous: T, next: T) => boolean = Object.is
): T {
  const sliceRef = useRef<T>(selector(getTaskDragSessionSnapshot()));

  const subscribe = useCallback((onStoreChange: () => void) => {
    return subscribeTaskDragSession(() => {
      const next = selector(getTaskDragSessionSnapshot());
      if (!isEqual(sliceRef.current, next)) {
        sliceRef.current = next;
        onStoreChange();
      }
    });
  }, [isEqual, selector]);

  const getSnapshot = useCallback(() => {
    const next = selector(getTaskDragSessionSnapshot());
    if (!isEqual(sliceRef.current, next)) {
      sliceRef.current = next;
    }
    return sliceRef.current;
  }, [isEqual, selector]);

  const getServerSnapshot = useCallback(
    () => selector(getTaskDragSessionSnapshot()),
    [selector],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
