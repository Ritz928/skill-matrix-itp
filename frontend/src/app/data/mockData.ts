export type ProficiencyLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";
export type ValidationStatus = "Self-assessed" | "Pending validation" | "Validated" | "Rejected";

export interface Skill {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  proficiencyLevel?: ProficiencyLevel;
  validationStatus?: ValidationStatus;
  lastUpdated?: string;
  yearsOfExperience?: number;
  lastUsed?: string;
  certifications?: string[];
  projectTags?: string[];
  endorsements?: number;
  feedback?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
  skills: Skill[];
}

export interface ValidationRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  skill: Skill;
  requestedProficiency: ProficiencyLevel;
  submittedDate: string;
  evidence: string[];
}

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

const VALIDATION_STATS_COLORS: Record<string, string> = {
  Validated: "#22c55e",
  Pending: "#f59e0b",
  "Self-assessed": "#3b82f6",
  Rejected: "#ef4444"
};

function computeSkillDistribution(skills: Skill[]): SkillDistributionRow[] {
  const bySkill = new Map<string, { beginner: number; intermediate: number; advanced: number; expert: number }>();
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
  return Array.from(bySkill.entries()).map(([skill, counts]) => ({ skill, ...counts }));
}

function computeValidationStats(skills: Skill[]): ValidationStatsRow[] {
  const counts: Record<string, number> = {
    Validated: 0,
    Pending: 0,
    "Self-assessed": 0,
    Rejected: 0
  };
  for (const s of skills) {
    const status = s.validationStatus ?? "Self-assessed";
    const key = status === "Pending validation" ? "Pending" : status;
    if (key in counts) counts[key] += 1;
  }
  return [
    { name: "Validated", value: counts.Validated, color: VALIDATION_STATS_COLORS.Validated },
    { name: "Pending", value: counts.Pending, color: VALIDATION_STATS_COLORS.Pending },
    { name: "Self-assessed", value: counts["Self-assessed"], color: VALIDATION_STATS_COLORS["Self-assessed"] },
    { name: "Rejected", value: counts.Rejected, color: VALIDATION_STATS_COLORS.Rejected }
  ];
}

