-- Retain routine task removal as an owner-confirmed withdrawal.
-- Apply after tasks.sql and auth_migration.sql.

alter table tasks
  add column if not exists withdrawn_at timestamptz;

create index if not exists tasks_active_user_idx
  on tasks (user_id, updated_at desc)
  where withdrawn_at is null;
