create table if not exists reflection_entries (
  id uuid primary key default gen_random_uuid(),
  reflection_id uuid not null references reflections(id) on delete cascade,
  title text not null default '',
  content text default '',
  created_at timestamptz default now()
);

-- RLS is enabled with no policies here: the table is deny-all until the
-- per-user policies in auth_migration.sql are applied.
alter table reflection_entries enable row level security;
