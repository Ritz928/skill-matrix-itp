import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmployeeSkills } from "../../src/app/pages/EmployeeSkills";
import { useAuthStore } from "../../src/app/store/authStore";
import { useDataStore } from "../../src/app/store/dataStore";
import type { Skill } from "../../src/app/data/mockData";

vi.mock("../../src/app/store/authStore", () => ({ useAuthStore: vi.fn() }));
vi.mock("../../src/app/store/dataStore", () => ({ useDataStore: vi.fn() }));

const mockUser = { id: "user-1", name: "Jane Doe", role: "Employee" as const };

const createMockSkill = (overrides: Partial<Skill> = {}): Skill => ({
  id: "skill-1",
  name: "React",
  category: "Frontend",
  subcategory: "JavaScript",
  description: "React framework",
  proficiencyLevel: "Intermediate",
  validationStatus: "Self-assessed",
  yearsOfExperience: 3,
  lastUsed: "2024",
  ...overrides,
});

const mockSkillCategories = [
  {
    id: "dev",
    name: "Development",
    subcategories: [
      { id: "frontend", name: "Frontend", skills: ["React", "TypeScript"] },
    ],
  },
];

function createMockDataStore(options: {
  user: typeof mockUser | null;
  skills?: Skill[];
  addSkill?: ReturnType<typeof vi.fn>;
  updateSkill?: ReturnType<typeof vi.fn>;
  deleteSkill?: ReturnType<typeof vi.fn>;
  addValidationRequest?: ReturnType<typeof vi.fn>;
}) {
  const {
    user,
    skills = [],
    addSkill = vi.fn(),
    updateSkill = vi.fn(),
    deleteSkill = vi.fn(),
    addValidationRequest = vi.fn(),
  } = options;
  const teamMembers = user
    ? [{ id: user.id, name: user.name, role: user.role, department: "Engineering", skills }]
    : [];
  return (selector: (s: unknown) => unknown) =>
    selector({
      teamMembers,
      skillCategories: mockSkillCategories,
      addSkill,
      updateSkill,
      deleteSkill,
      addValidationRequest,
    });
}

