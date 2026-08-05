# FlowOS AI Skills System

**Universal AI assistant configuration for FlowOS development**

This directory contains context, workflows, and checklists that any AI tool (CLI, Cursor, Codex, WebStorm, etc.) can reference when working on FlowOS.

---

## 📁 Structure

```
.ai/
├── README.md              # This file
├── context.md             # Universal AI context (START HERE)
├── sprint-context.md      # Current sprint quick reference
├── testing-guide.md       # How to test before merge
├── workflows/             # Step-by-step workflows
│   ├── role-assignment.md # How to start work when assigned a role
│   ├── code-review.md     # Comprehensive review process
│   ├── merge-prep.md      # Pre-merge verification
│   └── documentation.md   # Documentation update workflow
└── checklists/            # Non-negotiable checks
    ├── security.md        # 6-point security checklist
    └── quality.md         # Pre-merge quality verification
```

---

## 🚀 Quick Start

### For AI Assistants

**First time working on FlowOS?**

1. **Read:** `.ai/context.md` — Full product context, tech stack, principles
2. **Bookmark:** `.ai/workflows/` — Reference during work
3. **Run:** `.ai/checklists/security.md` — Before every merge

**Starting a work session?**

1. Follow: `.ai/workflows/role-assignment.md`
2. Read your role document and the current sprint, then summarize goals and wait for confirmation

**Reviewing code?**

1. Follow: `.ai/workflows/code-review.md`
2. Run: `.ai/checklists/security.md` (all 6 checks)
3. Provide detailed report with verdict

**Ready to merge?**

1. Follow: `.ai/workflows/merge-prep.md`
2. Verify all pre-merge checks pass
3. Ask for founder approval (NEVER merge without it)

### For Developers

**Want AI to follow FlowOS patterns?**

Your AI already has access to:
- ✅ Product philosophy and goals
- ✅ Tech stack and conventions
- ✅ Security requirements
- ✅ Git workflow and approval process
- ✅ Documentation discipline

Just point your AI to `.ai/context.md` or the relevant workflow.

---

## 📚 What's Inside

### context.md (Universal AI Context)

**The foundation.** Every AI should read this first.

**Contains:**
- Product identity and philosophy
- Current phase (Phase 3 — Implement and Harden the Core Loop)
- Tech stack and architecture
- Documentation authority hierarchy
- Solo-founder workflow with 6-hat quality procedures
- Who you're assisting (founder profile)
- Core development principles (8 key principles)
- Project structure and conventions
- Code quality standards
- Git workflow rules
- Documentation discipline
- AI behavior guidelines
- Quality philosophy

**Use when:** Starting work, need foundational context, unsure of patterns.

---

### workflows/role-assignment.md

**How to begin work properly when the Founder assigns you a role.**

**Steps:**
1. Read your role document in `docs/10-team/6-role-hats/`
2. Check current sprint (`docs/current-phase/current-sprint.md`)
3. Read required input documents
4. Execute according to the applicable hat workflow
5. Produce expected outputs
6. Complete the applicable Founder checkpoint and continue to the next hat

**Use when:** User says "You are the [Role Name]" or "Begin work on [feature]"

**Prevents:**
- Starting without role context
- Working outside assigned scope
- Skipping the current sprint
- Missing explicit checkpoint decisions

---

### workflows/code-review.md

**Comprehensive code review before merge.**

**Process:**
1. Run git diff
2. Initial assessment (scope, size)
3. Security review (6 checks, non-negotiable)
4. Pattern matching review
5. Code quality review
6. Functionality review
7. Build/lint check
8. Produce review report
9. Wait for decision

**Use when:** User says "Review my changes" or "Ready to merge?"

**Catches:**
- Security vulnerabilities
- Pattern violations
- Missing error handling
- Breaking changes
- Build/lint failures

---

### workflows/merge-prep.md

**Final verification before production.**

**Checklist:**
1. Code review complete
2. Build and lint pass
3. Manual testing done
4. Session goals met
5. Documentation updated
6. Breaking changes assessed

**Post-merge:**
1. Verify production
2. Confirm the active month log (`docs/current-phase/logs/august-log.md`) distinguishes committed, merged, and shipped state
3. Clean up branch (optional)

**Use when:** After code review passes, before suggesting merge.

**Prevents:**
- Merging without founder approval (NEVER)
- Skipping final verification
- Forgetting documentation
- Production issues

---

### workflows/documentation.md

**Keep docs in sync with code and decisions.**

**Covers:**
- Decision records (consequential decisions)
- Developer log (session timeline)
- Monthly narrative log (commit narrative with committed/merged/shipped state)
- Feature inventory (new routes/features)
- Technical docs (architecture changes)

**Use when:** End of session, after decisions, after merge.

**Ensures:**
- Decisions are documented with context
- Timeline is captured
- Shipped changes logged
- Docs stay current

---

### checklists/security.md

**Non-negotiable security checks.**

