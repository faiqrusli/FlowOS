create table if not exists reflections (
  id uuid primary key default gen_random_uuid(),
  reflection_date date not null unique,
  went_well text default '',
  went_wrong text default '',
  created_at timestamptz default now()
);

alter table reflections enable row level security;

create policy "Allow public access to reflections"
  on reflections
  for all
  using (true)
  with check (true);
