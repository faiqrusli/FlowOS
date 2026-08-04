# Technology Integration Masterplan

**Status:** Active
**Authority:** Canonical engineering technology roadmap for FlowOS frameworks, libraries, infrastructure, and tooling evolution
**Owner:** Engineering Architect
**Approval Required:** Founder
**Parent:** [Engineering Architecture](./engineering-architecture.md) · [Technical Architecture](./TECHNICAL_ARCHITECTURE.md) · [MVP Implementation Masterplan](../current-phase/mvp-implementation-masterplan.md)
**Children:** Technology-specific integration records, architecture reviews, dependency decision records, and [D-004](../08-decisions/records/D-004-add-phase-1-5-foundation-infrastructure-to-mvp-masterplan.md) (Phase 1.5 addition to MVP Masterplan)
**Last Updated:** 2026-08-05
**Review trigger:** A proposed technology addition, removal, phase reassignment, or change to integration principles or workflow

---

## Document Ownership

### Owner
**Role:** Engineering Architect
**Responsibility:** Maintain the technology integration roadmap, evaluate new technologies, ensure phased integration aligns with FlowOS maturity, and coordinate with relevant domain architects

### Modification Process
1. Engineering Architect proposes technology changes (based on engineering needs or maturity evolution)
2. Review with relevant domain architects (Client, Data, Integration, Quality, Operations) for impact assessment
3. Submit to Founder for approval
4. Founder reviews for alignment with Vision, product capabilities, and engineering priorities
5. If approved: Engineering Architect updates document
6. Document change in decision record if consequential
7. Update Last Updated date

### Authority Level
- Engineering Architect can: Propose technology additions/reassignments, maintain integration principles, coordinate phase transitions
- Requires approval for: Any new technology adoption, phase reassignment, or change to integration principles

---

# Introduction

This document is the single source of truth for every engineering technology, library, framework, tooling, infrastructure, testing framework, monitoring platform, AI SDK, and future technical dependency used by FlowOS.

Every engineering technology decision must be documented here before implementation. Technologies are introduced only when they provide measurable value to FlowOS. We avoid unnecessary dependencies, prioritize simplicity, and ensure long-term maintainability.

This document answers:

- What technologies does FlowOS use?
- Why are they needed?
- When should they be integrated?
- Why are they not integrated yet?
- What problem do they solve?
- How do they fit into the overall architecture?

This is **NOT** a product roadmap. This is **NOT** an implementation checklist. This is the engineering evolution roadmap for FlowOS.

The masterplan follows the maturity of FlowOS instead of dates. New technologies should be added as new phases or future considerations instead of creating separate roadmap documents.

---

# Integration Principles

Every technology introduced to FlowOS must satisfy these principles:

## Solve a Real Problem
Technology must address a concrete, measurable problem in the current system. Do not add technology because it is popular, trending, or "future-proof."

## Minimize Dependencies
Each dependency adds maintenance burden, security surface, and potential breaking changes. Prefer solutions that minimize external dependencies.

## Prefer Mature, Well-Maintained Libraries
Choose libraries with:
- Active maintenance and community support
- Clear documentation and examples
- Stable API (avoid alpha/beta releases in production)
- Compatible licensing

## Prefer Incremental Adoption
Introduce technologies incrementally rather than wholesale rewrites. Start with limited scope and expand based on evidence.

## Remove Obsolete Technologies
When a technology is no longer needed or a better alternative exists, plan its removal. Mark as Deprecated with migration path.

## Clear Ownership and Purpose
Every library must have:
- A defined owner (role or team)
- A clear purpose statement
- Measurable success criteria
- Documented integration patterns

## Avoid Duplication
Do not introduce multiple technologies that solve the same problem. Evaluate existing solutions before adding new ones.

## Evidence-Based Decisions
Technology decisions must be based on:
- Concrete use cases
- Performance evidence
- Maintenance cost analysis
- Alignment with architecture principles

---

# Phase Definitions

FlowOS technology integration follows a 5-phase maturity model aligned with product and organizational maturity.

## Phase 1 — Core Foundation

Essential engineering foundations integrated immediately.

**Purpose:** Establish fundamental infrastructure for validation, forms, and time handling.

**Examples:**
- Zod (Runtime validation)
- React Hook Form (Form management)
- date-fns (Date & Time manipulation)

**Integration Trigger:** During Phase 1.5 of MVP Implementation Masterplan - after implementation truth is established but before MVP loop contracting

