# FlowOS Testing Guide

**How to test implementations before merge**

This guide covers running tests, manual testing, and verification before submitting work for approval.

---

## Test Stack

**FlowOS uses:**
- **Vitest** — Unit and integration tests
- **npm run build** — Build verification
- **npm run lint** — Code quality checks
- **Manual testing** — User flow verification

---

## Quick Reference

```powershell
# Run all tests
npm test

# Run tests in watch mode (during development)
npm run test:watch

# Build verification (must pass before merge)
npm run build

# Lint check (must pass before merge)
npm run lint

# Full pre-merge verification
npm run build && npm run lint && npm test
```

---

## 1. Unit and Integration Tests (Vitest)

### Running Tests

**Run all tests once:**
```powershell
npm test
```

**Run tests in watch mode (during development):**
```powershell
npm run test:watch
```

**Run specific test file:**
```powershell
npm test src/lib/schedule-utils.test.ts
```

### Writing Tests

**Location:** Tests live next to the code they test
- `src/lib/utils.ts` → `src/lib/utils.test.ts`
- `src/components/TaskCard.tsx` → `src/components/TaskCard.test.tsx`

**Test file pattern:** `*.test.ts` or `*.test.tsx`

**Example test:**
```typescript
// src/lib/task-utils.test.ts
import { describe, it, expect } from 'vitest'
import { isTaskOverdue } from './task-utils'

describe('isTaskOverdue', () => {
  it('returns true for past due dates', () => {
    const pastDate = new Date('2020-01-01')
    expect(isTaskOverdue(pastDate)).toBe(true)
  })

  it('returns false for future due dates', () => {
    const futureDate = new Date('2030-01-01')
    expect(isTaskOverdue(futureDate)).toBe(false)
  })

  it('handles null due dates', () => {
    expect(isTaskOverdue(null)).toBe(false)
  })
})
```

### Test Coverage Priorities

**Must have tests:**
- Business logic in `src/lib/`
- Data transformations
- Utility functions
- Edge cases and error handling

**Optional (for now):**
- UI components (focus on logic first)
- Server components (integration tests)
- API routes (requires Supabase mocking)

---

## 2. Build Verification

**Before every merge:**
```powershell
npm run build
```

**What it checks:**
- TypeScript compilation
- Next.js build process
- No build-time errors
- All imports resolve
- No circular dependencies

**Common build errors:**

❌ **Type error:**
```
Type 'string | undefined' is not assignable to type 'string'
```
**Fix:** Add type guards or optional chaining

❌ **Module not found:**
```
Module not found: Can't resolve '@/components/TaskCard'
```
**Fix:** Check import path and file name

❌ **Build failed:**
```
Error: Build failed
```
**Fix:** Check console for specific error, often TypeScript or import issues

**Build must pass with zero errors before merge.**

---

## 3. Lint Verification

**Before every merge:**
```powershell
npm run lint
```

**What it checks:**
- Code style consistency
- Unused variables
- Missing dependencies in hooks
- Accessibility issues (basic)
- React best practices

**Common lint errors:**

❌ **Unused variable:**
```
'foo' is assigned a value but never used
```
**Fix:** Remove unused variable or prefix with `_` if intentional

❌ **Missing dependency:**
```
React Hook useEffect has a missing dependency: 'userId'
```
**Fix:** Add to dependency array or use ESLint disable comment if intentional

❌ **No unescaped entities:**
```
'>' must be escaped
```
**Fix:** Use `&gt;` or wrap in `{'>'}` in JSX

**Lint must pass (or have justified ignores) before merge.**

---

## 4. Manual Testing

**Always required before merge, even if automated tests pass.**

### Testing Checklist

**For every change:**
- [ ] Happy path works (main user flow)
- [ ] Empty states render correctly
- [ ] Loading states show appropriately
- [ ] Error states display helpful messages
- [ ] Edge cases handled (null, undefined, empty arrays)

**For UI changes:**
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Dark mode (FlowOS is dark-only but check consistency)
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] No layout shift during loading

