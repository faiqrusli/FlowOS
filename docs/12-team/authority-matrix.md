# FlowOS Authority Matrix

**Status:** Active  
**Authority:** Canonical definition of decision rights and document ownership  
**Owner:** Founder  
**Last reviewed:** 2026-08-02  

---

## Purpose

This matrix defines **who owns what** in FlowOS development.

**For every document and decision:**
- Who has final authority
- Who can propose changes
- Who can modify independently
- Who must be consulted
- Who must approve

**Zero ambiguity. Clear ownership. Fast decisions.**

---

## Authority Levels

| Level | Symbol | Meaning |
|-------|--------|---------|
| **Final Authority** | 🔴 | Makes final decision; can override all others |
| **Owns** | 🟢 | Owns the artifact; can modify within authority bounds |
| **Proposes** | 🟡 | Can propose changes; requires approval from owner |
| **Contributes** | 🔵 | Provides input; does not own or decide |
| **Reads** | ⚪ | Must read and follow; cannot modify |

---

## Document Ownership Matrix

### Layer 0: Constitution

| Document | Final Authority | Owns | Proposes | Reads |
|----------|----------------|------|----------|-------|
| **Vision.md** | 🔴 Founder | 🟢 Founder | — | ⚪ All roles |
| **documentation-architecture.md** | 🔴 Founder | 🟢 Documentation Architect | 🟡 All roles | ⚪ All roles |

**Rules:**
- Vision is immutable (changes are extremely rare)
- Documentation architecture can evolve (with Founder approval)

---

### Layer 1: Product

| Document | Final Authority | Owns | Proposes | Contributes |
|----------|----------------|------|----------|-------------|
| **product-model.md** | 🔴 Founder | 🟢 Principal Product Architect | 🟡 Product Strategist, UX Architect | 🔵 Engineers |
| **product-glossary.md** | 🔴 Founder | 🟢 Principal Product Architect | 🟡 All roles (terminology) | 🔵 All roles |
| **product-strategy.md** | 🔴 Founder | 🟢 Product Strategist | 🟡 Principal Product Architect | 🔵 Planning Lead |
| **success-model.md** | 🔴 Founder | 🟢 Product Strategist | 🟡 Planning Lead | 🔵 All roles |

**Rules:**
- Founder decides product meaning and strategy
- Product Architect owns day-to-day product documentation
- All changes require Founder approval

---

### Layer 2: Systems

| Document | Final Authority | Owns | Proposes | Reads |
|----------|----------------|------|----------|-------|
| **direction-and-commitment.md** | 🔴 Founder | 🟢 Principal Product Architect | 🟡 UX Architect | ⚪ All implementation roles |
| **action-and-evidence.md** | 🔴 Founder | 🟢 Principal Product Architect | 🟡 UX Architect | ⚪ All implementation roles |
| **sensemaking-and-adaptation.md** | 🔴 Founder | 🟢 Principal Product Architect | 🟡 UX Architect | ⚪ All implementation roles |
| **continuity-and-interoperability.md** | 🔴 Founder | 🟢 Principal Product Architect | 🟡 Engineering Architect | ⚪ All implementation roles |
| **intelligence-and-trust.md** | 🔴 Founder | 🟢 Principal Product Architect | 🟡 Engineering Architect | ⚪ All implementation roles |

**Rules:**
- Systems define product boundaries and rules
- Cannot be changed by implementation convenience
- All changes require Founder approval

---

### Layer 3: Experience

| Document | Final Authority | Owns | Proposes | Contributes |
|----------|----------------|------|----------|-------------|
| **experience-architecture.md** | 🔴 Founder | 🟢 UX Architect | 🟡 Design System Architect | 🔵 Engineers |
| **information-structure.md** | 🔴 Founder | 🟢 UX Architect | 🟡 Principal Product Architect | 🔵 All roles |
| **journey-contracts.md** | 🔴 Founder | 🟢 UX Architect | 🟡 Principal Product Architect | 🔵 Engineers |

**Rules:**
- UX Architect owns experience definition
- Implementation must follow experience contracts
- Changes require Founder approval

---

### Layer 4: Features

| Document | Final Authority | Owns | Proposes | Contributes |
|----------|----------------|------|----------|-------------|
| **feature-catalog.md** | 🔴 Founder | 🟢 Planning Lead | 🟡 All roles | 🔵 All roles |
| **Feature Brief** | 🔴 Founder | 🟢 Principal Product Architect | 🟡 Planning Lead | 🔵 UX Architect, Engineers |
| **Behavior Contract** | 🔴 Founder | 🟢 Principal Product Architect | 🟡 UX Architect | 🔵 Engineers, QA Lead |
| **Delivery Design** | 🔴 Founder | 🟢 Engineering Architect | 🟡 Senior Full Stack Engineer | 🔵 Engineers |
| **Validation Plan** | 🔴 Founder | 🟢 QA Lead | 🟡 Engineering Architect | 🔵 Engineers |

