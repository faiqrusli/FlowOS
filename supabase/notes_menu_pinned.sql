-- Pin notes to the top of the right sidebar notes menu (distinct from is_pinned on notes page)
alter table notes
  add column if not exists is_menu_pinned boolean not null default false;

create index if not exists notes_user_menu_pin_updated_idx
  on notes (user_id, is_menu_pinned desc, updated_at desc);
