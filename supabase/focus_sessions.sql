create table if not exists focus_sessions (
  id uuid primary key default gen_random_uuid(),
  focus_duration integer not null,
  break_duration integer not null,
  session_status text not null check (session_status in ('in_progress', 'completed', 'stopped')),
  started_at timestamptz not null,
  ended_at timestamptz,
  created_at timestamptz default now()
);

-- RLS is enabled with no policies here: the table is deny-all until the
-- per-user policies in auth_migration.sql are applied.
alter table focus_sessions enable row level security;
