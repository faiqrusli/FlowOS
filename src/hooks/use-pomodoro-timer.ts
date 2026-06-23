"use client";

import { useFocusSessionContext } from "@/contexts/focus-session-context";

export function usePomodoroTimer() {
  const { pomodoro } = useFocusSessionContext();
  return pomodoro;
}
