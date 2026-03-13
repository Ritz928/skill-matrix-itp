import React from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { ProtectedLayout } from "./components/ProtectedLayout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { EmployeeSkills } from "./pages/EmployeeSkills";
import { SkillValidation } from "./pages/SkillValidation";
import { SkillTaxonomy } from "./pages/SkillTaxonomy";
import { TeamSkills } from "./pages/TeamSkills";
import { SkillAnalytics } from "./pages/SkillAnalytics";
import { ProjectMatching } from "./pages/ProjectMatching";
import { LearningDevelopment } from "./pages/LearningDevelopment";

export const router = createBrowserRouter([
  { path: "/login", Component: Login },
  {
    path: "/",
    Component: ProtectedLayout,
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
  { path: "*", element: React.createElement(Navigate, { to: "/", replace: true }) },
]);
