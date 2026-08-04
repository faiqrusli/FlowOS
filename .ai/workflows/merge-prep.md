# AI Workflow: Merge Preparation

**When to use:** Before suggesting merge, after code review passes, when user says "prepare for merge".

**Goal:** Final verification that everything is ready for production.

---

## Pre-Merge Checklist

### 1. Code Review Complete
- [ ] Git diff reviewed
- [ ] Security checklist passed
- [ ] Pattern matching verified
- [ ] Code quality assessed
- [ ] No blocking issues found

**If not done:** Run `.ai/workflows/code-review.md` first.

### 2. Build and Lint Pass
```powershell
npm run build
npm run lint
```

**Must pass with:**
- Zero build errors
- Zero lint errors in changed files
- Acceptable warnings (discuss if new warnings)

**If fails:**
```
❌ Build/lint must pass before merge.

Errors found:
[list errors]

Should I:
1. Fix these errors
2. Explain what they mean
3. Show which changes caused them
```

### 3. Manual Testing Done

**Ask user:**
```
Have you manually tested:
- [ ] Happy path (main feature works)
- [ ] Edge cases (empty states, errors, loading)
- [ ] Integration points (how it connects to existing features)
- [ ] User flow end-to-end

If not, testing is required before merge.
```

**If user hasn't tested:**
```
⚠️ Manual testing required before merge.

Suggested test plan:
1. [Test step 1]
2. [Test step 2]
3. [Test step 3]

Please test and let me know when complete.
```

### 4. Session Goals Met

**Verify against runbook or stated goals:**
```
Session goal: Build Habits module with list/add/complete

Delivered:
✅ Habit list displays user habits
✅ Add habit dialog creates new habits
✅ Complete button marks habit complete
✅ Habits appear on Today page

All objectives met.
```

**If goals not met:**
```
⚠️ Session goals not fully met:

Goal: [goal]
Status:
✅ [completed item]
✅ [completed item]
❌ [missing item]

Should we:
1. Complete missing items first
2. Defer to next session (with note)
3. Merge partial progress (explain why)
```

### 5. Documentation Updated

**Check what needs updating:**

| Change Type | Doc to Update |
|-------------|---------------|
| Product decision | `docs/08-decisions/records/` |
| Session timeline | `docs/current-phase/logs/developer-log/YYYY-MM-DD.md` |
| Commit narrative | `docs/current-phase/logs/august-log.md` (or active month log) |
| New feature/route | `docs/04-features/FEATURE_INVENTORY.md` |
| Architecture change | Relevant active doc (e.g., `docs/06-engineering/`, `docs/05-design/`) |

**Prompt user:**
```
Documentation check:
- [ ] Decision log (if product-level decision made)
- [ ] Developer log (session timeline)
- [ ] Active monthly narrative log (same commit; state is committed/merged/shipped accurately)
- [ ] Feature inventory (if new feature/route)
- [ ] Technical docs (if architecture changed)

Are these updated? If not, we should update before merge.
```

### 6. Merge Bundle Check

**From runbook session info:**
```
This is Session 3, part of Merge Bundle B2.

Bundle B2 includes:
- Session 3: Habits module
- Session 4: Focus enhancements

Status:
✅ Session 3 complete
⏳ Session 4 pending

Action: Keep on branch, merge after Session 4 completes.
```

**Or:**
```
This is Session 2, standalone merge.

No bundle dependencies.

Action: Ready to merge to main after approval.
```

### 7. Breaking Changes Check

**Review diff for potential breaking changes:**
- Modified shared components
- Changed database schema
- Updated API contracts
- Renamed exports
- Changed function signatures

**If breaking changes found:**
```
⚠️ Potential breaking changes detected:

1. Modified TaskCard component (used in multiple places)
2. Changed database column name

Impact assessment:
- TaskCard: Used in Today, Tasks, Schedule pages
- Database: Migration needed, affects existing data

Recommendation:
1. Test all pages using TaskCard
2. Create migration script for database
3. Consider gradual rollout

Proceed with caution.
```

---

## Merge Preparation Report

**Format:**

```markdown
## Merge Preparation: [branch-name]

### Pre-Merge Checklist
- [✅/❌] Code review complete and passed
- [✅/❌] Build passes (npm run build)
- [✅/❌] Lint passes (npm run lint)
- [✅/❌] Manual testing complete
- [✅/❌] Session goals met
- [✅/❌] Documentation updated
- [✅/❌] Merge bundle ready (if applicable)
- [✅/❌] No breaking changes (or assessed and planned)

---

### Summary
**Branch:** [branch-name]
**Session:** [session name/number]
**Changes:** [brief description]
**Files changed:** N files (+XXX / -YYY lines)

---

### Session Goals
[Goal 1]: ✅ Met
[Goal 2]: ✅ Met
[Goal 3]: ✅ Met

All session objectives complete.

---

### Build/Lint Status
```
✓ Build completed in 23.4s
✓ Lint passed with no errors
```

---

### Testing Status
**Manual tests completed:**
✅ [Test scenario 1]
✅ [Test scenario 2]
✅ [Test scenario 3]

No issues found.

---

### Documentation Status
✅ Developer log updated (YYYY-MM-DD.md)
✅ Feature inventory updated (added Habits module)
[ ] Decision log (no product decisions this session)
✅ Active month log updated with `committed` / `merged` / `shipped` state

---

### Merge Bundle Status
[If applicable]
**Bundle:** B2 (Sessions 3 + 4)
**Status:** Keep on branch, merge after Session 4

[Or if standalone]
**Type:** Standalone merge
**Status:** Ready to merge

---

### Breaking Changes
[✅ None detected]

[Or if present]
⚠️ Potential breaking changes:
1. [Change 1] - Impact: [details] - Mitigation: [plan]

---

### Production Impact
**Risk level:** [Low / Medium / High]
**Rollback plan:** Git revert [commit] or redeploy previous version
**Monitoring:** [What to watch after deploy]

---

### Ready to Merge?

[✅ All checks passed — ready for founder approval]

[Or if issues]
⚠️ Action needed:
1. [Action item 1]
2. [Action item 2]

---

**Awaiting founder approval to merge to main.**
```

