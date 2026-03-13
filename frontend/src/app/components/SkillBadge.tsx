import { ProficiencyLevel } from "../data/mockData";

interface SkillBadgeProps {
  level: ProficiencyLevel;
  size?: "sm" | "md" | "lg";
}

export function SkillBadge({ level, size = "md" }: SkillBadgeProps) {
  const colors = {
    Beginner: "bg-gray-100 text-gray-700 border-gray-300",
    Intermediate: "bg-blue-100 text-blue-700 border-blue-300",
    Advanced: "bg-purple-100 text-purple-700 border-purple-300",
    Expert: "bg-green-100 text-green-700 border-green-300"
  };

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5"
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded border ${colors[level]} ${sizes[size]}`}
    >
      {level}
    </span>
  );
}
