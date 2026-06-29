-- Run this on an existing database that still has planning_state ('none', 'backlog').
-- Order matters: drop the old check before writing 'later'.

alter table tasks drop constraint if exists tasks_planning_state_check;

update tasks
set planning_state = 'later'
where planning_state = 'backlog';

alter table tasks
  add constraint tasks_planning_state_check
  check (planning_state in ('none', 'later'));
