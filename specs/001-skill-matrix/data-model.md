# Data Model: Skill Matrix Module (ITP)

**Branch**: `001-skill-matrix`  
**Date**: 2026-03-11  
**Spec**: `specs/001-skill-matrix/spec.md`  
**Research**: `specs/001-skill-matrix/research.md`

## Goals

- Represent a stable, versioned taxonomy: **Category → Subcategory → Skill**
- Store employee skill claims with multi-source ratings and an explicit validation state
- Support evidence attachments (certifications, assessments, project experience tags)
- Provide reliable analytics inputs (gaps, heatmaps, capability reports) and auditable exports

## Core Entities (logical model)

### Taxonomy

- **SkillCategory**
  - `id` (PK)
  - `name` (unique within org)
  - `is_active`
  - `created_at`, `updated_at`

- **SkillSubcategory**
  - `id` (PK)
  - `category_id` (FK → SkillCategory)
  - `name` (unique within category)
  - `is_active`
  - `created_at`, `updated_at`

- **Skill**
  - `id` (PK)
  - `subcategory_id` (FK → SkillSubcategory)
  - `name` (unique within subcategory)
  - `definition` (required)
  - `version` (integer or semantic string)
  - `status` (Active | Deprecated | Archived)
  - `replaced_by_skill_id` (nullable FK → Skill)
  - `created_at`, `updated_at`

### Proficiency framework

- **ProficiencyLevel**
  - `code` (PK; Beginner | Intermediate | Advanced | Expert)
  - `display_name`
  - `description`
  - `sort_order`
  - Notes: stored per tenant/org if ITP is multi-tenant

### Employee skill profile

- **EmployeeSkill**
  - `id` (PK)
  - `employee_id` (FK → ITP Employee/Identity module)
  - `skill_id` (FK → Skill)
  - `active_proficiency_code` (FK → ProficiencyLevel) — derived from latest validated decision (or self claim when not validated)
  - `validation_status` (SelfAssessed | PendingValidation | Validated | Expired)
  - `last_validated_at` (nullable)
  - `validation_expires_at` (nullable)
  - `created_at`, `updated_at`
  - Uniqueness: (`employee_id`, `skill_id`) unique

### Ratings / assessments / endorsements (evidence inputs)

- **SkillRating**
  - `id` (PK)
  - `employee_skill_id` (FK → EmployeeSkill)
  - `source` (Self | Manager | Peer | System)
  - `proficiency_code` (FK → ProficiencyLevel)
  - `rater_employee_id` (nullable; set for Manager/Peer)
  - `notes` (nullable)
  - `created_at`

- **PeerEndorsement**
  - `id` (PK)
  - `employee_skill_id` (FK → EmployeeSkill)
  - `endorser_employee_id` (FK → Employee)
  - `proficiency_code` (FK → ProficiencyLevel) (optional; endorsement can be “agree”)
  - `created_at`
  - Uniqueness: (`employee_skill_id`, `endorser_employee_id`) unique

- **SystemInsight**
  - `id` (PK)
  - `employee_skill_id` (FK → EmployeeSkill)
  - `signal_type` (CertificationDetected | ProjectUsage | AssessmentScore | Other)
  - `signal_value` (string/json)
  - `suggested_proficiency_code` (nullable)
  - `created_at`

### Validation workflow (manager/HR final authority)

- **ValidationRequest**
  - `id` (PK)
  - `employee_skill_id` (FK → EmployeeSkill)
  - `requested_by_employee_id` (FK → Employee)
  - `requested_proficiency_code` (FK → ProficiencyLevel)
  - `status` (Submitted | InReview | Approved | Modified | Rejected | Cancelled)
  - `submitted_at`, `decided_at` (nullable)
  - `created_at`, `updated_at`

