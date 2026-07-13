-- Durable, task-only focus attribution within a single active focus session.
-- Apply after focus_sessions.sql, focus_sessions_targets.sql, and auth_migration.sql.

create table if not exists focus_session_task_totals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  focus_session_id uuid not null,
  task_id uuid not null references tasks(id) on delete cascade,
  focused_seconds integer not null default 0 check (focused_seconds >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, focus_session_id, task_id)
);

create index if not exists focus_session_task_totals_user_task_idx
  on focus_session_task_totals (user_id, task_id, updated_at desc);

alter table focus_session_task_totals enable row level security;

create policy "Users read own focus_session_task_totals"
  on focus_session_task_totals for select
  using (auth.uid() = user_id);

create policy "Users insert own focus_session_task_totals"
  on focus_session_task_totals for insert
  with check (auth.uid() = user_id);

create policy "Users update own focus_session_task_totals"
  on focus_session_task_totals for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
