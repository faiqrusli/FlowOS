import { afterEach, describe, expect, it, vi } from "vitest";
import { createReflectionAutosaveController } from "@/lib/reflection-autosave";

describe("reflection autosave", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("flushes a pending draft before the debounce delay", async () => {
    vi.useFakeTimers();
    const save = vi.fn().mockResolvedValue(undefined);
    const controller = createReflectionAutosaveController(save, { delayMs: 400 });

    controller.schedule("typed immediately");
    await controller.flush();

    expect(save).toHaveBeenCalledWith("typed immediately");
    expect(controller.isDirty()).toBe(false);
  });

  it("waits for an active save and keeps newer drafts dirty", async () => {
    let resolveFirst: (() => void) | undefined;
    const save = vi
      .fn()
      .mockImplementationOnce(
        () => new Promise<void>((resolve) => (resolveFirst = resolve)),
      )
      .mockResolvedValue(undefined);
    const controller = createReflectionAutosaveController(save, { delayMs: 400 });

    controller.schedule("first");
    const firstFlush = controller.flush();
    controller.schedule("second");
    resolveFirst?.();
    await firstFlush;
    await controller.flush();

    expect(save.mock.calls.map(([value]) => value)).toEqual(["first", "second"]);
  });

  it("cancels a draft without writing it", async () => {
    vi.useFakeTimers();
    const save = vi.fn().mockResolvedValue(undefined);
    const controller = createReflectionAutosaveController(save);

    controller.schedule("discarded");
    controller.cancel();
    await vi.advanceTimersByTimeAsync(500);

    expect(save).not.toHaveBeenCalled();
    expect(controller.isDirty()).toBe(false);
  });
});