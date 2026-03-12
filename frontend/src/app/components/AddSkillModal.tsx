import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import type { Skill, ProficiencyLevel } from "../data/mockData";
import { useDataStore } from "../store/dataStore";
import React from "react";

const PROFICIENCY_LEVELS: ProficiencyLevel[] = ["Beginner", "Intermediate", "Advanced", "Expert"];

type AddSkillModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialSkill?: Skill | null;
};

function getCategoryIdByName(skillCategories: ReturnType<typeof useDataStore.getState>["skillCategories"], name: string): string {
  const cat = skillCategories.find(c => c.name === name);
  return cat?.id ?? "";
}

function getSubcategoryIdByName(
  skillCategories: ReturnType<typeof useDataStore.getState>["skillCategories"],
  categoryName: string,
  subcategoryName: string
): string {
  const cat = skillCategories.find(c => c.name === categoryName);
  const sub = cat?.subcategories.find(s => s.name === subcategoryName);
  return sub?.id ?? "";
}

export function AddSkillModal({ isOpen, onClose, initialSkill }: AddSkillModalProps) {
  const skillCategories = useDataStore(s => s.skillCategories);
  const addSkill = useDataStore(s => s.addSkill);
  const updateSkill = useDataStore(s => s.updateSkill);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [proficiencyLevel, setProficiencyLevel] = useState<ProficiencyLevel>("Beginner");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [lastUsed, setLastUsed] = useState("");
  const [projectTagsInput, setProjectTagsInput] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    if (initialSkill) {
      setSelectedCategory(getCategoryIdByName(skillCategories, initialSkill.category));
      setSelectedSubcategory(getSubcategoryIdByName(skillCategories, initialSkill.category, initialSkill.subcategory));
      setSelectedSkill(initialSkill.name);
      setProficiencyLevel(initialSkill.proficiencyLevel ?? "Beginner");
      setYearsOfExperience(String(initialSkill.yearsOfExperience ?? ""));
      setLastUsed(initialSkill.lastUsed ?? "");
      setProjectTagsInput((initialSkill.projectTags ?? []).join(", "));
    } else {
      setSelectedCategory("");
      setSelectedSubcategory("");
      setSelectedSkill("");
      setProficiencyLevel("Beginner");
      setYearsOfExperience("");
      setLastUsed("");
      setProjectTagsInput("");
    }
  }, [isOpen, initialSkill, skillCategories]);

  if (!isOpen) return null;

  const category = skillCategories.find(c => c.id === selectedCategory);
  const subcategory = category?.subcategories.find(s => s.id === selectedSubcategory);

  const handleSubmit = () => {
    if (!selectedSkill || !category || !subcategory) return;
    const projectTags = projectTagsInput
      ? projectTagsInput.split(",").map(s => s.trim()).filter(Boolean)
      : [];
    const skillPayload = {
      name: selectedSkill,
      category: category.name,
      subcategory: subcategory.name,
      description: "",
      proficiencyLevel,
      validationStatus: initialSkill?.validationStatus ?? ("Self-assessed" as const),
      lastUpdated: new Date().toISOString().slice(0, 10),
      yearsOfExperience: yearsOfExperience ? Number(yearsOfExperience) : undefined,
      lastUsed: lastUsed || undefined,
      certifications: [],
      projectTags,
      endorsements: initialSkill?.endorsements
    };

    if (initialSkill) {
      updateSkill(initialSkill.id, skillPayload);
    } else {
      addSkill({ ...skillPayload, validationStatus: "Pending validation" });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialSkill ? "Edit Skill" : "Add New Skill"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            type="button"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="add-skill-category">
              Skill Category *
            </label>
            <select
              id="add-skill-category"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory("");
                setSelectedSkill("");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Skill category"
            >
              <option value="">Select a category</option>
              {skillCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {selectedCategory && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="add-skill-subcategory">
                Skill Subcategory *
              </label>
              <select
                id="add-skill-subcategory"
                value={selectedSubcategory}
                onChange={(e) => {
                  setSelectedSubcategory(e.target.value);
                  setSelectedSkill("");
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Skill subcategory"
              >
                <option value="">Select a subcategory</option>
                {category?.subcategories.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
          )}

          {selectedSubcategory && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="add-skill-name">
                Skill Name *
              </label>
              <select
                id="add-skill-name"
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Skill name"
              >
                <option value="">Select a skill</option>
                {subcategory?.skills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proficiency Level *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {PROFICIENCY_LEVELS.map(level => (
                <button
                  key={level}
                  onClick={() => setProficiencyLevel(level)}
                  className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    proficiencyLevel === level
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="add-skill-years">
                Years of Experience
              </label>
              <input
                id="add-skill-years"
                type="number"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
                placeholder="e.g., 3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Years of experience"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="add-skill-last-used">
                Last Used Date
              </label>
              <input
                id="add-skill-last-used"
                type="date"
                value={lastUsed}
                onChange={(e) => setLastUsed(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Last used date"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certification Upload
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF, JPG, PNG up to 10MB
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="add-skill-project-tags">
              Project Experience Tags
            </label>
            <input
              id="add-skill-project-tags"
              type="text"
              value={projectTagsInput}
              onChange={(e) => setProjectTagsInput(e.target.value)}
              placeholder="e.g., Customer Portal, Cloud Migration"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Project experience tags"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple projects with commas
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedSkill || !selectedCategory || !selectedSubcategory}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {initialSkill ? "Save Changes" : "Submit for Validation"}
          </button>
        </div>
      </div>
    </div>
  );
}
