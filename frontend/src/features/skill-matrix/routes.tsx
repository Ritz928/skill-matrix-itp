/**
 * Skill Matrix feature route definitions.
 * Used by the app router to mount feature pages.
 */
export const skillMatrixRoutes = {
  base: '/skill-matrix',
  mySkills: '/skill-matrix/my-skills',
  managerInbox: '/skill-matrix/manager-inbox',
  teamDistribution: '/skill-matrix/team-distribution',
  adminTaxonomy: '/skill-matrix/admin/taxonomy',
  adminSkillRequests: '/skill-matrix/admin/skill-requests',
  leadershipDashboard: '/skill-matrix/leadership',
  projectMatching: '/skill-matrix/project-matching',
} as const

export type SkillMatrixRouteKey = keyof typeof skillMatrixRoutes