**Success Criteria:**
- Core forms use React Hook Form + Zod validation
- All date/time operations use date-fns
- Validation patterns established for future features
- Infrastructure ready before Phase 2 MVP loop contracting

---

## Phase 2 — Development Quality

Improve development quality and developer experience.

**Purpose:** Establish testing infrastructure, code quality tools, and development workflow automation.

**Examples:**
- Vitest (Unit testing - active usage)
- ESLint improvements (Code quality)
- Husky (Git hooks)
- lint-staged (Pre-commit linting)

**Integration Trigger:** When basic functionality is stable and team size requires automated quality gates

**Success Criteria:**
- Unit test coverage on critical paths
- Automated linting in CI/CD
- Pre-commit hooks prevent common issues
- Developer workflow is fast and reliable

---

## Phase 3 — Feature Maturity

Add technologies only when product complexity requires them.

**Purpose:** Enhance capabilities as FlowOS features become more complex and user experience requirements increase.

**Examples:**
- Playwright (E2E testing)
- TanStack Query (Complex client state)
- nuqs (Type-safe URL state)
- cmdk (Command palette)

**Integration Trigger:** When specific feature complexity justifies the dependency

**Success Criteria:**
- Each technology solves a clear, measurable problem
- Integration does not duplicate existing functionality
- Performance impact is acceptable
- Team has capacity to maintain the technology

---

## Phase 4 — Production Readiness

Production tooling for monitoring and reliability.

**Purpose:** Ensure production observability, error tracking, and operational reliability.

**Examples:**
- Sentry (Error tracking and monitoring)

**Integration Trigger:** When deploying to production with real users

**Success Criteria:**
- Error tracking captures production issues
- Performance monitoring identifies bottlenecks
- Alerts are actionable and not noisy
- Team has incident response processes

---

## Phase 5 — Growth & Scale

Only after FlowOS has real users and validated product-market fit.

**Purpose:** Advanced features for user growth, scale, and enhanced experience.

**Examples:**
- Fuse.js (Advanced search)
- framer-motion (UX polish/animations)
- PostHog (Product analytics)

**Integration Trigger:** When user base justifies investment and clear ROI is demonstrated

**Success Criteria:**
- Clear business case supported by user data
- Technology directly supports growth or retention
- Team has capacity to maintain complexity
- Integration cost is justified by measurable benefit

---

## Future Considerations

Technologies currently under evaluation or for future consideration.

### Redis
**Purpose:** Caching layer for performance optimization
**Why Not Integrated Yet:** FlowOS does not yet have performance issues that justify caching complexity. Supabase PostgreSQL is sufficient for current scale.
**Evaluation Trigger:** When database performance becomes bottleneck or specific caching patterns are needed

### OpenTelemetry
**Purpose:** Distributed tracing and observability
**Why Not Integrated Yet:** Current observability needs are met by Vercel analytics and basic logging. OpenTelemetry adds significant operational complexity.
**Evaluation Trigger:** When distributed system complexity requires comprehensive observability

### Vector Database
**Purpose:** AI features, semantic search, knowledge retrieval
**Why Not Integrated Yet:** AI features are not yet prioritized. Vector databases require infrastructure and maintenance overhead.
**Evaluation Trigger:** When AI capabilities become strategic priority

### AI SDKs
**Purpose:** Integration with AI services (OpenAI, Anthropic, etc.)
**Why Not Integrated Yet:** AI features are deferred. SDKs change frequently; delaying adoption avoids lock-in and maintenance burden.
**Evaluation Trigger:** When specific AI features are prioritized in product roadmap

---

## Not Planned

Technologies intentionally excluded from FlowOS.

### MSW (Mock Service Worker)
**Purpose:** Mock API responses during testing
**Why Not Needed:** Supabase local development environment provides sufficient testing infrastructure. MSW adds complexity without clear benefit for current architecture.
**Alternative:** Use Supabase local development and integration tests

---

# Library Documentation Template

Every technology entry must follow this standard template.

```markdown
## [Technology Name]

**Purpose:** [One-sentence description of what the technology does]

**Problem Solved:** [Specific problem this technology addresses in FlowOS]

**Why FlowOS Needs It:** [Business or technical justification]

**Benefits:**
- [Benefit 1]
- [Benefit 2]
- [Benefit 3]

**Trade-offs:**
- [Trade-off 1]
- [Trade-off 2]

**Dependencies:** [Required dependencies or infrastructure]

**Recommended Phase:** [Phase 1-5 or Future Considerations]

**Status:** [Planned | In Progress | Implemented | Deferred | Not Planned]

**Implementation Notes:**
[Specific integration considerations, patterns, or gotchas]
```

