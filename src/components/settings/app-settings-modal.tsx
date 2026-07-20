"use client";

import type { ComponentType } from "react";
import { BookOpen, Palette, Settings, UserRound, X } from "lucide-react";
import { SettingsAccountPanel } from "@/components/settings/panels/settings-account-panel";
import { SettingsAppearancePanel } from "@/components/settings/panels/settings-appearance-panel";
import { SettingsHelpPanel } from "@/components/settings/panels/settings-help-panel";
import { SettingsPreferencesPanel } from "@/components/settings/panels/settings-preferences-panel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useSettingsModal } from "@/contexts/settings-modal-context";
import { cn } from "@/lib/utils";
import type { SettingsModalSection } from "@/types/settings-modal";

const NAV_ITEMS: {
  id: SettingsModalSection;
  label: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
}[] = [
  { id: "account", label: "Account", icon: UserRound, title: "My Account" },
  { id: "settings", label: "Settings", icon: Settings, title: "Settings" },
  { id: "appearance", label: "Appearance", icon: Palette, title: "Appearance" },
  { id: "help", label: "About", icon: BookOpen, title: "About" },
];

function SettingsPanelContent({ section }: { section: SettingsModalSection }) {
  switch (section) {
    case "account":
      return <SettingsAccountPanel />;
    case "settings":
      return <SettingsPreferencesPanel />;
    case "appearance":
      return <SettingsAppearancePanel />;
    case "help":
      return <SettingsHelpPanel />;
    default:
      return null;
  }
}

export function AppSettingsModal() {
  const { open, section, setSection, closeSettings } = useSettingsModal();
  const activeItem =
    NAV_ITEMS.find((item) => item.id === section) ?? NAV_ITEMS[0];

  return (
    <Dialog open={open} onOpenChange={(next) => !next && closeSettings()}>
      <DialogContent
        showCloseButton={false}
        className="flex h-[min(600px,85vh)] max-w-[min(880px,calc(100%-2rem))] flex-col gap-0 overflow-hidden bg-surface-7 p-0 [background:var(--surface-7)] [--color-selected:var(--surface-8)] [--color-surface-hover:var(--surface-8)] [--color-surface-selected:var(--surface-8)] [--selected:var(--surface-8)] [--surface-hover:var(--surface-8)] [--surface-selected:var(--surface-8)] sm:max-w-[min(880px,calc(100%-2rem))]"
      >
        <DialogTitle className="sr-only">{activeItem.title}</DialogTitle>

        <div className="flex min-h-0 flex-1">
          {/* Rail: Surface 4 on modal Surface 7 — quiet chrome, hairline only. */}
          <aside className="flex w-[200px] shrink-0 flex-col border-r border-border-subtle bg-surface-4">
            <div className="flex items-center px-2 pt-2">
              <button
                type="button"
                onClick={closeSettings}
                className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-ghost-hover hover:text-foreground"
                aria-label="Close settings"
              >
                <X className="size-4 stroke-[1.5]" />
              </button>
            </div>

            <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-3 pt-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = section === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSection(item.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[13px] transition-colors duration-150",
                      /* Nav selected: primary-soft fill + primary icon (INTERACTION). No ring/shadow. */
                      isActive
                        ? "bg-primary-soft font-medium text-foreground"
                        : "font-normal text-muted-foreground hover:bg-surface-ghost-hover hover:text-foreground",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-4 shrink-0 stroke-[1.5] transition-colors",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="min-w-0 flex-1 overflow-y-auto px-6 py-5">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {activeItem.title}
            </h2>
            <div className="mt-4">
              <SettingsPanelContent section={section} />
            </div>
          </main>
        </div>
      </DialogContent>
    </Dialog>
  );
}
