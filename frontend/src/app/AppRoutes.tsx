import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './AppShell'
import { skillMatrixRoutes } from '../features/skill-matrix/routes'
import { MySkillsPage } from '../features/skill-matrix/pages'

/**
 * App route configuration.
 * Lazy-load feature routes as they are implemented.
 */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<Navigate to={skillMatrixRoutes.mySkills} replace />} />
        <Route path="skill-matrix" element={<Navigate to={skillMatrixRoutes.mySkills} replace />} />
        <Route path="skill-matrix/my-skills" element={<MySkillsPage />} />
        {/* More feature routes in T048, T065, etc. */}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
