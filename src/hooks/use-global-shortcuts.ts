"use client";

import { useEffect } from "react";
import { useGlobalRightSidebar } from "@/contexts/global-right-sidebar-context";

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

export function useGlobalShortcuts() {
  const {
    requestQuickCapture,
    openDailyNote,
    createNewNote,
    openReflection,
  } = useGlobalRightSidebar();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || isEditableTarget(event.target)) return;

      const key = event.key.toLowerCase();

      if (event.ctrlKey && event.altKey && !event.shiftKey && key === "n") {
        event.preventDefault();
        void createNewNote();
        return;
      }

      if (!event.ctrlKey || !event.shiftKey || event.altKey) {
        return;
      }

      if (key === "a") {
        event.preventDefault();
        requestQuickCapture();
        return;
      }

      if (key === "d") {
        event.preventDefault();
        void openDailyNote();
        return;
      }

      if (key === "r") {
        event.preventDefault();
        openReflection();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    requestQuickCapture,
    openDailyNote,
    createNewNote,
    openReflection,
  ]);
}
