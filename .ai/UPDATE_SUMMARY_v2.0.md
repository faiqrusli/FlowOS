# FlowOS AI Skills System — v2.0 Update Summary

**Updated:** 2026-08-03  
**Status:** ✅ Complete — Now reflects 6-role team, sprint workflow, MVP Masterplan

---

## What Changed

### 🔄 From v1.0 to v2.0

**v1.0 (Old):**
- ❌ M2 milestone with session-based runbooks
- ❌ Old execution masterplan
- ❌ Generic "developer" workflow
- ❌ No role structure

**v2.0 (New):**
- ✅ **6-role team structure** (Founder, Product Architect, Design Architect, Engineering Architect, Implementation Engineer, Release Manager)
- ✅ **Sprint-based workflow** (current sprint assignments)
- ✅ **MVP Implementation Masterplan** (Phase 1: Establish Implementation Truth)
- ✅ **New documentation architecture** (00-constitution through 12-team)
- ✅ **Approval gates** (work requires Founder approval before proceeding)

---

## Files Updated

### Core AI Skills

| File | Status | Changes |
|------|--------|---------|
| `.ai/context.md` | ✅ Completely rewritten | Now includes 6-role team, sprint workflow, MVP Masterplan, new doc structure |
| `.ai/workflows/role-assignment.md` | ✅ Created (new) | How to execute when assigned a role |
| `.ai/workflows/session-start.md` | ⚠️ Legacy | Kept for reference, but use role-assignment.md instead |
| `.ai/workflows/code-review.md` | ✅ Still valid | Security checklist still applies |
| `.ai/workflows/merge-prep.md` | ✅ Still valid | Pre-merge process still applies |
| `.ai/workflows/documentation.md` | ⚠️ Needs update | Update for new doc structure |
| `.ai/checklists/security.md` | ✅ Still valid | 6-point checklist unchanged |
| `.ai/README.md` | ⚠️ Needs update | Update for v2.0 changes |

### Integration Files

| File | Status | Changes |
|------|--------|---------|
| `AGENTS.md` | ✅ Updated | References 6-role team, sprint workflow, MVP Masterplan |
| `.cursor/rules/flowos-core.mdc` | ✅ Updated | References new doc structure, roles, sprint |
| `.idea/ai-rules.md` | ⚠️ Needs update | Still references old structure |

---

## Key Changes in Detail

### 1. Team Structure

**Old:**
```
Solo founder + generic AI assistance
```

**New:**
```
6-Role Team:
1. Founder (Human) — Final authority
2. Product Architect — Feature briefs, behavior contracts
3. Design Architect — Design specifications
4. Engineering Architect — Delivery designs, validation plans
5. Implementation Engineer — Code, tests, docs
6. Release Manager — QA, deployment

With approval gates between roles.
```

### 2. Workflow

**Old:**
```
"Start M2 session 3" → read runbook → create branch → code
```

**New:**
```
"You are the [Role Name]" → read role doc → check sprint → execute → request approval → hand off
```

### 3. Documentation Authority

**Old:**
```
1. Vision
2. flowos-vision-and-product-strategy.md
3. execution-masterplan.md
4. decision-log.md
5. governance/
```

**New:**
```
1. Vision.md (highest)
2. 00-constitution/ (doc governance)
3. 01-product/ through 12-team/ (canonical structure)
4. mvp-implementation-masterplan.md (current implementation source)
5. current-sprint.md (current work)
6. governance/
```

### 4. Current Work

**Old:**
```
M2 Founder Daily Driver
- Session-based work
- Runbook: m2-founder-daily-driver.md
```

**New:**
```
Phase 1: Establish Implementation Truth
- Sprint-based work (Week of 2026-08-02)
- Source: mvp-implementation-masterplan.md
- Assignments: current-sprint.md
- Gate 1: Document current behavior for every MVP domain
```

---

## How to Use v2.0

### For Founder

**Assign work with:**
```
You are the [Role Name] for FlowOS.
Assignment: [specific task]
Input documents: [links]
Expected output: [deliverable]
```

**Example:**
```
You are the Implementation Engineer for FlowOS.
Assignment: Implement inline task capture on Today page
Input documents:
  - docs/04-features/inline-task-capture/brief.md (approved)
  - docs/04-features/inline-task-capture/behavior-contract.md (approved)
  - docs/04-features/inline-task-capture/design-spec.md (approved)
  - docs/04-features/inline-task-capture/delivery-design.md (approved)
Expected output: Working code + tests + docs
```

### For AI

