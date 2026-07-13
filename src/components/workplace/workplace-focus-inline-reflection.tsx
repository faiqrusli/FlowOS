"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  saveFocusReflectionEntry,
  shouldPromptFocusReflection,
} from "@/lib/focus-reflection";
import { getSessionFocusSeconds } from "@/lib/focus-utils";
import type { FocusSession } from "@/types/focus";

type WorkplaceFocusInlineReflectionProps = {
  session: FocusSession;
  onDismiss: () => void;
};

export function WorkplaceFocusInlineReflection({
  session,
  onDismiss,
}: WorkplaceFocusInlineReflectionProps) {
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const focusSeconds = getSessionFocusSeconds(session);

  const handleSubmit = useCallback(async () => {
    const trimmed = content.trim();
    if (!trimmed) {
      onDismiss();
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await saveFocusReflectionEntry(trimmed);
      onDismiss();
    } catch {
      setError("Could not save — try again.");
    } finally {
      setSaving(false);
    }
  }, [content, onDismiss]);

  if (!shouldPromptFocusReflection(focusSeconds)) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-lg rounded-lg border border-border-subtle bg-surface-base px-3 py-2.5">
      <form
        className="flex flex-wrap items-center gap-x-2 gap-y-2"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
      >
        <label
          htmlFor="focus-inline-reflection"
          className="shrink-0 text-[13px] text-muted-foreground"
        >
          What did this session produce?
        </label>
        <Input
          id="focus-inline-reflection"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          disabled={saving}
          placeholder="One line is enough"
          className="h-8 min-w-[12rem] flex-1 text-[13px]"
          autoFocus
        />
        <div className="flex items-center gap-2">
          <Button
            type="submit"
            size="sm"
            className="h-8 px-3 text-[13px]"
            disabled={saving}
          >
            {saving ? "Saving…" : "Save"}
          </Button>
          <button
            type="button"
            onClick={onDismiss}
            disabled={saving}
            className="text-[13px] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          >
            skip
          </button>
        </div>
      </form>
      {error ? (
        <p className="mt-1.5 text-[12px] text-destructive">{error}</p>
      ) : null}
    </div>
  );
}
