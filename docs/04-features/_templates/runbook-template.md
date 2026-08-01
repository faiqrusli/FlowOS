# [Feature Name] V[X.X] Implementation Runbook

**Status:** Draft | Active | Complete | Super

seded  
**Version:** v[X.X]  
**Created:** YYYY-MM-DD  
**Owner:** [Implementation lead]  
**Target completion:** YYYY-MM-DD  
**Related documents:**
- [Behavior Contract](../behavior-contract.md)
- [Delivery Design](./delivery-design.md)
- [Validation Plan](../validation/validation-plan.md)

---

## 1. Purpose

Describe what this runbook implements:
- What capability is being added?
- What version/iteration is this?
- What's the goal?

Example: "Implement basic task CRUD operations (create, read, update, delete) for v1.0 initial release."

---

## 2. Prerequisites

List everything that must be ready before starting:

- [ ] Behavior contract approved
- [ ] Design specs finalized
- [ ] API contracts agreed
- [ ] Database schema approved
- [ ] Dependencies installed
- [ ] Development environment set up

---

## 3. Exit Criteria

How do you know this runbook is complete?

- [ ] All acceptance criteria from validation plan met
- [ ] Code review approved
- [ ] Tests passing (unit, integration, E2E)
- [ ] Documentation updated
- [ ] No known blockers

---

## 4. Implementation Steps

### Step 1: Database Setup

**What:** Create database tables, indexes, RLS policies

```sql
-- Example
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

-- Add more policies...
```

**Verification:**
- [ ] Table created
- [ ] RLS policies applied
- [ ] Test query as different users

---

### Step 2: API Implementation

**What:** Create API endpoints

**Files to create/modify:**
- `src/app/api/[endpoint]/route.ts`

```typescript
// Example structure
export async function GET(request: Request) {
  // Implementation
}

export async function POST(request: Request) {
  // Implementation
}
```

**Endpoints:**
- [ ] GET /api/tasks - List tasks
- [ ] POST /api/tasks - Create task
- [ ] PATCH /api/tasks/:id - Update task
- [ ] DELETE /api/tasks/:id - Delete task

**Verification:**
- [ ] Each endpoint responds correctly
- [ ] Error handling works
- [ ] RLS respected
- [ ] Rate limiting applied

---

### Step 3: Component Implementation

**What:** Build UI components

**Files to create/modify:**
- `src/components/[feature]/`

**Components:**
- [ ] [Component1] - Purpose
- [ ] [Component2] - Purpose
- [ ] [Component3] - Purpose

**Example:**
```typescript
// src/components/tasks/TaskList.tsx
export function TaskList() {
  // Implementation
}
```

**Verification:**
- [ ] Components render correctly
- [ ] State management works
- [ ] Accessibility requirements met
- [ ] Responsive design implemented

---

### Step 4: Integration

**What:** Connect components to API and integrate with other features

**Integration points:**
- [ ] [Feature A] integration - How it connects
- [ ] [Feature B] integration - How it connects

**Verification:**
- [ ] Data flows correctly
- [ ] State synchronized
- [ ] No race conditions

---

### Step 5: Tests

**What:** Write and run tests

**Test types:**
- [ ] Unit tests - Test individual functions
- [ ] Integration tests - Test API endpoints
- [ ] E2E tests - Test user flows
- [ ] Accessibility tests - Test keyboard nav, screen readers

**Test files:**
- `src/components/[feature]/__tests__/`
- `src/app/api/[endpoint]/__tests__/`

**Verification:**
- [ ] All tests passing
- [ ] Coverage > [X]%
- [ ] Edge cases covered

---

### Step 6: Documentation

**What:** Update documentation

- [ ] Update behavior contract (if behavior changed)
- [ ] Update API documentation
- [ ] Add inline code comments
- [ ] Update README if needed
- [ ] Create test-results.md

**Verification:**
- [ ] Documentation accurate
- [ ] Examples work
- [ ] No broken links

---

### Step 7: Code Review

**What:** Get code reviewed

- [ ] Self-review complete
- [ ] PR created
- [ ] Design review requested (if needed)
- [ ] Security review requested (if needed)
- [ ] Code review approved

---

### Step 8: Final Checks

**What:** Pre-merge checklist

- [ ] All CI/CD checks passing
- [ ] No console errors or warnings
- [ ] Performance acceptable
- [ ] Accessibility checks passed
- [ ] Behavior matches contract
- [ ] Validation plan complete

---

## 5. Known Issues and Risks

Document any known issues or risks:

| Issue | Severity | Mitigation | Status |
|---|---|---|---|
| [Describe issue] | High/Med/Low | [How addressed] | Open/Resolved |

---

## 6. Rollback Plan

If something goes wrong during or after deployment:

**Rollback steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Database rollback:**
```sql
-- Rollback migrations if needed
```

---

## 7. Dependencies and Blockers

**Dependencies:**
- [ ] [Dependency 1] - Status
- [ ] [Dependency 2] - Status

**Blockers:**
- [ ] [Blocker 1] - How to unblock

---

## 8. Timeline

| Phase | Start Date | End Date | Status |
|---|---|---|---|
| Database setup | YYYY-MM-DD | YYYY-MM-DD | Not started/In progress/Complete |
| API implementation | YYYY-MM-DD | YYYY-MM-DD | |
| Component implementation | YYYY-MM-DD | YYYY-MM-DD | |
| Integration | YYYY-MM-DD | YYYY-MM-DD | |
| Testing | YYYY-MM-DD | YYYY-MM-DD | |
| Review | YYYY-MM-DD | YYYY-MM-DD | |

---

## 9. Sign-off

**Implementation complete:** [ ] Yes / [ ] No  
**Ready for validation:** [ ] Yes / [ ] No  
**Ready for review:** [ ] Yes / [ ] No

**Completed by:** [Name]  
**Date:** YYYY-MM-DD  
**Notes:** [Any notes about implementation]
