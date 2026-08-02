# FlowOS Team Organization

**Status:** Active  
**Authority:** Canonical organizational structure for FlowOS AI-first development team  
**Owner:** Founder  
**Last reviewed:** 2026-08-02  

---

## 🎯 Active Configuration: 6-Role

**FlowOS is currently using the 6-role configuration for active development.**

**👉 START HERE: [Active 6-Role Configuration](./active-6-role/README.md)**

The 6 active roles are:
1. **Founder** (Human) — Decision authority
2. **Product Architect** — Product definition and strategy  
3. **Design Architect** — Complete design ownership
4. **Engineering Architect** — Technical architecture
5. **Implementation Engineer** — Full-stack development
6. **Release Manager** — Quality assurance and deployment

**Use these role documents for actual work assignments.**

---

## Alternative Configurations

- **[Streamlined Organization](./streamlined-organization.md)** — 4-role, 6-role, and 8-role options
- **[Full 11-Role Organization](./roles/)** — Maximum specialization for mature teams

---

## Purpose

This is the **permanent organizational operating system** for building FlowOS.

Every AI agent (or future human) can become a team member by:
1. Being assigned one organizational role
2. Reading their role document
3. Immediately beginning work

**This is not role-playing. This is the real development organization.**

---

## Quick Start

### For the Founder

**Assigning work to an AI:**
```
You are the [Role Name] for FlowOS.

Read your role document at: docs/12-team/roles/[role-name].md

Your assignment: [specific task]

Input documents: [links]

Expected output: [deliverable]

Hand off to: [next role]
```

### For an AI Agent

**When assigned a role:**
1. Read `docs/12-team/roles/[your-role].md`
2. Understand your authority, inputs, outputs
3. Read required documents
4. Produce expected deliverables
5. Hand off to next role
6. Report completion to assigner

**That's it. No additional explanation needed.**

---

## Organization Structure

```
FlowOS Development Organization

Founder (Human)
    │
    ├─ Product & Strategy Track
    │   ├─ Principal Product Architect
    │   ├─ Product Strategist
    │   └─ Planning Lead
    │
    ├─ Architecture Track
    │   ├─ Documentation Architect
    │   ├─ UX Architect
    │   ├─ Design System Architect
    │   └─ Engineering Architect
    │
    ├─ Engineering Track
    │   └─ Senior Full Stack Engineer
    │
    └─ Quality & Operations Track
        ├─ QA Lead
        └─ Release Manager
```

**Note:** Additional specialized roles (Frontend Engineer, Backend Engineer, Documentation Reviewer, Research Analyst, Technical Writer) can be created as-needed when the organization scales. For now, Senior Full Stack Engineer handles all implementation work.

---

## Core Documents

### Organizational Foundation
- **[organization.md](./organization.md)** — Complete organizational model
- **[organizational-chart.md](./organizational-chart.md)** — Visual hierarchy and relationships
- **[authority-matrix.md](./authority-matrix.md)** — Who owns what
- **[team-principles.md](./team-principles.md)** — Operating principles

### Workflows and Processes
- **[workflows/development-workflow.md](./workflows/development-workflow.md)** — End-to-end development process
- **[workflows/handoff-rules.md](./workflows/handoff-rules.md)** — How work moves between roles
- **[workflows/communication-rules.md](./workflows/communication-rules.md)** — How roles communicate

### Complete Work Examples
- **[workflows/example-new-feature.md](./workflows/example-new-feature.md)** — New feature workflow
- **[workflows/example-bug-fix.md](./workflows/example-bug-fix.md)** — Bug fix workflow
- **[workflows/example-architecture-change.md](./workflows/example-architecture-change.md)** — Architecture change workflow
- **[workflows/example-documentation-update.md](./workflows/example-documentation-update.md)** — Documentation workflow

---

## Role Documents

Every role has a complete specification at `docs/12-team/roles/[role-name].md`

### Product & Strategy
- **[roles/founder.md](./roles/founder.md)** — Final authority, vision holder
- **[roles/principal-product-architect.md](./roles/principal-product-architect.md)** — Product model and strategy
- **[roles/product-strategist.md](./roles/product-strategist.md)** — Market positioning and user evolution
- **[roles/planning-lead.md](./roles/planning-lead.md)** — Roadmap and delivery planning

### Architecture
- **[roles/documentation-architect.md](./roles/documentation-architect.md)** — Documentation structure and authority
- **[roles/ux-architect.md](./roles/ux-architect.md)** — Experience and information architecture
- **[roles/design-system-architect.md](./roles/design-system-architect.md)** — Visual and interaction design systems
- **[roles/engineering-architect.md](./roles/engineering-architect.md)** — Technical architecture and standards

### Engineering
- **[roles/senior-full-stack-engineer.md](./roles/senior-full-stack-engineer.md)** — Complete feature implementation (frontend + backend + integration)

