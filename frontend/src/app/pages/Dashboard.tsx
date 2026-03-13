import { Breadcrumb } from "../components/Breadcrumb";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, CheckCircle, Clock, Award, Target } from "lucide-react";
import { useDataStore } from "../store/dataStore";
import { Link } from "react-router";
import React from "react";

export function Dashboard() {
  const teamMembers = useDataStore((s) => s.teamMembers);
  const validationRequests = useDataStore((s) => s.validationRequests);
  const skillDistributionData = useDataStore((s) => s.skillDistributionData);
  const validationStatsData = useDataStore((s) => s.validationStatsData);

  const totalSkills = teamMembers.reduce((sum, m) => sum + m.skills.length, 0);
  const activeEmployees = teamMembers.length;
  const validatedCount = validationStatsData.find((s) => s.name === "Validated")?.value ?? 0;
  const pendingCount = validationRequests.length;

  const stats = [
    {
      label: "Total Skills Registered",
      value: String(totalSkills),
      change: "",
      trend: "neutral" as const,
      icon: Award,
      color: "blue"
    },
    {
      label: "Active Employees",
      value: String(activeEmployees),
      change: "",
      trend: "neutral" as const,
      icon: Users,
      color: "green"
    },
    {
      label: "Validated Skills",
      value: String(validatedCount),
      change: "",
      trend: "neutral" as const,
      icon: CheckCircle,
      color: "purple"
    },
    {
      label: "Pending Validations",
      value: String(pendingCount),
      change: "",
      trend: "neutral" as const,
      icon: Clock,
      color: "amber"
    }
  ];

  return (
    <div className="p-8">
      <Breadcrumb items={["Skill Matrix", "Dashboard"]} />

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Skill Matrix Dashboard
        </h1>
        <p className="text-gray-600">
          Overview of organizational skills, validation status, and workforce capabilities
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: "bg-blue-100 text-blue-600",
            green: "bg-green-100 text-green-600",
            purple: "bg-purple-100 text-purple-600",
            amber: "bg-amber-100 text-amber-600"
          };

          return (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                {stat.change && (
                  <span className={`text-sm font-medium ${
                    stat.trend === "up" ? "text-green-600" :
                    stat.trend === "down" ? "text-red-600" :
                    "text-gray-600"
                  }`}>
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Skill Distribution Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Skills by Proficiency Level
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillDistributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="skill" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="beginner" fill="#9ca3af" name="Beginner" />
              <Bar dataKey="intermediate" fill="#3b82f6" name="Intermediate" />
              <Bar dataKey="advanced" fill="#8b5cf6" name="Advanced" />
              <Bar dataKey="expert" fill="#22c55e" name="Expert" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Validation Status Pie Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Validation Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={validationStatsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {validationStatsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              to="/employee-skills"
              className="w-full flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
            >
              <div className="p-2 bg-blue-600 rounded-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Add New Skill</p>
                <p className="text-sm text-gray-600">Register a new skill to your profile</p>
              </div>
            </Link>

            <Link
              to="/skill-validation"
              className="w-full flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left"
            >
              <div className="p-2 bg-purple-600 rounded-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Review Validations</p>
                <p className="text-sm text-gray-600">
                  {pendingCount} pending validation request{pendingCount !== 1 ? "s" : ""}
                </p>
              </div>
            </Link>

            <Link
              to="/project-matching"
              className="w-full flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left"
            >
              <div className="p-2 bg-green-600 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Match Project Skills</p>
                <p className="text-sm text-gray-600">Find employees for new projects</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Sarah Johnson's</span> AWS skill was validated as Intermediate
                </p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Michael Chen</span> submitted Kubernetes for validation
                </p>
                <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Emily Rodriguez</span> added 3 new skills
                </p>
                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  New project <span className="font-medium">Cloud Migration</span> requires 5 AWS experts
                </p>
                <p className="text-xs text-gray-500 mt-1">2 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
