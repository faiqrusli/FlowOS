"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import {
  ChevronLeft,
  ChevronRight,
  GripVertical,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getGrowthAreaSidebarExpanded,
  setGrowthAreaSidebarExpanded,
} from "@/lib/growth-area-sidebar-preference";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  initialDropBeforeId,
  reorderByDropBeforeId,
  resolveDropBeforeId,
  type DropBeforeId,
} from "@/lib/list-drag-utils";
import { cn } from "@/lib/utils";
import type { GrowthAreaWithCounts } from "@/types/notes";

const WIDTH_COLLAPSED = 56;
const WIDTH_EXPANDED = 208;
const NARROW_LAYOUT_MEDIA_QUERY = "(max-width: 1279px)";

function growthAreaHoverTitle(area: GrowthAreaWithCounts) {
  const description = area.description?.trim();
  return description || area.name;
}

type GrowthAreaSidebarProps = {
  areas: GrowthAreaWithCounts[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onEdit: (area: GrowthAreaWithCounts) => void;
  onDelete: (area: GrowthAreaWithCounts) => void;
  onReorder: (areas: GrowthAreaWithCounts[]) => void;
};

export function GrowthAreaSidebar({
  areas,
  selectedId,
  onSelect,
  onCreate,
  onEdit,
  onDelete,
  onReorder,
}: GrowthAreaSidebarProps) {
  const navRef = useRef<HTMLElement>(null);
  const [dragAreaId, setDragAreaId] = useState<string | null>(null);
  const [dropBeforeId, setDropBeforeId] = useState<DropBeforeId>(null);
  const dragAreaIdRef = useRef<string | null>(null);
  const dropBeforeIdRef = useRef<DropBeforeId>(null);
  const areasRef = useRef(areas);

  const [userExpanded, setUserExpanded] = useState(false);
  const [animateWidth, setAnimateWidth] = useState(false);
  const isNarrowLayout = useMediaQuery(NARROW_LAYOUT_MEDIA_QUERY);
  const expanded = userExpanded;
  const wasNarrowLayoutRef = useRef(isNarrowLayout);

  useEffect(() => {
    setUserExpanded(getGrowthAreaSidebarExpanded());
    const frame = requestAnimationFrame(() => setAnimateWidth(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (isNarrowLayout && !wasNarrowLayoutRef.current) {
      setUserExpanded(false);
      setGrowthAreaSidebarExpanded(false);
    }
    wasNarrowLayoutRef.current = isNarrowLayout;
  }, [isNarrowLayout]);

  function expandSidebar() {
    setUserExpanded(true);
    setGrowthAreaSidebarExpanded(true);
  }

  function collapseSidebar() {
    setUserExpanded(false);
    setGrowthAreaSidebarExpanded(false);
  }

  function handleSelectArea(id: string) {
    onSelect(id);
  }

  useEffect(() => {
    areasRef.current = areas;
  }, [areas]);

  function resetDrag() {
    dragAreaIdRef.current = null;
    dropBeforeIdRef.current = null;
    setDragAreaId(null);
    setDropBeforeId(null);
  }

  function setDropBeforeIfChanged(next: DropBeforeId) {
    if (dropBeforeIdRef.current === next) return;
    dropBeforeIdRef.current = next;
    setDropBeforeId(next);
  }

  function handleAreaDragStart(areaId: string, event: DragEvent<HTMLButtonElement>) {
    event.stopPropagation();
    dragAreaIdRef.current = areaId;
    setDragAreaId(areaId);

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", areaId);

    const orderedIds = areasRef.current.map((area) => area.id);
    const initial = initialDropBeforeId(orderedIds, areaId);
    dropBeforeIdRef.current = initial;
    setDropBeforeId(initial);
  }

  function handleNavDragOver(event: DragEvent<HTMLElement>) {
    if (!dragAreaIdRef.current || !navRef.current) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    const orderedIds = areasRef.current.map((area) => area.id);
    const beforeId = resolveDropBeforeId(
      orderedIds,
      navRef.current,
      "data-growth-area-row",
      event.clientY,
      "y",
      dragAreaIdRef.current
    );
    setDropBeforeIfChanged(beforeId);
  }

  function handleAreaDragEnd() {
    const activeId = dragAreaIdRef.current;
    const beforeId = dropBeforeIdRef.current;

    if (activeId !== null) {
      const next = reorderByDropBeforeId(
        areasRef.current,
        activeId,
        beforeId
      );
      if (next !== areasRef.current) {
        onReorder(next);
      }
    }

    resetDrag();
  }

  const width = expanded ? WIDTH_EXPANDED : WIDTH_COLLAPSED;

  return (
    <aside
      style={{ width }}
      className={cn(
        "flex max-h-full shrink-0 flex-col self-start overflow-visible rounded-2xl border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-none",
        animateWidth && "transition-[width] duration-200 ease-out",
        isNarrowLayout && expanded && "absolute top-0 left-0 z-30 h-full max-h-full shadow-md"
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center border-b border-border/30",
          expanded ? "justify-between px-2.5 py-2.5" : "justify-center py-3"
        )}
      >
        {expanded ? (
          <>
            <div className="min-w-0 px-1">
              <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                Growth areas
              </p>
              <p className="truncate text-xs text-muted-foreground">
                Your personal folders
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onCreate}
                className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
                aria-label="Add growth area"
                title="Add growth area"
              >
                <Plus className="size-4" />
              </button>
              <button
                type="button"
                onClick={collapseSidebar}
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                aria-label="Collapse growth areas"
              >
                <ChevronLeft className="size-4" />
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={expandSidebar}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            aria-label="Expand growth areas"
          >
            <ChevronRight className="size-4" />
          </button>
        )}
      </div>

      <nav
        ref={navRef}
        onDragOver={expanded ? handleNavDragOver : undefined}
        className={cn(
          "max-h-[calc(100dvh-10rem)] overflow-x-hidden overflow-y-auto",
          expanded ? "space-y-0.5 p-1.5" : "flex flex-col items-center gap-0.5 py-2"
        )}
      >
        {areas.map((area) => {
          const active = area.id === selectedId;
          const isDragging = dragAreaId === area.id;

          if (!expanded) {
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => handleSelectArea(area.id)}
                title={growthAreaHoverTitle(area)}
                aria-label={`${area.name} (${area.note_count})`}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl text-lg leading-none transition-[background-color,box-shadow]",
                  active
                    ? "bg-surface-hover text-foreground shadow-sm ring-1 ring-border/50"
                    : "hover:bg-surface-hover/70"
                )}
              >
                {area.emoji}
              </button>
            );
          }

          return (
            <div key={area.id}>
              {dropBeforeId === area.id && <AreaDropLine />}
              <div
                data-growth-area-row={area.id}
                className={cn(
                  "group relative flex items-center",
                  isDragging && "opacity-40"
                )}
              >
                <button
                  type="button"
                  draggable
                  onDragStart={(event) => handleAreaDragStart(area.id, event)}
                  onDragEnd={handleAreaDragEnd}
                  onMouseDown={(event) => event.stopPropagation()}
                  className={cn(
                    "flex size-6 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-muted active:cursor-grabbing group-hover:opacity-100",
                    isDragging && "opacity-100"
                  )}
                  aria-label={`Reorder ${area.name}`}
                >
                  <GripVertical className="size-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectArea(area.id)}
                  title={growthAreaHoverTitle(area)}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "flex min-w-0 flex-1 items-center gap-2 rounded-xl py-2 pr-8 pl-1 text-left transition-[background-color,box-shadow]",
                    active
                      ? "bg-surface-hover text-foreground shadow-sm ring-1 ring-border/40"
                      : "hover:bg-surface-hover/70"
                  )}
                >
                  <span className="flex w-6 shrink-0 items-center justify-center text-lg leading-none">
                    {area.emoji || "\u00A0"}
                  </span>
                  <p
                    className={cn(
                      "min-w-0 flex-1 truncate text-sm",
                      active ? "font-semibold text-foreground" : "font-normal"
                    )}
                  >
                    {area.name}{" "}
                    <span className="font-normal tabular-nums text-muted-foreground">
                      ({area.note_count})
                    </span>
                  </p>
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="absolute top-1/2 right-1.5 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
                  >
                    <MoreHorizontal className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem onClick={() => onEdit(area)}>
                      <Pencil className="size-3.5" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(area)}
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
        {dragAreaId !== null && dropBeforeId === null && <AreaDropLine />}
      </nav>
    </aside>
  );
}

function AreaDropLine() {
  return (
    <div
      className="mx-1.5 my-0.5 h-0.5 rounded-full bg-foreground/75"
      aria-hidden
    />
  );
}
