# Sprint Management Guide (Solo Founder with 6-Hat Workflow)

**Status:** Active  
**Last Updated:** 2026-08-04  
**Audience:** Founder, AI assistants  
**Replaces:** Old sprint-management-guide.md (archived to phase-0/)  

---

## Purpose

This guide explains how to manage sprints and phases for solo founder development using the 6-hat quality workflow.

**Short Founder self-approval checkpoints. No coordination theater. Just quality work with clear tracking.**

---

## Sprint Structure

### What is a Sprint?

**A sprint is a bounded period of focused work within a phase.**

- **Default duration:** 1 week (Monday to Sunday)
- **Exception:** A phase may use a shorter dated execution window when the current sprint records the scope, daily sequence, and gate date. Phase 1 uses 2026-08-04 → 2026-08-08 (Tuesday to Saturday).
- **Planning:** 30 minutes at start
- **Review:** 30 minutes at end
- **Documentation:** `current-phase/current-sprint.md`

### Sprint vs Phase

| Concept | Duration | Purpose | Documented In |
|---------|----------|---------|---------------|
| **Phase** | 1-4 weeks | Complete a gate (Phase 0, 1, 2, etc.) | `current-phase/phase-N/` |
| **Sprint** | 1 week | Weekly execution cycle within phase | `current-phase/current-sprint.md` |
| **Session** | 2-4 hours | Focused work block | Daily logs |

**Example:** Phase 1 might have 3 sprints (3 weeks), each sprint has multiple sessions.

---

## Sprint Workflow (Using 6 Hats)

### Monday Morning: Sprint Planning (30 min)

**Founder hat: Decide what to work on**

1. **Read current phase goals**
   - Check `current-phase/phase-N/gate-checklist.md`
   - What needs to be done to complete the current gate?

2. **Pick sprint tasks (3-5 tasks max)**
   - Small: < 4 hours (decision log only)
   - Medium: 4-16 hours (brief + code)
   - Large: > 16 hours (full 6-hat dossier)

3. **Update current-sprint.md**
   ```markdown
   ## Sprint Tasks
   
   ### Priority 1: [Task Name]
   - Size: Large (16h)
   - Hats needed: All 6
   - Goal: [Specific outcome]
   
   ### Priority 2: [Task Name]
   - Size: Medium (8h)
   - Hats needed: 3-4-5
   - Goal: [Specific outcome]
   ```

4. **Estimate hours**
   - Don't overfill (aim for 30-35 hours, not 40)
   - Leave buffer for unexpected work

### Daily Work: Execute with 6 Hats

**Wear appropriate hats for each task:**

#### For Major Features (Full 6-Hat Workflow)

**Day 1-2: Plan Mode**
- **Hat 1 (Product Architect):** Write feature brief + behavior contract (4-8h)
- **Hat 2 (Design Architect):** Write design specification (2-4h)

**Day 3: Engineering Mode**
- **Hat 3 (Engineering Architect):** Write delivery design + validation plan (2-4h)

**Day 4-5: Build Mode**
- **Hat 4 (Implementation Engineer):** Build code + tests + runbook (6-12h)

**Day 5: Ship Mode**
- **Hat 5 (Release Manager):** Verify + Deploy + Document (1-2h)

#### For Medium Features (Hats 3-4-5)

**Day 1:** Engineering Architect + Implementation Engineer (4-8h)  
**Day 2:** Implementation Engineer continues (4-8h)  
**Day 3:** Release Manager verifies and ships (1-2h)

#### For Small Features (Hats 4-5)

**Session 1:** Implementation Engineer (1-3h)  
**Session 2:** Release Manager (30min)

### Daily: Log Progress

**In daily developer log** (`current-phase/logs/developer-log/YYYY-MM-DD.md`):

```markdown
## [Time] - [Task Name]

**Hat worn:** Product Architect (Hat 1)

**What I did:**
- Wrote feature brief for [feature]
- Defined scope and success criteria

**Output:**
- `04-features/[feature]/feature-brief.md`

**Next:** Wear Design Architect hat (Hat 2)
```

### Friday Afternoon: Sprint Review (30 min)

**Founder hat: Review what was accomplished**

1. **Check completed tasks**
   - What shipped to production?
   - What's in progress?
   - What's blocked?

2. **Update sprint doc**
   ```markdown
   ## Sprint Results
   
   ### Completed
   - ✅ [Task 1] — Shipped to production
   - ✅ [Task 2] — Documentation complete
   
   ### In Progress
   - 🟡 [Task 3] — 60% done, will finish next sprint
   
   ### Blocked
   - ❌ [Task 4] — Blocked by [reason]
   ```

3. **Update phase gate checklist**
   - Check off completed gate criteria
   - Update status

4. **Reflect**
   - What went well?
   - What slowed me down?
   - What to improve next sprint?

---

## Phase Management

### Starting a New Phase

**When:** Previous phase gate passes

1. **Archive previous phase**
   ```bash
   mv current-phase/phase-N/ 11-archive/phases/phase-N/
   ```

2. **Create new phase folder**
   ```bash
   mkdir current-phase/phase-N+1/
   ```

3. **Create gate checklist**
   - Copy template from MVP Masterplan
   - Customize for this phase

4. **Update current-sprint.md**
   - Change phase reference
   - Set first sprint goals

### Completing a Phase

**When:** All gate criteria met

1. **Verify gate completion**
   - Review `phase-N/gate-checklist.md`
   - All items checked?
   - All deliverables created?

