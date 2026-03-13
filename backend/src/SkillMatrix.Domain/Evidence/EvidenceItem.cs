namespace SkillMatrix.Domain.Evidence;

public class EvidenceItem
{
    public long Id { get; set; }

    public long EmployeeSkillId { get; set; }

    public EvidenceType Type { get; set; }

    public string? ExternalRef { get; set; }

    public string? FileRef { get; set; }

    /// <summary>
    /// JSON blob for evidence metadata (kept flexible for platform integrations).
    /// </summary>
    public string? MetadataJson { get; set; }

    public DateTime CreatedAtUtc { get; set; }
}