---

# Current Technologies

## Production Dependencies

### Next.js 16.2.11
**Purpose:** React framework for web application
**Problem Solved:** Server-side rendering, routing, and deployment infrastructure
**Why FlowOS Needs It:** Modern React framework with excellent developer experience, Vercel integration, and built-in optimization
**Benefits:**
- App Router for modern routing patterns
- Server components for performance
- Built-in optimization and caching
- Vercel deployment integration
**Trade-offs:**
- Framework lock-in
- Rapid version changes
**Dependencies:** React, Node.js
**Recommended Phase:** Phase 1 (Implemented)
**Status:** Implemented
**Implementation Notes:** Core framework; all routing and rendering built on Next.js

### React 19.2.4
**Purpose:** UI library for building user interfaces
**Problem Solved:** Component-based UI development with hooks and state management
**Why FlowOS Needs It:** Modern React with concurrent features, better performance, and improved developer experience
**Benefits:**
- Concurrent rendering for better UX
- Improved hooks and state management
- Strong ecosystem and community
**Trade-offs:**
- Learning curve for advanced features
- Bundle size considerations
**Dependencies:** Next.js
**Recommended Phase:** Phase 1 (Implemented)
**Status:** Implemented
**Implementation Notes:** Used throughout application with server components where possible

### @supabase/ssr + @supabase/supabase-js
**Purpose:** Backend-as-a-service for authentication, database, and real-time features
**Problem Solved:** Complete backend infrastructure without building custom backend
**Why FlowOS Needs It:** Accelerates development, provides authentication, PostgreSQL database, and real-time capabilities
**Benefits:**
- Built-in authentication with Row Level Security
- PostgreSQL database with automatic backups
- Real-time subscriptions
- Edge functions for serverless logic
**Trade-offs:**
- Vendor lock-in
- Limited customization compared to self-hosted
**Dependencies:** None (cloud service)
**Recommended Phase:** Phase 1 (Implemented)
**Status:** Implemented
**Implementation Notes:** RLS policies must be verified for production security

### @dnd-kit/core + @dnd-kit/modifiers + @dnd-kit/sortable + @dnd-kit/utilities
**Purpose:** Drag and drop functionality for task management and UI interactions
**Problem Solved:** Complex drag and drop interactions for task boards, focus sessions, and workspace organization
**Why FlowOS Needs It:** Modern, accessible drag and drop library with excellent performance and TypeScript support
**Benefits:**
- Accessible by default
- Excellent performance
- TypeScript support
- Modular architecture
**Trade-offs:**
- Learning curve for advanced use cases
- Bundle size for complex interactions
**Dependencies:** React
**Recommended Phase:** Phase 1 (Implemented)
**Status:** Implemented
**Implementation Notes:** Currently used for task boards and focus session management

### @base-ui/react
**Purpose:** Unstyled UI component library
**Problem Solved:** Accessible, headless UI components as foundation for custom design system
**Why FlowOS Needs It:** Provides accessible component primitives that can be styled with Tailwind while maintaining accessibility
**Benefits:**
- Accessibility built-in
- Headless design for custom styling
- Well-maintained by MUI team
**Trade-offs:**
- Learning curve for component composition
- Less opinionated than full component libraries
**Dependencies:** React
**Recommended Phase:** Phase 1 (Implemented)
**Status:** Implemented
**Implementation Notes:** Used with Tailwind for custom design system implementation

### @vercel/analytics + @vercel/speed-insights
**Purpose:** Production analytics and performance monitoring
**Problem Solved:** User analytics and Core Web Vitals monitoring in production
**Why FlowOS Needs It:** Provides production insights without additional infrastructure setup
**Benefits:**
- Zero configuration
- Core Web Vitals tracking
- User analytics
- Vercel integration
**Trade-offs:**
- Vercel lock-in for analytics
- Limited customization compared to dedicated analytics
**Dependencies:** Vercel deployment
**Recommended Phase:** Phase 4 (Implemented)
**Status:** Implemented
**Implementation Notes:** Provides basic production insights; may be supplemented with dedicated tools

