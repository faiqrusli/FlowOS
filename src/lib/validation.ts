import { z } from "zod";
import { format, isValid, parse } from "date-fns";
import { TASK_PRIORITIES } from "@/lib/task-priority";
import type { ReflectionDraft } from "@/types/reflection";
import type { TaskInsert, TaskUpdate } from "@/types/task";

const dateKeyPattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;

function isValidDateKey(value: string): boolean {
  const parsed = parse(value, "yyyy-MM-dd", new Date(0));
  return isValid(parsed) && format(parsed, "yyyy-MM-dd") === value;
}

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .email("Enter a valid email address.");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required."),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required."),
    email: emailSchema,
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const scheduledDateSchema = z
  .string()
  .regex(dateKeyPattern, "Use a valid date.")
  .refine(isValidDateKey, "Use a valid date.")
  .nullable()
  .optional();

export const scheduledTimeSchema = z
  .string()
  .regex(timePattern, "Use a valid time.")
  .nullable()
  .optional();

const taskFields = {
  title: z.string().trim().min(1, "Title is required."),
  description: z.string().trim().nullable().optional(),
  scheduled_date: scheduledDateSchema,
  scheduled_time: scheduledTimeSchema,
  priority: z.enum(TASK_PRIORITIES).nullable().optional(),
  user_id: z.string().uuid().nullable().optional(),
  group_id: z.string().uuid().nullable().optional(),
  sort_order: z.number().int().positive().optional(),
  queue_order: z.number().int().positive().nullable().optional(),
  duration_minutes: z.number().int().positive().nullable().optional(),
  notification_enabled: z.boolean().optional(),
  notification_lead_minutes: z.number().int().nonnegative().nullable().optional(),
  planning_state: z.enum(["none", "later"]).optional(),
  withdrawn_at: z.string().datetime().nullable().optional(),
} satisfies Record<keyof TaskInsert, z.ZodTypeAny>;

export const taskInsertSchema = z.object(taskFields);
export const taskUpdateSchema = taskInsertSchema
  .partial()
  .extend({
    completed: z.boolean().optional(),
    completed_at: z.string().nullable().optional(),
  });

export const taskIdSchema = z.string().uuid("Task identity is invalid.");

export const taskFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  description: z.string(),
  scheduledDate: scheduledDateSchema,
  scheduledTime: scheduledTimeSchema,
  priority: z.enum(TASK_PRIORITIES),
});

const reflectionTextSchema = z.string().max(20_000, "Reflection text is too long.");
const reflectionEntrySchema = z.object({
  id: z.string().trim().min(1, "Reflection entry identity is required."),
  title: z.string().trim().max(200, "Entry title is too long."),
  content: reflectionTextSchema,
});
const reflectionKanbanCardSchema = z.object({
  id: z.string().trim().min(1, "Reflection card identity is required."),
  content: reflectionTextSchema,
});
const reflectionKanbanSchema = z.object({
  id: z.string().trim().min(1, "Reflection board identity is required."),
  title: z.string().trim().max(200, "Board title is too long."),
  cards: z.array(reflectionKanbanCardSchema),
  collapsed: z.boolean().optional(),
});

/** Shared runtime boundary for full-page, sidebar, and Focus handoff saves. */
export const reflectionDraftSchema = z.object({
  went_well: reflectionTextSchema,
  went_wrong: reflectionTextSchema,
  custom_entries: z.array(reflectionEntrySchema),
  custom_kanbans: z.array(reflectionKanbanSchema),
});

export const reflectionDateKeySchema = z
  .string()
  .regex(dateKeyPattern, "Use a valid reflection date.")
  .refine(isValidDateKey, "Use a valid reflection date.");

export const adaptationProposalSchema = z.object({
  id: z.string().trim().min(1, "Adaptation identity is required."),
  reflectionRecordId: z.string().trim().min(1, "Reflection identity is required."),
  receivingOwner: z.enum(["tasks", "habits", "schedule", "notes"]),
  title: z.string().trim().min(1, "Adaptation title is required.").max(200),
  detail: reflectionTextSchema,
  proposedAt: z.string().datetime().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type TaskFormValues = z.infer<typeof taskFormSchema>;

export function parseReflectionDraft(input: ReflectionDraft): ReflectionDraft {
  return reflectionDraftSchema.parse(input) as ReflectionDraft;
}

export function parseReflectionDateKey(dateKey: string): string {
  return reflectionDateKeySchema.parse(dateKey);
}

export function parseTaskInsert(input: TaskInsert): TaskInsert {
  return taskInsertSchema.parse(input) as TaskInsert;
}

export function parseTaskUpdate(input: TaskUpdate): TaskUpdate {
  return taskUpdateSchema.parse(input) as TaskUpdate;
}

export function parseTaskId(id: string): string {
  return taskIdSchema.parse(id);
}

export function getFieldErrors(error: z.ZodError): Record<string, string> {
  return error.issues.reduce<Record<string, string>>((errors, issue) => {
    const field = issue.path.join(".") || "root";
    if (!errors[field]) errors[field] = issue.message;
    return errors;
  }, {});
}

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  return error instanceof Error && error.message.trim()
    ? error.message
    : fallback;
}
