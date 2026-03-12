import { create } from 'zustand'

/**
 * Skill Matrix feature state (Zustand).
 * Placeholder for skill list, filters, and UI state (T049+).
 */
type SkillMatrixState = {
  /** Ready for T049+ implementation */
  _placeholder: boolean
}

export const useSkillMatrixStore = create<SkillMatrixState>(() => ({
  _placeholder: true,
}))