### class-variance-authority
**Purpose:** Utility for managing component variants with Tailwind CSS
**Problem Solved:** Type-safe component variant management without prop conflicts
**Why FlowOS Needs It:** Enables clean, type-safe component variant patterns for design system
**Benefits:**
- Type-safe variant management
- No prop conflicts
- Tailwind integration
**Trade-offs:**
- Additional build step
- Learning curve for pattern
**Dependencies:** Tailwind CSS, clsx
**Recommended Phase:** Phase 1 (Implemented)
**Status:** Implemented
**Implementation Notes:** Used throughout component library for variant management

### clsx
**Purpose:** Utility for conditional CSS class names
**Problem Solved:** Clean conditional class name logic in components
**Why FlowOS Needs It:** Simplifies conditional styling logic
**Benefits:**
- Clean conditional logic
- Small bundle size
- Widely used pattern
**Trade-offs:**
- Limited functionality compared to full libraries
**Dependencies:** None
**Recommended Phase:** Phase 1 (Implemented)
**Status:** Implemented
**Implementation Notes:** Used with tailwind-merge for class name composition

### tailwind-merge
**Purpose:** Merge Tailwind CSS classes without conflicts
**Problem Solved:** Prevents Tailwind class conflicts when composing styles
**Why FlowOS Needs It:** Enables clean style composition with conditional classes
**Benefits:**
- Intelligently merges Tailwind classes
- Prevents conflicts
- Type-safe with TypeScript
**Trade-offs:**
- Additional build step
**Dependencies:** Tailwind CSS
**Recommended Phase:** Phase 1 (Implemented)
**Status:** Implemented
**Implementation Notes:** Used with clsx for style composition

### lucide-react
**Purpose:** Icon library for React applications
**Problem Solved:** Consistent, modern icon set for UI
**Why FlowOS Needs It:** Clean, modern icons that match design aesthetic
**Benefits:**
- Tree-shakeable
- Consistent design
- TypeScript support
- Customizable
**Trade-offs:**
- Limited icon set compared to larger libraries
**Dependencies:** React
**Recommended Phase:** Phase 1 (Implemented)
**Status:** Implemented
**Implementation Notes:** Primary icon library for FlowOS

### tw-animate-css
**Purpose:** Animation utilities for Tailwind CSS
**Problem Solved:** Easy animation patterns without custom CSS
**Why FlowOS Needs It:** Provides common animation patterns for micro-interactions
**Benefits:**
- Tailwind integration
- Common animation patterns
- Performance optimized
**Trade-offs:**
- Limited customization
- Additional CSS bundle
**Dependencies:** Tailwind CSS
**Recommended Phase:** Phase 1 (Implemented)
**Status:** Implemented
**Implementation Notes:** Used sparingly for essential micro-interactions

## Development Dependencies

### TypeScript
**Purpose:** Type safety and developer experience
**Problem Solved:** Catch errors at compile time, improve IDE support, enable safer refactoring
**Why FlowOS Needs It:** Essential for maintainable codebase and team productivity
**Benefits:**
- Type safety
- Better IDE support
- Safer refactoring
- Self-documenting code
**Trade-offs:**
- Initial learning curve
- Build time overhead
**Dependencies:** None
**Recommended Phase:** Phase 1 (Implemented)
**Status:** Implemented
**Implementation Notes:** Strict type checking enabled; database types generated from Supabase

### Tailwind CSS v4
**Purpose:** Utility-first CSS framework
**Problem Solved:** Rapid UI development with consistent design system
**Why FlowOS Needs It:** Enables fast, consistent UI development with design tokens
**Benefits:**
- Utility-first approach
- Design system integration
- Performance optimized
- Customizable
**Trade-offs:**
- Large HTML class strings
- Learning curve for team
**Dependencies:** PostCSS
**Recommended Phase:** Phase 1 (Implemented)
**Status:** Implemented
**Implementation Notes:** v4 with custom design tokens and semantic color system

### ESLint
**Purpose:** JavaScript/TypeScript linting
**Problem Solved:** Code quality and consistency across codebase
**Why FlowOS Needs It:** Ensures code quality and catches common errors
**Benefits:**
- Code quality enforcement
- Consistent code style
- Catches common errors
- Configurable rules
**Trade-offs:**
- Configuration complexity
- False positives
**Dependencies:** TypeScript
**Recommended Phase:** Phase 2 (Implemented)
**Status:** Implemented
**Implementation Notes:** Uses Next.js ESLint config; may be enhanced with custom rules

