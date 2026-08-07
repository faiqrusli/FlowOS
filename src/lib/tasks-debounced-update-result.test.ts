import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const sourceFiles = [
  readFileSync(
    new URL("../components/tasks/tasks-page-content.tsx", import.meta.url),
    "utf8",
  ),
  readFileSync(
    new URL("../components/workplace/workplace-page-content.tsx", import.meta.url),
    "utf8",
  ),
];

describe("debounced task update result", () => {
  it.each(sourceFiles)(
    "returns the debounced persistence result instead of immediate success",
    (source) => {
      const handlerStart = Math.max(
        source.indexOf("async function handleUpdateTask"),
        source.indexOf("const handleUpdateTask = useCallback"),
      );
      expect(handlerStart).toBeGreaterThan(-1);
      expect(source.slice(handlerStart)).toMatch(
        /return scheduleTaskPersist\(taskId/,
      );
    },
  );
});
