import { Breadcrumb } from "../components/Breadcrumb";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { TrendingUp, Download, Calendar } from "lucide-react";
import { departmentSkillData } from "../data/mockData";
import React from "react";

const radarData = [
  { skill: "React", Engineering: 85, Design: 50, Analytics: 30, Product: 40 },
  { skill: "AWS", Engineering: 70, Design: 20, Analytics: 40, Product: 30 },
  { skill: "Python", Engineering: 65, Design: 25, Analytics: 90, Product: 35 },
  { skill: "Figma", Engineering: 40, Design: 95, Analytics: 20, Product: 60 },
  { skill: "SQL", Engineering: 60, Design: 15, Analytics: 85, Product: 50 },
];

const heatmapData = [
  { department: "Engineering", react: 85, aws: 70, python: 65, docker: 60, kubernetes: 55 },
  { department: "Analytics", react: 30, aws: 40, python: 90, docker: 20, kubernetes: 15 },
  { department: "Design", react: 50, aws: 20, python: 25, docker: 15, kubernetes: 10 },
  { department: "Product", react: 40, aws: 30, python: 35, docker: 25, kubernetes: 20 },
];

const getHeatmapColor = (value: number) => {
  if (value >= 80) return "bg-green-600 text-white";
  if (value >= 60) return "bg-green-400 text-white";
  if (value >= 40) return "bg-amber-400 text-gray-900";
  if (value >= 20) return "bg-orange-400 text-gray-900";
  return "bg-red-400 text-white";
};

export function SkillAnalytics() {
  return (
    <div className="p-8">
      <Breadcrumb items={["Skill Matrix", "Skill Analytics"]} />

      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Skill Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Analyze workforce capabilities and identify skill gaps across departments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="w-5 h-5" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Skill Coverage</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">78%</p>
          <p className="text-sm text-green-600 mt-1">+5% from last month</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Critical Skill Gaps</p>
          <p className="text-3xl font-semibold text-gray-900">12</p>
          <p className="text-sm text-amber-600 mt-1">Requires attention</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Avg. Skills per Employee</p>
          <p className="text-3xl font-semibold text-gray-900">5.2</p>
          <p className="text-sm text-green-600 mt-1">+0.8 from last quarter</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Validation Rate</p>
          <p className="text-3xl font-semibold text-gray-900">85%</p>
          <p className="text-sm text-blue-600 mt-1">Above target (80%)</p>
        </div>
      </div>

      {/* Department Skill Comparison */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Department Skill Distribution
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={departmentSkillData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="department" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} label={{ value: 'Proficiency %', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="react" fill="#3b82f6" name="React" />
            <Bar dataKey="aws" fill="#f59e0b" name="AWS" />
            <Bar dataKey="python" fill="#8b5cf6" name="Python" />
            <Bar dataKey="docker" fill="#22c55e" name="Docker" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Radar Chart and Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Radar Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Department Skill Capability Radar
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar name="Engineering" dataKey="Engineering" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              <Radar name="Analytics" dataKey="Analytics" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              <Radar name="Design" dataKey="Design" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Gap Analysis */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Critical Skill Gaps
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-900">Kubernetes Advanced</p>
                <span className="px-2 py-1 bg-red-600 text-white text-xs rounded">Critical</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Only 3 employees with advanced proficiency
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">15% coverage (Target: 50%)</p>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-900">Cloud Architecture</p>
                <span className="px-2 py-1 bg-amber-600 text-white text-xs rounded">High</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Growing demand, limited experts
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-amber-600 h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">35% coverage (Target: 60%)</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-900">Machine Learning</p>
                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">Medium</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Emerging need for AI/ML capabilities
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">25% coverage (Target: 40%)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Organization Skill Heatmap */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Organization Skill Heatmap
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Department proficiency levels across key skills (%)
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-3 bg-gray-50 border border-gray-200 font-medium text-gray-700">
                  Department
                </th>
                <th className="p-3 bg-gray-50 border border-gray-200 font-medium text-gray-700">
                  React
                </th>
                <th className="p-3 bg-gray-50 border border-gray-200 font-medium text-gray-700">
                  AWS
                </th>
                <th className="p-3 bg-gray-50 border border-gray-200 font-medium text-gray-700">
                  Python
                </th>
                <th className="p-3 bg-gray-50 border border-gray-200 font-medium text-gray-700">
                  Docker
                </th>
                <th className="p-3 bg-gray-50 border border-gray-200 font-medium text-gray-700">
                  Kubernetes
                </th>
              </tr>
            </thead>
            <tbody>
              {heatmapData.map((row, index) => (
                <tr key={index}>
                  <td className="p-3 border border-gray-200 font-medium text-gray-900">
                    {row.department}
                  </td>
                  <td className="p-3 border border-gray-200">
                    <div className={`px-3 py-2 rounded text-center font-medium ${getHeatmapColor(row.react)}`}>
                      {row.react}%
                    </div>
                  </td>
                  <td className="p-3 border border-gray-200">
                    <div className={`px-3 py-2 rounded text-center font-medium ${getHeatmapColor(row.aws)}`}>
                      {row.aws}%
                    </div>
                  </td>
                  <td className="p-3 border border-gray-200">
                    <div className={`px-3 py-2 rounded text-center font-medium ${getHeatmapColor(row.python)}`}>
                      {row.python}%
                    </div>
                  </td>
                  <td className="p-3 border border-gray-200">
                    <div className={`px-3 py-2 rounded text-center font-medium ${getHeatmapColor(row.docker)}`}>
                      {row.docker}%
                    </div>
                  </td>
                  <td className="p-3 border border-gray-200">
                    <div className={`px-3 py-2 rounded text-center font-medium ${getHeatmapColor(row.kubernetes)}`}>
                      {row.kubernetes}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-end gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <span className="text-gray-600">80-100% (Excellent)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <span className="text-gray-600">60-79% (Good)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-400 rounded"></div>
            <span className="text-gray-600">40-59% (Fair)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-400 rounded"></div>
            <span className="text-gray-600">20-39% (Low)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400 rounded"></div>
            <span className="text-gray-600">0-19% (Critical)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
