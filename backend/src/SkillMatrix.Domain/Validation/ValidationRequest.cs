using SkillMatrix.Domain.Proficiency;

namespace SkillMatrix.Domain.Validation;

public class ValidationRequest
{
    public long Id { get; set; }

    public long EmployeeSkillId { get; set; }

    public string RequestedByEmployeeId { get; set; } = "";

    public ProficiencyCode RequestedProficiencyCode { get; set; }

    public ValidationRequestStatus Status { get; set; } = ValidationRequestStatus.Submitted;

    public DateTime SubmittedAtUtc { get; set; }

    public DateTime? DecidedAtUtc { get; set; }

    public DateTime CreatedAtUtc { get; set; }

    public DateTime UpdatedAtUtc { get; set; }
}

