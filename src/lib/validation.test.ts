import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  getFieldErrors,
  loginSchema,
  parseTaskInsert,
  registerSchema,
  taskFormSchema,
} from "@/lib/validation";

describe("validation contracts", () => {
  it("rejects invalid login input and normalizes field errors", () => {
    const result = loginSchema.safeParse({ email: "not-an-email", password: "" });

    expect(result.success).toBe(false);
    if (result.success) return;

    expect(getFieldErrors(result.error)).toMatchObject({
      email: "Enter a valid email address.",
      password: "Password is required.",
    });
  });

  it("rejects short or mismatched registration passwords", () => {
    const result = registerSchema.safeParse({
      name: "Ada",
      email: "ada@example.com",
      password: "short",
      confirmPassword: "different",
    });

    expect(result.success).toBe(false);
    if (result.success) return;

    expect(getFieldErrors(result.error)).toMatchObject({
      password: "Password must be at least 6 characters.",
      confirmPassword: "Passwords do not match.",
    });
  });

  it("rejects empty task titles and invalid schedule values", () => {
    const result = taskFormSchema.safeParse({
      title: "   ",
      description: "",
      scheduledDate: "2026-2-1",
      scheduledTime: "25:61",
      priority: "medium",
    });

    expect(result.success).toBe(false);
  });

  it("rejects impossible calendar dates", () => {
    const result = taskFormSchema.safeParse({
      title: "Task",
      description: "",
      scheduledDate: "2026-02-31",
      scheduledTime: "09:30",
      priority: "medium",
    });

    expect(result.success).toBe(false);
  });

  it("accepts a normalized task insert", () => {
    expect(
      parseTaskInsert({
        title: "  Plan the day  ",
        description: "  Notes  ",
        scheduled_date: "2026-08-05",
        scheduled_time: "09:30",
        priority: "high",
      }),
    ).toMatchObject({
      title: "Plan the day",
      scheduled_date: "2026-08-05",
      scheduled_time: "09:30",
    });
  });

  it("accepts the seconds-bearing time emitted by the schedule picker", () => {
    const result = taskFormSchema.safeParse({
      title: "Scheduled task",
      description: "",
      scheduledDate: "2026-08-05",
      scheduledTime: "09:30:00",
      priority: "medium",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid task writes at the persistence boundary", () => {
    expect(() =>
      parseTaskInsert({ title: "Task", scheduled_time: "noon" }),
    ).toThrow(z.ZodError);
  });
});