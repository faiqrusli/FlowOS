-- FlowOS Notes module: Growth Areas, Notes, Kanban, Goals, Conversions
-- Run in Supabase SQL Editor after auth_migration.sql

-- ---------------------------------------------------------------------------
-- Growth Areas (personal folders)
-- ---------------------------------------------------------------------------
create table if not exists growth_areas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  emoji text not null default '📝',
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists growth_areas_user_id_idx on growth_areas (user_id);
create index if not exists growth_areas_user_sort_idx on growth_areas (user_id, sort_order);

-- ---------------------------------------------------------------------------
-- Notes (markdown documents inside a growth area)
-- ---------------------------------------------------------------------------
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  growth_area_id uuid not null references growth_areas(id) on delete cascade,
  title text not null default 'Untitled',
  content text not null default '',
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notes_growth_area_idx on notes (growth_area_id);
create index if not exists notes_user_updated_idx on notes (user_id, updated_at desc);

-- ---------------------------------------------------------------------------
-- Kanban boards (one growth area can have many boards)
-- ---------------------------------------------------------------------------
create table if not exists kanban_boards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  growth_area_id uuid not null references growth_areas(id) on delete cascade,
  title text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists kanban_boards_growth_area_idx on kanban_boards (growth_area_id);
create index if not exists kanban_boards_area_sort_idx on kanban_boards (growth_area_id, sort_order);

-- ---------------------------------------------------------------------------
-- Kanban columns
-- ---------------------------------------------------------------------------
create table if not exists kanban_columns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  board_id uuid not null references kanban_boards(id) on delete cascade,
  title text not null,
  color text not null default 'slate',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists kanban_columns_board_idx on kanban_columns (board_id, sort_order);

-- ---------------------------------------------------------------------------
-- Kanban cards
-- ---------------------------------------------------------------------------
create table if not exists kanban_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  board_id uuid not null references kanban_boards(id) on delete cascade,
  column_id uuid not null references kanban_columns(id) on delete cascade,
  title text not null,
  description text not null default '',
  color_label text not null default 'sky',
  sort_order integer not null default 0,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists kanban_cards_column_idx on kanban_cards (column_id, sort_order);
create index if not exists kanban_cards_column_archived_idx on kanban_cards (column_id, is_archived, sort_order);
create index if not exists kanban_cards_board_idx on kanban_cards (board_id);

-- ---------------------------------------------------------------------------
-- Growth goals (lightweight goals created from notes/kanban — full Goals module later)
-- ---------------------------------------------------------------------------
create table if not exists growth_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  growth_area_id uuid references growth_areas(id) on delete set null,
  title text not null,
  description text,
  source_type text check (source_type in ('note', 'kanban_card')),
  source_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists growth_goals_area_idx on growth_goals (growth_area_id);

-- ---------------------------------------------------------------------------
-- Conversions / links to FlowOS entities (tasks, habits, reflections)
-- ---------------------------------------------------------------------------
create table if not exists note_conversions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  growth_area_id uuid references growth_areas(id) on delete set null,
  source_type text not null check (source_type in ('note', 'kanban_card')),
  source_id uuid not null,
  target_type text not null check (target_type in ('task', 'habit', 'reflection')),
  target_id uuid not null,
  created_at timestamptz not null default now()
);

create index if not exists note_conversions_area_idx on note_conversions (growth_area_id);
create index if not exists note_conversions_source_idx on note_conversions (source_type, source_id);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists growth_areas_updated_at on growth_areas;
create trigger growth_areas_updated_at
  before update on growth_areas
  for each row execute function set_updated_at();

drop trigger if exists notes_updated_at on notes;
create trigger notes_updated_at
  before update on notes
  for each row execute function set_updated_at();

drop trigger if exists kanban_boards_updated_at on kanban_boards;
create trigger kanban_boards_updated_at
  before update on kanban_boards
  for each row execute function set_updated_at();

drop trigger if exists kanban_cards_updated_at on kanban_cards;
create trigger kanban_cards_updated_at
  before update on kanban_cards
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table growth_areas enable row level security;
alter table notes enable row level security;
alter table kanban_boards enable row level security;
alter table kanban_columns enable row level security;
alter table kanban_cards enable row level security;
alter table growth_goals enable row level security;
alter table note_conversions enable row level security;

-- growth_areas
create policy "Users read own growth_areas" on growth_areas for select using (auth.uid() = user_id);
create policy "Users insert own growth_areas" on growth_areas for insert with check (auth.uid() = user_id);
create policy "Users update own growth_areas" on growth_areas for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users delete own growth_areas" on growth_areas for delete using (auth.uid() = user_id);

-- notes
create policy "Users read own notes" on notes for select using (auth.uid() = user_id);
create policy "Users insert own notes" on notes for insert with check (auth.uid() = user_id);
create policy "Users update own notes" on notes for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users delete own notes" on notes for delete using (auth.uid() = user_id);

-- kanban_boards
create policy "Users read own kanban_boards" on kanban_boards for select using (auth.uid() = user_id);
create policy "Users insert own kanban_boards" on kanban_boards for insert with check (auth.uid() = user_id);
create policy "Users update own kanban_boards" on kanban_boards for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users delete own kanban_boards" on kanban_boards for delete using (auth.uid() = user_id);

-- kanban_columns
create policy "Users read own kanban_columns" on kanban_columns for select using (auth.uid() = user_id);
create policy "Users insert own kanban_columns" on kanban_columns for insert with check (auth.uid() = user_id);
create policy "Users update own kanban_columns" on kanban_columns for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users delete own kanban_columns" on kanban_columns for delete using (auth.uid() = user_id);

-- kanban_cards
create policy "Users read own kanban_cards" on kanban_cards for select using (auth.uid() = user_id);
create policy "Users insert own kanban_cards" on kanban_cards for insert with check (auth.uid() = user_id);
create policy "Users update own kanban_cards" on kanban_cards for update using (auth                                                               .uid() = user_id) with check (auth.uid() = user_id);
create policy "Users delete own kanban_cards" on kanban_cards for delete using (auth.uid() = user_id);

-- growth_goals
create policy "Users read own growth_goals" on growth_goals for select using (auth.uid() = user_id);
create policy "Users insert own growth_goals" on growth_goals for insert with check (auth.uid() = user_id);
create policy "Users update own growth_goals" on growth_goals for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users delete own growth_goals" on growth_goals for delete using (auth.uid() = user_id);

-- note_conversions
create policy "Users read own note_conversions" on note_conversions for select using (auth.uid() = user_id);
create policy "Users insert own note_conversions" on note_conversions for insert with check (auth.uid() = user_id);
create policy "Users delete own note_conversions" on note_conversions for delete using (auth.uid() = user_id);
