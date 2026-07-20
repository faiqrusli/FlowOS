/** Live demo constants — authority: docs/review/design/flowos-live-demo-spec.md */

export const DEMO_SEED_VERSION = "2026-07-20.4";

/** Session TTL in milliseconds (30 minutes). */
export const DEMO_SESSION_TTL_MS = 30 * 60 * 1000;

/** Neutral demo persona — not based on any real person. */
export const DEMO_PERSONA = {
  fullName: "Jordan Lee",
  role: "Demo Guest",
  initials: "JL",
} as const;

export const DEMO_META_KEYS = {
  sessionId: "flowos.demo.sessionId",
  startedAt: "flowos.demo.startedAt",
  expiresAt: "flowos.demo.expiresAt",
  anchorDate: "flowos.demo.anchorDate",
  seedVersion: "flowos.demo.seedVersion",
} as const;

/** localStorage / sessionStorage keys wiped on Restart / Exit (spec §18). */
export const DEMO_CLIENT_WIPE_KEYS = [
  "flowos.focus.active",
  "flowos-focus-settings",
  "flowos.settings",
  "flowos.schedule.notifications",
  "flowos.schedule-reminders.delivered",
  "flowos.browser-notification.prompted",
  "flowos.next-up.unified-order.v1",
  "flowos.next-up.habit-refs.v1",
  "flowos-growth-areas-expanded",
  "flowos:later-column-sort-mode",
  "flowos-global-right-sidebar-width",
  "flowos-global-right-sidebar-expanded",
  "flowos-global-right-sidebar-panel",
  DEMO_META_KEYS.sessionId,
  DEMO_META_KEYS.startedAt,
  DEMO_META_KEYS.expiresAt,
  DEMO_META_KEYS.anchorDate,
  DEMO_META_KEYS.seedVersion,
] as const;

export const DEMO_CLIENT_WIPE_PREFIXES = [
  "flowos-workplace-module-visibility:",
] as const;

export const DEMO_SESSION_STORAGE_KEYS = [
  "flowos.sidebar-notes.cache",
] as const;
