"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ActionToast,
  ActionToastViewport,
  type ActionToastIcon,
  type ActionToastTone,
} from "@/components/notifications/action-toast";

export type ShowActionToastInput = {
  message: string;
  tone?: ActionToastTone;
  icon?: ActionToastIcon;
  actionLabel?: string;
  onAction?: () => void;
  /** Runs when the toast expires or is replaced — e.g. commit delayed delete. */
  onExpire?: () => void;
  durationMs?: number;
};

type ActionToastContextValue = {
  showActionToast: (input: ShowActionToastInput) => void;
  dismissActionToast: () => void;
};

const ActionToastContext = createContext<ActionToastContextValue | null>(null);

type ToastState = {
  key: string;
  message: string;
  tone: ActionToastTone;
  icon: ActionToastIcon;
  actionLabel?: string;
  onAction?: () => void;
  onExpire?: () => void;
  durationMs?: number;
};

export function ActionToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastRef = useRef(toast);
  toastRef.current = toast;

  const dismissActionToast = useCallback(() => {
    const current = toastRef.current;
    setToast(null);
    current?.onExpire?.();
  }, []);

  const showActionToast = useCallback((input: ShowActionToastInput) => {
    const previous = toastRef.current;
    if (previous?.onExpire) {
      previous.onExpire();
    }
    setToast({
      key: crypto.randomUUID(),
      message: input.message,
      tone: input.tone ?? "neutral",
      icon: input.icon ?? "check",
      actionLabel: input.actionLabel,
      durationMs: input.durationMs,
      onAction: input.onAction
        ? () => {
            input.onAction?.();
            setToast(null);
          }
        : undefined,
      onExpire: input.onExpire,
    });
  }, []);

  const value = useMemo(
    () => ({ showActionToast, dismissActionToast }),
    [showActionToast, dismissActionToast],
  );

  return (
    <ActionToastContext.Provider value={value}>
      {children}
      <ActionToastViewport>
        {toast ? (
          <ActionToast
            key={toast.key}
            message={toast.message}
            tone={toast.tone}
            icon={toast.icon}
            actionLabel={toast.actionLabel}
            onAction={toast.onAction}
            onDismiss={dismissActionToast}
            durationMs={toast.durationMs}
          />
        ) : null}
      </ActionToastViewport>
    </ActionToastContext.Provider>
  );
}

export function useActionToast() {
  const context = useContext(ActionToastContext);
  if (!context) {
    throw new Error("useActionToast must be used within ActionToastProvider");
  }
  return context;
}

/** Optional — for components that may render outside the provider in tests. */
export function useOptionalActionToast() {
  return useContext(ActionToastContext);
}