export const skillCategories = [
  {
    id: "dev",
    name: "Development",
    subcategories: [
      { id: "frontend", name: "Frontend", skills: ["React", "Vue.js", "Angular", "TypeScript", "JavaScript", "HTML/CSS"] },
      { id: "backend", name: "Backend", skills: ["Node.js", "Python", "Java", "C#", ".NET", "Ruby"] },
      { id: "mobile", name: "Mobile", skills: ["React Native", "Flutter", "iOS", "Android", "Kotlin", "Swift"] }
    ]
  },
  {
    id: "cloud",
    name: "Cloud",
    subcategories: [
      { id: "platforms", name: "Platforms", skills: ["AWS", "Azure", "Google Cloud", "Oracle Cloud"] },
      { id: "devops", name: "DevOps", skills: ["Docker", "Kubernetes", "Jenkins", "GitLab CI/CD", "Terraform"] }
    ]
  },
  {
    id: "data",
    name: "Data",
    subcategories: [
      { id: "databases", name: "Databases", skills: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Cassandra"] },
      { id: "analytics", name: "Analytics", skills: ["Power BI", "Tableau", "Python", "R", "SQL"] }
    ]
  },
  {
    id: "design",
    name: "Design",
    subcategories: [
      { id: "ui-ux", name: "UI/UX", skills: ["Figma", "Adobe XD", "Sketch", "User Research", "Prototyping"] }
    ]
  },
  {
    id: "management",
    name: "Management",
    subcategories: [
      { id: "project", name: "Project Management", skills: ["Agile", "Scrum", "JIRA", "Project Planning", "Risk Management"] }
    ]
  }
];

/** Team members with inline skills (unique ids sk-xxx). All skills live here; no standalone employeeSkills. */
/** Manager (manager-001) is included so "My Skill Profile" and addSkill work when a Manager is logged in. */
export const teamMembers: Employee[] = [
  {
    id: "manager-001",
    name: "John Doe",
    role: "Manager",
    department: "Management",
    skills: []
  },
  {
    id: "emp-001",
    name: "Sarah Johnson",
    role: "Senior Developer",
    department: "Engineering",
    skills: [
      { id: "sk-001", name: "React", category: "Development", subcategory: "Frontend", description: "JavaScript library for building user interfaces", proficiencyLevel: "Advanced", validationStatus: "Validated", lastUpdated: "2026-02-15", yearsOfExperience: 4, lastUsed: "2026-03-01", certifications: ["React Professional Certification"], projectTags: ["ITP Dashboard"], endorsements: 12 },
      { id: "sk-002", name: "AWS", category: "Cloud", subcategory: "Platforms", description: "Amazon Web Services cloud platform", proficiencyLevel: "Intermediate", validationStatus: "Pending validation", lastUpdated: "2026-03-05", yearsOfExperience: 2, lastUsed: "2026-02-28", certifications: ["AWS Solutions Architect Associate"], projectTags: ["Cloud Migration"], endorsements: 5 },
      { id: "sk-003", name: "Python", category: "Development", subcategory: "Backend", description: "High-level programming language", proficiencyLevel: "Advanced", validationStatus: "Validated", lastUpdated: "2026-01-20", yearsOfExperience: 5, lastUsed: "2026-03-10", certifications: [], projectTags: ["Data Pipeline"], endorsements: 8 },
      { id: "sk-004", name: "Figma", category: "Design", subcategory: "UI/UX", description: "Collaborative design tool", proficiencyLevel: "Intermediate", validationStatus: "Self-assessed", lastUpdated: "2026-03-08", yearsOfExperience: 1, lastUsed: "2026-03-11", certifications: [], projectTags: ["Design System"], endorsements: 3 },
      { id: "sk-005", name: "Docker", category: "Cloud", subcategory: "DevOps", description: "Container platform", proficiencyLevel: "Beginner", validationStatus: "Self-assessed", lastUpdated: "2026-03-10", yearsOfExperience: 0.5, lastUsed: "2026-03-05", certifications: [], projectTags: [], endorsements: 1 }
    ]
  },
  {
    id: "emp-002",
    name: "Michael Chen",
    role: "DevOps Engineer",
    department: "Engineering",
    skills: [
      { id: "sk-006", name: "AWS", category: "Cloud", subcategory: "Platforms", description: "Amazon Web Services cloud platform", proficiencyLevel: "Advanced", validationStatus: "Validated", lastUpdated: "2026-02-10", yearsOfExperience: 4, certifications: ["AWS Solutions Architect Professional"], projectTags: ["Cloud Migration"], endorsements: 10 },
      { id: "sk-007", name: "Docker", category: "Cloud", subcategory: "DevOps", description: "Container platform", proficiencyLevel: "Expert", validationStatus: "Validated", lastUpdated: "2026-03-01", yearsOfExperience: 5, certifications: [], projectTags: ["K8s Migration"], endorsements: 15 },
      { id: "sk-008", name: "Kubernetes", category: "Cloud", subcategory: "DevOps", description: "Container orchestration platform", proficiencyLevel: "Advanced", validationStatus: "Pending validation", lastUpdated: "2026-03-08", yearsOfExperience: 3, certifications: ["CKA"], projectTags: ["K8s Migration"], endorsements: 7 },
      { id: "sk-009", name: "Terraform", category: "Cloud", subcategory: "DevOps", description: "Infrastructure as code", proficiencyLevel: "Intermediate", validationStatus: "Validated", lastUpdated: "2026-02-20", yearsOfExperience: 2, certifications: [], projectTags: [], endorsements: 4 }
    ]
  },
  {
    id: "emp-003",
    name: "Emily Rodriguez",
    role: "Full Stack Developer",
    department: "Engineering",
    skills: [
      { id: "sk-010", name: "React", category: "Development", subcategory: "Frontend", description: "JavaScript library for building user interfaces", proficiencyLevel: "Expert", validationStatus: "Validated", lastUpdated: "2026-02-15", yearsOfExperience: 6, certifications: [], projectTags: ["Customer Portal"], endorsements: 18 },
      { id: "sk-011", name: "Python", category: "Development", subcategory: "Backend", description: "High-level programming language", proficiencyLevel: "Advanced", validationStatus: "Validated", lastUpdated: "2026-01-20", yearsOfExperience: 5, certifications: [], projectTags: ["API Gateway"], endorsements: 9 },
      { id: "sk-012", name: "TypeScript", category: "Development", subcategory: "Frontend", description: "Typed superset of JavaScript", proficiencyLevel: "Advanced", validationStatus: "Pending validation", lastUpdated: "2026-03-09", yearsOfExperience: 4, certifications: [], projectTags: [], endorsements: 6 },
      { id: "sk-013", name: "Node.js", category: "Development", subcategory: "Backend", description: "JavaScript runtime", proficiencyLevel: "Intermediate", validationStatus: "Self-assessed", lastUpdated: "2026-03-05", yearsOfExperience: 3, certifications: [], projectTags: [], endorsements: 5 }
    ]
  },
  {
    id: "emp-004",
    name: "David Kim",
    role: "Frontend Developer",
    department: "Engineering",
    skills: [
      { id: "sk-014", name: "React", category: "Development", subcategory: "Frontend", description: "JavaScript library for building user interfaces", proficiencyLevel: "Intermediate", validationStatus: "Validated", lastUpdated: "2026-02-01", yearsOfExperience: 3, certifications: [], projectTags: ["Customer Portal"], endorsements: 6 },
      { id: "sk-015", name: "Figma", category: "Design", subcategory: "UI/UX", description: "Collaborative design tool", proficiencyLevel: "Advanced", validationStatus: "Validated", lastUpdated: "2026-03-08", yearsOfExperience: 2, certifications: [], projectTags: ["Design System"], endorsements: 4 },
      { id: "sk-016", name: "JavaScript", category: "Development", subcategory: "Frontend", description: "Programming language for the web", proficiencyLevel: "Advanced", validationStatus: "Validated", lastUpdated: "2026-02-28", yearsOfExperience: 5, certifications: [], projectTags: [], endorsements: 8 }
    ]
  },
  {
    id: "emp-005",
    name: "Anna Williams",
    role: "Data Analyst",
    department: "Analytics",
    skills: [
      { id: "sk-017", name: "Python", category: "Development", subcategory: "Backend", description: "High-level programming language", proficiencyLevel: "Advanced", validationStatus: "Validated", lastUpdated: "2026-02-15", yearsOfExperience: 4, certifications: [], projectTags: ["Data Pipeline"], endorsements: 7 },
      { id: "sk-018", name: "SQL", category: "Data", subcategory: "Analytics", description: "Structured query language", proficiencyLevel: "Expert", validationStatus: "Validated", lastUpdated: "2026-03-01", yearsOfExperience: 6, certifications: [], projectTags: [], endorsements: 12 },
      { id: "sk-019", name: "Power BI", category: "Data", subcategory: "Analytics", description: "Business analytics service", proficiencyLevel: "Advanced", validationStatus: "Pending validation", lastUpdated: "2026-03-10", yearsOfExperience: 3, certifications: [], projectTags: [], endorsements: 3 }
    ]
  },
  {
    id: "emp-006",
    name: "James Wilson",
    role: "Backend Developer",
    department: "Engineering",
    skills: [
      { id: "sk-020", name: "Python", category: "Development", subcategory: "Backend", description: "High-level programming language", proficiencyLevel: "Expert", validationStatus: "Validated", lastUpdated: "2026-02-20", yearsOfExperience: 7, certifications: [], projectTags: ["API Gateway"], endorsements: 14 },
      { id: "sk-021", name: "PostgreSQL", category: "Data", subcategory: "Databases", description: "Relational database", proficiencyLevel: "Advanced", validationStatus: "Validated", lastUpdated: "2026-03-05", yearsOfExperience: 4, certifications: [], projectTags: [], endorsements: 6 },
      { id: "sk-022", name: "Docker", category: "Cloud", subcategory: "DevOps", description: "Container platform", proficiencyLevel: "Intermediate", validationStatus: "Pending validation", lastUpdated: "2026-03-08", yearsOfExperience: 2, certifications: [], projectTags: [], endorsements: 2 }
    ]
  },
  {
    id: "emp-007",
    name: "Maria Garcia",
    role: "UX Designer",
    department: "Design",
    skills: [
      { id: "sk-023", name: "Figma", category: "Design", subcategory: "UI/UX", description: "Collaborative design tool", proficiencyLevel: "Expert", validationStatus: "Validated", lastUpdated: "2026-03-01", yearsOfExperience: 5, certifications: [], projectTags: ["Design System"], endorsements: 11 },
      { id: "sk-024", name: "User Research", category: "Design", subcategory: "UI/UX", description: "User-centered design research", proficiencyLevel: "Advanced", validationStatus: "Validated", lastUpdated: "2026-02-15", yearsOfExperience: 4, certifications: [], projectTags: [], endorsements: 5 },
      { id: "sk-025", name: "Prototyping", category: "Design", subcategory: "UI/UX", description: "Interactive prototypes", proficiencyLevel: "Advanced", validationStatus: "Self-assessed", lastUpdated: "2026-03-10", yearsOfExperience: 3, certifications: [], projectTags: [], endorsements: 4 }
    ]
  },
  {
    id: "emp-008",
    name: "Robert Brown",
    role: "Cloud Architect",
    department: "Engineering",
    skills: [
      { id: "sk-026", name: "AWS", category: "Cloud", subcategory: "Platforms", description: "Amazon Web Services cloud platform", proficiencyLevel: "Expert", validationStatus: "Validated", lastUpdated: "2026-02-28", yearsOfExperience: 8, certifications: ["AWS Solutions Architect Professional"], projectTags: ["Cloud Migration"], endorsements: 20 },
      { id: "sk-027", name: "Kubernetes", category: "Cloud", subcategory: "DevOps", description: "Container orchestration platform", proficiencyLevel: "Advanced", validationStatus: "Validated", lastUpdated: "2026-03-05", yearsOfExperience: 4, certifications: ["CKA"], projectTags: [], endorsements: 9 },
      { id: "sk-028", name: "Terraform", category: "Cloud", subcategory: "DevOps", description: "Infrastructure as code", proficiencyLevel: "Advanced", validationStatus: "Pending validation", lastUpdated: "2026-03-09", yearsOfExperience: 3, certifications: [], projectTags: [], endorsements: 5 }
    ]
  },
  {
    id: "emp-009",
    name: "Lisa Anderson",
    role: "Product Manager",
    department: "Product",
    skills: [
      { id: "sk-029", name: "Agile", category: "Management", subcategory: "Project Management", description: "Agile methodology", proficiencyLevel: "Expert", validationStatus: "Validated", lastUpdated: "2026-02-20", yearsOfExperience: 6, certifications: ["CSM"], projectTags: [], endorsements: 10 },
      { id: "sk-030", name: "JIRA", category: "Management", subcategory: "Project Management", description: "Project tracking tool", proficiencyLevel: "Advanced", validationStatus: "Validated", lastUpdated: "2026-03-01", yearsOfExperience: 4, certifications: [], projectTags: [], endorsements: 6 },
      { id: "sk-031", name: "Scrum", category: "Management", subcategory: "Project Management", description: "Scrum framework", proficiencyLevel: "Advanced", validationStatus: "Pending validation", lastUpdated: "2026-03-07", yearsOfExperience: 5, certifications: [], projectTags: [], endorsements: 4 }
    ]
  },
  {
    id: "emp-010",
    name: "Chris Taylor",
    role: "Full Stack Developer",
    department: "Engineering",
    skills: [
      { id: "sk-032", name: "React", category: "Development", subcategory: "Frontend", description: "JavaScript library for building user interfaces", proficiencyLevel: "Advanced", validationStatus: "Validated", lastUpdated: "2026-02-25", yearsOfExperience: 4, certifications: [], projectTags: ["ITP Dashboard"], endorsements: 8 },
      { id: "sk-033", name: "Node.js", category: "Development", subcategory: "Backend", description: "JavaScript runtime", proficiencyLevel: "Advanced", validationStatus: "Validated", lastUpdated: "2026-03-05", yearsOfExperience: 4, certifications: [], projectTags: [], endorsements: 7 },
      { id: "sk-034", name: "MongoDB", category: "Data", subcategory: "Databases", description: "NoSQL database", proficiencyLevel: "Intermediate", validationStatus: "Self-assessed", lastUpdated: "2026-03-08", yearsOfExperience: 2, certifications: [], projectTags: [], endorsements: 3 },
      { id: "sk-035", name: "Azure", category: "Cloud", subcategory: "Platforms", description: "Microsoft cloud platform", proficiencyLevel: "Intermediate", validationStatus: "Pending validation", lastUpdated: "2026-03-10", yearsOfExperience: 1, certifications: [], projectTags: [], endorsements: 1 }
    ]
  }
];

const allSkillsFromTeam = teamMembers.flatMap(m => m.skills);

/** Resolve skill by FK: employeeId -> teamMembers[].id, skillId -> that member's skills[].id (keeps tables in sync). */
function getSkillByFk(employeeId: string, skillId: string): Skill | undefined {
  const member = teamMembers.find(m => m.id === employeeId);
  return member?.skills.find(s => s.id === skillId);
}

/**
 * Data consistency (FK-style):
 * - mockUsers[].id (login) must equal teamMembers[].id for the same person (Employee Skills = that member's skills).
 * - validationRequests[].employeeId -> teamMembers[].id; validationRequests[].skill.id -> that member's skills[].id.
 * - When a skill is deleted, remove any validation request for that (employeeId, skillId).
 */
export const validationRequests: ValidationRequest[] = (() => {
  const rows: { employeeId: string; employeeName: string; skillId: string; requestedProficiency: ProficiencyLevel; submittedDate: string; evidence: string[] }[] = [
    { employeeId: "emp-001", employeeName: "Sarah Johnson", skillId: "sk-002", requestedProficiency: "Intermediate", submittedDate: "2026-03-05", evidence: ["AWS Solutions Architect Associate Certificate"] },
    { employeeId: "emp-002", employeeName: "Michael Chen", skillId: "sk-008", requestedProficiency: "Advanced", submittedDate: "2026-03-08", evidence: ["CKA Certification", "Project: K8s Migration"] },
    { employeeId: "emp-003", employeeName: "Emily Rodriguez", skillId: "sk-012", requestedProficiency: "Advanced", submittedDate: "2026-03-09", evidence: ["4+ years experience", "Lead on 2 TypeScript projects"] },
    { employeeId: "emp-005", employeeName: "Anna Williams", skillId: "sk-019", requestedProficiency: "Advanced", submittedDate: "2026-03-10", evidence: ["Power BI certification in progress"] },
    { employeeId: "emp-006", employeeName: "James Wilson", skillId: "sk-022", requestedProficiency: "Intermediate", submittedDate: "2026-03-08", evidence: ["Docker in production use"] },
    { employeeId: "emp-008", employeeName: "Robert Brown", skillId: "sk-028", requestedProficiency: "Advanced", submittedDate: "2026-03-09", evidence: ["Terraform modules"] },
    { employeeId: "emp-009", employeeName: "Lisa Anderson", skillId: "sk-031", requestedProficiency: "Advanced", submittedDate: "2026-03-07", evidence: ["Scrum Master certification"] },
    { employeeId: "emp-010", employeeName: "Chris Taylor", skillId: "sk-035", requestedProficiency: "Intermediate", submittedDate: "2026-03-10", evidence: ["Azure Fundamentals"] }
  ];
  const ids = ["vr-001", "vr-002", "vr-003", "vr-004", "vr-005", "vr-006", "vr-007", "vr-008"];
  return rows
    .map((r, i) => {
      const skill = getSkillByFk(r.employeeId, r.skillId);
      if (!skill) return null;
      return { id: ids[i], employeeId: r.employeeId, employeeName: r.employeeName, skill, requestedProficiency: r.requestedProficiency, submittedDate: r.submittedDate, evidence: r.evidence } as ValidationRequest;
    })
    .filter((r): r is ValidationRequest => r !== null);
})();

export const skillDistributionData = computeSkillDistribution(allSkillsFromTeam);
export const validationStatsData = computeValidationStats(allSkillsFromTeam);

export const departmentSkillData = [
  { department: "Engineering", react: 85, aws: 70, python: 65, docker: 60 },
  { department: "Analytics", react: 30, aws: 40, python: 90, docker: 20 },
  { department: "Design", react: 50, aws: 20, python: 25, docker: 15 },
  { department: "Product", react: 40, aws: 30, python: 35, docker: 25 }
];

export const projectSkillRequirements = [
  { id: "proj-001", projectName: "Cloud Migration Initiative", requiredSkills: [{ name: "AWS", level: "Advanced", count: 3 }, { name: "Docker", level: "Intermediate", count: 2 }, { name: "Kubernetes", level: "Advanced", count: 2 }] },
  { id: "proj-002", projectName: "Customer Portal Redesign", requiredSkills: [{ name: "React", level: "Advanced", count: 4 }, { name: "TypeScript", level: "Intermediate", count: 4 }, { name: "Figma", level: "Intermediate", count: 2 }] },
  { id: "proj-003", projectName: "Data Platform Modernization", requiredSkills: [{ name: "Python", level: "Advanced", count: 3 }, { name: "SQL", level: "Expert", count: 2 }, { name: "Power BI", level: "Intermediate", count: 2 }] }
];

export const learningRecommendations = [
  { id: "rec-001", skillGap: "AWS Advanced", currentLevel: "Intermediate", targetLevel: "Advanced", courses: [{ name: "AWS Advanced Solutions Architect", provider: "AWS Training", duration: "40 hours" }, { name: "Cloud Architecture Patterns", provider: "Coursera", duration: "30 hours" }], affectedEmployees: 12 },
  { id: "rec-002", skillGap: "Kubernetes Expert", currentLevel: "Advanced", targetLevel: "Expert", courses: [{ name: "Certified Kubernetes Administrator (CKA)", provider: "Linux Foundation", duration: "80 hours" }, { name: "Advanced K8s Operations", provider: "Udemy", duration: "25 hours" }], affectedEmployees: 5 },
  { id: "rec-003", skillGap: "React Expert", currentLevel: "Advanced", targetLevel: "Expert", courses: [{ name: "Advanced React Patterns", provider: "Frontend Masters", duration: "20 hours" }, { name: "React Performance Optimization", provider: "Egghead", duration: "15 hours" }], affectedEmployees: 8 }
];
