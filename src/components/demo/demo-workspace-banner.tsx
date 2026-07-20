"use client";

import { useEffect, useState } from "react";
import { MessageSquarePlus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoSession } from "@/contexts/demo-session-context";
import { cn } from "@/lib/utils";

export function DemoWorkspaceBanner({ className }: { className?: string }) {
  const { isDemo, remainingLabel, openFeedback, restartDemo, busy } =
    useDemoSession();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
  }, [isDemo]);

  if (!isDemo || !visible) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-2 border-b border-border/60 bg-surface-raised px-3 py-1.5 text-[12px] text-muted-foreground",
        className,
      )}
      role="status"
    >
      <p className="min-w-0">
        <span className="font-medium text-foreground">Demo Workspace</span>
        <span className="mx-1.5 text-border">·</span>
        Changes reset after 30 minutes
        {remainingLabel ? (
          <>
            <span className="mx-1.5 text-border">·</span>
            {remainingLabel} left
          </>
        ) : null}
      </p>
      <div className="flex shrink-0 items-center gap-1.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 px-2 text-[12px]"
          disabled={busy}
          onClick={() => openFeedback()}
        >
          <MessageSquarePlus className="size-3.5 stroke-[1.5]" />
          Feedback
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 px-2 text-[12px]"
          disabled={busy}
          onClick={() => void restartDemo()}
        >
          <RotateCcw className="size-3.5 stroke-[1.5]" />
          Restart
        </Button>
        <button
          type="button"
          className="rounded-md px-1.5 py-0.5 text-[11px] text-muted-foreground hover:text-foreground"
          onClick={() => setVisible(false)}
          aria-label="Dismiss demo banner"
        >
          Hide
        </button>
      </div>
    </div>
  );
}
