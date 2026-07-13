-- Persistent, task-only Next Up execution queue.
-- Run after tasks.sql and auth_migration.sql.

alter table tasks
  add column if not exists queue_order integer;

alter table tasks
  drop constraint if exists tasks_queue_order_positive;

alter table tasks
  add constraint tasks_queue_order_positive
  check (queue_order is null or queue_order > 0);

create index if not exists tasks_user_next_up_queue_idx
  on tasks (user_id, queue_order)
  where queue_order is not null and completed = false;

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
      and user_id = auth.uid();
  end loop;
end;
$$;

grant execute on function batch_update_task_queue_orders(jsonb) to authenticated;
