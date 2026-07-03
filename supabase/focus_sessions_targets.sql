alter table focus_sessions
  add column if not exists target_type text check (target_type in ('task', 'habit'));

alter table focus_sessions
  add column if not exists target_id uuid;
