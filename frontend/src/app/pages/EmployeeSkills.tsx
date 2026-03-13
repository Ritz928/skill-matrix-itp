import { useState } from "react";
import { Breadcrumb } from "../components/Breadcrumb";
import { SkillBadge } from "../components/SkillBadge";
import { ValidationStatusBadge } from "../components/ValidationStatusBadge";
import { AddSkillModal } from "../components/AddSkillModal";
import { ConfirmModal } from "../components/ConfirmModal";
import { Plus, FileText, Calendar, Award, Paperclip, ThumbsUp, Pencil, Trash2 } from "lucide-react";
import { useDataStore } from "../store/dataStore";
import { useAuthStore } from "../store/authStore";
import type { Skill } from "../data/mockData";
import React from "react";

export function EmployeeSkills() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);

  const user = useAuthStore((s) => s.user);
  const teamMembers = useDataStore((s) => s.teamMembers);
  const addSkill = useDataStore((s) => s.addSkill);
  const updateSkill = useDataStore((s) => s.updateSkill);
  const deleteSkill = useDataStore((s) => s.deleteSkill);
  const addValidationRequest = useDataStore((s) => s.addValidationRequest);

  const mySkills = user ? (teamMembers.find((m) => m.id === user.id)?.skills ?? []) : [];

  const openAddModal = () => {
    setEditingSkill(null);
    setIsModalOpen(true);
  };

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
  };

  const handleDeleteSkillClick = (skill: Skill) => {
    if (!user) return;
    setSkillToDelete(skill);
  };

  const handleConfirmDeleteSkill = () => {
    if (!user || !skillToDelete) return;
    deleteSkill(user.id, skillToDelete.id);
    setSkillToDelete(null);
  };

  const handleSubmitForValidation = (skill: Skill) => {
    if (!user) return;
    updateSkill(user.id, skill.id, { validationStatus: "Pending validation" });
    addValidationRequest({
      employeeId: user.id,
      employeeName: user.name,
      skill: { ...skill, validationStatus: "Pending validation" },
      requestedProficiency: skill.proficiencyLevel ?? "Beginner",
      submittedDate: new Date().toISOString().slice(0, 10),
      evidence: skill.certifications ?? []
    });
  };

  const handleSaveSkill = (savedSkill: Skill | undefined, requestValidation?: boolean) => {
    if (!user || !savedSkill) return;
    if (requestValidation) {
      addValidationRequest({
        employeeId: user.id,
        employeeName: user.name,
        skill: { ...savedSkill, validationStatus: "Pending validation" },
        requestedProficiency: savedSkill.proficiencyLevel ?? "Beginner",
        submittedDate: new Date().toISOString().slice(0, 10),
        evidence: savedSkill.certifications ?? []
      });
    }
  };

  if (!user) return null;

  return (
    <div className="p-8">
      <Breadcrumb items={["Skill Matrix", "Employee Skills"]} />

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
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Skill
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600">Total Skills</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{mySkills.length}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <ThumbsUp className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Validated</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {mySkills.filter((s) => s.validationStatus === "Validated").length}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {mySkills.filter((s) => s.validationStatus === "Pending validation").length}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-gray-600">Endorsements</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {mySkills.reduce((sum, skill) => sum + (skill.endorsements || 0), 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mySkills.map((skill) => (
          <div key={skill.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
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

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Proficiency Level</p>
              {skill.proficiencyLevel && <SkillBadge level={skill.proficiencyLevel} />}
            </div>

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

            {skill.endorsements && skill.endorsements > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ThumbsUp className="w-4 h-4 text-green-600" />
                <span>{skill.endorsements} endorsements</span>
              </div>
            )}

            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => openEditModal(skill)}
                className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
              <button className="text-sm font-medium text-gray-600 hover:text-gray-700">
                Upload Evidence
              </button>
              {skill.validationStatus === "Self-assessed" && (
                <button
                  onClick={() => handleSubmitForValidation(skill)}
                  className="flex items-center gap-1.5 text-sm font-medium text-green-600 hover:text-green-700"
                >
                  Submit for Validation
                </button>
              )}
              <button
                onClick={() => handleDeleteSkillClick(skill)}
                className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 ml-auto"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <AddSkillModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialSkill={editingSkill}
        employeeId={user.id}
        onSave={handleSaveSkill}
      />

      <ConfirmModal
        isOpen={skillToDelete !== null}
        onClose={() => setSkillToDelete(null)}
        title="Delete skill?"
        message={
          skillToDelete
            ? `Delete skill "${skillToDelete.name}"? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        onConfirm={handleConfirmDeleteSkill}
        variant="danger"
      />
    </div>
  );
}
