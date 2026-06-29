-- Per-column sort preference for task groups (Inbox, custom groups)
-- Run in Supabase SQL Editor after task_groups.sql

alter table task_groups
  add column if not exists sort_mode text not null default 'manual'
  check (sort_mode in ('manual', 'priority', 'created', 'updated', 'alphabetical'));
