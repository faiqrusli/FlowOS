import { describe, expect, it, vi } from "vitest";
import { createLatestFrameCoalescer } from "@/lib/dnd/frame-coalescer";

describe("latest frame coalescer", () => {
  it("flushes only the newest scheduled value once per frame", () => {
    const callbacks: Array<() => void> = [];
    const onFrame = vi.fn();
    const coalescer = createLatestFrameCoalescer(
      (callback) => {
        callbacks.push(callback);
        return callbacks.length;
      },
      vi.fn(),
      onFrame,
    );

    coalescer.schedule({ clientY: 100 });
    coalescer.schedule({ clientY: 140 });
    expect(onFrame).not.toHaveBeenCalled();

    callbacks[0]();

    expect(onFrame).toHaveBeenCalledOnce();
    expect(onFrame).toHaveBeenCalledWith({ clientY: 140 });
  });

  it("cancels a pending frame without flushing stale input", () => {
    const callbacks: Array<() => void> = [];
    const cancelFrame = vi.fn();
    const onFrame = vi.fn();
    const coalescer = createLatestFrameCoalescer(
      (callback) => {
        callbacks.push(callback);
        return callbacks.length;
      },
      cancelFrame,
      onFrame,
    );

    coalescer.schedule({ clientY: 100 });
    coalescer.cancel();
    callbacks[0]();

    expect(cancelFrame).toHaveBeenCalledWith(1);
    expect(onFrame).not.toHaveBeenCalled();
  });
});