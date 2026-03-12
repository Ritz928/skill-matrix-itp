import { createBrowserRouter } from "react-router";
import { SkillMatrixLayout } from "./components/SkillMatrixLayout";
import { Dashboard } from "./pages/Dashboard";
import { EmployeeSkills } from "./pages/EmployeeSkills";
import { SkillValidation } from "./pages/SkillValidation";
import { SkillTaxonomy } from "./pages/SkillTaxonomy";
import { TeamSkills } from "./pages/TeamSkills";
import { SkillAnalytics } from "./pages/SkillAnalytics";
import { ProjectMatching } from "./pages/ProjectMatching";
import { LearningDevelopment } from "./pages/LearningDevelopment";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SkillMatrixLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "employee-skills", Component: EmployeeSkills },
      { path: "team-skills", Component: TeamSkills },
      { path: "skill-validation", Component: SkillValidation },
      { path: "skill-taxonomy", Component: SkillTaxonomy },
      { path: "skill-analytics", Component: SkillAnalytics },
      { path: "project-matching", Component: ProjectMatching },
      { path: "learning-development", Component: LearningDevelopment },
    ],
  },
]);