### Vitest
**Purpose:** Unit testing framework
**Problem Solved:** Fast unit testing with TypeScript support
**Why FlowOS Needs It:** Modern, fast testing with excellent TypeScript integration
**Benefits:**
- Fast execution
- TypeScript support
- Jest-compatible API
- Watch mode
**Trade-offs:**
- Newer ecosystem (fewer plugins)
**Dependencies:** TypeScript
**Recommended Phase:** Phase 2 (Implemented - needs active usage)
**Status:** Implemented (Active usage pending)
**Implementation Notes:** Currently in package.json but not actively used; should be adopted for critical paths

### shadcn
**Purpose:** Component library tooling
**Problem Solved:** Copy-paste component patterns with Radix UI and Tailwind
**Why FlowOS Needs It:** Accelerates component development with accessible patterns
**Benefits:**
- Accessible components
- Tailwind integration
- Copy-paste approach
- Customizable
**Trade-offs:**
- Not a true library (copy-paste)
- Maintenance burden for copied components
**Dependencies:** Radix UI, Tailwind CSS
**Recommended Phase:** Phase 1 (Implemented)
**Status:** Implemented
**Implementation Notes:** Used as component pattern source; components customized for FlowOS design system

---

# Proposed Technologies

## Phase 1 — Core Foundation (NOW)

### Zod
**Purpose:** TypeScript-first schema validation
**Problem Solved:** Runtime type validation, form validation, API response validation
**Why FlowOS Needs It:** Critical for data integrity across forms, APIs, and AI outputs. Provides type-safe validation without runtime overhead.
**Benefits:**
- TypeScript-first design
- Excellent performance
- Comprehensive validation
- Great error messages
- Integration with React Hook Form
**Trade-offs:**
- Learning curve for complex schemas
- Additional bundle size
**Dependencies:** TypeScript
**Recommended Phase:** Phase 1 (NOW)
**Status:** Planned
**Implementation Notes:** Integrate with React Hook Form for form validation; use for API response validation and AI output validation

### React Hook Form
**Purpose:** Performant React form management
**Problem Solved:** Efficient form state management with minimal re-renders
**Why FlowOS Needs It:** Current useState-based forms don't scale. Critical for auth, habits, tasks, settings, and reflection forms.
**Benefits:**
- Excellent performance
- Small bundle size
- Better developer experience
- Built-in validation
- TypeScript support
**Trade-offs:**
- Learning curve for team
- Migration effort for existing forms
**Dependencies:** React
**Recommended Phase:** Phase 1 (NOW)
**Status:** Planned
**Implementation Notes:** Integrate with Zod for validation; migrate existing forms incrementally starting with auth forms

### date-fns
**Purpose:** Modern JavaScript date utility library
**Problem Solved:** Date manipulation, formatting, and timezone handling
**Why FlowOS Needs It:** FlowOS is time-centric (focus sessions, schedules, habits, reflections). Native Date API is painful for timezones and formatting.
**Benefits:**
- Immutable operations
- Timezone support
- Tree-shakeable
- Excellent documentation
- Modular design
**Trade-offs:**
- Different API than native Date
- Learning curve for team
**Dependencies:** None
**Recommended Phase:** Phase 1 (NOW)
**Status:** Planned
**Implementation Notes:** Replace all native Date operations; establish patterns for timezones, formatting, and calculations

## Phase 2 — Development Quality (LATER)

### Vitest Active Usage
**Purpose:** Active unit testing implementation
**Problem Solved:** Currently in package.json but not actively used
**Why FlowOS Needs It:** Need comprehensive unit test coverage for critical business logic
**Benefits:**
- Fast test execution
- Catch regressions early
- Document expected behavior
**Trade-offs:**
- Test maintenance overhead
- Initial setup effort
**Dependencies:** TypeScript
**Recommended Phase:** Phase 2 (LATER)
**Status:** Implemented (Active usage pending)
**Implementation Notes:** Start with critical business logic (schedule computation, focus timer logic); aim for 80% coverage on core paths

### ESLint Improvements
**Purpose:** Enhanced code quality enforcement
**Problem Solved:** Current ESLint config is basic; needs custom rules for FlowOS patterns
**Why FlowOS Needs It:** Enforce code quality and catch common issues specific to FlowOS patterns
**Benefits:**
- Consistent code style
- Catch common errors
- Enforce best practices
**Trade-offs:**
- Configuration complexity
**Dependencies:** TypeScript, ESLint
**Recommended Phase:** Phase 2 (LATER)
**Status:** Planned
**Implementation Notes:** Add custom rules for FlowOS patterns; integrate with pre-commit hooks

