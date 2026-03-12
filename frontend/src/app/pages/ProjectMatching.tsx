import { useState } from "react";
import { Breadcrumb } from "../components/Breadcrumb";
import { SkillBadge } from "../components/SkillBadge";
import { ValidationStatusBadge } from "../components/ValidationStatusBadge";
import { CreateProjectModal } from "../components/CreateProjectModal";
import { Search, Plus, Award, CheckCircle, Target, Filter, Users as UsersIcon, Briefcase } from "lucide-react";
import { teamMembers, projectSkillRequirements } from "../data/mockData";
import React from "react";

const matchScores = [
  { employeeId: "e2", score: 95 },
  { employeeId: "e1", score: 85 },
  { employeeId: "e3", score: 75 },
  { employeeId: "e4", score: 60 },
];

export function ProjectMatching() {
  const [selectedProject, setSelectedProject] = useState(projectSkillRequirements[0]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterProficiency, setFilterProficiency] = useState("All");
  const [filterValidation, setFilterValidation] = useState("All");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const handleCreateProject = (projectData: any) => {
    console.log("Creating project:", projectData);
    // Here you would normally save the project and trigger skill matching
  };

  const toggleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const filteredMatches = matchScores.filter(match => {
    const employee = teamMembers.find(m => m.id === match.employeeId);
    if (!employee) return false;

    if (filterDepartment !== "All" && employee.department !== filterDepartment) return false;
    
    // Add more filters as needed
    return true;
  });

  return (
    <div className="p-8">
      <Breadcrumb items={["Skill Matrix", "Project Skill Matching"]} />

      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Project Skill Matching
          </h1>
          <p className="text-gray-600">
            Find the best employees for your projects based on skills
          </p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600">Active Projects</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">8</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <UsersIcon className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Total Matches Found</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{filteredMatches.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-gray-600">Avg. Match Score</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {Math.round(matchScores.reduce((sum, m) => sum + m.score, 0) / matchScores.length)}%
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-gray-600">Resources Assigned</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">24</p>
        </div>
      </div>

      {/* Project Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {projectSkillRequirements.map((project) => (
          <button
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className={`p-6 rounded-xl border-2 text-left transition-all ${
              selectedProject.id === project.id
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">{project.projectName}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              {project.requiredSkills.length} skills required
            </p>
            <div className="space-y-2">
              {project.requiredSkills.slice(0, 2).map((skill, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{skill.name}</span>
                  <span className="text-gray-500">{skill.count}x {skill.level}</span>
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Project Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Requirements */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Project Requirements
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Project Name</p>
              <p className="text-gray-900">{selectedProject.projectName}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Required Skills</p>
              <div className="space-y-3">
                {selectedProject.requiredSkills.map((skill, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{skill.name}</span>
                      <SkillBadge level={skill.level as any} size="sm" />
                    </div>
                    <p className="text-sm text-gray-600">
                      {skill.count} resource{skill.count > 1 ? 's' : ''} needed
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Resources</span>
                <span className="font-semibold text-gray-900">
                  {selectedProject.requiredSkills.reduce((sum, s) => sum + s.count, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Matched Employees */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recommended Employees
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Proficiency Level
                  </label>
                  <select
                    value={filterProficiency}
                    onChange={(e) => setFilterProficiency(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Validation Status
                  </label>
                  <select
                    value={filterValidation}
                    onChange={(e) => setFilterValidation(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All Status</option>
                    <option value="Validated">Validated</option>
                    <option value="Self-assessed">Self-assessed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Analytics">Analytics</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Selected Count */}
          {selectedEmployees.length > 0 && (
            <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-blue-900">
                  {selectedEmployees.length} employee{selectedEmployees.length > 1 ? 's' : ''} selected
                </p>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Assign to Project
                </button>
              </div>
            </div>
          )}

          <div className="divide-y divide-gray-200">
            {filteredMatches.map((match) => {
              const employee = teamMembers.find(m => m.id === match.employeeId);
              if (!employee) return null;

              const isSelected = selectedEmployees.includes(employee.id);

              return (
                <div key={employee.id} className={`p-6 transition-colors ${isSelected ? "bg-blue-50" : "hover:bg-gray-50"}`}>
                  <div className="flex items-start gap-4 mb-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleEmployeeSelection(employee.id)}
                      className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <div className="flex items-start justify-between flex-1">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium text-lg">
                          {employee.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{employee.name}</p>
                          <p className="text-sm text-gray-600">{employee.role} • {employee.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Award className="w-4 h-4 text-green-600" />
                          <span className="text-2xl font-semibold text-green-600">{match.score}%</span>
                        </div>
                        <p className="text-xs text-gray-600">Match Score</p>
                      </div>
                    </div>
                  </div>

                  {/* Employee Skills */}
                  <div className="ml-8 mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Relevant Skills</p>
                    <div className="space-y-2">
                      {employee.skills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <span className="text-sm text-gray-900 min-w-[120px]">
                            {skill.name}
                          </span>
                          <SkillBadge level={skill.proficiencyLevel!} size="sm" />
                          {skill.validationStatus && (
                            <ValidationStatusBadge status={skill.validationStatus} />
                          )}
                          {skill.yearsOfExperience && (
                            <span className="text-xs text-gray-500">
                              {skill.yearsOfExperience}y exp
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Match Details */}
                  <div className="ml-8 grid grid-cols-3 gap-4 p-3 bg-white rounded-lg mb-4 border border-gray-200">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Skill Match</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {employee.skills.length}/{selectedProject.requiredSkills.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Validation</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {employee.skills.filter(s => s.validationStatus === "Validated").length} Validated
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Availability</p>
                      <p className="text-sm font-semibold text-green-600">Available</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="ml-8 flex items-center gap-3">
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Assign to Project
                    </button>
                    <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                      View Profile
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View All */}
          <div className="p-4 border-t border-gray-200 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All Matches ({teamMembers.length} employees)
            </button>
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
}