# FlowOS AI Skills System

**Universal AI assistant configuration for FlowOS development**

This directory contains context, workflows, and checklists that any AI tool (CLI, Cursor, Codex, WebStorm, etc.) can reference when working on FlowOS.

---

## 📁 Structure

```
.ai/
├── README.md              # This file
├── context.md             # Universal AI context (START HERE)
├── workflows/             # Step-by-step workflows
│   ├── session-start.md   # How to begin work sessions
│   ├── code-review.md     # Comprehensive review process
│   ├── merge-prep.md      # Pre-merge verification
│   └── documentation.md   # Documentation update workflow
└── checklists/            # Non-negotiable checks
    └── security.md        # 6-point security checklist
```

---

## 🚀 Quick Start

### For AI Assistants

**First time working on FlowOS?**

1. **Read:** `.ai/context.md` — Full product context, tech stack, principles
2. **Bookmark:** `.ai/workflows/` — Reference during work
3. **Run:** `.ai/checklists/security.md` — Before every merge

**Starting a work session?**

1. Follow: `.ai/workflows/session-start.md`
2. User says "Start M2 session 3" → Read session guide, create branch, summarize goals

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
- Current milestone (M2) and scope
- Tech stack and architecture
- Documentation authority hierarchy
- Who you're assisting (founder profile)
- Core development principles (6 key principles)
- Project structure and conventions
- Code quality standards
- Git workflow rules
- Documentation discipline
- Runbook session process
- AI behavior guidelines
- Quality philosophy

**Use when:** Starting work, need foundational context, unsure of patterns.

---

### workflows/session-start.md

**How to begin a work session properly.**

**Steps:**
1. Acknowledge and gather context
2. Read runbook session
3. Check current git state
4. Create new branch
5. Verify prerequisites
6. Summarize session context
7. Wait for confirmation

**Use when:** User says "Start M2 session N" or "Begin work on [feature]"

**Prevents:**
- Starting without context
- Creating branch with uncommitted changes
- Missing merge bundle info
- Skipping pattern reference identification

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
6. Merge bundle ready
7. Breaking changes assessed

**Post-merge:**
1. Verify production
2. Update july-log
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
- Decision log (product decisions)
- Developer log (session timeline)
- July log (what shipped, post-merge only)
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
2. **Input validation** — Zod schemas, server-side validation
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

### 4. Branch-First Workflow
Every session starts on new branch from main.

**Why:** Clean history, easy rollback, safe experimentation.

**How:** `m2/session-N-name`, never push to main without approval.

### 5. Quality > Speed
Ship simple, working code over complex, buggy code.

**Why:** Maintenance, reliability, user trust.

**How:** Take time to understand, review thoroughly, ask when uncertain.

---

## 📖 Documentation Authority

**When docs conflict, higher wins:**

1. **`docs/strategy/Vision.md`** — Timeless philosophy (highest)
2. **`docs/strategy/flowos-vision-and-product-strategy.md`** — Product vision
3. **`docs/execution/logs/decision-log.md`** — Dated decisions
4. **`docs/foundation/governance/`** — PRINCIPLES, CODE_STANDARDS, GIT_WORKFLOW
5. **`.ai/context.md`** — Universal AI reference
6. **`docs/foundation/`** and **`docs/execution/`**

---

## 🚫 What NOT to Do

### For AI Assistants

❌ **Never merge to main without founder approval**
Even if all checks pass, always ask: "Ready to merge?"

❌ **Never skip security checklist**
Security is non-negotiable, no exceptions.

❌ **Never invent patterns without checking existing code**
Pattern matching first, invention last.

❌ **Never expand scope beyond M2**
Closed scope — no command palette, new modules, or monolith refactors.

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

### Scenario 1: New Session

**User says:** "Start M2 session 3"

**Expected AI behavior:**
1. Reads `.ai/workflows/session-start.md`
2. Reads `docs/execution/runbooks/m2-founder-daily-driver.md`
3. Creates branch `m2/session-3-name`
4. Summarizes goals, pattern references, merge bundle
5. Waits for user confirmation

**Fail if:** AI starts coding without context, skips runbook, or doesn't wait for confirmation.

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
5. **Waits for explicit approval**

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

✅ **Wait for approval, always**
"Ready to merge?" not "Merging now"

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
- Milestone transition
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
- **Product decisions:** See `docs/strategy/Vision.md`
- **Code standards:** See `docs/foundation/governance/CODE_STANDARDS.md`
- **Git workflow:** See `docs/foundation/governance/GIT_WORKFLOW.md`

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
