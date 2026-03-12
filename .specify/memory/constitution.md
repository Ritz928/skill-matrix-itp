<!--
==============================================================================
SYNC IMPACT REPORT
==============================================================================
Version change: 1.1.1 → 1.1.2
Bump rationale: PATCH — Clarified approved technology stack in Technical
  Standards & Constraints (React frontend, .NET backend, SQL database).

Modified principles:
  - N/A (wording/structure only)

Added sections:
  - Table of contents

Removed sections:
  - N/A (template placeholders replaced, no sections removed)

Template consistency review:
  ✅ plan-template.md     — "Constitution Check" gate is generic and compatible
                            with all 6 principles; no updates required.
  ✅ spec-template.md     — Mandatory sections (User Scenarios, Requirements,
                            Success Criteria) align with Principles I–VI;
                            no structural changes required.
  ✅ tasks-template.md    — Phase structure (Setup → Foundational → User Story
                            phases → Polish) supports security hardening,
                            integration, and analytics tasks; no updates required.

Deferred TODOs:
  - RATIFICATION_DATE is set to today (2026-03-11) as first authoring date;
    update if a formal governance approval meeting is held on a different date.
  - Integration adapter targets (HR system names, LMS vendor) are left as
    open-ended in Principle VI; specify concrete vendor names when known.
==============================================================================
-->

# Skill Matrix ITP Constitution

## Table of contents

- Core Principles
  - I. Structured Skill Taxonomy (NON-NEGOTIABLE)
  - II. Evidence-Based Skill Validation
  - III. User-Centric Experience
  - IV. Actionable Analytics
  - V. Security & Data Privacy
  - VI. Platform Integration
  - VII. Design & Content Standards
- Technical Standards & Constraints
- Development Workflow & Quality Gates
- Governance

## Core Principles

### I. Structured Skill Taxonomy (NON-NEGOTIABLE)

Skills in the ITP Skill Matrix MUST be organized within a three-tier taxonomy
hierarchy: **Category → Subcategory → Skill**. No skill may exist outside this
taxonomy.

- Every skill MUST have a system-unique identifier, a human-readable name, and a
  plain-language definition.
- Every skill MUST belong to exactly one Subcategory, and every Subcategory MUST
  belong to exactly one Category.
- Proficiency MUST follow the standard four-point ITP scale:
  **Beginner → Intermediate → Advanced → Expert**. Custom scales are
  prohibited unless a formal amendment is approved.
- Skills MUST be versioned. Deprecated skills MUST never be deleted from the
  data store; they MUST be archived and remain visible in historical records
  and audit trails.
- New taxonomy entries (categories, skills) MUST go through a review workflow
  before activation to prevent taxonomy sprawl.

**Rationale**: A consistent, versioned taxonomy is the foundation for every
downstream feature — gap analysis, endorsements, analytics, and integrations
all depend on a stable, shared language for skills.

### II. Evidence-Based Skill Validation

Skill claims are only as valuable as the evidence behind them. Every skill
in a user's profile MUST carry an explicit validation state.

- **Self-assessed** skills MUST be visually distinct from **validated** skills
  in every UI surface and every API response payload; no mixing is permitted.
- A skill MUST be validated through at least one of:
  (a) direct manager endorsement, (b) peer endorsement (minimum two peers),
  or (c) a passed assessment tied to the skill.
- Validation workflows MUST respect ITP's organizational hierarchy; approval
  chains MUST mirror the reporting structure stored in the platform.
- Validations MUST carry an expiry date. When a validation expires, the system
  MUST automatically demote the skill to self-assessed and trigger a
  re-assessment notification to both the employee and their manager.
- Bulk endorsement by managers (for team-wide skills) MUST be supported but
  MUST produce an individual audit record per employee endorsed.

**Rationale**: Unvalidated skill data erodes trust in workforce planning
decisions. The distinction between self-assessed and validated skills must be
enforced at every layer — data, API, and UI — not merely as a display concern.

### III. User-Centric Experience

The Skill Matrix MUST be intuitive for three distinct personas: individual
contributors, managers, and HR administrators. Each persona's primary workflow
MUST be reachable within **three interactions** from the module entry point.

- Skill gap visibility MUST be proactive: the system MUST surface gaps to
  employees without requiring them to navigate to a separate report.
- All interactive components MUST meet **WCAG 2.1 Level AA** accessibility
  standards. Keyboard navigation and screen-reader compatibility are mandatory.
- The module MUST be fully responsive across desktop, tablet, and mobile
  viewports supported by ITP's platform.
- Bulk operations (bulk skill assignment, bulk gap acknowledgement, bulk
  endorsement request) MUST be available in all manager-facing workflows.
- Error messages MUST be actionable: they MUST state what went wrong AND what
  the user should do next. Generic "Something went wrong" messages are
  prohibited in production.

**Rationale**: Adoption of the Skill Matrix depends on low friction. A module
that requires training to navigate or excludes users with accessibility needs
will not achieve the organizational adoption required for accurate data.

### IV. Actionable Analytics