**Rules:**
- Feature admission requires Founder approval
- Behavior contracts define "what," not "how"
- Implementation follows contracts, never changes them silently

---

### Layer 5: Design

| Document | Final Authority | Owns | Proposes | Contributes |
|----------|----------------|------|----------|-------------|
| **design-system-architecture.md** | 🔴 Founder | 🟢 Design System Architect | 🟡 UX Architect | 🔵 Engineers |
| **design-implementation-map.md** | 🔴 Founder | 🟢 Design System Architect | 🟡 Documentation Architect | 🔵 Engineers |
| **feature-design-specifications.md** | 🔴 Founder | 🟢 Design System Architect | 🟡 UX Architect | 🔵 Engineers |
| **accessibility-standards.md** | 🔴 Founder | 🟢 Design System Architect | 🟡 UX Architect | 🔵 QA Lead, Engineers |
| **content-standards.md** | 🔴 Founder | 🟢 UX Architect | 🟡 Documentation Architect | 🔵 All roles |

**Rules:**
- Design System Architect owns visual and interaction standards
- UX Architect owns content and experience standards
- Implementation must follow design specs
- Changes require Founder approval

---

### Layer 6: Engineering

| Document | Final Authority | Owns | Proposes | Contributes |
|----------|----------------|------|----------|-------------|
| **engineering-architecture.md** | 🔴 Founder | 🟢 Engineering Architect | 🟡 Senior Full Stack Engineer | 🔵 All engineers |
| **software-engineering-principles-and-sdlc.md** | 🔴 Founder | 🟢 Engineering Architect | 🟡 Senior Full Stack Engineer | 🔵 All roles |
| **data-architecture.md** | 🔴 Founder | 🟢 Engineering Architect | 🟡 Senior Full Stack Engineer | 🔵 Engineers |
| **quality-architecture.md** | 🔴 Founder | 🟢 QA Lead | 🟡 Engineering Architect | 🔵 All engineers |
| **operations-architecture.md** | 🔴 Founder | 🟢 Release Manager | 🟡 Engineering Architect | 🔵 All engineers |
| **engineering-standards.md** | 🔴 Founder | 🟢 Engineering Architect | 🟡 Senior Full Stack Engineer | 🔵 All engineers |

**Rules:**
- Engineering Architect owns technical boundaries
- Standards apply to all implementation work
- Material changes require Founder approval
- Engineers can propose improvements

---

### Layer 7: Strategy & Delivery

| Document | Final Authority | Owns | Proposes | Contributes |
|----------|----------------|------|----------|-------------|
| **roadmap.md** | 🔴 Founder | 🟢 Planning Lead | 🟡 Product Strategist | 🔵 All roles |
| **mvp-implementation-masterplan.md** | 🔴 Founder | 🟢 Planning Lead | 🟡 Engineering Architect | 🔵 All roles |
| **development-handbook.md** | 🔴 Founder | 🟢 Engineering Architect | 🟡 Planning Lead | 🔵 All roles |
| **release-plans.md** | 🔴 Founder | 🟢 Release Manager | 🟡 Engineering Architect | 🔵 Engineers, QA Lead |
| **Delivery Plans** | 🔴 Founder | 🟢 Planning Lead | 🟡 Engineering Architect | 🔵 All implementation roles |

**Rules:**
- Founder decides priorities and sequence
- Planning Lead maintains execution plan
- Changes to scope/timeline require Founder approval

---

### Layer 8: Decisions

| Document | Final Authority | Owns | Proposes | Reads |
|----------|----------------|------|----------|-------|
| **decision-register.md** | 🔴 Founder | 🟢 Documentation Architect | 🟡 All roles | ⚪ All roles |
| **Decision Records** | 🔴 Founder | 🟢 Founder | 🟡 Role that raised decision | ⚪ All roles |

**Rules:**
- Only Founder makes consequential decisions
- Roles provide evidence and options
- Decision records are immutable after creation (can be superseded, not edited)

---

### Layer 9: Evidence

| Document | Final Authority | Owns | Proposes | Contributes |
|----------|----------------|------|----------|-------------|
| **research-program.md** | 🔴 Founder | 🟢 Product Strategist | 🟡 Principal Product Architect | 🔵 All roles |
| **Research Records** | 🔴 Product Strategist | 🟢 Product Strategist | — | 🔵 Founder (interpretation) |
| **Measurement Specifications** | 🔴 Founder | 🟢 Product Strategist | 🟡 Planning Lead | 🔵 Engineers |
| **Measurement Records** | 🔴 Engineers | 🟢 Engineers | — | 🔵 Founder, Product Strategist |

**Rules:**
- Evidence is factual, not interpretive
- Records are immutable (append-only)
- Founder interprets evidence for decisions

