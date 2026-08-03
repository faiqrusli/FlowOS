# AI Workflow: Documentation

**When to use:** End of session, after significant decisions, before/after merge, when user says "update docs".

**Goal:** Keep documentation in sync with code and decisions.

---

## Documentation Map

### Decision Records
**File:** `docs/08-decisions/decision-records.md`

**When to update:**
- Product-level decisions (features, UX, scope)
- Architecture decisions (tech choices, patterns)
- Process decisions (workflow, governance)

**When NOT to update:**
- Implementation details (use developer log)
- Bug fixes (unless decision about approach)
- Routine tasks

### Developer Log
**Files:** `docs/execution/logs/developer-log/YYYY-MM-DD.md`

**When to update:**
- **MANDATORY:** Real-time log update whenever any file under `docs/` or in the codebase is modified (add timestamped timeline beat).
- End of each work session
- When switching tasks
- At major milestones within session
- When encountering blockers

**Content:**
- Session timeline (what was done when)
- Problems encountered
- Solutions tried
- Current state / next steps

### Monthly Narrative Log
**File:** `docs/execution/logs/august-log.md (or current active month log)`

**When to update:**
- **After** merge to main (not before)
- Captures what actually shipped
- Brief, user-facing description

**Content:**
- Date and title
- What changed
- Files modified
- User impact

### Feature Inventory
**File:** `docs/foundation/FEATURE_INVENTORY.md`

**When to update:**
- New route added
- New module/feature shipped
- Feature moved from deferred to shipped
- Major feature removed

**Content:**
- What's shipped vs deferred
- Surface-level features visible to users
- Current state of FlowOS

### Technical Docs
**Files:** `docs/foundation/*.md`, `docs/foundation/governance/*.md`

**When to update:**
- Architecture changes
- New patterns established
- Tech stack changes
- Process/governance updates

---

## Workflow: Update Decision Log

### 1. Identify if Decision is Log-Worthy

**Questions to ask:**
- Is this a product-level decision (not implementation detail)?
- Will future-you need to know why this choice was made?
- Does this affect direction, scope, or user experience?
- Is this an explicit decision (not just doing the obvious thing)?

**Examples:**

✅ **Log-worthy:**
- "Decided to defer habit streaks to M3"
- "Changed Today page to single-pane (not split)"
- "Using optimistic updates for task completion"

❌ **Not log-worthy:**
- "Fixed bug in task sorting"
- "Used Dialog component for add task"
- "Ran npm install"

### 2. Draft Entry

**Format:**
```markdown
## YYYY-MM-DD: [Decision Title]

**Context:** [What prompted this decision? What problem were we solving?]

**Decision:** [What was decided? Be specific and clear.]

**Rationale:** [Why this choice? What alternatives were considered?]

**Authority:** [Who decided? Which doc supports this?]

**Impact:** [What changes because of this? What's affected?]
```

**Example:**
```markdown
## 2026-07-15: Defer Habit Streaks to Post-M2

**Context:** During M2 Session 3 (Habits), considering whether to include streak tracking and visual streak indicators.

**Decision:** Defer habit streaks and analytics to post-M2. M2 will ship basic habit list, add, complete only.

**Rationale:** 
- M2 goal is founder daily driver, not feature completeness
- Streaks add complexity (calculation, display, edge cases)
- Basic habits are sufficient for daily use
- Can iterate based on real usage in M3

**Authority:** Founder decision, aligns with M2 scope principles in execution-masterplan.md

**Impact:** 
- M2 Habits ships faster with core functionality only
- Founder can dogfood and learn usage patterns
- Streaks become M3 candidate based on M2 learnings
```

### 3. Add to Decision Log

**Action:**
```
Append entry to docs/execution/logs/decision-log.md
```

**Location:** Add at the bottom (most recent last) or top (most recent first) — check existing format.

**Prompt user:**
```
Decision log entry drafted:

[show entry]

Should I add this to decision-log.md?
```

---

## Workflow: Update Developer Log

### 1. Check Today's File Exists

**Action:** Check if `docs/execution/logs/developer-log/YYYY-MM-DD.md` exists.

**If not:**
```
Creating today's developer log: developer-log/2026-08-03.md
```

### 2. Structure Session Entry

