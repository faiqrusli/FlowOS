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
  it("resets appearance draft on open rather than object refresh", () => {
    const resetBodyStart = dialogSource.indexOf(
      "const currentGroup = groupRef.current",
    );
    const effectStart = dialogSource.lastIndexOf(
      "useEffect(() => {",
      resetBodyStart,
    );
    const effectEnd = dialogSource.indexOf("  }, [", effectStart);
    const effect = dialogSource.slice(effectStart, effectEnd);
    const dependencies = dialogSource.slice(
      effectEnd,
      dialogSource.indexOf(");", effectEnd) + 2,
    );

    expect(effect).toContain("setIcon(");
    expect(effect).toContain("setColor(");
    expect(dependencies).toMatch(/\[open\]\);/);
  });

  it("remounts when the selected appearance group changes", () => {
    expect(boardSource).toContain('key={appearanceGroup?.id ?? "none"}');
  });
});
