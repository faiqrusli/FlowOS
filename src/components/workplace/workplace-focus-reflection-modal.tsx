"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  fetchTodayReflection,
  saveReflection,
} from "@/lib/reflection-storage";
import { FOCUS_REFLECTION_ENTRY_TITLE } from "@/lib/focus-reflection";

type WorkplaceFocusReflectionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function WorkplaceFocusReflectionModal({
  open,
  onOpenChange,
}: WorkplaceFocusReflectionModalProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const loadReflection = useCallback(async () => {
    setLoading(true);
    try {
      const reflection = await fetchTodayReflection();
      const focusEntry = reflection?.custom_entries.find(
        (entry) => entry.title === FOCUS_REFLECTION_ENTRY_TITLE
      );
      setContent(focusEntry?.content ?? "");
      setDirty(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    void loadReflection();
  }, [open, loadReflection]);

  useEffect(() => {
    if (!open || loading) return;
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      const end = el.value.length;
      el.setSelectionRange(end, end);
    });
  }, [open, loading]);

  useEffect(() => {
    if (!dirty || !open || loading) return;

    const timer = window.setTimeout(() => {
      void (async () => {
        setSaving(true);
        try {
          const reflection = await fetchTodayReflection();
          const entries = reflection?.custom_entries ?? [];
          const exists = entries.some(
            (entry) => entry.title === FOCUS_REFLECTION_ENTRY_TITLE
          );
          const nextEntries = exists
            ? entries.map((entry) =>
                entry.title === FOCUS_REFLECTION_ENTRY_TITLE
                  ? { ...entry, content }
                  : entry
              )
            : [
                ...entries,
                {
                  id: crypto.randomUUID(),
                  title: FOCUS_REFLECTION_ENTRY_TITLE,
                  content,
                },
              ];

          await saveReflection({
            went_well: reflection?.went_well ?? "",
            went_wrong: reflection?.went_wrong ?? "",
            custom_entries: nextEntries,
            custom_kanbans: reflection?.custom_kanbans ?? [],
          });
          setDirty(false);
        } finally {
          setSaving(false);
        }
      })();
    }, 800);

    return () => window.clearTimeout(timer);
  }, [content, dirty, loading, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Focus</DialogTitle>
        </DialogHeader>
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
            setDirty(true);
          }}
          placeholder="What did you learn during this focus block?"
          rows={8}
          disabled={loading}
          className="resize-y"
        />
        <div className="flex items-center justify-between gap-3">
          {saving ? (
            <p className="text-xs text-muted-foreground">Saving…</p>
          ) : (
            <span />
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
