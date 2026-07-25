create table if not exists habits (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  scheduled_time time,
  days_of_week text[],
  completed boolean default false,
  created_at timestamp default now()
);

-- RLS is enabled with no policies here: the table is deny-all until the
-- per-user policies in auth_migration.sql are applied.
alter table habits enable row level security;
