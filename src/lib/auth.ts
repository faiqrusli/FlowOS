import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export {
  getMemberSince,
  getUserDisplayName,
  getUserInitials,
  getUserRole,
} from "@/lib/user-profile";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return data.user;
}

export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id ?? null;
}

export async function requireUserId(): Promise<string> {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new AuthError("You must be signed in to perform this action.");
  }

  return userId;
}

export function isEmailNotConfirmedError(message: string): boolean {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("email not confirmed") ||
    normalized.includes("email not verified")
  );
}