Every metric displayed in the Skill Matrix MUST be tied to a recommended
action or a drill-down path. Vanity metrics with no actionable consequence
MUST NOT be added to dashboards.

- Analytics MUST be available at four aggregation levels:
  **Individual → Team → Department → Organization**.
  Navigating between levels MUST require no more than two interactions.
- Skill gap reports and heatmaps MUST be exportable in **CSV** and **PDF**
  formats. Export scope (individual, team, department, org) MUST be selectable.
- All analytical views MUST reflect data no older than **15 minutes** from the
  current state of the underlying records (near-real-time aggregation).
- Trend data MUST be retained for a minimum of **24 months** to support
  longitudinal workforce planning analysis.
- Analytics queries MUST NOT degrade the performance of transactional
  operations; read replicas or materialized views MUST be used for reporting.

**Rationale**: Analytics that cannot drive decisions waste engineering effort
and erode stakeholder confidence. Near-real-time data and multi-level
aggregation are the minimum bar for the analytics to be trusted in workforce
planning contexts.

### V. Security & Data Privacy

Skill data is sensitive workforce information. Access MUST be controlled
precisely, and data handling MUST meet ITP's existing compliance posture.

- Access to skill profiles MUST be governed by ITP's role-based access
  control (RBAC) model. No module-specific parallel permission system is
  permitted.
- Employees MUST always have **read access** to their own complete skill
  profile, regardless of any organizational configuration.
- Peer visibility of skill data MUST be **opt-in and configurable** by
  organization administrators; the default state MUST be restricted.
- All data exports (reports, CSV downloads, API bulk reads) MUST be
  **audit-logged** with: user identity, timestamp, export scope, and record
  count. Logs MUST be retained for a minimum of **12 months**.
- Skill data MUST be included in ITP's standard data retention and deletion
  (right-to-erasure) workflows. The Skill Matrix MUST honor deletion requests
  within the platform's agreed SLA.
- Secrets (API keys, service credentials) MUST never be committed to source
  control or embedded in application configuration files.

**Rationale**: Skill assessments and proficiency levels can impact promotions,
project assignments, and employee evaluations. Unauthorized access or leakage
of this data carries legal and reputational risk. Security is non-negotiable
and must be designed in, not bolted on.

### VI. Platform Integration

The Skill Matrix is one module within the ITP platform and MUST behave as a
good citizen: it shares data through defined contracts and never creates
hidden couplings.

- All cross-module data exchange MUST occur through **published API contracts**
  (REST or event-based). Direct database access between modules is strictly
  prohibited.
- Published API contracts are **backward compatible by default**. Any
  breaking change requires: (a) a deprecation notice period of at least
  30 days, (b) a versioned migration path, and (c) approval per the amendment
  process in this constitution's Governance section.
- Cross-module state changes (e.g., a role change in the HR module triggering
  skill gap recalculation) MUST use **event-driven communication** (publish/
  subscribe). Polling between modules is prohibited.
- External system integrations (HR information systems, Learning Management
  Systems) MUST use **adapter patterns** to isolate the Skill Matrix's domain
  logic from external schema changes. The Skill Matrix MUST NOT expose its
  internal data model to external consumers directly.
- Integration health MUST be observable: all integration points MUST emit
  structured health metrics consumable by ITP's platform monitoring stack.

**Rationale**: Tight coupling between modules increases blast radius for
failures and makes the platform brittle. Adapter isolation and event-driven
contracts allow the Skill Matrix to evolve independently while remaining a
reliable platform participant.

### VII. Design & Content Standards

The Skill Matrix UI MUST follow a consistent, documented design approach so that
users can learn the module once and confidently use it across workflows and
personas. Design decisions MUST prioritize task completion, accessibility, and
consistency over visual novelty.

#### 1. Design Principles

Core rules that guide UI decisions:

- **Clarity over creativity**: Prefer obvious, readable UI over clever visuals.
- **Consistency over novelty**: Reuse established patterns before inventing new
  ones.
- **Reduce cognitive load**: Minimize choices, avoid unnecessary information,
  and keep layouts predictable.
- **User task > visual decoration**: Decorative elements MUST NOT obstruct or
  slow primary workflows.

#### 2. Design Foundations

Define the base system so the UI stays consistent:

- **Typography**
  - Font family
  - Type scale (H1–H6, Body, Caption)
- **Color system**
  - Primary, Secondary, Accent
  - Success, Warning, Error
  - Neutral palette
  - Usage rules (when to use each color; avoid meaning ambiguity)
- **Spacing system**
  - Fixed spacing scale (e.g., 4, 8, 16, 24, 32)
- **Grid system**
  - Desktop, Tablet, Mobile grid rules

#### 2a. Design references (Figma Site)

These pages are the canonical UI reference for layout, navigation, density, and
visual style. Implementations SHOULD match these references unless a feature
spec explicitly justifies a divergence.

