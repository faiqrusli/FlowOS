"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { GrowthAreaWithCounts } from "@/types/notes";

type NoteMoveDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  areas: GrowthAreaWithCounts[];
  currentAreaId: string;
  onMove: (areaId: string) => void;
};

export function NoteMoveDialog({
  open,
  onOpenChange,
  areas,
  currentAreaId,
  onMove,
}: NoteMoveDialogProps) {
  const [query, setQuery] = useState("");

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return areas.filter((area) => {
      if (area.id === currentAreaId) return false;
      if (!q) return true;
      return (
        area.name.toLowerCase().includes(q) ||
        (area.description ?? "").toLowerCase().includes(q)
      );
    });
  }, [areas, currentAreaId, query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="border-b border-border/30 px-4 py-3">
          <DialogTitle className="text-base">Move note to</DialogTitle>
        </DialogHeader>

        <div className="border-b border-border/30 px-3 py-2.5">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Move note to..."
              className="h-9 pl-8 text-sm"
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto p-2">
          {suggestions.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              No other growth areas found.
            </p>
          ) : (
            <ul className="space-y-0.5">
              {suggestions.map((area) => (
                <li key={area.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onMove(area.id);
                      onOpenChange(false);
                      setQuery("");
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-surface-hover"
                  >
                    <span className="text-base leading-none">{area.emoji}</span>
                    <span className="truncate text-sm font-medium">
                      {area.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