### Husky
**Purpose:** Git hooks for quality checks
**Problem Solved:** Automate quality checks before commits
**Why FlowOS Needs It:** Ensure code quality standards are enforced automatically
**Benefits:**
- Automated quality gates
- Prevent bad commits
- Consistent standards
**Trade-offs:**
- Additional setup complexity
**Dependencies:** Git, Node.js
**Recommended Phase:** Phase 2 (LATER)
**Status:** Planned
**Implementation Notes:** Configure pre-commit hooks for linting and test execution

### lint-staged
**Purpose:** Run linters on staged files only
**Problem Solved:** Efficient pre-commit linting
**Why FlowOS Needs It:** Speed up pre-commit hooks by only checking changed files
**Benefits:**
- Faster pre-commit hooks
- Efficient resource usage
**Trade-offs:**
- Additional configuration
**Dependencies:** Husky
**Recommended Phase:** Phase 2 (LATER)
**Status:** Planned
**Implementation Notes:** Configure with Husky for efficient pre-commit workflow

## Phase 3 — Feature Maturity (LATER)

### Playwright
**Purpose:** End-to-end testing framework
**Problem Solved:** Test critical user flows across the application
**Why FlowOS Needs It:** Essential for testing auth, focus sessions, task completion, and other critical flows
**Benefits:**
- Real browser testing
- Cross-browser support
- Excellent debugging
- Visual regression testing
**Trade-offs:**
- Test maintenance overhead
- Slower execution than unit tests
**Dependencies:** Node.js
**Recommended Phase:** Phase 3 (LATER)
**Status:** Planned
**Implementation Notes:** Start with critical flows (auth, focus session, task completion); integrate with CI/CD

### TanStack Query
**Purpose:** Server state management
**Problem Solved:** Complex client state management and server synchronization
**Why FlowOS Needs It:** Current Supabase direct calls work, but may need advanced caching and synchronization as complexity grows
**Benefits:**
- Automatic caching
- Background updates
- Optimistic updates
- DevTools integration
**Trade-offs:**
- Additional complexity
- Learning curve
**Dependencies:** React
**Recommended Phase:** Phase 3 (LATER)
**Status:** Deferred
**Implementation Notes:** Add only when client state complexity justifies it; current Supabase direct calls may be sufficient

### nuqs
**Purpose:** Type-safe URL query state management
**Problem Solved:** Type-safe URL state for filters, pagination, and view parameters
**Why FlowOS Needs It:** Better URL state management for task filtering, focus history views, and other URL-driven features
**Benefits:**
- Type-safe URL params
- Server components support
- Excellent TypeScript integration
**Trade-offs:**
- Additional dependency
**Dependencies:** Next.js
**Recommended Phase:** Phase 3 (LATER)
**Status:** Planned
**Implementation Notes:** Add when URL state becomes complex; start with task filtering and focus history

### cmdk
**Purpose:** Command palette component
**Problem Solved:** Quick navigation and actions through keyboard interface
**Why FlowOS Needs It:** Improve UX with command palette similar to Linear/Raycast for power users
**Benefits:**
- Enhanced productivity
- Keyboard-first navigation
- Quick actions
**Trade-offs:**
- Additional complexity
**May not be used by all users
**Dependencies:** React
**Recommended Phase:** Phase 3 (LATER)
**Status:** Planned
**Implementation Notes:** Add during UX polish phase; ensure it provides clear value over existing navigation

## Phase 4 — Production Readiness (LATER)

### Sentry
**Purpose:** Error tracking and performance monitoring
**Problem Solved:** Production error monitoring and performance insights
**Why FlowOS Needs It:** Critical for production reliability and debugging user issues
**Benefits:**
- Real-time error tracking
- Performance monitoring
- Release tracking
- Issue assignment
**Trade-offs:**
- Cost at scale
- Configuration complexity
**Dependencies:** None (SaaS)
**Recommended Phase:** Phase 4 (LATER)
**Status:** Planned
**Implementation Notes:** Add pre-launch; configure with appropriate sampling and filtering to avoid noise

## Phase 5 — Growth & Scale (FUTURE)

