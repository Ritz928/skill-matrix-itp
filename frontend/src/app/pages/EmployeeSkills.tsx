import { useState } from "react";
import { Breadcrumb } from "../components/Breadcrumb";
import { SkillBadge } from "../components/SkillBadge";
import { ValidationStatusBadge } from "../components/ValidationStatusBadge";
import { AddSkillModal } from "../components/AddSkillModal";
import { Plus, FileText, Calendar, Award, Paperclip, ThumbsUp } from "lucide-react";
import { employeeSkills } from "../data/mockData";
import React from "react";

export function EmployeeSkills() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-8">
      <Breadcrumb items={["Skill Matrix", "Employee Skills"]} />

      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            My Skill Profile
          </h1>
          <p className="text-gray-600">
            Manage your skills, certifications, and request validation
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Skill
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600">Total Skills</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{employeeSkills.length}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <ThumbsUp className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Validated</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {employeeSkills.filter(s => s.validationStatus === "Validated").length}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {employeeSkills.filter(s => s.validationStatus === "Pending validation").length}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-gray-600">Endorsements</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {employeeSkills.reduce((sum, skill) => sum + (skill.endorsements || 0), 0)}
          </p>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {employeeSkills.map((skill) => (
          <div key={skill.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
            {/* Skill Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {skill.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {skill.category} • {skill.subcategory}
                </p>
              </div>
              {skill.validationStatus && (
                <ValidationStatusBadge status={skill.validationStatus} />
              )}
            </div>

            {/* Proficiency */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Proficiency Level</p>
              {skill.proficiencyLevel && <SkillBadge level={skill.proficiencyLevel} />}
            </div>

            {/* Experience Details */}
            <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  Years of Experience
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {skill.yearsOfExperience} years
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  Last Used
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {skill.lastUsed}
                </p>
              </div>
            </div>

            {/* Certifications & Projects */}
            {skill.certifications && skill.certifications.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Paperclip className="w-4 h-4" />
                  Certifications
                </div>
                <div className="flex flex-wrap gap-2">
                  {skill.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {skill.projectTags && skill.projectTags.length > 0 && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">Project Experience</p>
                <div className="flex flex-wrap gap-2">
                  {skill.projectTags.map((project, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                    >
                      {project}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Endorsements */}
            {skill.endorsements && skill.endorsements > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ThumbsUp className="w-4 h-4 text-green-600" />
                <span>{skill.endorsements} endorsements</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Edit
              </button>
              <button className="text-sm font-medium text-gray-600 hover:text-gray-700">
                Upload Evidence
              </button>
              {skill.validationStatus === "Self-assessed" && (
                <button className="text-sm font-medium text-green-600 hover:text-green-700">
                  Submit for Validation
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Skill Modal */}
      <AddSkillModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
