-- Task group icon + color for pill headers
-- Run in Supabase SQL Editor after task_groups.sql
-- (Columns are also added in task_groups.sql; this file is safe to re-run.)

alter table task_groups
  add column if not exists icon text,
  add column if not exists color text;

update task_groups set icon = '📅', color = 'sky' where slug = 'today' and icon is null;
update task_groups set icon = '📥', color = 'inbox' where slug = 'inbox' and icon is null;
update task_groups set icon = '📚', color = 'blue' where slug = 'study-cpp' and icon is null;
