create table if not exists habits (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  scheduled_time time,
  days_of_week text[],
  completed boolean default false,
  created_at timestamp default now()
);

alter table habits enable row level security;

create policy "Allow public access to habits"
  on habits
  for all
  using (true)
  with check (true);
