# Feature Specification: Skill Matrix Module (ITP)

**Feature Branch**: `001-skill-matrix`  
**Created**: 2026-03-11  
**Status**: Draft  
**Input**: User description: "Create a Skill Matrix module for the In Time Pro (ITP) workforce management platform to capture, track, validate, and analyze employee skills across the organization."

## Clarifications

### Session 2026-03-11

- Q: Should every skill require a subcategory (vs optional)? → A: Yes — Subcategory is required; use a default like “General” when needed.
- Q: What happens when an employee wants a skill not in the taxonomy? → A: Employee submits a new skill request for HR/Admin approval before it becomes selectable.
- Q: Should employees be able to view other employees’ skills? → A: Yes — limited to team-only visibility (no org-wide directory).
- Q: What is the source of “required skills” for gap analysis? → A: Both role/job profiles and project requirements.
- Q: Who has final authority to mark a skill “Validated”? → A: Manager/HR final authority; peer endorsements and system insights are evidence inputs only.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Employee creates and maintains skill profile (Priority: P1)

As an employee, I can add/update skills (within the organization’s taxonomy), set a proficiency level,
attach evidence (certifications, assessments, project experience), and submit changes for validation,
so my profile accurately reflects my capabilities and growth.

**Why this priority**: This is the core data-entry flow; without employee profiles, validation and
analytics have no reliable source of truth.

**Independent Test**: Using only an employee account, I can add a new skill with a proficiency,
attach evidence, submit for validation, and see the skill’s current validation status reflected in my
profile.

**Acceptance Scenarios**:

1. **Given** an employee is signed in and has an empty skill profile, **When** they add a skill from
   the taxonomy with a proficiency level and save it, **Then** the skill appears in their profile as
   "Self-assessed" with the selected level.
2. **Given** an employee has a skill marked "Self-assessed", **When** they upload certification
   evidence and submit for validation, **Then** the skill status becomes "Pending validation" and
   the employee can see what evidence was submitted.
3. **Given** an employee has a skill marked "Validated", **When** they change the proficiency
   level, **Then** the system records the change and the skill returns to "Pending validation" until
   re-approved.

---

### User Story 2 - Manager reviews and validates employee skills (Priority: P2)

As a manager, I can review skill validation requests from my direct and indirect reports, evaluate
submitted evidence, approve the requested proficiency or adjust it, and leave feedback so the team’s
skills data is trusted for staffing and development decisions.

**Why this priority**: Validation is required to create trustworthy organizational visibility and
reduce inflated or inconsistent self-assessments.

**Independent Test**: Using a manager account with at least one report, I can receive a validation
request, review evidence, approve/adjust proficiency, and see the result reflected in both the
employee’s profile and my team view.

**Acceptance Scenarios**:

1. **Given** a manager has a pending skill validation request, **When** they approve it as
   submitted, **Then** the employee’s skill becomes "Validated" at the requested level and the
   employee is notified of the decision.
2. **Given** a manager believes the requested proficiency is too high, **When** they approve with a
   modified level and add feedback, **Then** the employee’s skill becomes "Validated" at the
   manager-set level and the employee sees the feedback.

---

### User Story 3 - HR/Admin manages taxonomy and proficiency frameworks (Priority: P3)

As an HR/Admin user, I can maintain the organization’s skill taxonomy (Category → Subcategory →
Skill), define skill definitions and proficiency frameworks, and control who can edit taxonomy so the
Skill Matrix remains consistent and usable across the organization.

**Why this priority**: A well-managed taxonomy prevents duplication and ensures skills mean the same
thing across departments and time.

**Independent Test**: Using an admin account, I can create a category, subcategory, and skill with
definitions; update a definition; and see the updated taxonomy reflected for employees.

**Acceptance Scenarios**:

1. **Given** an admin is editing taxonomy, **When** they create a new skill with a definition under
   a category and subcategory, **Then** employees can select that skill in their profile.
