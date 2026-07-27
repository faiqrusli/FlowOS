-- Click tracking for demo and sign up buttons (no login required for insert).
-- Rows are readable only by the project owner (service role / dashboard):
-- submissions carry user_agent and page_path, so they are not
-- exposed to the anon or authenticated roles.
-- Run in Supabase SQL Editor. Safe to re-run.

create table if not exists public.click_tracking (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_type text not null check (event_type in ('demo_button_click', 'sign_up_button_click')),
  page_path text,
  user_agent text,
  referrer text
);

create index if not exists click_tracking_created_at_idx
  on public.click_tracking (created_at desc);

create index if not exists click_tracking_event_type_idx
  on public.click_tracking (event_type);

-- Size guards on text input
alter table public.click_tracking
  drop constraint if exists click_tracking_page_path_length,
  drop constraint if exists click_tracking_user_agent_length,
  drop constraint if exists click_tracking_referrer_length;

alter table public.click_tracking
  add constraint click_tracking_page_path_length
    check (page_path is null or char_length(page_path) <= 200),
  add constraint click_tracking_user_agent_length
    check (user_agent is null or char_length(user_agent) <= 400),
  add constraint click_tracking_referrer_length
    check (referrer is null or char_length(referrer) <= 400);

alter table public.click_tracking enable row level security;

-- No select policy: guests may submit clicks but cannot read submissions.
drop policy if exists "click_tracking_select_public" on public.click_tracking;

drop policy if exists "click_tracking_insert_anyone" on public.click_tracking;
create policy "click_tracking_insert_anyone"
  on public.click_tracking
  for insert
  with check (true);

notify pgrst, 'reload schema';
