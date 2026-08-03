# Security Checklist

**Non-negotiable security checks for every code change.**

Run this checklist during code review, before suggesting merge, and whenever modifying:
- Database queries
- API routes
- Authentication logic
- User input handling
- Error messages

---

## 1. User-Scoped Data Access

### Rule
**User data MUST be scoped to the authenticated user.**

### Check Every Database Query

❌ **BAD: Not scoped**
```typescript
const { data } = await supabase
  .from('tasks')
  .select('*')
// Returns ALL tasks from ALL users
```

❌ **BAD: Bypassing RLS**
```typescript
const { data } = await supabase
  .from('tasks')
  .select('*')
  .using(true)  // Bypasses Row Level Security
// Never use on user data tables
```

✅ **GOOD: User-scoped**
```typescript
const { data } = await supabase
  .from('tasks')
  .select('*')
  .eq('user_id', userId)
// Only returns current user's tasks
```

✅ **GOOD: With RLS**
```typescript
// If RLS policy exists on table, this is safe:
const { data } = await supabase
  .from('tasks')
  .select('*')
// RLS automatically filters to current user
```

### Verification Steps

**For every query:**

1. **Identify the table**
   - Is it a user data table? (tasks, habits, notes, etc.)
   - Or shared data? (app config, public data)

2. **Check user scoping**
   - Does query have `.eq('user_id', userId)`?
   - Or does table have RLS policy?

3. **Verify RLS exists**
   - Check `supabase/[table-name].sql`
   - Look for `CREATE POLICY` statements
   - Ensure policy checks `auth.uid() = user_id`

4. **Test with two accounts**
   - User A creates data
   - User B tries to access
   - Should fail or return empty

### Red Flags

⚠️ **Query without user_id filter on user table**
⚠️ **Using `.using(true)` on any user data**
⚠️ **No RLS policy on new user table**
⚠️ **Admin bypass in production code**

---

## 2. Input Validation

### Rule
**Never trust user input. Always validate before using.**

### Check All User Input

❌ **BAD: No validation**
```typescript
export async function createTask(data: any) {
  const { error } = await supabase
    .from('tasks')
    .insert(data)  // Directly inserting user input
  return { error }
}
```

❌ **BAD: Trusting client-side validation only**
```typescript
// Client component
const handleSubmit = (e) => {
  if (title.length > 0) {  // Only validates on client
    createTask({ title, user_id: userId })
  }
}
```

✅ **GOOD: Server-side validation with schema**
```typescript
import { z } from 'zod'

const TaskSchema = z.object({
  title: z.string().min(1).max(200),
  completed: z.boolean().optional(),
  user_id: z.string().uuid(),
})

export async function createTask(input: unknown) {
  // Validate first
  const validated = TaskSchema.parse(input)
  
  const { error } = await supabase
    .from('tasks')
    .insert(validated)
  return { error }
}
```

✅ **GOOD: Validation with helpful errors**
```typescript
export async function createTask(input: unknown) {
  try {
    const validated = TaskSchema.parse(input)
    const { error } = await supabase
      .from('tasks')
      .insert(validated)
    return { success: true, error }
  } catch (e) {
    if (e instanceof z.ZodError) {
      return { success: false, error: 'Invalid task data' }
    }
    throw e
  }
}
```

### Verification Steps

**For every input:**

1. **Identify input sources**
   - Form data
   - URL parameters
   - Query strings
   - Request body
   - File uploads

2. **Check validation exists**
   - Zod schema defined?
   - Input parsed before use?
   - Server-side validation (not just client)?

3. **Verify validation covers:**
   - Type checking (string, number, boolean, etc.)
   - Length limits (strings, arrays)
   - Format validation (email, URL, UUID, etc.)
   - Allowed values (enums, sets)
   - Required vs optional fields

