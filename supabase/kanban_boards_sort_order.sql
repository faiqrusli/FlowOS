-- Add sort_order to kanban_boards for drag-and-drop tab reordering.
-- Run in Supabase SQL Editor after notes.sql

alter table kanban_boards
  add column if not exists sort_order integer not null default 0;

with ranked as (
  select
    id,
    row_number() over (
      partition by growth_area_id
      order by created_at asc
    ) - 1 as new_sort
  from kanban_boards
)
update kanban_boards as b
set sort_order = ranked.new_sort
from ranked
where b.id = ranked.id;

create index if not exists kanban_boards_area_sort_idx
  on kanban_boards (growth_area_id, sort_order);