**Format:**
```markdown
# YYYY-MM-DD

## [Time] Session: [Session Name/Description]

**Branch:** [branch-name]

**Goals:**
- [Goal 1]
- [Goal 2]

**Timeline:**
- [HH:MM] Started session, read runbook
- [HH:MM] Created branch, reviewed patterns
- [HH:MM] Implemented [feature/change]
- [HH:MM] Encountered [issue]
- [HH:MM] Tried [solution 1] - [result]
- [HH:MM] Tried [solution 2] - [result]
- [HH:MM] Resolved with [final solution]
- [HH:MM] Testing complete

**Current State:**
[What's done, what's not, what's next]

**Blockers:**
[Any blockers or questions]

**Notes:**
[Any other relevant info]
```

**Example:**
```markdown
# 2026-07-15

## 14:00 Session: M2 Session 3 - Habits Module

**Branch:** m2/session-3-habits

**Goals:**
- Build Habits page with list/add/complete
- Connect to Supabase habits table
- Add habits to Today page integration

**Timeline:**
- 14:00 Started session, read m2-founder-daily-driver.md session 3
- 14:15 Created branch m2/session-3-habits from main
- 14:20 Reviewed pattern files: tasks/page.tsx, AddTaskDialog.tsx
- 14:30 Created src/lib/supabase-habits.ts (copied from supabase-tasks.ts)
- 15:00 Built HabitsPage component (server component pattern)
- 15:30 Created AddHabitDialog (copied AddTaskDialog pattern)
- 16:00 Encountered issue: RLS policy on habits table too restrictive
- 16:10 Checked supabase/habits.sql, updated policy
- 16:20 Tested locally, habits now loading correctly
- 16:45 Added habits to Today page (new section)
- 17:00 Full manual test: create habit → complete → shows on Today
- 17:15 Build and lint passed

**Current State:**
✅ All session 3 objectives complete
✅ Build/lint passing
✅ Manual testing done
Ready for code review

**Blockers:**
None

**Notes:**
- RLS policy fix should be in supabase/habits.sql
- Session 3 is part of Bundle B2 (merges with Session 4)
- Next: Session 4 focus enhancements
```

### 3. Update Throughout Session

**Prompt user at key moments:**
```
Session milestone reached. Should I update developer log?

[shows current timeline]
```

**Or at end:**
```
Session complete. Let me update today's developer log:

[shows drafted entry]

Should I add this?
```

---

## Workflow: Update Monthly Narrative Log (Post-Merge)

### 1. Verify Merge Complete

**Only update august-log after successful merge to main.**

```
⚠️ July log updates after merge to main.

Current status: [branch-name] not yet merged

Update july-log after merge? [y/n]
```

### 2. Draft Entry

**Format:**
```markdown
## YYYY-MM-DD: [What Shipped - User-Facing Title]

**Branch:** [branch-name]
**Session:** [session name if applicable]

**Changes:**
- [User-facing change 1]
- [User-facing change 2]
- [Technical improvement if relevant]

**Files modified:**
- [key file 1]
- [key file 2]

**Impact:** [How does this improve FlowOS?]

[If bundle:] **Bundle:** Part of Bundle BN with sessions X, Y
```

**Example:**
```markdown
## 2026-07-15: Habits Module

**Branch:** m2/session-3-habits
**Session:** M2 Session 3

**Changes:**
- Added Habits page with full list of daily habits
- Create new habits with name, optional notes
- Complete habits with single click
- Habits appear on Today page alongside tasks

**Files modified:**
- src/app/(main)/habits/page.tsx (new)
- src/components/habits/HabitList.tsx (new)
- src/components/habits/AddHabitDialog.tsx (new)
- src/lib/supabase-habits.ts (new)
- src/app/(main)/today/page.tsx (updated)

**Impact:** Founder can now track daily habits in FlowOS, completing M2 core loop of tasks + habits + focus.

**Bundle:** Part of Bundle B2 (Session 3), merges with Session 4 after completion.
```

### 3. Add to July Log

**Action:**
```
Append entry to docs/execution/logs/august-log.md
```

**Prompt user:**
```
July log entry drafted:

[show entry]

Add to july-log.md?
```

---

## Workflow: Update Feature Inventory

### 1. Identify Change Type

**New feature shipped:**
- New route/page added
- New module completed
- Major feature now available

**Feature status change:**
- Moved from deferred to shipped
- Marked as deprecated/removed
- Scope changed

### 2. Locate in Feature Inventory

