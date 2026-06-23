create table if not exists focus_sessions (
  id uuid primary key default gen_random_uuid(),
  focus_duration integer not null,
  break_duration integer not null,
  session_status text not null check (session_status in ('in_progress', 'completed', 'stopped')),
  started_at timestamptz not null,
  ended_at timestamptz,
  created_at timestamptz default now()
);

alter table focus_sessions enable row level security;

create policy "Allow public access to focus_sessions"
  on focus_sessions
  for all
  using (true)
  with check (true);
