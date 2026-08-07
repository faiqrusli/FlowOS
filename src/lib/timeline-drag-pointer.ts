export type BoardPointerEndEvent = {
  type: "pointerup" | "pointercancel";
  clientX: number;
  clientY: number;
};

export function routeBoardPointerEnd(
  event: BoardPointerEndEvent,
  handlers: {
    onCommit: (clientX: number, clientY: number) => void;
    onCancel: () => void;
  },
): void {
  if (event.type === "pointercancel") {
    handlers.onCancel();
    return;
  }
  handlers.onCommit(event.clientX, event.clientY);
}
