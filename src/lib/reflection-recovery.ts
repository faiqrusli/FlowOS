import {
  readStorageJson,
  removeStorageItem,
  writeStorageJson,
} from "@/lib/safe-storage";
import type { ReflectionDraft } from "@/types/reflection";

export const REFLECTION_DRAFT_STORAGE_PREFIX = "flowos.reflection.local-draft";

export type StoredReflectionDraft = {
  identityId: string;
  dateKey: string;
  recordKind: "daily" | "custom" | "focus-session-end";
  draft: ReflectionDraft;
  savedAt: string;
};

export function getReflectionDraftStorageKey(
  identityId: string,
  dateKey: string,
): string {
  return `${REFLECTION_DRAFT_STORAGE_PREFIX}:${identityId}:${dateKey}`;
}

export function readReflectionDraft(
  identityId: string,
  dateKey: string,
): StoredReflectionDraft | null {
  const value = readStorageJson<StoredReflectionDraft | null>(
    getReflectionDraftStorageKey(identityId, dateKey),
    null,
  );
  if (!value?.draft || value.identityId !== identityId || value.dateKey !== dateKey) {
    return null;
  }
  return value;
}

export function writeReflectionDraft(value: StoredReflectionDraft): void {
  writeStorageJson(
    getReflectionDraftStorageKey(value.identityId, value.dateKey),
    value,
  );
}

export function clearReflectionDraft(identityId: string, dateKey: string): void {
  removeStorageItem(getReflectionDraftStorageKey(identityId, dateKey));
}

