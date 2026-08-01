# [Feature Name] [Review Type] Review

**Review Type:** Design | Security | Accessibility | Code | Acceptance  
**Date:** YYYY-MM-DD  
**Reviewer(s):** [Names]  
**Version:** v[X.X]  
**Status:** Pass | Fail | Conditional  
**Related documents:**
- [Behavior Contract](../behavior-contract.md)
- [Design Spec](../design/[feature]-design-spec.md) (if design review)
- [Test Results](../validation/test-results-v[X.X].md)

---

## 1. Review Scope

**Purpose:** [What this review covers]

**Artifacts Reviewed:**
- [Document 1]
- [Document 2]
- [Code/Implementation]

**Review Criteria:** [What standards/requirements being checked against]

---

## 2. Summary

**Overall Result:** ✅ Pass | ⚠️ Conditional Pass | ❌ Fail

**Key Findings:**
- [Major finding 1]
- [Major finding 2]

**Recommendation:** Approve | Approve with conditions | Reject

---

## 3. Detailed Findings

### Finding 1: [Title]

**Category:** Design | Security | Accessibility | Code Quality | Performance | Other

**Severity:** Critical | High | Medium | Low

**Status:** Open | Resolved | Accepted Risk

**Description:**
[What was found]

**Evidence:**
[Screenshots, code snippets, test results]

**Impact:**
[Who/what is affected]

**Recommendation:**
[What should be done]

**Required Action:** [ ] Must fix before release | [ ] Should fix soon | [ ] Nice to have

---

### Finding 2: [Title]

[Repeat structure]

---

## 4. Checklist (Customize per review type)

### For Design Review:

- [ ] Visual design matches spec
- [ ] Interactions are intuitive
- [ ] Responsive design works
- [ ] Design system components used correctly
- [ ] Accessibility considerations addressed
- [ ] Empty/loading/error states designed
- [ ] No design inconsistencies

---

### For Security Review:

- [ ] Authentication properly implemented
- [ ] Authorization (RLS) correct
- [ ] Input validation adequate
- [ ] XSS prevention in place
- [ ] SQL injection prevented
- [ ] CSRF protection applied
- [ ] Sensitive data protected
- [ ] No security anti-patterns

---

### For Accessibility Review:

- [ ] Keyboard navigation works
- [ ] Screen reader support adequate
- [ ] Color contrast passes WCAG AA
- [ ] Focus indicators visible
- [ ] ARIA used correctly
- [ ] Forms properly labeled
- [ ] No accessibility blockers

---

### For Code Review:

- [ ] Code follows style guide
- [ ] Logic is clear and maintainable
- [ ] No code smells or anti-patterns
- [ ] Error handling adequate
- [ ] Performance considerations addressed
- [ ] Tests present and passing
- [ ] Documentation adequate

---

## 5. Strengths

**What Went Well:**
- [Strength 1]
- [Strength 2]
- [Strength 3]

---

## 6. Required Actions Before Approval

**Must Fix (Blockers):**
- [ ] [Action 1] - Assigned to: [Name] - Due: [Date]
- [ ] [Action 2] - Assigned to: [Name] - Due: [Date]

**Should Fix (Non-blockers but important):**
- [ ] [Action 1] - Assigned to: [Name] - Due: [Date]

**Nice to Have (Improvements):**
- [ ] [Action 1]
- [ ] [Action 2]

---

## 7. Follow-up Review

**Required:** [ ] Yes / [ ] No

**If yes:**
- **Reason:** [Why follow-up needed]
- **Scope:** [What will be re-reviewed]
- **Scheduled:** YYYY-MM-DD

---

## 8. Decision

**Status:** ✅ APPROVED | ⚠️ APPROVED WITH CONDITIONS | ❌ REJECTED

**Conditions (if conditional):**
- [Condition 1]
- [Condition 2]

**Next Steps:**
- [Step 1]
- [Step 2]

---

## 9. Sign-off

**Reviewer:** [Name]  
**Role:** [Role]  
**Date:** YYYY-MM-DD  
**Signature:** _______________________

**Additional Reviewers:**

**Name:** [Name]  
**Role:** [Role]  
**Date:** YYYY-MM-DD  
**Signature:** _______________________
