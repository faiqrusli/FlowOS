"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDemoSession } from "@/contexts/demo-session-context";

export function DemoExpiryDialog() {
  const { expired, restartDemo, exitDemo, busy } = useDemoSession();

  return (
    <Dialog open={expired} onOpenChange={() => undefined}>
      <DialogContent showCloseButton={false} className="max-w-md">
        <DialogHeader>
          <DialogTitle>Your demo session has expired</DialogTitle>
          <DialogDescription>
            Start a new demo session to continue exploring. Your previous
            changes are cleared.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => void exitDemo()}
          >
            Exit
          </Button>
          <Button
            type="button"
            disabled={busy}
            onClick={() => void restartDemo()}
          >
            {busy ? "Starting…" : "Restart Demo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
