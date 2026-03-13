---
 
description: "Task list for Skill Matrix module implementation"
---
 
# Tasks: Skill Matrix Module (ITP)
 
**Input**: Design documents from `specs/001-skill-matrix/`  
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`  
 
**Tests**: Tests are OPTIONAL. This tasks list focuses on implementation and manual validation checkpoints.
 
**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.
 
## Format: `[ID] [P?] [Story] Description`
 
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Every task includes an exact file path
 
## Path Conventions
 
- **Web app**: `backend/src/`, `frontend/src/`
 
---
 
## Phase 1: Setup (Shared Infrastructure)
 
**Purpose**: Initialize repository structure and baseline tooling

- [x] T001 Create repo directory skeleton per `specs/001-skill-matrix/plan.md` in `backend/` and `frontend/`
- [x] T002 Initialize .NET solution in `backend/src/SkillMatrix.sln` with projects under `backend/src/SkillMatrix.{Api,Application,Domain,Infrastructure}/`
- [x] T003 Initialize React workspace under `frontend/` and create feature skeleton under `frontend/src/features/skill-matrix/`
- [x] T004 [P] Add backend formatting rules/config (e.g., `.editorconfig`) at `backend/.editorconfig`
- [x] T005 [P] Add frontend lint/format config at `frontend/.eslintrc.*` and `frontend/.prettierrc.*`
- [x] T006 [P] Add local env example files at `backend/.env.example` and `frontend/.env.example`
- [x] T007 [P] Add MySQL local dev compose file at `backend/docker-compose.mysql.yml`
- [ ] T008 [P] Add module README for developers at `specs/001-skill-matrix/README.md` (links to plan/spec/quickstart)
 
---
 
## Phase 2: Foundational (Blocking Prerequisites)
 
**Purpose**: Core infrastructure that MUST be complete before ANY user story work can ship
 
**⚠️ CRITICAL**: No user story work can begin until this phase is complete
 
- [x] T009 Create EF Core persistence baseline in `backend/src/SkillMatrix.Infrastructure/Persistence/SkillMatrixDbContext.cs`
- [x] T010 Create initial migrations folder and migrations runner in `backend/src/SkillMatrix.Infrastructure/Persistence/Migrations/`
- [x] T011 Implement ITP auth integration + RBAC policies in `backend/src/SkillMatrix.Api/Auth/AuthorizationPolicies.cs`
- [x] T012 Implement API error envelope + exception middleware in `backend/src/SkillMatrix.Api/Middleware/ErrorHandlingMiddleware.cs`
- [x] T013 Implement correlation ID + structured logging middleware in `backend/src/SkillMatrix.Api/Middleware/CorrelationIdMiddleware.cs`
- [x] T014 Implement audit logging abstraction in `backend/src/SkillMatrix.Application/Audit/IAuditLogger.cs`
- [x] T015 Implement audit log persistence in `backend/src/SkillMatrix.Infrastructure/Audit/AuditLogger.cs`
- [x] T016 Implement outbox table + publisher abstraction in `backend/src/SkillMatrix.Application/Outbox/IOutboxPublisher.cs`
- [x] T017 Implement outbox persistence + dispatcher in `backend/src/SkillMatrix.Infrastructure/Outbox/OutboxDispatcher.cs`
- [x] T018 Implement event contracts mapping in `backend/src/SkillMatrix.Application/Events/SkillMatrixEventMapper.cs`
- [x] T019 Implement background job hooks for exports/expiry in `backend/src/SkillMatrix.Infrastructure/Jobs/`
- [x] T020 Implement file storage adapter for evidence uploads in `backend/src/SkillMatrix.Infrastructure/Files/EvidenceFileStore.cs`
- [x] T021 Implement base API routing and version prefix in `backend/src/SkillMatrix.Api/Program.cs`
- [x] T022 Implement frontend API client wrapper and error handling in `frontend/src/services/httpClient.ts`
- [x] T023 Implement frontend auth integration wrapper in `frontend/src/services/auth.ts`
- [x] T024 Implement shared frontend types for API payloads in `frontend/src/features/skill-matrix/types/contracts.ts`
- [x] T025 Create foundational database schema migration for core tables in `backend/src/SkillMatrix.Infrastructure/Persistence/Migrations/0001_initial_skill_matrix.sql`
 
**Checkpoint**: Foundation ready — feature work can now proceed by user story
 
---
 
## Phase 3: User Story 1 - Employee creates and maintains skill profile (Priority: P1) MVP
 
**Goal**: Employees can add/update skills, attach evidence, and submit validation requests; statuses are visible.
 
**Independent Test**: From the UI, an employee can add a skill, upload evidence, submit validation, and see status changes.
 
### Implementation for User Story 1
 
- [x] T026 [P] [US1] Implement taxonomy read models in `backend/src/SkillMatrix.Application/Taxonomy/Queries/GetTaxonomyQuery.cs`
- [x] T027 [US1] Implement taxonomy query handler in `backend/src/SkillMatrix.Application/Taxonomy/Queries/GetTaxonomyQueryHandler.cs`
- [x] T028 [US1] Implement `GET /api/v1/skill-matrix/taxonomy` in `backend/src/SkillMatrix.Api/Controllers/TaxonomyController.cs`
 
- [x] T029 [P] [US1] Implement employee skill domain entity in `backend/src/SkillMatrix.Domain/Employees/EmployeeSkill.cs`
- [x] T030 [P] [US1] Implement validation status value object in `backend/src/SkillMatrix.Domain/Validation/ValidationStatus.cs`
- [x] T031 [P] [US1] Implement evidence entity in `backend/src/SkillMatrix.Domain/Evidence/EvidenceItem.cs`
- [x] T032 [US1] Implement employee skill persistence mapping in `backend/src/SkillMatrix.Infrastructure/Persistence/Configurations/EmployeeSkillConfiguration.cs`
- [x] T033 [US1] Implement evidence persistence mapping in `backend/src/SkillMatrix.Infrastructure/Persistence/Configurations/EvidenceItemConfiguration.cs`
 
- [x] T034 [P] [US1] Implement `GET /me/skills` query contract in `backend/src/SkillMatrix.Application/Employees/Queries/GetMySkillsQuery.cs`
- [x] T035 [US1] Implement `GET /me/skills` handler in `backend/src/SkillMatrix.Application/Employees/Queries/GetMySkillsQueryHandler.cs`
- [x] T036 [US1] Implement `GET /api/v1/skill-matrix/me/skills` in `backend/src/SkillMatrix.Api/Controllers/MySkillsController.cs`
 
- [x] T037 [P] [US1] Implement add/update skill command in `backend/src/SkillMatrix.Application/Employees/Commands/UpsertMySkillCommand.cs`
- [x] T038 [US1] Implement add/update skill handler in `backend/src/SkillMatrix.Application/Employees/Commands/UpsertMySkillCommandHandler.cs`
- [x] T039 [US1] Implement `POST /me/skills` and `PATCH /me/skills/{id}` in `backend/src/SkillMatrix.Api/Controllers/MySkillsController.cs`
- [x] T040 [US1] Emit `SkillMatrix.SkillChanged` via outbox in `backend/src/SkillMatrix.Application/Employees/Events/SkillChangedPublisher.cs`
 
- [x] T041 [P] [US1] Implement upload evidence command in `backend/src/SkillMatrix.Application/Evidence/Commands/AddEvidenceCommand.cs`
- [x] T042 [US1] Implement upload evidence handler in `backend/src/SkillMatrix.Application/Evidence/Commands/AddEvidenceCommandHandler.cs`
- [x] T043 [US1] Implement `POST /me/skills/{employeeSkillId}/evidence` in `backend/src/SkillMatrix.Api/Controllers/EvidenceController.cs`
 
- [x] T044 [P] [US1] Implement submit validation request command in `backend/src/SkillMatrix.Application/Validation/Commands/SubmitValidationRequestCommand.cs`
- [x] T045 [US1] Implement submit validation request handler in `backend/src/SkillMatrix.Application/Validation/Commands/SubmitValidationRequestCommandHandler.cs`
- [x] T046 [US1] Implement `POST /me/skills/{employeeSkillId}/validation-requests` in `backend/src/SkillMatrix.Api/Controllers/ValidationRequestsController.cs`
- [x] T047 [US1] Emit `SkillMatrix.ValidationRequested` via outbox in `backend/src/SkillMatrix.Application/Validation/Events/ValidationRequestedPublisher.cs`
 
- [X] T048 [P] [US1] Create Skill Matrix route entry and nav link in `frontend/src/app/routes.tsx`
- [X] T049 [US1] Implement My Skills page in `frontend/src/features/skill-matrix/pages/MySkillsPage.tsx`
- [X] T050 [US1] Implement Add Skill modal and taxonomy picker in `frontend/src/features/skill-matrix/components/AddSkillModal.tsx`
- [X] T051 [US1] Implement skill list + status badges in `frontend/src/features/skill-matrix/components/MySkillsList.tsx`
- [X] T052 [US1] Implement evidence upload UI in `frontend/src/features/skill-matrix/components/EvidenceUploader.tsx`
- [X] T053 [US1] Implement submit-for-validation UI flow in `frontend/src/features/skill-matrix/components/SubmitValidationButton.tsx`
- [X] T054 [US1] Wire US1 API client functions in `frontend/src/features/skill-matrix/services/skillMatrixApi.ts`
 
- [ ] T055 [US1] Manual smoke test: employee add skill, upload evidence, submit validation (per `specs/001-skill-matrix/quickstart.md`)
 
**Checkpoint**: US1 is independently usable by employees and produces validation requests for managers
 
---
 
## Phase 4: User Story 2 - Manager reviews and validates employee skills (Priority: P2)
 
**Goal**: Managers can review requests, approve/modify proficiency with feedback, and trigger employee notifications.
 
**Independent Test**: A manager receives a request, reviews evidence, approves (or modifies), and the employee sees “Validated”.
 
### Implementation for User Story 2
 
- [ ] T056 [P] [US2] Implement manager inbox query in `backend/src/SkillMatrix.Application/Validation/Queries/GetManagerInboxQuery.cs`
- [ ] T057 [US2] Implement manager inbox handler in `backend/src/SkillMatrix.Application/Validation/Queries/GetManagerInboxQueryHandler.cs`
- [ ] T058 [US2] Implement `GET /manager/validation-requests` in `backend/src/SkillMatrix.Api/Controllers/ManagerValidationController.cs`
 
- [ ] T059 [P] [US2] Implement decision command in `backend/src/SkillMatrix.Application/Validation/Commands/DecideValidationRequestCommand.cs`
- [ ] T060 [US2] Implement decision handler (set Validated/Modified/Rejected, set expiry, write audit log) in `backend/src/SkillMatrix.Application/Validation/Commands/DecideValidationRequestCommandHandler.cs`
- [ ] T061 [US2] Implement `POST /manager/validation-requests/{id}/decision` in `backend/src/SkillMatrix.Api/Controllers/ManagerValidationController.cs`
- [ ] T062 [US2] Emit `SkillMatrix.SkillValidated` / `SkillMatrix.ValidationRejected` via outbox in `backend/src/SkillMatrix.Application/Validation/Events/ValidationDecisionPublisher.cs`
 
- [ ] T063 [P] [US2] Implement notification abstraction in `backend/src/SkillMatrix.Application/Notifications/INotificationService.cs`
- [ ] T064 [US2] Implement employee notification on decision in `backend/src/SkillMatrix.Application/Validation/Notifications/ValidationDecisionNotifier.cs`

- [X] T065 [US2] Implement Manager Inbox page in `frontend/src/features/skill-matrix/pages/ManagerInboxPage.tsx`
- [X] T066 [US2] Implement review drawer (evidence preview + feedback) in `frontend/src/features/skill-matrix/components/ValidationReviewDrawer.tsx`
- [X] T067 [US2] Wire manager endpoints in `frontend/src/features/skill-matrix/services/skillMatrixApi.ts`

- [ ] T068 [P] [US2] Implement team skill distribution query in `backend/src/SkillMatrix.Application/Reports/Queries/GetTeamSkillDistributionQuery.cs`
- [ ] T069 [US2] Implement team skill distribution endpoint in `backend/src/SkillMatrix.Api/Controllers/ReportsController.cs`
- [X] T070 [US2] Implement Team Distribution view for managers in `frontend/src/features/skill-matrix/pages/TeamDistributionPage.tsx`

- [ ] T071 [US2] Manual smoke test: manager approves/modifies request and employee sees updated status
 
**Checkpoint**: US2 enables a complete validation loop (employee → manager decision → employee notified)
 
---
 
## Phase 5: User Story 3 - HR/Admin manages taxonomy and proficiency frameworks (Priority: P3)
 
**Goal**: HR/Admin can manage taxonomy/definitions and review employee-submitted new skill requests.
 
**Independent Test**: Admin creates/edits taxonomy and approves a SkillRequest; the new skill becomes selectable.
 
### Implementation for User Story 3
 
- [ ] T072 [P] [US3] Implement taxonomy write commands in `backend/src/SkillMatrix.Application/Taxonomy/Commands/`
- [ ] T073 [US3] Implement taxonomy write endpoints (categories/subcategories/skills) in `backend/src/SkillMatrix.Api/Controllers/AdminTaxonomyController.cs`
- [ ] T074 [P] [US3] Implement proficiency framework management in `backend/src/SkillMatrix.Application/Framework/`
- [ ] T075 [US3] Implement proficiency framework endpoints in `backend/src/SkillMatrix.Api/Controllers/FrameworkController.cs`
 
- [ ] T076 [P] [US3] Implement skill request review commands in `backend/src/SkillMatrix.Application/SkillRequests/Commands/`
- [ ] T077 [US3] Implement skill request admin endpoints in `backend/src/SkillMatrix.Api/Controllers/AdminSkillRequestsController.cs`
- [ ] T078 [US3] Emit `SkillMatrix.SkillRequestDecided` via outbox in `backend/src/SkillMatrix.Application/SkillRequests/Events/SkillRequestEventsPublisher.cs`

- [X] T079 [US3] Implement Admin Taxonomy page in `frontend/src/features/skill-matrix/pages/AdminTaxonomyPage.tsx`
- [X] T080 [US3] Implement Admin Skill Requests queue in `frontend/src/features/skill-matrix/pages/AdminSkillRequestsPage.tsx`
- [X] T081 [US3] Implement taxonomy editor components in `frontend/src/features/skill-matrix/components/TaxonomyEditor.tsx`
- [X] T082 [US3] Wire admin endpoints in `frontend/src/features/skill-matrix/services/skillMatrixApi.ts`

- [ ] T083 [US3] Manual smoke test: admin adds a skill definition and it appears in employee taxonomy picker
- [ ] T084 [US3] Manual smoke test: admin approves a SkillRequest and employee can select the new skill
 
**Checkpoint**: US3 keeps taxonomy consistent and unblocks ongoing skill catalog evolution
 
---
 
## Phase 6: User Story 4 - Leadership views workforce capability analytics (Priority: P4)
 
**Goal**: Leadership can view heatmaps, capability reports, gap analysis, and export results.
 
**Independent Test**: Leadership loads heatmap, drills down to team view, and exports a report.
 
### Implementation for User Story 4
 
- [ ] T085 [P] [US4] Implement report query read models in `backend/src/SkillMatrix.Application/Reports/ReadModels/`
- [ ] T086 [US4] Implement `GET /reports/heatmap` in `backend/src/SkillMatrix.Api/Controllers/ReportsController.cs`
- [ ] T087 [US4] Implement `GET /reports/team-capability` in `backend/src/SkillMatrix.Api/Controllers/ReportsController.cs`
- [ ] T088 [US4] Implement `GET /reports/gaps` (Role/Project/All) in `backend/src/SkillMatrix.Api/Controllers/ReportsController.cs`
 
- [ ] T089 [P] [US4] Implement export job commands/queries in `backend/src/SkillMatrix.Application/Exports/`
- [ ] T090 [US4] Implement `POST /exports` and `GET /exports/{id}` in `backend/src/SkillMatrix.Api/Controllers/ExportsController.cs`
- [ ] T091 [US4] Implement export generation job runner in `backend/src/SkillMatrix.Infrastructure/Jobs/ExportJobRunner.cs`
- [ ] T092 [US4] Ensure export audit logs are written in `backend/src/SkillMatrix.Application/Exports/ExportAudit.cs`

- [X] T093 [US4] Implement Leadership Analytics landing page in `frontend/src/features/skill-matrix/pages/LeadershipDashboardPage.tsx`
- [X] T094 [US4] Implement Heatmap view UI in `frontend/src/features/skill-matrix/components/HeatmapView.tsx`
- [X] T095 [US4] Implement Gap analysis view UI in `frontend/src/features/skill-matrix/components/GapAnalysisView.tsx`
- [X] T096 [US4] Implement export workflow UI in `frontend/src/features/skill-matrix/components/ExportReportButton.tsx`
- [X] T097 [US4] Wire reporting/export endpoints in `frontend/src/features/skill-matrix/services/skillMatrixApi.ts`

- [ ] T098 [US4] Manual smoke test: leadership heatmap drill-down and export CSV/PDF
 
**Checkpoint**: US4 provides organization-level insight dashboards and exportable reporting
 
---
 
## Phase 7: User Story 5 - Skills support project allocation and development workflows (Priority: P5)
 
**Goal**: Skills data supports project matching and gap-driven development actions via platform integrations.
 
**Independent Test**: Project matching returns candidates with filters; gap view shows role/project sources and links to learning programs when available.
 
### Implementation for User Story 5
 
- [ ] T099 [P] [US5] Implement integration client interface for Project Allocation in `backend/src/SkillMatrix.Application/Integrations/ProjectAllocation/IProjectAllocationClient.cs`
- [ ] T100 [US5] Implement Project Allocation adapter in `backend/src/SkillMatrix.Infrastructure/Integrations/ProjectAllocation/ProjectAllocationClient.cs`
- [ ] T101 [P] [US5] Implement integration client interface for Learning & Development in `backend/src/SkillMatrix.Application/Integrations/Learning/ILearningClient.cs`
- [ ] T102 [US5] Implement Learning adapter in `backend/src/SkillMatrix.Infrastructure/Integrations/Learning/LearningClient.cs`
- [ ] T103 [P] [US5] Implement integration client interface for Roles/Job Profiles in `backend/src/SkillMatrix.Application/Integrations/Roles/IRolesClient.cs`
- [ ] T104 [US5] Implement Roles adapter in `backend/src/SkillMatrix.Infrastructure/Integrations/Roles/RolesClient.cs`
 
- [ ] T105 [P] [US5] Implement project matching query in `backend/src/SkillMatrix.Application/Matching/Queries/GetProjectCandidatesQuery.cs`
- [ ] T106 [US5] Implement project matching endpoint in `backend/src/SkillMatrix.Api/Controllers/MatchingController.cs`
- [ ] T107 [US5] Implement gap analysis role/project requirement ingestion (API or event handlers) in `backend/src/SkillMatrix.Infrastructure/Integrations/Requirements/`
 
- [ ] T108 [US5] Ensure events from `specs/001-skill-matrix/contracts/events.md` are emitted from the correct flows in `backend/src/SkillMatrix.Application/Events/`
- [X] T109 [US5] Implement UI entry points from Project Allocation to candidate search results in `frontend/src/features/skill-matrix/pages/ProjectMatchingPage.tsx`
- [X] T110 [US5] Implement learning recommendations panel for gaps in `frontend/src/features/skill-matrix/components/LearningRecommendationsPanel.tsx`
- [X] T111 [US5] Wire matching/integration endpoints in `frontend/src/features/skill-matrix/services/skillMatrixApi.ts`

- [ ] T112 [US5] Manual smoke test: project matching returns candidates and filters by validation status/proficiency
 
**Checkpoint**: US5 makes skills operational for staffing and development workflows
 
---
 
## Phase N: Polish & Cross-Cutting Concerns
 
**Purpose**: Hardening, documentation, performance, and operational readiness
 
- [ ] T113 [P] Add end-to-end documentation updates in `specs/001-skill-matrix/quickstart.md`
- [ ] T114 [P] Add API documentation polish in `specs/001-skill-matrix/contracts/http-api.md`
- [ ] T115 Performance pass: optimize top endpoints (profile read/write, inbox) in `backend/src/SkillMatrix.Infrastructure/Persistence/`
- [ ] T116 Security hardening pass: RBAC review and export audit verification in `backend/src/SkillMatrix.Api/Auth/AuthorizationPolicies.cs`
- [ ] T117 Implement expiry job to transition validated skills to Expired in `backend/src/SkillMatrix.Infrastructure/Jobs/SkillExpiryJob.cs`
- [ ] T118 Implement observability counters for key events in `backend/src/SkillMatrix.Application/Observability/SkillMatrixMetrics.cs`
- [ ] T119 Handle edge cases for taxonomy deprecation/moves in `backend/src/SkillMatrix.Application/Taxonomy/`
- [ ] T120 Run full quickstart smoke test checklist in `specs/001-skill-matrix/quickstart.md`
 
---
 
## Dependencies & Execution Order
 
### Phase Dependencies
 
- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - Stories can proceed sequentially in priority order (US1 → US2 → US3 → US4 → US5)
  - Or in parallel after US1 if teams are split, but keep API/DB ownership clear
- **Polish (Final Phase)**: Depends on the desired user stories being complete
 
### User Story Dependencies
 
- **US1 (P1)**: First deliverable; enables data capture and validation request creation
- **US2 (P2)**: Depends on US1’s validation request flow and evidence upload
- **US3 (P3)**: Depends on foundational schema; can start after US1 for taxonomy governance if needed
- **US4 (P4)**: Depends on US1/US2 producing real data for analytics
- **US5 (P5)**: Depends on US1/US4 data + integration clients for project allocation and learning modules
 
### Parallel Opportunities
 
- Setup tasks marked **[P]** can run in parallel
- Within Phase 2, infra tasks like audit logging/outbox/frontend client wrappers can run in parallel
- After Phase 2, different user stories can be staffed in parallel if API ownership is coordinated
 
---
 
## Parallel Example: User Story 1
 
```bash
# Parallelize backend domain + frontend UI components:
Task: "Implement EmployeeSkill domain entity in backend/src/SkillMatrix.Domain/Employees/EmployeeSkill.cs"
Task: "Implement Add Skill modal in frontend/src/features/skill-matrix/components/AddSkillModal.tsx"
Task: "Implement My Skills page in frontend/src/features/skill-matrix/pages/MySkillsPage.tsx"
```
 
---
 
## Implementation Strategy
 
### MVP First (User Story 1 Only)
 
1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (employee profile + evidence + validation submission)
4. **STOP and VALIDATE**: Run T055 (employee smoke test)
 
### Incremental Delivery
 
1. Ship US1 → validate adoption and data correctness
2. Ship US2 → close the validation loop
3. Ship US3 → enable governance and scale taxonomy safely
4. Ship US4 → deliver leadership reporting and exports
5. Ship US5 → activate integrations for staffing and development workflows