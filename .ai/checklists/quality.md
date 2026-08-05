# Quality Checklist

**Pre-merge quality verification**

Run this checklist before requesting approval to merge.

---

## Quick Checklist

```bash
# 1. Build
npm run build
# Must pass with zero errors

# 2. Lint  
npm run lint -- --max-warnings=0
# Must pass with zero errors and zero warnings

# 3. Test
npm test
# All tests must pass

# 4. Security
# See .ai/checklists/security.md
# All 6 checks must pass

# 5. Manual test
npm run dev
# Test happy path + edge cases + errors

# 6. Review changes
git diff main..your-branch
# Review every changed line
```

**All must pass before requesting approval.**

---

## 1. Build Verification

**Command:**
```bash
npm run build
```

**What it checks:**
- ✅ TypeScript compilation
- ✅ Next.js build process
- ✅ No build-time errors
- ✅ All imports resolve
- ✅ No circular dependencies

**Success criteria:**
```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

**If fails:**
- Read error message carefully
- Fix TypeScript errors
- Fix import issues
- Fix missing dependencies
- Re-run build

**Status:** ✅ Pass / ❌ Fail

---

## 2. Lint Verification

**Command:**
```bash
npm run lint -- --max-warnings=0
```

**What it checks:**
- ✅ Code style consistency
- ✅ Unused variables/imports
- ✅ Missing hook dependencies
- ✅ Basic accessibility (a11y)
- ✅ React best practices

**Success criteria:**
```
✓ No ESLint warnings or errors
```

**Common issues:**
- Unused variables → Remove or prefix with `_`
- Missing dependencies → Add to hook deps array
- Unescaped entities → Use `&lt;` or `{'{'}` in JSX
- Console.log → Remove or justify

**Justified exceptions:**
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// Reason: External library types incomplete
const data: any = externalLib.getData()
```

**Status:** ✅ Pass / ⚠️ Pass with exceptions / ❌ Fail

---

## 3. Test Verification

**Command:**
```bash
npm test
```

**What it checks:**
- ✅ Unit tests pass
- ✅ Integration tests pass
- ✅ No test failures
- ✅ No test timeouts

**Success criteria:**
```
✓ Test Files  X passed (X)
✓ Tests  X passed (X)
✓ Duration  Xs
```

**If fails:**
- Read failure message
- Run single test: `npm test path/to/test.test.ts`
- Debug with console.logs
- Fix code or fix test
- Re-run all tests

**For new code:**
- Add tests for business logic
- Test edge cases (null, empty, large input)
- Test error handling

**Status:** ✅ Pass / ❌ Fail

---

## 4. Security Verification

**See:** `.ai/checklists/security.md` (full 6-point checklist)

**Quick security check:**

- [ ] **User-scoped data:** All queries filtered by user_id or protected by RLS
- [ ] **Input validation:** All user input has server-side runtime validation; shared Zod schemas in `src/lib/validation.ts`
- [ ] **No secrets:** No hardcoded API keys, tokens, or passwords
- [ ] **RLS enabled:** All new user data tables have Row Level Security
- [ ] **Auth protected:** New routes in `(main)` group or `PROTECTED_PREFIXES`
- [ ] **Safe errors:** Error messages don't leak sensitive info to client

**If any fail:** Fix before merge. Security is non-negotiable.

**Status:** ✅ All pass / ❌ Issues found

---

## 5. Manual Testing

**Required even if automated tests pass.**

### Basic Manual Test

**Start server:**
```bash
npm run dev
```

**Test checklist:**

**Happy path:**
- [ ] Main user flow works end-to-end
- [ ] Data persists correctly
- [ ] UI updates appropriately
- [ ] No console errors

**Edge cases:**
- [ ] Empty state (no data) renders correctly
- [ ] Single item works
- [ ] Many items (20+) work smoothly
- [ ] Long text handles gracefully
- [ ] Special characters (`<>&"'`) don't break

**Error scenarios:**
- [ ] Invalid input shows error message
- [ ] Network failure handles gracefully
- [ ] Loading states show appropriately
- [ ] Error recovery works

**UI checks:**
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Keyboard navigation works
- [ ] Focus visible
- [ ] No layout shift

**Status:** ✅ All pass / ⚠️ Minor issues / ❌ Blocking issues

---

## 6. Code Review (Self)

**Review your own changes before asking others:**

```bash
git diff main..your-branch
```

**Check every changed line:**

**Code quality:**
- [ ] Changes are necessary (no unrelated edits)
- [ ] No commented-out code
- [ ] No console.logs (or justified)
- [ ] No TODOs without tickets
- [ ] Clear variable/function names

**Pattern matching:**
- [ ] Follows existing code patterns
- [ ] Uses existing utilities
- [ ] Consistent with similar files
- [ ] Matches project conventions

**Documentation:**
- [ ] Complex logic has comments
- [ ] Public APIs documented
- [ ] Breaking changes noted
- [ ] README updated if needed

**Git hygiene:**
- [ ] Commit messages clear
- [ ] Commits logical (not "fix", "wip", "asdf")
- [ ] No merge commits (rebase if needed)
- [ ] Branch up to date with main

**Status:** ✅ Reviewed / ⚠️ Minor cleanup / ❌ Major issues

---

## 7. Documentation Updates

**Check if documentation needs updating:**

**Code changes:**
- [ ] Updated inline code comments if logic changed
- [ ] Updated README if setup changed
- [ ] Updated API docs if interfaces changed

