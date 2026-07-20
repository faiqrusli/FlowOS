"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitDemoFeedback } from "@/lib/demo/feedback";

type DemoFeedbackDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  demoSessionId?: string | null;
};

export function DemoFeedbackDialog({
  open,
  onOpenChange,
  demoSessionId,
}: DemoFeedbackDialogProps) {
  const [displayName, setDisplayName] = useState("");
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setStatus(null);
    try {
      await submitDemoFeedback({
        kind: "comment",
        body,
        displayName,
        website,
        pagePath:
          typeof window !== "undefined" ? window.location.pathname : undefined,
        demoSessionId,
      });
      setBody("");
      setStatus("Thanks — feedback saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send feedback.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border/60 px-5 py-4">
          <DialogTitle>Feedback</DialogTitle>
          <DialogDescription>
            Share what you think — no account required.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="space-y-3 px-5 py-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="demo-feedback-name">Name (optional)</Label>
            <Input
              id="demo-feedback-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Guest"
              maxLength={60}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="demo-feedback-body">Message</Label>
            <Textarea
              id="demo-feedback-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              required
              maxLength={2000}
              placeholder="What did you think of the demo?"
            />
          </div>

          {/* Honeypot */}
          <div
            className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden"
            aria-hidden
          >
            <Label htmlFor="demo-feedback-website">Website</Label>
            <Input
              id="demo-feedback-website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          {status ? (
            <p className="text-sm text-muted-foreground" role="status">
              {status}
            </p>
          ) : null}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Sending…" : "Send feedback"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
