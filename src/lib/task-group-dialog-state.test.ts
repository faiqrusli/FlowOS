import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const dialogSource = readFileSync(
  new URL("../components/tasks/task-group-dialog.tsx", import.meta.url),
  "utf8",
);

describe("task group dialog form state", () => {
  it("resets draft values only when the dialog opens", () => {
    const resetEffectStart = dialogSource.indexOf("useEffect(() => {");
    const resetEffectEnd = dialogSource.indexOf("  }, [", resetEffectStart);
    const resetEffect = dialogSource.slice(resetEffectStart, resetEffectEnd);
    const dependencies = dialogSource.slice(
      resetEffectEnd,
      dialogSource.indexOf(");", resetEffectEnd) + 2,
    );

    expect(resetEffect).toContain("setName(\"\")");
    expect(resetEffect).toContain("setIcon(null)");
    expect(resetEffect).toContain("setColor(pickRandomGroupColor())");
    expect(dependencies).toMatch(/\[open\]\);/);
  });
});
