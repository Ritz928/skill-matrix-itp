using System.Text.Json;
using SkillMatrix.Application.Outbox;
using SkillMatrix.Application.Persistence;
using SkillMatrix.Domain.Outbox;

namespace SkillMatrix.Infrastructure.Outbox;

public sealed class OutboxPublisher(ISkillMatrixDbContext db) : IOutboxPublisher
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task EnqueueAsync(string eventType, object payload, DateTime occurredAtUtc, CancellationToken cancellationToken = default)
    {
        var message = new OutboxMessage
        {
            EventType = eventType,
            PayloadJson = JsonSerializer.Serialize(payload, JsonOptions),
            OccurredAtUtc = occurredAtUtc,
            CreatedAtUtc = DateTime.UtcNow,
        };

        db.OutboxMessages.Add(message);
        await db.SaveChangesAsync(cancellationToken);
    }
}

