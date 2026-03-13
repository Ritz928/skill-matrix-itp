import { useState } from "react";
import { X } from "lucide-react";

interface CategoryEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  type: "category" | "subcategory" | "skill";
  initialData?: {
    name?: string;
    description?: string;
    parentCategory?: string;
  };
  onSubmit: (data: { name: string; description?: string; parentCategory?: string }) => void;
}

export function CategoryEditorModal({ 
  isOpen, 
  onClose, 
  mode, 
  type,
  initialData,
  onSubmit 
}: CategoryEditorModalProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [parentCategory, setParentCategory] = useState(initialData?.parentCategory || "");

  const handleSubmit = () => {
    onSubmit({ name, description, parentCategory });
    onClose();
  };

  if (!isOpen) return null;

  const getTitle = () => {
    const action = mode === "create" ? "Create" : "Edit";
    return `${action} ${type.charAt(0).toUpperCase() + type.slice(1)}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {type === "subcategory" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="category-editor-parent">
                Parent Category *
              </label>
              <select
                id="category-editor-parent"
                value={parentCategory}
                onChange={(e) => setParentCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Parent category"
              >
                <option value="">Select a category</option>
                <option value="Development">Development</option>
                <option value="Cloud">Cloud</option>
                <option value="Data">Data</option>
                <option value="Design">Design</option>
                <option value="Management">Management</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {type === "skill" ? "Skill Name" : "Name"} *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`Enter ${type} name`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`Enter ${type} description`}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {type === "skill" && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Once created, this skill will be immediately available 
                in the Employee Skill Profile add skill form.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mode === "create" ? "Create" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
