import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const tasksSource = readFileSync(new URL("./tasks.ts", import.meta.url), "utf8");
const groupsSource = readFileSync(
  new URL("./task-groups.ts", import.meta.url),
  "utf8",
);
const nextUpSource = readFileSync(
  new URL("./task-next-up.ts", import.meta.url),
  "utf8",
);
const pageSource = readFileSync(
  new URL("../components/tasks/tasks-page-content.tsx", import.meta.url),
  "utf8",
);
const workplaceSource = readFileSync(
  new URL("../components/workplace/workplace-page-content.tsx", import.meta.url),
  "utf8",
);
const migrationSource = readFileSync(
  new URL("../../supabase/tasks_withdrawal.sql", import.meta.url),
  "utf8",
);

describe("Tasks withdrawal lifecycle", () => {
  it("retains records and provides owner-scoped restore", () => {
    expect(tasksSource).toContain("export async function withdrawTask");
    expect(tasksSource).toContain("withdrawn_at: new Date().toISOString()");
    expect(tasksSource).toContain("export async function restoreTask");
    expect(tasksSource).toContain(".update({ withdrawn_at: null })");
    expect(tasksSource).not.toMatch(
      /export async function withdrawTask[\s\S]*?\.delete\(\)/,
    );
  });

  it("keeps withdrawn tasks out of active projections", () => {
    expect(groupsSource).toContain('.is("withdrawn_at", null)');
    expect(nextUpSource).toContain('.is("withdrawn_at", null)');
    expect(pageSource).toContain("await withdrawTask(taskId)");
    expect(pageSource).toContain("void restoreTask(taskId)");
    expect(pageSource).toContain('message: "Task withdrawn"');
    expect(workplaceSource).toContain("await withdrawTask(taskId)");
    expect(workplaceSource).toContain("void restoreTask(taskId)");
    expect(workplaceSource).toContain('message: "Task withdrawn"');
  });

  it("defines the retained database state", () => {
    expect(migrationSource).toContain("add column if not exists withdrawn_at");
    expect(migrationSource).toContain("where withdrawn_at is null");
    expect(migrationSource).toContain("and withdrawn_at is null;");
    expect(migrationSource).toContain(
      "create or replace function batch_update_task_queue_orders",
    );
    expect(migrationSource).toContain(
      "create or replace function delete_task_group_with_tasks_to_inbox",
    );
    expect(migrationSource).toContain("update tasks");
    expect(migrationSource).toContain("delete from task_groups");
    expect(migrationSource).toContain("if not found then");
    expect(migrationSource).toContain(
      "if group_slug is not null and group_slug in ('inbox', 'today', 'later')",
    );
  });
});