**When assigned a role:**
1. Read `.ai/workflows/role-assignment.md`
2. Read `docs/12-team/active-6-role/[your-role].md`
3. Read `docs/07-strategy-and-delivery/current-sprint.md`
4. Read required input documents
5. Execute according to role workflow
6. Produce expected outputs
7. Request approval (if at gate)
8. Hand off to next role

**Quick reference:** `.ai/context.md`

---

## What Still Works from v1.0

**These are still valid:**

✅ **Security Checklist** (`.ai/checklists/security.md`)
- 6-point security checklist unchanged
- Still run before every merge
- User-scoped data, input validation, no secrets, RLS, auth, safe errors

✅ **Code Standards** (`.cursor/rules/code-standards.mdc`)
- Pattern matching first
- Server components by default
- Semantic tokens from globals.css
- File naming conventions

✅ **Git Workflow** (`.cursor/rules/git-workflow.mdc`)
- Branch first
- Never merge without approval
- Build/lint before merge

✅ **Core Principles**
- Quality > Speed
- Evidence > Opinion
- Pattern matching before invention
- Small focused changes

---

## What to Archive/Update

### Archive (v1.0 specific):
- `.ai/workflows/session-start.md` — Replaced by role-assignment.md
- Old context references to M2 sessions

### Update Next:
- `.ai/README.md` — Update for v2.0 structure
- `.ai/workflows/documentation.md` — Update for new doc structure (00-12)
- `.idea/ai-rules.md` — Update for 6-role team

---

## Migration Guide

**If you were using v1.0:**

| Old Concept | New Concept | Action |
|-------------|-------------|--------|
| M2 sessions | Sprint + Phase | Check current-sprint.md |
| Runbooks | Role documents | Read active-6-role/[role].md |
| execution-masterplan.md | mvp-implementation-masterplan.md | Use new source |
| "Start session X" | "You are [Role]" | Assign specific role |
| decision-log.md | docs/08-decisions/records/ | New decision format |

**Quick migration:**
1. Stop using: M2 sessions, old execution masterplan
2. Start using: Role assignments, current sprint, MVP masterplan
3. Read: `.ai/context.md` for full new structure

---

## Testing v2.0

**Test role assignment:**
```
You are the Product Architect for FlowOS.
Assignment: Document current behavior of Today domain
Input documents: docs/01-product/product-model.md, current-sprint.md
Expected output: Current behavior documentation
```

**Expected AI response:**
```
Acknowledged. I am the Product Architect.

Reading:
1. docs/12-team/active-6-role/product-architect.md
2. docs/07-strategy-and-delivery/current-sprint.md
3. docs/01-product/product-model.md

[After reading]

Role understood:
- Mission: Define product features and strategy
- Authority: Feature scope, behavior definition
- Output: Feature briefs, behavior contracts
- Hand off to: Founder (approval) → Design Architect

Current sprint context:
- Phase 1: Establish Implementation Truth
- Sprint objective: Document current Today, Tasks, Focus behavior
- My assignment: Today domain current behavior

Beginning work...
```

---

## Success Metrics

**v2.0 is successful if:**

✅ AI immediately understands role when assigned  
✅ AI checks current sprint for context  
✅ AI requests approval at gates  
✅ AI hands off to next role properly  
✅ Work flows through 6 roles smoothly  
✅ Documentation stays current  
✅ Quality remains high or improves  

---

## Next Steps

**Immediate:**
1. ✅ Test role assignments with AI
2. ✅ Verify sprint context is used
3. ✅ Confirm approval gates work

**Short-term:**
- [ ] Update `.ai/README.md` for v2.0
- [ ] Update `.ai/workflows/documentation.md` for new doc structure
- [ ] Update `.idea/ai-rules.md` for 6-role team
- [ ] Create `.ai/workflows/feature-workflow.md` (complete feature lifecycle)
- [ ] Create `.ai/workflows/approval-gates.md` (how gates work)

**Long-term:**
- [ ] Refine role documents based on usage
- [ ] Add more workflow examples
- [ ] Create troubleshooting guide
- [ ] Add metrics tracking

---

## Status: ✅ Ready to Use

**v2.0 FlowOS AI Skills System is production-ready.**

Any AI (CLI, Cursor, Codex, WebStorm) can now:
- Be assigned a role
- Understand current sprint
- Execute role-appropriate work
- Request approval at gates
- Hand off to next role

**Start using:** Assign roles to AI agents and let them execute!

**Documentation:** `.ai/context.md` + `.ai/workflows/role-assignment.md`

---

**Remember:** Roles are permanent, agents are temporary. Excellence through clarity, not process.