**6 Checks:**
1. **User-scoped data access** — No `using(true)`, user_id filtering
2. **Input validation** — Server-side runtime validation; shared Zod schemas in `src/lib/validation.ts`
3. **No hardcoded secrets** — Environment variables only
4. **Row Level Security (RLS)** — On all user data tables
5. **Auth middleware** — Routes protected by auth
6. **Safe error messages** — Generic to client, detailed server-only

**Use when:** Every code review, before every merge, when modifying:
- Database queries
- API routes
- Auth logic
- User input handling
- Error messages

**Critical:** Security is non-negotiable. One issue compromises all users.

---

## 🛠️ Tool Integration

### Cursor IDE

**Location:** `.cursor/rules/`

**Integration:**
- `flowos-core.mdc` references `.ai/context.md`
- AI automatically uses `.ai/` skills when working in Cursor

**No setup needed** — Already integrated.

### WebStorm / IntelliJ

**Location:** `.idea/ai-rules.md`

**Integration:**
- Quick reference to `.ai/` system
- Core principles summary
- Common workflows

**Setup:** AI tools in WebStorm will reference `.idea/ai-rules.md`

### CLI Tools (Kiro, acp, etc.)

**Location:** `AGENTS.md`

**Integration:**
- Top-level `AGENTS.md` includes AI skills section
- Points to `.ai/context.md` and workflows

**Usage:** `kiro chat` or `acp` will see AI skills reference.

### Codex / Other AI Tools

**Integration:**
- Read `.ai/context.md` directly
- Reference workflows as needed
- Follow checklists before merge

**Universal:** Any AI can read these markdown files.

---

## 🎯 Core Principles

### 1. Pattern Matching First
Copy existing similar files before writing new code.

**Why:** Consistency, speed, fewer mistakes.

**How:** Check 2-3 similar files, copy structure and patterns.

### 2. Security Non-Negotiable
Never merge with security issues.

**Why:** One vulnerability compromises all users.

**How:** Run `.ai/checklists/security.md` every time.

### 3. Small, Focused Changes
One logical change per commit.

**Why:** Easier to review, test, revert if needed.

**How:** Resist scope creep, match touched area only.

### 4. Branch-First Workflow (Git Worktree model)
Every session works on a **parallel branch off `main`**, in its **own worktree**, so multiple agents and the Founder work at once without colliding:
```
main
├── feature/<module>-<feature>   Agent A
├── experiment/<topic>           spike
└── shared/<scope>               shared code/config
```
Start work with `git worktree add ../flowos-agents/<branch> -b <branch>` from the primary worktree on `main`.

**Why:** Clean history, easy rollback, safe experimentation, parallel ownership.

**How:** Follow the branch naming convention (see AGENTS.md); Founder authorization is still required before merge or release.

### 5. Quality > Speed
Ship simple, working code over complex, buggy code.

**Why:** Maintenance, reliability, user trust.

**How:** Take time to understand, review thoroughly, ask when uncertain.

---

## 📖 Documentation Authority

**When docs conflict, higher wins:**

1. **`docs/00-constitution/Vision.md`** — Timeless philosophy (highest)
2. **`docs/current-phase/`** — Current implementation phase work (Sprint, MVP Masterplan, Gate checklists)
3. **`docs/00-constitution/documentation-architecture.md`** — Documentation governance
4. **`docs/01-product/`** — Product model, strategy, glossary, success model
5. **`docs/02-systems/`** — System definitions
6. **`docs/03-experience/`** — Experience architecture
7. **`docs/04-features/`** — Feature briefs, behavior contracts, FEATURE_INVENTORY
8. **`docs/05-design/`** — Design system architecture, design specifications
9. **`docs/06-engineering/`** — Engineering architecture, standards
10. **`docs/07-strategy-and-delivery/`** — Roadmap, delivery and release standards
11. **`docs/08-decisions/`** — Decision records
12. **`docs/09-reviews/`** — Review records
13. **`docs/10-team/`** — Team organization, 6-role-hats quality procedures
14. **`docs/current-phase/logs/`** — Operational logs
15. **`docs/00-constitution/governance/`** — PRINCIPLES, CODE_STANDARDS, GIT_WORKFLOW, GATES
16. **`docs/11-archive/`** — Historical reference only (DO NOT use for current work)

**Current sprint:** `docs/current-phase/current-sprint.md`
**Phase 3 gate checklist:** `docs/current-phase/phase-3/gate-checklist.md`

---

## 🚫 What NOT to Do

### For AI Assistants

❌ **Never merge to main without founder approval**
Even if all checks pass, always ask: "Ready to merge?"

❌ **Never skip security checklist**
Security is non-negotiable, no exceptions.

❌ **Never invent patterns without checking existing code**
Pattern matching first, invention last.

❌ **Never expand scope beyond the current sprint**
Closed scope — current phase assignments only.

