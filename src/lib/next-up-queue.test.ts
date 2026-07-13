import { describe, expect, it } from "vitest";
import {
  addItem,
  dedupeByOriginId,
  getActiveNextUpItems,
  markItemCompleted,
  normalizePositions,
  pruneCompleted,
  removeItem,
  reorderItems,
  sanitizeNextUpItems,
  sortByPosition,
} from "@/lib/next-up-queue";
import type { NextUpAddInput, NextUpItem } from "@/types/next-up";

const BASE_INPUT: NextUpAddInput = {
  type: "task",
  source: "tasks",
  originId: "task-1",
  title: "Draft spec",
};

function makeItem(
  overrides: Partial<NextUpItem> = {}
): NextUpItem {
  return {
    id: overrides.id ?? "item-1",
    type: "task",
    source: "tasks",
    originId: "task-1",
    title: "Draft spec",
    position: 0,
    createdAt: "2026-07-08T12:00:00.000Z",
    completedAt: null,
    ...overrides,
  };
}

describe("next-up-queue", () => {
  it("adds items at the end with normalized positions", () => {
    const first = addItem([], BASE_INPUT, { id: "a", createdAt: "2026-07-08T12:00:00.000Z" });
    const second = addItem(first, {
      ...BASE_INPUT,
      originId: "task-2",
      title: "Review PR",
    }, { id: "b", createdAt: "2026-07-08T12:01:00.000Z" });

    expect(second).toHaveLength(2);
    expect(second[0]?.id).toBe("a");
    expect(second[1]?.position).toBe(1);
  });

  it("ignores duplicate originId adds", () => {
    const first = addItem([], BASE_INPUT, { id: "a" });
    const second = addItem(first, BASE_INPUT, { id: "b" });

    expect(second).toHaveLength(1);
    expect(second[0]?.id).toBe("a");
  });

  it("reorders active items and reindexes positions", () => {
    const items = [
      makeItem({ id: "a", originId: "task-1", position: 0 }),
      makeItem({ id: "b", originId: "task-2", title: "Review PR", position: 1 }),
      makeItem({ id: "c", originId: "task-3", title: "Workout", position: 2 }),
    ];

    const reordered = reorderItems(items, 0, 2);

    expect(reordered.map((item) => item.id)).toEqual(["b", "c", "a"]);
    expect(reordered.map((item) => item.position)).toEqual([0, 1, 2]);
  });

  it("removes items without touching source entities", () => {
    const items = [
      makeItem({ id: "a", position: 0 }),
      makeItem({ id: "b", originId: "task-2", title: "Review PR", position: 1 }),
    ];

    const next = removeItem(items, "a");

    expect(next).toHaveLength(1);
    expect(next[0]?.id).toBe("b");
    expect(next[0]?.position).toBe(0);
  });

  it("prunes completed items from the active list", () => {
    const items = [
      makeItem({ id: "a", position: 0 }),
      makeItem({
        id: "b",
        originId: "task-2",
        title: "Done task",
        position: 1,
        completedAt: "2026-07-08T13:00:00.000Z",
      }),
    ];

    expect(getActiveNextUpItems(items)).toHaveLength(1);
    expect(pruneCompleted(items)).toHaveLength(1);
    expect(markItemCompleted(items, "a")).toHaveLength(0);
  });

  it("dedupes by originId keeping the earliest position", () => {
    const items = normalizePositions([
      makeItem({ id: "a", originId: "task-1", position: 0 }),
      makeItem({ id: "b", originId: "task-1", title: "Duplicate", position: 1 }),
      makeItem({ id: "c", originId: "task-2", title: "Unique", position: 2 }),
    ]);

    const deduped = dedupeByOriginId(items);

    expect(deduped).toHaveLength(2);
    expect(deduped[0]?.id).toBe("a");
    expect(deduped[1]?.originId).toBe("task-2");
  });

  it("sorts by position ascending", () => {
    const items = sortByPosition([
      makeItem({ id: "b", position: 2 }),
      makeItem({ id: "a", position: 0 }),
      makeItem({ id: "c", position: 1, originId: "task-2", title: "Middle" }),
    ]);

    expect(items.map((item) => item.id)).toEqual(["a", "c", "b"]);
  });

  it("sanitizes persisted queue arrays and drops invalid rows", () => {
    const sanitized = sanitizeNextUpItems([
      makeItem({ id: "valid" }),
      { id: "bad", type: "note" },
      null,
    ]);

    expect(sanitized).toHaveLength(1);
    expect(sanitized?.[0]?.id).toBe("valid");
  });
});