### Fuse.js
**Purpose:** Fast fuzzy search library
**Problem Solved:** Advanced search capabilities for tasks, knowledge, and notes
**Why FlowOS Needs It:** Better search when FlowOS has substantial content and user base
**Benefits:**
- Fast fuzzy search
- Configurable scoring
- Lightweight
**Trade-offs:**
- Not needed until content volume justifies it
**Dependencies:** None
**Recommended Phase:** Phase 5 (FUTURE)
**Status:** Deferred
**Implementation Notes:** Add when search becomes priority and basic filtering is insufficient

### framer-motion
**Purpose:** Animation library for React
**Problem Solved:** Complex animations and transitions
**Why FlowOS Needs It:** Enhanced UX polish for specific interactions
**Benefits:**
- Declarative animations
- Gestures support
- Excellent performance
**Trade-offs:**
- Bundle size
- Complexity
**Dependencies:** React
**Recommended Phase:** Phase 5 (FUTURE)
**Status:** Deferred
**Implementation Notes:** Use sparingly for specific high-value animations only; avoid decorative animations

### PostHog
**Purpose:** Product analytics
**Problem Solved:** User behavior analytics and product insights
**Why FlowOS Needs It:** Understand user behavior and optimize product based on real usage data
**Benefits:**
- User analytics
- Funnel analysis
- Feature usage tracking
**Trade-offs:**
- Cost at scale
- Privacy considerations
**Dependencies:** None (SaaS)
**Recommended Phase:** Phase 5 (FUTURE)
**Status:** Deferred
**Implementation Notes:** Add when real users justify analytics investment; ensure privacy compliance

---

# Integration Workflow

Before introducing any new technology to FlowOS, follow this 10-step process:

## 1. Identify the Problem
Clearly define the specific problem that the technology solves. Document:
- Current pain points
- Impact on users or developers
- Why existing solutions are insufficient

## 2. Verify Current Solution
Evaluate whether current technologies can solve the problem:
- Review existing stack
- Identify gaps or limitations
- Consider workarounds or improvements to current approach

## 3. Evaluate Alternatives
Research and compare alternatives:
- Multiple technology options
- Open source vs commercial
- Maintenance and community support
- Alignment with FlowOS architecture

## 4. Justify the Dependency
Make the case for adoption:
- Clear benefits over alternatives
- Measurable success criteria
- Cost-benefit analysis
- Long-term maintenance considerations

## 5. Document in Masterplan
Add comprehensive documentation to this masterplan:
- Complete library documentation template
- Phase recommendation
- Integration considerations
- Success criteria

## 6. Founder Approval
Submit to Founder for approval:
- Present problem and solution
- Demonstrate due diligence
- Highlight risks and trade-offs
- Request approval for phase

## 7. Architecture Review
Review with relevant domain architects:
- Client Architecture (for UI libraries)
- Data Architecture (for data technologies)
- Integration Architecture (for external services)
- Quality Architecture (for testing tools)
- Operations Architecture (for infrastructure)

## 8. Implementation
Execute integration according to plan:
- Follow phased approach
- Implement incrementally
- Document patterns and gotchas
- Update relevant architecture documents

## 9. Documentation Update
Update all relevant documentation:
- This masterplan (status change)
- Technical Architecture (if implementation facts change)
- Domain architecture documents
- Component documentation
- Runbooks and guides

## 10. Production Review
Review after production deployment:
- Validate success criteria
- Monitor performance impact
- Assess maintenance burden
- Document lessons learned

---

# Maintenance Rules

This document must evolve with FlowOS. Follow these maintenance rules:

## Never Delete Historical Decisions
- Mark technologies as Deprecated instead of deleting
- Preserve decision rationale for future reference
- Include deprecation date and migration path

## Mark Technologies as Deprecated
When a technology is no longer needed:
- Mark status as Deprecated
- Document migration path
- Set removal timeline
- Update dependent systems

## New Technologies Must Be Evaluated Here First
- No technology adoption without masterplan entry
- Follow integration workflow before implementation
- Founder approval required before phase integration

## Periodic Review of Existing Technologies
- Review technologies annually or when major version changes occur
- Assess whether technology still provides value
- Consider newer alternatives
- Update phase assignments if maturity changes

## Avoid Duplicate Technologies
- Before adding new technology, verify no existing solution
- Evaluate whether existing technology can be extended
- Prefer consolidation over fragmentation

