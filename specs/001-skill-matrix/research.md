# Research: Skill Matrix Module (ITP)

**Branch**: `001-skill-matrix`  
**Date**: 2026-03-11  
**Spec**: `specs/001-skill-matrix/spec.md`

## Decisions

### 1) Architecture boundary

- **Decision**: Implement as an ITP module within the existing platform web stack: React SPA + ASP.NET Core Web API + MySQL.
- **Rationale**: Matches the platform’s web architecture, enables shared RBAC/identity, and keeps integration points explicit via APIs/events.
- **Alternatives considered**:
  - Separate microservice: higher operational overhead and slower iteration for a first module cut.

### 2) Domain ownership and integration approach

- **Decision**: Skill Matrix owns taxonomy, employee skill profiles, validations, and analytics read models; it integrates with employee profiles, projects, performance reviews, and learning programs via **published APIs** and **domain events** (no direct DB coupling).
- **Rationale**: Aligns with Constitution Principle VI (contracts + event-driven state changes) and reduces blast radius.
- **Alternatives considered**:
  - Shared DB tables across modules: violates constitution and increases coupling.

### 3) Skill taxonomy invariants

- **Decision**: Enforce **Category → Subcategory → Skill** with Subcategory always present (use “General” for non-splitting categories).
- **Rationale**: Keeps reporting and navigation consistent; supports future expansion without schema churn.
- **Alternatives considered**:
  - Optional subcategories: adds edge cases to analytics filters and UI navigation.

### 4) Validation authority and evidence handling

- **Decision**: Manager/HR are the only actors who can set status to **Validated**; peer endorsements and system insights are **evidence inputs** only. Validations expire after a configurable period (default 12 months).
- **Rationale**: Maintains auditability and trust; avoids “validated by popularity” dynamics; aligns with constitution’s evidence-based validation principle.
- **Alternatives considered**:
  - Auto-validation after peer threshold: weaker governance and higher risk of inflated skills.

### 5) Conflicting ratings resolution

- **Decision**: For matching/analytics, the **active proficiency** is the most recent Manager/HR validated proficiency. Other ratings remain visible as inputs.
- **Rationale**: Prevents inconsistent decision-making across modules while preserving transparency.

### 6) Analytics strategy

- **Decision**: Separate transactional reads/writes from analytics by using read-optimized queries and (where needed) materialized/denormalized reporting tables updated via jobs and/or events.
- **Rationale**: Keeps transactional flows fast (profile updates/validation) and supports richer reporting (heatmaps, gap analysis) without degrading core UX.
- **Alternatives considered**:
  - Live joins over transactional tables for all analytics: risks slow queries at org scale.

### 7) Export strategy

- **Decision**: CSV/PDF exports are generated through an export workflow that is auditable (who/when/scope/count). Exports should be asynchronous for large scopes.
- **Rationale**: Meets security/audit expectations and avoids timeouts for org-wide exports.

### 8) Authorization model

- **Decision**: Use ITP’s existing authentication + RBAC model. Skill Matrix introduces no parallel permissions system. Peer visibility is team-scoped (no org-wide directory by default).
- **Rationale**: Aligns with Constitution Principle V (RBAC and privacy) and the clarification outcome.

### 9) Eventing and reliability pattern

- **Decision**: Emit domain events for cross-module triggers (e.g., skill validated, skill changed, skill request approved, required-skill definitions changed). Use an outbox pattern to ensure reliable publication.
- **Rationale**: Ensures correctness under failure and aligns with event-driven integration expectations.

## Open Items (resolved with defaults in this plan)

These items are treated as defaults for planning and can be refined during implementation without changing
the spec’s functional intent:

- **API versioning**: Use platform-standard versioning (e.g., `/v1/...`) and additive evolution by default.
- **UI routing conventions**: Route skill matrix under an ITP module path (e.g., `/skill-matrix/...`).
- **Background jobs**: Use the platform’s existing scheduler/worker pattern for exports and read-model refresh.

