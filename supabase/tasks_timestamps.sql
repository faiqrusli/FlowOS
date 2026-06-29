-- Task update/completion timestamps for sort modes
-- Run in Supabase SQL Editor after tasks.sql

alter table tasks
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists completed_at timestamptz;

create or replace function set_tasks_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists tasks_set_updated_at on tasks;
create trigger tasks_set_updated_at
  before update on tasks
  for each row
  execute function set_tasks_updated_at();
