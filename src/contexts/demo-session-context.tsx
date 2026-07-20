"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import {
  exitDemoSession,
  getDemoExpiresAt,
  isDemoSessionExpired,
  isDemoUser,
  restartDemoSession,
} from "@/lib/demo/session";
import { useFocusSessionContext } from "@/contexts/focus-session-context";
import { DemoFeedbackDialog } from "@/components/demo/demo-feedback-dialog";
import { DemoExpiryDialog } from "@/components/demo/demo-expiry-dialog";

type DemoSessionContextValue = {
  isDemo: boolean;
  expired: boolean;
  busy: boolean;
  remainingMs: number | null;
  remainingLabel: string | null;
  openFeedback: () => void;
  restartDemo: () => Promise<void>;
  exitDemo: () => Promise<void>;
};

const DemoSessionContext = createContext<DemoSessionContextValue | null>(null);

function formatRemaining(ms: number): string {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  if (minutes <= 0) return `${seconds}s`;
  return `${minutes}m`;
}

export function DemoSessionProvider({ children }: { children: ReactNode }) {
  const { hardResetActiveSession } = useFocusSessionContext();
  const [user, setUser] = useState<User | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [busy, setBusy] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const refreshUser = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user: next },
    } = await supabase.auth.getUser();
    setUser(next);
  }, []);

  useEffect(() => {
    void refreshUser();
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [refreshUser]);

  useEffect(() => {
    if (!isDemoUser(user)) return;
    const timer = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => window.clearInterval(timer);
  }, [user]);

  const isDemo = isDemoUser(user);
  const expiresAt = getDemoExpiresAt(user);
  const remainingMs =
    isDemo && expiresAt != null ? Math.max(0, expiresAt - now) : null;
  const expired = isDemo && isDemoSessionExpired(user);

  const restartDemo = useCallback(async () => {
    setBusy(true);
    try {
      // Clear React focus state before wipe — storage alone leaves the timer running.
      hardResetActiveSession();
      await restartDemoSession();
      // Full reload remounts focus/schedule providers on clean storage.
      window.location.assign("/");
    } catch {
      setBusy(false);
    }
  }, [hardResetActiveSession]);

  const exitDemo = useCallback(async () => {
    setBusy(true);
    try {
      hardResetActiveSession();
      await exitDemoSession();
      setUser(null);
      window.location.assign("/login");
    } catch {
      setBusy(false);
    }
  }, [hardResetActiveSession]);

  const value = useMemo<DemoSessionContextValue>(
    () => ({
      isDemo,
      expired,
      busy,
      remainingMs,
      remainingLabel:
        remainingMs == null ? null : formatRemaining(remainingMs),
      openFeedback: () => setFeedbackOpen(true),
      restartDemo,
      exitDemo,
    }),
    [isDemo, expired, busy, remainingMs, restartDemo, exitDemo],
  );

  return (
    <DemoSessionContext.Provider value={value}>
      {children}
      <DemoExpiryDialog />
      <DemoFeedbackDialog
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        demoSessionId={user?.id ?? null}
      />
    </DemoSessionContext.Provider>
  );
}

export function useDemoSession(): DemoSessionContextValue {
  const ctx = useContext(DemoSessionContext);
  if (!ctx) {
    throw new Error("useDemoSession must be used within DemoSessionProvider");
  }
  return ctx;
}