---

## Merge Commands (After Approval)

### Standard Merge

**After founder says "yes" or "merge":**

```powershell
# 1. Switch to main and update
git checkout main
git pull origin main

# 2. Merge branch (no fast-forward to preserve history)
git merge [branch-name] --no-ff

# 3. Verify build/lint one final time
npm run build
npm run lint

# 4. Push to main
git push origin main
```

**Report after merge:**
```
✅ Merged [branch-name] to main

Commits merged:
- [commit 1]
- [commit 2]

Next steps:
1. Verify production deployment: https://flowos-sage.vercel.app
2. Confirm the active month log with merge/shipped details
3. Monitor for any issues

Production deployment in progress...
[check Vercel status if possible]
```

### Bundle Merge

**If merging multiple sessions together:**

```powershell
# 1. Ensure all bundle sessions are on their branches
git checkout main && git pull origin main

# 2. Merge first session
git merge m2/session-3-habits --no-ff

# 3. Merge second session
git merge m2/session-4-focus --no-ff

# 4. Resolve any conflicts if needed

# 5. Verify build/lint
npm run build
npm run lint

# 6. Push to main
git push origin main
```

**Report:**
```
✅ Merged Bundle B2 to main

Sessions merged:
- Session 3: Habits module
- Session 4: Focus enhancements

Total commits: N
Files changed: X (+YYY / -ZZZ lines)

Next steps:
1. Verify production
2. Update august-log.md (note bundle merge)
3. Monitor deployment
```

---

## Post-Merge Checklist

### 1. Verify Production

```
Checking production: https://flowos-sage.vercel.app

Testing deployed changes:
- [ ] Feature works as expected
- [ ] No console errors
- [ ] No breaking changes to existing features
- [ ] Database operations work

[If successful]
✅ Production verified, all working correctly.

[If issues]
⚠️ Production issue detected: [description]
Rollback recommended? [explain]
```

### 2. Update August Log

**Action:** Append or update the entry in `docs/current-phase/logs/august-log.md` (or the active month log) for every commit. After merge, confirm the entry reflects what shipped.

**Format:**
```markdown
## YYYY-MM-DD: [What Shipped]

**Branch:** [branch-name]
**Session:** [session name if applicable]

**Changes:**
- [Change 1]
- [Change 2]
- [Change 3]

**Files modified:**
- [key files]

**Impact:** [user-facing impact or technical improvement]

**Bundle:** [if applicable: "Part of Bundle BN with sessions X, Y"]
```

**Prompt user:**
```
August log entry drafted:

[show entry]

Should I add this to august-log.md?
```

### 3. Clean Up Branch (Optional)

**Ask user:**
```
Branch [branch-name] successfully merged to main.

Would you like to:
1. Delete local branch (git branch -d [branch-name])
2. Delete remote branch (git push origin --delete [branch-name])
3. Keep branches for reference
```

**If user wants cleanup:**
```powershell
# Delete local branch
git branch -d [branch-name]

# Delete remote branch
git push origin --delete [branch-name]
```

---

## Error Handling

### Build Fails Before Merge

```
❌ Cannot merge: build failed

Errors:
[show build errors]

Action required:
1. Fix build errors on branch
2. Re-run build
3. Return to merge preparation

Should I help fix these errors?
```

### Merge Conflicts

```
⚠️ Merge conflict detected

Conflicts in:
- src/app/(main)/today/page.tsx
- src/lib/supabase-tasks.ts

This means main branch changed since you started.

Options:
1. Show conflicting changes
2. Update branch from main and resolve conflicts
3. Abort merge and review

What would you like to do?
```

### Production Verification Fails

```
⚠️ Production issue detected after merge

Issue: [description of problem]
Severity: [High / Medium / Low]

Rollback options:
1. git revert [commit-hash] (safest)
2. Redeploy previous version on Vercel
3. Fix forward with hotfix

Recommendation: [based on severity]

Should we proceed with rollback?
```

---

## Anti-Patterns (Don't Do This)

❌ **Merging without approval**
```
"All checks pass. Merging to main..."
[executes merge]
```
Problem: NEVER merge without explicit founder approval.

❌ **Skipping final build/lint**
```
"Already passed earlier. Merging..."
```
Problem: Main might have changed. Always verify before push.

❌ **Forgetting august-log update**
```
"✅ Merged successfully!"
[doesn't mention documentation]
```
Problem: August log tracks what ships. Always update after merge.

❌ **Not verifying production**
```
"Merge complete. All done!"
```
Problem: Should verify deployment actually worked.

---

## Best Practices

✅ **Triple-check before merge**
Build, lint, review one more time.

✅ **Wait for explicit approval**
"Ready to merge?" not "Merging now."

✅ **Use --no-ff for merge**
Preserves branch history, makes rollback easier.

✅ **Verify production immediately**
Catch issues while context is fresh.

✅ **Update august-log same session**
Don't defer documentation.

✅ **Keep calm if issues arise**
Have rollback plan, don't panic.

---

## Integration with Other Workflows

**Previous workflow:** `.ai/workflows/code-review.md`
**Next workflow:** Post-merge monitoring and documentation
**Related:** `.ai/workflows/documentation.md`

---

**Remember:** Merging to main = deploying to production. Take it seriously. One final check is worth avoiding production issues.