❌ **Never assume approval**
Wait for explicit "yes" before merging, deploying, or major changes.

### For Developers

❌ **Don't override AI security warnings**
If AI flags security issue, fix it. Don't merge anyway.

❌ **Don't skip documentation updates**
Logs keep context. Update as you go, not later.

❌ **Don't defer security fixes**
Address immediately, not in "next refactor."

---

## 🧪 Testing the System

### Scenario 1: Role Assignment

**User says:** "You are the Product Architect for FlowOS."

**Expected AI behavior:**
1. Reads `docs/10-team/6-role-hats/product-architect.md`
2. Reads `docs/current-phase/current-sprint.md`
3. Reads required input documents
4. Summarizes role understanding, sprint context, and deliverables
5. Waits for user confirmation

**Fail if:** AI starts working without reading role doc, skips sprint context, or doesn't confirm scope.

### Scenario 2: Code Review

**User says:** "Review my changes"

**Expected AI behavior:**
1. Runs `git diff main..branch`
2. Follows `.ai/workflows/code-review.md`
3. Runs `.ai/checklists/security.md` (all 6 checks)
4. Produces detailed review report
5. Gives verdict (ready / issues / blocking)
6. Waits for decision

**Fail if:** AI skips security, doesn't run build/lint, or approves with blocking issues.

### Scenario 3: Merge Prep

**User says:** "Ready to merge?"

**Expected AI behavior:**
1. Follows `.ai/workflows/merge-prep.md`
2. Verifies all pre-merge checks
3. Confirms manual testing done
4. Asks: "Ready to merge? (requires approval)"
5. **Uses the applicable short Founder self-approval checkpoint**

**Fail if:** AI merges without approval or skips verification steps.

---

## 💡 Tips for Best Results

### For AI Assistants

✅ **Read context.md first session of the day**
Refresh your understanding of FlowOS.

✅ **Reference workflows during work**
Don't rely on memory, check the steps.

✅ **Run security checklist every review**
Make it automatic, not optional.

✅ **Be explicit about what you checked**
"Verified user-scoped queries in HabitsService.tsx" > "Security looks good"

✅ **Preserve Founder authorization, quickly**
"Ready to merge?" and evidence first; do not create a separate handoff queue.

### For Developers

✅ **Point AI to specific workflows**
"Follow .ai/workflows/code-review.md" gets better results than "review this"

✅ **Ask AI to explain reasoning**
"Why do you flag this as security issue?" helps learning

✅ **Trust AI security warnings**
If AI flags issue, there's usually a reason

✅ **Give feedback when AI misses something**
Helps improve AI skills over time

---

## 🔄 Updating This System

### When to Update

**Add workflow when:**
- New common process emerges
- Repeated mistakes need formalization
- Complex procedure needs documentation

**Update context.md when:**
- Major tech stack change
- New governance principle
- Phase transition
- Architecture shift

**Add checklist when:**
- Non-negotiable check emerges
- Quality gate needs formalization
- Compliance requirement added

### How to Update

1. **Make change** in appropriate file
2. **Test with AI** — Does it follow new guidance?
3. **Update README** if structure changes
4. **Notify team** (if applicable)
5. **Document reason** in commit message

### Maintenance

**Review quarterly:**
- Are workflows still accurate?
- Is context.md up to date?
- Are checklists complete?
- Do examples still match codebase?

---

## 📞 Support

**For questions about:**
- **AI skills system:** See this README or `.ai/context.md`
- **Product decisions:** See `docs/00-constitution/Vision.md`
- **Code standards:** See `docs/00-constitution/governance/CODE_STANDARDS.md`
- **Git workflow:** See `docs/00-constitution/governance/GIT_WORKFLOW.md`

**Found an issue?**
- Update the relevant `.ai/` file
- Test with AI to verify improvement
- Commit with clear message

---

## 🎓 Philosophy

**This system exists to:**

1. **Make excellence automatic** — Encode best practices so AI follows them
2. **Preserve context** — Capture "why" and "how" for future work
3. **Enable consistency** — Same standards across all AI tools
4. **Reduce errors** — Checklists catch issues before production
5. **Accelerate learning** — New contributors (human or AI) onboard faster

**80% of quality comes from discipline, 20% from tools.**

This system provides the discipline. The AI provides the tool. Together, they ship excellent software.

---

## 🚀 Next Steps

**For AI Assistants:**
1. Read `.ai/context.md` now
2. Bookmark `.ai/workflows/` for reference
3. Run `.ai/checklists/security.md` before every merge
4. Always wait for founder approval

**For Developers:**
1. Review `.ai/context.md` to understand what AI knows
2. Reference workflows when instructing AI
3. Trust AI security warnings
4. Update `.ai/` files as project evolves

---

**Remember:** You're building excellent software. This system helps ensure that every AI working on FlowOS follows the same high standards.

Pattern matching. Security first. Small changes. Always wait for approval.

**Quality > Speed. Always.**
