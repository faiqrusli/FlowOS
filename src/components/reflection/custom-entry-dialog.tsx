"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CustomEntry } from "@/types/reflection";

type CustomEntryDialogProps = {
  mode: "create" | "edit";
  entry?: CustomEntry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (entry: CustomEntry) => void;
};

export function CustomEntryDialog({
  mode,
  entry,
  open,
  onOpenChange,
  onSave,
}: CustomEntryDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTitle(entry?.title ?? "");
      setContent(entry?.content ?? "");
      setError(null);
    }
  }, [open, entry]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    onSave({
      id: entry?.id ?? crypto.randomUUID(),
      title: title.trim(),
      content: content.trim(),
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add custom entry" : "Edit custom entry"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="entry-title">Title</Label>
            <Input
              id="entry-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weight, Daily Insight, Mood"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="entry-content">Content</Label>
            <Textarea
              id="entry-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Your note…"
              rows={3}
              className="min-h-20"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <DialogFooter className="border-t-0 bg-transparent p-0 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-full bg-neutral-800 text-white hover:bg-neutral-700"
            >
              {mode === "create" ? "Add entry" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
