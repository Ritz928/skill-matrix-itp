import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  User,
  Users,
  CheckCircle,
  FolderTree,
  BarChart3,
  Briefcase,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Menu,
  Bell,
  Settings,
  Search
} from "lucide-react";

const navigationItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/employee-skills", label: "Employee Skills", icon: User },
  { path: "/team-skills", label: "Team Skills", icon: Users },
  { path: "/skill-validation", label: "Skill Validation", icon: CheckCircle },
  { path: "/skill-taxonomy", label: "Skill Taxonomy", icon: FolderTree },
  { path: "/skill-analytics", label: "Skill Analytics", icon: BarChart3 },
  { path: "/project-matching", label: "Project Skill Matching", icon: Briefcase },
  { path: "/learning-development", label: "Learning & Development", icon: GraduationCap }
];

export function SkillMatrixLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? "w-20" : "w-64"
        } bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          {!sidebarCollapsed && (
            <div>
              <h1 className="font-semibold text-xl text-gray-900">In Time Pro</h1>
              <p className="text-xs text-gray-500">Skill Matrix</p>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="text-2xl font-bold text-blue-600">ITP</div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="h-12 flex items-center justify-center border-t border-gray-200 hover:bg-gray-50 transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden />
              <input
                type="text"
                placeholder="Search skills, employees, projects..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Search skills, employees, projects"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" aria-hidden />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" aria-label="Settings">
              <Settings className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                JD
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium text-gray-900">John Doe</div>
                <div className="text-xs text-gray-500">Manager</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
