using Microsoft.Extensions.Logging;
using MySqlConnector;

namespace SkillMatrix.Infrastructure.Persistence.Migrations;

public sealed class SkillMatrixMigrationRunner(ILogger<SkillMatrixMigrationRunner> logger)
{
    public async Task ApplyPendingAsync(string connectionString, CancellationToken cancellationToken = default)
    {
        await using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync(cancellationToken);

        await EnsureMigrationsTableAsync(connection, cancellationToken);

        var migrationDirectory = Path.Combine(AppContext.BaseDirectory, "Persistence", "Migrations");
        if (!Directory.Exists(migrationDirectory))
        {
            logger.LogWarning("Migration directory not found at {MigrationDirectory}. Skipping.", migrationDirectory);
            return;
        }

        var migrationFiles = Directory.GetFiles(migrationDirectory, "*.sql")
            .OrderBy(f => Path.GetFileName(f), StringComparer.OrdinalIgnoreCase)
            .ToList();

        foreach (var file in migrationFiles)
        {
            var id = Path.GetFileName(file);
            if (await IsAppliedAsync(connection, id, cancellationToken))
            {
                continue;
            }

            logger.LogInformation("Applying SkillMatrix migration {MigrationId}", id);

            var sql = await File.ReadAllTextAsync(file, cancellationToken);

            await using var tx = await connection.BeginTransactionAsync(cancellationToken);
            try
            {
                await ExecuteSqlScriptAsync(connection, tx, sql, cancellationToken);

                await MarkAppliedAsync(connection, id, cancellationToken);
                await tx.CommitAsync(cancellationToken);
            }
            catch (Exception ex)
            {
                await tx.RollbackAsync(cancellationToken);
                logger.LogError(ex, "Failed applying migration {MigrationId}", id);
                throw;
            }
        }
    }

    private static async Task EnsureMigrationsTableAsync(MySqlConnection connection, CancellationToken cancellationToken)
    {
        const string sql = """
        CREATE TABLE IF NOT EXISTS `__skillmatrix_migrations` (
          `id` VARCHAR(128) NOT NULL,
          `applied_at_utc` DATETIME(6) NOT NULL,
          PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """;

        await using var cmd = new MySqlCommand(sql, connection);
        await cmd.ExecuteNonQueryAsync(cancellationToken);
    }

    private static async Task<bool> IsAppliedAsync(MySqlConnection connection, string id, CancellationToken cancellationToken)
    {
        const string sql = "SELECT 1 FROM `__skillmatrix_migrations` WHERE `id` = @id LIMIT 1;";
        await using var cmd = new MySqlCommand(sql, connection);
        cmd.Parameters.AddWithValue("@id", id);
        var result = await cmd.ExecuteScalarAsync(cancellationToken);
        return result != null;
    }

    private static async Task MarkAppliedAsync(MySqlConnection connection, string id, CancellationToken cancellationToken)
    {
        const string sql = "INSERT INTO `__skillmatrix_migrations` (`id`, `applied_at_utc`) VALUES (@id, @appliedAtUtc);";
        await using var cmd = new MySqlCommand(sql, connection);
        cmd.Parameters.AddWithValue("@id", id);
        cmd.Parameters.AddWithValue("@appliedAtUtc", DateTime.UtcNow);
        await cmd.ExecuteNonQueryAsync(cancellationToken);
    }

    private static async Task ExecuteSqlScriptAsync(
        MySqlConnection connection,
        MySqlTransaction tx,
        string sql,
        CancellationToken cancellationToken)
    {
        var statements = sql
            .Split(';', StringSplitOptions.RemoveEmptyEntries)
            .Select(s => s.Trim())
            .Where(s => !string.IsNullOrWhiteSpace(s))
            .Where(s => !s.StartsWith("--", StringComparison.Ordinal));

        foreach (var statement in statements)
        {
            await using var cmd = new MySqlCommand(statement, connection, tx);
            await cmd.ExecuteNonQueryAsync(cancellationToken);
        }
    }
}

