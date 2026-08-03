# AI Workflow: Code Review

**When to use:** User says "Review my changes" or "Ready to merge?" or before suggesting merge.

**Goal:** Thorough, honest review that catches issues before they reach production.

---

## Workflow Steps

### 1. Run Git Diff

**Action:**
```powershell
git diff main..branch-name
```

**If user didn't specify branch:**
```powershell
git branch --show-current  # Get current branch
git diff main..$(git branch --show-current)
```

### 2. Initial Assessment

**Quick scan for:**
- Number of files changed
- Size of diff (lines added/removed)
- Scope alignment (does this match session goals?)
- Any obvious red flags

**Report structure:**
```markdown
## Code Review: [branch-name]

**Changed files:** N files
**Lines:** +XXX / -YYY
**Session goal:** [from runbook or stated goal]
**Scope check:** ✅ Aligned / ⚠️ Scope creep detected
```

### 3. Security Review (Non-Negotiable)

**Check every changed file against security checklist:**

#### Database Queries
```typescript
// ❌ BAD: Not user-scoped
const { data } = await supabase.from('tasks').select('*')

// ❌ BAD: Bypassing RLS
const { data } = await supabase.from('tasks').select('*').using(true)

// ✅ GOOD: User-scoped with RLS
const { data } = await supabase
  .from('tasks')
  .select('*')
  .eq('user_id', userId)
```

**Flag:** Any query without user scoping on user data tables.

#### Input Validation
```typescript
// ❌ BAD: No validation
const result = await createTask(req.body)

// ✅ GOOD: Validated
const validated = TaskSchema.parse(req.body)
const result = await createTask(validated)
```

**Flag:** Any user input going directly to database without validation.

#### Secrets and Keys
```typescript
// ❌ BAD: Hardcoded
const apiKey = "sk_live_abc123..."

// ✅ GOOD: Environment variable
const apiKey = process.env.API_KEY
```

**Flag:** Any hardcoded API keys, tokens, passwords, or secrets.

#### Auth Routes
```typescript
// New route: src/app/(main)/habits/page.tsx
```

