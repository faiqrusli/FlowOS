create table if not exists habit_completions (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references habits(id) on delete cascade,
  completion_date date not null,
  created_at timestamp default now(),
  unique (habit_id, completion_date)
);

create index if not exists habit_completions_habit_id_idx
  on habit_completions (habit_id);

-- RLS is enabled with no policies here: the table is deny-all until the
-- per-user policies in auth_migration.sql are applied.
alter table habit_completions enable row level security;
