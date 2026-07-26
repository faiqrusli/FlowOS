"use client";

import { useEffect, useId, useState } from "react";
import { BookOpen, NotebookPen, Plus, X, Zap } from "lucide-react";
import { useGlobalRightSidebar } from "@/contexts/global-right-sidebar-context";
import { PANEL_LAYOUT_EASE } from "@/lib/panel-layout-animation";
import { cn } from "@/lib/utils";

const ACTION_STAGGER_MS = 45;
const ACTION_DURATION_MS = 200;

type FabAction = {
  id: "capture" | "reflection" | "notes";
  label: string;
  icon: typeof Zap;
  onSelect: () => void;
};

/**
 * Compact utility control — one circular FAB that expands into Quick Capture,
 * Reflection, and Notes. Replaces the right rail on small screens.
 */
export function CompactUtilityFab() {
  const {
    requestQuickCapture,
    openPanel,
    openReflection,
    openNoteInSidebar,
    openDailyNote,
  } = useGlobalRightSidebar();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const actions: FabAction[] = [
    {
      id: "capture",
      label: "Add",
      icon: Zap,
      onSelect: () => {
        setOpen(false);
        requestQuickCapture();
      },
    },
    {
      id: "reflection",
      label: "Reflection",
      icon: NotebookPen,
      onSelect: () => {
        setOpen(false);
        openReflection();
      },
    },
    {
      id: "notes",
      label: "Notes",
      icon: BookOpen,
      onSelect: () => {
        setOpen(false);
        void openDailyNote().then((noteId) => {
          if (noteId) openNoteInSidebar(noteId);
          else openPanel("notes");
        });
      },
    },
  ];

  return (
    <div className="pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[55] flex flex-col items-end gap-2 lg:hidden">
      {open ? (
        <button
          type="button"
          aria-label="Dismiss utility menu"
          className="pointer-events-auto fixed inset-0 z-[-1] cursor-default bg-transparent"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div
        id={menuId}
        role="menu"
        aria-hidden={!open}
        className="flex flex-col items-end gap-2"
      >
        {actions.map((action, index) => {
          const Icon = action.icon;
          const fromBottom = actions.length - 1 - index;
          return (
            <button
              key={action.id}
              type="button"
              role="menuitem"
              tabIndex={open ? 0 : -1}
              onClick={action.onSelect}
              className={cn(
                "pointer-events-auto flex h-11 items-center gap-2.5 rounded-full border border-border/50 bg-surface-8 py-2 pl-3 pr-4",
                "text-[13px] font-semibold text-foreground shadow-[var(--shadow-overlay)]",
                "origin-bottom-right transition-[transform,opacity] will-change-transform",
                open
                  ? "translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none translate-y-3 scale-90 opacity-0",
              )}
              style={{
                transitionDuration: `${ACTION_DURATION_MS}ms`,
                transitionTimingFunction: PANEL_LAYOUT_EASE,
                transitionDelay: open
                  ? `${fromBottom * ACTION_STAGGER_MS}ms`
                  : "0ms",
              }}
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Icon className="size-3.5" strokeWidth={2} aria-hidden />
              </span>
              {action.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? "Close utilities" : "Open utilities"}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "pointer-events-auto relative flex size-14 items-center justify-center rounded-full",
          "border border-border/40 bg-primary text-primary-foreground shadow-[var(--shadow-overlay)]",
          "transition-[background-color,transform] duration-200",
          open && "bg-surface-8 text-foreground",
        )}
        style={{ transitionTimingFunction: PANEL_LAYOUT_EASE }}
      >
        <Plus
          className={cn(
            "absolute size-6 transition-[opacity,transform] duration-200",
            open
              ? "rotate-90 scale-75 opacity-0"
              : "rotate-0 scale-100 opacity-100",
          )}
          style={{ transitionTimingFunction: PANEL_LAYOUT_EASE }}
          strokeWidth={2.25}
          aria-hidden
        />
        <X
          className={cn(
            "absolute size-6 transition-[opacity,transform] duration-200",
            open
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-75 opacity-0",
          )}
          style={{ transitionTimingFunction: PANEL_LAYOUT_EASE }}
          strokeWidth={2.25}
          aria-hidden
        />
      </button>
    </div>
  );
}
