import { describe, expect, it, vi } from "vitest";
import { routeBoardPointerEnd } from "@/lib/timeline-drag-pointer";

describe("timeline board pointer end", () => {
  it("commits only on pointerup", () => {
    const onCommit = vi.fn();
    const onCancel = vi.fn();

    routeBoardPointerEnd(
      { type: "pointerup", clientX: 120, clientY: 240 },
      { onCommit, onCancel },
    );

    expect(onCommit).toHaveBeenCalledWith(120, 240);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("cancels pointercancel without committing", () => {
    const onCommit = vi.fn();
    const onCancel = vi.fn();

    routeBoardPointerEnd(
      { type: "pointercancel", clientX: 120, clientY: 240 },
      { onCommit, onCancel },
    );

    expect(onCommit).not.toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalledOnce();
  });
});