2. **Given** an admin updates a skill definition, **When** employees view that skill in their
   profile, **Then** the updated definition is displayed consistently wherever the skill appears.

---

### User Story 4 - Leadership views workforce capability analytics (Priority: P4)

As leadership, I can view skill distributions, gaps, and heatmaps at organization levels so I can
make strategic decisions about hiring, training investments, and project staffing.

**Why this priority**: Organizational value is unlocked when the platform can translate skill data
into workforce insights and actions.

**Independent Test**: Using a leadership account, I can open a heatmap for a department, drill down
to teams, and export a team capability report.

**Acceptance Scenarios**:

1. **Given** leadership selects an organizational unit, **When** they view the skill heatmap,
   **Then** they can see distribution by proficiency and whether skills are self-assessed vs
   validated.
2. **Given** leadership is viewing a capability report, **When** they export it, **Then** the system
   provides the export in the available formats and includes only the requested scope.

---

### User Story 5 - Skills support project allocation and development workflows (Priority: P5)

As a manager or HR user, I can use skills data to match people to projects and connect skill gaps to
learning and development actions, so the organization can staff faster and develop targeted
capabilities.

**Why this priority**: Integration turns the Skill Matrix into an operational tool for allocation
and development rather than a static directory.

**Independent Test**: Using project allocation and learning/development entry points, I can view
skill-based matches and gap-driven recommendations without duplicating skill data entry.

**Acceptance Scenarios**:

1. **Given** a project requires a set of skills, **When** a manager searches for candidates,
   **Then** the system returns matches based on validated and self-assessed skills and allows
   filtering by validation status and proficiency.
2. **Given** an employee has a skill gap, **When** they open learning and development programs,
   **Then** they can see recommended learning actions aligned to the gap (where such programs exist
   in the platform).

---

### Edge Cases

- What happens when an employee tries to add a skill that is not in the taxonomy (e.g., a new tool)?
- What happens when a skill is renamed, moved to a different category/subcategory, or deprecated?
- How does the system handle conflicting assessments (self vs manager vs peers) for the same skill?
- How does the system handle evidence uploads that are invalid, expired, or incomplete?
- What happens when an employee has no assigned manager (or manager relationship is missing)?
- What happens when validations expire and the employee does not revalidate?
- What happens when a user lacks permission to view a team/unit but attempts to access reports?

### Test Cases *(derived from scenarios/requirements)*

> These test cases are written to be implementable as manual or automated tests.
> IDs are stable so they can be referenced in QA reports.

#### Employee skill profile

- **TC-EMP-001 — Add first skill**
  - **Preconditions**: Employee is signed in; taxonomy contains at least one skill; profile is empty.
  - **Steps**: Open My Skill Profile → Add skill from taxonomy → Select proficiency → Save.
  - **Expected**: Skill appears in profile with selected proficiency; status is **Self-assessed**.

- **TC-EMP-002 — Submit validation with certification evidence**
  - **Preconditions**: Employee has a **Self-assessed** skill.
  - **Steps**: Open skill → Upload certification evidence → Submit for validation.
  - **Expected**: Status becomes **Pending validation**; submitted evidence is visible to the employee.

- **TC-EMP-003 — Change a validated skill proficiency triggers revalidation**
  - **Preconditions**: Employee has a **Validated** skill.
  - **Steps**: Change proficiency level → Save.
  - **Expected**: Change is recorded; status returns to **Pending validation** until re-approved.

- **TC-EMP-004 — Request a new skill not in taxonomy**
  - **Preconditions**: Employee is signed in; desired skill does not exist in taxonomy.
  - **Steps**: Attempt to add skill → Choose “Request new skill” → Provide name, proposed category/subcategory, definition → Submit.
  - **Expected**: A **SkillRequest** is created; requested skill is **not selectable** in profiles until HR/Admin approves it.

#### Manager validation

- **TC-MGR-001 — Approve validation as submitted**
  - **Preconditions**: Manager has a pending validation request from a report.
  - **Steps**: Open validation queue → Review evidence → Approve.
  - **Expected**: Employee skill becomes **Validated** at requested level; employee is notified; team view reflects the result.

