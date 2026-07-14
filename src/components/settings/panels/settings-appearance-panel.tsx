"use client";

import { Moon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SettingsAppearancePanel() {
  return (
    <div className="space-y-5">
      <section>
        <h3 className="text-xs font-medium text-muted-foreground">Theme</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          FlowOS is dark-only so surface hierarchy stays consistent.
        </p>
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-2.5">
          <Moon className="size-3.5 shrink-0 stroke-[1.5] text-foreground" />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-foreground">Dark</p>
            <p className="text-xs text-muted-foreground">Active for all sessions</p>
          </div>
          <Badge variant="outline" className="text-[10px]">
            Only
          </Badge>
        </div>
      </section>

      <section className="border-t border-border/60 pt-5">
        <h3 className="text-xs font-medium text-muted-foreground">Layout</h3>
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5">
            <div>
              <p className="text-sm">Compact mode</p>
              <p className="text-xs text-muted-foreground">Denser spacing.</p>
            </div>
            <Badge variant="outline" className="text-[10px]">
              Planned
            </Badge>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5">
            <div>
              <p className="text-sm">Custom themes</p>
              <p className="text-xs text-muted-foreground">Accent colors.</p>
            </div>
            <Badge variant="outline" className="text-[10px]">
              Planned
            </Badge>
          </div>
        </div>
      </section>
    </div>
  );
}
