import { afterEach, describe, expect, it, vi } from "vitest";
import {
  clearFloatingNotesCache,
  getFloatingNotesCache,
  setFloatingNotesCache,
} from "@/lib/floating-notes-cache";

describe("floating notes cache ownership", () => {
  afterEach(() => {
    clearFloatingNotesCache();
    vi.unstubAllGlobals();
  });

  it("only restores notes for the current owner", () => {
    const values = new Map<string, string>();
    vi.stubGlobal("window", {
      sessionStorage: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
        removeItem: (key: string) => values.delete(key),
      },
    });

    setFloatingNotesCache("user-a", []);
    expect(getFloatingNotesCache("user-a")).toEqual([]);
    expect(getFloatingNotesCache("user-b")).toEqual([]);
  });
});
