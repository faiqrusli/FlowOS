create table if not exists reflection_entries (
  id uuid primary key default gen_random_uuid(),
  reflection_id uuid not null references reflections(id) on delete cascade,
  title text not null default '',
  content text default '',
  created_at timestamptz default now()
);

alter table reflection_entries enable row level security;

create policy "Allow public access to reflection_entries"
  on reflection_entries
  for all
  using (true)
  with check (true);
