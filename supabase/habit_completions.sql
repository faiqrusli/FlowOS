create table if not exists habit_completions (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references habits(id) on delete cascade,
  completion_date date not null,
  created_at timestamp default now(),
  unique (habit_id, completion_date)
);

create index if not exists habit_completions_habit_id_idx
  on habit_completions (habit_id);

alter table habit_completions enable row level security;

create policy "Allow public access to habit_completions"
  on habit_completions
  for all
  using (true)
  with check (true);
