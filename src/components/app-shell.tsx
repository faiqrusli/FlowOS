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
import { ScheduleReminderProvider } from "@/contexts/schedule-reminder-context";
import { SettingsModalProvider } from "@/contexts/settings-modal-context";
import { ActionToastProvider } from "@/contexts/action-toast-context";
import { DemoSessionProvider } from "@/contexts/demo-session-context";
import { ScheduleReminderToastHost } from "@/components/notifications/schedule-reminder-toast-host";
import { DemoWorkspaceBanner } from "@/components/demo/demo-workspace-banner";
import { useGlobalShortcuts } from "@/hooks/use-global-shortcuts";
import { cn } from "@/lib/utils";
import {
  WORKSPACE_GUTTER_LEFT_CLASS,
  WORKSPACE_GUTTER_RIGHT_CLASS,
  WORKSPACE_PAGE_INSET_X_CLASS,
  WORKSPACE_PAGE_INSET_Y_CLASS,
  WORKSPACE_SECTION_GAP_CLASS,
} from "@/lib/workspace-layout";

function AppShellShortcuts() {
  useGlobalShortcuts();
  return null;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  /** Today / Tasks / Schedule / Notes manage their own page inset; shell only applies rail gutter. */
  const todayBleed = pathname === "/";
  const tasksBleed = pathname === "/tasks";
  const scheduleBleed = pathname === "/schedule";
  const notesBleed = pathname === "/notes";
  const pageBleed = todayBleed || tasksBleed || scheduleBleed || notesBleed;

  return (
    <FocusSessionProvider>
      <ScheduleReminderProvider>
        <SettingsModalProvider>
          <ActionToastProvider>
            <DemoSessionProvider>
              <GlobalRightSidebarProvider>
                <AppShellShortcuts />
                <QuickCaptureDialog />
                <GlobalFloatingNotes />
                <ScheduleReminderToastHost />

                {/* Canvas workspace; left/right chrome use Navigation. */}
                <div className="flex h-dvh overflow-hidden bg-surface-canvas">
                  <AppSidebar
                    mobileOpen={mobileNavOpen}
                    onMobileOpenChange={setMobileNavOpen}
                  />

                  <div className="flex min-h-0 min-w-0 flex-1 flex-col border-l-0 bg-surface-canvas">
                    <DemoWorkspaceBanner />
                    <main
                      className={cn(
                        "flow-workspace min-h-0 flex-1 overflow-x-hidden overscroll-y-contain border-l-0",
                        pageBleed ? "overflow-hidden" : "overflow-y-auto",
                      )}
                    >
                    {/* Gutter only — attaches workspace to rails (not page padding). */}
                    <div
                      className={cn(
                        "w-full min-w-0",
                        WORKSPACE_GUTTER_LEFT_CLASS,
                        /* Full-height modules sit flush to the right rail. */
                        !tasksBleed &&
                          !scheduleBleed &&
                          !notesBleed &&
                          WORKSPACE_GUTTER_RIGHT_CLASS,
                        pageBleed && "flex h-full min-h-0 flex-col",
                      )}
                    >
                      <div
                        className={cn(
                          "w-full min-w-0",
                          pageBleed
                            ? "flex h-full min-h-0 flex-col"
                            : cn(
                                WORKSPACE_PAGE_INSET_X_CLASS,
                                WORKSPACE_PAGE_INSET_Y_CLASS,
                                WORKSPACE_SECTION_GAP_CLASS,
                              ),
                        )}
                      >
                        {children}
                      </div>
                    </div>
                  </main>
                </div>

                <GlobalRightSidebar />
              </div>

              <AppSettingsModal />
            </GlobalRightSidebarProvider>
            </DemoSessionProvider>
          </ActionToastProvider>
        </SettingsModalProvider>
      </ScheduleReminderProvider>
    </FocusSessionProvider>
  );
}
