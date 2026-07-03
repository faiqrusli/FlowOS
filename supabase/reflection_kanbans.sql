-- Custom kanban boards stored on reflections + weekly reflection layout
alter table reflections
  add column if not exists custom_kanbans jsonb not null default '[]'::jsonb;

create table if not exists weekly_reflection_layouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  layout jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start)
);

create index if not exists weekly_reflection_layouts_user_week_idx
  on weekly_reflection_layouts (user_id, week_start desc);

alter table weekly_reflection_layouts enable row level security;

create policy "Users read own weekly_reflection_layouts"
  on weekly_reflection_layouts for select using (auth.uid() = user_id);
create policy "Users insert own weekly_reflection_layouts"
  on weekly_reflection_layouts for insert with check (auth.uid() = user_id);
create policy "Users update own weekly_reflection_layouts"
  on weekly_reflection_layouts for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users delete own weekly_reflection_layouts"
  on weekly_reflection_layouts for delete using (auth.uid() = user_id);
