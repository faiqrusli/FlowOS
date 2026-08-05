-- Security hardening pass. Apply to any project where earlier migrations were
-- already run; safe to re-run.
--
-- 1. batch_update_task_manual_orders was `security definer` and trusted a
--    caller-supplied p_user_id, letting any authenticated user reorder another
--    user's tasks. It now runs as the caller and derives auth.uid().
-- 2. Legacy "Allow public access to *" policies are dropped again in case a base
--    migration file was re-run after auth_migration.sql.
-- 3. demo_feedback no longer exposes guest submissions (user agent, page path,
--    session id) to the anon/authenticated roles, and bounds free-text input.

-- ---------------------------------------------------------------------------
-- 1. Task manual-order RPC
-- ---------------------------------------------------------------------------
drop function if exists batch_update_task_manual_orders(uuid, jsonb);

create or replace function batch_update_task_manual_orders(
  p_updates jsonb
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  item jsonb;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if p_updates is null or jsonb_array_length(p_updates) = 0 then
    return;
  end if;

  for item in select value from jsonb_array_elements(p_updates) as value
  loop
    update tasks
    set sort_order = (item->>'sort_order')::integer
    where id = (item->>'id')::uuid
      and user_id = auth.uid();
  end loop;
end;
$$;

revoke all on function batch_update_task_manual_orders(jsonb) from public, anon;
grant execute on function batch_update_task_manual_orders(jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- 2. Legacy public policies
-- ---------------------------------------------------------------------------
drop policy if exists "Allow public access to tasks" on tasks;
drop policy if exists "Allow public access to habits" on habits;
drop policy if exists "Allow public access to focus_sessions" on focus_sessions;
drop policy if exists "Allow public access to reflections" on reflections;
drop policy if exists "Allow public access to reflection_entries" on reflection_entries;
drop policy if exists "Allow public access to habit_completions" on habit_completions;

-- ---------------------------------------------------------------------------
-- 3. Demo feedback
-- ---------------------------------------------------------------------------
revoke all on table public.demo_feedback from public, anon, authenticated;
grant insert on table public.demo_feedback to anon, authenticated;

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

drop policy if exists "demo_feedback_select_public" on public.demo_feedback;

drop policy if exists "demo_feedback_insert_anyone" on public.demo_feedback;
create policy "demo_feedback_insert_anyone"
  on public.demo_feedback
  for insert
  with check (is_public = true and is_hidden = false);

notify pgrst, 'reload schema';
