# Quickstart: Skill Matrix Module (ITP)

**Branch**: `001-skill-matrix`  
**Date**: 2026-03-11  
**Spec**: `specs/001-skill-matrix/spec.md`  
**Plan**: `specs/001-skill-matrix/plan.md`

## Prerequisites

- .NET SDK 8.x
- Node.js 20.x + npm
- MySQL 8.x (local or container)

## Local configuration (expected)

Backend environment variables (example names; follow platform conventions):

- `ITP_DB_CONNECTION_STRING` (MySQL)
- `ITP_AUTH_AUTHORITY` (platform auth issuer)
- `ITP_AUTH_AUDIENCE` (API audience)

Frontend environment variables (example names; follow platform conventions):

- `VITE_API_BASE_URL` (e.g., `http://localhost:5000/api/v1`)

## Run locally (target workflow)

### 1) Start MySQL

Ensure a MySQL instance is running and reachable from the backend.

### 2) Run backend API

From `backend/`:

- Restore/build the solution
- Apply DB migrations
- Start the API

Expected developer loop (example):

- `dotnet restore`
- `dotnet ef database update`
- `dotnet run`

### 3) Run frontend SPA

From `frontend/`:

- Install dependencies
- Start dev server

Expected developer loop (example):

- `npm install`
- `npm run dev`

## Smoke test checklist

- Employee can add a skill and see it as SelfAssessed
- Employee can submit a validation request with evidence
- Manager can approve/modify and employee sees status change to Validated
- Admin can add taxonomy skill definitions
- Leadership can open heatmap and export report

## Notes

- Exports must be audit-logged and may run asynchronously for large scopes.
- Events listed in `specs/001-skill-matrix/contracts/events.md` should be emitted for cross-module triggers.

