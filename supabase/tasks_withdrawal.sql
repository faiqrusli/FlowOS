-- Retain routine task removal as an owner-confirmed withdrawal.
-- Apply after tasks.sql and auth_migration.sql.

alter table tasks
  add column if not exists withdrawn_at timestamptz;

create index if not exists tasks_active_user_idx
  on tasks (user_id, updated_at desc)
  where withdrawn_at is null;

drop index if exists tasks_user_next_up_queue_idx;
create index tasks_user_next_up_queue_idx
  on tasks (user_id, queue_order)
  where queue_order is not null
    and completed = false
    and withdrawn_at is null;

create or replace function batch_update_task_queue_orders(
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
  if p_updates is null or jsonb_array_length(p_updates) = 0 then
    return;
  end if;

  for item in select value from jsonb_array_elements(p_updates) as value
  loop
    update tasks
    set queue_order = (item->>'queue_order')::integer
    where id = (item->>'id')::uuid
      and user_id = auth.uid()
      and withdrawn_at is null;
  end loop;
end;
$$;

grant execute on function batch_update_task_queue_orders(jsonb) to authenticated;
