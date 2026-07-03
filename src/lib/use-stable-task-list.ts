import { useRef } from "react";

/** Reuse the same id array when task order and ids are unchanged. */
export function useStableTaskIds(tasks: readonly { id: string }[]): string[] {
  const cacheRef = useRef<{ tasks: readonly { id: string }[]; ids: string[] }>({
    tasks: [],
    ids: [],
  });

  const cached = cacheRef.current;
  if (
    cached.tasks === tasks ||
    (cached.tasks.length === tasks.length &&
      tasks.every((task, index) => task.id === cached.ids[index]))
  ) {
    if (cached.tasks !== tasks) {
      cacheRef.current = { tasks, ids: cached.ids };
    }
    return cached.ids;
  }

  const ids = tasks.map((task) => task.id);
  cacheRef.current = { tasks, ids };
  return ids;
}

/** Reuse the same task array reference when contents are unchanged. */
export function useStableTaskList<T extends { id: string }>(tasks: T[]): T[] {
  const cacheRef = useRef<{ tasks: T[]; stable: T[] }>({
    tasks: [],
    stable: [],
  });

  const cached = cacheRef.current;
  if (
    cached.tasks === tasks ||
    (cached.tasks.length === tasks.length &&
      tasks.every((task, index) => task === cached.stable[index]))
  ) {
    if (cached.tasks !== tasks) {
      cacheRef.current = { tasks, stable: cached.stable };
    }
    return cached.stable;
  }

  cacheRef.current = { tasks, stable: tasks };
  return tasks;
}
