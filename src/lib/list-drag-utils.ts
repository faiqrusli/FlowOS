export type DropBeforeId = string | null;

export function initialDropBeforeId(
  orderedIds: string[],
  dragId: string
): DropBeforeId {
  const index = orderedIds.indexOf(dragId);
  if (index === -1) return null;
  return orderedIds[index + 1] ?? null;
}

export function resolveDropBeforeId(
  orderedIds: string[],
  container: HTMLElement,
  attribute: string,
  clientPos: number,
  axis: "x" | "y",
  excludeId?: string
): DropBeforeId {
  const visibleIds = excludeId
    ? orderedIds.filter((id) => id !== excludeId)
    : orderedIds;

  for (const id of visibleIds) {
    const el = container.querySelector<HTMLElement>(`[${attribute}="${id}"]`);
    if (!el) continue;

    const rect = el.getBoundingClientRect();
    const midpoint =
      axis === "y" ? rect.top + rect.height / 2 : rect.left + rect.width / 2;
    if (clientPos < midpoint) return id;
  }

  return null;
}

export function reorderByDropBeforeId<T extends { id: string }>(
  items: T[],
  dragId: string,
  beforeId: DropBeforeId
): T[] {
  const moving = items.find((item) => item.id === dragId);
  if (!moving) return items;

  const stripped = items.filter((item) => item.id !== dragId);
  if (beforeId === null) return [...stripped, moving];

  const insertIndex = stripped.findIndex((item) => item.id === beforeId);
  if (insertIndex === -1) return items;

  const next = [...stripped];
  next.splice(insertIndex, 0, moving);
  return next;
}

export function setDragImageFromElement(
  event: { dataTransfer: DataTransfer; currentTarget: EventTarget | null },
  sourceEl: HTMLElement,
  offsetX = 20,
  offsetY = 20
) {
  const ghost = sourceEl.cloneNode(true) as HTMLElement;
  ghost.style.width = `${sourceEl.offsetWidth}px`;
  ghost.style.opacity = "1";
  ghost.style.position = "absolute";
  ghost.style.top = "-1000px";
  ghost.style.left = "-1000px";
  ghost.style.pointerEvents = "none";
  document.body.appendChild(ghost);
  event.dataTransfer.setDragImage(ghost, offsetX, offsetY);
  requestAnimationFrame(() => ghost.remove());
}
