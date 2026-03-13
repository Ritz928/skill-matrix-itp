namespace SkillMatrix.Application.Outbox;

public interface IOutboxPublisher
{
    Task EnqueueAsync(string eventType, object payload, DateTime occurredAtUtc, CancellationToken cancellationToken = default);
}