**Check:** 
1. Is route in `(main)` group? (means it's protected)
2. If new auth pattern, is it in `PROTECTED_PREFIXES` in `middleware.ts`?
3. Does it access user data? Is it scoped?

#### Error Messages
```typescript
// ❌ BAD: Leaks info
throw new Error(`User ${userId} auth failed: ${dbError}`)

// ✅ GOOD: Generic
throw new Error('Authentication failed')
// Log details server-side only
```

**Flag:** Any error messages that leak sensitive information to client.

### 4. Pattern Matching Review

**For each new file or significant change:**

#### Check 1: Did it copy from similar files?
```
New file: src/components/habits/HabitList.tsx

Similar file: src/components/tasks/TaskList.tsx
- [ ] Same component structure?
- [ ] Same import patterns?
- [ ] Same prop naming style?
- [ ] Same error handling pattern?
```

#### Check 2: Are existing utilities used?
```
Looking at: src/app/(main)/habits/page.tsx

- [ ] Uses existing Supabase helper pattern?
- [ ] Uses colors from schedule-palette.ts or *-appearance.ts?
- [ ] Uses UI components from @/components/ui?
- [ ] Follows server component pattern?
```

#### Check 3: Naming conventions followed?
```
- [ ] Files: kebab-case
- [ ] Components: PascalCase
- [ ] Functions: camelCase
- [ ] Constants: UPPER_SNAKE_CASE
- [ ] Imports: @/ alias
```

### 5. Code Quality Review

#### Readability
- **Clear names:** Do variable/function names explain their purpose?
- **Self-documenting:** Can you understand code without comments?
- **Complexity:** Any overly complex logic that should be simplified?
- **Duplication:** Any duplicated code that should be extracted?

#### Error Handling
```typescript
// ❌ BAD: Silent failure
const { data } = await supabase.from('tasks').select('*')
return data

// ❌ BAD: Swallowed error
try {
  await createTask(task)
} catch (e) {
  // nothing
}

// ✅ GOOD: Handled with context
const { data, error } = await supabase.from('tasks').select('*')
if (error) {
  console.error('Failed to fetch tasks:', error)
  throw new Error('Failed to load tasks')
}
return data
```

**Flag:** Any missing error handling or swallowed errors.

#### React Patterns
- **Server components:** Default unless needs hooks/events?
- **"use client":** Only when necessary? Kept at low boundary?
- **Hooks:** Following React rules?
- **State:** Minimal and necessary?

#### Styling
- **Semantic tokens:** Using `bg-card`, `text-foreground`, etc.?
- **Inline colors:** Any hex codes that should use palette?
- **Responsive:** Appropriate for dark mode?
- **Visibility:** Critical controls visible without hover?

### 6. Functionality Review

**Ask these questions:**

1. **Does this break existing features?**
   - Changed shared components?
   - Modified database schema?
   - Changed API contracts?

2. **Are there edge cases?**
   - Empty states handled?
   - Loading states present?
   - Error states covered?
   - Null/undefined checks?

3. **Does it match the stated goal?**
   - Session objectives met?
   - Acceptance criteria satisfied?
   - Nothing extra added?

4. **Are there tests? (when applicable)**
   - For critical logic?
   - For edge cases?
   - Passing?

### 7. Build and Lint Check

**Action:**
```powershell
npm run build
npm run lint
```

**If errors:**
```
⚠️ Build/lint errors found:

[show errors]

Priority: [High/Medium/Low based on severity]

These must be fixed before merge. Would you like me to:
1. Fix them
2. Explain what they mean
3. Show which changes caused them
```

**If warnings in touched files:**
```
ℹ️ Lint warnings in changed files:

[show warnings]

Recommendation: Fix before merge for code quality.
```

### 8. Produce Review Report

**Format:**

```markdown
## Code Review: [branch-name]

### Summary
**Changed files:** N files
**Lines:** +XXX / -YYY  
**Session goal:** [goal]
**Status:** ✅ Ready / ⚠️ Issues found / ❌ Blocking issues

---

### Security Review
[✅ Pass / ⚠️ Warnings / ❌ Issues]

- [✅/⚠️/❌] User-scoped queries: [details]
- [✅/⚠️/❌] Input validation: [details]
- [✅/⚠️/❌] No hardcoded secrets: [details]
- [✅/⚠️/❌] Auth routes protected: [details]
- [✅/⚠️/❌] Error messages safe: [details]

**Issues:** [list any security issues]

---

### Pattern Matching
[✅ Pass / ⚠️ Warnings]

- [✅/⚠️] Follows existing patterns: [details]
- [✅/⚠️] Uses existing utilities: [details]
- [✅/⚠️] Naming conventions: [details]
- [✅/⚠️] Styling with semantic tokens: [details]

**Suggestions:** [any pattern improvements]

---

### Code Quality
[✅ Pass / ⚠️ Warnings]

- [✅/⚠️] Readability: [details]
- [✅/⚠️] Error handling: [details]
- [✅/⚠️] React patterns: [details]
- [✅/⚠️] No duplication: [details]

**Issues:** [list any quality issues]

---

### Functionality
[✅ Pass / ⚠️ Concerns]

- [✅/⚠️] No breaking changes: [details]
- [✅/⚠️] Edge cases handled: [details]
- [✅/⚠️] Matches session goals: [details]
- [✅/⚠️] Empty/loading/error states: [details]

**Concerns:** [list any functionality concerns]

---

### Build/Lint
[✅ Pass / ❌ Errors]

```
[build output]
[lint output]
```

---

### Recommendations

**Must fix before merge:**
1. [blocking issue 1]
2. [blocking issue 2]

**Should fix:**
1. [important issue 1]
2. [important issue 2]

**Nice to have:**
1. [minor improvement 1]
2. [minor improvement 2]

---

### Verdict

[✅ Ready to merge — all checks pass]
[⚠️ Ready with minor fixes — address recommendations then merge]
[❌ Not ready — blocking issues must be resolved]

**Next steps:**
[what should happen next]

**Ready to merge?** [if pass] / **Should we fix the issues?** [if issues]
```

### 9. Wait for User Decision

**Don't proceed without user input.**

User might want to:
- Fix issues themselves
- Ask questions about findings
- Disagree with assessment (discuss)
- Defer some fixes
- Merge anyway (respect but note concerns)

---

## Examples

### Example 1: Clean Review

```markdown
## Code Review: m2/session-3-habits

### Summary
**Changed files:** 5 files
**Lines:** +347 / -12
**Session goal:** Build Habits module with list/add/complete
**Status:** ✅ Ready to merge

---

### Security Review
✅ Pass

- ✅ User-scoped queries: All habits queries use userId from auth
- ✅ Input validation: HabitSchema validates before DB operations
- ✅ No hardcoded secrets: Uses environment variables
- ✅ Auth routes protected: In (main) group with middleware
- ✅ Error messages safe: Generic messages to client, details logged server-side

---

### Pattern Matching
✅ Pass

- ✅ Follows existing patterns: Copied task list structure exactly
- ✅ Uses existing utilities: Uses schedule-palette.ts for colors
- ✅ Naming conventions: All files kebab-case, components PascalCase
- ✅ Styling: Uses semantic tokens (bg-card, text-foreground, etc.)

---

### Code Quality
✅ Pass

- ✅ Readability: Clear names, well-structured components
- ✅ Error handling: All DB operations check for errors
- ✅ React patterns: Server components with client boundary at HabitList
- ✅ No duplication: Shared logic in src/lib/supabase-habits.ts

---

### Functionality
✅ Pass

- ✅ No breaking changes: Only additions, no modifications to existing code
- ✅ Edge cases: Empty state, loading state, error state all handled
- ✅ Matches session goals: All objectives met
- ✅ States covered: Add, complete, list all work correctly

---

### Build/Lint
✅ Pass

```
✓ Build completed in 23.4s
✓ Lint passed with no errors
```

---

### Verdict

✅ **Ready to merge**

All checks pass. Code follows patterns, security is solid, functionality is complete.

**Next steps:**
1. Manual test: Add habit → complete → verify shows on Today
2. Merge to main (requires founder approval)
3. Update july-log.md after merge

**Ready to merge?**
```

### Example 2: Issues Found

```markdown
## Code Review: tweak/habit-colors

### Summary
**Changed files:** 3 files
**Lines:** +89 / -34
**Session goal:** Update habit colors to match Tokyo Night Warm
**Status:** ⚠️ Issues found

---

### Security Review
✅ Pass - No security implications for this change

---

### Pattern Matching
⚠️ Warnings

- ⚠️ Inline hex colors: Using `#7aa2f7` instead of schedule-palette.ts
- ✅ Naming conventions: Followed
- ✅ Component structure: Follows existing patterns

**Suggestions:**
1. Add habit colors to schedule-palette.ts or habit-appearance.ts
2. Reference palette instead of inline hex

---

### Code Quality
✅ Pass

- ✅ Readability: Clear changes
- ✅ No duplication: DRY principle followed

---

### Functionality
⚠️ Concerns

- ⚠️ Dark mode only: Colors not tested in light (OK for FlowOS, but worth noting)
- ✅ No breaking changes: Visual only

**Concerns:**
- Colors should come from centralized palette for consistency

---

### Build/Lint
✅ Pass

---

### Recommendations

**Should fix before merge:**
1. Move hex colors to schedule-palette.ts or create habit-appearance.ts
2. Import and use palette colors instead of inline hex

**Rationale:**
- Centralized colors = easier theme updates
- Follows existing FlowOS pattern (tasks, schedule all use palettes)
- Makes colors semantic, not arbitrary

---

### Verdict

⚠️ **Ready with fixes**

Functional and secure, but should follow pattern of centralized colors for consistency with rest of codebase.

**Next steps:**
1. Create habit-appearance.ts with color palette
2. Update HabitCard to use palette colors
3. Re-review

**Should we fix the color patterns first?**
```

---

## Checklist: Review Complete

Before giving verdict:

- [ ] Git diff run and analyzed
- [ ] Security checklist complete (all 5 items)
- [ ] Pattern matching verified (similar files checked)
- [ ] Code quality assessed (readability, errors, duplication)
- [ ] Functionality checked (breaking changes, edge cases, goals)
- [ ] Build/lint run and passed (or errors documented)
- [ ] Review report written with clear verdict
- [ ] Recommendations prioritized (must/should/nice)
- [ ] Next steps clear

---

## Anti-Patterns (Don't Do This)

❌ **Skipping security check**
```
"Code looks good, follows patterns. Ready to merge?"
```
Problem: Security is non-negotiable. Always check.

❌ **Not running build/lint**
```
"Logic is sound, should build fine. Ready to merge?"
```
Problem: "Should" isn't verification. Always run.

❌ **Generic feedback**
```
"Code quality is good. A few things could be improved."
```
Problem: Too vague. Be specific about what and why.

❌ **Approving with blocking issues**
```
"Has security issue but otherwise good. Ready to merge?"
```
Problem: Never OK to merge with security issues.

---

## Best Practices

✅ **Be thorough but pragmatic**
Catch real issues, don't bikeshed style.

✅ **Be honest and constructive**
Point out problems clearly, suggest solutions.

✅ **Explain your reasoning**
Help user learn, don't just dictate.

✅ **Prioritize findings**
Must-fix vs nice-to-have matters.

✅ **Verify with tools**
Run build/lint, don't assume.

✅ **Respect scope**
If change is out of scope, flag it (even if good code).

---

**Remember:** You're the last line of defense before production. Take review seriously.