**For data changes:**
- [ ] Data persists correctly
- [ ] User-scoped (can't access other users' data)
- [ ] Handles concurrent edits gracefully
- [ ] Optimistic updates work
- [ ] Error recovery works

### Manual Test Process

**1. Start dev server:**
```powershell
npm run dev
```

**2. Navigate to changed area:**
- Open http://localhost:3000
- Navigate to the feature you changed

**3. Test the happy path:**
- Complete the main user flow
- Verify expected behavior

**4. Test edge cases:**
- Empty state (no data)
- Single item
- Many items (50+)
- Long text (truncation, wrapping)
- Special characters
- Null/undefined values

**5. Test error scenarios:**
- Network failure (offline mode)
- Invalid input
- Concurrent modifications
- Permission denied

**6. Test recovery:**
- Refresh page (state preserved?)
- Navigate away and back
- Browser back button
- Interrupted actions

### Test Scenarios by Role

**Product Architect:**
- Manual testing: N/A (documentation only)
- Verification: Read your brief and behavior contract as if you're the next role

**Design Architect:**
- Manual testing: N/A (specifications only)
- Verification: Review design spec against design system docs

**Engineering Architect:**
- Manual testing: N/A (design documents only)
- Verification: Trace data flow, identify risks

**Implementation Engineer:**
- Manual testing: **REQUIRED** — Full checklist above
- Verification: Build, lint, test, security checklist

**Release Manager:**
- Manual testing: **REQUIRED** — Execute validation plan
- Verification: All behavior contract items verified

---

## 5. Security Testing

**Run security checklist before every merge:**

See: `.ai/checklists/security.md`

**Quick security tests:**

**Test 1: User isolation**
```
1. Create data as User A
2. Log out
3. Log in as User B
4. Verify User B cannot see User A's data
```

**Test 2: Input validation**
```
1. Try extremely long input (10,000 characters)
2. Try special characters: <, >, ", ', &
3. Try SQL injection patterns
4. Verify all rejected or sanitized
```

**Test 3: Auth protection**
```
1. Log out
2. Try to access protected route directly
3. Verify redirect to login
```

---

## 6. Performance Testing (When Applicable)

**For data-heavy features:**

**Test with realistic data:**
- 50+ tasks
- 20+ habits
- 100+ focus sessions
- Multiple notes with long content

**Check for:**
- Page load time < 2s
- Interaction responsiveness < 100ms
- No visible lag during typing
- Smooth scrolling
- No memory leaks (check DevTools)

**Performance issues:**
- Missing React keys in lists
- Re-rendering entire list on single item change
- Not using React.memo for expensive components
- Loading all data at once instead of pagination

---

## 7. Accessibility Testing

**Basic checks (before full audit):**

**Keyboard navigation:**
```
1. Tab through all interactive elements
2. Verify focus visible
3. Verify logical tab order
4. Verify Enter/Space activate buttons
5. Verify Escape closes modals
```

**Screen reader test (optional but recommended):**
```
1. Enable screen reader (NVDA on Windows, VoiceOver on Mac)
2. Navigate through feature
3. Verify meaningful labels announced
4. Verify state changes announced
```

**Color contrast:**
- Use browser DevTools accessibility checker
- Verify text readable against background

---

## 8. Testing Documentation

**Document your testing:**

**In PR description:**
```markdown
## Testing Completed

### Automated Tests
- [ ] Unit tests pass (`npm test`)
- [ ] Build passes (`npm run build`)
- [ ] Lint passes (`npm run lint`)

### Manual Testing
- [ ] Happy path verified
- [ ] Empty state tested
- [ ] Error state tested
- [ ] Edge cases checked

### Test Scenarios
1. Created task with title "Test" → Success
2. Created task with empty title → Validation error shown
3. Created 50 tasks → List renders smoothly
4. Offline mode → Queued for sync, showed message

### Security Testing
- [ ] User isolation verified
- [ ] Input validation tested
- [ ] Auth protection confirmed

### Known Issues
- None / [Issue description]
```

---

## 9. Pre-Merge Checklist

