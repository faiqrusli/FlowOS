-- Ensure every task has a valid manualOrder (sort_order)
-- Run in Supabase SQL Editor after task_groups.sql (sort_order column)

alter table tasks
  alter column sort_order set default 1000;

alter table tasks
  alter column sort_order set not null;

-- Backfill tasks with null, zero, or negative manualOrder per group (preserves relative order)
with ranked as (
  select
    id,
    (row_number() over (
      partition by user_id, group_id
      order by
        case when sort_order is null or sort_order <= 0 then 1 else 0 end,
        sort_order nulls last,
        created_at
    ) * 1000)::integer as next_order
  from tasks
  where sort_order is null or sort_order <= 0
)
update tasks as t
set sort_order = ranked.next_order
from ranked
where t.id = ranked.id;

-- Catch any remaining invalid rows (should be none after the above)
update tasks
set sort_order = 1000
where sort_order is null or sort_order <= 0;
