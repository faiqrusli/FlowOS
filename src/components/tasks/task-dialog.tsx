"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  ScheduleDatePickerField,
  ScheduleTimePickerField,
} from "@/components/ui/schedule-picker-field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TaskPrioritySelect } from "@/components/tasks/task-priority-select";
import { normalizeTaskPriority } from "@/lib/task-priority";
import {
  taskFormSchema,
  type TaskFormValues,
} from "@/lib/validation";
import type { Task, TaskInsert } from "@/types/task";

const emptyForm: TaskFormValues = {
  title: "",
  description: "",
  scheduledDate: null,
  scheduledTime: null,
  priority: "medium",
};

function taskToForm(task: Task): TaskFormValues {
  return {
    title: task.title,
    description: task.description ?? "",
    scheduledDate: task.scheduled_date ?? null,
    scheduledTime: task.scheduled_time ?? null,
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
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: emptyForm,
  });

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  function setOpen(next: boolean) {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
    if (!next) {
      reset(emptyForm);
      clearErrors();
    }
  }

  useEffect(() => {
    if (open && mode === "edit" && task) {
      reset(taskToForm(task));
      clearErrors();
    }
    if (open && mode === "create") {
      reset(emptyForm);
      clearErrors();
    }
  }, [clearErrors, mode, open, reset, task]);

  async function handleSave(values: TaskFormValues) {
    try {
      await onSave(formToInsert(values), mode === "edit" ? task?.id : undefined);
      setOpen(false);
    } catch (err) {
      setError("root.server", {
        type: "server",
        message:
          err instanceof Error
            ? err.message
            : mode === "edit"
              ? "Failed to update task."
              : "Failed to create task.",
      });
    }
  }

  const scheduledDate = useWatch({ control, name: "scheduledDate" });
  const scheduledTime = useWatch({ control, name: "scheduledTime" });
  const priority = useWatch({ control, name: "priority" });

  const formFields = (
    <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${mode}-title`}>Title</Label>
        <Input
          id={`${mode}-title`}
          placeholder="What needs to be done?"
          autoFocus
          aria-invalid={errors.title ? "true" : undefined}
          aria-describedby={errors.title ? `${mode}-title-error` : undefined}
          {...register("title")}
        />
        {errors.title && (
          <p id={`${mode}-title-error`} className="text-sm text-destructive">
            {errors.title.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${mode}-description`}>Description</Label>
        <Textarea
          id={`${mode}-description`}
          placeholder="Optional details"
          rows={3}
          {...register("description")}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${mode}-scheduled_date`}>Date</Label>
          <ScheduleDatePickerField
            id={`${mode}-scheduled_date`}
            value={scheduledDate ?? null}
            onChange={(dateKey) =>
              setValue("scheduledDate", dateKey, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            aria-describedby={
              errors.scheduledDate ? `${mode}-scheduled-date-error` : undefined
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${mode}-scheduled_time`}>Time</Label>
          <ScheduleTimePickerField
            id={`${mode}-scheduled_time`}
            value={scheduledTime ?? null}
            onChange={(time) =>
              setValue("scheduledTime", time, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            aria-describedby={
              errors.scheduledTime ? `${mode}-scheduled-time-error` : undefined
            }
          />
        </div>
      </div>
      {errors.scheduledDate && (
        <p id={`${mode}-scheduled-date-error`} className="text-sm text-destructive">
          {errors.scheduledDate.message}
        </p>
      )}
      {errors.scheduledTime && (
        <p id={`${mode}-scheduled-time-error`} className="text-sm text-destructive">
          {errors.scheduledTime.message}
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor={`${mode}-priority`}>Priority</Label>
        <TaskPrioritySelect
          id={`${mode}-priority`}
          value={priority}
          onChange={(nextPriority) =>
            setValue("priority", nextPriority, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          aria-describedby={errors.priority ? `${mode}-priority-error` : undefined}
        />
      </div>
      {errors.priority && (
        <p id={`${mode}-priority-error`} className="text-sm text-destructive">
          {errors.priority.message}
        </p>
      )}
      {errors.root?.server?.message && (
        <p className="text-sm text-destructive" role="alert" aria-live="assertive">
          {errors.root.server.message}
        </p>
      )}
      <DialogFooter className="border-t-0 bg-transparent p-0 sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(false)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full"
        >
          {isSubmitting
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
          <Button className="rounded-full" />
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
