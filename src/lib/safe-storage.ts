/**
 * SSR-safe `localStorage` helpers.
 *
 * Every access to `window.localStorage` in the browser can throw (private
 * mode, blocked storage, quota) and is unavailable during server rendering.
 * These helpers centralise the `typeof window` guard plus try/catch so callers
 * don't repeat it, and never throw on read or write.
 */

/** Reads a raw string value. Returns `null` when unavailable or on error. */
export function getStorageItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Writes a raw string value. Silently ignores unavailability and errors. */
export function setStorageItem(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* private mode / blocked storage / quota */
  }
}

/** Removes a key. Silently ignores unavailability and errors. */
export function removeStorageItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* private mode / blocked storage */
  }
}

/**
 * Reads and JSON-parses a value, returning `fallback` when the key is absent,
 * unavailable, or fails to parse.
 */
export function readStorageJson<T>(key: string, fallback: T): T {
  const raw = getStorageItem(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** JSON-stringifies and writes a value. Silently ignores errors. */
export function writeStorageJson(key: string, value: unknown): void {
  try {
    setStorageItem(key, JSON.stringify(value));
  } catch {
    /* value not serialisable */
  }
}
