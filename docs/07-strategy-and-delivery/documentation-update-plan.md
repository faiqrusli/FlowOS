# Documentation Update Plan — Team & Role Alignment

**Purpose:** Update all documents to reflect the finalized 6-role team structure  
**Status:** Planning  
**Owner:** Founder  
**Created:** 2026-08-02  

---

## Problem

All documents created before the 6-role team structure was finalized have:
1. **Vague ownership:** "Product leadership" instead of "Product Architect"
2. **No approval workflows:** Missing who reviews/approves
3. **Unclear authority:** No reference to role authority
4. **Ambiguous responsibility:** Who actually maintains each document?

**Now that we have:**
- ✅ Finalized 6-role structure
- ✅ Clear authority matrix
- ✅ Approval workflows
- ✅ Sprint system with assignments

**We need to:** Update all documents to reference the actual roles and workflows.

---

## Scope

### Documents to Update

#### **High Priority — Used in Current Sprint**

1. **Product Documents** (Product Architect owns)
   - [ ] `docs/01-product/product-model.md`
   - [ ] `docs/01-product/product-glossary.md`
   - [ ] `docs/01-product/product-strategy.md`
   - [ ] `docs/01-product/success-model.md`
   - [ ] `docs/01-product/README.md`

2. **System Documents** (Product Architect owns)
   - [ ] `docs/02-systems/direction-and-commitment.md`
   - [ ] `docs/02-systems/action-and-evidence.md`
   - [ ] `docs/02-systems/sensemaking-and-adaptation.md`
   - [ ] `docs/02-systems/continuity-and-interoperability.md`
   - [ ] `docs/02-systems/intelligence-and-trust.md`
   - [ ] `docs/02-systems/README.md`

3. **Experience Documents** (Design Architect owns)
   - [ ] `docs/03-experience/experience-architecture.md`
   - [ ] `docs/03-experience/information-structure.md`
   - [ ] `docs/03-experience/journey-contracts.md`
   - [ ] `docs/03-experience/README.md`

4. **Feature Documents** (Various owners)
   - [ ] `docs/04-features/feature-catalog.md` (Product Architect)
   - [ ] `docs/04-features/feature-briefs.md` (Product Architect)
   - [ ] `docs/04-features/behavior-contracts.md` (Product Architect)
   - [ ] `docs/04-features/feature-dossier-standard.md` (Product Architect)
   - [ ] `docs/04-features/validation-plans.md` (Release Manager)
   - [ ] `docs/04-features/delivery-designs.md` (Engineering Architect)
   - [ ] `docs/04-features/README.md`

5. **Design Documents** (Design Architect owns)
   - [ ] `docs/05-design/design-system-architecture.md`
   - [ ] `docs/05-design/design-implementation-map.md`
   - [ ] `docs/05-design/feature-design-specifications.md`
   - [ ] `docs/05-design/content-standards.md`
   - [ ] `docs/05-design/accessibility-standards.md`
   - [ ] `docs/05-design/README.md`

6. **Engineering Documents** (Engineering Architect owns)
   - [ ] `docs/06-engineering/engineering-architecture.md`
   - [ ] `docs/06-engineering/engineering-standards.md`
   - [ ] `docs/06-engineering/data-architecture.md`
   - [ ] `docs/06-engineering/quality-architecture.md`
   - [ ] `docs/06-engineering/operations-architecture.md`
   - [ ] `docs/06-engineering/identity-and-access-architecture.md`
   - [ ] `docs/06-engineering/client-architecture.md`
   - [ ] `docs/06-engineering/integration-architecture.md`
   - [ ] `docs/06-engineering/intelligence-and-trust-architecture.md`
   - [ ] `docs/06-engineering/README.md`

7. **Process Documents** (Multiple roles)
   - [ ] `docs/07-strategy-and-delivery/roadmap.md` (Product Architect)
   - [ ] `docs/07-strategy-and-delivery/mvp-implementation-masterplan.md` (Product Architect + Engineering Architect)
   - [ ] `docs/07-strategy-and-delivery/delivery-plans.md` (Product Architect)
   - [ ] `docs/07-strategy-and-delivery/release-plans.md` (Release Manager)
   - [ ] `docs/07-strategy-and-delivery/documentation-refinement-plan.md` (Product Architect)

8. **Start-Here Documents** (For onboarding)
   - [ ] `docs/start-here/implementing-a-feature.md`
   - [ ] `docs/start-here/README.md`

#### **Medium Priority — Reference Documents**

9. **Constitution** (Founder owns)
   - [ ] `docs/00-constitution/documentation-architecture.md`

10. **Decision Documents** (Founder owns)
    - [ ] `docs/08-decisions/decision-register.md`
    - [ ] `docs/08-decisions/records/D-001-adopt-canonical-documentation-ecosystem.md`

11. **Evidence Documents** (Product Architect + Release Manager)
    - [ ] `docs/09-evidence/research-program.md`
    - [ ] `docs/09-evidence/measurement-specifications.md`
    - [ ] `docs/09-evidence/insight-syntheses.md`
    - [ ] `docs/09-evidence/README.md`