**Feature changes:**
- [ ] Feature catalog updated if new feature
- [ ] Behavior contract reflects actual behavior
- [ ] Design spec matches implementation

**Architecture changes:**
- [ ] Engineering docs updated
- [ ] Data model documented
- [ ] API contracts updated

**No changes needed:** ✅  
**Updates required:** List files to update

**Status:** ✅ Complete / ⚠️ Pending updates / ❌ Missing docs

---

## 8. Role-Specific Checks

**Product Architect:**
- [ ] Feature brief complete and approved
- [ ] Behavior contract defines all observable behaviors
- [ ] Success criteria clear
- [ ] Out of scope documented

**Design Architect:**
- [ ] Design spec covers all states (empty, loading, error, success)
- [ ] Responsive design specified
- [ ] Accessibility considered
- [ ] Content/copy included

**Engineering Architect:**
- [ ] Delivery design complete
- [ ] Technical approach documented
- [ ] Data model defined
- [ ] Validation plan created

**Implementation Engineer:**
- [ ] Code follows patterns from similar files
- [ ] Tests written for business logic
- [ ] Build/lint/test all pass
- [ ] Security checklist complete
- [ ] Manual testing done
- [ ] PR description includes test evidence

**Release Manager:**
- [ ] Validation plan executed completely
- [ ] All behavior contract items verified
- [ ] Test results documented
- [ ] Quality assessment complete
- [ ] Release recommendation made

---

## 9. Pre-Approval Checklist

**Before submitting work for approval:**

**Automated checks:**
- [ ] `npm run build` — ✅ Pass
- [ ] `npm run lint -- --max-warnings=0` — ✅ Pass
- [ ] `npm test` — ✅ Pass

**Security:**
- [ ] Security checklist (all 6 points) — ✅ Pass

**Manual:**
- [ ] Happy path tested — ✅ Works
- [ ] Edge cases tested — ✅ Handled
- [ ] Error scenarios tested — ✅ Handled

**Review:**
- [ ] Self code review done — ✅ Looks good
- [ ] Documentation updated — ✅ Complete

**Role-specific:**
- [ ] Role-specific checklist complete — ✅ Done

**Evidence:**
- [ ] Test results documented
- [ ] Screenshots/videos if UI change
- [ ] Performance metrics if relevant

**Ready for approval:** ✅ Yes / ❌ Not yet

---

## 10. Common Quality Issues

**Build failures:**
- TypeScript errors → Fix types
- Import errors → Check paths and file names
- Circular dependencies → Restructure imports

**Lint failures:**
- Unused variables → Remove or use
- Missing dependencies → Add to deps array
- A11y warnings → Fix accessibility

**Test failures:**
- Logic errors → Fix the code
- Incorrect assertions → Fix the test
- Flaky tests → Add proper waits/mocks

**Security issues:**
- Non-scoped queries → Add user_id filter
- Missing validation → Add an appropriate server-side runtime validation boundary; use the shared Zod schemas in `src/lib/validation.ts`
- Hardcoded secrets → Use env vars

**Manual test failures:**
- Bugs → Fix the code
- UX issues → Improve interaction
- Performance issues → Optimize

---

## Quality Standards

**FlowOS quality bar:**

✅ **Functional**
- Works as specified
- Handles edge cases
- Recovers from errors

✅ **Secure**
- User data isolated
- Input validated
- No secrets leaked

✅ **Maintainable**
- Follows patterns
- Well documented
- Easy to change

✅ **Tested**
- Automated tests pass
- Manually verified
- Evidence documented

✅ **Accessible**
- Keyboard navigable
- Screen reader friendly
- Clear focus indicators

**All must meet this bar before approval.**

---

## When Quality Checks Fail

**Process:**

1. **Identify issue**
   - Read error message
   - Understand root cause

2. **Fix issue**
   - Fix the code
   - Or fix the test (if test was wrong)
   - Or document justified exception

3. **Verify fix**
   - Re-run failing check
   - Run all checks again

4. **Document**
   - Note what was wrong
   - Note what was fixed
   - Add test to prevent regression

5. **Continue**
   - Move to next check
   - Don't request approval until all pass

---

## Quality Checklist Template

**Copy this for your PR description:**

```markdown
## Quality Checklist

### Automated Checks
- [ ] Build: `npm run build` — ✅ Pass
- [ ] Lint: `npm run lint -- --max-warnings=0` — ✅ Pass
- [ ] Tests: `npm test` — ✅ Pass

### Security
- [ ] User-scoped data — ✅
- [ ] Input validation — ✅
- [ ] No hardcoded secrets — ✅
- [ ] RLS on new tables — ✅ / N/A
- [ ] Auth protected routes — ✅ / N/A
- [ ] Safe error messages — ✅

### Manual Testing
- [ ] Happy path — ✅ Verified
- [ ] Edge cases — ✅ Tested
- [ ] Error scenarios — ✅ Handled
- [ ] UI/UX — ✅ Reviewed

### Review
- [ ] Self code review — ✅ Complete
- [ ] Documentation updated — ✅ / N/A

### Role-Specific
- [ ] [Role] checklist — ✅ Complete

### Evidence
- Test results: [link or summary]
- Manual test notes: [scenarios tested]
- Screenshots: [if UI change]

**Status: Ready for approval** ✅
```

---

**Remember:** Quality is not optional. Every item must pass before requesting approval. When in doubt, ask rather than skip.
