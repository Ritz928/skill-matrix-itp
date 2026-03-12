import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  items: string[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
          <span
            className={
              index === items.length - 1
                ? "text-gray-900 font-medium"
                : "text-gray-500"
            }
          >
            {item}
          </span>
        </div>
      ))}
    </nav>
  );
}