12. **Review Documents** (Release Manager)
    - [ ] `docs/10-reviews/post-release-learning-records.md`

13. **Meta Documents** (Founder)
    - [ ] `docs/meta/document-map.md`

#### **Low Priority — Archive**
- Archive documents don't need updating (historical reference only)

---

## Update Pattern

### Old Pattern (Before 6-Role Team)

```markdown
**Owner:** Product leadership
**Status:** Active
```

No mention of:
- Who can modify
- Who reviews
- Who approves
- How changes are made

### New Pattern (With 6-Role Team)

```markdown
**Owner:** [Specific Role Name]
**Authority:** [Proposes/Contributory/Independent]
**Approval Required:** [Founder/Upstream Role]
**Status:** Active
**Last Updated:** [Date]
```

Plus add section:

```markdown
## Document Ownership

### Owner
**Role:** [Role Name]
**Responsibility:** [What owner does]

### Modification Process
1. [Role] proposes changes
2. [Reviewer Role] reviews (if applicable)
3. Founder approves
4. Update Last Updated date
5. Document in decision record if consequential

### Authority Level
- [Role] can: [What they can do independently]
- Requires approval for: [What needs Founder approval]
```

---

## Mapping: Old Ownership → New Ownership

| Old Owner | New Owner | Authority | Approval |
|-----------|-----------|-----------|----------|
| Product leadership | Product Architect | Contributory | Founder |
| Product and engineering leadership | Product Architect + Engineering Architect | Contributory | Founder |
| Product and design leadership | Product Architect + Design Architect | Contributory | Founder |
| Design leadership | Design Architect | Contributory | Founder |
| Engineering leadership | Engineering Architect | Contributory | Founder |
| Product, design, and engineering leadership | Product Architect (propose) → Design Architect (review) → Engineering Architect (review) | Contributory | Founder |
| Engineering and operations leadership | Engineering Architect + Release Manager | Contributory | Founder |
| Product, engineering, and operations leadership | Product Architect + Engineering Architect + Release Manager | Contributory | Founder |
| Product research leadership | Product Architect | Contributory | Founder |
| Product and documentation leadership | Product Architect | Contributory | Founder |

---

## Update Process

### For Each Document

```markdown
1. Identify current "Owner:" field
2. Map to specific role using table above
3. Add authority level (from role authority matrix)
4. Add "Approval Required: Founder" (default)
5. Add "Last Updated: [date]"
6. Add "Document Ownership" section with:
   - Owner role
   - Modification process
   - Authority level
7. Update any workflow descriptions to reference roles
8. Update any "leadership" references to role names
```

### Example: Before & After

**BEFORE:**
```markdown
# Product Model

**Status:** Active  
**Authority:** Foundation of all product decisions  
**Owner:** Product leadership  
**Parent:** Vision · Documentation Architecture  
**Last reviewed:** 2026-08-01
```

**AFTER:**
```markdown
# Product Model

**Status:** Active  
**Authority:** Foundation of all product decisions  
**Owner:** Product Architect  
**Approval Required:** Founder  
**Parent:** Vision · Documentation Architecture  
**Last Updated:** 2026-08-02

---

## Document Ownership

### Owner
**Role:** Product Architect  
**Responsibility:** Maintain product model, propose changes based on evidence

### Modification Process
1. Product Architect proposes changes (based on product evidence)
2. Submit to Founder for approval
3. Founder reviews for Vision alignment
4. If approved: Product Architect updates document
5. Document change in decision record if consequential

### Authority Level
**Product Architect can:**
- Propose additions to product concepts
- Clarify existing concepts
- Add examples and documentation
- Fix typos and formatting

**Requires Founder approval:**
- Adding new core concepts
- Changing concept relationships
- Removing concepts
- Changing concept invariants
```

---

## Priority Batches

### Batch 1: Current Sprint Dependencies (Week 1)
**Priority:** Highest — Needed for current sprint work

Documents Product Architect and Design Architect will reference this week:
1. Product Model
2. Product Glossary
3. Direction and Commitment system
4. Action and Evidence system
5. Feature Catalog
6. Feature Briefs standard
7. Behavior Contracts standard
8. Design System Architecture
9. Design Implementation Map

**Assigned to:** Product Architect (docs 1-7), Design Architect (docs 8-9)  
**Due:** 2026-08-04  
**Approval:** Founder reviews and approves batch  

---

### Batch 2: Engineering & Quality (Week 1)
**Priority:** High — Engineering Architect and Release Manager need these

Documents for architecture and quality baseline:
1. Engineering Architecture
2. Engineering Standards
3. Quality Architecture
4. Operations Architecture
5. Data Architecture
6. Validation Plans standard
7. Delivery Designs standard

**Assigned to:** Engineering Architect (docs 1-5), Release Manager (doc 6), Engineering Architect (doc 7)  
**Due:** 2026-08-05  
**Approval:** Founder reviews and approves batch  

---

