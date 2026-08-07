import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(
  new URL("../components/reflection/reflection-page-content.tsx", import.meta.url),
  "utf8",
);

describe("Reflection first-use defaults", () => {
  it("does not seed fabricated evidence into a new reflection", () => {
    expect(pageSource).toContain("setCustomEntries([createEmptyCustomEntry()])");
    expect(pageSource).not.toContain('title: "Weight"');
    expect(pageSource).not.toContain('content: "72.4kg"');
  });
});
