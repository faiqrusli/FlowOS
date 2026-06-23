"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSettingsModal } from "@/contexts/settings-modal-context";
import type { SettingsModalSection } from "@/types/settings-modal";

type SettingsModalRedirectProps = {
  section: SettingsModalSection;
};

export function SettingsModalRedirect({ section }: SettingsModalRedirectProps) {
  const router = useRouter();
  const { openSettings } = useSettingsModal();

  useEffect(() => {
    openSettings(section);
    router.replace("/");
  }, [openSettings, router, section]);

  return null;
}
