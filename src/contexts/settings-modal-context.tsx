"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { SettingsModalSection } from "@/types/settings-modal";

type SettingsModalContextValue = {
  open: boolean;
  section: SettingsModalSection;
  openSettings: (section?: SettingsModalSection) => void;
  closeSettings: () => void;
  setSection: (section: SettingsModalSection) => void;
};

const SettingsModalContext = createContext<SettingsModalContextValue | null>(
  null
);

export function SettingsModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<SettingsModalSection>("account");

  const openSettings = useCallback((next: SettingsModalSection = "account") => {
    setSection(next);
    setOpen(true);
  }, []);

  const closeSettings = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      open,
      section,
      openSettings,
      closeSettings,
      setSection,
    }),
    [open, section, openSettings, closeSettings]
  );

  return (
    <SettingsModalContext.Provider value={value}>
      {children}
    </SettingsModalContext.Provider>
  );
}

export function useSettingsModal() {
  const context = useContext(SettingsModalContext);
  if (!context) {
    throw new Error("useSettingsModal must be used within SettingsModalProvider");
  }
  return context;
}
