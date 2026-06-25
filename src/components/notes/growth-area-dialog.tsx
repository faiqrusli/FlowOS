"use client";

import { useEffect, useState } from "react";
import { GrowthAreaIconChooser } from "@/components/notes/growth-area-icon-chooser";
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
import type { GrowthArea } from "@/types/notes";

type GrowthAreaDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  area?: GrowthArea | null;
  onSave: (input: {
    name: string;
    emoji: string;
    description: string;
  }) => Promise<void>;
};

export function GrowthAreaDialog({
  open,
  onOpenChange,
  mode,
  area,
  onSave,
}: GrowthAreaDialogProps) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("📝");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iconChooserOpen, setIconChooserOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(area?.name ?? "");
    setEmoji(area?.emoji ?? "📝");
    setDescription(area?.description ?? "");
    setError(null);
    setIconChooserOpen(false);
  }, [open, area]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onSave({
        name: name.trim(),
        emoji: emoji.trim() || "📝",
        description: description.trim(),
      });
      onOpenChange(false);
    } catch {
      setError("Failed to save growth area.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "New growth area" : "Edit growth area"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex gap-3">
              <div className="space-y-2">
                <Label htmlFor="area-emoji">Icon</Label>
                <button
                  id="area-emoji"
                  type="button"
                  onClick={() => setIconChooserOpen(true)}
                  className="flex h-10 w-16 items-center justify-center rounded-xl border border-border/50 bg-background text-xl transition-colors hover:bg-muted/40"
                  aria-label="Choose icon"
                >
                  {emoji}
                </button>
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <Label htmlFor="area-name">Name</Label>
                <Input
                  id="area-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Mindfulness"
                />
              </div>
            </div>

            <GrowthAreaIconChooser
              open={iconChooserOpen}
              onOpenChange={setIconChooserOpen}
              value={emoji}
              onSelect={(nextEmoji, label) => {
                setEmoji(nextEmoji);
                if (!name.trim()) setName(label);
              }}
            />
            <div className="space-y-2">
              <Label htmlFor="area-desc">Description</Label>
              <Textarea
                id="area-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What are you growing in this area?"
                rows={3}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : mode === "create" ? "Create" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
