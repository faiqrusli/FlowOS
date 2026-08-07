import { describe, expect, it, vi } from "vitest";
import {
  clearActiveSession,
  readActiveSession,
  writeActiveSession,
} from "@/lib/focus-active-session";

describe("Focus local storage ownership", () => {
  it("does not read or write without an authenticated owner", () => {
    const writeStorageJson = vi.fn();
    expect(readActiveSession(null)).toBeNull();
    clearActiveSession(null);
    expect(writeStorageJson).not.toHaveBeenCalled();
  });
});