- **TC-MGR-002 — Approve with modified proficiency and feedback**
  - **Preconditions**: Manager has a pending validation request from a report.
  - **Steps**: Open request → Change proficiency level → Add feedback → Approve.
  - **Expected**: Employee skill becomes **Validated** at manager-set level; employee can see the feedback; decision is audit-recorded.

- **TC-MGR-003 — Reject validation request**
  - **Preconditions**: Manager has a pending validation request from a report.
  - **Steps**: Open request → Reject → Provide rationale/feedback.
  - **Expected**: Skill does not become **Validated**; employee is notified of rejection and reason; decision is audit-recorded.

#### HR/Admin taxonomy & proficiency framework

- **TC-ADM-001 — Create category/subcategory/skill with definition**
  - **Preconditions**: HR/Admin user is signed in and has taxonomy edit permission.
  - **Steps**: Create category → Create subcategory → Create skill with definition → Save/publish.
  - **Expected**: Employees can select the new skill in their profiles; definition is visible wherever displayed.

- **TC-ADM-002 — Update skill definition is reflected everywhere**
  - **Preconditions**: Skill exists and is used in at least one employee profile.
  - **Steps**: Update the skill definition → Save.
  - **Expected**: Updated definition is displayed consistently anywhere the skill appears (profiles, validation views, analytics).

- **TC-ADM-003 — Deactivate/deprecate a skill without breaking history**
  - **Preconditions**: Skill exists and has historical usage.
  - **Steps**: Deactivate/deprecate the skill.
  - **Expected**: Skill is not selectable for new additions; historical records remain accessible for profiles and audit trails.

#### Leadership analytics & exports

- **TC-LEAD-001 — View heatmap and drill down by organizational scope**
  - **Preconditions**: Leadership user is signed in; organization has multiple units/teams; skill data exists.
  - **Steps**: Open analytics dashboard → Select org unit → View heatmap → Drill down to team.
  - **Expected**: Heatmap shows proficiency distribution and self-assessed vs validated distinction; drill-down works within permitted scope.

- **TC-LEAD-002 — Export capability report with correct scope**
  - **Preconditions**: Leadership user is viewing a capability report.
  - **Steps**: Export → Select format (CSV/PDF) → Select scope (team/department/org) → Confirm export.
  - **Expected**: Export file matches requested format and scope only; export is audit-logged (who/when/scope/count).

#### Cross-module matching and development actions

- **TC-PROJ-001 — Project candidate matching respects validation status**
  - **Preconditions**: Project requirements exist; employees have both self-assessed and validated skills.
  - **Steps**: Open project staffing search → Search candidates → Filter by validation status/proficiency.
  - **Expected**: Results include matches based on validated and self-assessed skills and allow filtering by status and proficiency.

- **TC-LND-001 — Skill gaps drive learning recommendations (when available)**
  - **Preconditions**: Employee has identified skill gaps; learning programs exist in platform.
  - **Steps**: Open skill gap view → Navigate to learning/development recommendations.
  - **Expected**: Recommended actions align to the gap; if no programs exist, gaps are still visible without recommendations.

#### Edge-case validations and permissions

- **TC-EDGE-001 — Conflicting ratings resolve to most recent validated decision**
  - **Preconditions**: Skill has self rating, peer inputs, and at least one validated decision.
  - **Steps**: View the skill in analytics/matching contexts.
  - **Expected**: Active proficiency used for decision-making is the most recent **Validated** outcome; other ratings remain visible as inputs.

- **TC-EDGE-002 — Validation expiry changes status and triggers revalidation flow**
  - **Preconditions**: A skill is validated and reaches expiry (default 12 months or configured).
  - **Steps**: Reach expiry date → Open employee profile.
  - **Expected**: Status becomes **Expired/Needs revalidation**; employee (and manager where applicable) is notified; revalidation can be initiated.

