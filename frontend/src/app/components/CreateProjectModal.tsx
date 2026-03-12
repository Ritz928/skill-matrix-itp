import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type { ProficiencyLevel } from "../data/mockData";
import type { Project, ProjectRequiredSkill } from "../store/dataStore";
import { useDataStore } from "../store/dataStore";
import React from "react";

type SkillRequirement = {
  id: string;
  category: string;
  subcategory: string;
  skillName: string;
  proficiencyLevel: ProficiencyLevel;
  priority: "High" | "Medium" | "Low";
  count: number;
};

type CreateProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { projectName: string; requiredSkills: ProjectRequiredSkill[]; id?: string }) => void;
  initialProject?: Project | null;
};

export function CreateProjectModal({ isOpen, onClose, onSubmit, initialProject }: CreateProjectModalProps) {
  const skillCategories = useDataStore(s => s.skillCategories);

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [projectManager, setProjectManager] = useState("");
  const [skillRequirements, setSkillRequirements] = useState<SkillRequirement[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (!isOpen) return;
    if (initialProject) {
      setProjectName(initialProject.projectName);
      setSkillRequirements(
        initialProject.requiredSkills.map((s, i) => ({
          id: `req-${i}-${Date.now()}`,
          category: "",
          subcategory: "",
          skillName: s.name,
          proficiencyLevel: s.level as ProficiencyLevel,
          priority: "Medium" as const,
          count: s.count
        }))
      );
    } else {
      setProjectName("");
      setProjectDescription("");
      setDepartment("");
      setStartDate("");
      setEndDate("");
      setProjectManager("");
      setSkillRequirements([]);
      setCurrentStep(1);
    }
  }, [isOpen, initialProject]);

  const addSkillRequirement = () => {
    const newRequirement: SkillRequirement = {
      id: Date.now().toString(),
      category: "",
      subcategory: "",
      skillName: "",
      proficiencyLevel: "Intermediate",
      priority: "Medium",
      count: 1
    };
    setSkillRequirements([...skillRequirements, newRequirement]);
  };

  const updateSkillRequirement = (id: string, field: keyof SkillRequirement, value: SkillRequirement[keyof SkillRequirement]) => {
    setSkillRequirements(reqs =>
      reqs.map(req => {
        if (req.id === id) {
          const updated = { ...req, [field]: value } as SkillRequirement;
          // Reset dependent fields when category or subcategory changes
          if (field === "category") {
            updated.subcategory = "";
            updated.skillName = "";
          } else if (field === "subcategory") {
            updated.skillName = "";
          }
          return updated;
        }
        return req;
      })
    );
  };

  const removeSkillRequirement = (id: string) => {
    setSkillRequirements(reqs => reqs.filter(req => req.id !== id));
  };

  const handleSubmit = () => {
    const requiredSkills: ProjectRequiredSkill[] = skillRequirements.map(r => ({
      name: r.skillName,
      level: r.proficiencyLevel,
      count: r.count
    }));
    onSubmit({
      projectName,
      requiredSkills,
      ...(initialProject?.id && { id: initialProject.id })
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {initialProject ? "Edit Project" : "Create New Project"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Step {currentStep} of 2: {currentStep === 1 ? "Project Details" : "Skill Requirements"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2">
            <div className={`flex-1 h-2 rounded-full ${currentStep >= 1 ? "bg-blue-600" : "bg-gray-200"}`}></div>
            <div className={`flex-1 h-2 rounded-full ${currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Step 1: Project Details */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="create-project-name">
                  Project Name *
                </label>
                <input
                  id="create-project-name"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., Cloud Migration Initiative"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="create-project-description">
                  Project Description *
                </label>
                <textarea
                  id="create-project-description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe the project objectives and scope..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Project description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="create-project-department">
                    Department / Team *
                  </label>
                  <select
                    id="create-project-department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Department or team"
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Analytics">Analytics</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="create-project-manager">
                    Project Manager *
                  </label>
                  <select
                    id="create-project-manager"
                    value={projectManager}
                    onChange={(e) => setProjectManager(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Project manager"
                  >
                    <option value="">Select Manager</option>
                    <option value="John Doe">John Doe</option>
                    <option value="Sarah Johnson">Sarah Johnson</option>
                    <option value="Michael Chen">Michael Chen</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="create-project-start-date">
                    Start Date *
                  </label>
                  <input
                    id="create-project-start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Start date"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="create-project-end-date">
                    End Date *
                  </label>
                  <input
                    id="create-project-end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="End date"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Skill Requirements */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Required Skills</h3>
                  <p className="text-sm text-gray-600">
                    Define the skills needed for this project
                  </p>
                </div>
                <button
                  onClick={addSkillRequirement}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Skill
                </button>
              </div>

              {skillRequirements.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-gray-600 mb-4">No skill requirements added yet</p>
                  <button
                    onClick={addSkillRequirement}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Add your first skill requirement
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {skillRequirements.map((req, index) => {
                    const category = skillCategories.find(c => c.name === req.category);
                    const subcategory = category?.subcategories.find(s => s.name === req.subcategory);

                    return (
                      <div key={req.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-medium text-gray-900">Skill Requirement #{index + 1}</span>
                          <button
                            onClick={() => removeSkillRequirement(req.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Remove skill requirement"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor={`req-category-${req.id}`}>
                              Category *
                            </label>
                            <select
                              id={`req-category-${req.id}`}
                              value={req.category}
                              onChange={(e) => updateSkillRequirement(req.id, "category", e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              aria-label="Skill category"
                            >
                              <option value="">Select</option>
                              {skillCategories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor={`req-subcategory-${req.id}`}>
                              Subcategory *
                            </label>
                            <select
                              id={`req-subcategory-${req.id}`}
                              value={req.subcategory}
                              onChange={(e) => updateSkillRequirement(req.id, "subcategory", e.target.value)}
                              disabled={!req.category}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                              aria-label="Skill subcategory"
                            >
                              <option value="">Select</option>
                              {category?.subcategories.map(sub => (
                                <option key={sub.id} value={sub.name}>{sub.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor={`req-skill-${req.id}`}>
                              Skill Name *
                            </label>
                            <select
                              id={`req-skill-${req.id}`}
                              value={req.skillName}
                              onChange={(e) => updateSkillRequirement(req.id, "skillName", e.target.value)}
                              disabled={!req.subcategory}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                              aria-label="Skill name"
                            >
                              <option value="">Select</option>
                              {subcategory?.skills.map(skill => (
                                <option key={skill} value={skill}>{skill}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor={`req-level-${req.id}`}>
                              Proficiency Level *
                            </label>
                            <select
                              id={`req-level-${req.id}`}
                              value={req.proficiencyLevel}
                              onChange={(e) => updateSkillRequirement(req.id, "proficiencyLevel", e.target.value as ProficiencyLevel)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              aria-label="Proficiency level"
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                              <option value="Expert">Expert</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor={`req-priority-${req.id}`}>
                              Priority *
                            </label>
                            <select
                              id={`req-priority-${req.id}`}
                              value={req.priority}
                              onChange={(e) => updateSkillRequirement(req.id, "priority", e.target.value as SkillRequirement["priority"])}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              aria-label="Priority"
                            >
                              <option value="High">High</option>
                              <option value="Medium">Medium</option>
                              <option value="Low">Low</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor={`req-count-${req.id}`}>
                              Resources Needed *
                            </label>
                            <input
                              id={`req-count-${req.id}`}
                              type="number"
                              min={1}
                              value={req.count}
                              onChange={(e) => updateSkillRequirement(req.id, "count", Math.max(1, parseInt(e.target.value, 10) || 1))}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              aria-label="Resources needed"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {currentStep === 2 && (
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}
            
            {currentStep === 1 ? (
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!projectName || !department || !startDate || !endDate}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Add Skills
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={skillRequirements.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {initialProject ? "Save Changes" : "Create Project & Find Matches"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
