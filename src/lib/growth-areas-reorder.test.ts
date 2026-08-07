import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./growth-areas.ts", import.meta.url), "utf8");

describe("growth-area reorder persistence", () => {
  it("surfaces an individual update error", () => {
    const start = source.indexOf("export async function reorderGrowthAreas");
    const handler = source.slice(start);

    expect(handler).toContain("const results = await Promise.all");
    expect(handler).toContain("results.find((result) => result.error)?.error");
    expect(handler).toContain("throw new GrowthAreasError(reorderError.message)");
  });
});
