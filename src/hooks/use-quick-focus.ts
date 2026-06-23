"use client";

import { useFocusSessionContext } from "@/contexts/focus-session-context";

export function useQuickFocus() {
  const { quick } = useFocusSessionContext();
  return quick;
}
