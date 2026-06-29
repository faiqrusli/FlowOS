alter table tasks
  add column if not exists planning_state text not null default 'none';

alter table tasks drop constraint if exists tasks_planning_state_check;

alter table tasks
  add constraint tasks_planning_state_check
  check (planning_state in ('none', 'later'));

create index if not exists tasks_planning_state_idx on tasks (planning_state);
