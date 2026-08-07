import { describe, expect, it } from "vitest";
import { getFocusSessionDateBounds } from "@/lib/focus-sessions";

describe("Focus session date query bounds", () => {
  it("uses half-open Singapore product-day bounds", () => {
    expect(getFocusSessionDateBounds("2026-08-05")).toEqual({
      start: "2026-08-04T16:00:00.000Z",
      end: "2026-08-05T16:00:00.000Z",
    });
  });
});
