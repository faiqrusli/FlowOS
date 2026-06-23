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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  normalizeTaskPriority,
  TASK_PRIORITIES,
  TASK_PRIORITY_CONFIG,
  type TaskPriority,
} from "@/lib/task-priority";
import { cn } from "@/lib/utils";
import type { Task, TaskInsert } from "@/types/task";

type TaskFormValues = {
  title: string;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
  priority: TaskPriority;
};

const emptyForm: TaskFormValues = {
  title: "",
  description: "",
  scheduledDate: "",
  scheduledTime: "",
  priority: "medium",
};

function taskToForm(task: Task): TaskFormValues {
  return {
    title: task.title,
    description: task.description ?? "",
    scheduledDate: task.scheduled_date ?? "",
    scheduledTime: task.scheduled_time?.slice(0, 5) ?? "",
    priority: normalizeTaskPriority(task.priority),
  };
}

function formToInsert(values: TaskFormValues): TaskInsert {
  return {
    title: values.title.trim(),
    description: values.description.trim() || null,
    scheduled_date: values.scheduledDate || null,
    scheduled_time: values.scheduledTime || null,
    priority: values.priority,
  };
}

type TaskDialogProps = {
  mode: "create" | "edit";
  task?: Task;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave: (input: TaskInsert, taskId?: string) => Promise<void>;
};

export function TaskDialog({
  mode,
  task,
  open: controlledOpen,
  onOpenChange,
  onSave,
}: TaskDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [form, setForm] = useState<TaskFormValues>(emptyForm);
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
    if (open && mode === "edit" && task) {
      setForm(taskToForm(task));
      setError(null);
    }
    if (open && mode === "create") {
      setForm(emptyForm);
      setError(null);
    }
  }, [open, mode, task]);

  function updateField<K extends keyof TaskFormValues>(
    key: K,
    value: TaskFormValues[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const title = form.title.trim();
    if (!title) {
      setError("Title is required.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onSave(formToInsert(form), mode === "edit" ? task?.id : undefined);
      setOpen(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : mode === "edit"
            ? "Failed to update task."
            : "Failed to create task."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const formFields = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${mode}-title`}>Title</Label>
        <Input
          id={`${mode}-title`}
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="What needs to be done?"
          autoFocus
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${mode}-description`}>Description</Label>
        <Textarea
          id={`${mode}-description`}
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Optional details"
          rows={3}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${mode}-scheduled_date`}>Date</Label>
          <Input
            id={`${mode}-scheduled_date`}
            type="date"
            value={form.scheduledDate}
            onChange={(e) => updateField("scheduledDate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${mode}-scheduled_time`}>Time</Label>
          <Input
            id={`${mode}-scheduled_time`}
            type="time"
            value={form.scheduledTime}
            onChange={(e) => updateField("scheduledTime", e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${mode}-priority`}>Priority</Label>
        <select
          id={`${mode}-priority`}
          value={form.priority}
          onChange={(e) =>
            updateField("priority", e.target.value as TaskPriority)
          }
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
          )}
        >
          {TASK_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {TASK_PRIORITY_CONFIG[priority].emoji}{" "}
              {TASK_PRIORITY_CONFIG[priority].label}
            </option>
          ))}
        </select>
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
          onClick={() => setOpen(false)}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-neutral-800 text-white hover:bg-neutral-700"
        >
          {submitting
            ? mode === "edit"
              ? "Saving…"
              : "Creating…"
            : mode === "edit"
              ? "Save changes"
              : "Create task"}
        </Button>
      </DialogFooter>
    </form>
  );

  if (mode === "edit") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
          </DialogHeader>
          {formFields}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="rounded-full bg-neutral-800 text-white hover:bg-neutral-700" />
        }
      >
        Add Task
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create task</DialogTitle>
        </DialogHeader>
        {formFields}
      </DialogContent>
    </Dialog>
  );
}

export function CreateTaskDialog({
  onCreate,
}: {
  onCreate: (task: TaskInsert) => Promise<void>;
}) {
  return (
    <TaskDialog
      mode="create"
      onSave={async (input) => {
        await onCreate(input);
      }}
    />
  );
}
