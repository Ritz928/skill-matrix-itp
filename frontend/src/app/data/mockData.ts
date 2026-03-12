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

export const skillCategories = [
  {
    id: "dev",
    name: "Development",
    subcategories: [
      {
        id: "frontend",
        name: "Frontend",
        skills: ["React", "Vue.js", "Angular", "TypeScript", "JavaScript", "HTML/CSS"]
      },
      {
        id: "backend",
        name: "Backend",
        skills: ["Node.js", "Python", "Java", "C#", ".NET", "Ruby"]
      },
      {
        id: "mobile",
        name: "Mobile",
        skills: ["React Native", "Flutter", "iOS", "Android", "Kotlin", "Swift"]
      }
    ]
  },
  {
    id: "cloud",
    name: "Cloud",
    subcategories: [
      {
        id: "platforms",
        name: "Platforms",
        skills: ["AWS", "Azure", "Google Cloud", "Oracle Cloud"]
      },
      {
        id: "devops",
        name: "DevOps",
        skills: ["Docker", "Kubernetes", "Jenkins", "GitLab CI/CD", "Terraform"]
      }
    ]
  },
  {
    id: "data",
    name: "Data",
    subcategories: [
      {
        id: "databases",
        name: "Databases",
        skills: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Cassandra"]
      },
      {
        id: "analytics",
        name: "Analytics",
        skills: ["Power BI", "Tableau", "Python", "R", "SQL"]
      }
    ]
  },
  {
    id: "design",
    name: "Design",
    subcategories: [
      {
        id: "ui-ux",
        name: "UI/UX",
        skills: ["Figma", "Adobe XD", "Sketch", "User Research", "Prototyping"]
      }
    ]
  },
  {
    id: "management",
    name: "Management",
    subcategories: [
      {
        id: "project",
        name: "Project Management",
        skills: ["Agile", "Scrum", "JIRA", "Project Planning", "Risk Management"]
      }
    ]
  }
];

export const employeeSkills: Skill[] = [
  {
    id: "1",
    name: "React",
    category: "Development",
    subcategory: "Frontend",
    description: "JavaScript library for building user interfaces",
    proficiencyLevel: "Advanced",
    validationStatus: "Validated",
    lastUpdated: "2026-02-15",
    yearsOfExperience: 4,
    lastUsed: "2026-03-01",
    certifications: ["React Professional Certification"],
    projectTags: ["ITP Dashboard", "Customer Portal"],
    endorsements: 12
  },
  {
    id: "2",
    name: "AWS",
    category: "Cloud",
    subcategory: "Platforms",
    description: "Amazon Web Services cloud platform",
    proficiencyLevel: "Intermediate",
    validationStatus: "Pending validation",
    lastUpdated: "2026-03-05",
    yearsOfExperience: 2,
    lastUsed: "2026-02-28",
    certifications: ["AWS Solutions Architect Associate"],
    projectTags: ["Cloud Migration"],
    endorsements: 5
  },
  {
    id: "3",
    name: "Python",
    category: "Development",
    subcategory: "Backend",
    description: "High-level programming language",
    proficiencyLevel: "Advanced",
    validationStatus: "Validated",
    lastUpdated: "2026-01-20",
    yearsOfExperience: 5,
    lastUsed: "2026-03-10",
    certifications: [],
    projectTags: ["Data Pipeline", "API Gateway"],
    endorsements: 8
  },
  {
    id: "4",
    name: "Figma",
    category: "Design",
    subcategory: "UI/UX",
    description: "Collaborative design tool",
    proficiencyLevel: "Intermediate",
    validationStatus: "Self-assessed",
    lastUpdated: "2026-03-08",
    yearsOfExperience: 1,
    lastUsed: "2026-03-11",
    certifications: [],
    projectTags: ["Design System"],
    endorsements: 3
  },
  {
    id: "5",
    name: "Docker",
    category: "Cloud",
    subcategory: "DevOps",
    description: "Container platform",
    proficiencyLevel: "Beginner",
    validationStatus: "Self-assessed",
    lastUpdated: "2026-03-10",
    yearsOfExperience: 0.5,
    lastUsed: "2026-03-05",
    certifications: [],
    projectTags: [],
    endorsements: 1
  }
];

export const validationRequests: ValidationRequest[] = [
  {
    id: "vr1",
    employeeId: "e1",
    employeeName: "Sarah Johnson",
    skill: {
      id: "s1",
      name: "AWS",
      category: "Cloud",
      subcategory: "Platforms",
      description: "Amazon Web Services cloud platform"
    },
    requestedProficiency: "Intermediate",
    submittedDate: "2026-03-05",
    evidence: ["AWS Solutions Architect Associate Certificate"]
  },
  {
    id: "vr2",
    employeeId: "e2",
    employeeName: "Michael Chen",
    skill: {
      id: "s2",
      name: "Kubernetes",
      category: "Cloud",
      subcategory: "DevOps",
      description: "Container orchestration platform"
    },
    requestedProficiency: "Advanced",
    submittedDate: "2026-03-08",
    evidence: ["CKA Certification", "Project: K8s Migration"]
  },
  {
    id: "vr3",
    employeeId: "e3",
    employeeName: "Emily Rodriguez",
    skill: {
      id: "s3",
      name: "React",
      category: "Development",
      subcategory: "Frontend",
      description: "JavaScript library for building user interfaces"
    },
    requestedProficiency: "Expert",
    submittedDate: "2026-03-09",
    evidence: ["5+ years experience", "Tech Lead on 3 projects"]
  }
];

