"use client";

import { useState } from "react";
import {
  AppSidebar,
  MobileSidebarTrigger,
} from "@/components/app-sidebar";
import { AppSettingsModal } from "@/components/settings/app-settings-modal";
import { FocusSessionProvider } from "@/contexts/focus-session-context";
import { SettingsModalProvider } from "@/contexts/settings-modal-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <FocusSessionProvider>
      <SettingsModalProvider>
        <div className="flex h-dvh overflow-hidden bg-background">
          <AppSidebar
            mobileOpen={mobileNavOpen}
            onMobileOpenChange={setMobileNavOpen}
          />

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <MobileSidebarTrigger onOpen={() => setMobileNavOpen(true)} />

            <main className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
              <div className="w-full space-y-6 p-6 lg:px-10 lg:py-8">
                {children}
              </div>
            </main>
          </div>
        </div>

        <AppSettingsModal />
      </SettingsModalProvider>
    </FocusSessionProvider>
  );
}
