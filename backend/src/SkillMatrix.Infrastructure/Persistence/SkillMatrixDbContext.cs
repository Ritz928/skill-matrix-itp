using Microsoft.EntityFrameworkCore;
using SkillMatrix.Application.Persistence;
using SkillMatrix.Domain.Audit;
using SkillMatrix.Domain.Employees;
using SkillMatrix.Domain.Evidence;
using SkillMatrix.Domain.Outbox;
using SkillMatrix.Domain.Proficiency;
using SkillMatrix.Domain.Ratings;
using SkillMatrix.Domain.Taxonomy;
using SkillMatrix.Domain.Validation;

namespace SkillMatrix.Infrastructure.Persistence;

public sealed class SkillMatrixDbContext(DbContextOptions<SkillMatrixDbContext> options) : DbContext(options), ISkillMatrixDbContext
{
    public DbSet<SkillCategory> SkillCategories => Set<SkillCategory>();
    public DbSet<SkillSubcategory> SkillSubcategories => Set<SkillSubcategory>();
    public DbSet<SkillDefinition> Skills => Set<SkillDefinition>();
    public DbSet<ProficiencyLevel> ProficiencyLevels => Set<ProficiencyLevel>();

    public DbSet<EmployeeSkill> EmployeeSkills => Set<EmployeeSkill>();
    public DbSet<EvidenceItem> EvidenceItems => Set<EvidenceItem>();
    public DbSet<SkillRating> SkillRatings => Set<SkillRating>();

    public DbSet<ValidationRequest> ValidationRequests => Set<ValidationRequest>();
    public DbSet<ValidationDecision> ValidationDecisions => Set<ValidationDecision>();

    public DbSet<AuditLogEntry> AuditLogEntries => Set<AuditLogEntry>();
    public DbSet<OutboxMessage> OutboxMessages => Set<OutboxMessage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(SkillMatrixDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}

