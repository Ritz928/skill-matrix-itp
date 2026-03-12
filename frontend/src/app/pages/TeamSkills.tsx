import { Breadcrumb } from "../components/Breadcrumb";
import { SkillBadge } from "../components/SkillBadge";
import { ValidationStatusBadge } from "../components/ValidationStatusBadge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Filter, Download, Users } from "lucide-react";
import { useDataStore } from "../store/dataStore";
import React from "react";

export function TeamSkills() {
  const teamMembers = useDataStore(s => s.teamMembers);
  const skillDistributionData = useDataStore(s => s.skillDistributionData);
  return (
    <div className="p-8">
      <Breadcrumb items={["Skill Matrix", "Team Skills"]} />

      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Team Skill Overview
          </h1>
          <p className="text-gray-600">
            View and compare skills across your team members
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600">Team Members</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{teamMembers.length}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Unique Skills</p>
          <p className="text-3xl font-semibold text-gray-900">24</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Expert Level Skills</p>
          <p className="text-3xl font-semibold text-gray-900">12</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Validated Skills</p>
          <p className="text-3xl font-semibold text-gray-900">89%</p>
        </div>
      </div>

      {/* Skill Distribution Chart */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Team Skill Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={skillDistributionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="skill" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="beginner" fill="#9ca3af" name="Beginner" stackId="a" />
            <Bar dataKey="intermediate" fill="#3b82f6" name="Intermediate" stackId="a" />
            <Bar dataKey="advanced" fill="#8b5cf6" name="Advanced" stackId="a" />
            <Bar dataKey="expert" fill="#22c55e" name="Expert" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Team Members Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">Team Members & Skills</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Skills
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {member.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {member.department}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      {member.skills.slice(0, 2).map((skill, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-sm text-gray-900 min-w-[100px]">
                            {skill.name}
                          </span>
                          <SkillBadge level={skill.proficiencyLevel!} size="sm" />
                          {skill.validationStatus && (
                            <ValidationStatusBadge status={skill.validationStatus} />
                          )}
                        </div>
                      ))}
                      {member.skills.length > 2 && (
                        <button className="text-sm text-blue-600 hover:text-blue-700 text-left">
                          +{member.skills.length - 2} more skills
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Skill Experts Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            React Experts
          </h3>
          <div className="space-y-3">
            {teamMembers
              .filter(m => m.skills.some(s => s.name === "React"))
              .map((member) => {
                const reactSkill = member.skills.find(s => s.name === "React");
                return (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    </div>
                    {reactSkill?.proficiencyLevel && (
                      <SkillBadge level={reactSkill.proficiencyLevel} size="sm" />
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            AWS Experts
          </h3>
          <div className="space-y-3">
            {teamMembers
              .filter(m => m.skills.some(s => s.name === "AWS"))
              .map((member) => {
                const awsSkill = member.skills.find(s => s.name === "AWS");
                return (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    </div>
                    {awsSkill?.proficiencyLevel && (
                      <SkillBadge level={awsSkill.proficiencyLevel} size="sm" />
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
