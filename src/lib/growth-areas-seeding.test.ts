import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const growthAreasSource = readFileSync(
  new URL("./growth-areas.ts", import.meta.url),
  "utf8",
);

describe("growth-area first-use seeding", () => {
  it("inserts missing defaults without duplicating Daily Notes or custom areas", () => {
    expect(growthAreasSource).toContain("const existingNames = new Set");
    expect(growthAreasSource).toContain("const missingDefaults = DEFAULT_GROWTH_AREAS.filter");
    expect(growthAreasSource).toContain("seedDefaultGrowthAreas(userId, missingDefaults)");
    expect(growthAreasSource).not.toContain("if (!areas?.length)");
  });
});