describe("EmployeeSkills", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when user is not logged in", () => {
    vi.mocked(useAuthStore).mockReturnValue(null as never);
    vi.mocked(useDataStore).mockImplementation(
      createMockDataStore({ user: null }) as never
    );

    const { container } = render(<EmployeeSkills />);

    expect(container.firstChild).toBeNull();
  });

  it("renders breadcrumb with Skill Matrix and Employee Skills when user is logged in", () => {
    vi.mocked(useAuthStore).mockReturnValue(mockUser as never);
    vi.mocked(useDataStore).mockImplementation(
      createMockDataStore({ user: mockUser }) as never
    );

    render(<EmployeeSkills />);

    expect(screen.getByText("Skill Matrix")).toBeInTheDocument();
    expect(screen.getByText("Employee Skills")).toBeInTheDocument();
  });

  it("renders My Skill Profile heading and Add Skill button when user is logged in", () => {
    vi.mocked(useAuthStore).mockReturnValue(mockUser as never);
    vi.mocked(useDataStore).mockImplementation(
      createMockDataStore({ user: mockUser }) as never
    );

    render(<EmployeeSkills />);

    expect(
      screen.getByRole("heading", { name: /my skill profile/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add skill/i })
    ).toBeInTheDocument();
  });

  it("renders stat cards with Total Skills, Validated, Pending, Endorsements", () => {
    vi.mocked(useAuthStore).mockReturnValue(mockUser as never);
    const skills = [
      createMockSkill({ id: "s1", validationStatus: "Validated", endorsements: 2 }),
      createMockSkill({ id: "s2", validationStatus: "Pending validation" }),
    ];
    vi.mocked(useDataStore).mockImplementation(
      createMockDataStore({ user: mockUser, skills }) as never
    );

    render(<EmployeeSkills />);

    expect(screen.getByText("Total Skills")).toBeInTheDocument();
    expect(screen.getAllByText("Validated").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("Endorsements")).toBeInTheDocument();
    expect(screen.getAllByText("2").length).toBeGreaterThanOrEqual(1); // Total skills and/or endorsements
  });

  it("displays correct counts in stat cards", () => {
    vi.mocked(useAuthStore).mockReturnValue(mockUser as never);
    const skills = [
      createMockSkill({ id: "s1", validationStatus: "Validated" }),
      createMockSkill({ id: "s2", validationStatus: "Validated" }),
      createMockSkill({ id: "s3", validationStatus: "Pending validation" }),
      createMockSkill({ id: "s4", endorsements: 5 }),
    ];
    vi.mocked(useDataStore).mockImplementation(
      createMockDataStore({ user: mockUser, skills }) as never
    );

    render(<EmployeeSkills />);

    expect(screen.getAllByText("4").length).toBeGreaterThanOrEqual(1); // Total skills count
    expect(screen.getAllByText("5").length).toBeGreaterThanOrEqual(1); // Endorsements sum
  });

  it("renders a skill card with name, category, and actions", () => {
    vi.mocked(useAuthStore).mockReturnValue(mockUser as never);
    const skills = [
      createMockSkill({
        id: "s1",
        name: "TypeScript",
        category: "Language",
        subcategory: "JavaScript",
      }),
    ];
    vi.mocked(useDataStore).mockImplementation(
      createMockDataStore({ user: mockUser, skills }) as never
    );

    render(<EmployeeSkills />);

    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Language • JavaScript")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("renders Submit for Validation only for Self-assessed skills", () => {
    vi.mocked(useAuthStore).mockReturnValue(mockUser as never);
    const skills = [
      createMockSkill({
        id: "s1",
        name: "React",
        validationStatus: "Self-assessed",
      }),
      createMockSkill({
        id: "s2",
        name: "Vue",
        validationStatus: "Validated",
      }),
    ];
    vi.mocked(useDataStore).mockImplementation(
      createMockDataStore({ user: mockUser, skills }) as never
    );

    render(<EmployeeSkills />);

    const submitButtons = screen.getAllByRole("button", {
      name: /submit for validation/i,
    });
    expect(submitButtons).toHaveLength(1);
  });

  it("opens Add Skill modal when Add Skill button is clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(useAuthStore).mockReturnValue(mockUser as never);
    vi.mocked(useDataStore).mockImplementation(
      createMockDataStore({ user: mockUser }) as never
    );

    render(<EmployeeSkills />);

    await user.click(screen.getByRole("button", { name: /add skill/i }));

    expect(screen.getByRole("heading", { name: /add new skill/i })).toBeInTheDocument();
  });

  it("calls deleteSkill when Delete is clicked and confirm is pressed", async () => {
    const user = userEvent.setup();
    const deleteSkill = vi.fn();
    vi.mocked(useAuthStore).mockReturnValue(mockUser as never);
    const skills = [createMockSkill({ id: "skill-to-delete", name: "React" })];
    vi.mocked(useDataStore).mockImplementation(
      createMockDataStore({ user: mockUser, skills, deleteSkill }) as never
    );

    render(<EmployeeSkills />);

    await user.click(screen.getByRole("button", { name: /delete/i }));
    const dialog = screen.getByRole("dialog", { name: /delete skill\?/i });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText(/delete skill "react"\?/i)).toBeInTheDocument();

    const confirmButton = within(dialog).getByRole("button", { name: /^delete$/i });
    await user.click(confirmButton);

    expect(deleteSkill).toHaveBeenCalledWith("user-1", "skill-to-delete");
  });

  it("calls updateSkill and addValidationRequest when Submit for Validation is clicked", async () => {
    const user = userEvent.setup();
    const updateSkill = vi.fn();
    const addValidationRequest = vi.fn();
    const skills = [
      createMockSkill({
        id: "s1",
        name: "React",
        validationStatus: "Self-assessed",
      }),
    ];
    vi.mocked(useAuthStore).mockReturnValue(mockUser as never);
    vi.mocked(useDataStore).mockImplementation(
      createMockDataStore({
        user: mockUser,
        skills,
        updateSkill,
        addValidationRequest,
      }) as never
    );

    render(<EmployeeSkills />);

    await user.click(
      screen.getByRole("button", { name: /submit for validation/i })
    );

    expect(updateSkill).toHaveBeenCalledWith("user-1", "s1", {
      validationStatus: "Pending validation",
    });
    expect(addValidationRequest).toHaveBeenCalled();
  });

  it("opens edit modal when Edit is clicked on a skill", async () => {
    const user = userEvent.setup();
    vi.mocked(useAuthStore).mockReturnValue(mockUser as never);
    const skills = [createMockSkill({ id: "s1", name: "React" })];
    vi.mocked(useDataStore).mockImplementation(
      createMockDataStore({ user: mockUser, skills }) as never
    );

    render(<EmployeeSkills />);

    await user.click(screen.getByRole("button", { name: /edit/i }));

    expect(screen.getByRole("heading", { name: /edit skill/i })).toBeInTheDocument();
  });

  it("renders certifications and project tags when present", () => {
    vi.mocked(useAuthStore).mockReturnValue(mockUser as never);
    const skills = [
      createMockSkill({
        name: "React",
        certifications: ["AWS Certified", "React Advanced"],
        projectTags: ["Project Alpha", "Project Beta"],
      }),
    ];
    vi.mocked(useDataStore).mockImplementation(
      createMockDataStore({ user: mockUser, skills }) as never
    );

    render(<EmployeeSkills />);

    expect(screen.getByText("Certifications")).toBeInTheDocument();
    expect(screen.getByText("AWS Certified")).toBeInTheDocument();
    expect(screen.getByText("React Advanced")).toBeInTheDocument();
    expect(screen.getByText("Project Experience")).toBeInTheDocument();
    expect(screen.getByText("Project Alpha")).toBeInTheDocument();
    expect(screen.getByText("Project Beta")).toBeInTheDocument();
  });
});
