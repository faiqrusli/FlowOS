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

alter table tasks enable row level security;

create policy "Allow public access to tasks"
  on tasks
  for all
  using (true)
  with check (true);
