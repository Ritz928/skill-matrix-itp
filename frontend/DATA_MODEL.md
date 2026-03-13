# Skill Matrix – Data Model & Sync Rules

This doc describes how data stays in sync across the app without a real database. We follow **foreign-key style** rules: one source of truth per entity, and other data references it by **id**.

---

## 1. Core rule: one id per person

| Place | Role | Rule |
|-------|------|------|
| **Login** | `mockUsers[].id` | Used as `user.id` after login. |
| **Team / skills** | `teamMembers[].id` | Same person = **same id** in both. |

So for every employee (and the manager):

- **My Skill Profile** (Employee Skills page) = `teamMembers.find(m => m.id === user.id)?.skills`
- **Team Skills** (manager view) = `teamMembers` from the same store.

If `user.id` and `teamMembers[].id` match for that person, **My Skills and manager view stay in sync** for **all employees**, not just one.

---

## 2. Files to keep in sync when adding people

When you add a **new employee** (or another manager):

1. **`src/app/data/mockUsers.ts`**  
   Add a `MockUser` with a stable `id` (e.g. `emp-011`), plus name, role, email, password.

2. **`src/app/data/mockData.ts`**  
   Add a `teamMembers` entry with the **same `id`**, plus name, role, department, and `skills` (can be `[]`).

Use the **same id** in both files. That’s the “foreign key” link: same person = same id everywhere.

---

## 3. Validation requests (FK to teamMembers + skills)

| Field | References | Rule |
|-------|------------|------|
| `validationRequests[].employeeId` | `teamMembers[].id` | Must be an existing member id. |
| `validationRequests[].skill.id` | That member’s `teamMembers[x].skills[].id` | Skill must belong to that employee. |

- **Building requests:** In `mockData.ts`, validation requests are built by **employeeId + skillId** (helper `getSkillByFk`), not by array index, so reordering `teamMembers` doesn’t break links.
- **Cascade delete:** When a skill is deleted via `deleteSkill(employeeId, skillId)`, the store also removes any validation request for that `(employeeId, skillId)`, so Pending validation stays in sync.

---

## 4. Single source of truth

| Data | Source of truth | Used by |
|------|-----------------|--------|
| Who exists (people) | `teamMembers` in store (from `mockData.ts`) | Team Skills, Employee Skills, Dashboard, Project Matching |
| Skills per person | `teamMembers[].skills` | My Skill Profile, Team Skills, charts, validation |
| Who can log in | `mockUsers` | Login only; after login, `user.id` must match a `teamMembers[].id` for that person |
| Pending validations | `validationRequests` in store | Skill Validation page, Dashboard pending count |

There is **no separate “employee skills” table**. All skills live under `teamMembers[].skills`.

---

## 5. Persist & repair (all employees + manager)

On rehydrate from localStorage, the store merge:

- Ensures **manager** (`manager-001`) exists in `teamMembers` so the manager has a profile and can add/delete skills.
- **Repairs all employees:** If a merged member has **no skills** but the initial state (from `mockData`) has skills for that id, it **restores** that member’s skills. So every employee (emp-001 … emp-010, and any new ones from initial state) keeps their skills even if old persisted state was wrong.
- Ensures no employee from the initial `teamMembers` list is missing from the merged list.

So **all employees** can expect their My Skills to stay in sync with what the manager sees on Team Skills, as long as ids match in `mockUsers` and `mockData`.

---

## 6. Quick checklist for new entities

- [ ] New **employee**: add same `id` in `mockUsers.ts` and in `teamMembers` in `mockData.ts`.
- [ ] New **skill** (for existing person): use store `addSkill(employeeId, skill)`; no separate table.
- [ ] New **validation request**: use store `addValidationRequest(...)`; ensure `employeeId` and `skill` (with `skill.id`) refer to an existing member and one of their skills.
- [ ] Don’t reference `teamMembers` by array index when linking to a person or skill; use **id** (e.g. `getSkillByFk(employeeId, skillId)` in mockData).

Following these rules keeps My Skills, Team Skills, and validation data in sync for the manager and all employees.
