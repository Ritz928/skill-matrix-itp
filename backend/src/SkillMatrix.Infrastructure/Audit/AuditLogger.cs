using System.Text.Json;
using SkillMatrix.Application.Audit;
using SkillMatrix.Application.Persistence;
using SkillMatrix.Domain.Audit;

namespace SkillMatrix.Infrastructure.Audit;

public sealed class AuditLogger(ISkillMatrixDbContext db) : IAuditLogger
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task LogAsync(
        string actorEmployeeId,
        string action,
        string? scopeType,
        string? scopeId,
        object? details,
        CancellationToken cancellationToken = default)
    {
        var entry = new AuditLogEntry
        {
            ActorEmployeeId = actorEmployeeId,
            Action = action,
            ScopeType = scopeType,
            ScopeId = scopeId,
            DetailsJson = details == null ? null : JsonSerializer.Serialize(details, JsonOptions),
            CreatedAtUtc = DateTime.UtcNow,
        };

        db.AuditLogEntries.Add(entry);
        await db.SaveChangesAsync(cancellationToken);
    }
}

