import {
  DEMO_CLIENT_WIPE_KEYS,
  DEMO_CLIENT_WIPE_PREFIXES,
  DEMO_SESSION_STORAGE_KEYS,
} from "@/lib/demo/constants";

/** Wipe demo-related browser storage (spec §18). */
export function wipeDemoClientKeys(): void {
  if (typeof window === "undefined") return;

  for (const key of DEMO_CLIENT_WIPE_KEYS) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }

  try {
    const toRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (!key) continue;
      if (DEMO_CLIENT_WIPE_PREFIXES.some((prefix) => key.startsWith(prefix))) {
        toRemove.push(key);
      }
    }
    for (const key of toRemove) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // ignore
  }

  for (const key of DEMO_SESSION_STORAGE_KEYS) {
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
}
