import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const dialogSource = readFileSync(
  new URL("../components/tasks/task-group-dialog.tsx", import.meta.url),
  "utf8",
);
const boardSource = readFileSync(
  new URL("../components/tasks/tasks-board-view.tsx", import.meta.url),
  "utf8",
);

describe("task group dialog form state", () => {
  it("resets draft values by remounting on the open transition", () => {
    expect(dialogSource).not.toContain("useEffect(() => {");
    expect(dialogSource).toContain("pickRandomGroupColor()");
    expect(boardSource).toContain('key={newGroupDialogOpen ? "open" : "closed"}');
  });
});
