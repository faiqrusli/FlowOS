import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const contextSource = readFileSync(
  new URL("../contexts/focus-session-context.tsx", import.meta.url),
  "utf8",
);
const totalsSource = readFileSync(
  new URL("./focus-task-totals.ts", import.meta.url),
  "utf8",
);

describe("Focus task-total persistence boundary", () => {
  it("does not upsert task totals from the active-session state writer", () => {
    const updateStart = contextSource.indexOf("const updateSession");
    const updateEnd = contextSource.indexOf("const hardResetActiveSession", updateStart);
    const updateSource = contextSource.slice(updateStart, updateEnd);

    expect(updateSource).not.toContain("persistFocusTaskTotals");
  });

  it("persists task totals after the parent session save using its database id", () => {
    const saveIndex = contextSource.indexOf(
      "const saved = await persistFocusSessionEnd",
    );
    const totalsIndex = contextSource.indexOf(
      "await persistFocusTaskTotals",
      saveIndex,
    );

    expect(saveIndex).toBeGreaterThan(-1);
    expect(totalsIndex).toBeGreaterThan(saveIndex);
    expect(contextSource.slice(totalsIndex, totalsIndex + 180)).toContain(
      "saved.id",
    );
    expect(totalsSource).toContain("focus_session_id: persistedFocusSessionId");
    expect(contextSource).toContain("pending.persisted_session_id");
    expect(contextSource).toMatch(
      /persistFocusTaskTotals\(\s*pending\.session\s*,\s*pending\.persisted_session_id/,
    );
  });
});
