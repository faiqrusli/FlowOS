let cleanup: (() => void) | null = null;

/** Block text selection while a dnd-kit task drag is active. */
export function blockDragTextSelection() {
  unblockDragTextSelection();

  const preventSelect = (event: Event) => {
    event.preventDefault();
  };

  document.addEventListener("selectstart", preventSelect);
  cleanup = () => {
    document.removeEventListener("selectstart", preventSelect);
    cleanup = null;
  };
}

export function unblockDragTextSelection() {
  cleanup?.();
}