---

### Layer 10: Reviews

| Document | Final Authority | Owns | Proposes | Reads |
|----------|----------------|------|----------|-------|
| **review-records.md** | 🔴 Founder | 🟢 Documentation Architect | 🟡 All roles | ⚪ All roles |
| **Review Records** | 🔴 Founder | 🟢 Reviewer (assigns rating) | 🟡 Reviewed role | ⚪ All roles |
| **post-release-learning-records.md** | 🔴 Founder | 🟢 Release Manager | 🟡 All roles | ⚪ All roles |
| **Learning Records** | 🔴 Founder | 🟢 Release Manager | 🟡 Role that led release | ⚪ All roles |

**Rules:**
- Reviews assess against contracts, not opinions
- Learning records are factual observations
- Founder makes final disposition on all reviews

---

## Decision Authority Matrix

### Product Decisions

| Decision | Final Authority | Recommends | Contributes |
|----------|----------------|------------|-------------|
| Vision changes | 🔴 Founder | — | 🔵 All roles (evidence) |
| Product scope | 🔴 Founder | 🟡 Principal Product Architect | 🔵 Product Strategist |
| Feature admission | 🔴 Founder | 🟡 Planning Lead | 🔵 Product Architect, Engineers |
| Behavior contracts | 🔴 Founder | 🟡 Principal Product Architect | 🔵 UX Architect, Engineers |
| User terminology | 🔴 Founder | 🟡 UX Architect | 🔵 Documentation Architect |
| Success metrics | 🔴 Founder | 🟡 Product Strategist | 🔵 Planning Lead |

---

### Architecture Decisions

| Decision | Final Authority | Recommends | Contributes |
|----------|----------------|------------|-------------|
| Technical architecture | 🔴 Founder | 🟡 Engineering Architect | 🔵 Senior Full Stack Engineer |
| Data model changes | 🔴 Founder | 🟡 Engineering Architect | 🔵 Engineers |
| Design system changes | 🔴 Founder | 🟡 Design System Architect | 🔵 Engineers |
| UX patterns | 🔴 Founder | 🟡 UX Architect | 🔵 Design System Architect |
| Security/privacy approach | 🔴 Founder | 🟡 Engineering Architect | 🔵 QA Lead, Engineers |

---

### Implementation Decisions

| Decision | Final Authority | Recommends | Contributes |
|----------|----------------|------------|-------------|
| Technical approach (within contract) | 🟢 Senior Full Stack Engineer | — | 🔵 Engineering Architect |
| Component implementation | 🟢 Senior Full Stack Engineer | 🟡 Design System Architect | 🔵 Engineering Architect |
| API implementation | 🟢 Senior Full Stack Engineer | 🟡 Engineering Architect | 🔵 Engineering Architect |
| Test strategy | 🟢 QA Lead | 🟡 Engineering Architect | 🔵 Engineers |
| Bug fix approach | 🟢 Senior Full Stack Engineer | — | 🔵 QA Lead |

---

### Release Decisions

| Decision | Final Authority | Recommends | Contributes |
|----------|----------------|------------|-------------|
| Release authorization | 🔴 Founder | 🟡 Release Manager | 🔵 QA Lead, Engineers |
| Release timing | 🔴 Founder | 🟡 Release Manager | 🔵 Planning Lead |
| Rollback decision | 🔴 Founder | 🟡 Release Manager | 🔵 Engineers |
| Release scope | 🔴 Founder | 🟡 Planning Lead | 🔵 Release Manager, Engineers |

---

### Quality Decisions

| Decision | Final Authority | Recommends | Contributes |
|----------|----------------|------------|-------------|
| Quality standards | 🔴 Founder | 🟡 QA Lead | 🔵 Engineering Architect |
| Test coverage requirements | 🔴 Founder | 🟡 QA Lead | 🔵 Engineers |
| Accept with known issues | 🔴 Founder | 🟡 QA Lead | 🔵 Engineers |
| Bug priority | 🔴 Founder | 🟡 QA Lead | 🔵 Engineers |

---

## Modification Rights by Role

### Founder

**Can modify independently:**
- All documents (final authority on everything)

**Must consult:**
- None (Founder has final say)

**Process:**
- Can modify directly or assign to role
- Should explain rationale for organizational learning

---

### Principal Product Architect

**Can modify independently:**
- Feature briefs (drafts, pending Founder approval)
- Behavior contracts (drafts, pending Founder approval)

**Can propose changes:**
- Product model
- Systems documents
- Product glossary

**Cannot modify:**
- Vision
- Architecture documents
- Engineering standards
- Released feature contracts (without Founder approval)

---

### Engineering Architect

**Can modify independently:**
- Engineering standards (within Founder-approved boundaries)
- Technical documentation (implementation details)
- Code standards