export const teamMembers: Employee[] = [
  {
    id: "e1",
    name: "Sarah Johnson",
    role: "Senior Developer",
    department: "Engineering",
    skills: [
      { ...employeeSkills[0], proficiencyLevel: "Advanced", validationStatus: "Validated" },
      { ...employeeSkills[1], proficiencyLevel: "Intermediate", validationStatus: "Pending validation" }
    ]
  },
  {
    id: "e2",
    name: "Michael Chen",
    role: "DevOps Engineer",
    department: "Engineering",
    skills: [
      { ...employeeSkills[1], proficiencyLevel: "Advanced", validationStatus: "Validated" },
      { ...employeeSkills[4], proficiencyLevel: "Expert", validationStatus: "Validated" }
    ]
  },
  {
    id: "e3",
    name: "Emily Rodriguez",
    role: "Full Stack Developer",
    department: "Engineering",
    skills: [
      { ...employeeSkills[0], proficiencyLevel: "Expert", validationStatus: "Validated" },
      { ...employeeSkills[2], proficiencyLevel: "Advanced", validationStatus: "Validated" }
    ]
  },
  {
    id: "e4",
    name: "David Kim",
    role: "Frontend Developer",
    department: "Engineering",
    skills: [
      { ...employeeSkills[0], proficiencyLevel: "Intermediate", validationStatus: "Validated" },
      { ...employeeSkills[3], proficiencyLevel: "Advanced", validationStatus: "Validated" }
    ]
  },
  {
    id: "e5",
    name: "Anna Williams",
    role: "Data Analyst",
    department: "Analytics",
    skills: [
      { ...employeeSkills[2], proficiencyLevel: "Advanced", validationStatus: "Validated" }
    ]
  }
];

export const skillDistributionData = [
  { skill: "React", beginner: 2, intermediate: 8, advanced: 15, expert: 5 },
  { skill: "AWS", beginner: 10, intermediate: 12, advanced: 6, expert: 2 },
  { skill: "Python", beginner: 5, intermediate: 10, advanced: 12, expert: 3 },
  { skill: "Docker", beginner: 15, intermediate: 8, advanced: 5, expert: 2 },
  { skill: "Kubernetes", beginner: 12, intermediate: 6, advanced: 3, expert: 1 }
];

export const departmentSkillData = [
  { department: "Engineering", react: 85, aws: 70, python: 65, docker: 60 },
  { department: "Analytics", react: 30, aws: 40, python: 90, docker: 20 },
  { department: "Design", react: 50, aws: 20, python: 25, docker: 15 },
  { department: "Product", react: 40, aws: 30, python: 35, docker: 25 }
];

export const validationStatsData = [
  { name: "Validated", value: 145, color: "#22c55e" },
  { name: "Pending", value: 32, color: "#f59e0b" },
  { name: "Self-assessed", value: 78, color: "#3b82f6" },
  { name: "Rejected", value: 5, color: "#ef4444" }
];

export const projectSkillRequirements = [
  {
    id: "p1",
    projectName: "Cloud Migration Initiative",
    requiredSkills: [
      { name: "AWS", level: "Advanced", count: 3 },
      { name: "Docker", level: "Intermediate", count: 2 },
      { name: "Kubernetes", level: "Advanced", count: 2 }
    ]
  },
  {
    id: "p2",
    projectName: "Customer Portal Redesign",
    requiredSkills: [
      { name: "React", level: "Advanced", count: 4 },
      { name: "TypeScript", level: "Intermediate", count: 4 },
      { name: "Figma", level: "Intermediate", count: 2 }
    ]
  }
];

export const learningRecommendations = [
  {
    id: "l1",
    skillGap: "AWS Advanced",
    currentLevel: "Intermediate",
    targetLevel: "Advanced",
    courses: [
      { name: "AWS Advanced Solutions Architect", provider: "AWS Training", duration: "40 hours" },
      { name: "Cloud Architecture Patterns", provider: "Coursera", duration: "30 hours" }
    ],
    affectedEmployees: 12
  },
  {
    id: "l2",
    skillGap: "Kubernetes Expert",
    currentLevel: "Advanced",
    targetLevel: "Expert",
    courses: [
      { name: "Certified Kubernetes Administrator (CKA)", provider: "Linux Foundation", duration: "80 hours" },
      { name: "Advanced K8s Operations", provider: "Udemy", duration: "25 hours" }
    ],
    affectedEmployees: 5
  },
  {
    id: "l3",
    skillGap: "React Expert",
    currentLevel: "Advanced",
    targetLevel: "Expert",
    courses: [
      { name: "Advanced React Patterns", provider: "Frontend Masters", duration: "20 hours" },
      { name: "React Performance Optimization", provider: "Egghead", duration: "15 hours" }
    ],
    affectedEmployees: 8
  }
];
