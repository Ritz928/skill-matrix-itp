import React from "react";
import { useLocation, Navigate } from "react-router";
import { useAuthStore } from "../store/authStore";
import { SkillMatrixLayout } from "./SkillMatrixLayout";

/**
 * Wraps the app layout: redirects to /login if not authenticated,
 * and redirects Employee role to /employee-skills when accessing other paths.
 */
export function ProtectedLayout() {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  const pathname = location.pathname;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: pathname }} />;
  }
  if (user.role === "Employee" && pathname !== "/employee-skills") {
    return <Navigate to="/employee-skills" replace />;
  }
  return <SkillMatrixLayout />;
}
