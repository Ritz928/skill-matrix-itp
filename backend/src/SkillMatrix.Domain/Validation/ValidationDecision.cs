using SkillMatrix.Domain.Proficiency;

namespace SkillMatrix.Domain.Validation;

public class ValidationDecision
{
    public long Id { get; set; }

    public long ValidationRequestId { get; set; }

    public string DeciderEmployeeId { get; set; } = "";

    public ValidationDecisionType Decision { get; set; }

    public ProficiencyCode? FinalProficiencyCode { get; set; }

    public string? Feedback { get; set; }

    public DateTime CreatedAtUtc { get; set; }
}

