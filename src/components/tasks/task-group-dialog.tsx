"use client";

import { useEffect, useMemo, useState } from "react";
import { GrowthAreaIconChooser } from "@/components/notes/growth-area-icon-chooser";
import { TaskGroupPill } from "@/components/tasks/task-group-pill";
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
import {
  DEFAULT_NEW_GROUP_ICON,
  getTaskGroupAppearance,
  pickNextGroupColor,
  TASK_GROUP_COLOR_KEYS,
  TASK_GROUP_COLOR_LABELS,
  TASK_GROUP_SWATCH_CLASS,
  type TaskGroupColorKey,
} from "@/lib/task-group-appearance";
import { cn } from "@/lib/utils";
import type { TaskGroupWithTasks } from "@/types/task";

export type TaskGroupCreateInput = {
  title: string;
  icon: string;
  color: TaskGroupColorKey;
};

type TaskGroupDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingGroups: TaskGroupWithTasks[];
  onSave: (input: TaskGroupCreateInput) => Promise<void>;
};

export function TaskGroupDialog({
  open,
  onOpenChange,
  existingGroups,
  onSave,
}: TaskGroupDialogProps) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(DEFAULT_NEW_GROUP_ICON);
  const [color, setColor] = useState<TaskGroupColorKey>("blue");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iconChooserOpen, setIconChooserOpen] = useState(false);

  const previewAppearance = useMemo(
    () =>
      getTaskGroupAppearance({
        id: "preview",
        title: name.trim() || "Group name",
        slug: null,
        icon,
        color,
      }),
    [color, icon, name],
  );

  useEffect(() => {
    if (!open) return;
    setName("");
    setIcon(DEFAULT_NEW_GROUP_ICON);
    setColor(pickNextGroupColor(existingGroups));
    setError(null);
    setIconChooserOpen(false);
  }, [open, existingGroups]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError("Group name is required.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onSave({
        title: name.trim(),
        icon: icon.trim() || DEFAULT_NEW_GROUP_ICON,
        color,
      });
      onOpenChange(false);
    } catch {
      setError("Failed to create group.");
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
              <DialogTitle>New task group</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="task-group-name">Name</Label>
                <Input
                  id="task-group-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Study C++"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="flex min-h-11 items-center rounded-xl border border-border/40 bg-surface-raised px-3 py-2">
                  <TaskGroupPill
                    icon={previewAppearance.icon}
                    name={name.trim() || "Group name"}
                    appearance={previewAppearance}
                  />
                </div>
              </div>

              <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-start gap-3">
                <div className="space-y-2">
                  <Label htmlFor="task-group-icon">Icon</Label>
                  <button
                    id="task-group-icon"
                    type="button"
                    onClick={() => setIconChooserOpen(true)}
                    className="flex h-10 w-full items-center justify-center rounded-xl border border-border/50 bg-background text-xl transition-colors hover:bg-surface-hover"
                    aria-label="Choose icon"
                  >
                    {icon}
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
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create group"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <GrowthAreaIconChooser
        open={iconChooserOpen}
        onOpenChange={setIconChooserOpen}
        value={icon}
        onSelect={(nextIcon) => setIcon(nextIcon)}
      />
    </>
  );
}
