import type { User } from "@supabase/supabase-js";
import {
  DEMO_META_KEYS,
  DEMO_PERSONA,
  DEMO_SEED_VERSION,
  DEMO_SESSION_TTL_MS,
} from "@/lib/demo/constants";
import { wipeDemoClientKeys } from "@/lib/demo/client-wipe";
import { cloneDemoSeed } from "@/lib/demo/clone-seed";
import { purgeDemoUserData } from "@/lib/demo/purge-demo-data";
import { createClient } from "@/lib/supabase/client";

export type DemoUserMetadata = {
  is_demo?: boolean;
  full_name?: string;
  role?: string;
  demo_seed_version?: string;
  demo_anchor_date?: string;
  demo_expires_at?: string;
};

export function isDemoUser(user: User | null | undefined): boolean {
  if (!user) return false;
  const meta = user.user_metadata as DemoUserMetadata;
  return meta?.is_demo === true || user.is_anonymous === true;
}

export function getDemoExpiresAt(user: User | null | undefined): number | null {
  if (!user) return null;
  const meta = user.user_metadata as DemoUserMetadata;
  if (meta?.demo_expires_at) {
    const parsed = Date.parse(meta.demo_expires_at);
    if (!Number.isNaN(parsed)) return parsed;
  }
  try {
    const local = window.localStorage.getItem(DEMO_META_KEYS.expiresAt);
    if (local) {
      const parsed = Date.parse(local);
      if (!Number.isNaN(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return null;
}

export function isDemoSessionExpired(user: User | null | undefined): boolean {
  const expiresAt = getDemoExpiresAt(user);
  if (expiresAt == null) return false;
  return Date.now() >= expiresAt;
}

function persistLocalMeta(input: {
  sessionId: string;
  startedAt: string;
  expiresAt: string;
  anchorDate: string;
  seedVersion: string;
}) {
  try {
    window.localStorage.setItem(DEMO_META_KEYS.sessionId, input.sessionId);
    window.localStorage.setItem(DEMO_META_KEYS.startedAt, input.startedAt);
    window.localStorage.setItem(DEMO_META_KEYS.expiresAt, input.expiresAt);
    window.localStorage.setItem(DEMO_META_KEYS.anchorDate, input.anchorDate);
    window.localStorage.setItem(DEMO_META_KEYS.seedVersion, input.seedVersion);
  } catch {
    // ignore
  }
}

async function writeDemoMetadata(
  expiresAtIso: string,
  anchorDate: string,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({
    data: {
      is_demo: true,
      full_name: DEMO_PERSONA.fullName,
      role: DEMO_PERSONA.role,
      demo_seed_version: DEMO_SEED_VERSION,
      demo_anchor_date: anchorDate,
      demo_expires_at: expiresAtIso,
    } satisfies DemoUserMetadata,
  });
  if (error) {
    throw new Error(`Could not set demo metadata: ${error.message}`);
  }
}

/**
 * Enter a fresh demo session: anonymous auth + seed clone.
 */
export async function enterDemoSession(): Promise<void> {
  const supabase = createClient();

  // Clear any prior session so guests always get an isolated workspace.
  await supabase.auth.signOut();
  wipeDemoClientKeys();

  const { data, error } = await supabase.auth.signInAnonymously({
    options: {
      data: {
        is_demo: true,
        full_name: DEMO_PERSONA.fullName,
        role: DEMO_PERSONA.role,
      },
    },
  });

  if (error || !data.user) {
    const hint =
      error?.message?.toLowerCase().includes("anonymous") ||
      error?.status === 422
        ? " Enable Anonymous Sign-Ins in the Supabase Auth settings."
        : "";
    throw new Error(
      (error?.message ?? "Anonymous sign-in failed.") + hint,
    );
  }

  const userId = data.user.id;
  const startedAt = new Date();
  const expiresAt = new Date(startedAt.getTime() + DEMO_SESSION_TTL_MS);

  try {
    const { anchorDate, seedVersion } = await cloneDemoSeed(userId);
    await writeDemoMetadata(expiresAt.toISOString(), anchorDate);
    persistLocalMeta({
      sessionId: userId,
      startedAt: startedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      anchorDate,
      seedVersion,
    });
  } catch (seedError) {
    try {
      await purgeDemoUserData(userId);
    } catch {
      // ignore purge errors during rollback
    }
    await supabase.auth.signOut();
    wipeDemoClientKeys();
    throw seedError;
  }
}

/** Same uid: purge + re-clone + new TTL. */
export async function restartDemoSession(): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isDemoUser(user)) {
    await enterDemoSession();
    return;
  }

  wipeDemoClientKeys();
  await purgeDemoUserData(user.id);

  const startedAt = new Date();
  const expiresAt = new Date(startedAt.getTime() + DEMO_SESSION_TTL_MS);

  const { anchorDate, seedVersion } = await cloneDemoSeed(user.id);
  await writeDemoMetadata(expiresAt.toISOString(), anchorDate);
  persistLocalMeta({
    sessionId: user.id,
    startedAt: startedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    anchorDate,
    seedVersion,
  });
}

export async function exitDemoSession(): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && isDemoUser(user)) {
    try {
      await purgeDemoUserData(user.id);
    } catch {
      // TTL job will clean up
    }
  }

  wipeDemoClientKeys();
  await supabase.auth.signOut();
}
