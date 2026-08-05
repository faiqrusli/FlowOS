-- Retain task rows when a person withdraws a commitment from active work.
-- Apply after tasks.sql and before enabling the core-loop withdrawal controls.

alter table tasks
  add column if not exists withdrawn_at timestamptz;

create index if not exists tasks_active_user_idx
  on tasks (user_id, withdrawn_at, created_at desc);
