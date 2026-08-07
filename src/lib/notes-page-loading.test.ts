import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(
  new URL("../components/notes/notes-page-content.tsx", import.meta.url),
  "utf8",
);

describe("Notes page loading recovery", () => {
  it("guards area responses by generation and surfaces refresh/delete errors", () => {
    expect(pageSource).toContain("const areaContentGeneration = useRef(0)");
    expect(pageSource).toContain("generation !== areaContentGeneration.current");
    expect(pageSource).toContain("Failed to refresh growth areas.");
    expect(pageSource).toContain("Failed to delete growth area.");
  });
});
