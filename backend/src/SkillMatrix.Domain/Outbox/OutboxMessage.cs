namespace SkillMatrix.Domain.Outbox;

public class OutboxMessage
{
    public long Id { get; set; }

    public string EventType { get; set; } = "";

    public string PayloadJson { get; set; } = "";

    public DateTime OccurredAtUtc { get; set; }

    public DateTime CreatedAtUtc { get; set; }

    public DateTime? ProcessedAtUtc { get; set; }

    public string? ProcessingError { get; set; }
}

