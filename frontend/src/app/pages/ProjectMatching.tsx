import React, { useState, useEffect } from "react";
import { Breadcrumb } from "../components/Breadcrumb";
import { SkillBadge } from "../components/SkillBadge";
import { ValidationStatusBadge } from "../components/ValidationStatusBadge";
import { CreateProjectModal } from "../components/CreateProjectModal";
import { ConfirmModal } from "../components/ConfirmModal";
import { Search, Plus, Award, CheckCircle, Target, Filter, Users as UsersIcon, Briefcase, Pencil, Trash2 } from "lucide-react";
import { useDataStore } from "../store/dataStore";
import type { Project } from "../store/dataStore";

const PROFICIENCY_RANK: Record<string, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4
};

const getProficiencyRank = (level?: string) => PROFICIENCY_RANK[level ?? ""] ?? 0;

export function ProjectMatching() {
  const teamMembers = useDataStore(s => s.teamMembers);
  const projectSkillRequirements = useDataStore(s => s.projectSkillRequirements);
  const addProject = useDataStore(s => s.addProject);
  const updateProject = useDataStore(s => s.updateProject);
  const deleteProject = useDataStore(s => s.deleteProject);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [filterProficiency, setFilterProficiency] = useState("All");
  const [filterValidation, setFilterValidation] = useState("All");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const selectedProject =
    projectSkillRequirements.find(p => p.id === selectedProjectId) ??
    projectSkillRequirements[0] ??
    null;

  useEffect(() => {
    if (projectSkillRequirements.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projectSkillRequirements[0].id);
    }
    if (selectedProjectId && !projectSkillRequirements.some(p => p.id === selectedProjectId)) {
      setSelectedProjectId(projectSkillRequirements[0]?.id ?? null);
    }
  }, [projectSkillRequirements, selectedProjectId]);

  const handleCreateProject = (data: { projectName: string; requiredSkills: { name: string; level: string; count: number }[]; id?: string }) => {
    if (data.id) {
      updateProject(data.id, { projectName: data.projectName, requiredSkills: data.requiredSkills });
    } else {
      addProject({ projectName: data.projectName, requiredSkills: data.requiredSkills });
    }
    setEditingProject(null);
    setIsCreateModalOpen(false);
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingProject(null);
  };

  const handleDeleteProjectClick = (project: Project) => {
    setProjectToDelete(project);
  };

  const handleConfirmDeleteProject = () => {
    if (!projectToDelete) return;
    if (selectedProjectId === projectToDelete.id) {
      const next = projectSkillRequirements.filter(p => p.id !== projectToDelete.id);
      setSelectedProjectId(next[0]?.id ?? null);
    }
    deleteProject(projectToDelete.id);
    setProjectToDelete(null);
  };

  const toggleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployees(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const buildProjectMatchData = (employee: typeof teamMembers[number], project: Project | null) => {
    if (!project) return null;
    const totalRequired = project.requiredSkills.reduce((sum, req) => sum + req.count, 0);
    let matchedUnits = 0;

    project.requiredSkills.forEach(req => {
      const employeeSkill = employee.skills.find(s => s.name.toLowerCase() === req.name.toLowerCase());
      if (!employeeSkill) return;
      const employeeRank = getProficiencyRank(employeeSkill.proficiencyLevel);
      const reqRank = getProficiencyRank(req.level);
      if (employeeRank >= reqRank) {
        matchedUnits += req.count;
      }
    });

    const score = totalRequired ? Math.round((matchedUnits / totalRequired) * 100) : 0;
    const relevantSkills = employee.skills.filter(s =>
      project.requiredSkills.some(req => req.name.toLowerCase() === s.name.toLowerCase())
    );

    return { employee, score, matchedUnits, totalRequired, relevantSkills };
  };

  const projectMatches = selectedProject
    ? teamMembers
      .map(employee => buildProjectMatchData(employee, selectedProject))
      .filter((m): m is NonNullable<typeof m> => m !== null)
      .filter(match => match.score > 0)
      .sort((a, b) => b.score - a.score)
    : [];

  const filteredMatches = projectMatches.filter(match => {
    if (filterDepartment !== "All" && match.employee.department !== filterDepartment) return false;
    if (
      filterProficiency !== "All" &&
      !match.relevantSkills.some(s => s.proficiencyLevel === filterProficiency)
    ) {
      return false;
    }
    if (
      filterValidation !== "All" &&
      !match.relevantSkills.some(s => s.validationStatus === filterValidation)
    ) {
      return false;
    }
    return true;
  });

  const totalMatches = projectMatches.length;
  const avgMatchScore = totalMatches
    ? Math.round(projectMatches.reduce((sum, m) => sum + m.score, 0) / totalMatches)
    : 0;
  const resourcesAssigned = selectedEmployees.length;

  return (
    <div className="p-8">
      <Breadcrumb items={["Skill Matrix", "Project Skill Matching"]} />

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
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600">Active Projects</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{projectSkillRequirements.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <UsersIcon className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Total Matches Found</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{totalMatches}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-gray-600">Avg. Match Score</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {avgMatchScore}%
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-gray-600">Resources Assigned</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{resourcesAssigned}</p>
        </div>
      </div>

      {projectSkillRequirements.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
          <p className="text-gray-600 mb-4">No projects yet. Create a project to see skill matching.</p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Project
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {projectSkillRequirements.map((project) => (
              <div
                key={project.id}
                className={`p-6 rounded-xl border-2 text-left transition-all flex items-start justify-between gap-2 ${
                  selectedProject?.id === project.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <button
                  onClick={() => setSelectedProjectId(project.id)}
                  className="flex-1 min-w-0"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 truncate">{project.projectName}</h3>
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
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); openEditModal(project); }}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    title="Edit project"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteProjectClick(project); }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {selectedProject && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                            <SkillBadge level={skill.level as "Beginner" | "Intermediate" | "Advanced" | "Expert"} size="sm" />
                          </div>
                          <p className="text-sm text-gray-600">
                            {skill.count} resource{skill.count > 1 ? "s" : ""} needed
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200 flex items-center gap-3">
                    <button
                      onClick={() => openEditModal(selectedProject)}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProjectClick(selectedProject)}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                  <div className="pt-4 border-t border-gray-200 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Resources</span>
                      <span className="font-semibold text-gray-900">
                        {selectedProject.requiredSkills.reduce((sum, s) => sum + s.count, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

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
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden />
                        <input
                          type="text"
                          placeholder="Search..."
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label="Search recommended employees"
                        />
                      </div>
                    </div>
                  </div>

                  {showFilters && (
                    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="filter-proficiency">
                          Proficiency Level
                        </label>
                        <select
                          id="filter-proficiency"
                          value={filterProficiency}
                          onChange={(e) => setFilterProficiency(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label="Filter by proficiency level"
                        >
                          <option value="All">All Levels</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="filter-validation">
                          Validation Status
                        </label>
                        <select
                          id="filter-validation"
                          value={filterValidation}
                          onChange={(e) => setFilterValidation(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label="Filter by validation status"
                        >
                          <option value="All">All Status</option>
                          <option value="Validated">Validated</option>
                          <option value="Self-assessed">Self-assessed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="filter-department">
                          Department
                        </label>
                        <select
                          id="filter-department"
                          value={filterDepartment}
                          onChange={(e) => setFilterDepartment(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label="Filter by department"
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

                {selectedEmployees.length > 0 && (
                  <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-900">
                        {selectedEmployees.length} employee{selectedEmployees.length > 1 ? "s" : ""} selected
                      </p>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        Assign to Project
                      </button>
                    </div>
                  </div>
                )}

                <div className="divide-y divide-gray-200">
                  {filteredMatches.map((match) => {
                    const employee = match.employee;
                    const isSelected = selectedEmployees.includes(employee.id);
                    return (
                      <div key={employee.id} className={`p-6 transition-colors ${isSelected ? "bg-blue-50" : "hover:bg-gray-50"}`}>
                        <div className="flex items-start gap-4 mb-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleEmployeeSelection(employee.id)}
                            className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            aria-label={`Select ${employee.name} for project`}
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
                        <div className="ml-8 mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Relevant Skills</p>
                          <div className="space-y-2">
                            {employee.skills.map((skill, index) => (
                              <div key={index} className="flex items-center gap-3">
                                <span className="text-sm text-gray-900 min-w-[120px]">{skill.name}</span>
                                <SkillBadge level={skill.proficiencyLevel!} size="sm" />
                                {skill.validationStatus && (
                                  <ValidationStatusBadge status={skill.validationStatus} />
                                )}
                                {skill.yearsOfExperience != null && (
                                  <span className="text-xs text-gray-500">{skill.yearsOfExperience}y exp</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
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

                <div className="p-4 border-t border-gray-200 text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All Matches ({teamMembers.length} employees)
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateProject}
        initialProject={editingProject ?? undefined}
      />

      <ConfirmModal
        isOpen={projectToDelete !== null}
        onClose={() => setProjectToDelete(null)}
        title="Delete project?"
        message={
          projectToDelete
            ? `Delete project "${projectToDelete.projectName}"? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        onConfirm={handleConfirmDeleteProject}
        variant="danger"
      />
    </div>
  );
}