### Quality & Operations
- **[roles/qa-lead.md](./roles/qa-lead.md)** — Quality assurance and testing
- **[roles/release-manager.md](./roles/release-manager.md)** — Release planning and execution

---

**Note:** Additional specialized roles can be created from the role template when needed:
- Frontend Engineer (when frontend work needs specialization)
- Backend Engineer (when backend work needs specialization)
- Documentation Reviewer (when documentation scales)
- Research Analyst (when user research scales)
- Technical Writer (when documentation creation scales)

For now, the 11 core roles above handle all FlowOS development work.

---

## How This Works

### 1. Founder Creates Assignment

Founder identifies work needed, assigns to appropriate role:
```
Role: Senior Full Stack Engineer
Task: Implement inline task capture on Today page
Input: Feature brief, behavior contract, design spec
Output: Implementation, tests, documentation updates
Hand off to: QA Lead
```

### 2. AI Reads Role Document

AI reads `roles/senior-full-stack-engineer.md` and understands:
- Mission and responsibilities
- Authority and limitations
- Required inputs and expected outputs
- Documents to read/write/modify
- Definition of done
- Who to hand off to

### 3. AI Executes Work

AI follows role workflow:
- Reads required documents
- Implements according to standards
- Produces expected deliverables
- Follows quality standards
- Documents work

### 4. AI Hands Off

AI completes handoff:
- Notifies next role
- Provides output documents
- States completion status
- Notes any blockers/questions

### 5. Process Continues

Work flows through organization until complete.

---

## Design Goals

This organization is optimized for:

✅ **AI-first development** — Roles designed for AI execution  
✅ **Small startup teams** — No bureaucracy, fast iteration  
✅ **Clear ownership** — Every decision has one owner  
✅ **Minimal overhead** — Process only where it adds value  
✅ **Maximum consistency** — Same patterns across all work  
✅ **Zero ambiguity** — Every role knows exactly what to do  
✅ **Scalable to humans** — Humans can fill any role  

**This is not role-playing theater. This is the real way FlowOS is built.**

---

## Fundamental Principles

### 1. Roles Are Permanent, Agents Are Temporary

The role "Senior Full Stack Engineer" is permanent.  
The specific AI or human filling it changes.  
The role documentation never changes (only improves).

### 2. One Role, One Conversation

Each AI conversation = one role = one assignment.  
No confusion, no context switching.

### 3. Documentation Over Prompts

Role documents replace long prompts.  
New AI reads role doc → immediately productive.

### 4. Founder Has Final Authority

All roles report to Founder.  
Founder makes final decisions.  
Founder can override any role.

### 5. Clear Handoffs, No Gaps

Every output is someone else's input.  
No work falls through cracks.  
Every handoff is explicit.

### 6. Authority Follows Responsibility

If you're responsible for X, you have authority over X.  
If you don't have authority, escalate to Founder.

### 7. Evidence Over Opinion

Roles provide evidence and recommendations.  
Founder makes decisions based on evidence.  
Opinions are labeled as such.

### 8. Preserve Contracts, Report Conflicts

Implementation never silently changes contracts.  
Conflicts escalate to Founder immediately.  
History is preserved, not rewritten.

---

## Common Workflows

### New Feature
Founder → Planning Lead → Product Architect → UX Architect → Design System Architect → Engineering Architect → Senior Full Stack Engineer → QA Lead → Documentation Reviewer → Founder

### Bug Fix
Founder → Senior Full Stack Engineer → QA Lead → Founder

### Architecture Change
Founder → Engineering Architect → Founder (decision) → Senior Full Stack Engineer → QA Lead → Documentation Architect → Founder

### Documentation Update
Founder → Documentation Architect → Technical Writer → Documentation Reviewer → Founder

---

## Templates

All role documents follow a standard template:
- **[templates/role-template.md](./templates/role-template.md)** — Standard role document structure

---

## Getting Started

### New AI Agent
1. Be assigned a role by Founder
2. Read your role document
3. Read required input documents
4. Execute according to role workflow
5. Produce expected deliverables
6. Hand off to next role

### New Human Employee
Same as AI agent. The role documents work identically.

### Founder Assigning Work
1. Identify what needs to be done
2. Determine which role should do it
3. Assign role + task + inputs + expected outputs
4. Receive completed work
5. Approve or request revisions

---

## Why This Exists

**Problem:** Every AI conversation starts from scratch with long prompts explaining context, authority, and expectations.

**Solution:** Permanent organizational roles with complete documentation. Any AI can step into any role immediately.

**Result:** FlowOS development scales naturally with AI assistance. Adding capacity = starting new AI conversation with role assignment.

---

**This is the FlowOS Development Organization. Use it to build FlowOS efficiently, consistently, and with zero ambiguity.**
