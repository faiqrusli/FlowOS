import { describe, expect, it } from "vitest";
import {
  fetchHabitQueueRefs,
  insertHabitQueueRef,
  setQueueStorageUserId,
} from "@/lib/queue-ref-storage";

describe("habit queue storage ownership", () => {
  it("does not read or write before an owner is set", () => {
    setQueueStorageUserId(null);
    expect(fetchHabitQueueRefs()).toEqual([]);
    expect(insertHabitQueueRef("habit-1")).toEqual([]);
  });
});
