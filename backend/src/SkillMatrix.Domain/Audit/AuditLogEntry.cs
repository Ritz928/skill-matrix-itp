namespace SkillMatrix.Domain.Audit;

public class AuditLogEntry
{
    public long Id { get; set; }

    public string ActorEmployeeId { get; set; } = "";

    public string Action { get; set; } = "";

    public string? ScopeType { get; set; }

    public string? ScopeId { get; set; }

    public string? DetailsJson { get; set; }

    public DateTime CreatedAtUtc { get; set; }
}

