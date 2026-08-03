# Merge Procedure for FlowOS Updates

**When you (Founder) have updates ready to merge to main.**

---

## Quick Procedure

```bash
# 1. Verify all checks pass
npm run build && npm run lint && npm test

# 2. Review your changes
git status
git diff

# 3. Stage and commit
git add .
git commit -m "docs: update AI skills system to Phase 0 with 6-role team"

# 4. Push to branch (if not already pushed)
git push origin your-branch-name

# 5. Merge to main (you're the Founder, you can do this)
git checkout main
git pull origin main
git merge your-branch-name --no-ff
git push origin main

# 6. Verify production
# Check https://flowos-sage.vercel.app
# Verify deployment succeeded

# 7. Clean up branch (optional)
git branch -d your-branch-name
git push origin --delete your-branch-name
```

---

## Detailed Step-by-Step

### 1. Pre-Merge Verification

**Run all quality checks:**
```bash
# From your branch
npm run build
# ✅ Must pass with no errors

npm run lint
# ✅ Must pass with no errors

npm test
# ✅ All tests must pass
```

**If any fail:**
- Fix the issues first
- Commit the fixes
- Re-run checks

---

### 2. Review Your Changes

**Check what you're merging:**
```bash
git status
# See what files changed

git diff main..your-branch-name
# Review every change

# OR if you're already on your branch:
git diff main
```

**Look for:**
- ✅ All intended changes present
- ✅ No accidental changes (like debug code, console.logs)
- ✅ No sensitive information (API keys, secrets)
- ✅ File permissions look correct

---

### 3. Commit Your Changes

**If you have uncommitted changes:**
```bash
# See what's not committed
git status

# Stage specific files
git add .ai/context.md
git add .aiassistant/rules/Ai.md
git add .idea/ai-rules.md
git add AGENTS.md
git add .cursor/rules/flowos-core.mdc
git add docs/07-strategy-and-delivery/current-sprint.md

# Or stage everything
git add .

# Commit with clear message
git commit -m "docs: update AI skills system to Phase 0 with 6-role team

- Updated .ai/context.md with Phase 0 status
- Created .aiassistant/rules/Ai.md for WebStorm AI Assistant
- Updated .idea/ai-rules.md with Phase 0 and 6-role team
- Updated AGENTS.md with Phase 0 context
- Updated .cursor/rules/flowos-core.mdc with Phase 0
- Updated current-sprint.md to reflect Phase 0 work
- Fixed all Phase 1 references to Phase 0
- Added consistency audit documentation
"
```

**Commit message format:**
```
type(scope): subject

body (optional)
```

**Types:**
- `docs:` — Documentation changes
- `feat:` — New feature
- `fix:` — Bug fix
- `refactor:` — Code refactoring
- `test:` — Test changes
- `chore:` — Maintenance

---

### 4. Push to Your Branch (if needed)

**If you haven't pushed yet:**
```bash
# Check current branch
git branch

# Push to remote
git push origin your-branch-name

# If new branch, set upstream
git push -u origin your-branch-name
```

---

### 5. Merge to Main

**As Founder, you have authority to merge:**

```bash
# Switch to main
git checkout main

# Make sure main is up to date
git pull origin main

# Merge your branch (--no-ff preserves history)
git merge your-branch-name --no-ff

# If conflicts, resolve them:
# 1. Open conflicted files
# 2. Fix conflicts (look for <<<<<<, ======, >>>>>>)
# 3. git add <resolved-files>
# 4. git commit

# Push to main
git push origin main
```

**The `--no-ff` flag:**
- Creates a merge commit (preserves branch history)
- Makes it easy to revert if needed
- Shows clear merge points in git history

---

### 6. Verify Production Deployment

**Check Vercel deployment:**

1. **Watch the deploy:**
   - Vercel will automatically deploy when you push to main
   - Check your Vercel dashboard or email for deploy status

2. **Verify the site:**
   ```
   Open: https://flowos-sage.vercel.app
   Check: Site loads without errors
   Test: Navigate to key pages (Today, Tasks, etc.)
   ```

3. **Check deployment logs:**
   - Vercel dashboard → Deployments
   - Look for your commit message
   - Status should be "Ready"

**If deployment fails:**
- Check Vercel logs for errors
- Common issues: build errors, missing env vars
- Can rollback in Vercel dashboard

---

### 7. Update Documentation Logs

**Update july-log.md:**
```bash
# Edit docs/execution/logs/july-log.md
# Add entry at the top:
```

```markdown
## 2026-08-03: AI Skills System v2.0 Complete

**Changes:**
- Updated entire AI skills system to Phase 0 with 6-role team
- Fixed all Phase 1 references to Phase 0
- Updated integration files (Cursor, WebStorm, CLI)
- Created .aiassistant/rules/Ai.md for WebStorm
- Created consistency audit documentation

**Files modified:**
- .ai/context.md
- .ai/sprint-context.md
- .aiassistant/rules/Ai.md (new)
- .idea/ai-rules.md
- AGENTS.md
- .cursor/rules/flowos-core.mdc
- docs/07-strategy-and-delivery/current-sprint.md

**Impact:** All AI tools (Cursor, WebStorm, Kiro CLI) now have consistent Phase 0 context.

**Status:** ✅ Ready for use
```

