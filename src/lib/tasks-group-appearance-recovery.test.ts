import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(
  new URL("../components/tasks/tasks-page-content.tsx", import.meta.url),
  "utf8",
);
const dialogSource = readFileSync(
  new URL("../components/tasks/task-group-appearance-dialog.tsx", import.meta.url),
  "utf8",
);

describe("Tasks group appearance recovery", () => {
  it("returns appearance persistence success from the page handler", () => {
    const start = pageSource.indexOf("async function handleUpdateGroupAppearance");
    const end = pageSource.indexOf("\n  async function handleUpdateGroupSortMode", start);
    const handler = pageSource.slice(start, end);

    expect(handler).toMatch(/return true[\s\S]*catch \(err\)[\s\S]*return false/);
  });

  it("closes the appearance dialog only after a successful save", () => {
    const start = dialogSource.indexOf("async function handleSubmit");
    const end = dialogSource.indexOf("\n  return (", start);
    const handler = dialogSource.slice(start, end);

    expect(handler).toMatch(
      /const saved = await onSave\([\s\S]*?if \(saved\) onOpenChange\(false\)/,
    );
  });
});
