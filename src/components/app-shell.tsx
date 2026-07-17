"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { GlobalRightSidebar } from "@/components/layout/global-right-sidebar";
import { GlobalFloatingNotes } from "@/components/layout/global-floating-notes";
import { QuickCaptureDialog } from "@/components/layout/quick-capture-dialog";
import { AppSettingsModal } from "@/components/settings/app-settings-modal";
import { GlobalRightSidebarProvider } from "@/contexts/global-right-sidebar-context";
import { FocusSessionProvider } from "@/contexts/focus-session-context";
import { SettingsModalProvider } from "@/contexts/settings-modal-context";
import { useGlobalShortcuts } from "@/hooks/use-global-shortcuts";
import { cn } from "@/lib/utils";

function AppShellShortcuts() {
  useGlobalShortcuts();
  return null;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  /** Today is a full-bleed execution canvas — no shell pad strip at the edges. */
  const todayBleed = pathname === "/";

  return (
    <FocusSessionProvider>
      <SettingsModalProvider>
        <GlobalRightSidebarProvider>
          <AppShellShortcuts />
          <QuickCaptureDialog />
          <GlobalFloatingNotes />

          {/* Canvas workspace; left/right chrome use Navigation. */}
          <div className="flex h-dvh overflow-hidden bg-surface-canvas">
            <AppSidebar
              mobileOpen={mobileNavOpen}
              onMobileOpenChange={setMobileNavOpen}
            />

            <div className="flex min-h-0 min-w-0 flex-1 flex-col border-l-0 bg-surface-canvas">
              <main
                className={cn(
                  "flow-workspace min-h-0 flex-1 overflow-x-hidden overscroll-y-contain border-l-0",
                  todayBleed ? "overflow-hidden" : "overflow-y-auto",
                )}
              >
                <div
                  className={cn(
                    "w-full min-w-0",
                    todayBleed
                      ? "flex h-full min-h-0 flex-col p-0"
                      : "space-y-6 p-10 pr-0",
                  )}
                >
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
