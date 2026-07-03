"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HabitFormFields,
  type HabitFormValues,
} from "@/components/habits/habit-form-fields";
import { getHabitDurationMinutes, setItemDurationMinutes } from "@/lib/schedule-durations";
import type { Habit, HabitInsert } from "@/types/habit";

const emptyForm: HabitFormValues = {
  name: "",
  scheduledTime: "",
  durationMinutes: 15,
  daysOfWeek: [],
  trackWithFocus: false,
};

function habitToForm(habit: Habit): HabitFormValues {
  return {
    name: habit.name,
    scheduledTime: habit.scheduled_time?.slice(0, 5) ?? "",
    durationMinutes: getHabitDurationMinutes(habit.id),
    daysOfWeek: habit.days_of_week ?? [],
    trackWithFocus: habit.track_with_focus ?? false,
  };
}

function formToInsert(values: HabitFormValues): HabitInsert {
  return {
    name: values.name.trim(),
    scheduled_time: values.scheduledTime || null,
    days_of_week: values.daysOfWeek.length > 0 ? values.daysOfWeek : null,
    track_with_focus: values.trackWithFocus,
  };
}

type HabitDialogProps = {
  mode: "create" | "edit";
  habit?: Habit;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave: (input: HabitInsert, habitId?: string) => Promise<Habit>;
};

export function HabitDialog({
  mode,
  habit,
  open: controlledOpen,
  onOpenChange,
  onSave,
}: HabitDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [form, setForm] = useState<HabitFormValues>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  function setOpen(next: boolean) {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
    if (!next) {
      setForm(emptyForm);
      setError(null);
    }
  }

  useEffect(() => {
    if (open && mode === "edit" && habit) {
      setForm(habitToForm(habit));
      setError(null);
    }
    if (open && mode === "create") {
      setForm(emptyForm);
      setError(null);
    }
  }, [open, mode, habit]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("Habit name is required.");
      return;
    }

    if (form.daysOfWeek.length === 0) {
      setError("Select at least one recurring day.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const input = formToInsert(form);
      const saved = await onSave(input, mode === "edit" ? habit?.id : undefined);
      setItemDurationMinutes("habit", saved.id, form.durationMinutes);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save habit.");
    } finally {
      setSubmitting(false);
    }
  }

  const title = mode === "create" ? "Add habit" : "Edit habit";
  const submitLabel = mode === "create" ? "Create habit" : "Save changes";

  const dialogContent = (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <HabitFormFields
          values={form}
          onChange={setForm}
          disabled={submitting}
        />
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <DialogFooter className="border-t-0 bg-transparent p-0 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="rounded-full"
          >
            {submitting ? "Saving…" : submitLabel}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );

  if (mode === "edit") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="rounded-full" />
        }
      >
        Add Habit
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
