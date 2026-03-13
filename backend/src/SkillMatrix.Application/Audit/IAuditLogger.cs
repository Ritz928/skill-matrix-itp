namespace SkillMatrix.Application.Audit;

public interface IAuditLogger
{
    Task LogAsync(
        string actorEmployeeId,
        string action,
        string? scopeType,
        string? scopeId,
        object? details,
        CancellationToken cancellationToken = default);
}