**Commit the log update:**
```bash
git add docs/execution/logs/july-log.md
git commit -m "docs: update july-log with AI skills v2.0 completion"
git push origin main
```

---

### 8. Clean Up Branch (Optional)

**After successful merge:**

```bash
# Delete local branch
git branch -d your-branch-name

# Delete remote branch
git push origin --delete your-branch-name
```

**Keep branch if:**
- You might need to reference it
- Working on related changes
- Want to preserve for review

---

## Current Update (AI Skills v2.0)

**For your current changes:**

### What Branch Are You On?

```bash
git branch
# Shows current branch with * marker
```

### If You're on Main Already:

**Option 1: Create a branch retroactively**
```bash
# Create branch from current state
git checkout -b docs/ai-skills-v2-phase-0

# Commit your changes
git add .
git commit -m "docs: update AI skills system to Phase 0 with 6-role team"

# Push branch
git push -u origin docs/ai-skills-v2-phase-0

# Switch back to main
git checkout main

# Merge the branch
git merge docs/ai-skills-v2-phase-0 --no-ff
git push origin main
```

**Option 2: Commit directly to main (you're Founder)**
```bash
# You're on main, changes are good
git add .
git commit -m "docs: update AI skills system to Phase 0 with 6-role team"
git push origin main
```

### If You're on a Branch:

```bash
# Run checks
npm run build && npm run lint && npm test

# Commit if needed
git add .
git commit -m "docs: update AI skills system to Phase 0 with 6-role team"

# Push branch
git push origin your-branch-name

# Merge to main
git checkout main
git pull origin main
git merge your-branch-name --no-ff
git push origin main
```

---

## Special Cases

### Merging Someone Else's Work

**If you're reviewing and approving another role's work:**

1. **Check their branch:**
   ```bash
   git fetch origin
   git checkout their-branch-name
   ```

2. **Review their changes:**
   ```bash
   git diff main..their-branch-name
   ```

3. **Run quality checks:**
   ```bash
   npm run build && npm run lint && npm test
   ```

4. **If approved, merge:**
   ```bash
   git checkout main
   git pull origin main
   git merge their-branch-name --no-ff
   git push origin main
   ```

5. **Tell them it's merged:**
   ```
   "Approved and merged to main. Live on production."
   ```

---

### Emergency Hotfix

**For urgent production fixes:**

```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-description

# Make the fix
# (edit files)

# Verify
npm run build && npm run lint && npm test

# Commit
git add .
git commit -m "fix: [description of critical bug fix]"

# Merge immediately
git checkout main
git merge hotfix/critical-bug-description --no-ff
git push origin main

# Verify production
# Check https://flowos-sage.vercel.app
```

---

### Rollback (If Something Goes Wrong)

**If merge causes production issues:**

```bash
# Find the commit before the merge
git log --oneline -10

# Revert the merge commit
git revert -m 1 <merge-commit-hash>
git push origin main

# Or hard reset (dangerous - use as last resort)
git reset --hard <commit-before-merge>
git push origin main --force
```

**Better:** Use Vercel dashboard to rollback to previous deployment

---

## Checklist Template

**Use this before every merge:**

```markdown
## Pre-Merge Checklist

### Quality Checks
- [ ] `npm run build` — ✅ Pass
- [ ] `npm run lint` — ✅ Pass  
- [ ] `npm test` — ✅ Pass
- [ ] Manual testing — ✅ Completed (if code changes)

### Review
- [ ] `git diff main` reviewed
- [ ] No accidental changes
- [ ] No sensitive data
- [ ] Commit message clear

### Security (if code changes)
- [ ] User-scoped data
- [ ] Input validation
- [ ] No hardcoded secrets
- [ ] RLS on new tables
- [ ] Auth on routes
- [ ] Safe error messages

### Merge
- [ ] Branch up to date with main
- [ ] Merged with `--no-ff`
- [ ] Pushed to main
- [ ] Production verified

### Documentation
- [ ] july-log.md updated
- [ ] Relevant docs updated
```

---

## Best Practices

✅ **Always run build/lint/test before merge**  
✅ **Review git diff before committing**  
✅ **Use `--no-ff` for merge (preserves history)**  
✅ **Verify production after deploy**  
✅ **Update july-log.md after merge**  
✅ **Keep commits atomic (one logical change)**  
✅ **Write clear commit messages**  

❌ **Never skip quality checks**  
❌ **Never force push to main (unless emergency rollback)**  
❌ **Never merge without reviewing changes**  
❌ **Never commit secrets or sensitive data**  

---

## Summary for Your Current Update

**You've updated AI skills documentation. Here's what to do:**

```bash
# 1. Check current state
git status
git branch

# 2. If changes not committed yet:
git add .
git commit -m "docs: update AI skills system to Phase 0 with 6-role team"

# 3. If not on main:
git checkout main
git pull origin main
git merge your-branch --no-ff

# 4. Push to main
git push origin main

# 5. Verify Vercel deploys successfully

# 6. Update july-log.md with what shipped
```

**That's it! Your changes are live.** 🎉

---

**Questions? Ask me to clarify any step!**
