import { afterEach, describe, expect, it, vi } from "vitest";
import {
  clearReflectionDraft,
  readReflectionDraft,
  writeReflectionDraft,
} from "@/lib/reflection-draft-storage";

describe("reflection draft storage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("scopes drafts by user and product date", () => {
    const values = new Map<string, string>();
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
        removeItem: (key: string) => values.delete(key),
      },
    });

    const draft = {
      went_well: "A",
      went_wrong: "B",
      custom_entries: [],
      custom_kanbans: [],
    };
    writeReflectionDraft("user-a", "2026-08-07", draft);

    expect(readReflectionDraft("user-a", "2026-08-07")).toEqual(draft);
    expect(readReflectionDraft("user-b", "2026-08-07")).toBeNull();
    expect(readReflectionDraft("user-a", "2026-08-08")).toBeNull();

    clearReflectionDraft("user-a", "2026-08-07");
    expect(readReflectionDraft("user-a", "2026-08-07")).toBeNull();
  });
});
