export function createLatestFrameCoalescer<T>(
  requestFrame: (callback: () => void) => number,
  cancelFrame: (frameId: number) => void,
  onFrame: (value: T) => void,
) {
  let frameId: number | null = null;
  let pendingValue: T;
  let hasPendingValue = false;

  return {
    schedule(value: T) {
      pendingValue = value;
      hasPendingValue = true;
      if (frameId !== null) return;

      frameId = requestFrame(() => {
        frameId = null;
        if (!hasPendingValue) return;

        hasPendingValue = false;
        onFrame(pendingValue);
      });
    },

    cancel() {
      hasPendingValue = false;
      if (frameId === null) return;

      cancelFrame(frameId);
      frameId = null;
    },
  };
}