4. **Test with malicious input**
   - Empty strings
   - Extremely long strings
   - Special characters (', ", <, >, etc.)
   - SQL injection attempts
   - XSS attempts

### Red Flags

⚠️ **Direct use of req.body, params, query without validation**
⚠️ **Type assertion without runtime validation (as TaskInput)**
⚠️ **Client-side validation only**
⚠️ **Missing length limits**
⚠️ **No error handling for validation failures**

---

## 3. No Hardcoded Secrets

### Rule
**Never commit secrets, keys, tokens, or passwords to code.**

### Check All Credentials

❌ **BAD: Hardcoded API key**
```typescript
const OPENAI_API_KEY = "sk-proj-abc123xyz..."

async function callAPI() {
  const response = await fetch('https://api.openai.com', {
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` }
  })
}
```

❌ **BAD: Hardcoded database credentials**
```typescript
const supabase = createClient(
  'https://abc123.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'  // Hardcoded
)
```

❌ **BAD: Committed .env file**
```bash
# .env (committed to git)
SUPABASE_URL=https://abc123.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ **GOOD: Environment variables**
```typescript
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY not configured')
}

async function callAPI() {
  const response = await fetch('https://api.openai.com', {
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` }
  })
}
```

✅ **GOOD: .env.local (gitignored)**
```bash
# .env.local (in .gitignore)
SUPABASE_URL=https://abc123.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# .env.example (committed, no real values)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
```

### Verification Steps

**For every credential:**

1. **Scan changed files for patterns:**
   - `sk-` (OpenAI keys)
   - `eyJ` (JWT tokens)
   - `Bearer ` followed by long string
   - `password =`
   - URLs with credentials
   - Database connection strings

2. **Check environment variable usage:**
   - Using `process.env.VAR_NAME`?
   - Has fallback or error for missing vars?
   - Validated before use?

3. **Verify .gitignore:**
   - `.env.local` in .gitignore?
   - No `.env` file with real secrets committed?
   - `.env.example` has placeholder values only?

4. **Check git history:**
   - Were secrets ever committed?
   - If yes, they're in history forever (need rotation)

### Red Flags

⚠️ **String literals starting with `sk-`, `eyJ`, `Bearer `**
⚠️ **Database URLs with credentials**
⚠️ **Files named .env committed to git**
⚠️ **Long random-looking strings hardcoded**
⚠️ **Comments with real credentials (even if code removed)**

---

## 4. Row Level Security (RLS)

### Rule
**Every user data table MUST have RLS policies.**

### Check New Tables

❌ **BAD: No RLS**
```sql
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- No RLS policy! Anyone can access any habit.
```

✅ **GOOD: RLS enabled**
```sql
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own habits
CREATE POLICY "Users can view own habits"
  ON habits FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own habits
CREATE POLICY "Users can insert own habits"
  ON habits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own habits
CREATE POLICY "Users can update own habits"
  ON habits FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own habits
CREATE POLICY "Users can delete own habits"
  ON habits FOR DELETE
  USING (auth.uid() = user_id);
```

### Verification Steps

**For every new or modified table:**

1. **Check if user data table:**
   - Does it have `user_id` column?
   - Does it store user-specific data?

2. **Verify RLS enabled:**
   - Look for `ALTER TABLE [name] ENABLE ROW LEVEL SECURITY`
   - Check `supabase/[table-name].sql`

3. **Check policies exist for:**
   - SELECT (read)
   - INSERT (create)
   - UPDATE (modify)
   - DELETE (remove)

4. **Verify policy logic:**
   - Uses `auth.uid()` to get current user
   - Compares to `user_id` column
   - No loopholes or overly permissive conditions

5. **Test policies:**
   - User A creates record
   - User B tries to read → should fail
   - User A can read own → should succeed

### Red Flags

⚠️ **New table with user_id but no RLS**
⚠️ **RLS enabled but no policies (locks everyone out)**
⚠️ **Policy using `TRUE` instead of `auth.uid() = user_id`**
⚠️ **Missing policies (e.g., only SELECT, no INSERT/UPDATE/DELETE)**

---

## 5. Auth Middleware on API Routes

### Rule
**Protected routes MUST be behind authentication middleware.**

### Check New Routes

❌ **BAD: No auth check**
```typescript
// src/app/api/tasks/route.ts
export async function GET(request: Request) {
  const supabase = createClient()
  const { data } = await supabase.from('tasks').select('*')
  return Response.json(data)
  // No auth check! Anyone can call this.
}
```

✅ **GOOD: Auth check with middleware**
```typescript
// src/middleware.ts includes route in PROTECTED_PREFIXES
const PROTECTED_PREFIXES = [
  '/today',
  '/tasks',
  '/habits',
  '/api/',  // All API routes protected
]

