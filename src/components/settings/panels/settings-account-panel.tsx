"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getMemberSince,
  getUserDisplayName,
  getUserInitials,
  getUserRole,
} from "@/lib/user-profile";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import type { User } from "@supabase/supabase-js";

export function SettingsAccountPanel() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => setUser(data.user));
  }, []);

  const displayName = getUserDisplayName(user);
  const initials = useMemo(() => getUserInitials(displayName), [displayName]);
  const userRole = getUserRole(user);
  const memberSince = getMemberSince(user);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-5 text-sm font-semibold text-foreground"
          aria-hidden
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{displayName}</p>
          <p className="truncate text-xs text-muted-foreground">
            {user?.email ?? "—"}
          </p>
          <p className="text-[11px] text-muted-foreground">{userRole}</p>
        </div>
      </div>

      <div className="space-y-3 border-t border-border-subtle pt-4">
        <div>
          <label className="text-xs text-muted-foreground">Full name</label>
          <Input value={displayName} readOnly className="mt-1 h-8 bg-surface-5 text-sm" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Email</label>
          <Input
            value={user?.email ?? "—"}
            readOnly
            className="mt-1 h-8 bg-surface-5 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground">Role</label>
            <Input value={userRole} readOnly className="mt-1 h-8 bg-surface-5 text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Member since</label>
            <Input value={memberSince} readOnly className="mt-1 h-8 bg-surface-5 text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
