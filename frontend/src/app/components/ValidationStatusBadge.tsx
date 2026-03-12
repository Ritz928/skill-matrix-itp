import { ValidationStatus } from "../data/mockData";
import { CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";

interface ValidationStatusBadgeProps {
  status: ValidationStatus;
}

export function ValidationStatusBadge({ status }: ValidationStatusBadgeProps) {
  const config = {
    "Self-assessed": {
      color: "bg-blue-100 text-blue-700 border-blue-200",
      icon: AlertCircle
    },
    "Pending validation": {
      color: "bg-amber-100 text-amber-700 border-amber-200",
      icon: Clock
    },
    Validated: {
      color: "bg-green-100 text-green-700 border-green-200",
      icon: CheckCircle
    },
    Rejected: {
      color: "bg-red-100 text-red-700 border-red-200",
      icon: XCircle
    }
  };

  const { color, icon: Icon } = config[status];

  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-medium px-2.5 py-1 rounded border ${color}`}>
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
}
