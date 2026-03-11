# Implementation Plan: Skill Matrix Module (ITP)

**Branch**: `001-skill-matrix` | **Date**: 2026-03-11 | **Spec**: `specs/001-skill-matrix/spec.md`
**Input**: Feature specification from `specs/001-skill-matrix/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a Skill Matrix module inside the ITP platform to capture, validate, and analyze employee skills
across the organization. The solution will use a React SPA for user workflows, an ASP.NET Core Web API
for business logic and integrations, and MySQL for persistence. Skill validation is Manager/HR-led
(peer endorsements and system insights are evidence inputs), with analytics for gap analysis, heatmaps,
team capability reporting, and export.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: C# (.NET 8 LTS), TypeScript (React 18)  
**Primary Dependencies**: ASP.NET Core Web API, Entity Framework Core, MySQL provider; React, React Router  
**Storage**: MySQL (primary system of record)  
**Testing**: Backend: xUnit + FluentAssertions; Frontend: Vitest/Jest + React Testing Library; Contract tests for HTTP APIs  
**Target Platform**: Web application (ITP platform), Windows/Linux hosting for API  
**Project Type**: Web app (frontend SPA + backend web service)  
**Performance Goals**: Fast interactive UX; core reads/writes p95 < 200ms for profile/validation; reporting p95 < 2s  
**Constraints**: No cross-module direct DB access; RBAC via existing ITP roles; export actions audit-logged  
**Scale/Scope**: Organization-wide skill catalog; team-to-org reporting; history/audit retained for workforce planning

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Structured Skill Taxonomy**: Plan enforces Category → Subcategory → Skill; skills are versioned/archived; definitions required.
- **II. Evidence-Based Skill Validation**: Validation states are explicit; Manager/HR are final authority; evidence is mandatory for validation; expiry/revalidation supported.
- **III. User-Centric Experience**: React SPA flows designed for employees/managers/admin/leadership; bulk manager operations included; accessibility planned (WCAG AA).
- **IV. Actionable Analytics**: Reports include drill-down by scope, skill gap analysis, heatmaps, exports (CSV/PDF), and are tied to staffing/development actions.
- **V. Security & Data Privacy**: Uses ITP RBAC; employee self-access preserved; team-only peer visibility; exports are audit-logged; history retained.
- **VI. Platform Integration**: Integrates with existing modules via APIs/events; no direct DB coupling; versioned contracts; adapter pattern for external/LMS/HR systems.

**Gate result (pre-research)**: PASS (no constitution violations identified).

## Project Structure

### Documentation (this feature)

```text
specs/001-skill-matrix/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
backend/
├── src/
│   ├── SkillMatrix.Api/              # Controllers, auth, request/response models
│   ├── SkillMatrix.Application/      # Use-cases, orchestration, DTOs
│   ├── SkillMatrix.Domain/           # Entities, value objects, domain events
│   └── SkillMatrix.Infrastructure/   # EF Core, MySQL, integrations, outbox
└── tests/
    ├── SkillMatrix.UnitTests/
    ├── SkillMatrix.IntegrationTests/
    └── SkillMatrix.ContractTests/

frontend/
├── src/
│   ├── app/                        # routing + app shell
│   ├── features/skill-matrix/      # pages, components, hooks, state
│   ├── services/                   # API clients, contracts, auth helpers
│   └── shared/                     # shared UI primitives/utilities
└── tests/
    ├── unit/
    └── integration/
```

**Structure Decision**: Web application split into `frontend/` (React SPA) and `backend/` (ASP.NET Core Web API),
with a modular backend (Api/Application/Domain/Infrastructure) to keep domain logic isolated and testable.

## Complexity Tracking

No constitution violations identified; no complexity exceptions required.
