import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Skill, Employee, ValidationRequest, ProficiencyLevel, ValidationStatus } from "../data/mockData";
import {
  validationRequests as initialValidationRequests,
  teamMembers as initialTeamMembers,
  skillCategories as initialSkillCategories,
  projectSkillRequirements as initialProjectSkillRequirements,
  skillDistributionData as initialSkillDistributionData,
  departmentSkillData as initialDepartmentSkillData,
  validationStatsData as initialValidationStatsData,
  learningRecommendations as initialLearningRecommendations
} from "../data/mockData";

export type SkillDistributionRow = {
  skill: string;
  beginner: number;
  intermediate: number;
  advanced: number;
  expert: number;
};

export type ValidationStatsRow = {
  name: string;
  value: number;
  color: string;
};

export type DepartmentSkillRow = {
  department: string;
  react: number;
  aws: number;
  python: number;
  docker: number;
};

export type ProjectRequiredSkill = {
  name: string;
  level: string;
  count: number;
};

export type Project = {
  id: string;
  projectName: string;
  description?: string;
  department?: string;
  manager?: string;
  startDate?: string;
  endDate?: string;
  requiredSkills: ProjectRequiredSkill[];
};

type DataState = {
  validationRequests: ValidationRequest[];
  teamMembers: Employee[];
  skillCategories: typeof initialSkillCategories;
  projectSkillRequirements: Project[];
  skillDistributionData: SkillDistributionRow[];
  departmentSkillData: DepartmentSkillRow[];
  validationStatsData: ValidationStatsRow[];
  learningRecommendations: typeof initialLearningRecommendations;
};

function recomputeSkillDistribution(skills: Skill[]): SkillDistributionRow[] {
  const bySkill = new Map<string, { beginner: number; intermediate: number; advanced: number; expert: number }>();
  const levels: (keyof SkillDistributionRow)[] = ["beginner", "intermediate", "advanced", "expert"];

  for (const s of skills) {
    const name = s.name;
    if (!bySkill.has(name)) {
      bySkill.set(name, { beginner: 0, intermediate: 0, advanced: 0, expert: 0 });
    }
    const row = bySkill.get(name)!;
    const level = (s.proficiencyLevel ?? "Beginner").toLowerCase() as keyof typeof row;
    if (level in row) {
      row[level as keyof typeof row] += 1;
    }
  }

  return Array.from(bySkill.entries()).map(([skill, counts]) => ({
    skill,
    ...counts
  }));
}

const VALIDATION_STATS_COLORS: Record<string, string> = {
  Validated: "#22c55e",
  Pending: "#f59e0b",
  "Self-assessed": "#3b82f6",
  Rejected: "#ef4444"
};

function recomputeValidationStats(skills: Skill[]): ValidationStatsRow[] {
  const counts: Record<string, number> = {
    Validated: 0,
    Pending: 0,
    "Self-assessed": 0,
    Rejected: 0
  };
  for (const s of skills) {
    const status = s.validationStatus ?? "Self-assessed";
    const key = status === "Pending validation" ? "Pending" : status;
    if (key in counts) {
      counts[key] += 1;
    }
  }
  return [
    { name: "Validated", value: counts.Validated, color: VALIDATION_STATS_COLORS.Validated },
    { name: "Pending", value: counts.Pending, color: VALIDATION_STATS_COLORS.Pending },
    { name: "Self-assessed", value: counts["Self-assessed"], color: VALIDATION_STATS_COLORS["Self-assessed"] },
    { name: "Rejected", value: counts.Rejected, color: VALIDATION_STATS_COLORS.Rejected }
  ];
}

type DataActions = {
  addSkill: (employeeId: string, skill: Omit<Skill, "id">) => Skill;
  updateSkill: (employeeId: string, skillId: string, updates: Partial<Skill>) => void;
  deleteSkill: (employeeId: string, skillId: string) => void;
  addValidationRequest: (request: Omit<ValidationRequest, "id">) => void;
  updateValidationRequest: (
    id: string,
    updates: Partial<ValidationRequest> & { skillUpdates?: Partial<Skill> }
  ) => void;
  approveRequest: (id: string, adjustedLevel: ProficiencyLevel, feedback: string) => void;
  rejectRequest: (id: string, feedback: string) => void;
  addProject: (projectData: { projectName: string; description?: string; department?: string; manager?: string; startDate?: string; endDate?: string; requiredSkills: ProjectRequiredSkill[] }) => void;
  updateProject: (id: string, projectData: { projectName?: string; description?: string; department?: string; manager?: string; startDate?: string; endDate?: string; requiredSkills?: ProjectRequiredSkill[] }) => void;
  deleteProject: (id: string) => void;
  recomputeChartData: () => void;
};

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

const initialState: DataState = {
  validationRequests: initialValidationRequests,
  teamMembers: initialTeamMembers,
  skillCategories: initialSkillCategories,
  projectSkillRequirements: initialProjectSkillRequirements as Project[],
  skillDistributionData: initialSkillDistributionData,
  departmentSkillData: initialDepartmentSkillData,
  validationStatsData: initialValidationStatsData,
  learningRecommendations: initialLearningRecommendations
};

