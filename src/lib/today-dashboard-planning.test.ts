import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { isTaskIncludedInTodaySurfaces } from "@/lib/today-task-selection";

const dashboardSource = readFileSync(
  new URL("./dashboard.ts", import.meta.url),
  "utf8",
);

describe("Today dashboard task selection", () => {
  it("excludes Later tasks from Today surfaces", () => {
    expect(
      isTaskIncludedInTodaySurfaces({ planning_state: "none" }),
    ).toBe(true);
    expect(
      isTaskIncludedInTodaySurfaces({ planning_state: "later" }),
    ).toBe(false);
  });

  it("filters dashboard tasks before progress and schedule calculations", () => {
    expect(dashboardSource).toContain(
      "tasks.filter(isTaskIncludedInTodaySurfaces)",
    );
  });
});