**File:** `docs/foundation/FEATURE_INVENTORY.md`

**Sections:**
- Shipped (what's live)
- Deferred (what's planned but not yet)
- Core surface vs extended features

### 3. Update Entry

**For new feature:**
```markdown
### Habits
**Status:** Shipped (M2 Session 3, YYYY-MM-DD)
**Route:** `/habits`
**Description:** Daily habit tracking with list, add, complete functionality. Integrated with Today page and Focus mode.
**Files:** 
- `src/app/(main)/habits/`
- `src/components/habits/`
- `src/lib/supabase-habits.ts`
```

**For status change:**
```markdown
### Command Palette
**Status:** Deferred → Post-M2
**Reason:** Not needed for M2 founder daily driver goal. Can add based on dogfood learnings.
**Was:** Planned for M2
**Now:** Post-M2 based on decision YYYY-MM-DD (see decision-log.md)
```

**Prompt user:**
```
Feature inventory needs update:

Change: [description]
Section: [Shipped/Deferred/etc]

[show proposed change]

Update feature inventory?
```

---

## Workflow: Update Technical Docs

### 1. Identify Affected Docs

**Common docs:**
- `docs/foundation/TECHNICAL_ARCHITECTURE.md` — Architecture, data model, auth
- `docs/foundation/governance/CODE_STANDARDS.md` — Coding patterns, conventions
- `docs/foundation/governance/GIT_WORKFLOW.md` — Git process
- `docs/foundation/governance/PRINCIPLES.md` — Core principles

### 2. Assess Impact

**Questions:**
- Did we add a new pattern that others should follow?
- Did we change how something works architecturally?
- Did we establish a new convention?
- Did we update a governance rule?

**Example scenarios:**

✅ **Update needed:**
- Added new data layer pattern (supabase-*.ts structure)
- Changed authentication flow
- Established new component organization
- Updated branch naming convention

❌ **No update needed:**
- Implemented feature using existing patterns
- Fixed bug without pattern change
- Added component following existing structure

### 3. Draft Changes

**Format depends on doc, but generally:**
```markdown
## [Section]

[Updated content explaining new pattern/change]

**Example:**
[Code example if applicable]

**Related files:**
[Where this pattern is used]
```

**Prompt user:**
```
Technical documentation affected: [doc name]

Change needed: [description]

[show proposed change]

Update [doc name]?
```

---

## Documentation Checklist

**At end of session:**

- [ ] Developer log updated (timeline, state, blockers)
- [ ] Decision log updated (if product decision made)
- [ ] Feature inventory updated (if new feature/status change)
- [ ] Technical docs updated (if architecture/pattern change)
- [ ] July log ready for post-merge (drafted, waiting for merge)

**Prompt:**
```
Documentation checklist:

- [✅/❌/N/A] Developer log
- [✅/❌/N/A] Decision log
- [✅/❌/N/A] Feature inventory
- [✅/❌/N/A] Technical docs
- [⏳] July log (post-merge)

All documentation current.
```

---

## Anti-Patterns (Don't Do This)

❌ **Updating july-log before merge**
```
"Updating july-log.md with changes..."
[branch not merged yet]
```
Problem: July log is for what shipped, not what's on branch.

❌ **Skipping developer log**
```
"Session complete, ready to review."
[no log entry]
```
Problem: Loses timeline and context for future reference.

❌ **Generic decision log entries**
```
"Decided to improve habits feature"
```
Problem: Too vague. No context, rationale, or specifics.

❌ **Not updating feature inventory**
```
"New habits module shipped!"
[feature inventory still says deferred]
```
Problem: Inventory out of sync with reality.

---

## Best Practices

✅ **Update throughout, not just at end**
Easier to capture context while fresh.

✅ **Be specific in logs**
Future-you will thank you for details.

✅ **Link decisions to authority docs**
Helps trace reasoning chain.

✅ **Keep july-log user-facing**
Describe impact, not just technical changes.

✅ **Prompt before updating**
User might want to edit or has context to add.

✅ **Update feature inventory immediately**
Don't let it drift from reality.

---

## Integration with Other Workflows

**Used during:** All workflows (session start, code review, merge prep)
**Related:** `.ai/workflows/merge-prep.md` (july-log update post-merge)

---

**Remember:** Documentation is how we think, decide, and remember. Keep it current and detailed.
