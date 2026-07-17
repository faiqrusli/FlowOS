"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getGroupDotClass,
  TASK_GROUP_COLOR_KEYS,
  TASK_GROUP_COLOR_LABELS,
  type TaskGroupColorKey,
} from "@/lib/task-group-appearance";
import { cn } from "@/lib/utils";

type TaskGroupColorChooserProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: TaskGroupColorKey;
  onSelect: (colorKey: TaskGroupColorKey) => void;
};

export function TaskGroupColorChooser({
  open,
  onOpenChange,
  value,
  onSelect,
}: TaskGroupColorChooserProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-sm">
        <DialogHeader className="border-b border-border/30 px-4 py-3 pr-12">
          <DialogTitle className="text-base">Choose color</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-5 gap-2 p-4">
          {TASK_GROUP_COLOR_KEYS.map((colorKey) => (
            <button
              key={colorKey}
              type="button"
              aria-label={TASK_GROUP_COLOR_LABELS[colorKey]}
              aria-pressed={value === colorKey}
              onClick={() => {
                onSelect(colorKey);
                onOpenChange(false);
              }}
              className={cn(
                "flex aspect-square items-center justify-center rounded-xl border border-border/50 bg-surface-raised shadow-sm transition-transform hover:scale-105",
                value === colorKey &&
                  "ring-2 ring-foreground ring-offset-2 ring-offset-background",
              )}
            >
              <span className={getGroupDotClass(colorKey)} aria-hidden />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
