"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Bug, Lightbulb, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettingsModal } from "@/contexts/settings-modal-context";

export function SettingsHelpPanel() {
  const { closeSettings } = useSettingsModal();
  const [feedback, setFeedback] = useState<string | null>(null);

  function showFeedback(message: string) {
    setFeedback(message);
    window.setTimeout(() => setFeedback(null), 5000);
  }

  return (
    <div className="space-y-5">
      {feedback && (
        <p
          className="rounded-lg border border-selected-border bg-primary-soft px-3 py-2 text-xs text-foreground"
          role="status"
        >
          {feedback}
        </p>
      )}

      <section>
        <h3 className="text-xs font-medium text-muted-foreground">Quick links</h3>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <Button
            variant="outline"
            size="sm"
            className="justify-start"
            render={<Link href="/about" onClick={closeSettings} />}
          >
            <BookOpen data-icon="inline-start" />
            Documentation
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="justify-start"
            onClick={() =>
              showFeedback("Bug reporting will be connected in a future release.")
            }
          >
            <Bug data-icon="inline-start" />
            Report a bug
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="justify-start"
            onClick={() =>
              showFeedback("Feature requests will be connected in a future release.")
            }
          >
            <Lightbulb data-icon="inline-start" />
            Feature request
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="justify-start"
            onClick={() =>
              showFeedback("Support contact will be connected in a future release.")
            }
          >
            <Mail data-icon="inline-start" />
            Contact support
          </Button>
        </div>
      </section>

      <section className="border-t border-border/60 pt-5">
        <h3 className="text-sm font-medium">Send feedback</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Help shape what FlowOS ships next.
        </p>
        <Button
          className="mt-3"
          variant="outline"
          size="sm"
          onClick={() =>
            showFeedback("Thanks — feedback forms are coming soon.")
          }
        >
          Share feedback
        </Button>
      </section>
    </div>
  );
}
