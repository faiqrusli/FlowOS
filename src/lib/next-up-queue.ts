import type {
  NextUpAddInput,
  NextUpItem,
} from "@/types/next-up";
import { isNextUpItem } from "@/types/next-up";
import type { StoredActiveFocusSession } from "@/lib/focus-active-session";

/**
 * Next Up queue — pure helpers only. No React, no side effects.
 * See docs/review/design/next-up-queue-spec.md and
 * docs/execution/runbooks/m2-next-up-queue.md.
 */

export function sortByPosition(items: NextUpItem[]): NextUpItem[] {
  return [...items].sort((a, b) => a.position - b.position);
}

export function getActiveNextUpItems(items: NextUpItem[] | null | undefined): NextUpItem[] {
  return sortByPosition((items ?? []).filter((item) => item.completedAt === null));
}

export function pruneCompleted(items: NextUpItem[] | null | undefined): NextUpItem[] {
  return getActiveNextUpItems(items);
}

export function normalizePositions(items: NextUpItem[]): NextUpItem[] {
  return sortByPosition(items).map((item, index) => ({
    ...item,
    position: index,
  }));
}

function normalizePositionsInOrder(items: NextUpItem[]): NextUpItem[] {
  return items.map((item, index) => ({
    ...item,
    position: index,
  }));
}

export function dedupeByOriginId(items: NextUpItem[]): NextUpItem[] {
  const seen = new Set<string>();
  const deduped: NextUpItem[] = [];

  for (const item of sortByPosition(items)) {
    if (seen.has(item.originId)) continue;
    seen.add(item.originId);
    deduped.push(item);
  }

  return normalizePositions(deduped);
}

export function hasQueuedOriginId(
  items: NextUpItem[] | null | undefined,
  originId: string
): boolean {
  return getActiveNextUpItems(items).some((item) => item.originId === originId);
}

export function createNextUpItem(
  input: NextUpAddInput,
  position: number,
  options?: { id?: string; createdAt?: string }
): NextUpItem {
  return {
    id: options?.id ?? crypto.randomUUID(),
    type: input.type,
    source: input.source,
    originId: input.originId,
    title: input.title,
    position,
    createdAt: options?.createdAt ?? new Date().toISOString(),
    completedAt: null,
  };
}

export function addItem(
  items: NextUpItem[] | null | undefined,
  input: NextUpAddInput,
  options?: { id?: string; createdAt?: string }
): NextUpItem[] {
  const active = getActiveNextUpItems(items);
  if (hasQueuedOriginId(active, input.originId)) {
    return active;
  }

  const next = createNextUpItem(input, active.length, options);
  return normalizePositions([...active, next]);
}

export function removeItem(
  items: NextUpItem[] | null | undefined,
  id: string
): NextUpItem[] {
  const active = getActiveNextUpItems(items).filter((item) => item.id !== id);
  return normalizePositions(active);
}

export function reorderItems(
  items: NextUpItem[] | null | undefined,
  fromIndex: number,
  toIndex: number
): NextUpItem[] {
  const active = getActiveNextUpItems(items);
  if (
    fromIndex < 0 ||
    fromIndex >= active.length ||
    toIndex < 0 ||
    toIndex >= active.length ||
    fromIndex === toIndex
  ) {
    return active;
  }

  const reordered = [...active];
  const [moved] = reordered.splice(fromIndex, 1);
  reordered.splice(toIndex, 0, moved);

  return normalizePositionsInOrder(reordered);
}

export function markItemCompleted(
  items: NextUpItem[] | null | undefined,
  id: string,
  completedAt: string = new Date().toISOString()
): NextUpItem[] {
  return pruneCompleted(
    getActiveNextUpItems(items).map((item) =>
      item.id === id ? { ...item, completedAt } : item
    )
  );
}

export function updateItemTitle(
  items: NextUpItem[] | null | undefined,
  originId: string,
  title: string
): NextUpItem[] {
  return getActiveNextUpItems(items).map((item) =>
    item.originId === originId ? { ...item, title } : item
  );
}

export function sanitizeNextUpItems(raw: unknown): NextUpItem[] | undefined {
  if (raw == null) return undefined;
  if (!Array.isArray(raw)) return undefined;

  const valid = raw.filter(isNextUpItem);
  if (valid.length === 0) return undefined;

  return dedupeByOriginId(valid);
}

export function getSessionNextUpItems(
  session: StoredActiveFocusSession
): NextUpItem[] {
  return getActiveNextUpItems(session.nextUpItems);
}

function withSessionNextUpItems(
  session: StoredActiveFocusSession,
  items: NextUpItem[]
): StoredActiveFocusSession {
  const normalized = normalizePositions(pruneCompleted(items));
  return {
    ...session,
    nextUpItems: normalized.length > 0 ? normalized : null,
  };
}

export function addToNextUpQueue(
  session: StoredActiveFocusSession,
  input: NextUpAddInput
): StoredActiveFocusSession {
  return withSessionNextUpItems(session, addItem(session.nextUpItems, input));
}

export function removeFromNextUpQueue(
  session: StoredActiveFocusSession,
  id: string
): StoredActiveFocusSession {
  return withSessionNextUpItems(session, removeItem(session.nextUpItems, id));
}

export function reorderNextUpQueue(
  session: StoredActiveFocusSession,
  fromIndex: number,
  toIndex: number
): StoredActiveFocusSession {
  return withSessionNextUpItems(
    session,
    reorderItems(session.nextUpItems, fromIndex, toIndex)
  );
}

export function clearNextUpQueue(
  session: StoredActiveFocusSession
): StoredActiveFocusSession {
  return {
    ...session,
    nextUpItems: null,
    nextUpDismissedSuggestions: null,
  };
}
