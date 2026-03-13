using SkillMatrix.Domain.Proficiency;

namespace SkillMatrix.Domain.Ratings;

public class SkillRating
{
    public long Id { get; set; }

    public long EmployeeSkillId { get; set; }

    public SkillRatingSource Source { get; set; }

    public ProficiencyCode ProficiencyCode { get; set; }

    public string? RaterEmployeeId { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAtUtc { get; set; }
}