// src/app/api/tasks/route.ts
export async function GET(request: Request) {
  const supabase = createClient()
  
  // Check auth (middleware already verified, but double-check)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { data } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
  return Response.json(data)
}
```

✅ **GOOD: Using existing auth patterns**
```typescript
// src/app/(main)/habits/page.tsx
// In (main) route group = protected by layout
export default async function HabitsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Fetch user-scoped data
  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user.id)
  
  return <HabitsList habits={habits} />
}
```

### Verification Steps

**For every new route:**

1. **Identify route type:**
   - Page route (src/app/(...))
   - API route (src/app/api/...)
   - Server action (use server)

2. **Check auth protection:**
   - In `(main)` group? (protected by layout)
   - In `PROTECTED_PREFIXES` in middleware.ts?
   - Has explicit auth check in code?

3. **Verify middleware config:**
   - `src/middleware.ts` includes route prefix
   - Matcher pattern correct
   - Auth check implemented

4. **Test without auth:**
   - Access route without login
   - Should redirect or return 401
   - Should not leak data

### Red Flags

⚠️ **New route accessing user data without auth check**
⚠️ **API route not in PROTECTED_PREFIXES**
⚠️ **Route outside (main) group that should be protected**
⚠️ **No redirect on missing auth (returns data anyway)**

---

## 6. Error Messages Don't Leak Secrets

### Rule
**Error messages to users should be generic. Log details server-side only.**

### Check Error Handling

❌ **BAD: Leaks sensitive info**
```typescript
try {
  await supabase.from('tasks').insert(task)
} catch (error) {
  return Response.json({ 
    error: `Database error: ${error.message}` 
  })
  // Might leak table structure, credentials, etc.
}
```

❌ **BAD: Exposes user data**
```typescript
const user = await getUserById(userId)
if (!user) {
  throw new Error(`User ${userId} not found with email ${email}`)
  // Leaks userId and email to client
}
```

✅ **GOOD: Generic client message, detailed server log**
```typescript
try {
  await supabase.from('tasks').insert(task)
} catch (error) {
  console.error('Failed to insert task:', error)  // Log details server-side
  return Response.json({ 
    error: 'Failed to create task' 
  }, { status: 500 })  // Generic message to client
}
```

✅ **GOOD: Safe error messages**
```typescript
const user = await getUserById(userId)
if (!user) {
  console.error(`User not found: ${userId}`)  // Log server-side
  throw new Error('User not found')  // Generic to client
}
```

### Verification Steps

**For every error message:**

1. **Check what's exposed to client:**
   - Database errors?
   - User IDs, emails?
   - File paths?
   - Stack traces?
   - API keys or tokens?

2. **Verify error handling pattern:**
   - Detailed log server-side (console.error, logger)
   - Generic message client-side
   - Appropriate HTTP status code
   - No stack traces in production

3. **Test error scenarios:**
   - Database failure
   - Auth failure
   - Validation failure
   - Network error
   - All should return safe messages

### Red Flags

⚠️ **`error.message` or `error.stack` sent to client**
⚠️ **User IDs, emails, or personal data in error messages**
⚠️ **Database errors exposed**
⚠️ **File paths or server info leaked**
⚠️ **Different errors for "user not found" vs "wrong password" (timing attack)**

---

## Security Checklist Template

**Use this for every code review:**

```markdown
## Security Checklist

### 1. User-Scoped Data Access
- [ ] All user data queries scoped to current user
- [ ] No `.using(true)` on user data tables
- [ ] RLS policies verified on accessed tables

### 2. Input Validation
- [ ] All user input validated with schema (Zod, etc.)
- [ ] Server-side validation (not just client)
- [ ] Length limits enforced
- [ ] Type checking present
- [ ] Malicious input tested

### 3. No Hardcoded Secrets
- [ ] No API keys, tokens, passwords hardcoded
- [ ] Environment variables used for credentials
- [ ] .env.local in .gitignore
- [ ] No secrets in git history

### 4. Row Level Security (RLS)
- [ ] New tables have RLS enabled
- [ ] RLS policies exist for SELECT, INSERT, UPDATE, DELETE
- [ ] Policies check auth.uid() = user_id
- [ ] Tested with two different users

### 5. Auth Middleware
- [ ] Protected routes in (main) group or PROTECTED_PREFIXES
- [ ] Middleware.ts includes new routes
- [ ] Explicit auth checks where needed
- [ ] Tested without authentication

### 6. Safe Error Messages
- [ ] Generic error messages to client
- [ ] Detailed errors logged server-side only
- [ ] No stack traces to client in production
- [ ] No sensitive data in errors

**Status:** ✅ All checks passed / ⚠️ Issues found (see below)

**Issues:**
[list any security issues found]
```

---

## When to Run This Checklist

✅ **Always:**
- Before every merge
- During code review
- When modifying database queries
- When creating new routes
- When handling user input
- When adding authentication logic

✅ **Especially:**
- New API routes
- New database tables
- Auth flow changes
- Payment/sensitive operations
- Admin features

---

## Integration with Workflows

**Used in:**
- `.ai/workflows/code-review.md` (security review section)
- `.ai/workflows/merge-prep.md` (pre-merge checklist)

**Related:**
- `.ai/context.md` (security principles)

---

**Remember:** Security is non-negotiable. One security issue can compromise all users. Always check, never skip.
