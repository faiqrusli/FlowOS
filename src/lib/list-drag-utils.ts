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
  ghost.style.boxShadow = "var(--shadow-lg)";
  ghost.style.transform = "scale(1.015)";
  ghost.style.transformOrigin = "top left";
  document.body.appendChild(ghost);
  event.dataTransfer.setDragImage(ghost, offsetX * 1.015, offsetY * 1.015);
  requestAnimationFrame(() => ghost.remove());
}

/** Compact Next Up queue drag ghost — title + optional duration. */
export function setCompactQueueDragImage(
  event: { dataTransfer: DataTransfer },
  title: string,
  durationLabel?: string | null
) {
  const ghost = document.createElement("div");
  ghost.style.cssText =
    "position:absolute;top:-1000px;left:-1000px;pointer-events:none;" +
    "display:flex;align-items:center;gap:8px;max-width:280px;" +
    "padding:6px 10px;border-radius:8px;" +
    "border:1px solid var(--border-subtle);background:var(--card);" +
    "color:var(--foreground);font-size:13px;font-weight:500;" +
    "box-shadow:var(--shadow-md);";

  const titleEl = document.createElement("span");
  titleEl.textContent = title;
  titleEl.style.cssText =
    "min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;";
  ghost.appendChild(titleEl);

  if (durationLabel) {
    const dur = document.createElement("span");
    dur.textContent = durationLabel;
    dur.style.cssText =
      "flex-shrink:0;font-size:11px;font-variant-numeric:tabular-nums;" +
      "color:var(--muted-foreground);";
    ghost.appendChild(dur);
  }

  document.body.appendChild(ghost);
  event.dataTransfer.setDragImage(ghost, 12, 12);
  requestAnimationFrame(() => ghost.remove());
}
