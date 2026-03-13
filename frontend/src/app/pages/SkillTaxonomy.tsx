import React, { useState } from "react";
import { Breadcrumb } from "../components/Breadcrumb";
import { CategoryEditorModal } from "../components/CategoryEditorModal";
import { ChevronRight, ChevronDown, Plus, Edit2, Archive, Search, FolderTree, AlertCircle } from "lucide-react";
import { useDataStore } from "../store/dataStore";

type CategoryEditorSubmitData = {
  name?: string;
  description?: string;
  parentCategory?: string;
  parentSubcategory?: string;
};

type SelectedTaxonomyItem = (CategoryEditorSubmitData & {
  id?: string;
  subcategories?: Array<{ id: string; name: string; skills: string[] }>;
  skills?: string[];
}) | null;

export function SkillTaxonomy() {
  const skillCategories = useDataStore(s => s.skillCategories);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["dev"]);
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>(["frontend"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [modalType, setModalType] = useState<"category" | "subcategory" | "skill">("category");
  const [selectedItem, setSelectedItem] = useState<SelectedTaxonomyItem>(null);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleSubcategory = (subcategoryId: string) => {
    setExpandedSubcategories(prev =>
      prev.includes(subcategoryId)
        ? prev.filter(id => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  const openModal = (mode: "create" | "edit", type: "category" | "subcategory" | "skill", item?: SelectedTaxonomyItem) => {
    setModalMode(mode);
    setModalType(type);
    setSelectedItem(item ?? null);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: CategoryEditorSubmitData) => {
    console.log("Submitted:", { mode: modalMode, type: modalType, data });
    // Here you would normally save to backend
  };

  return (
    <div className="p-8">
      <Breadcrumb items={["Skill Matrix", "Skill Taxonomy"]} />

      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Skill Taxonomy Management
          </h1>
          <p className="text-gray-600">
            Manage the organizational skill hierarchy and definitions
          </p>
        </div>
        <button 
          onClick={() => openModal("create", "category")}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> All changes to the skill taxonomy are immediately reflected in the 
            Employee Skill Profile add skill form. New skills, categories, and subcategories become 
            instantly available for employee selection.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Categories</p>
          <p className="text-3xl font-semibold text-gray-900">{skillCategories.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Subcategories</p>
          <p className="text-3xl font-semibold text-gray-900">
            {skillCategories.reduce((sum, cat) => sum + cat.subcategories.length, 0)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Skills</p>
          <p className="text-3xl font-semibold text-gray-900">
            {skillCategories.reduce((sum, cat) =>
              sum + cat.subcategories.reduce((subSum, sub) => subSum + sub.skills.length, 0), 0
            )}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Archived Skills</p>
          <p className="text-3xl font-semibold text-gray-900">8</p>
        </div>
      </div>

      {/* Main Layout: Tree View + Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Taxonomy Tree Structure */}
        <div className="lg:col-span-2">
          {/* Search and Actions */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Search skills"
              />
            </div>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" type="button">
              Export Taxonomy
            </button>
          </div>

          {/* Taxonomy Tree */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-gray-700" />
                <h3 className="font-semibold text-gray-900">Skill Hierarchy</h3>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {skillCategories.map((category) => (
                <div key={category.id}>
                  {/* Category Level */}
                  <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="flex items-center gap-3 flex-1"
                    >
                      {expandedCategories.includes(category.id) ? (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      )}
                      <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-medium">
                        {category.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">{category.name}</p>
                        <p className="text-sm text-gray-600">
                          {category.subcategories.length} subcategories
                        </p>
                      </div>
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal("edit", "category", category)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        aria-label="Edit category"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openModal("create", "subcategory", { parentCategory: category.name })}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="Add subcategory"
                        aria-label="Add subcategory"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subcategories */}
                  {expandedCategories.includes(category.id) && (
                    <div className="bg-gray-50">
                      {category.subcategories.map((subcategory) => (
                        <div key={subcategory.id}>
                          {/* Subcategory Level */}
                          <div className="flex items-center justify-between p-4 pl-16 hover:bg-gray-100">
                            <button
                              onClick={() => toggleSubcategory(subcategory.id)}
                              className="flex items-center gap-3 flex-1"
                            >
                              {expandedSubcategories.includes(subcategory.id) ? (
                                <ChevronDown className="w-4 h-4 text-gray-600" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-600" />
                              )}
                              <div className="text-left">
                                <p className="font-medium text-gray-900">{subcategory.name}</p>
                                <p className="text-sm text-gray-600">
                                  {subcategory.skills.length} skills
                                </p>
                              </div>
                            </button>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openModal("edit", "subcategory", subcategory)}
                                className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg"
                                aria-label="Edit subcategory"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openModal("create", "skill", {
                                  parentCategory: category.name,
                                  parentSubcategory: subcategory.name
                                })}
                                className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg"
                                title="Add skill"
                                aria-label="Add skill"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Skills */}
                          {expandedSubcategories.includes(subcategory.id) && (
                            <div className="bg-white border-l-2 border-blue-200 ml-16">
                              {subcategory.skills.map((skill, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-4 pl-8 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{skill}</p>
                                      <p className="text-xs text-gray-500">
                                        {category.name} • {subcategory.name}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => openModal("edit", "skill", { name: skill })}
                                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                      aria-label="Edit skill"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" aria-label="Archive skill" type="button">
                                      <Archive className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Skill Details Editor */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 h-fit sticky top-8">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => openModal("create", "category")}
              className="w-full flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
            >
              <div className="p-2 bg-blue-600 rounded-lg">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Add Category</p>
                <p className="text-sm text-gray-600">Create a new skill category</p>
              </div>
            </button>

            <button
              onClick={() => openModal("create", "subcategory")}
              className="w-full flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left"
            >
              <div className="p-2 bg-purple-600 rounded-lg">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Add Subcategory</p>
                <p className="text-sm text-gray-600">Create a new subcategory</p>
              </div>
            </button>

            <button
              onClick={() => openModal("create", "skill")}
              className="w-full flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left"
            >
              <div className="p-2 bg-green-600 rounded-lg">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Add Skill</p>
                <p className="text-sm text-gray-600">Create a new skill</p>
              </div>
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Proficiency Framework</h4>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-gray-50 rounded">
                <p className="font-medium text-gray-900">Beginner</p>
                <p className="text-xs text-gray-600">Basic understanding and limited experience</p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="font-medium text-gray-900">Intermediate</p>
                <p className="text-xs text-gray-600">Can work independently</p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="font-medium text-gray-900">Advanced</p>
                <p className="text-xs text-gray-600">Strong experience and design capability</p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="font-medium text-gray-900">Expert</p>
                <p className="text-xs text-gray-600">Deep expertise and mentoring ability</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category/Subcategory/Skill Editor Modal */}
      <CategoryEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        type={modalType}
        initialData={selectedItem ?? undefined}
        onSubmit={handleSubmit}
      />
    </div>
  );
}