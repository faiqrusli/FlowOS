import { describe, expect, it } from "vitest";
import { minutesToTimeString, createDemoDateBand } from "@/lib/demo/dates";

describe("demo dates", () => {
  it("formats minutes as HH:mm:ss", () => {
    expect(minutesToTimeString(0)).toBe("00:00:00");
    expect(minutesToTimeString(6)).toBe("00:06:00");
    expect(minutesToTimeString(9 * 60 + 30)).toBe("09:30:00");
  });

  it("builds relative day offsets from anchor", () => {
    const band = createDemoDateBand(new Date("2026-07-20T04:00:00+08:00"));
    expect(band.anchorDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(band.d(1)).not.toBe(band.d(0));
    expect(band.d(-1)).not.toBe(band.d(0));
  });
});
