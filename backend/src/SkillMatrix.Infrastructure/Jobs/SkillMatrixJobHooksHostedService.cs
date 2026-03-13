using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace SkillMatrix.Infrastructure.Jobs;

public sealed class SkillMatrixJobHooksHostedService(ILogger<SkillMatrixJobHooksHostedService> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Placeholder hook point for wiring export/expiry jobs into the platform scheduler.
        // For now this keeps the module ready for future job implementations without blocking MVP.
        logger.LogInformation("SkillMatrix job hooks started");

        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
        }
    }
}

