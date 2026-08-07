import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  new URL("../components/schedule/schedule-time-grid.tsx", import.meta.url),
  "utf8",
);

describe("Schedule time-grid clock", () => {
  it("does not recreate its interval on Focus ticks", () => {
    expect(source).toContain("const { activeSession } = useFocusSessionContext()");
    expect(source).toContain("}, []);");
    expect(source).not.toContain("}, [tick]);");
  });
});