**Can propose changes:**
- Engineering architecture
- Data architecture
- Quality architecture

**Cannot modify:**
- Product documents
- Behavior contracts
- Design specifications

---

### Senior Full Stack Engineer

**Can modify independently:**
- Code (implementation)
- Technical documentation (what was implemented)
- Test code

**Can propose changes:**
- Delivery designs
- Validation plans
- Engineering standards

**Cannot modify:**
- Behavior contracts (escalate if ambiguous)
- Architecture documents (propose changes)
- Feature briefs (contribute evidence only)

---

### Design System Architect

**Can modify independently:**
- Design system documentation (within Founder-approved system)
- Component specifications (drafts)
- Visual tokens

**Can propose changes:**
- Design system architecture
- Feature design specifications

**Cannot modify:**
- Behavior contracts (UI behavior)
- UX architecture
- Product documents

---

### QA Lead

**Can modify independently:**
- Test plans
- Test results
- Quality reports

**Can propose changes:**
- Quality architecture
- Validation plans
- Quality standards

**Cannot modify:**
- Behavior contracts
- Implementation code
- Feature specifications

---

### Documentation Architect

**Can modify independently:**
- Documentation structure (within Founder-approved architecture)
- Documentation standards
- Documentation indexes

**Can propose changes:**
- Documentation architecture
- Documentation processes

**Cannot modify:**
- Product documents
- Technical documents owned by other roles
- Decision records

---

### Planning Lead

**Can modify independently:**
- Delivery plans (drafts)
- Work assignments (execution tracking)

**Can propose changes:**
- Roadmap
- MVP Masterplan
- Feature catalog status

**Cannot modify:**
- Product scope
- Architecture documents
- Feature contracts

---

## Conflict Resolution Rules

### Rule 1: Higher Authority Wins

**Documentation hierarchy (high to low):**
1. Vision
2. Decision Records
3. Product & Systems
4. Experience & Features
5. Design & Engineering
6. Strategy & Delivery
7. Evidence & Reviews

**When conflicts arise:**
- Check authority level
- Higher document is correct
- Update lower document or escalate to Founder

---

### Rule 2: Escalate, Don't Override

**When authority is unclear:**
- Do not silently choose one interpretation
- Gather evidence of conflict
- Present options
- Escalate to Founder
- Implement Founder's decision

---

### Rule 3: Preserve History

**When updating documents:**
- Do not rewrite decision records
- Do not rewrite review records
- Do not rewrite evidence records
- Create new records that supersede old ones

**Living documents can be updated:**
- Product models
- Architecture documents
- Standards and guidelines
- Implementation references

---

### Rule 4: Implementation Never Changes Contracts

**If implementation conflicts with contract:**
1. Assume contract is correct
2. Check if implementation is wrong
3. If contract is unclear/wrong, escalate to Founder
4. Founder updates contract if needed
5. Then fix implementation

**Never:**
- Change contract to match implementation
- Silently implement different behavior
- Assume contract is outdated

---

## Approval Requirements

### No Approval Needed (Independent Authority)

- Writing code within approved contract
- Writing tests for implemented features
- Creating draft documentation
- Implementing approved UI design
- Routine bug fixes (restoring contract behavior)

**Rule:** Work stays within role authority and existing contracts.

---

### Founder Review Required (Contributory Authority)

- Changes to product documents
- Changes to architecture documents
- New features (even if previously discussed)
- Behavior contract changes
- Release execution
- Material technical decisions

**Rule:** Significant impact or crosses authority boundaries.

---

### Founder Approval Required (Final Authority)

- Vision changes (extremely rare)
- Product scope changes
- Architecture decisions
- Feature admission/rejection
- Release authorization
- Resolving conflicts between roles
- Changing organizational structure

**Rule:** Strategic or irreversible impact.

---

## Summary Table: Who Can Do What

| Activity | Independent | Needs Review | Needs Approval |
|----------|-------------|--------------|----------------|
| Implement feature (within contract) | ✅ Engineer | Review by QA | Approve by Founder |
| Change behavior contract | ❌ | — | ✅ Founder only |
| Propose architecture change | ✅ Architect | Review by Founder | Approve by Founder |
| Write test plan | ✅ QA Lead | Review by Architect | Approve by Founder |
| Fix bug (restore contract) | ✅ Engineer | Review by QA | Approve by Founder |
| Create design spec | ✅ Design Architect | Review by UX Architect | Approve by Founder |
| Update technical docs | ✅ Engineer | Review by Doc Reviewer | No approval needed |
| Release to production | ❌ | — | ✅ Founder only |
| Merge to main | ❌ | — | ✅ Founder approval required |
| Change product model | ❌ | — | ✅ Founder only |

---

**This authority matrix eliminates ambiguity. Every role knows exactly what they can decide, what they can propose, and what requires Founder approval.**