- **TC-EDGE-003 — Team-only skill visibility enforced**
  - **Preconditions**: Employee A and Employee B are in different teams.
  - **Steps**: Employee A attempts to view Employee B’s skills.
  - **Expected**: Access is denied/limited per policy; no org-wide directory access is provided by default.

- **TC-EDGE-004 — Unauthorized analytics access denied**
  - **Preconditions**: User lacks permission to view a specific team/unit.
  - **Steps**: Attempt to access that unit’s report or export.
  - **Expected**: Access is denied with an actionable message; no data is returned.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a centralized Skill Matrix module accessible to employees,
  managers, HR/Admin, and leadership according to their role.
- **FR-002**: The system MUST organize skills in a hierarchical taxonomy: **Category → Subcategory →
  Skill**.
- **FR-003**: Every skill MUST belong to exactly one subcategory. If a category does not naturally
  subdivide, the system MUST support a default subcategory (e.g., “General”) for that category.
- **FR-004**: Each skill MUST include a clear definition that is visible wherever the skill is
  displayed.
- **FR-005**: The system MUST support four proficiency levels: Beginner, Intermediate, Advanced,
  Expert, with descriptions consistent across the organization.
- **FR-006**: Employees MUST be able to add skills to their profile by selecting from the taxonomy.
- **FR-007**: Employees MUST be able to update proficiency levels for skills in their profile.
- **FR-008**: Employees MUST be able to submit skill changes for validation.
- **FR-009**: The system MUST show a skill’s validation status distinctly as one of: Self-assessed,
  Pending validation, Validated, Expired/Needs revalidation.
- **FR-010**: Employees MUST be able to submit a **new skill request** when a desired skill is not
  present in the taxonomy. A request MUST include: skill name, proposed category/subcategory, and a
  plain-language definition. Requested skills MUST NOT be selectable in employee profiles until
  approved by HR/Admin.
- **FR-011**: The system MUST support multiple rating sources: self assessment, manager assessment,
  peer validation, and system-generated insights.
- **FR-012**: System-generated insights MUST be presented as suggestions and MUST NOT change an
  employee’s proficiency level without an explicit user action and a recorded validation outcome.
- **FR-013**: The system MUST allow employees to upload certifications as evidence tied to one or
  more skills.
- **FR-014**: The system MUST allow skills to be validated via: technical assessments, certification
  uploads, project experience tagging, and periodic manager evaluations.
- **FR-015**: The system MUST allow employees to tag project experience to skills (linking a skill
  to one or more projects/assignments where applicable in the platform).
- **FR-016**: Managers MUST be able to view and act on validation requests for employees in their
  reporting hierarchy.
- **FR-017**: Managers MUST be able to approve a requested proficiency level or approve with a
  modified level and provide feedback.
- **FR-018**: The system MUST notify employees of validation outcomes (approved, modified, rejected)
  and provide the decision details.
- **FR-019**: HR/Admin users MUST be able to create, edit, and deactivate taxonomy elements
  (categories, subcategories, skills) without breaking access to historical employee profiles.
- **FR-020**: HR/Admin users MUST be able to define and maintain the proficiency framework
  descriptions and any organization-specific guidance associated with each level.
- **FR-021**: The system MUST provide team-level views for managers to see skill distribution across
  their team.
- **FR-022**: The system MUST generate analytics including: skill gap analysis, team capability
  reports, project skill matching, and organization heatmaps.
- **FR-023**: Analytics MUST support drill-down by organizational scope (individual, team,
  department, organization) consistent with the organization structure stored in ITP.
- **FR-024**: The system MUST integrate skills data with existing ITP modules: employee profiles,
  project allocation, performance reviews, and learning/development programs.
- **FR-025**: The system MUST display consistent skills information across modules (e.g., an
  employee’s skills shown in their profile match those used for project matching).
- **FR-026**: The system MUST provide role-based access so users can only view/edit skills and
  reports within their permitted scope.
- **FR-027**: The system MUST keep an auditable history of changes to employee skills and validation
  decisions (who changed what, when, and why).
