"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { saveThemePreference } from "@/lib/settings-preferences";

type ThemeContextValue = {
  theme: "dark";
  resolvedTheme: "dark";
  setTheme: (theme: "dark") => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function forceDarkClass() {
  document.documentElement.classList.add("dark");
  document.documentElement.classList.remove("light");
}

/**
 * FlowOS is dark-only. Keep `.dark` on <html> and ignore legacy light/system prefs
 * so localhost and production resolve the same surface tokens.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    forceDarkClass();
    try {
      const stored = window.localStorage.getItem("flowos.theme");
      if (stored !== "dark") {
        window.localStorage.setItem("flowos.theme", "dark");
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const setTheme = useCallback((_theme: "dark") => {
    forceDarkClass();
    saveThemePreference("dark");
  }, []);

  const value = useMemo(
    () =>
      ({
        theme: "dark",
        resolvedTheme: "dark",
        setTheme,
      }) satisfies ThemeContextValue,
    [setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
