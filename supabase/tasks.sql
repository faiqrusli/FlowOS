create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  scheduled_date date,
  scheduled_time time,
  priority text default 'medium' check (priority in ('high', 'medium', 'low')),
  user_id uuid references auth.users(id),
  completed boolean default false,
  created_at timestamp default now()
);

-- RLS is enabled with no policies here: the table is deny-all until the
-- per-user policies in auth_migration.sql are applied.
alter table tasks enable row level security;