- **FR-028**: Peer validation MUST require at least **two** peers by default, and the organization
  MUST be able to configure the minimum peer count.
- **FR-029**: Skill validations MUST expire after a configurable period (default **12 months**). When
  expired, the skill status MUST become Expired/Needs revalidation until revalidated.
- **FR-030**: When there are conflicting ratings for a skill, the **active proficiency** displayed
  for decision-making (analytics, matching) MUST be determined by the most recent **Validated**
  decision; self/peer ratings and system insights MUST remain visible as inputs but MUST NOT override
  a validated decision without a new validation outcome.
- **FR-031**: Leadership users MUST have read-only access to organization-level analytics and MUST
  NOT be able to edit taxonomy or employee skill profiles.
- **FR-032**: The system MUST support exporting analytics outputs in **CSV** and **PDF** formats.
- **FR-033**: Employees MUST be able to view the skills of other employees **within their team**.
  Employees MUST NOT have org-wide skill directory access by default.
- **FR-034**: Skill gap analysis MUST support required skills defined by both (a) an employee’s
  role/job profile and (b) project requirements. The system MUST allow reporting by source (role vs
  project) when both exist.
- **FR-035**: Only Managers and HR/Admin users MUST be able to set a skill’s status to **Validated**
  (or change a Validated proficiency level). Peer validations and system-generated insights MUST be
  recorded and visible as evidence inputs but MUST NOT set “Validated” without a Manager/HR decision.

### Key Entities *(include if feature involves data)*

- **SkillCategory**: Top-level grouping for skills (e.g., Development, Cloud).
- **SkillSubcategory**: Second-level grouping within a category (e.g., Frontend under Development).
- **Skill**: A specific capability with a definition and one or more subcategory/category placements.
- **ProficiencyLevel**: Beginner/Intermediate/Advanced/Expert with standard descriptions.
- **EmployeeSkillProfile**: The collection of an employee’s skills, proficiencies, and statuses.
- **SkillRating**: A recorded assessment for a skill from a specific source (self/manager/peer/system).
- **ValidationRequest**: A submitted request to validate or revalidate skill proficiency.
- **ValidationDecision**: The outcome of a validation request (approved/modified/rejected) with feedback.
- **EvidenceItem**: Certification, assessment result, or project experience reference tied to a skill.
- **SkillGap**: The difference between required skills (role/project) and an employee/team’s current skills.
- **SkillRequest**: A proposed new skill submission awaiting HR/Admin approval (name, proposed placement,
  definition, status, decision notes).
- **RoleSkillRequirement**: A required skill definition tied to a role/job profile (skill + target proficiency).
- **ProjectSkillRequirement**: A required skill definition tied to a project (skill + target proficiency).

### Assumptions

- The ITP platform already maintains employee identity, organizational structure, and reporting
  hierarchy.
- The project allocation module can express project skill requirements to enable matching.
- Learning and development programs exist in the platform; where they do not, the module will still
  surface gaps without recommendations.
- Performance reviews can reference skill information as supporting context, but the Skill Matrix
  remains the source for skill proficiency data.

### Dependencies

- Existing ITP employee profiles and role/permission model.
- Existing ITP organizational hierarchy and manager-report relationships.
- Existing project allocation workflows (for project skill matching use cases).
- Existing learning and development program catalog (for gap-to-learning connections).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 90% of employees can add or update a skill and submit it for validation in
  under 3 minutes on their first attempt.
- **SC-002**: At least 90% of managers can complete a skill validation review (approve/modify with
  feedback) in under 2 minutes for a standard request with evidence attached.
- **SC-003**: Leadership can open an organization heatmap and drill down to a team view in under
  10 seconds for at least 95% of sessions under normal usage conditions.
- **SC-004**: Project staffing time (from opening candidate search to selecting a shortlist) is
  reduced by at least 30% for projects that define required skills.
- **SC-005**: For employees with identified skill gaps, at least 70% view at least one recommended
  development action within 30 days of the gap being surfaced.
