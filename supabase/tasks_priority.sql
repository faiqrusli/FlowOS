-- Run on existing Supabase projects (safe to re-run for columns).

-- Add priority column
ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium';

-- Add user_id column
ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

UPDATE tasks
SET priority = 'medium'
WHERE priority IS NULL;

DO $$
BEGIN
  ALTER TABLE tasks
  ADD CONSTRAINT tasks_priority_check
  CHECK (priority IN ('high', 'medium', 'low'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