export const useDataStore = create<DataState & DataActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      addSkill(employeeId, skill) {
        const id = generateId();
        const newSkill: Skill = { ...skill, id } as Skill;
        set(state => ({
          teamMembers: state.teamMembers.map(m =>
            m.id === employeeId ? { ...m, skills: [...m.skills, newSkill] } : m
          )
        }));
        get().recomputeChartData();
        return newSkill;
      },

      updateSkill(employeeId, skillId, updates) {
        set(state => ({
          teamMembers: state.teamMembers.map(m =>
            m.id === employeeId
              ? { ...m, skills: m.skills.map(s => (s.id === skillId ? { ...s, ...updates } : s)) }
              : m
          )
        }));
        get().recomputeChartData();
      },

      deleteSkill(employeeId, skillId) {
        set(state => ({
          teamMembers: state.teamMembers.map(m =>
            m.id === employeeId ? { ...m, skills: m.skills.filter(s => s.id !== skillId) } : m
          ),
          // FK cascade: remove validation requests that reference this skill so pending list stays in sync
          validationRequests: state.validationRequests.filter(
            r => !(r.employeeId === employeeId && r.skill?.id === skillId)
          )
        }));
        get().recomputeChartData();
      },

      addValidationRequest(request) {
        const id = generateId();
        const newRequest: ValidationRequest = { ...request, id } as ValidationRequest;
        set(state => ({
          validationRequests: [...state.validationRequests, newRequest]
        }));
        get().recomputeChartData();
      },

      updateValidationRequest(id, updates) {
        const { skillUpdates, ...requestUpdates } = updates as Partial<ValidationRequest> & {
          skillUpdates?: Partial<Skill>;
        };
        set(state => {
          const req = state.validationRequests.find(r => r.id === id);
          let nextTeamMembers = state.teamMembers;
          if (req && skillUpdates && req.skill?.id) {
            nextTeamMembers = state.teamMembers.map(m =>
              m.id === req.employeeId
                ? { ...m, skills: m.skills.map(s => (s.id === req.skill.id ? { ...s, ...skillUpdates } : s)) }
                : m
            );
          }
          return {
            validationRequests: state.validationRequests.map(r => (r.id === id ? { ...r, ...requestUpdates } : r)),
            teamMembers: nextTeamMembers
          };
        });
        get().recomputeChartData();
      },

      approveRequest(id, adjustedLevel, feedback) {
        const state = get();
        const req = state.validationRequests.find(r => r.id === id);
        if (!req) return;
        set({
          validationRequests: state.validationRequests.filter(r => r.id !== id),
          teamMembers: state.teamMembers.map(m =>
            m.id === req.employeeId
              ? {
                  ...m,
                  skills: m.skills.map(s =>
                    s.id === req.skill?.id
                      ? {
                          ...s,
                          proficiencyLevel: adjustedLevel,
                          validationStatus: "Validated" as ValidationStatus,
                          feedback
                        }
                      : s
                  )
                }
              : m
          )
        });
        get().recomputeChartData();
      },

      rejectRequest(id, feedback) {
        const state = get();
        const req = state.validationRequests.find(r => r.id === id);
        if (!req) return;
        set({
          validationRequests: state.validationRequests.filter(r => r.id !== id),
          teamMembers: state.teamMembers.map(m =>
            m.id === req.employeeId
              ? {
                  ...m,
                  skills: m.skills.map(s =>
                    s.id === req.skill?.id
                      ? { ...s, validationStatus: "Rejected" as ValidationStatus, feedback }
                      : s
                  )
                }
              : m
          )
        });
        get().recomputeChartData();
      },

      addProject(projectData) {
        const id = generateId();
        const project: Project = { id, ...projectData };
        set(state => ({
          projectSkillRequirements: [...state.projectSkillRequirements, project]
        }));
      },

      updateProject(id, projectData) {
        set(state => ({
          projectSkillRequirements: state.projectSkillRequirements.map(p =>
            p.id === id ? { ...p, ...projectData } : p
          )
        }));
      },

      deleteProject(id) {
        set(state => ({
          projectSkillRequirements: state.projectSkillRequirements.filter(p => p.id !== id)
        }));
      },

      recomputeChartData() {
        const { teamMembers } = get();
        const allSkills = teamMembers.flatMap(m => m.skills);
        set({
          skillDistributionData: recomputeSkillDistribution(allSkills),
          validationStatsData: recomputeValidationStats(allSkills)
        });
      }
    }),
    {
      name: "skill-matrix-storage",
      partialize: (state) => ({
        validationRequests: state.validationRequests,
        teamMembers: state.teamMembers,
        skillCategories: state.skillCategories,
        projectSkillRequirements: state.projectSkillRequirements,
        skillDistributionData: state.skillDistributionData,
        departmentSkillData: state.departmentSkillData,
        validationStatsData: state.validationStatsData,
        learningRecommendations: state.learningRecommendations
      }),
      merge: (persistedState, currentState) => {
        const merged = {
          ...currentState,
          ...(typeof persistedState === "object" && persistedState !== null ? persistedState : {})
        } as DataState & DataActions;
        const team = merged.teamMembers ?? currentState.teamMembers;
        const initialTeam = currentState.teamMembers;
        let nextTeam = team;
        if (!team.some((m: Employee) => m.id === "manager-001")) {
          const managerEntry: Employee = {
            id: "manager-001",
            name: "John Doe",
            role: "Manager",
            department: "Management",
            skills: []
          };
          nextTeam = [managerEntry, ...team];
        }
        // FK repair: ensure all employees from initial state keep their skills if persisted had empty
        nextTeam = nextTeam.map(m => {
          const initialMember = initialTeam.find((im: Employee) => im.id === m.id);
          if (initialMember && initialMember.skills.length > 0 && m.skills.length === 0) {
            return { ...m, skills: initialMember.skills };
          }
          return m;
        });
        const initialIds = new Set(initialTeam.map((m: Employee) => m.id));
        const presentIds = new Set(nextTeam.map((m: Employee) => m.id));
        for (const id of initialIds) {
          if (id === "manager-001") continue;
          if (!presentIds.has(id)) {
            const initialMember = initialTeam.find((m: Employee) => m.id === id);
            if (initialMember) nextTeam = [...nextTeam, initialMember];
          }
        }
        merged.teamMembers = nextTeam;
        return merged;
      }
    }
  )
);