### Batch 3: Process & Strategy (Week 2)
**Priority:** Medium — For next sprint planning

Documents for sprint coordination:
1. Roadmap
2. MVP Implementation Masterplan
3. Delivery Plans standard
4. Release Plans standard
5. Documentation Refinement Plan
6. Product Strategy
7. Success Model

**Assigned to:** Product Architect (all)  
**Due:** 2026-08-09  
**Approval:** Founder reviews and approves batch  

---

### Batch 4: Experience & Design Standards (Week 2)
**Priority:** Medium — For design reconciliation

Documents for design work:
1. Experience Architecture
2. Information Structure
3. Journey Contracts
4. Content Standards
5. Accessibility Standards
6. Feature Design Specifications standard

**Assigned to:** Design Architect (all)  
**Due:** 2026-08-10  
**Approval:** Founder reviews and approvals batch  

---

### Batch 5: Meta & Reference (Week 3)
**Priority:** Low — Nice to have, not blocking

Documents for completeness:
1. Documentation Architecture
2. Decision Register
3. Document Map
4. Evidence READMEs
5. Start-here guides

**Assigned to:** Product Architect (coordinate)  
**Due:** 2026-08-16  
**Approval:** Founder reviews and approves batch  

---

## Implementation

### As Sprint Task (Batch 1 Example)

```markdown
### Product Architect

#### Task: Update Product & Feature Documents with Role Ownership

Assignment: Update 9 core product documents with 6-role ownership
Context: Phase 1 sprint - roles will reference these docs, need clear ownership
Documents to Update:
  1. docs/01-product/product-model.md
  2. docs/01-product/product-glossary.md
  3. docs/02-systems/direction-and-commitment.md
  4. docs/02-systems/action-and-evidence.md
  5. docs/04-features/feature-catalog.md
  6. docs/04-features/feature-briefs.md
  7. docs/04-features/behavior-contracts.md
Expected Output:
  - All 7 docs updated with:
    - Owner: Product Architect
    - Approval Required: Founder
    - Document Ownership section
    - Last Updated: 2026-08-02
  - PR with all changes
Definition of Done:
  - All "Product leadership" → "Product Architect"
  - Document Ownership sections added
  - Modification process documented
  - Authority levels specified
  - Founder approved
Due: 2026-08-04
Priority: High (blocking current sprint work)
```

```markdown
### Design Architect

#### Task: Update Design Documents with Role Ownership

Assignment: Update 2 core design documents with 6-role ownership
Context: Phase 1 sprint - need clear ownership for design reconciliation work
Documents to Update:
  1. docs/05-design/design-system-architecture.md
  2. docs/05-design/design-implementation-map.md
Expected Output:
  - Both docs updated with:
    - Owner: Design Architect
    - Approval Required: Founder (and Product Architect review where applicable)
    - Document Ownership section
    - Last Updated: 2026-08-02
  - PR with changes
Definition of Done:
  - All "Design leadership" → "Design Architect"
  - Document Ownership sections added
  - Modification process documented
  - Authority levels specified
  - Founder approved
Due: 2026-08-04
Priority: High (blocking design audit work)
```

---

## Acceptance Criteria

### For Each Updated Document

- [ ] Owner field updated to specific role (not "leadership")
- [ ] Authority level specified
- [ ] Approval process documented
- [ ] "Document Ownership" section added
- [ ] Modification process clear
- [ ] Last Updated date current
- [ ] All "leadership" references replaced with role names
- [ ] Founder has reviewed and approved

### For Overall Plan

- [ ] All active documents updated (archive can stay as-is)
- [ ] Ownership clear for every document
- [ ] Authority matrix referenced correctly
- [ ] Approval workflows aligned with team structure
- [ ] No ambiguous "leadership" references in active docs

---

## Success Metrics

**After completion:**
1. Every active document has a specific owner role
2. Every role knows which documents they own
3. Modification process is clear for all documents
4. Authority levels align with role authority matrix
5. No confusion about who can change what

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Updates take too long | Blocks current sprint | Batch into priorities, start with sprint-critical docs |
| Inconsistent updates | Confusing ownership | Use standard template, Founder reviews batches |
| Roles unclear on new ownership | Wrong person updates docs | Reference authority matrix, add to role docs |
| Documents out of sync during update | Confusion | Update in batches, communicate which batch is active |

---

## Related Documents

- [Active 6-Role Configuration](../12-team/active-6-role/README.md) — Team structure
- [Authority Matrix](../12-team/authority-matrix.md) — Who can do what
- [Current Sprint](./current-sprint.md) — Active work assignments
- [Documentation Architecture](../00-constitution/documentation-architecture.md) — Doc structure

---

## Next Steps

1. **Founder:** Review and approve this plan
2. **Add Batch 1 to current sprint** (highest priority)
3. **Assign Batch 1 tasks** to Product Architect and Design Architect
4. **Execute updates** following the standard template
5. **Review and approve** batch by batch
6. **Schedule remaining batches** in upcoming sprints

---

**This plan ensures all documentation reflects the actual team structure and clear ownership.**
