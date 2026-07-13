import { describe, expect, it } from "vitest";
import {
  inferNextUpDropSource,
  parseScheduleDrop,
} from "@/lib/next-up-drag";

function makeDataTransfer(values: Record<string, string>, types: string[]) {
  return {
    types,
    getData(type: string) {
      return values[type] ?? "";
    },
    dropEffect: "none",
  } as DataTransfer;
}

describe("next-up-drag", () => {
  it("infers tasks card source when timeline source mime is absent", () => {
    expect(inferNextUpDropSource("task", null)).toBe("tasks");
    expect(inferNextUpDropSource("habit", null)).toBe("habits");
  });

  it("infers timeline source when timeline drag source mime is present", () => {
    expect(inferNextUpDropSource("task", "timeline")).toBe("timeline");
    expect(inferNextUpDropSource("habit", "pool")).toBe("timeline");
  });

  it("parses schedule drop payloads", () => {
    const event = {
      dataTransfer: makeDataTransfer(
        {
          "application/x-flowos-schedule-kind": "task",
          "application/x-flowos-schedule-id": "task-1",
          "application/x-flowos-drag-source": "timeline",
        },
        [
          "application/x-flowos-schedule-kind",
          "application/x-flowos-schedule-id",
          "application/x-flowos-drag-source",
        ]
      ),
    };

    expect(parseScheduleDrop(event)).toEqual({
      kind: "task",
      id: "task-1",
      source: "timeline",
    });
  });
});
