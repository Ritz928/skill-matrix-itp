using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SkillMatrix.Infrastructure.Persistence;

namespace SkillMatrix.Infrastructure.Outbox;

public sealed class OutboxDispatcher(
    IServiceScopeFactory scopeFactory,
    ILogger<OutboxDispatcher> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await DispatchBatchAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Outbox dispatch loop failed");
            }

            await Task.Delay(TimeSpan.FromSeconds(3), stoppingToken);
        }
    }

    private async Task DispatchBatchAsync(CancellationToken cancellationToken)
    {
        await using var scope = scopeFactory.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<SkillMatrixDbContext>();

        var pending = await db.OutboxMessages
            .Where(m => m.ProcessedAtUtc == null)
            .OrderBy(m => m.Id)
            .Take(50)
            .ToListAsync(cancellationToken);

        if (pending.Count == 0) return;

        foreach (var message in pending)
        {
            try
            {
                // TODO: integrate with ITP event bus.
                logger.LogInformation("Outbox publish {EventType} (id={OutboxId})", message.EventType, message.Id);
                message.ProcessedAtUtc = DateTime.UtcNow;
                message.ProcessingError = null;
            }
            catch (Exception ex)
            {
                message.ProcessingError = ex.ToString();
            }
        }

        await db.SaveChangesAsync(cancellationToken);
    }
}

