"use client";

import { useEffect, useMemo, useState } from "react";
import { GrowthAreaIconChooser } from "@/components/notes/growth-area-icon-chooser";
import { TaskGroupIdentityMark } from "@/components/tasks/task-group-identity-mark";
import { TaskGroupPill } from "@/components/tasks/task-group-pill";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  getTaskGroupAppearance,
  TASK_GROUP_COLOR_KEYS,
  TASK_GROUP_COLOR_LABELS,
  TASK_GROUP_SWATCH_CLASS,
  type TaskGroupColorKey,
} from "@/lib/task-group-appearance";
import { cn } from "@/lib/utils";
import type { TaskGroup } from "@/types/task";

export type TaskGroupAppearanceInput = {
  icon: string | null;
  color: TaskGroupColorKey;
};

type TaskGroupAppearanceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: Pick<TaskGroup, "id" | "slug" | "title" | "icon" | "color"> | null;
  onSave: (input: TaskGroupAppearanceInput) => Promise<void>;
};

export function TaskGroupAppearanceDialog({
  open,
  onOpenChange,
  group,
  onSave,
}: TaskGroupAppearanceDialogProps) {
  const [icon, setIcon] = useState<string | null>(null);
  const [color, setColor] = useState<TaskGroupColorKey>("blue");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iconChooserOpen, setIconChooserOpen] = useState(false);

  useEffect(() => {
    if (!open || !group) return;
    const appearance = getTaskGroupAppearance(group);
    setIcon(group.icon?.trim() || null);
    setColor(appearance.colorKey);
    setError(null);
    setIconChooserOpen(false);
  }, [open, group]);

  const previewAppearance = useMemo(
    () =>
      getTaskGroupAppearance({
        id: group?.id ?? "preview",
        title: group?.title ?? "Group name",
        slug: group?.slug ?? null,
        icon,
        color,
      }),
    [color, group, icon],
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSave({
        icon: icon?.trim() || null,
        color,
      });
      onOpenChange(false);
    } catch {
      setError("Failed to update appearance.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Edit appearance</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="flex min-h-11 items-center rounded-xl border border-border/40 bg-surface-raised px-3 py-2">
                  <TaskGroupPill
                    icon={previewAppearance.icon}
                    name={group?.title?.trim() || "Group name"}
                    appearance={previewAppearance}
                  />
                </div>
              </div>

              <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-start gap-3">
                <div className="space-y-2">
                  <Label htmlFor="task-group-edit-icon">Icon</Label>
                  <button
                    id="task-group-edit-icon"
                    type="button"
                    onClick={() => setIconChooserOpen(true)}
                    className="flex h-10 w-full items-center justify-center rounded-xl border border-border/50 bg-background transition-colors hover:bg-surface-hover"
                    aria-label={icon ? "Change icon" : "Choose icon (optional)"}
                  >
                    <TaskGroupIdentityMark icon={icon} colorKey={color} />
                  </button>
                </div>

                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {TASK_GROUP_COLOR_KEYS.map((colorKey) => (
                      <button
                        key={colorKey}
                        type="button"
                        aria-label={TASK_GROUP_COLOR_LABELS[colorKey]}
                        aria-pressed={color === colorKey}
                        onClick={() => setColor(colorKey)}
                        className={cn(
                          "flex aspect-square items-center justify-center rounded-lg border border-border/50 bg-surface-raised shadow-sm transition-transform hover:scale-105",
                          color === colorKey &&
                            "ring-2 ring-foreground ring-offset-2 ring-offset-background",
                        )}
                      >
                        <span
                          className={cn(
                            "size-2 shrink-0 rounded-full",
                            TASK_GROUP_SWATCH_CLASS[colorKey],
                          )}
                          aria-hidden
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : null}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || !group}>
                {submitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <GrowthAreaIconChooser
        open={iconChooserOpen}
        onOpenChange={setIconChooserOpen}
        value={icon ?? ""}
        allowClear={Boolean(icon)}
        onClear={() => setIcon(null)}
        onSelect={(nextIcon) => setIcon(nextIcon)}
      />
    </>
  );
}