- https://spice-salt-68562254.figma.site/
- https://spice-salt-68562254.figma.site/skill-validation
- https://spice-salt-68562254.figma.site/team-skills
- https://spice-salt-68562254.figma.site/skill-taxonomy
- https://spice-salt-68562254.figma.site/skill-analytics
- https://spice-salt-68562254.figma.site/learning-development
- (optional / may be slow to load) https://spice-salt-68562254.figma.site/employee-skills
- (optional / may be slow to load) https://spice-salt-68562254.figma.site/project-matching

#### 3. UX Patterns

Standard flows MUST be defined and reused so teams do not reinvent interaction
models:

- Empty states (what to do next, not just “no data”)
- Loading states (skeletons/spinners with clear context)
- Error states (actionable guidance and recovery paths)
- Confirmation dialogs (clear impact + primary/secondary actions)
- Search & filters (consistent placement, behavior, and clear/reset actions)

#### 4. Accessibility Rules

Minimum standards in addition to WCAG 2.1 AA:

- Text and essential UI elements MUST meet **4.5:1** contrast ratio minimum.
- Interactive targets MUST be at least **44px** in the smallest dimension where
  feasible.
- All interactive flows MUST support full keyboard navigation with visible focus.
- All form fields MUST have programmatic labels (and accessible error messages).

#### 5. Content Guidelines

Rules for UI text:

- Use **sentence case** for labels and headings (unless a proper noun).
- Buttons MUST use **action verbs** (e.g., “Request endorsement”, “Export CSV”).
- Keep labels short; prefer clarity over internal terminology.

## Technical Standards & Constraints

- **Technology Stack**: The Skill Matrix MUST use **React** for the frontend,
  **.NET (ASP.NET Core)** for the backend, and a **SQL** relational database for
  data persistence.
- **API Design**: All Skill Matrix APIs MUST follow ITP's platform API design
  standards (versioned URL paths, consistent error envelope format, documented
  with OpenAPI 3.x).
- **Data Persistence**: Skill data MUST be stored in ITP's primary relational
  data store. Caching layers (for read-heavy analytics paths) MUST treat the
  relational store as the source of truth.
- **Performance Baselines**: Core API endpoints (skill profile read, skill
  update, endorsement submit) MUST respond within **200ms at p95** under
  normal platform load. Analytics aggregation endpoints MAY target **2s at
  p95** given their query complexity.
- **Observability**: All operations MUST emit structured logs (JSON) with
  correlation IDs. Key business events (skill validated, gap identified,
  export performed) MUST be emitted as platform events for observability
  dashboards.
- **Testing Discipline**: Unit tests are required for all business logic.
  Integration tests are required for all API contracts and cross-module event
  handlers. Test coverage MUST not regress below the baseline established at
  feature delivery.

## Development Workflow & Quality Gates

- **Specification First**: No implementation work begins without an approved
  feature specification (`spec.md`) and implementation plan (`plan.md`).
- **Constitution Check Gate**: Every plan.md MUST include a Constitution Check
  section that explicitly maps the feature's design decisions to the seven
  principles above. Plans with unaddressed constitution conflicts MUST NOT
  advance to implementation.
- **Code Review**: All pull requests require at least one peer review and one
  review from a module owner before merge. Reviews MUST verify constitution
  compliance, not just code correctness.
- **Complexity Justification**: Any deviation from established patterns
  (additional abstraction layers, non-standard data access, custom permission
  logic) MUST be justified in writing in the plan's Complexity Tracking table.
- **Definition of Done**: A feature is done when: code is merged, tests pass,
  accessibility criteria are verified, observability hooks are in place, and
  documentation is updated.

## Governance

This constitution is the authoritative governance document for the Skill Matrix
module of the In Time Pro (ITP) platform. It supersedes any informal conventions,
team agreements, or prior documentation that conflicts with its content.

**Amendment Procedure**:

1. Propose the amendment in writing with: the principle(s) affected, the
   rationale for change, and the impact on existing features.
2. Circulate the proposal to all module stakeholders for a minimum **5-business-
   day review period**.
3. Obtain approval from the module owner and at least one platform architect.
4. Update this document, increment the version per the versioning policy below,
   and update the `LAST_AMENDED_DATE`.
5. Communicate the amendment to all active feature teams and update any
   affected `plan.md` documents.

**Versioning Policy**:

- **MAJOR** (X.0.0): Removal or backward-incompatible redefinition of a
  principle; removal of a mandatory governance section.
- **MINOR** (X.Y.0): Addition of a new principle; material expansion of an
  existing principle's scope or requirements.
- **PATCH** (X.Y.Z): Wording clarifications, typo fixes, non-semantic
  refinements that do not alter intent or requirements.

**Compliance Review**:

- Constitution compliance MUST be reviewed at the start of every feature
  planning cycle via the Constitution Check gate in `plan.md`.
- A full compliance audit MUST be conducted at minimum **once per quarter**,
  covering all features delivered since the last audit.
- Violations discovered during audit MUST be tracked as remediation tasks and
  scheduled within the next sprint cycle.

**Version**: 1.1.2 | **Ratified**: 2026-03-11 | **Last Amended**: 2026-03-12