## Update Last Updated Date
- Update Last Updated date on any substantive change
- Document what changed and why
- Maintain change history for major decisions

---

# Final Recommendations

## Current Technology Assessment

### Strengths
- Modern, well-chosen core stack (Next.js, React, Supabase)
- Good use of utility libraries (Tailwind, dnd-kit, base-ui)
- Appropriate use of analytics (Vercel analytics)
- Strong TypeScript adoption

### Areas for Improvement
- Form management is standardized for the Phase 1.5 auth and retained Task pilot; remaining forms require scoped migration.
- Date/time validity is standardized at the Phase 1.5 boundary; remaining native Date operations require semantic review.
- Testing infrastructure needs activation (Vitest)
- Code quality tooling needs enhancement (ESLint, Husky, lint-staged)

## Phase 1.5 Implementation Status — 2026-08-05

The approved Phase 1.5 packages are now present in `package.json` and `package-lock.json`:

- `zod` `^4.4.3`
- `react-hook-form` `^7.84.0`
- `@hookform/resolvers` `^5.7.1`
- `date-fns` `^4.4.0`

The recovered implementation establishes shared validation contracts, migrates login/registration and the retained Task dialog, validates task writes after `requireUserId`, rejects impossible date keys, and provides durable reflection/Focus recovery. Remaining native-Date migration, full live-form coverage, authenticated accessibility evidence, and audit-vulnerability disposition remain open and are not silently admitted as complete.

## Recommended Phase 1 Actions (Phase 1.5 of MVP Masterplan)

### Priority 1: React Hook Form + Zod
- ~~Install `react-hook-form`, `zod`, `@hookform/resolvers`~~ — complete and recorded above
- ~~Migrate auth forms first (login, register)~~ — complete; authenticated manual evidence remains
- ~~Establish patterns for form validation~~ — complete for auth and the retained Task dialog
- Document the pattern for future features without broadening the current phase

### Priority 2: date-fns
- ~~Install `date-fns`~~ — complete and recorded above
- Keep native Date operations in focus/session and schedule paths until semantic boundary tests authorize each migration
- ~~Establish timezone handling patterns~~ — `Asia/Singapore`, date-only keys, wall-clock values, and persisted instants are documented
- ~~Document date/time patterns~~ — see `docs/current-phase/phase-1.5/validation-and-date-time-pattern.md`

## Recommended Phase 2 Actions (Development Quality)

### Priority 1: Activate Vitest
- Set up test configuration
- Write tests for critical business logic
- Aim for 80% coverage on core paths
- Integrate with CI/CD

### Priority 2: Enhance ESLint
- Add custom rules for FlowOS patterns
- Enforce stricter type checking
- Add performance rules
- Configure with pre-commit hooks

### Priority 3: Add Husky + lint-staged
- Set up pre-commit hooks
- Configure lint-staged for efficient checks
- Automate quality enforcement
- Document Git workflow

## Recommended Phase 3 Considerations

### TanStack Query Evaluation
- Monitor client state complexity
- Evaluate whether Supabase direct calls remain sufficient
- Defer until clear caching/sync needs emerge

### cmdk Integration
- Evaluate command palette value during UX polish
- Consider user power user patterns
- Add if keyboard-first navigation is strategic

## Architecture Alignment Recommendations

### Maintain Separation of Concerns
- Keep this masterplan focused on technology decisions
- Reference domain architecture documents for implementation details
- Avoid duplicating information from Technical Architecture

### Coordinate with Domain Architects
- Client Architecture should approve UI libraries
- Data Architecture should approve data technologies
- Integration Architecture should approve external services
- Quality Architecture should approve testing tools
- Operations Architecture should approve infrastructure

### Regular Review Schedule
- Review this masterplan quarterly
- Update phase assignments as FlowOS matures
- Reassess deferred technologies
- Remove deprecated technologies after migration

## Integration Process Improvements

### Create Technology Proposal Template
- Standardize technology evaluation requests
- Ensure required information is captured
- Streamline approval process

### Establish Technology Review Board
- Include Engineering Architect and relevant domain architects
- Regular review of proposed technologies
- Ensure architectural alignment

### Document Success Criteria
- Define measurable success for each technology
- Review post-implementation
- Validate expected benefits were realized

---

This masterplan is the permanent engineering technology roadmap for FlowOS. All technology decisions must be documented here before implementation. The phased approach ensures technology adoption aligns with FlowOS maturity and provides measurable value at each stage.
