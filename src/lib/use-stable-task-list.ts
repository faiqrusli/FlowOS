import { useMemo } from "react";

/** Reuse the same id array when task order and ids are unchanged. */
export function useStableTaskIds(tasks: readonly { id: string }[]): string[] {
  const idsKey = JSON.stringify(tasks.map((task) => task.id));
  return useMemo(() => JSON.parse(idsKey) as string[], [idsKey]);
}

/** Reuse the same task array reference when contents are unchanged. */
export function useStableTaskList<T extends { id: string }>(tasks: T[]): T[] {
  return useMemo(() => tasks, [tasks]);
}
