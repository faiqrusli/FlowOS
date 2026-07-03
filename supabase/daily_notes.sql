-- Daily notes: dated journal entries under the Daily Notes growth area.
-- Run in Supabase SQL Editor after notes.sql

alter table notes
  add column if not exists note_date date null;

create unique index if not exists notes_user_daily_unique
  on notes (user_id, note_date)
  where note_date is not null;

create index if not exists notes_user_note_date_idx
  on notes (user_id, note_date desc)
  where note_date is not null;