2. **Founder decision: Gate pass/fail**
   - Record decision in `phase-N/gate-N-decision.md`
   - If fail: What needs fixing?
   - If pass: Move to next phase

3. **Archive phase folder**
   - Move to `11-archive/phases/phase-N/`
   - Keep current-phase/ clean

4. **Create next phase**
   - Follow "Starting a New Phase" above

---

## Task Sizing Guide

### Small Tasks (< 4 hours)

**Hats needed:** 4-5 (Implementation + Release)

**Documentation:**
- Decision log entry
- Code comments
- Commit messages

**Examples:**
- Fix button alignment
- Add keyboard shortcut
- Small UI polish

**Sprint capacity:** 8-10 small tasks per sprint

### Medium Tasks (4-16 hours)

**Hats needed:** 3-4-5 (Engineering + Implementation + Release) or 1-4-5 (Product + Implementation + Release)

**Documentation:**
- 1-2 page brief
- Code + tests
- Update FEATURE_INVENTORY

**Examples:**
- Inline task capture
- Keyboard navigation improvements
- API integration

**Sprint capacity:** 2-3 medium tasks per sprint

### Large Tasks (> 16 hours)

**Hats needed:** All 6 (Full workflow)

**Documentation:**
- Feature brief
- Behavior contract
- Design specification
- Delivery design
- Validation plan
- Implementation artifacts

**Examples:**
- Today page rebuild
- New major feature
- Complete redesign

**Sprint capacity:** 1 large task per sprint (or spans multiple sprints)

---

## Sprint Logs

### Where to Log

1. **Daily developer log** (`current-phase/logs/developer-log/YYYY-MM-DD.md`)
   - What you did today
   - What hats you wore
   - What you learned

2. **Monthly narrative log** (`current-phase/logs/MONTH-log.md`)
   - Weekly summaries
   - Major achievements
   - Key decisions

3. **Current sprint doc** (`current-phase/current-sprint.md`)
   - Sprint goals
   - Task status
   - Sprint results

### What to Log

**Daily:**
- Tasks worked on
- Hats worn
- Output created
- Time spent
- Blockers encountered

**Weekly:**
- Sprint results (what shipped)
- What went well
- What to improve

**Monthly:**
- Major milestones
- Production deployments
- Key learnings

---

## Working with AI Assistants

### Starting Work

**Give AI clear context:**

```
Context:
- Phase: Phase 1
- Sprint: Week of 2026-08-04
- Current task: Write behavior contract for Today page
- Hat: Product Architect (Hat 1)

Task: Help me write the behavior contract...
```

### During Work

**Reference sprint doc:**
- "Check current-phase/current-sprint.md for context"
- "Update sprint doc with task completion"

### AI Hat Responsibilities

**AI can help with any hat:**
- Hat 1: Draft feature briefs
- Hat 2: Draft design specs
- Hat 3: Draft delivery designs
- Hat 4: Write code + tests
- Hat 5: Run verification checklists

**Founder wears Hat 6 (decisions) — AI can't decide for you**

---

## Sprint Anti-Patterns

### ❌ Don't Do This

1. **Overfill sprint** — Aim for 30-35h, not 40h
2. **Skip hat responsibilities** — Each hat has quality checks
3. **No sprint review** — Always review what you accomplished
4. **Ignore blockers** — Log and address them
5. **Work without logging** — Hard to learn without records

### ✅ Do This Instead

1. **Conservative estimates** — Better to finish early
2. **Wear each hat properly** — Maintain quality
3. **Weekly reflection** — Learn and improve
4. **Address blockers immediately** — Don't let them pile up
5. **Log as you go** — Brief entries, daily

---

## Example Sprint

### Sprint: Week of 2026-08-04 (Phase 1)

**Phase Goal:** Write behavior contracts for major features

**Sprint Goals:**
1. ✅ Write Today page behavior contract (Large, 12h)
2. ✅ Write Tasks board behavior contract (Large, 12h)
3. 🟡 Write Focus mode behavior contract (Large, 8h — in progress)

**Monday:**
- Hat 1: Started Today behavior contract (4h)

**Tuesday:**
- Hat 1: Finished Today behavior contract (4h)
- Hat 1: Started Tasks behavior contract (2h)

**Wednesday:**
- Hat 1: Finished Tasks behavior contract (6h)

**Thursday:**
- Hat 1: Started Focus behavior contract (4h)

**Friday:**
- Hat 1: Continued Focus behavior contract (4h) — 60% done
- Sprint review: 2 of 3 complete, good progress

**Next Sprint:** Finish Focus, start Schedule

---

## Summary

**Sprint workflow:**
1. **Monday:** Plan (decide what to work on)
2. **Tuesday-Friday:** Execute (wear appropriate hats)
3. **Friday:** Review (reflect and update)

**Key principles:**
- 1 week sprints within multi-week phases
- 3-5 tasks per sprint max
- Wear appropriate hats for each task
- Log daily, review weekly
- Archive phases when complete

**No unnecessary handoff queues. Founder approval remains explicit at consequential checkpoints.**

---

## Related Documents

- **[Solo Founder Workflow](../start-here/solo-founder-workflow.md)** — Complete 6-hat workflow
- **[How to Develop FlowOS](../start-here/how-to-develop-flowos.md)** — Quick reference
- **[Current Sprint](../current-phase/current-sprint.md)** — Active sprint
- **[MVP Masterplan](../current-phase/mvp-implementation-masterplan.md)** — All phases
- **[6-Role-Hats](../10-team/6-role-hats/)** — Detailed hat procedures

---

**Simple sprints. Quality work. Clear progress.**
