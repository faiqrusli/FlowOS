"use client";

import { useState } from "react";
import {
  AppSidebar,
  MobileSidebarTrigger,
} from "@/components/app-sidebar";
import { GlobalRightSidebar } from "@/components/layout/global-right-sidebar";
import { GlobalFloatingNotes } from "@/components/layout/global-floating-notes";
import { QuickCaptureDialog } from "@/components/layout/quick-capture-dialog";
import { AppSettingsModal } from "@/components/settings/app-settings-modal";
import { GlobalRightSidebarProvider } from "@/contexts/global-right-sidebar-context";
import { FocusSessionProvider } from "@/contexts/focus-session-context";
import { SettingsModalProvider } from "@/contexts/settings-modal-context";
import { useGlobalShortcuts } from "@/hooks/use-global-shortcuts";

function AppShellShortcuts() {
  useGlobalShortcuts();
  return null;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <FocusSessionProvider>
      <SettingsModalProvider>
        <GlobalRightSidebarProvider>
          <AppShellShortcuts />
          <QuickCaptureDialog />
          <GlobalFloatingNotes />

          {/* Continuous canvas (`--background`); left/right chrome stay on `--surface`. */}
          <div className="flex h-dvh overflow-hidden bg-background">
            <AppSidebar
              mobileOpen={mobileNavOpen}
              onMobileOpenChange={setMobileNavOpen}
            />

            <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background">
              <MobileSidebarTrigger onOpen={() => setMobileNavOpen(true)} />

              <main className="flow-workspace min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
                <div className="w-full space-y-6 p-6 pr-0 lg:py-8 lg:pl-10 lg:pr-0">
                  {children}
                </div>
              </main>
            </div>

            <GlobalRightSidebar />
          </div>

          <AppSettingsModal />
        </GlobalRightSidebarProvider>
      </SettingsModalProvider>
    </FocusSessionProvider>
  );
}
