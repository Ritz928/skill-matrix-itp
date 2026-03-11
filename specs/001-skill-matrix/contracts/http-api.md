# Contracts: Skill Matrix HTTP API (high-level)

**Branch**: `001-skill-matrix`  
**Date**: 2026-03-11  
**Spec**: `specs/001-skill-matrix/spec.md`

> This document outlines the API surface at a high level (endpoints + payload shapes).
> Detailed schemas will be finalized in OpenAPI during implementation.

## Conventions

- Base path: `/api/v1/skill-matrix`
- Auth: ITP platform authentication; RBAC enforced via roles/claims
- Response envelopes follow platform standards (error format, pagination)
- IDs shown as opaque strings

## Taxonomy (HR/Admin)

### List taxonomy

`GET /taxonomy`

Response (shape):

- `categories[]`
  - `id`, `name`, `isActive`
  - `subcategories[]`
    - `id`, `name`, `isActive`
    - `skills[]`
      - `id`, `name`, `definition`, `status`, `version`

### Create/update category/subcategory/skill

- `POST /taxonomy/categories`
- `PATCH /taxonomy/categories/{categoryId}`
- `POST /taxonomy/categories/{categoryId}/subcategories`
- `PATCH /taxonomy/subcategories/{subcategoryId}`
- `POST /taxonomy/subcategories/{subcategoryId}/skills`
- `PATCH /taxonomy/skills/{skillId}`

Request (skill create/update shape):

- `name`
- `definition`
- `status` (Active | Deprecated | Archived)
- `version`
- `replacedBySkillId` (optional)

## Employee skill profile

### Get my profile

`GET /me/skills`

Response (shape):

- `employeeId`
- `skills[]`
  - `employeeSkillId`
  - `skill` { `id`, `name`, `definition`, `categoryName`, `subcategoryName` }
  - `activeProficiency` { `code`, `displayName` }
  - `validationStatus` (SelfAssessed | PendingValidation | Validated | Expired)
  - `lastValidatedAt` (optional)
  - `validationExpiresAt` (optional)
  - `ratingsSummary` { `self`, `manager`, `peers`, `system` } (optional rollup)

### Add/update a skill in my profile

- `POST /me/skills`
- `PATCH /me/skills/{employeeSkillId}`

Request (shape):

- `skillId`
- `proficiencyCode` (Beginner | Intermediate | Advanced | Expert)

Behavior:

- Adds/updates as SelfAssessed
- If updating a Validated skill’s proficiency, transitions to PendingValidation (per spec)

## Evidence

### Add evidence to a skill

`POST /me/skills/{employeeSkillId}/evidence`

Request (shape):

- `type` (CertificationUpload | TechnicalAssessment | ProjectExperienceTag | ManagerEvaluationNote)
- `externalRef` (optional)
- `fileRef` (optional)
- `metadata` (optional json)

## Validation workflow

### Submit validation request (employee)

`POST /me/skills/{employeeSkillId}/validation-requests`

Request (shape):

- `requestedProficiencyCode`
- `message` (optional)

### Manager inbox (requests to review)

`GET /manager/validation-requests?status=Submitted|InReview`

Response (shape):

- `items[]`
  - `validationRequestId`
  - `employee` { `id`, `displayName` }
  - `skill` { `id`, `name` }
  - `requestedProficiencyCode`
  - `submittedAt`
  - `evidence[]` (optional preview)

### Review decision (manager/HR)

`POST /manager/validation-requests/{validationRequestId}/decision`

Request (shape):

- `decision` (Approved | Modified | Rejected)
- `finalProficiencyCode` (required for Approved/Modified)
- `feedback` (optional)

## Skill requests (new skills not in taxonomy)

### Submit new skill request (employee)

`POST /skill-requests`

Request (shape):

- `proposedSkillName`
- `proposedDefinition`
- `proposedCategoryName`
- `proposedSubcategoryName`

### Review skill requests (HR/Admin)

- `GET /admin/skill-requests?status=Submitted`
- `POST /admin/skill-requests/{skillRequestId}/decision`

Decision request (shape):

- `decision` (Approved | Rejected)
- `reviewNotes` (optional)
- `approvedSkillId` (optional; if mapping to an existing skill instead of creating)

## Analytics & reporting

### Team capability report

`GET /reports/team-capability?teamId={id}`

Response (shape):

- `teamId`
- `skills[]` (aggregated)
  - `skillId`, `skillName`
  - `distributionByProficiency` { `Beginner`, `Intermediate`, `Advanced`, `Expert` }
  - `validatedCount`, `selfAssessedCount`, `expiredCount`

### Skill heatmap

`GET /reports/heatmap?scopeType=Team|Department|Organization&scopeId={id}`

Response (shape):

- `scope`
- `matrix[]` keyed by skill/category/subcategory with counts by level and validation status

### Gap analysis

`GET /reports/gaps?scopeType=Employee|Team|Department&scopeId={id}&source=Role|Project|All`

Response (shape):

- `requiredSkills[]` (role + project)
- `gaps[]` (missing/under-level skills) with drill-down references

### Export

- `POST /exports` (start export job)
- `GET /exports/{exportJobId}` (status + download reference when complete)

