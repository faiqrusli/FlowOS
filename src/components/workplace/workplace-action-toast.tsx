"use client";

/**
 * Back-compat re-exports — prefer `@/components/notifications/action-toast`
 * and `useActionToast` from `@/contexts/action-toast-context`.
 */
export {
  ActionToast as WorkplaceActionToast,
  ActionToastViewport as WorkplaceToastViewport,
  type ActionToastIcon as WorkplaceActionToastIcon,
  type ActionToastTone as WorkplaceActionToastTone,
  type ActionToastProps as WorkplaceActionToastProps,
} from "@/components/notifications/action-toast";
