"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { MarkdownPreview } from "@/components/notes/markdown-preview";
import { cn } from "@/lib/utils";
import type { Note } from "@/types/notes";

type NoteFloatingCardProps = {
  note: Note;
  offsetIndex: number;
  onClose: () => void;
};

export function NoteFloatingCard({
  note,
  offsetIndex,
  onClose,
}: NoteFloatingCardProps) {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({
    x: 120 + offsetIndex * 24,
    y: 120 + offsetIndex * 24,
  });
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
    };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) {
      return;
    }

    setPosition({
      x: dragRef.current.originX + (event.clientX - dragRef.current.startX),
      y: dragRef.current.originY + (event.clientY - dragRef.current.startY),
    });
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) {
      return;
    }

    dragRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed z-[100] flex w-[min(92vw,360px)] flex-col overflow-hidden rounded-xl border border-border/50 bg-card shadow-xl"
      style={{ left: position.x, top: position.y }}
    >
      <div
        className={cn(
          "flex cursor-grab items-center gap-2 border-b border-border/30 px-3 py-2 active:cursor-grabbing"
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
          {note.title || "Untitled"}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close note card"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto px-4 py-3">
        {note.content.trim() ? (
          <MarkdownPreview content={note.content} />
        ) : (
          <p className="text-sm text-muted-foreground">No content yet.</p>
        )}
      </div>
    </div>,
    document.body
  );
}
