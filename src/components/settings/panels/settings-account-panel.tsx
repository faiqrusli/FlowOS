"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { KeyRound, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getMemberSince,
  getUserDisplayName,
  getUserInitials,
  getUserRole,
} from "@/lib/user-profile";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function SettingsAccountPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => setUser(data.user));
  }, []);

  const displayName = getUserDisplayName(user);
  const initials = useMemo(() => getUserInitials(displayName), [displayName]);
  const userRole = getUserRole(user);
  const memberSince = getMemberSince(user);

  function showFeedback(message: string) {
    setFeedback(message);
    window.setTimeout(() => setFeedback(null), 5000);
  }

  return (
    <div className="space-y-5">
      {feedback && (
        <p
          className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-900"
          role="status"
        >
          {feedback}
        </p>
      )}

      <div className="flex items-center gap-3">
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold"
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

      <div className="space-y-3 border-t border-border/60 pt-4">
        <div>
          <label className="text-xs text-muted-foreground">Full name</label>
          <Input value={displayName} readOnly className="mt-1 h-8 text-sm" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Email</label>
          <Input
            value={user?.email ?? "—"}
            readOnly
            className="mt-1 h-8 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground">Role</label>
            <Input value={userRole} readOnly className="mt-1 h-8 text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Member since</label>
            <Input value={memberSince} readOnly className="mt-1 h-8 text-sm" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            showFeedback("Profile editing will be available in a future update.")
          }
        >
          <Pencil data-icon="inline-start" />
          Edit profile
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            showFeedback(
              "Password changes are managed through your authentication provider."
            )
          }
        >
          <KeyRound data-icon="inline-start" />
          Change password
        </Button>
      </div>
    </div>
  );
}
