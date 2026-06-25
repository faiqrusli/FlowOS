-- Add archive support for kanban cards.
-- Run in Supabase SQL Editor after notes.sql

alter table kanban_cards
  add column if not exists is_archived boolean not null default false;

create index if not exists kanban_cards_column_archived_idx
  on kanban_cards (column_id, is_archived, sort_order);
