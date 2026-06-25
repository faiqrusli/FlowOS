-- Add pin support for notes (run in Supabase SQL Editor)
alter table notes
  add column if not exists is_pinned boolean not null default false;

create index if not exists notes_area_pin_updated_idx
  on notes (growth_area_id, is_pinned desc, updated_at desc);
