-- Add user_id to all user-owned tables and enable per-user RLS.

alter table tasks
  add column if not exists user_id uuid references auth.users(id);

alter table habits
  add column if not exists user_id uuid references auth.users(id);

alter table focus_sessions
  add column if not exists user_id uuid references auth.users(id);

alter table reflections
  add column if not exists user_id uuid references auth.users(id);

alter table reflection_entries
  add column if not exists user_id uuid references auth.users(id);

-- Per-user reflection dates (replace global unique on reflection_date).
alter table reflections drop constraint if exists reflections_reflection_date_key;

create unique index if not exists reflections_user_date_unique
  on reflections (user_id, reflection_date);

-- Drop legacy public policies.
drop policy if exists "Allow public access to tasks" on tasks;
drop policy if exists "Allow public access to habits" on habits;
drop policy if exists "Allow public access to focus_sessions" on focus_sessions;
drop policy if exists "Allow public access to reflections" on reflections;
drop policy if exists "Allow public access to reflection_entries" on reflection_entries;
drop policy if exists "Allow public access to habit_completions" on habit_completions;

-- Tasks
create policy "Users read own tasks"
  on tasks for select
  using (auth.uid() = user_id);

create policy "Users insert own tasks"
  on tasks for insert
  with check (auth.uid() = user_id);

create policy "Users update own tasks"
  on tasks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users delete own tasks"
  on tasks for delete
  using (auth.uid() = user_id);

-- Habits
create policy "Users read own habits"
  on habits for select
  using (auth.uid() = user_id);

create policy "Users insert own habits"
  on habits for insert
  with check (auth.uid() = user_id);

create policy "Users update own habits"
  on habits for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users delete own habits"
  on habits for delete
  using (auth.uid() = user_id);

-- Focus sessions
create policy "Users read own focus_sessions"
  on focus_sessions for select
  using (auth.uid() = user_id);

create policy "Users insert own focus_sessions"
  on focus_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users update own focus_sessions"
  on focus_sessions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users delete own focus_sessions"
  on focus_sessions for delete
  using (auth.uid() = user_id);

-- Reflections
create policy "Users read own reflections"
  on reflections for select
  using (auth.uid() = user_id);

create policy "Users insert own reflections"
  on reflections for insert
  with check (auth.uid() = user_id);

create policy "Users update own reflections"
  on reflections for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users delete own reflections"
  on reflections for delete
  using (auth.uid() = user_id);

-- Reflection entries
create policy "Users read own reflection_entries"
  on reflection_entries for select
  using (auth.uid() = user_id);

create policy "Users insert own reflection_entries"
  on reflection_entries for insert
  with check (auth.uid() = user_id);

create policy "Users update own reflection_entries"
  on reflection_entries for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users delete own reflection_entries"
  on reflection_entries for delete
  using (auth.uid() = user_id);

-- Habit completions (via habit ownership)
create policy "Users read own habit_completions"
  on habit_completions for select
  using (
    exists (
      select 1 from habits
      where habits.id = habit_completions.habit_id
        and habits.user_id = auth.uid()
    )
  );

create policy "Users insert own habit_completions"
  on habit_completions for insert
  with check (
    exists (
      select 1 from habits
      where habits.id = habit_completions.habit_id
        and habits.user_id = auth.uid()
    )
  );

create policy "Users delete own habit_completions"
  on habit_completions for delete
  using (
    exists (
      select 1 from habits
      where habits.id = habit_completions.habit_id
        and habits.user_id = auth.uid()
    )
  );
