import { readStorageJson, removeStorageItem, writeStorageJson } from "@/lib/safe-storage";
import type { ReflectionDraft } from "@/types/reflection";

function draftKey(userId: string, dateKey: string): string {
  return `flowos.reflection-draft:${userId}:${dateKey}`;
}

export function readReflectionDraft(
  userId: string,
  dateKey: string,
): ReflectionDraft | null {
  return readStorageJson<ReflectionDraft | null>(draftKey(userId, dateKey), null);
}

export function writeReflectionDraft(
  userId: string,
  dateKey: string,
  draft: ReflectionDraft,
): void {
  writeStorageJson(draftKey(userId, dateKey), draft);
}

export function clearReflectionDraft(userId: string, dateKey: string): void {
  removeStorageItem(draftKey(userId, dateKey));
}
