import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getStorageItem,
  readStorageJson,
  removeStorageItem,
  setStorageItem,
  writeStorageJson,
} from "@/lib/safe-storage";

type StorageStub = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

function installStorage(stub: StorageStub) {
  vi.stubGlobal("window", { localStorage: stub });
}

function memoryStorage(): StorageStub {
  const map = new Map<string, string>();
  return {
    getItem: (key) => (map.has(key) ? (map.get(key) as string) : null),
    setItem: (key, value) => {
      map.set(key, value);
    },
    removeItem: (key) => {
      map.delete(key);
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("safe-storage without a window (SSR)", () => {
  it("reads return null / fallback and writes are no-ops", () => {
    expect(getStorageItem("k")).toBeNull();
    expect(readStorageJson("k", { a: 1 })).toEqual({ a: 1 });
    // Should not throw despite no window.
    expect(() => setStorageItem("k", "v")).not.toThrow();
    expect(() => writeStorageJson("k", { a: 1 })).not.toThrow();
    expect(() => removeStorageItem("k")).not.toThrow();
  });
});

describe("safe-storage with a working window", () => {
  it("round-trips raw strings", () => {
    installStorage(memoryStorage());
    setStorageItem("greeting", "hello");
    expect(getStorageItem("greeting")).toBe("hello");
    removeStorageItem("greeting");
    expect(getStorageItem("greeting")).toBeNull();
  });

  it("round-trips JSON values", () => {
    installStorage(memoryStorage());
    writeStorageJson("cfg", { count: 2, items: ["a", "b"] });
    expect(readStorageJson("cfg", null)).toEqual({
      count: 2,
      items: ["a", "b"],
    });
  });

  it("returns the fallback for a missing key", () => {
    installStorage(memoryStorage());
    expect(readStorageJson("nope", "fallback")).toBe("fallback");
  });

  it("returns the fallback when stored JSON is corrupt", () => {
    const stub = memoryStorage();
    stub.setItem("cfg", "{not json");
    installStorage(stub);
    expect(readStorageJson("cfg", { ok: true })).toEqual({ ok: true });
  });
});

describe("safe-storage when localStorage throws", () => {
  const throwingStorage: StorageStub = {
    getItem: () => {
      throw new Error("blocked");
    },
    setItem: () => {
      throw new Error("quota");
    },
    removeItem: () => {
      throw new Error("blocked");
    },
  };

  it("swallows read errors and returns the fallback", () => {
    installStorage(throwingStorage);
    expect(getStorageItem("k")).toBeNull();
    expect(readStorageJson("k", 7)).toBe(7);
  });

  it("swallows write and remove errors", () => {
    installStorage(throwingStorage);
    expect(() => setStorageItem("k", "v")).not.toThrow();
    expect(() => writeStorageJson("k", { a: 1 })).not.toThrow();
    expect(() => removeStorageItem("k")).not.toThrow();
  });
});
