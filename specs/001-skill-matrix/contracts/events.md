# Contracts: Skill Matrix Events (high-level)

**Branch**: `001-skill-matrix`  
**Date**: 2026-03-11  
**Spec**: `specs/001-skill-matrix/spec.md`

> Events are used for cross-module triggers and observability.
> Payload fields are indicative; the platform’s event envelope standard applies.

## Event list

### SkillMatrix.SkillChanged

Emitted when an employee adds/updates a skill (including proficiency changes).

Payload (shape):

- `employeeId`
- `skillId`
- `employeeSkillId`
- `activeProficiencyCode`
- `validationStatus`
- `occurredAt`

### SkillMatrix.ValidationRequested

Emitted when an employee submits a validation request.

Payload (shape):

- `validationRequestId`
- `employeeId`
- `employeeSkillId`
- `skillId`
- `requestedProficiencyCode`
- `occurredAt`

### SkillMatrix.SkillValidated

Emitted when a Manager/HR decision sets a skill to Validated (Approved/Modified).

Payload (shape):

- `validationRequestId`
- `employeeId`
- `employeeSkillId`
- `skillId`
- `finalProficiencyCode`
- `validatedByEmployeeId`
- `validationExpiresAt`
- `occurredAt`

### SkillMatrix.ValidationRejected

Emitted when a validation request is rejected.

Payload (shape):

- `validationRequestId`
- `employeeId`
- `employeeSkillId`
- `skillId`
- `rejectedByEmployeeId`
- `occurredAt`

### SkillMatrix.SkillExpired

Emitted when a validated skill expires and transitions to Expired.

Payload (shape):

- `employeeId`
- `employeeSkillId`
- `skillId`
- `occurredAt`

### SkillMatrix.SkillRequestSubmitted

Emitted when an employee requests a new skill to be added to taxonomy.

Payload (shape):

- `skillRequestId`
- `requestedByEmployeeId`
- `proposedSkillName`
- `proposedCategoryName`
- `proposedSubcategoryName`
- `occurredAt`

### SkillMatrix.SkillRequestDecided

Emitted when HR/Admin approves or rejects a skill request.

Payload (shape):

- `skillRequestId`
- `decision` (Approved | Rejected)
- `approvedSkillId` (optional)
- `decidedByEmployeeId`
- `occurredAt`

## Reliability notes

- Event publication should use an outbox pattern so DB writes and event emission are consistent.
- Events should be versioned and backward compatible; breaking changes require a version bump and deprecation window.

