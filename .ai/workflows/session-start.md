# AI Workflow: Session Start

**When to use:** User says "Start M2 session N" or "Begin work on [feature]"

**Goal:** Set up clean working branch with full context and clear objectives.

---

## Workflow Steps

### 1. Acknowledge and Gather Context

**User says:** "Start M2 session 3"

**AI response:**
```
Starting M2 session 3. Let me:
1. Read the session details from the runbook
2. Create a new branch
3. Summarize the session goals

One moment...
```

### 2. Read Runbook Session

**Action:** Read `docs/execution/runbooks/m2-founder-daily-driver.md`

**Look for:**
- Session number and title
- Session objectives
- Key deliverables
- Prerequisites (previous sessions)
- Merge bundle info (B1-B5)
- Any special notes or warnings

### 3. Check Current Git State

**Action:** Run `git status` to verify:
- Currently on `main` branch
- Working directory is clean
- No uncommitted changes

**If not clean:**
```
⚠️ Working directory has uncommitted changes. Would you like to:
1. Commit them first
2. Stash them
3. Review what they are
```

Wait for user decision.

### 4. Create New Branch

**Action:**
```powershell
git checkout main
git pull origin main
git checkout -b m2/session-N-short-name
```

**Branch naming:**
- M2 sessions: `m2/session-N-short-name` (e.g., `m2/session-3-habits`)
- Tweaks: `tweak/short-description`
- Docs: `docs/short-description`

### 5. Verify Prerequisites

**Check:**
- Are previous sessions complete? (if session dependencies exist)
- Are required files/features in place?
- Is the codebase in expected state?

**If prerequisites missing:**
```
⚠️ Session 3 depends on Session 2 (routing). 
Current state check:
- [ ] Session 2 merged to main?
- [ ] Required routes exist?

Should we verify prerequisites first?
```

### 6. Summarize Session Context

**Provide clear summary:**

```markdown
## Session N: [Title]

**Branch:** m2/session-N-short-name

**Objectives:**
- Objective 1
- Objective 2
- Objective 3

**Key deliverables:**
- File/feature 1
- File/feature 2

**Merge bundle:** BN (merges with session X)
- This means: We'll merge sessions N and X together after both complete

**Files to check first:**
- src/path/to/similar-file.tsx (for pattern reference)
- src/lib/relevant-utility.ts

**Out of scope:**
- Thing 1 (defer until later)
- Thing 2 (not in M2)

**Ready to begin?**
```

### 7. Wait for Confirmation

**Don't start coding until user confirms.**

User might want to:
- Review the objectives
- Adjust scope
- Ask questions
- Check something first

---

## Example Session Start

### User Input
```
Start M2 session 3
```

### AI Response

```
Starting M2 session 3...

[reads runbook]
[checks git status]
[creates branch]

## Session 3: Habits Module

**Branch:** m2/session-3-habits

**Objectives:**
1. Build Habits page with list/add/complete
2. Connect to Supabase habits table
3. Implement track-with-focus toggle
4. Add habits to Today page integration

**Key deliverables:**
- src/app/(main)/habits/page.tsx
- src/components/habits/HabitList.tsx
- src/components/habits/AddHabitDialog.tsx
- Update src/app/(main)/today/page.tsx

**Pattern references:**
- src/app/(main)/tasks/page.tsx (similar list pattern)
- src/components/tasks/AddTaskDialog.tsx (similar dialog)
- src/lib/supabase-tasks.ts (similar data layer)

**Merge bundle:** B2 (merges with session 4)
- We'll merge sessions 3 and 4 together after both complete

**Security checklist for this session:**
- [ ] User-scoped queries for habits
- [ ] RLS already on habits table (verify in supabase/)
- [ ] No hardcoded user IDs

**Out of scope:**
- Habit streaks/analytics (later)
- Habit reordering (later)
- Visual polish beyond functional

Ready to begin? I'll start by reading the existing tasks patterns to copy for habits.
```

### User Confirms
```
Yes, go ahead
```

### AI Next Action
```
Reading pattern references:
1. src/app/(main)/tasks/page.tsx
2. src/components/tasks/AddTaskDialog.tsx
3. src/lib/supabase-tasks.ts

[reads files]

Pattern summary:
- Page uses server component with data fetch
- List component handles display + actions
- Dialog uses Dialog from @/components/ui
- Data layer uses Supabase client with RLS

Starting with data layer first: src/lib/supabase-habits.ts...
```

---

## Error Handling

### Runbook Session Not Found

```
⚠️ Could not find session 3 in m2-founder-daily-driver.md.

Available sessions:
- Session 1: Foundation
- Session 2: Routing

Would you like to:
1. Work on a different session
2. Create a custom branch for this work
3. Review the runbook first
```

### Git Issues

```
⚠️ Cannot create branch: uncommitted changes on main

Current changes:
[list files]

Should I:
1. Show git diff to review changes
2. Help commit these changes first
3. Stash and proceed
```

### Merge Conflicts

```
⚠️ git pull origin main has conflicts

Conflicts in:
- src/app/(main)/today/page.tsx

Should we:
1. Resolve conflicts first
2. Review what changed on main
3. Abort and check with you
```

---

## Checklist: Session Start Complete

Before saying "Ready to code":

- [ ] Runbook session read and understood
- [ ] New branch created from updated main
- [ ] Branch follows naming convention
- [ ] Session objectives summarized clearly
- [ ] Pattern reference files identified
- [ ] Prerequisites verified
- [ ] Merge bundle noted
- [ ] Security considerations identified
- [ ] Out-of-scope items noted
- [ ] User confirmed ready to proceed

---

## Integration with Other Workflows

**Next workflow:** Start coding (pattern matching)
**Related:** `.ai/checklists/pattern-matching.md`

**If session spans multiple days:**
- Update `docs/execution/logs/developer-log/YYYY-MM-DD.md` at end of each day
- Add session timeline entries
- Note any blockers or questions

---

## Anti-Patterns (Don't Do This)

❌ **Starting without reading runbook**
```
AI: "I'll create the habits page..."
```
Problem: Missing context, objectives, merge bundle info.

❌ **Creating branch without checking git state**
```
AI: "Branch created: m2/session-3-habits"
[but main had uncommitted changes]
```
Problem: Pollutes new branch with unrelated changes.

❌ **Starting to code before user confirms**
```
AI: "Session 3 ready. Here's the first file..."
[writes code without waiting]
```
Problem: User might want to adjust scope or ask questions first.

❌ **Not identifying pattern references**
```
AI: "Ready to build habits page. I'll use standard React patterns..."
```
Problem: Should copy FlowOS existing patterns, not generic React.

---

## Best Practices

✅ **Always read runbook first**
Even if you think you know what the session is about.

✅ **Verify git state before creating branch**
Clean state = clean branch.

✅ **Identify merge bundle early**
Helps user understand when changes go to production.

✅ **List pattern references explicitly**
Shows you're following "pattern matching first" principle.

✅ **Note security considerations upfront**
Makes security a first-class concern, not an afterthought.

✅ **Wait for user confirmation**
Respects user autonomy and allows for adjustments.

---

**Remember:** Session start sets the tone for quality work. Take time to set up properly.
