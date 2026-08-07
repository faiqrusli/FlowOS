import { afterEach, describe, expect, it, vi } from "vitest";
import {
  clearSidebarNotesCache,
  getSidebarNotesCache,
  setSidebarNotesCache,
} from "@/lib/sidebar-notes-cache";
import type { GrowthAreaWithCounts, Note } from "@/types/notes";

function installSessionStorage() {
  const values = new Map<string, string>();
  vi.stubGlobal("window", {
    sessionStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    },
  });
}

describe("sidebar notes cache ownership", () => {
  afterEach(() => {
    clearSidebarNotesCache();
    vi.unstubAllGlobals();
  });

  it("does not expose one owner's cache to another owner", () => {
    installSessionStorage();
    const areas: GrowthAreaWithCounts[] = [];
    const notes: Note[] = [];

    setSidebarNotesCache("user-a", areas, notes);

    expect(getSidebarNotesCache("user-a")?.userId).toBe("user-a");
    expect(getSidebarNotesCache("user-b")).toBeNull();
    expect(getSidebarNotesCache(null)).toBeNull();
  });

  it("rejects legacy unowned payloads", () => {
    const values = new Map([["flowos.sidebar-notes.cache", JSON.stringify({ areas: [], notes: [], fetchedAt: 1 })]]);
    vi.stubGlobal("window", {
      sessionStorage: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: () => {},
        removeItem: () => {},
      },
    });

    expect(getSidebarNotesCache("user-a")).toBeNull();
  });
});
