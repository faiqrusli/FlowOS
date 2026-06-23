"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal, Plus, Trash2 } from "lucide-react";
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
import { cn } from "@/lib/utils";
import type { GrowthAreaWithCounts } from "@/types/notes";

const WIDTH_COLLAPSED = 56;
const WIDTH_EXPANDED = 208;

type GrowthAreaSidebarProps = {
  areas: GrowthAreaWithCounts[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onEdit: (area: GrowthAreaWithCounts) => void;
  onDelete: (area: GrowthAreaWithCounts) => void;
};

export function GrowthAreaSidebar({
  areas,
  selectedId,
  onSelect,
  onCreate,
  onEdit,
  onDelete,
}: GrowthAreaSidebarProps) {
  const [expanded, setExpanded] = useState(false);
  const [animateWidth, setAnimateWidth] = useState(false);

  useEffect(() => {
    setExpanded(getGrowthAreaSidebarExpanded());
    const frame = requestAnimationFrame(() => setAnimateWidth(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  function expandSidebar() {
    setExpanded(true);
    setGrowthAreaSidebarExpanded(true);
  }

  function collapseSidebar() {
    setExpanded(false);
    setGrowthAreaSidebarExpanded(false);
  }

  function handleSelectArea(id: string) {
    onSelect(id);
  }

  const width = expanded ? WIDTH_EXPANDED : WIDTH_COLLAPSED;

  return (
    <aside
      style={{ width }}
      className={cn(
        "flex shrink-0 flex-col overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm",
        animateWidth && "transition-[width] duration-200 ease-out"
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
                className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background transition-colors hover:bg-foreground/90"
                aria-label="Create growth area"
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
        className={cn(
          "min-h-0 flex-1 overflow-y-auto overflow-x-hidden",
          expanded ? "space-y-0.5 p-1.5" : "flex flex-col items-center gap-1 py-2"
        )}
      >
        {areas.map((area) => {
          const active = area.id === selectedId;

          if (!expanded) {
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => handleSelectArea(area.id)}
                title={area.name}
                aria-label={`${area.name}, ${area.note_count} notes`}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl text-lg leading-none transition-colors",
                  active
                    ? "bg-foreground text-background shadow-sm"
                    : "hover:bg-muted/60"
                )}
              >
                {area.emoji}
              </button>
            );
          }

          return (
            <div key={area.id} className="group relative">
              <button
                type="button"
                onClick={() => handleSelectArea(area.id)}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors",
                  active
                    ? "bg-foreground text-background shadow-sm"
                    : "hover:bg-muted/60"
                )}
              >
                <span className="text-lg leading-none">{area.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{area.name}</p>
                  <p
                    className={cn(
                      "text-[11px]",
                      active ? "text-background/70" : "text-muted-foreground"
                    )}
                  >
                    {area.note_count} notes
                  </p>
                </div>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    "absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md opacity-0 transition-opacity group-hover:opacity-100",
                    active
                      ? "text-background hover:bg-background/15"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <MoreHorizontal className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem onClick={() => onEdit(area)}>
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete(area)}
                  >
                    <Trash2 className="size-3.5" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
