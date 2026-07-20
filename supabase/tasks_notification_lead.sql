-- Task alert-before fields (notification lead time).
-- Run in Supabase SQL Editor if you see:
--   Could not find the 'notification_lead_minutes' column of 'tasks' in the schema cache
-- Safe to re-run (IF NOT EXISTS).

alter table tasks
  add column if not exists notification_enabled boolean not null default true,
  add column if not exists notification_lead_minutes integer;

-- Refresh PostgREST schema cache (Dashboard may also need a few seconds).
notify pgrst, 'reload schema';
