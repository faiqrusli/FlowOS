import { formatInAppTimezone } from "@/lib/date-utils";
import type { User } from "@supabase/supabase-js";

export function getUserDisplayName(user: User | null): string {
  if (!user) return "Guest";

  const metadataName = user.user_metadata?.full_name;
  if (typeof metadataName === "string" && metadataName.trim()) {
    return metadataName.trim();
  }

  return user.email?.split("@")[0] ?? "User";
}

export function getUserRole(user: User | null): string {
  const role = user?.user_metadata?.role;
  if (typeof role === "string" && role.trim()) {
    return role.trim();
  }
  return "Student";
}

export function getUserInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

export function getMemberSince(user: User | null): string {
  if (!user?.created_at) return "—";

  return formatInAppTimezone(user.created_at, {
    month: "long",
    year: "numeric",
  });
}
