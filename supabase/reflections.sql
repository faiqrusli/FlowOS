create table if not exists reflections (
  id uuid primary key default gen_random_uuid(),
  reflection_date date not null unique,
  went_well text default '',
  went_wrong text default '',
  created_at timestamptz default now()
);

-- RLS is enabled with no policies here: the table is deny-all until the
-- per-user policies in auth_migration.sql are applied.
alter table reflections enable row level security;
