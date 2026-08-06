import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const dialogSource = readFileSync(
  new URL("../components/tasks/task-group-appearance-dialog.tsx", import.meta.url),
  "utf8",
);
const boardSource = readFileSync(
  new URL("../components/tasks/tasks-board-view.tsx", import.meta.url),
  "utf8",
);

describe("Tasks group appearance draft state", () => {
  it("resets appearance draft by remounting on the open transition", () => {
    expect(dialogSource).not.toContain("useEffect(() => {");
    expect(dialogSource).toContain("getTaskGroupAppearance(group)");
    expect(boardSource).toContain("appearanceGroupId !== null ? \"open\" : \"closed\"");
  });

  it("remounts when the selected appearance group changes", () => {
    expect(boardSource).toContain(
      "key={`${appearanceGroup?.id ?? \"none\"}-",
    );
  });
});
