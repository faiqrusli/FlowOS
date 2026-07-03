-- Task groups (Sunsama-style columns) + task board fields
-- Run in Supabase SQL Editor after tasks.sql and tasks_priority.sql

create table if not exists task_groups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  slug text,
  sort_order integer not null default 0,
  icon text,
  color text,
  created_at timestamptz not null default now()
);

alter table task_groups
  add column if not exists icon text,
  add column if not exists color text;

-- Default appearance for built-in groups
update task_groups set icon = '📅', color = 'sky' where slug = 'today' and icon is null;
update task_groups set icon = '📥', color = 'inbox' where slug = 'inbox' and icon is null;
update task_groups set icon = '📚', color = 'blue' where slug = 'study-cpp' and icon is null;

-- Prevent duplicate built-in groups per user
create unique index if not exists task_groups_user_slug_unique_idx
  on task_groups (user_id, slug)
  where slug is not null;

alter table tasks
  add column if not exists group_id uuid references task_groups(id) on delete set null,
  add column if not exists sort_order integer not null default 0,
  add column if not exists duration_minutes integer,
  add column if not exists notification_enabled boolean not null default true,
  add column if not exists notification_lead_minutes integer;

create index if not exists tasks_group_sort_idx on tasks (group_id, sort_order);

alter table task_groups enable row level security;

create policy "Users read own task_groups" on task_groups for select using (auth.uid() = user_id);
create policy "Users insert own task_groups" on task_groups for insert with check (auth.uid() = user_id);
create policy "Users update own task_groups" on task_groups for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users delete own task_groups" on task_groups for delete using (auth.uid() = user_id);
