import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const durationPickerSource = readFileSync(
  new URL("../components/tasks/task-duration-picker.tsx", import.meta.url),
  "utf8",
);

describe("Task duration update feedback", () => {
  it("keeps the duration menu open after a failed preset update", () => {
    const start = durationPickerSource.indexOf("async function applyDuration");
    const end = durationPickerSource.indexOf("\n  return (", start);
    const handler = durationPickerSource.slice(start, end);

    expect(handler).toMatch(
      /const updated = await onChange\(minutes\)[\s\S]*?if \(updated === false\) return;/,
    );
  });

  it("awaits custom duration persistence before closing", () => {
    const start = durationPickerSource.indexOf("async function commitCustom");
    const end = durationPickerSource.indexOf("\n  async function applyDuration", start);
    const handler = durationPickerSource.slice(start, end);

    expect(handler).toMatch(/const committed = await tryCommitCustomValue\(\)/);
    expect(handler).toContain("if (committed) setOpen(false)");
  });
});
