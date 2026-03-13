using SkillMatrix.Domain.Evidence;
using SkillMatrix.Domain.Proficiency;
using SkillMatrix.Domain.Validation;

namespace SkillMatrix.Domain.Employees;

public class EmployeeSkill
{
    public long Id { get; set; }

    public string EmployeeId { get; set; } = "";

    public long SkillId { get; set; }

    public ProficiencyCode ActiveProficiencyCode { get; set; }

    public ValidationStatus ValidationStatus { get; set; } = ValidationStatus.SelfAssessed;

    public DateTime? LastValidatedAtUtc { get; set; }

    public DateTime? ValidationExpiresAtUtc { get; set; }

    public DateTime CreatedAtUtc { get; set; }

    public DateTime UpdatedAtUtc { get; set; }

    public List<EvidenceItem> Evidence { get; set; } = [];
}

