-- Batch update task manualOrder (sort_order) in a single RPC call
-- Run in Supabase SQL Editor after tasks.sql

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
