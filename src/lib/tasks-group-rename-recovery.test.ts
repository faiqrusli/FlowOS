import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(
  new URL("../components/tasks/tasks-page-content.tsx", import.meta.url),
  "utf8",
);
const boardSource = readFileSync(
  new URL("../components/tasks/tasks-board-view.tsx", import.meta.url),
  "utf8",
);

describe("Tasks group rename recovery", () => {
  it("returns rename persistence success from the page handler", () => {
    const start = pageSource.indexOf("async function handleRenameGroup");
    const end = pageSource.indexOf("\n  async function handleUpdateGroupAppearance", start);
    const handler = pageSource.slice(start, end);

    expect(handler).toMatch(/return true[\s\S]*catch \(err\)[\s\S]*return false/);
  });

  it("closes group-title editing only after a successful rename", () => {
    const start = boardSource.indexOf("async function saveGroupTitle");
    const end = boardSource.indexOf("\n  function openCompose", start);
    const handler = boardSource.slice(start, end);

    expect(handler).toMatch(
      /const saved = await onRenameGroup\([\s\S]*?if \(!saved\) return;[\s\S]*?setEditingGroupId\(null\)/,
    );
  });
});
