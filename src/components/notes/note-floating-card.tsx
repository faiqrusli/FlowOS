"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, X } from "lucide-react";
import { MarkdownPreview } from "@/components/notes/markdown-preview";
import type { Note } from "@/types/notes";

const HEADER_HEIGHT_PX = 44;

type NoteFloatingCardProps = {
  note: Note;
  offsetIndex: number;
  onClose: () => void;
  onOpenInSidebar: () => void;
};

function clampHeaderPosition(x: number, y: number, cardWidth: number) {
  const maxX = Math.max(0, window.innerWidth - cardWidth);
  const maxY = Math.max(0, window.innerHeight - HEADER_HEIGHT_PX);
  return {
    x: Math.min(Math.max(0, x), maxX),
    y: Math.min(Math.max(0, y), maxY),
  };
}

export function NoteFloatingCard({
  note,
  offsetIndex,
  onClose,
  onOpenInSidebar,
}: NoteFloatingCardProps) {
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({
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
    const card = cardRef.current;
    if (!card) return;
    card.style.left = `${positionRef.current.x}px`;
    card.style.top = `${positionRef.current.y}px`;
  }, [mounted]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function applyPosition(x: number, y: number) {
    positionRef.current = { x, y };
    const card = cardRef.current;
    if (card) {
      card.style.left = `${x}px`;
      card.style.top = `${y}px`;
    }
  }

  function handleHeaderPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: positionRef.current.x,
      originY: positionRef.current.y,
    };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) {
      return;
    }

    const cardWidth = cardRef.current?.offsetWidth ?? 360;
    const next = clampHeaderPosition(
      dragRef.current.originX + (event.clientX - dragRef.current.startX),
      dragRef.current.originY + (event.clientY - dragRef.current.startY),
      cardWidth
    );
    applyPosition(next.x, next.y);
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) {
      return;
    }

    dragRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function handleBodyKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a") {
      event.preventDefault();
      const body = bodyRef.current;
      if (!body) return;

      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(body);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }

  if (!mounted) return null;

  return createPortal(
    <div
      ref={cardRef}
      className="fixed z-[100] flex w-[min(92vw,360px)] flex-col overflow-hidden rounded-xl border border-border-strong bg-surface-raised shadow-lg will-change-[left,top]"
      style={{
        left: positionRef.current.x,
        top: positionRef.current.y,
      }}
    >
      <div
        className="flex h-11 items-center gap-1 border-b border-border/30 px-2"
        onPointerDown={handleHeaderPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="flex min-w-0 flex-1 cursor-grab select-none items-center px-1 active:cursor-grabbing">
          <p className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
            {note.title || "Untitled"}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenInSidebar}
          className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
          aria-label="Open note in sidebar"
        >
          <ExternalLink className="size-4" />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
          aria-label="Close note card"
        >
          <X className="size-4" />
        </button>
      </div>

      <div
        ref={bodyRef}
        className="max-h-80 overflow-y-auto overflow-x-hidden px-4 py-3 selection:bg-primary/15"
        onKeyDown={handleBodyKeyDown}
        onMouseDown={(event) => event.stopPropagation()}
      >
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