**Run this before requesting approval:**

```powershell
# 1. Run all automated checks
npm run build
npm run lint
npm test

# 2. If all pass, do manual testing
npm run dev
# [Manual test scenarios]

# 3. Run security checklist
# See .ai/checklists/security.md

# 4. Review your changes
git diff main..your-branch

# 5. If everything passes, request approval
```

**All must pass:**
- ✅ Build: `npm run build` — no errors
- ✅ Lint: `npm run lint` — no errors (or justified exceptions)
- ✅ Tests: `npm test` — all passing
- ✅ Manual: Happy path + edge cases + errors
- ✅ Security: 6-point checklist complete
- ✅ Review: Git diff looks correct

**If any fail:**
- Fix issues before requesting approval
- Document any intentional exceptions
- Explain why exceptions are justified

---

## 10. Testing Tips

**For Implementation Engineers:**

✅ **Write tests as you code**
Don't wait until the end. Test-driven development helps catch issues early.

✅ **Test the edges**
Null, undefined, empty array, single item, many items, huge strings.

✅ **Test user flow, not implementation**
Test what user sees/does, not internal function calls.

✅ **Keep tests simple**
One assertion per test when possible. Clear test names.

✅ **Mock external dependencies**
Mock Supabase, fetch, timers. Don't rely on external state.

**For Release Managers:**

✅ **Execute validation plan**
Don't skip any validation step. Complete the whole plan.

✅ **Test as real user**
Forget you know the code. Use it like a real user would.

✅ **Document everything**
Record all test results. Evidence > "I tested it."

✅ **Retest after fixes**
If Implementation Engineer fixes issues, retest everything.

---

## 11. When Tests Fail

**Failed test process:**

**1. Understand the failure**
```powershell
# Read the error message carefully
npm test -- --reporter=verbose
```

**2. Reproduce locally**
```powershell
# Run just that test
npm test src/path/to/test.test.ts
```

**3. Debug**
```typescript
// Add console.logs
console.log('Input:', input)
console.log('Expected:', expected)
console.log('Actual:', actual)
```

**4. Fix the issue**
- Fix the code, or
- Fix the test (if test was wrong)

**5. Verify fix**
```powershell
# Run test again
npm test

# Run full suite
npm run build && npm run lint && npm test
```

**6. Commit fix**
```powershell
git add .
git commit -m "fix: resolve test failure in task-utils"
```

---

## 12. Testing Resources

**Internal:**
- `.ai/checklists/security.md` — Security checklist
- `.ai/checklists/quality.md` — Quality checklist
- `docs/06-engineering/quality-architecture.md` — Quality standards

**External:**
- [Vitest Docs](https://vitest.dev/) — Test framework
- [Next.js Testing](https://nextjs.org/docs/app/building-your-application/testing) — Next.js specific
- [Testing Library](https://testing-library.com/) — React testing best practices

---

## Testing Anti-Patterns

❌ **Skipping tests because "it's simple"**
Simple code can still have bugs. Test it.

❌ **Only testing happy path**
Edge cases are where bugs hide. Test them.

❌ **Not running tests before merge**
"It should work" ≠ "It works." Run tests.

❌ **Ignoring lint errors without justification**
Lint errors exist for a reason. Fix or document why ignored.

❌ **Skipping manual testing**
Automated tests can't catch everything. Manual test is required.

❌ **Testing in production**
Test locally and in dev. Never test new code in production first.

---

## Testing Best Practices

✅ **Test early, test often**
Don't wait until the end. Test as you build.

✅ **Automate what you can**
Write unit tests for logic. Manual test for UX.

✅ **Test like a user**
Focus on user outcomes, not implementation details.

✅ **Document test results**
Evidence of testing is as important as the tests themselves.

✅ **Fix tests immediately**
Failing tests lose value over time. Fix them promptly.

✅ **Improve tests over time**
Add tests when bugs are found. Learn from production issues.

---

**Remember:** Tests are not bureaucracy. Tests are evidence that your code works. Quality > Speed. Test thoroughly before requesting approval.
