-- Public guest feedback wall for the live demo (no login required for insert/select).
-- Run in Supabase SQL Editor. Safe to re-run.

create table if not exists public.demo_feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('comment', 'rating', 'bug')),
  display_name text,
  body text not null,
  rating int check (rating is null or (rating between 1 and 5)),
  severity text check (severity is null or severity in ('low', 'medium', 'high')),
  page_path text,
  user_agent text,
  demo_session_id text,
  is_public boolean not null default true,
  is_hidden boolean not null default false
);

create index if not exists demo_feedback_created_at_idx
  on public.demo_feedback (created_at desc);

alter table public.demo_feedback enable row level security;

drop policy if exists "demo_feedback_select_public" on public.demo_feedback;
create policy "demo_feedback_select_public"
  on public.demo_feedback
  for select
  using (is_public = true and is_hidden = false);

drop policy if exists "demo_feedback_insert_anyone" on public.demo_feedback;
create policy "demo_feedback_insert_anyone"
  on public.demo_feedback
  for insert
  with check (true);

notify pgrst, 'reload schema';
