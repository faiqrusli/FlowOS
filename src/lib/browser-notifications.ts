/**
 * Browser Notification API helpers for the schedule-reminder MVP.
 * No service workers / push — page must be open (or recently open) to fire.
 */

const PERMISSION_PROMPTED_KEY = "flowos.browser-notification.prompted";

export function getBrowserNotificationPermission():
  | NotificationPermission
  | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
}

export function hasPromptedBrowserNotificationPermission(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(PERMISSION_PROMPTED_KEY) === "1";
}

function markPrompted() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PERMISSION_PROMPTED_KEY, "1");
}

/**
 * Request permission only when the user first schedules something that needs
 * notifications — never on cold launch / onboarding.
 */
export async function requestBrowserNotificationPermissionIfNeeded(): Promise<NotificationPermission | "unsupported"> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }
  if (Notification.permission === "denied") {
    return "denied";
  }

  markPrompted();
  const permission = await Notification.requestPermission();
  return permission;
}

export type ShowBrowserNotificationOptions = {
  title: string;
  body: string;
  /** Opens/focuses Today when the OS notification is clicked. */
  onClickNavigateToToday?: boolean;
  tag?: string;
};

export function showBrowserNotificationIfGranted(
  options: ShowBrowserNotificationOptions,
): boolean {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }
  if (Notification.permission !== "granted") {
    return false;
  }

  // Cache-bust when the asset gains transparency (OS otherwise keeps a white ring).
  const iconUrl = new URL(
    "/flowos-notification-icon.png?v=2",
    window.location.origin,
  ).href;

  const notification = new Notification(options.title, {
    body: options.body,
    tag: options.tag,
    icon: iconUrl,
  });

  if (options.onClickNavigateToToday !== false) {
    notification.onclick = () => {
      window.focus();
      // Same-tab navigation when FlowOS is already open.
      if (window.location.pathname !== "/") {
        window.location.assign("/");
      }
      notification.close();
    };
  }

  return true;
}
