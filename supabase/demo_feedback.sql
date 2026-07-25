-- Guest feedback capture for the live demo (no login required for insert).
-- Rows are readable only by the project owner (service role / dashboard):
-- submissions carry user_agent, page_path and demo_session_id, so they are not
-- exposed to the anon or authenticated roles.
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

-- Size guards on free-text guest input (client-side limits are not enforcement).
alter table public.demo_feedback
  drop constraint if exists demo_feedback_body_length,
  drop constraint if exists demo_feedback_display_name_length,
  drop constraint if exists demo_feedback_page_path_length,
  drop constraint if exists demo_feedback_user_agent_length,
  drop constraint if exists demo_feedback_session_id_length;

alter table public.demo_feedback
  add constraint demo_feedback_body_length
    check (char_length(body) between 1 and 2000),
  add constraint demo_feedback_display_name_length
    check (display_name is null or char_length(display_name) <= 80),
  add constraint demo_feedback_page_path_length
    check (page_path is null or char_length(page_path) <= 200),
  add constraint demo_feedback_user_agent_length
    check (user_agent is null or char_length(user_agent) <= 400),
  add constraint demo_feedback_session_id_length
    check (demo_session_id is null or char_length(demo_session_id) <= 100);

alter table public.demo_feedback enable row level security;

-- No select policy: guests may submit feedback but cannot read submissions.
drop policy if exists "demo_feedback_select_public" on public.demo_feedback;

drop policy if exists "demo_feedback_insert_anyone" on public.demo_feedback;
create policy "demo_feedback_insert_anyone"
  on public.demo_feedback
  for insert
  with check (is_public = true and is_hidden = false);

notify pgrst, 'reload schema';
