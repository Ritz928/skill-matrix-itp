export type UserRole = "Manager" | "Employee";

export type MockUser = {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  password: string;
};

/**
 * Mock users for login (no backend).
 * FK: Each user's id must match teamMembers[].id in mockData so "My Skill Profile" and Team Skills stay in sync.
 * (Same person = same id across mockUsers and teamMembers.)
 */
export const mockUsers: MockUser[] = [
  {
    id: "manager-001",
    name: "John Doe",
    role: "Manager",
    email: "john.doe@company.com",
    password: "manager123"
  },
  {
    id: "emp-001",
    name: "Sarah Johnson",
    role: "Employee",
    email: "sarah.johnson@company.com",
    password: "employee123"
  },
  {
    id: "emp-002",
    name: "Michael Chen",
    role: "Employee",
    email: "michael.chen@company.com",
    password: "employee123"
  },
  {
    id: "emp-003",
    name: "Emily Rodriguez",
    role: "Employee",
    email: "emily.rodriguez@company.com",
    password: "employee123"
  },
  {
    id: "emp-004",
    name: "David Kim",
    role: "Employee",
    email: "david.kim@company.com",
    password: "employee123"
  },
  {
    id: "emp-005",
    name: "Anna Williams",
    role: "Employee",
    email: "anna.williams@company.com",
    password: "employee123"
  },
  {
    id: "emp-006",
    name: "James Wilson",
    role: "Employee",
    email: "james.wilson@company.com",
    password: "employee123"
  },
  {
    id: "emp-007",
    name: "Maria Garcia",
    role: "Employee",
    email: "maria.garcia@company.com",
    password: "employee123"
  },
  {
    id: "emp-008",
    name: "Robert Brown",
    role: "Employee",
    email: "robert.brown@company.com",
    password: "employee123"
  },
  {
    id: "emp-009",
    name: "Lisa Anderson",
    role: "Employee",
    email: "lisa.anderson@company.com",
    password: "employee123"
  },
  {
    id: "emp-010",
    name: "Chris Taylor",
    role: "Employee",
    email: "chris.taylor@company.com",
    password: "employee123"
  }
];
