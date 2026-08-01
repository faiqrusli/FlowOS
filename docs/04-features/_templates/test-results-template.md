# [Feature Name] V[X.X] Test Results

**Status:** Pass | Fail | Partial  
**Version:** v[X.X]  
**Test Date:** YYYY-MM-DD  
**Tester:** [Name]  
**Related documents:**
- [Validation Plan](./validation-plan.md)
- [Behavior Contract](../behavior-contract.md)
- [Runbook](../implementation/[feature]-v[X.X]-runbook.md)

---

## 1. Summary

**Overall Result:** ✅ Pass | ⚠️ Partial | ❌ Fail

**Test Coverage:**
- Unit tests: [X]% (target: [Y]%)
- Integration tests: [X]% (target: [Y]%)
- E2E tests: [X/Y] scenarios passed

**Key Findings:**
- [Brief summary of results]
- [Notable passes or failures]

---

## 2. Test Environment

**Environment:** Development | Staging | Production-like  
**Browser/Platform:** [List browsers/devices tested]  
**Database:** [Database setup]  
**Test Data:** [Test data used]

---

## 3. Functional Tests

### Test 1: [Test Name]

**Status:** ✅ Pass | ❌ Fail | ⚠️ Partial

**Test Case:** [From validation plan]

**Steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result:** [What should happen]

**Actual Result:** [What actually happened]

**Evidence:** [Screenshots, logs, or other proof]

**Notes:** [Any additional observations]

---

### Test 2: [Test Name]

**Status:** ✅ Pass | ❌ Fail | ⚠️ Partial

[Repeat for each test case]

---

## 4. Edge Cases

### Edge Case 1: [Description]

**Status:** ✅ Pass | ❌ Fail | ⚠️ Partial

**Scenario:** [What edge case]

**Result:** [What happened]

**Notes:** [Observations]

---

## 5. Performance Tests

### Load Time

**Target:** <[X]ms  
**Actual:** [Y]ms  
**Status:** ✅ Pass | ❌ Fail

**Test:** [Describe what was measured]

---

### Response Time

**Target:** <[X]ms  
**Actual:** [Y]ms  
**Status:** ✅ Pass | ❌ Fail

**Test:** [Describe what was measured]

---

## 6. Accessibility Tests

### Keyboard Navigation

**Status:** ✅ Pass | ❌ Fail | ⚠️ Partial

**Tests:**
- [ ] Tab order logical
- [ ] All interactive elements reachable
- [ ] Focus indicators visible
- [ ] Escape key works appropriately
- [ ] Enter key activates buttons/links

**Notes:** [Observations]

---

### Screen Reader

**Status:** ✅ Pass | ❌ Fail | ⚠️ Partial

**Screen Reader:** [NVDA | JAWS | VoiceOver]

**Tests:**
- [ ] All content announced
- [ ] States announced (selected, expanded, etc.)
- [ ] Roles correct (button, link, heading, etc.)
- [ ] Labels present and clear
- [ ] Errors announced

**Notes:** [Observations]

---

### Color Contrast

**Status:** ✅ Pass | ❌ Fail

**Tool:** [WebAIM, axe, etc.]

**Tests:**
- [ ] Normal text passes WCAG AA (4.5:1)
- [ ] Large text passes WCAG AA (3:1)
- [ ] Non-text elements pass (3:1)

**Notes:** [Observations]

---

## 7. Security Tests

### Authentication

**Status:** ✅ Pass | ❌ Fail

**Tests:**
- [ ] Unauthenticated users blocked
- [ ] Session timeout works
- [ ] Token refresh works

---

### Authorization (RLS)

**Status:** ✅ Pass | ❌ Fail

**Tests:**
- [ ] Users can only see their own data
- [ ] Cross-user access blocked
- [ ] Admin privileges work (if applicable)

---

### Input Validation

**Status:** ✅ Pass | ❌ Fail

**Tests:**
- [ ] XSS prevented
- [ ] SQL injection prevented
- [ ] Input sanitized
- [ ] Max lengths enforced

---

## 8. Integration Tests

### Integration with [Feature A]

**Status:** ✅ Pass | ❌ Fail

**Test:** [Describe integration point]

**Result:** [What happened]

---

### Integration with [Feature B]

**Status:** ✅ Pass | ❌ Fail

**Test:** [Describe integration point]

**Result:** [What happened]

---

## 9. Browser/Device Compatibility

| Browser/Device | Version | Status | Notes |
|---|---|---|---|
| Chrome (Desktop) | [Version] | ✅ Pass | |
| Firefox (Desktop) | [Version] | ✅ Pass | |
| Safari (Desktop) | [Version] | ✅ Pass | |
| Edge (Desktop) | [Version] | ✅ Pass | |
| Chrome (Mobile) | [Version] | ✅ Pass | |
| Safari (iOS) | [Version] | ✅ Pass | |

---

## 10. Known Issues

### Issue 1: [Title]

**Severity:** Critical | High | Medium | Low  
**Status:** Open | Fixed | Deferred

**Description:** [What's wrong]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]

**Impact:** [Who/what is affected]

**Workaround:** [If any]

**Recommendation:** [Fix now | Fix later | Defer | Document]

---

## 11. Failures and Blockers

### Failure 1: [Test Name]

**What failed:** [Description]

**Expected:** [What should happen]

**Actual:** [What happened]

**Root cause:** [Why it failed]

**Fix required:** [What needs to be done]

**Blocker:** [ ] Yes / [ ] No

---

## 12. Regression Tests

**Tests run:** [X] out of [Y] regression tests

**Status:** ✅ Pass | ❌ Fail

**Notes:** [Any regressions found]

---

## 13. Recommendations

**Proceed to next phase?** [ ] Yes / [ ] No

**Reason:** [Why or why not]

**Required actions before proceeding:**
- [ ] [Action 1]
- [ ] [Action 2]

**Optional improvements:**
- [ ] [Improvement 1]
- [ ] [Improvement 2]

---

## 14. Test Artifacts

**Location:** [Where test files, screenshots, logs are stored]

**Files:**
- [test-report.html]
- [screenshots.zip]
- [performance-report.json]

---

## 15. Sign-off

**Tests complete:** [ ] Yes / [ ] No  
**Ready for review:** [ ] Yes / [ ] No  
**Blockers resolved:** [ ] Yes / [ ] No

**Tested by:** [Name]  
**Date:** YYYY-MM-DD  
**Approved by:** [Name] (if applicable)  
**Date:** YYYY-MM-DD
