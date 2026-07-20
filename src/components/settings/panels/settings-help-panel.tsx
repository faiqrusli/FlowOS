"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KeyboardShortcutsSection } from "@/components/about/keyboard-shortcuts-section";
import { useSettingsModal } from "@/contexts/settings-modal-context";

export function SettingsHelpPanel() {
  const { closeSettings } = useSettingsModal();

  return (
    <div className="space-y-5">
      <section>
        <p className="text-sm leading-relaxed text-muted-foreground">
          A personal execution system for your day.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 justify-start"
          render={<Link href="/about" onClick={closeSettings} />}
        >
          <BookOpen data-icon="inline-start" />
          Open About
        </Button>
      </section>

      <KeyboardShortcutsSection compact />
    </div>
  );
}
