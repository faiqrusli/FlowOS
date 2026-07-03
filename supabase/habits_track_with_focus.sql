alter table habits
  add column if not exists track_with_focus boolean not null default false;
