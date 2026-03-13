# Implementation Plan: Skill Matrix Module (ITP)

**Branch**: `001-skill-matrix` | **Date**: 2026-03-13 | **Spec**: `specs/001-skill-matrix/spec.md`  
**Input**: Feature specification from `specs/001-skill-matrix/spec.md`

## Summary

Build a Skill Matrix module inside the ITP platform to capture, validate, and analyze employee skills across the organization.
The module supports employee self-assessment, evidence submission, Manager/HR-led validation, taxonomy administration, and organization analytics
(gap analysis, heatmaps, team capability reporting) including auditable CSV/PDF exports.

## Design References (Wireframes)

Wireframes are linked per user story in `specs/001-skill-matrix/spec.md`. For quick reference:

- Employee skill profile: [Figma — My Skill Profile](https://www.figma.com/design/5zpVONvOAtPCncj4GRuc70/ITP---Skill-Matrix?node-id=1-785&t=cVJtNUfO8KKZcpT5-0)
- Manager validation: [Figma — Skill Validation](https://www.figma.com/design/5zpVONvOAtPCncj4GRuc70/ITP---Skill-Matrix?node-id=1-1243&t=cVJtNUfO8KKZcpT5-0)
- HR/Admin taxonomy: [Figma — Skill Taxonomy](https://www.figma.com/design/5zpVONvOAtPCncj4GRuc70/ITP---Skill-Matrix?node-id=1-395&t=cVJtNUfO8KKZcpT5-0)
- Leadership analytics: [Figma — Skill Analytics Dashboard](https://www.figma.com/design/5zpVONvOAtPCncj4GRuc70/ITP---Skill-Matrix?node-id=1-1984&t=cVJtNUfO8KKZcpT5-0), [Figma — Skill Matrix Dashboard](https://www.figma.com/design/5zpVONvOAtPCncj4GRuc70/ITP---Skill-Matrix?node-id=1-5&t=cVJtNUfO8KKZcpT5-0)
- Project allocation & development: [Figma — Project Skill Matching](https://www.figma.com/design/5zpVONvOAtPCncj4GRuc70/ITP---Skill-Matrix?node-id=1-2488&t=cVJtNUfO8KKZcpT5-0), [Figma — Learning & Development](https://www.figma.com/design/5zpVONvOAtPCncj4GRuc70/ITP---Skill-Matrix?node-id=1-3036&t=cVJtNUfO8KKZcpT5-0)

## Technical Context

**Language/Version**: C# (.NET 8 LTS), TypeScript (React 18)  
**Primary Dependencies**: ASP.NET Core Web API, Entity Framework Core, MySQL provider; React, React Router  
**Storage**: MySQL (primary system of record)  
**Testing**: Backend: xUnit + FluentAssertions; Frontend: Vitest/Jest + React Testing Library; Contract tests for HTTP APIs  
**Target Platform**: Web application (ITP platform)  
**Project Type**: Web app (frontend SPA + backend web service)  
**Performance Goals**: Core reads/writes (profile/validation) feel instant; reporting/analytics remain responsive; exports run asynchronously for large scopes  
**Constraints**: No cross-module direct DB access; RBAC via existing ITP roles; team-only employee visibility (no org-wide directory by default); export actions audit-logged; validations expire (default 12 months)  
**Scale/Scope**: Organization-wide skill catalog and employee profiles; team-to-org analytics and drilldowns; audit/history retained for workforce planning

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Structured Skill Taxonomy**: Category → Subcategory → Skill enforced; definitions required; skills are versioned/archived (not deleted).
- **II. Evidence-Based Skill Validation**: Validation states are explicit; Manager/HR are final authority; evidence is captured; expiry/revalidation supported.
- **III. User-Centric Experience**: Persona-specific workflows (employee/manager/admin/leadership) are first-class; accessibility is planned as a requirement.
- **IV. Actionable Analytics**: Heatmaps, gap analysis, drilldowns, and exports are supported and scoped by permissions.
- **V. Security & Data Privacy**: Uses ITP RBAC; employees can read their own profile; team-only peer visibility; exports are audit-logged.
- **VI. Platform Integration**: Cross-module exchange happens via APIs/events; no direct DB coupling; contracts are versioned.

**Gate result (pre-research)**: PASS (no constitution violations identified).

## Project Structure

### Documentation (this feature)

```text
specs/001-skill-matrix/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
├── checklists/
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── SkillMatrix.Api/
│   ├── SkillMatrix.Application/
│   ├── SkillMatrix.Domain/
│   └── SkillMatrix.Infrastructure/
└── tests/
    ├── SkillMatrix.UnitTests/
    ├── SkillMatrix.IntegrationTests/
    └── SkillMatrix.ContractTests/

frontend/
├── src/
│   ├── app/
│   ├── features/skill-matrix/
│   ├── services/
│   └── shared/
└── tests/
```

**Structure Decision**: Web application split into `frontend/` (React SPA) and `backend/` (ASP.NET Core Web API), with a modular backend
(Api/Application/Domain/Infrastructure) to keep domain logic isolated, testable, and aligned with platform integration constraints.

## Complexity Tracking

No constitution violations identified; no complexity exceptions required.
