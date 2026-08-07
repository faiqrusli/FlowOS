import { describe, expect, it } from "vitest";
import {
  fetchUnifiedQueueOrder,
  setUnifiedQueueStorageUserId,
} from "@/lib/next-up-unified-order";

describe("unified queue storage ownership", () => {
  it("does not restore an order before an owner is known", () => {
    setUnifiedQueueStorageUserId(null);
    expect(fetchUnifiedQueueOrder()).toEqual([]);
  });
});
