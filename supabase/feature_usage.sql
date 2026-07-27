-- Feature usage tracking for analytics (requires authentication).
-- Tracks which modules users interact with and what actions they take.
-- Rows are readable only by the project owner (service role / dashboard).
-- Run in Supabase SQL Editor. Safe to re-run.

create table if not exists public.feature_usage (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  feature text not null check (feature in ('tasks', 'focus', 'habits', 'notes', 'schedule', 'reflection', 'goals', 'ai_coach')),
  action text not null check (action in ('view', 'create', 'update', 'delete', 'complete', 'start', 'stop')),
  metadata jsonb default '{}'::jsonb
);

create index if not exists feature_usage_created_at_idx
  on public.feature_usage (created_at desc);

create index if not exists feature_usage_user_id_idx
  on public.feature_usage (user_id);

create index if not exists feature_usage_feature_idx
  on public.feature_usage (feature);

create index if not exists feature_usage_action_idx
  on public.feature_usage (action);

alter table public.feature_usage enable row level security;

-- Authenticated users can insert their own usage data
drop policy if exists "feature_usage_insert_authenticated" on public.feature_usage;
create policy "feature_usage_insert_authenticated"
  on public.feature_usage
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- No select policy: users cannot read usage data (owner only)
drop policy if exists "feature_usage_select_authenticated" on public.feature_usage;

notify pgrst, 'reload schema';