- **ValidationDecision**
  - `id` (PK)
  - `validation_request_id` (FK → ValidationRequest)
  - `decider_employee_id` (FK → Employee) — Manager or HR/Admin
  - `decision` (Approved | Modified | Rejected)
  - `final_proficiency_code` (nullable; required for Approved/Modified)
  - `feedback` (nullable)
  - `created_at`

### Evidence attachments

- **EvidenceItem**
  - `id` (PK)
  - `employee_skill_id` (FK → EmployeeSkill)
  - `type` (CertificationUpload | TechnicalAssessment | ProjectExperienceTag | ManagerEvaluationNote)
  - `external_ref` (nullable; e.g., certification record ID, assessment attempt ID, project assignment ID)
  - `file_ref` (nullable; stored in platform’s file store)
  - `metadata` (json)
  - `created_at`

### New skill requests (employee proposes new skill)

- **SkillRequest**
  - `id` (PK)
  - `requested_by_employee_id` (FK → Employee)
  - `proposed_category_name`
  - `proposed_subcategory_name`
  - `proposed_skill_name`
  - `proposed_definition`
  - `status` (Submitted | Approved | Rejected)
  - `reviewed_by_employee_id` (nullable)
  - `review_notes` (nullable)
  - `approved_skill_id` (nullable FK → Skill)
  - `created_at`, `updated_at`

### Gap analysis inputs

- **RoleSkillRequirement**
  - `id` (PK)
  - `role_id` (FK → ITP Role/Job Profile)
  - `skill_id` (FK → Skill)
  - `target_proficiency_code` (FK → ProficiencyLevel)
  - `is_active`

- **ProjectSkillRequirement**
  - `id` (PK)
  - `project_id` (FK → ITP Project Allocation module)
  - `skill_id` (FK → Skill)
  - `target_proficiency_code` (FK → ProficiencyLevel)
  - `is_active`

### Analytics & export (optional physical model)

- **ExportJob**
  - `id` (PK)
  - `requested_by_employee_id`
  - `scope_type` (Individual | Team | Department | Organization)
  - `scope_id` (nullable; depends on scope type)
  - `report_type` (Heatmap | CapabilityReport | GapAnalysis | MatchingReport)
  - `format` (CSV | PDF)
  - `status` (Queued | Running | Completed | Failed)
  - `record_count` (nullable)
  - `file_ref` (nullable)
  - `created_at`, `completed_at` (nullable)

- **AuditLog** (platform-provided or module-specific)
  - Records exports and sensitive reads: actor, timestamp, action, scope, record_count

## State transitions

### EmployeeSkill.validation_status

- **SelfAssessed**
  - Created when employee adds skill
  - On “submit for validation” → **PendingValidation**

- **PendingValidation**
  - On manager/HR decision:
    - Approved/Modified → **Validated**
    - Rejected → **SelfAssessed** (with feedback retained on decision record)
  - On employee cancellation (optional) → **SelfAssessed**

- **Validated**
  - On expiry date reached → **Expired**
  - On employee edits proficiency → **PendingValidation** (new request)

- **Expired**
  - On new validation submission → **PendingValidation**
  - On manager/HR re-approval → **Validated**

### ValidationRequest.status

Submitted → InReview → (Approved | Modified | Rejected)  
Submitted/InReview → Cancelled (if requester cancels before decision)

### Skill.status (versioning)

Active → Deprecated → Archived  
Deprecated may include `replaced_by_skill_id` to support migration and historical mapping.

## Notes on physical schema in MySQL

- Prefer `BIGINT` for IDs and UTC timestamps.
- Store enums as smallint or constrained strings (platform standard).
- Indexes:
  - `EmployeeSkill(employee_id)`, `EmployeeSkill(skill_id)`, uniqueness `(employee_id, skill_id)`
  - `ValidationRequest(status, submitted_at)` for inbox views
  - `Skill(subcategory_id, status)` for taxonomy browsing
- Consider read models for heatmaps/gaps if org scale causes slow aggregations.

