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
  const selectorRef = useRef(selector);
  const isEqualRef = useRef(isEqual);
  selectorRef.current = selector;
  isEqualRef.current = isEqual;

  const sliceRef = useRef<T>(selector(getTaskDragSessionSnapshot()));

  const subscribe = useCallback((onStoreChange: () => void) => {
    return subscribeTaskDragSession(() => {
      const next = selectorRef.current(getTaskDragSessionSnapshot());
      if (!isEqualRef.current(sliceRef.current, next)) {
        sliceRef.current = next;
        onStoreChange();
      }
    });
  }, []);

  const getSnapshot = useCallback(() => {
    const next = selectorRef.current(getTaskDragSessionSnapshot());
    if (!isEqualRef.current(sliceRef.current, next)) {
      sliceRef.current = next;
    }
    return sliceRef.current;
  }, []);

  const getServerSnapshot = useCallback(() => selectorRef.current(getTaskDragSessionSnapshot()), []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
