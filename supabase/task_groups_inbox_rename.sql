-- Rename built-in Tasks column to Inbox with updated appearance
update task_groups
set
  title = 'Inbox',
  icon = '📥',
  color = 'inbox'
where slug = 'inbox';
