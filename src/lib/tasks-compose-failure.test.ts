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

function getFunctionSource(source: string, name: string): string {
  const start = source.indexOf(`function ${name}`);
  expect(start).toBeGreaterThan(-1);

  const end = source.indexOf("\n  async function ", start + 1);
  return source.slice(start, end === -1 ? undefined : end);
}

describe("Tasks compose failure recovery", () => {
  it("returns creation success so compose can preserve failed drafts", () => {
    const createTask = getFunctionSource(pageSource, "handleCreateTask");

    expect(createTask).toMatch(/return true[\s\S]*catch \(err\)[\s\S]*return false/);
  });

  it("keeps compose open when creation does not succeed", () => {
    const openCompose = getFunctionSource(boardSource, "openCompose");
    const finishCompose = getFunctionSource(boardSource, "finishCompose");
    const submitCompose = getFunctionSource(boardSource, "submitCompose");

    expect(finishCompose).toMatch(
      /const created = await onCreateTask\([\s\S]*?if \(!created\) return false[\s\S]*?setComposeText\(\"\"\)/,
    );
    expect(openCompose).toMatch(/then\(\(created\) => \{[\s\S]*?if \(!created\) return;/);
    expect(submitCompose).toMatch(
      /const created = await finishCompose\([\s\S]*?if \(!created\) return;/,
    );
  });
});
